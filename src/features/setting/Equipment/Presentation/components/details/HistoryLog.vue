<script setup lang="ts">
import type InspectionModel from '@/features/Organization/Inspection/Data/models/InspectionModel'
import { ref } from 'vue'
import { EquipmentInspectionEnum } from '../../../Core/enum/EquipmentInspectionEnum'
import EquipmentInspectionCard from './EquipmentInspectionCard.vue'
import NoData from "@/assets/images/no-data.png"

const props = defineProps<{
  show_tasks: InspectionModel[]
  result_tasks: InspectionModel[]
  inspectionType: EquipmentInspectionEnum
}>()

const GetInspectionTitle = (task: InspectionModel) => {
  return task.template?.titles?.find((title: any) => title.locale === localStorage.getItem('lang'))
    ?.title
}

const Types = ref(['sunday', 'monday', 'tuesday'])
</script>

<template>
  <div class="history-log">
    <!-- <Filter /> -->
    <!-- <div class="title">
      <HistoryLog />
      <h4>{{ $t('History Log') }}</h4>
    </div> -->

    <div class="inspection-history-container" v-if="inspectionType == EquipmentInspectionEnum.Inspection">

      <template v-if="show_tasks.length > 0 || result_tasks?.length > 0">
        <EquipmentInspectionCard :isEquipmentShowQuestions="true" :tasks="show_tasks" :isDrag="false"
          :showresult="false" :isEquipment="true" />
        <EquipmentInspectionCard :isEquipmentShowQuestions="true" :tasks="result_tasks" :isDrag="false"
          :showresult="false" :isEquipment="true" />
      </template>
      <template v-else>
        <div class="empty-inspection-container">
          <img class="empty-inspection" :src="NoData" alt="equipemnt-inspection">
        </div>
      </template>
      <!-- <EquipmentInspectionCard :tasks="result_tasks" :isDrag="false" :showresult="true" :isEquipment="true" /> -->
    </div>
    <div class="inspection-history-container" v-if="inspectionType == EquipmentInspectionEnum.Results">
      <template v-if="result_tasks?.length > 0">

        <EquipmentInspectionCard :tasks="result_tasks" :isEquipmentResult="true" />
      </template>
      <template v-else>
        <div class="empty-inspection-container">
          <img class="empty-inspection" :src="NoData" alt="equipemnt-inspection">
        </div>
      </template>
    </div>

    <!-- <PendingHistoryCard /> -->
  </div>
</template>

<style scoped>
.empty-inspection-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 30%;
    height: 40%;
  }
}

.empty-inspection {
  margin: auto;
}
</style>
