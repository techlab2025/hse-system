<script setup lang="ts">
import HistoryLog from '@/shared/icons/HistoryLog.vue'
import Filter from './filter.vue'
import PendingHistoryCard from './PendingHistoryCard.vue'
import type InspectionModel from '@/features/Organization/Inspection/Data/models/InspectionModel';
import Warn from "@/assets/images/Warn.png"
import InspectionTaskbg from "@/assets/images/InspectionTaskbg.png"
import ViewInspectionArrow from '@/shared/icons/ViewInspectionArrow.vue';

const props = defineProps<{
  tasks: InspectionModel[]
}>()

const GetInspectionTitle = (task: InspectionModel) => {
  return task.template?.titles?.find((title: any) => title.locale === localStorage.getItem('lang'))?.title
}

</script>

<template>
  <div class="history-log">
    <Filter />
    <!-- <div class="title">
      <HistoryLog />
      <h4>{{ $t('History Log') }}</h4>
    </div> -->

    <div class="inspection-history flex items-start gap-2" v-for="(task, index) in tasks" :key="index">
      <!-- {{ GetInspectionTitle(task) }} -->
      <img class="bg" :src="InspectionTaskbg" alt="">
      <div class="inspection-header">
        <img class="warn" :src="Warn" alt="warn" width="30" height="30">
        <div class="title-container">
          <span class="title">Inspection</span>
          <span class="date">{{ task?.date }}</span>
        </div>
      </div>
      <div class="view-inspection-container">
        <p class="view-inspection">view inspection details</p>
        <ViewInspectionArrow />

      </div>

    </div>


    <!-- <PendingHistoryCard /> -->
  </div>
</template>
