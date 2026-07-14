<template>
  <div class="investigations_container">
    <div class="title">
      <h6>Overview investigations</h6>
      <p>These are the percentages of closed investigations for each month.</p>
    </div>
    <div class="chart_container">
      <div
        class="chart_row"
        v-for="(value, index) in props.overviewInvestigationsChartstate"
        :key="index"
      >
        <div class="span" v-for="i in 8" :key="i"></div>
        <div class="total_count_chart" :style="{ height: value.total + '%' }">
          <div class="top-indicator" v-if="value.total === maxTotal">
            <span class="indicator-label">{{ value.total }}</span>
            <span class="indicator-dot"></span>
          </div>
          <span>+{{ value.total }}</span
          >%
        </div>
        <p class="zone_title">{{ wordSlice(value.zoneTitle, 7) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import wordSlice from '@/base/Presentation/utils/word_slice'
import OverviewInvestigationsChartModel from '@/features/Home/data/Model/OverviewInvestigationsChartModel'
import { computed } from 'vue'

const props = defineProps<{
  overviewInvestigationsChartstate: OverviewInvestigationsChartModel[]
}>()

const maxTotal = computed(() => {
  const totals = props.overviewInvestigationsChartstate.map((v) => Number(v.total) || 0)
  return totals.length ? Math.max(...totals) : 0
})
</script>

<style lang="scss" scoped>
.investigations_container {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
  padding-bottom: 16px;

  .title {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin: 0;

    h6 {
      margin: 0;
      color: var(--header-page-color);
      font-family: 'bold';
      font-size: 19px;
      font-weight: 900;
      line-height: 1.15;
    }

    p {
      max-width: 320px;
      margin: 0;
      color: var(--GrayText-1);
      font-family: 'regular';
      font-size: 12px;
      font-weight: 700;
      line-height: 1.45;
    }
  }
}

.chart_container {
  display: flex;
  align-items: flex-end;
  gap: 14px;
  height: clamp(250px, 34vh, 380px);
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 42px 4px 34px;
  border: 1px solid color-mix(in srgb, var(--main-border) 82%, transparent);
  border-radius: 20px;
  background:
    linear-gradient(
      180deg,
      transparent 0%,
      transparent calc(25% - 1px),
      color-mix(in srgb, var(--main-border) 52%, transparent) 25%,
      transparent calc(25% + 1px),
      transparent calc(50% - 1px),
      color-mix(in srgb, var(--main-border) 52%, transparent) 50%,
      transparent calc(50% + 1px),
      transparent calc(75% - 1px),
      color-mix(in srgb, var(--main-border) 52%, transparent) 75%,
      transparent calc(75% + 1px)
    ),
    linear-gradient(180deg, var(--BgWhite), var(--Gray-1));
  position: relative;
  scrollbar-color: color-mix(in srgb, var(--PrimaryColor) 38%, transparent) transparent;
  scrollbar-width: thin;
}

.chart_container p {
  color: var(--header-page-color);
  font-size: 11px;
  font-weight: 900;
}

.chart_container .zone_title {
  position: absolute;
  bottom: -28px;
  left: 50%;
  width: 64px;
  margin: 0;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  transform: translateX(-50%);
  white-space: nowrap;
}

.chart_container span {
  z-index: 11;
}

.chart_row {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 44px;
  min-width: 44px;
  height: 100%;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 12%, transparent);
  border-radius: 16px;
  background: color-mix(in srgb, var(--PrimaryColor) 8%, var(--BgWhite));
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--surface-1) 85%, transparent);

  .span:nth-child(1) {
    bottom: 10%;
    transform: rotate(160deg);
  }

  .span:nth-child(2) {
    bottom: 30%;
    transform: rotate(160deg);
  }

  .span:nth-child(3) {
    bottom: 50%;
    transform: rotate(160deg);
  }

  .span:nth-child(4) {
    bottom: 70%;
    transform: rotate(160deg);
  }

  .span:nth-child(5) {
    bottom: 82%;
    transform: rotate(160deg);
  }

  .span:nth-child(6) {
    bottom: 90%;
    transform: rotate(160deg);
  }

  .span {
    position: absolute;
    width: 78%;
    height: 1px;
    border-radius: 999px;
    background-color: color-mix(in srgb, var(--PrimaryColor) 20%, transparent);
  }

  .total_count_chart {
    position: relative;
    min-height: 16px;
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--PrimaryColor) 72%, var(--surface-1)),
      var(--PrimaryColor)
    );
    box-shadow: 0 12px 22px color-mix(in srgb, var(--PrimaryColor) 26%, transparent);
    border-radius: 14px;
    width: 100%;
    text-align: center;
    color: var(--text-on-brand);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    font-weight: bold;
    font-size: 12px;
    padding: 0 0.35rem 12px;
    z-index: 11;
    text-shadow: none;

    .top-indicator {
      position: absolute;
      top: -38px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      z-index: 20;

      .indicator-label {
        background: var(--BgWhite);
        color: var(--PrimaryColor);
        font-size: 11px;
        font-weight: 900;
        padding: 3px 8px;
        border: 1px solid color-mix(in srgb, var(--PrimaryColor) 16%, transparent);
        border-radius: 999px;
        box-shadow: 0 10px 22px color-mix(in srgb, var(--brand-primary-900) 12%, transparent);
        white-space: nowrap;
        text-shadow: none;
        animation: floatIndicator 1.8s ease-in-out infinite;
      }

      .indicator-dot {
        width: 10px;
        height: 10px;
        background: var(--PrimaryColor);
        border: 2px solid var(--BgWhite);
        border-radius: 50%;
        box-shadow: 0 0 0 5px color-mix(in srgb, var(--PrimaryColor) 16%, transparent);
      }
    }
  }
}

@keyframes floatIndicator {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-6px);
  }

  100% {
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .investigations_container {
    gap: 14px;
  }

  .chart_row {
    width: 36px;
    min-width: 36px;
  }

  .total_count_chart {
    font-size: 10px !important;
  }

  .chart_container {
    height: 250px;
    padding-inline: 2px;
    border-radius: 16px;
  }
}
</style>
