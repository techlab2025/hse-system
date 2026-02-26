<script setup lang="ts">
import { EquipmentTypeEnum } from '@/features/Home/core/enums/SettingEnum/EquipmentTypeEnum';
import type StatisticsMachineModel from '@/features/Home/data/Model/StatisticsMachineModel';
import { computed } from 'vue';

const props = defineProps<{
  totalMachines: StatisticsMachineModel[]
}>()

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
</script>
<template>
  <div class="total-machines-container ">
    <div class="total-machines-header-container">
      <div class="total-machines-header">
        <span class="static">static</span>
        <p class="static-title">most used incident factors </p>
      </div>
      <div class="static-data">
        <p>tool</p>
        <p>equipment</p>
        <p>device</p>
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
              <span class="label" :class="segment.type === 1 ? 'tool' : segment.type === 2 ? 'equipment' : 'device'">{{
                EquipmentTypeEnum[segment.type] }}</span>
              <span class="value">{{ segment.number }}</span>
            </div>
            <p class="total-value"><span>total:</span> <span class="value">{{month.segments.reduce((sum, segment) => sum
              + segment.number, 0)}}</span>
            </p>
          </div>

        </div>


        <span class="col-name text-slate-500 text-sm font-medium mt-2">
          {{ month.name }}
        </span>
      </div>
    </div>
  </div>

</template>




<style scoped>
.col-name {
  max-height: 16px;
  overflow: hidden;
}

.chart-container {
  max-width: 100%;

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
    /* background-color: rgba(255, 255, 255, 0.836); */
    background-color: #e9ebeebb;
    backdrop-filter: blur(5px);
    color: #727B99;
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
            background-color: #3b82f6;
          }
        }

        &.equipment {
          &::before {
            background-color: #60a5fa;
          }
        }

        &.device {
          &::before {
            background-color: #93c5fd;
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

.total-value {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
  color: black;
  margin-top: 8px;
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
    background-color: white;
    color: #3b82f6;
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
  background-color: white;
  color: #3b82f6;
  font-size: 12px;
  border-radius: 4px;
  padding: 3px;
  font-family: "Regular";
  cursor: pointer;
  transition: 0.3s all linear;
} */
</style>
