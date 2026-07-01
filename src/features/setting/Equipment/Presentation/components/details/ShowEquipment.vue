<script setup lang="ts">
import CardEquipment from './CardEquipment.vue'
import HistoryLog from './HistoryLog.vue'

import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'

import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ShowEquipmentController from '../../controllers/showEquipmentController'
import ShowEquipmentParams from '../../../Core/params/showEquipmentParams'

import { EquipmentInspectionEnum } from '../../../Core/enum/EquipmentInspectionEnum'
import DemoCard from '../EquipmentUtils/DemoCard.vue'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { useUserStore } from '@/stores/user'
import { usePrint } from '@/stores/PrintPart'

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
const { printArea, print } = usePrint()
</script>

<template>
  <DataStatus :controller="state">
    <template #success>
      <!-- <pre>{{ state.data }}</pre> -->
      <div class="show-equipment show-equipment-page">
        <div class="show-equ-head">
          <div class="show-equipment-card-shell w-full">
            <CardEquipment :equipmentData="state.data!" />
          </div>
          <div class="Qr_EQUIPMENt equipment-qr-panel printable-area" ref="printArea">
            <button class="print-icon" type="button" @click="print">{{ $t('Print') }}</button>
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
              :EndDate="state.data?.checkout_date"
              :typerent="user?.type === OrganizationTypeEnum.ORGANIZATION"
              :deviceStatus="state.data?.status"
            />
            <img :src="state.data?.qr_code_image" alt="qr" class="qr-scan" width="100" />
          </div>
        </div>
        <div class="inspection-btn inspection-switch w-full" role="tablist">
          <button
            type="button"
            role="tab"
            @click="InspectionStatus = EquipmentInspectionEnum.Inspection"
            :class="InspectionStatus === EquipmentInspectionEnum.Inspection ? 'active' : ''"
          >
            <span class="tab-dot"></span>
            <span>{{ $t('Inspection') }}</span>
          </button>
          <button
            type="button"
            role="tab"
            @click="InspectionStatus = EquipmentInspectionEnum.Results"
            :class="InspectionStatus === EquipmentInspectionEnum.Results ? 'active' : ''"
          >
            <span class="tab-dot"></span>
            <span>{{ $t('Results') }}</span>
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
.show-equ-head{
  display: flex;
  flex-direction: column;
  
}
.print-icon {
  position: absolute;
  top: 14px;
  right: 14px;
  cursor: pointer;
  color: #1551d1;
  background: #eef4ff;
  border: 1px solid #d8e5ff;
  border-radius: 999px;
  padding: 7px 14px;
  font-family: 'Regular';
  font-weight: 700;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.print-icon:hover {
  transform: translateY(-1px);
  background: #ffffff;
  box-shadow: 0 12px 24px rgba(29, 78, 216, 0.14);
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

@media print {
  /* Hide everything */
  body * {
    visibility: hidden;
    display: none;
  }

  /* Show only the target and its children */
  .printable-area,
  .printable-area * {
    visibility: visible;
  }

  /* Position it to fill the page */
  .printable-area {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
}
</style>
