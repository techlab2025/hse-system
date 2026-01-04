<script setup lang="ts">
import type StatisticsMachineModel from '@/features/Home/data/Model/StatisticsMachineModel';

const props = defineProps<{
  totalMachines: StatisticsMachineModel[]
}>()

const chartData = [
  {
    name: 'Jan',
    segments: [
      { value: 10, color: '#3b82f6' },
      { value: 30, color: '#60a5fa' },
      { value: 50, color: '#93c5fd' },
    ]
  },
  {
    name: 'Feb',
    segments: [
      { value: 40, color: '#2563eb' },
      { value: 30, color: '#60a5fa' },
      { value: 25, color: '#bfdbfe' },
    ]
  },
  {
    name: 'Mar',
    segments: [
      { value: 70, color: '#2563eb' },
      { value: 25, color: '#60a5fa' },
      { value: 25, color: '#bfdbfe' },


    ]
  },
  {
    name: 'Apr',
    segments: [
      { value: 75, color: '#60a5fa' },
      { value: 20, color: '#bfdbfe' },
      { value: 25, color: '#bfdbfe' },


    ]
  },
  {
    name: 'May',
    segments: [
      { value: 75, color: '#60a5fa' },
      { value: 20, color: '#bfdbfe' },
      { value: 25, color: '#bfdbfe' },
    ]
  },
  {
    name: 'Jun',
    segments: [
      { value: 75, color: '#60a5fa' },
      { value: 20, color: '#bfdbfe' },
      { value: 25, color: '#bfdbfe' },
    ]
  },
  {
    name: 'Jul',
    segments: [
      { value: 75, color: '#60a5fa' },
      { value: 20, color: '#bfdbfe' },
      { value: 25, color: '#bfdbfe' },
    ]
  },
  {
    name: 'Aug',
    segments: [
      { value: 75, color: '#60a5fa' },
      { value: 20, color: '#bfdbfe' },
      { value: 25, color: '#bfdbfe' },
    ]
  },
  {
    name: 'Sep',
    segments: [
      { value: 75, color: '#60a5fa' },
      { value: 20, color: '#bfdbfe' },
      { value: 25, color: '#bfdbfe' },
    ]
  },
  {
    name: 'Oct',
    segments: [
      { value: 75, color: '#60a5fa' },
      { value: 20, color: '#bfdbfe' },
      { value: 25, color: '#bfdbfe' },
    ]
  },
  {
    name: 'Nov',
    segments: [
      { value: 75, color: '#60a5fa' },
      { value: 20, color: '#bfdbfe' },
      { value: 25, color: '#bfdbfe' },
    ]
  },
  {
    name: 'Dec',
    segments: [
      { value: 100, color: '#60a5fa' },
      { value: 20, color: '#bfdbfe' },
      { value: 25, color: '#bfdbfe' },
    ]
  }
];


</script>
<template>

  <div class="total-machines-container ">
    <div class="total-machines-header-container">
      <div class="total-machines-header">
        <span class="static">static</span>
        <p class="static-title">most used incident factors </p>
      </div>
    </div>
    <div class="chart-container flex items-end gap-4 p-8 bg-white rounded-xl font-sans">
      <div v-for="month in chartData" :key="month.name" class="month flex flex-col items-center gap-2">
        <div class="flex flex-col-reverse gap-1 w-12 h-48">
          <div v-for="(segment, index) in month.segments" :key="index" :style="{
            height: segment.value + '%',
            background: segment.color,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }" class="w-full rounded-md transition-all duration-500 hover:opacity-80"></div>
        </div>


        <span class="text-slate-500 text-sm font-medium mt-2">
          {{ month.name }}
        </span>
      </div>
    </div>
  </div>

</template>




<style scoped>
.chart-container {
  max-width: 100%;

  .month {
    max-width: 45px;
  }
}
</style>
