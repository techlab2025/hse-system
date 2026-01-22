<script setup lang="ts">
import HistoryLog from '@/shared/icons/HistoryLog.vue'
import Filter from './filter.vue'
import PendingHistoryCard from './PendingHistoryCard.vue'
import type InspectionModel from '@/features/Organization/Inspection/Data/models/InspectionModel'
import Warn from '@/assets/images/Warn.png'
import InspectionTaskbg from '@/assets/images/InspectionTaskbg.png'
import ViewInspectionArrow from '@/shared/icons/ViewInspectionArrow.vue'
import { ref } from 'vue'
import EquipmentInspectionShowDialog from '../Dialogs/EquipmentInspectionShowDialog.vue'
import EquipmentInspectionResultDialog from '../Dialogs/EquipmentInspectionResultDialog.vue'
import { EquipmentInspectionEnum } from '../../../Core/enum/EquipmentInspectionEnum'
import { PeriodTypeEnum } from '@/features/Organization/Inspection/Core/Enum/PeriodTypeEnum'
import InspectionCard from '@/features/Organization/Inspection/Presentation/components/InspectionUtils/InspectionCard.vue'

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

    <div
      class="inspection-history-container"
      v-if="inspectionType == EquipmentInspectionEnum.Inspection"
    >
      <InspectionCard :tasks="show_tasks" :isDrag="false" :showresult="false" :isEquipment="true" />
    </div>
    <div
      class="inspection-history-container"
      v-if="inspectionType == EquipmentInspectionEnum.Results"
    >
      <InspectionCard :tasks="result_tasks" :isDrag="false" :showresult="true" />
    </div>

    <!-- <PendingHistoryCard /> -->
  </div>
</template>
