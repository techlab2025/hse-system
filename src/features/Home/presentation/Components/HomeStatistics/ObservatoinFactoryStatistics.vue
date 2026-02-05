<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const chartData = ref();
const chartOptions = ref();
let resizeObserver: ResizeObserver | null = null;

const COLORS = ['#3B82F6', '#10B981', '#F59E0F', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Hazard',
        backgroundColor: documentStyle.getPropertyValue('--hazard-color') || '#EF4444',
        data: [25, 25, 30, 20, 10, 15, 35]
      },
      {
        label: 'Observation',
        backgroundColor: documentStyle.getPropertyValue('--observation-color') || '#10B981',
        data: [35, 30, 25, 30, 20, 25, 40]
      },
      {
        label: 'Incident',
        backgroundColor: documentStyle.getPropertyValue('--incidant-color') || '#3B82F6',
        data: [15, 20, 25, 15, 25, 20, 30]
      },
    ]
  };
};

const shadeColor = (color: string, percent: number) => {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
};

const drawGroupedBarChart3D = (canvas: HTMLCanvasElement) => {
  if (!canvas || !chartData.value) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.clientWidth;
const height = canvas.clientHeight;


  ctx.clearRect(0, 0, width, height);

 const padding = Math.max(40, width * 0.07);

  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const labels = chartData.value.labels;
  const datasets = chartData.value.datasets;
  
  // Find max value across all datasets
  const allValues = datasets.flatMap((ds: any) => ds.data);
  const maxValue = Math.max(...allValues);

  const groupWidth = chartWidth / labels.length;
  const barGap = 15; // Gap between bars in the same group
  const groupPadding = 20; // Padding on sides of each group
  const availableWidth = groupWidth - (groupPadding * 2);
  const totalGaps = (datasets.length - 1) * barGap;
  const barWidth = (availableWidth - totalGaps) / datasets.length;
  
  // 3D isometric parameters (30 degree rotation)
  const angle = Math.PI / 6; // 30 degrees
  const depth = 25; // Increased depth for better 3D effect
  const depthX = Math.cos(angle) * depth;
  const depthY = Math.sin(angle) * depth;

  // Draw gridlines
  const gridLines = 5;
  ctx.strokeStyle = "rgba(156, 163, 175, 0.15)";
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  
  for (let i = 0; i <= gridLines; i++) {
    const gridY = height - padding - (chartHeight / gridLines) * i;
    ctx.beginPath();
    ctx.moveTo(padding, gridY);
    ctx.lineTo(width - padding + depthX, gridY);
    ctx.stroke();
    
    // Y-axis labels
    const gridValue = Math.round((maxValue / gridLines) * i);
    ctx.fillStyle = "#6b7280";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(gridValue.toString(), padding - 15, gridY);
  }
  
  ctx.setLineDash([]);

  // Draw bars for each group (draw from back to front for proper layering)
  for (let groupIndex = labels.length - 1; groupIndex >= 0; groupIndex--) {
    const label = labels[groupIndex];
    const groupX = padding + groupIndex * groupWidth;

    // Draw bars within group from back to front
    for (let datasetIndex = datasets.length - 1; datasetIndex >= 0; datasetIndex--) {
      const dataset = datasets[datasetIndex];
      const value = dataset.data[groupIndex];
      const barHeight = (value / maxValue) * chartHeight;
      
      // Calculate x position with gaps
      const baseX = groupX + groupPadding + (datasetIndex * (barWidth + barGap));
      const baseY = height - padding - barHeight;

      const baseColor = dataset.backgroundColor;
      const topColor = shadeColor(baseColor, 30);
      const sideColor = shadeColor(baseColor, -25);
      const frontColor = baseColor;

      // Enable shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;

      // Draw left side (depth along the angle)
      ctx.fillStyle = sideColor;
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(baseX + depthX, baseY - depthY);
      ctx.lineTo(baseX + depthX, height - padding - depthY);
      ctx.lineTo(baseX, height - padding);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw right side
      ctx.fillStyle = shadeColor(sideColor, -10);
      ctx.beginPath();
      ctx.moveTo(baseX + barWidth, baseY);
      ctx.lineTo(baseX + barWidth + depthX, baseY - depthY);
      ctx.lineTo(baseX + barWidth + depthX, height - padding - depthY);
      ctx.lineTo(baseX + barWidth, height - padding);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.stroke();

      // Draw top face (parallelogram)
      ctx.fillStyle = topColor;
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(baseX + depthX, baseY - depthY);
      ctx.lineTo(baseX + barWidth + depthX, baseY - depthY);
      ctx.lineTo(baseX + barWidth, baseY);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.stroke();

      // Draw front face with gradient
      const gradient = ctx.createLinearGradient(baseX, baseY, baseX, height - padding);
      gradient.addColorStop(0, shadeColor(frontColor, 10));
      gradient.addColorStop(0.5, frontColor);
      gradient.addColorStop(1, shadeColor(frontColor, -5));

      ctx.fillStyle = gradient;
      ctx.fillRect(baseX, baseY, barWidth, barHeight);
      
      // Add border to front
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      ctx.lineWidth = 1;
      ctx.strokeRect(baseX, baseY, barWidth, barHeight);

      // Disable shadow for text
      ctx.shadowColor = "transparent";

      // Draw value on top
      if (barHeight > 25) {
        // Draw value background
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        const textMetrics = ctx.measureText(value.toString());
        const textPadding = 4;
        ctx.fillRect(
          baseX + barWidth / 2 + depthX / 2 - textMetrics.width / 2 - textPadding,
          baseY - depthY - 20,
          textMetrics.width + textPadding * 2,
          16
        );

        ctx.fillStyle = "#1f2937";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(value.toString(), baseX + barWidth / 2 + depthX / 2, baseY - depthY - 12);
      }
    }

    // Draw group label
    ctx.fillStyle = "#374151";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const labelX = groupX + groupWidth / 2 + depthX / 2;
    ctx.fillText(label, labelX, height - padding + 15);
  }

  // Disable shadow for axes
  ctx.shadowColor = "transparent";

  // Draw 3D axes
  ctx.strokeStyle = "#374151";
  ctx.lineWidth = 2;
  
  // Y-axis (vertical)
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.stroke();

  // X-axis (with depth)
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding + depthX, height - padding);
  ctx.stroke();

  // Z-axis (depth line)
  ctx.strokeStyle = "#6b7280";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(padding + depthX, height - padding - depthY);
  ctx.stroke();

  // Draw legend
  const legendY = 25;
  let legendX = width - 220;

  datasets.forEach((dataset: any, index: number) => {
    const boxSize = 16;
    const legendItemY = legendY + index * 28;

    // Draw color box with 3D effect
    ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Draw box with isometric effect
    const boxDepth = 4;
    const boxAngle = Math.PI / 9;
    const boxDepthX = Math.cos(boxAngle) * boxDepth;
    const boxDepthY = Math.sin(boxAngle) * boxDepth;

    // Top face
    ctx.fillStyle = shadeColor(dataset.backgroundColor, 25);
    ctx.beginPath();
    ctx.moveTo(legendX, legendItemY);
    ctx.lineTo(legendX + boxDepthX, legendItemY - boxDepthY);
    ctx.lineTo(legendX + boxSize + boxDepthX, legendItemY - boxDepthY);
    ctx.lineTo(legendX + boxSize, legendItemY);
    ctx.closePath();
    ctx.fill();

    // Front face
    ctx.fillStyle = dataset.backgroundColor;
    ctx.fillRect(legendX, legendItemY, boxSize, boxSize);
    
    ctx.shadowColor = "transparent";

    // Draw label
    ctx.fillStyle = "#1f2937";
    ctx.font = "13px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(dataset.label, legendX + boxSize + 10, legendItemY + boxSize / 2);
  });
};

