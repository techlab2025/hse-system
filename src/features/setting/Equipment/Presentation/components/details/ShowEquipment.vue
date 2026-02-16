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

import InspectioBtn from '@/assets/images/InspectioBtn.png'
import InspectionTopBtn from '@/assets/images/InspectionTopBtn.png'
import { EquipmentInspectionEnum } from '../../../Core/enum/EquipmentInspectionEnum'
import DemoCard from '../EquipmentUtils/DemoCard.vue'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const controller = ShowEquipmentController.getInstance()

const state = ref(controller.state.value)

const fetchEquipmentDetails = async () => {
  const id = Number(route.params.id)
  if (!id) return

  const params = new ShowEquipmentParams(id, true)
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
const { user } = useUserStore()
</script>

<template>
  <DataStatus :controller="state">
    <template #success>
      <!-- <pre>{{ state.data }}</pre> -->
      <div class="show-equipment">
        <div class="show-equ-head">
          
          <div>
            <CardEquipment :equipmentData="state.data!" />
          </div>

          <div class="Qr_EQUIPMENt">
            <DemoCard
              v-if="user?.type === OrganizationTypeEnum.ORGANIZATION"
              :equipmentName="state.data?.title"
              :isForm="true"
              :inspectionDuration="state.data?.inspectionDuration || $t('Determined')"
              :image="state.data?.image"
              :selctedequipment="state.data?.title"
              :selectedequipmentType="state.data?.equipment_type"
              :decommissioningDate="state.data?.date || ''"
              :isBreadCramp="true"
              :expiredate="state.data?.certificateExppiredDate"
              :startDate="state.data?.checkinDate"
              :EndDate="state.data?.date"
              :typerent="user?.type === OrganizationTypeEnum.ORGANIZATION"
              :deviceStatus="state.data?.status"
            />
            <img src="@/assets/images/qr.png" alt="qr" class="qr-scan" />
          </div>
        </div>
        <div class="inspection-btn w-full flex">
          <button
            @click="InspectionStatus = EquipmentInspectionEnum.Inspection"
            :class="InspectionStatus === EquipmentInspectionEnum.Inspection ? 'active' : ''"
          >
            <img
              v-if="InspectionStatus === EquipmentInspectionEnum.Inspection"
              :src="InspectioBtn"
              alt="bg"
              class="down-bg"
            />
            <span>Insepection</span>
            <img
              v-if="InspectionStatus === EquipmentInspectionEnum.Inspection"
              :src="InspectionTopBtn"
              alt="bg"
              class="top-bg"
            />
          </button>
          <button
            @click="InspectionStatus = EquipmentInspectionEnum.Results"
            :class="InspectionStatus === EquipmentInspectionEnum.Results ? 'active' : ''"
          >
            <img
              v-if="InspectionStatus === EquipmentInspectionEnum.Results"
              :src="InspectioBtn"
              alt="bg"
              class="down-bg"
            />
            <span>Results</span>
            <img
              v-if="InspectionStatus === EquipmentInspectionEnum.Results"
              :src="InspectionTopBtn"
              alt="bg"
              class="top-bg"
            />
          </button>
        </div>
        <div class="history-qr">
          <HistoryLog
            :show_tasks="state.data?.tasks_without_result"
            :result_tasks="state.data?.tasks_with_result"
            :inspectionType="InspectionStatus"
          />
          <!-- <QrCode /> -->
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

<style scoped>
.Qr_EQUIPMENt {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.add-dialog {
  width: 20px;
  height: 20px;
  margin-right: 6px;
  cursor: pointer;
  color: #1d4ed8;
  text-decoration: underline;
  font-family: 'Regular';
}

.add-dialog svg {
  width: 18px;
  height: 18px;
}

.radio-wrapper {
  padding: 0;
}

.h-full {
  height: 100%;
  padding: 12px;
}
</style>
