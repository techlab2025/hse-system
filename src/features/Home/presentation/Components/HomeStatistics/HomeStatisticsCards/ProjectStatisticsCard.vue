<script setup lang="ts">
import type SingleProjectStatisticsModel from '@/features/Home/data/Model/SingleProjectStatisticsModel';


const props = defineProps<{ projectStatisticsCard: SingleProjectStatisticsModel }>()

</script>
<template>
  <div class="project-statistics-card">
    <div class="project-statistics-card-info">
      <span class="status">{{ projectStatisticsCard?.status }}</span>
      <span class="project-name">{{ projectStatisticsCard?.projectName }}</span>
    </div>

    <div class="project-statistics-card-info-counters">
      <div class="counter flex flex-col items-start">
        <span >
          total tasks :
        </span>
        <span>{{ projectStatisticsCard?.totalTasks }}</span>
      </div>
      <div class="counter flex flex-col items-start">
        <span>
          completed tasks :
        </span>
        <span>{{ projectStatisticsCard?.complatedTasks }}</span>
      </div>
      <div class="counter flex flex-col items-start">
        <span>
          inprogress tasks :
        </span>
        <span>{{ projectStatisticsCard?.inprogressTasks }}</span>
      </div>
      <div class="counter flex flex-col items-start">
        <span>
          holded tasks :
        </span>
        <span>{{ projectStatisticsCard?.holdsTasks }}</span>
      </div>
    </div>
  </div>
</template>