const resizeCanvas = () => {
  if (!canvasRef.value) return;

  const container = canvasRef.value.closest('.chart-wrapper') as HTMLElement;
  if (!container) return;

  const dpr = window.devicePixelRatio || 1;

  const width = container.offsetWidth;
  const height = container.offsetHeight;

  canvasRef.value.width = width * dpr;
  canvasRef.value.height = height * dpr;

  canvasRef.value.style.width = width + "px";
  canvasRef.value.style.height = height + "px";

  const ctx = canvasRef.value.getContext("2d");
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  drawGroupedBarChart3D(canvasRef.value);
};



onMounted(() => {
  chartData.value = setChartData();

  if (!canvasRef.value) return;

  const container = canvasRef.value.closest('.chart-wrapper') as HTMLElement;
  if (!container) return;

  resizeObserver = new ResizeObserver(() => {
    resizeCanvas();
  });

  resizeObserver.observe(container);

  resizeCanvas();
});


watch(chartData, () => {
  if (canvasRef.value) {
    drawGroupedBarChart3D(canvasRef.value);
  }
});
</script>

<template>
  <div class="total-observation-container">
    <div class="total-observation-header-container">
      <div class="total-observation-header">
        <p class="static-title">Hazard & Observation & Incident Overview</p>
      </div>
    </div>
    <div class="chart-wrapper" >
      <canvas ref="canvasRef" ></canvas>
    </div>
  </div>
</template>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 80vh;
  max-height: 780px;
  min-height: 400px;
  position: relative;
}

canvas {
  width: 100%;
  height: 100%;
  display: block;
}



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

.chart-wrapper {
  position: relative;
}

canvas {
  display: block;
}
</style>