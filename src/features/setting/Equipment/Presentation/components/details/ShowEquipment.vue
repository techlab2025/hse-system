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
.show-equipment-page {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-height: calc(100vh - 120px);
  padding: clamp(14px, 2vw, 22px);
  border-radius: 18px;
  background: #f8fafc;
}

.show-equ-head {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  align-items: stretch;
}

.show-equipment-card-shell {
  min-width: 0;
}

.show-equipment-card-shell :deep(.card-equipment) {
  height: 100%;
  border-radius: 18px;
  border-color: #e2e8f0;
  background: #ffffff;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
}

.show-equipment-card-shell :deep(.img-equipment) {
  border-radius: 14px;
  background: #f8fafc;
}

.show-equipment-card-shell :deep(.drop-down-btn) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.show-equipment-card-shell :deep(.drop-down-btn:hover) {
  transform: translateY(-1px);
  box-shadow: 0 16px 34px rgba(29, 78, 216, 0.13);
}

.equipment-qr-panel {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-height: 220px;
  padding: 18px 20px;
  overflow: hidden;
  border: 1px solid #dbeafe;
  border-radius: 18px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fbff 58%, #eef5ff 100%), #ffffff;
  color: #0f172a;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
}

.equipment-qr-panel::before {
  content: '';
  position: absolute;
  top: 18px;
  right: 18px;
  width: 96px;
  height: 96px;
  pointer-events: none;
  border-radius: 999px;
  background: rgba(29, 78, 216, 0.08);
}

.equipment-qr-panel > * {
  position: relative;
  z-index: 1;
}

.equipment-qr-panel :deep(.demo-card) {
  flex: 1 1 auto;
  min-width: 0;
  border: none !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  color: #0f172a;
}

.qr-scan {
  align-self: center;
  flex: 0 0 150px;
  width: 150px;
  height: 150px;
  padding: 12px;
  border: 1px solid #dbeafe;
  border-radius: 18px;
  background: #ffffff;
  object-fit: contain;
  box-shadow: 0 14px 30px rgba(29, 78, 216, 0.12);
}

.print-icon {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 3;
  cursor: pointer;
  color: #ffffff;
  background: #1d4ed8;
  border: 1px solid #1d4ed8;
  border-radius: 999px;
  padding: 8px 16px;
  font-family: 'Regular';
  font-weight: 700;
  box-shadow: 0 12px 24px rgba(29, 78, 216, 0.18);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.print-icon:hover {
  transform: translateY(-1px);
  background: #1e40af;
  box-shadow: 0 16px 30px rgba(29, 78, 216, 0.22);
}

.inspection-switch {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  max-width: 520px;
  margin: 0 auto;
  padding: 6px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
}

.inspection-switch button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  width: 50%;
  min-height: 48px;
  border: 1px solid transparent;
  border-radius: 12px;
  color: #64748b;
  font-weight: 800;
  transition:
    transform 0.2s ease,
    color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.inspection-switch button:hover {
  color: #1d4ed8;
  transform: translateY(-1px);
}

.inspection-switch button.active {
  color: #0f172a;
  border-color: rgba(29, 78, 216, 0.16);
  background: #eef5ff;
  box-shadow: none;
}

.tab-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: #cbd5e1;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.inspection-switch button.active .tab-dot {
  transform: scale(1.2);
  background: #1d4ed8;
  box-shadow: 0 0 0 5px rgba(29, 78, 216, 0.12);
}

.history-qr {
  position: relative;
  z-index: 1;
}

.history-qr :deep(.history-log) {
  border-radius: 18px;
  border-color: #e2e8f0;
  background: #ffffff;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
}

.history-qr :deep(.history-card) {
  border-radius: 20px;
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

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 260px;
  border: 1px dashed rgba(148, 163, 184, 0.7);
  border-radius: 24px;
  color: #64748b;
  background: #f8fafc;
  font-weight: 800;
}

@media (max-width: 1180px) {
  .equipment-qr-panel {
    min-height: 220px;
  }
}

@media (max-width: 720px) {
  .show-equipment-page {
    padding: 12px;
    border-radius: 14px;
  }

  .equipment-qr-panel {
    flex-direction: column;
    align-items: stretch;
    padding: 14px;
    border-radius: 14px;
  }

  .qr-scan {
    flex-basis: auto;
    width: 150px;
    height: 150px;
  }

  .inspection-switch {
    width: 100%;
    max-width: none;
  }

  .inspection-switch button {
    min-height: 44px;
    padding-inline: 10px;
  }
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
    color: #000000 !important;
    background: #ffffff !important;
    box-shadow: none !important;
  }

  .print-icon {
    display: none !important;
  }
}
</style>
