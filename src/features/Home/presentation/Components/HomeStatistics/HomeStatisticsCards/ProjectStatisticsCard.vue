<script setup lang="ts">
import { ProjectStatusEnum } from '@/features/Home/core/enums/SettingEnum/ProjectStatusEnum';
import type SingleProjectStatisticsModel from '@/features/Home/data/Model/SingleProjectStatisticsModel';


const props = defineProps<{ projectStatisticsCard: SingleProjectStatisticsModel }>()
const ReturnProjectStatus = (status: number) => {
  return ProjectStatusEnum[status]
}
</script>
<template>
  <div class="project-statistics-card">
    <div class="project-statistics-card-info">
      <span :class="`status-${ReturnProjectStatus(projectStatisticsCard?.status)}`">{{
        ReturnProjectStatus(projectStatisticsCard?.status) }}</span>
      <span class="project-name">{{ projectStatisticsCard?.projectName }}</span>
    </div>

    <div class="project-statistics-card-info-counters">
      <div class="counter flex flex-col items-start">
        <span class="static-info">
          total tasks :
        </span>
        <span class=total>{{ projectStatisticsCard?.totalTasks }}</span>
      </div>
      <div class="counter flex flex-col items-start">
        <span class="static-info">
          completed tasks :
        </span>
        <span class=complated>{{ projectStatisticsCard?.complatedTasks }}</span>
      </div>
      <div class="counter flex flex-col items-start">
        <span class="static-info">
          inprogress tasks :
        </span>
        <span class="inprogress">{{ projectStatisticsCard?.inprogressTasks }}</span>
      </div>
      <div class="counter flex flex-col items-start">
        <span class="static-info">
          holded tasks :
        </span>
        <span class="hold">{{ projectStatisticsCard?.holdsTasks }}</span>
      </div>
    </div>
  </div>
</template>
