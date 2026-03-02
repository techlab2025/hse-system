<script setup lang="ts">
import type OverviewHazardChartModel from "@/features/Home/data/Model/OverviewHazardChartModel";
import { ref, onMounted, onBeforeUnmount, watch } from "vue";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const chartData = ref<any>(null);
let resizeObserver: ResizeObserver | null = null;

const props = defineProps<{
  OverviewHazardChartstate: OverviewHazardChartModel[];
  chartHeight?: string;
  chartWidth?: string;
}>();

const HazardValues = ref<number[]>([]);
const Accidentsvalues = ref<number[]>([]);
const Observationsvalues = ref<number[]>([]);
const Zonetitle = ref<string[]>([]);

const GetHazardChartData = () => {
  Zonetitle.value = props.OverviewHazardChartstate?.map((z) => z.zoneTitle) ?? [];
  HazardValues.value = props.OverviewHazardChartstate?.map((z) => z.allObservations.hazard) ?? [];
  Accidentsvalues.value = props.OverviewHazardChartstate?.map((z) => z.allObservations.accidents) ?? [];
  Observationsvalues.value = props.OverviewHazardChartstate?.map((z) => z.allObservations.observation) ?? [];
};

const extractHexColor = (cssValue: string, fallback: string): string => {
  const trimmed = cssValue.trim();
  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(trimmed)) return trimmed;
  return fallback;
};

const shadeColor = (color: string, percent: number): string => {
  if (!color.startsWith("#")) return color;
  const num = parseInt(color.replace("#", ""), 16);
  if (isNaN(num)) return color;
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
};

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const hazardColor = extractHexColor(documentStyle.getPropertyValue("--hazard-color"), "#D03737");
  const observationColor = extractHexColor(documentStyle.getPropertyValue("--observation-color"), "#8137D0");
  const incidentColor = extractHexColor(documentStyle.getPropertyValue("--incidant-color"), "#3762D0");

  return {
    labels:
      Zonetitle.value.length > 0
        ? Zonetitle.value.map((z) => z.slice(0, 6))
        : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Hazard",
        backgroundColor: hazardColor,
        data: HazardValues.value.length > 0 ? HazardValues.value : [0, 0, 0, 0, 0, 0, 0],
      },
      {
        label: "Observation",
        backgroundColor: observationColor,
        data: Observationsvalues.value.length > 0 ? Observationsvalues.value : [0, 0, 0, 0, 0, 0, 0],
      },
      {
        label: "Incident",
        backgroundColor: incidentColor,
        data: Accidentsvalues.value.length > 0 ? Accidentsvalues.value : [0, 0, 0, 0, 0, 0, 0],
      },
    ],
  };
};

