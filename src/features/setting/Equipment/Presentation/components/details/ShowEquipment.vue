<script setup lang="ts">
import CardEquipment from './CardEquipment.vue'
import HistoryLog from './HistoryLog.vue'
import QrCode from './QrCode.vue'

import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'

import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ShowEquipmentController from '../../controllers/showEquipmentController'
import ShowEquipmentParams from '../../../Core/params/showEquipmentParams'

import InspectioBtn from "@/assets/images/InspectioBtn.png"
import InspectionTopBtn from "@/assets/images/InspectionTopBtn.png"
import { EquipmentInspectionEnum } from '../../../Core/enum/EquipmentInspectionEnum'



const route = useRoute()
const controller = ShowEquipmentController.getInstance()

const state = ref(controller.state.value)

const fetchEquipmentDetails = async () => {
  const id = Number(route.params.id)
  if (!id) return

  const params = new ShowEquipmentParams(id)
  await controller.showEquipmentType(params)
}

onMounted(async () => {
  await fetchEquipmentDetails()
})

watch(
  () => controller.state.value,
  (newState) => {
    state.value = newState
  },
)

const InspectionStatus = ref(EquipmentInspectionEnum.Inspection)
</script>

<template>
  <DataStatus :controller="state">
    <template #success>
      <div class="show-equipment">
        <CardEquipment :equipmentData="state.data!" />
        <div class="inspection-btn w-full flex">
          <button @click="InspectionStatus = EquipmentInspectionEnum.Inspection"
            :class="InspectionStatus === EquipmentInspectionEnum.Inspection ? 'active' : ''">
            <img v-if="InspectionStatus === EquipmentInspectionEnum.Inspection" :src="InspectioBtn" alt="bg"
              class="down-bg">
            <span>Insepection</span>
            <img v-if="InspectionStatus === EquipmentInspectionEnum.Inspection" :src="InspectionTopBtn" alt="bg"
              class="top-bg">
          </button>
          <button @click="InspectionStatus = EquipmentInspectionEnum.Results"
            :class="InspectionStatus === EquipmentInspectionEnum.Results ? 'active' : ''">
            <img v-if="InspectionStatus === EquipmentInspectionEnum.Results" :src="InspectioBtn" alt="bg"
              class="down-bg">
            <span>Results</span>
            <img v-if="InspectionStatus === EquipmentInspectionEnum.Results" :src="InspectionTopBtn" alt="bg"
              class="top-bg">
          </button>
        </div>
        <div class="history-qr">
          <HistoryLog :show_tasks="state.data?.tasks_without_result" :result_tasks="state.data?.tasks_with_result"
            :inspectionType="InspectionStatus" />
          <QrCode />
        </div>
      </div>
    </template>

    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>

    <template #empty>
      <div class="empty-state">{{ $t('No Equipment Data Found') }}</div>
    </template>
  </DataStatus>
</template>
