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
  // ✅ Hazard = أزرق، Observation = بنفسجي، Incident = أحمر (مطابق للديزاين)
  const hazardColor = extractHexColor(documentStyle.getPropertyValue("--hazard-color"), "#3762D0");
  const observationColor = extractHexColor(documentStyle.getPropertyValue("--observation-color"), "#8137D0");
  const incidentColor = extractHexColor(documentStyle.getPropertyValue("--incidant-color"), "#D03737");

  return {
    labels:
      Zonetitle.value.length > 0
        ? Zonetitle.value.map((z) => z)
        : ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E", "Zone F", "Zone G"],
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

  const scale = Math.min(1, width / 800);

  const paddingLeft = Math.max(40, width * 0.05);
  const paddingRight = Math.max(20, width * 0.03);
  const paddingTop = Math.max(20, height * 0.05);
  const paddingBottom = Math.max(35, height * 0.12);

  const chartAreaHeight = height - paddingTop - paddingBottom;

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

  // ✅ Round max to nearest 10 for cleaner grid (مطابق للديزاين: 10, 20, 30, 40, 50, 60, 70)
  const gridLines = Math.ceil(maxValue / 10);
  const effectiveMax = gridLines * 10 * 1.1;

  const GROUP_GAP = 12;
  const FIXED_GROUP_WIDTH = 95;
  const MAX_BAR_WIDTH = 22;
  const BAR_GAP = 4;

  const groupWidth = FIXED_GROUP_WIDTH;
  const groupPadding = Math.max(6, groupWidth * 0.08);
  const availableForBars = groupWidth - groupPadding * 2;
  const totalGaps = (numDatasets - 1) * BAR_GAP;
  const rawBarWidth = (availableForBars - totalGaps) / numDatasets;
  const barWidth = Math.max(8, Math.min(rawBarWidth, MAX_BAR_WIDTH));

  const depth = Math.max(6, Math.min(barWidth * 0.55, 14));
  const angle = Math.PI / 5;
  const depthX = Math.cos(angle) * depth;
  const depthY = Math.sin(angle) * depth;

  const axisFontSize = Math.max(10, Math.round(12 * scale));

  // ── Background ─────────────────────────────────────────────────────────
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // ── Gridlines ──────────────────────────────────────────────────────────
  const numGridLines = 7; // 0,10,20,30,40,50,60,70
  ctx.setLineDash([]);

  for (let i = 0; i <= numGridLines; i++) {
    const gridY = height - paddingBottom - (chartAreaHeight / numGridLines) * i;
    const gridValue = Math.round((maxValue / numGridLines) * i);

    // Horizontal grid line
    ctx.strokeStyle = "rgba(209, 213, 219, 0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, gridY);
    ctx.lineTo(width - paddingRight, gridY);
    ctx.stroke();

    // Y-axis labels
    ctx.fillStyle = "#9ca3af";
    ctx.font = `${axisFontSize}px sans-serif`;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(gridValue.toString(), paddingLeft - 8, gridY);
  }

  // ── Bars ───────────────────────────────────────────────────────────────
  for (let gi = 0; gi < numGroups; gi++) {
    const label = labels[gi];
    const groupX = paddingLeft + gi * (groupWidth + GROUP_GAP);
    const groupCenterX = groupX + groupWidth / 2;

    for (let di = 0; di < numDatasets; di++) {
      const dataset = datasets[di];
      const rawValue = dataset.data[gi];
      const value = isFinite(rawValue) && rawValue >= 0 ? rawValue : 0;

      const barHeight = (value / effectiveMax) * chartAreaHeight;
      if (!isFinite(barHeight) || barHeight < 0) continue;

      // Center the bar group
      const totalBarsWidth = numDatasets * barWidth + (numDatasets - 1) * BAR_GAP;
      const barsStartX = groupCenterX - totalBarsWidth / 2;
      const baseX = barsStartX + di * (barWidth + BAR_GAP);
      const baseY = height - paddingBottom - barHeight;

      if (!isFinite(baseX) || !isFinite(baseY)) continue;

      const baseColor = dataset.backgroundColor;
      const topColor = shadeColor(baseColor, 35);
      const sideColor = shadeColor(baseColor, -30);

      if (barHeight <= 0) continue;

      // Shadow
      ctx.shadowColor = "rgba(0,0,0,0.12)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      // SIDE face (right 3D effect)
      ctx.fillStyle = sideColor;
      ctx.beginPath();
      ctx.moveTo(baseX + barWidth, baseY);
      ctx.lineTo(baseX + barWidth + depthX, baseY - depthY);
      ctx.lineTo(baseX + barWidth + depthX, height - paddingBottom - depthY);
      ctx.lineTo(baseX + barWidth, height - paddingBottom);
      ctx.closePath();
      ctx.fill();

      // TOP face
      ctx.fillStyle = topColor;
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(baseX + depthX, baseY - depthY);
      ctx.lineTo(baseX + barWidth + depthX, baseY - depthY);
      ctx.lineTo(baseX + barWidth, baseY);
      ctx.closePath();
      ctx.fill();

      // FRONT face (gradient)
      ctx.shadowColor = "transparent";
      try {
        const gradient = ctx.createLinearGradient(baseX, baseY, baseX, height - paddingBottom);
        gradient.addColorStop(0, shadeColor(baseColor, 15));
        gradient.addColorStop(1, baseColor);
        ctx.fillStyle = gradient;
      } catch {
        ctx.fillStyle = baseColor;
      }
      ctx.fillRect(baseX, baseY, barWidth, barHeight);
    }

    // X-axis label
    ctx.shadowColor = "transparent";
    ctx.fillStyle = "#6b7280";
    ctx.font = `${axisFontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(label, groupCenterX + depthX / 2, height - paddingBottom + 8);
  }

  // ── Axes ───────────────────────────────────────────────────────────────
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 1;

  // Y axis
  ctx.beginPath();
  ctx.moveTo(paddingLeft, paddingTop);
  ctx.lineTo(paddingLeft, height - paddingBottom);
  ctx.stroke();

  // X axis
  ctx.beginPath();
  ctx.moveTo(paddingLeft, height - paddingBottom);
  ctx.lineTo(width - paddingRight, height - paddingBottom);
  ctx.stroke();
};

// ✅ resizeCanvas
const resizeCanvas = () => {
  if (!canvasRef.value) return;
  const container = canvasRef.value.closest(".chart-wrapper") as HTMLElement;
  if (!container) return;

  const dpr = window.devicePixelRatio || 1;
  const containerWidth = container.offsetWidth;
  const height = container.offsetHeight;
  if (height <= 0) return;

  const FIXED_GROUP_WIDTH = 95;
  const GROUP_GAP = 12;
  const numGroups = chartData.value?.labels?.length ?? 0;
  const paddingLeft = Math.max(40, containerWidth * 0.05);
  const paddingRight = Math.max(20, containerWidth * 0.03);

  const neededWidth =
    numGroups * FIXED_GROUP_WIDTH +
    (numGroups - 1) * GROUP_GAP +
    paddingLeft +
    paddingRight +
    40;

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
    <!-- ✅ Header: عنوان يسار + legend يمين (مطابق للديزاين) -->
    <div class="total-observation-header-container">
      <p class="static-title">Hazard & Observation & Incident Overview</p>

      <div class="legend-container">
        <div
          v-for="dataset in chartData?.datasets ?? []"
          :key="dataset.label"
          class="legend-item"
        >
          <span class="legend-dot" :style="{ backgroundColor: dataset.backgroundColor }"></span>
          <span class="legend-label">{{ dataset.label }}</span>
        </div>
      </div>
    </div>

    <!-- ✅ Chart scroll wrapper -->
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
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  padding-bottom: 8px;
}

/* ✅ Header: flex row — عنوان يسار، legend يمين */
.total-observation-header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 12px;
  flex-wrap: wrap;
  gap: 12px;
}

.static-title {
  font-size: 17px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

/* ✅ Legend: أفقي، dots دائرية صغيرة */
.legend-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

/* ✅ Chart scroll wrapper */
.chart-scroll-wrapper {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
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

}
</style>
