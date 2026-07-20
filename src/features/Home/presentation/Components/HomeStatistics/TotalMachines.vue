<script setup lang="ts">
import wordSlice from '@/base/Presentation/utils/word_slice';
import { EquipmentTypeEnum } from '@/features/Home/core/enums/SettingEnum/EquipmentTypeEnum';
import type StatisticsMachineModel from '@/features/Home/data/Model/StatisticsMachineModel';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  totalMachines: StatisticsMachineModel[]
}>()
const { t } = useI18n()

const chartData = computed(() => {
  return props.totalMachines?.map(machine => {
    const staticsArray = Array.isArray(machine.statics)
      ? machine.statics
      : Object.values(machine.statics || {})

    const total = staticsArray.reduce((sum, stat) => sum + stat.count, 0) || 1;
    return {
      name: machine.zoon,
      segments: staticsArray.map((stat: any) => ({
        number: stat.count,
        value: (stat.count / total) * 100,
        color: stat.type === 1 ? '#3b82f6' : stat.type === 2 ? '#60a5fa' : '#93c5fd',
        type: stat.type
      }))
    };
  }) ?? [];
});

const GetEquipmentTypeTitle = (type: number) => {
  switch (type) {
    case 1:
      return t('equipment')
    case 2:
      return t('device')
    case 3:
      return t('tool')
  }
}
</script>
<template>
  <div class="total-machines-container ">
    <div class="total-machines-header-container">
      <div class="total-machines-header">
        <span class="static">{{ $t('statistics') }}</span>
        <p class="static-title">{{ $t('most_used_equipment') }}</p>
      </div>
      <div class="static-data">
        <p>{{ $t('tool') }}</p>
        <p>{{ $t('equipment') }}</p>
        <p>{{ $t('device') }}</p>
      </div>
    </div>
    <div class="chart-container flex items-end gap-4 p-8 bg-white rounded-xl font-sans">
      <div v-for="month in chartData" :key="month.name" class="month flex flex-col items-center gap-2">
        <div class="flex flex-col-reverse gap-1 w-12 h-48 precentage-container">
          <div v-for="(segment, index) in month.segments" :key="index" :style="{
            height: segment.value + '%',
            background: segment.color,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }" class="w-full rounded-md transition-all duration-500 hover:opacity-80 ">
          </div>
          <div class="info-container">
            <div v-for="segment in month.segments" class="data-column">
              <span class="label" :class="segment.type === 3 ? 'tool' : segment.type === 2 ? 'device' : 'equipment'">{{
                GetEquipmentTypeTitle(segment.type)
                }}</span>
              <span class="value">{{ segment.number }}</span>
            </div>
            <p class="total-value"><span>{{ $t('total') }}:</span> <span class="value">{{month.segments.reduce((sum, segment) => sum
              + segment.number, 0)}}</span>
            </p>
          </div>

        </div>


        <span class="col-name text-slate-500 text-sm font-medium mt-2">
          {{ wordSlice(month.name, 10) }}
        </span>
      </div>
    </div>
  </div>

</template>




<style scoped>
.col-name {
  max-height: 16px;
  overflow: hidden;
  text-align: center;
}

.chart-container {
  width: 100%;
  max-width: 100%;
  padding-inline: 10px;
  justify-content: flex-start;

  .month {
    max-width: 45px;
  }
}

.precentage-container {
  position: relative;

  &:hover {
    .info-container {
      display: block;
    }
  }

  .info-container {


    position: absolute;
    top: 50%;
    left: 60%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    /* background-color: color-mix(in srgb, var(--surface-1) 83.6%, transparent); */
    background-color: color-mix(in srgb, var(--surface-2) 73.33%, transparent);
    backdrop-filter: blur(5px);
    color: var(--brand-primary-500);
    font-weight: 500;
    font-size: 12px;
    border-radius: 4px;
    padding: 8px;
    font-family: "Regular";
    cursor: pointer;
    transition: 0.3s all linear;
    display: none;
    z-index: 999;

    .data-column {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 30px;

      .label {
        position: relative;
        padding-inline: 10px;

        &.tool {
          &::before {
            background-color: var(--brand-primary-400);
          }
        }

        &.equipment {
          &::before {
            background-color: var(--brand-primary-300);
          }
        }

        &.device {
          &::before {
            background-color: var(--brand-primary-200);
          }
        }

        &::before {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translate(-50%, -50%);
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 10px;
        }
      }
    }
  }



}

.month:first-child {
  .info-container {
    left: 100%;
    transform: translateX(-40%);
  }
}

.total-value {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
  color: var(--text-strong);
  margin-top: 8px;
}

@media (max-width: 800px) {
  .chart-container {
    overflow: scroll;
  }
}


.chart-container {
  max-width: 100%;
  overflow-x: auto;
  overflow-y: visible;
  overscroll-behavior-inline: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--brand-primary-100) transparent;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--brand-primary-100);
    border-radius: 4px;
  }

  .month {
    width: 48px;
    min-width: 48px;
    max-width: 48px;
    flex-shrink: 0;
    scroll-snap-align: start;
  }

  @media (max-width: 768px) {
    padding: 12px 4px 10px !important;
    gap: 12px !important;
    scroll-snap-type: x proximity;

    .month {
      width: 42px;
      min-width: 42px;
      max-width: 42px;
    }

    .precentage-container {
      width: 2.25rem !important;
      height: 9rem !important;
    }

    .col-name {
      width: 100%;
      font-size: 10px !important;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  @media (max-width: 480px) {
    padding: 10px 2px 8px !important;
    gap: 10px !important;

    .month {
      width: 38px;
      min-width: 38px;
      max-width: 38px;
    }

    .precentage-container {
      width: 2rem !important;
      height: 8rem !important;
    }

    .col-name {
      font-size: 9px !important;
    }
  }
}

/* .percentage-container {
  position: relative;
  overflow: hidden;

  &:hover {

    .percentage-box {
      display: block;


    }
  }

  .percentage-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--surface-1);
    color: var(--brand-primary-400);
    font-size: 12px;
    border-radius: 4px;
    padding: 3px;
    font-family: "Regular";
    cursor: pointer;
    transition: 0.3s all linear;

  }
} */

/* .info-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--surface-1);
  color: var(--brand-primary-400);
  font-size: 12px;
  border-radius: 4px;
  padding: 3px;
  font-family: "Regular";
  cursor: pointer;
  transition: 0.3s all linear;
} */
</style>