const drawGroupedBarChart3D = (canvas: HTMLCanvasElement) => {
  if (!canvas || !chartData.value) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (width <= 0 || height <= 0) return;

  ctx.clearRect(0, 0, width, height);

  const labels = chartData.value.labels;
  const datasets = chartData.value.datasets;
  const numGroups = labels.length;
  const numDatasets = datasets.length;

  // ✅ scale based on height only (width is now dynamic)
  const scale = Math.min(1, width / 800);

  const paddingLeft = Math.max(30, width * 0.04);
  const paddingRight = Math.max(20, width * 0.03);
  const paddingTop = Math.max(35, height * 0.08);
  const paddingBottom = Math.max(30, height * 0.1);

  const chartHeight = height - paddingTop - paddingBottom;

  const allValues: number[] = datasets.flatMap((ds: any) =>
    ds.data.map((v: any) => (isFinite(v) && v >= 0 ? v : 0))
  );
  const maxValue = Math.max(...allValues);

  if (!isFinite(maxValue) || maxValue <= 0) {
    ctx.fillStyle = "#9ca3af";
    ctx.font = `${Math.max(11, 14 * scale)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("No data available", width / 2, height / 2);
    return;
  }

  const effectiveMax = maxValue * 1.15;

  // ✅ FIXED group width — موحد بغض النظر عن عدد الـ groups
  const GROUP_GAP = 10;
  const FIXED_GROUP_WIDTH = 90;
  const MAX_BAR_WIDTH = 65;
  const BAR_GAP_RATIO = 0.2;

  const groupWidth = FIXED_GROUP_WIDTH;
  const groupPadding = Math.max(4, groupWidth * 0.08);
  const availableForBars = groupWidth - groupPadding * 2;
  const barGap = Math.max(2, availableForBars * BAR_GAP_RATIO);
  const totalGaps = (numDatasets - 1) * barGap;
  const rawBarWidth = (availableForBars - totalGaps) / numDatasets;
  const barWidth = Math.max(4, Math.min(rawBarWidth, MAX_BAR_WIDTH));

  const depth = Math.max(6, Math.min(barWidth * 0.6, 22 * scale));
  const angle = Math.PI / 6;
  const depthX = Math.cos(angle) * depth;
  const depthY = Math.sin(angle) * depth;

  const axisFontSize = Math.max(8, Math.round(11 * scale));
  const valueFontSize = Math.max(7, Math.round(10 * scale));
  const legendFontSize = Math.max(9, Math.round(12 * scale));

  // ── Gridlines ──────────────────────────────────────────────────────────
  const gridLines = 5;
  ctx.strokeStyle = "rgba(156,163,175,0.2)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);

  for (let i = 0; i <= gridLines; i++) {
    const gridY = height - paddingBottom - (chartHeight / gridLines) * i;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, gridY);
    ctx.lineTo(width - paddingRight + depthX, gridY);
    ctx.stroke();

    const gridValue = Math.round((maxValue / gridLines) * i);
    ctx.fillStyle = "#6b7280";
    ctx.font = `${axisFontSize}px sans-serif`;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(gridValue.toString(), paddingLeft - 5, gridY);
  }
  ctx.setLineDash([]);

  // ── Bars ───────────────────────────────────────────────────────────────
  for (let gi = numGroups - 1; gi >= 0; gi--) {
    const label = labels[gi];
    const groupX = paddingLeft + gi * (groupWidth + GROUP_GAP);

    for (let di = numDatasets - 1; di >= 0; di--) {
      const dataset = datasets[di];
      const rawValue = dataset.data[gi];
      const value = isFinite(rawValue) && rawValue >= 0 ? rawValue : 0;

      const barHeight = (value / effectiveMax) * chartHeight;
      if (!isFinite(barHeight) || barHeight < 0) continue;

      const baseX = groupX + groupPadding + di * (barWidth + barGap);
      const baseY = height - paddingBottom - barHeight;
      if (!isFinite(baseX) || !isFinite(baseY)) continue;

      const baseColor = dataset.backgroundColor;
      const topColor = shadeColor(baseColor, 40);
      const leftSideColor = shadeColor(baseColor, -28);
      const rightSideColor = shadeColor(baseColor, -48);

      // Shadow
      ctx.shadowColor = "rgba(0,0,0,0.18)";
      ctx.shadowBlur = 6 * scale;
      ctx.shadowOffsetX = 2 * scale;
      ctx.shadowOffsetY = 2 * scale;

      // LEFT face
      ctx.fillStyle = leftSideColor;
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(baseX + depthX, baseY - depthY);
      ctx.lineTo(baseX + depthX, height - paddingBottom - depthY);
      ctx.lineTo(baseX, height - paddingBottom);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.08)";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // RIGHT face
      ctx.fillStyle = rightSideColor;
      ctx.beginPath();
      ctx.moveTo(baseX + barWidth, baseY);
      ctx.lineTo(baseX + barWidth + depthX, baseY - depthY);
      ctx.lineTo(baseX + barWidth + depthX, height - paddingBottom - depthY);
      ctx.lineTo(baseX + barWidth, height - paddingBottom);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.08)";
      ctx.stroke();

      // TOP face
      ctx.fillStyle = topColor;
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(baseX + depthX, baseY - depthY);
      ctx.lineTo(baseX + barWidth + depthX, baseY - depthY);
      ctx.lineTo(baseX + barWidth, baseY);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.08)";
      ctx.stroke();

      // FRONT face
      ctx.shadowColor = "transparent";
      if (barHeight > 0) {
        try {
          const gradient = ctx.createLinearGradient(baseX, baseY, baseX, height - paddingBottom);
          gradient.addColorStop(0, shadeColor(baseColor, 18));
          gradient.addColorStop(0.6, baseColor);
          gradient.addColorStop(1, shadeColor(baseColor, -12));
          ctx.fillStyle = gradient;
        } catch {
          ctx.fillStyle = baseColor;
        }
      } else {
        ctx.fillStyle = baseColor;
      }
      ctx.fillRect(baseX, baseY, barWidth, barHeight);
      ctx.strokeStyle = "rgba(0,0,0,0.12)";
      ctx.lineWidth = 0.5;
      ctx.strokeRect(baseX, baseY, barWidth, barHeight);

      // Value label
      const minBarWidthForLabel = 16;
      const minBarHeightForLabel = 18;
      if (barHeight > minBarHeightForLabel && barWidth > minBarWidthForLabel && value > 0) {
        const displayText = value.toString();
        ctx.font = `bold ${valueFontSize}px sans-serif`;
        const tw = ctx.measureText(displayText).width;
        const tp = 2;
        const textX = baseX + barWidth / 2 + depthX / 2;
        const textY = baseY - depthY - 9;

        if (textY > paddingTop) {
          ctx.fillStyle = "rgba(255,255,255,0.9)";
          ctx.fillRect(textX - tw / 2 - tp, textY - 6, tw + tp * 2, 12);
          ctx.fillStyle = "#111827";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(displayText, textX, textY);
        }
      }
    }

    // X-axis label
    ctx.shadowColor = "transparent";
    ctx.fillStyle = "#374151";
    ctx.font = `${axisFontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const labelX = groupX + groupWidth / 2 + depthX / 2;
    ctx.fillText(label, labelX, height - paddingBottom + 6);
  }

  // ── Axes ───────────────────────────────────────────────────────────────
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "#d1d5db";
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(paddingLeft, paddingTop / 2);
  ctx.lineTo(paddingLeft, height - paddingBottom);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(paddingLeft, height - paddingBottom);
  ctx.lineTo(width - paddingRight + depthX, height - paddingBottom);
  ctx.stroke();

  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(paddingLeft, height - paddingBottom);
  ctx.lineTo(paddingLeft + depthX, height - paddingBottom - depthY);
  ctx.stroke();

  // ── Legend ─────────────────────────────────────────────────────────────
  const boxSize = Math.max(8, Math.round(13 * scale));
  const legendItemWidth = Math.max(70, Math.round(105 * scale));
  const totalLegendWidth = datasets.length * legendItemWidth;
  const legendStartX = paddingLeft + (width - paddingLeft - paddingRight - totalLegendWidth) / 2;
  const legendY = Math.max(10, paddingTop / 2 - boxSize / 2);

  datasets.forEach((dataset: any, index: number) => {
    const itemX = legendStartX + index * legendItemWidth;
    const bDepth = Math.max(2, boxSize * 0.3);
    const bAngle = Math.PI / 9;
    const bDX = Math.cos(bAngle) * bDepth;
    const bDY = Math.sin(bAngle) * bDepth;

    ctx.shadowColor = "rgba(0,0,0,0.15)";
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    // Top face
    ctx.fillStyle = shadeColor(dataset.backgroundColor, 30);
    ctx.beginPath();
    ctx.moveTo(itemX, legendY);
    ctx.lineTo(itemX + bDX, legendY - bDY);
    ctx.lineTo(itemX + boxSize + bDX, legendY - bDY);
    ctx.lineTo(itemX + boxSize, legendY);
    ctx.closePath();
    ctx.fill();

    // Front face
    ctx.fillStyle = dataset.backgroundColor;
    ctx.fillRect(itemX, legendY, boxSize, boxSize);

    ctx.shadowColor = "transparent";
    ctx.fillStyle = "#1f2937";
    ctx.font = `${legendFontSize}px sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(dataset.label, itemX + boxSize + 5, legendY + boxSize / 2);
  });
};

// ✅ resizeCanvas — يحسب العرض المطلوب ويمدد الـ canvas لو الأعمدة كتير
const resizeCanvas = () => {
  if (!canvasRef.value) return;
  const container = canvasRef.value.closest(".chart-wrapper") as HTMLElement;
  if (!container) return;

  const dpr = window.devicePixelRatio || 1;
  const containerWidth = container.offsetWidth;
  const height = container.offsetHeight;
  if (height <= 0) return;

  // ✅ احسب العرض المطلوب بناءً على عدد المجموعات
  const FIXED_GROUP_WIDTH = 90;
  const GROUP_GAP = 10;
  const numGroups = chartData.value?.labels?.length ?? 0;
  const paddingLeft = Math.max(30, containerWidth * 0.04);
  const paddingRight = Math.max(20, containerWidth * 0.03);

  const neededWidth =
    numGroups * FIXED_GROUP_WIDTH +
    (numGroups - 1) * GROUP_GAP +
    paddingLeft +
    paddingRight +
    30; // buffer

  // ✅ خد الأكبر: إما عرض الـ container أو العرض المطلوب
  const width = Math.max(containerWidth, neededWidth);

  canvasRef.value.width = width * dpr;
  canvasRef.value.height = height * dpr;
  canvasRef.value.style.width = width + "px";
  canvasRef.value.style.height = height + "px";

  const ctx = canvasRef.value.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  drawGroupedBarChart3D(canvasRef.value);
};

watch(
  () => props.OverviewHazardChartstate,
  (newVal) => {
    if (newVal) {
      GetHazardChartData();
      chartData.value = setChartData();
    }
  },
  { deep: true, immediate: true }
);

watch(chartData, () => {
  if (canvasRef.value) resizeCanvas();
});

onMounted(() => {
  if (!canvasRef.value) return;
  const container = canvasRef.value.closest(".chart-wrapper") as HTMLElement;
  if (!container) return;

  resizeObserver = new ResizeObserver(() => resizeCanvas());
  resizeObserver.observe(container);
  resizeCanvas();
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});
</script>

<template>
  <div class="total-observation-container">
    <div class="total-observation-header-container">
      <div class="total-observation-header">
        <p class="static-title">Hazard & Observation & Incident Overview</p>
      </div>
    </div>

    <!-- ✅ scroll-wrapper يحتوي الـ canvas ويعمل scroll أفقي -->
    <div class="chart-scroll-wrapper">
      <div class="chart-wrapper" :style="{ height: chartHeight ?? '35vh' }">
        <canvas ref="canvasRef"></canvas>
      </div>
    </div>
  </div>
</template>

<style scoped>
.total-observation-container {
  width: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.total-observation-header-container {
  padding: 20px 20px 0;
}

.total-observation-header {
  margin-bottom: 10px;
}

.static-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  text-transform: capitalize;
}

/* ✅ الـ wrapper الخارجي: يحجز العرض الكامل ويعمل scroll أفقي */
.chart-scroll-wrapper {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  /* Scrollbar styling — اختياري */
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
}

.chart-scroll-wrapper::-webkit-scrollbar {
  height: 4px;
}

.chart-scroll-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.chart-scroll-wrapper::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 4px;
}

/* ✅ الـ chart-wrapper: عرضه 100% دايمًا — الـ canvas هو اللي بيتمدد */
.chart-wrapper {
  width: 100%;
  height: 35vh;
  max-height: 400px;
  min-height: 250px;
  position: relative;
}

canvas {
  height: 100%;
  display: block;
  /* العرض بيتحكم فيه resizeCanvas بالـ JS — ممكن يكون أكبر من الـ wrapper فيظهر scroll */
}
</style>
