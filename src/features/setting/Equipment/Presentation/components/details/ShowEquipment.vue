<script setup lang="ts">
import '@/features/Organization/Project/styles/project.css'
import './equipment-details.css'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import ProjectIcon from '@/features/Organization/Project/Presentation/components/ProjectUtils/ProjectIcon.vue'
import PrintIcon from '@/shared/icons/PrintIcon.vue'
import CardEquipment from './CardEquipment.vue'
import HistoryLog from './HistoryLog.vue'
import DemoCard from '../EquipmentUtils/DemoCard.vue'
import ShowEquipmentController from '../../controllers/showEquipmentController'
import ShowEquipmentParams from '../../../Core/params/showEquipmentParams'
import { EquipmentInspectionEnum } from '../../../Core/enum/EquipmentInspectionEnum'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { useUserStore } from '@/stores/user'
import { usePrint } from '@/stores/PrintPart'
import { EquipmentTypesEnum } from '@/features/setting/Template/Core/Enum/EquipmentsTypeEnum'
const route = useRoute()
const userStore = useUserStore()
const { t } = useI18n()
const controller = ShowEquipmentController.getInstance()
const state = computed(() => controller.state.value)
const equipment = computed(() => state.value.data)
const InspectionStatus = ref(EquipmentInspectionEnum.Inspection)
const { printArea, print } = usePrint({ isolated: true })
const backLink = computed(
  () =>
    `/${userStore.user?.type === OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/equipments`,
)
async function fetchEquipmentDetails() {
  const id = Number(route.params.id)
  if (!Number.isInteger(id) || id <= 0) return
  try {
    await controller.showEquipmentType(new ShowEquipmentParams(id, true))
  } catch {
    /* DataStatus renders the controller error state. */
  }
}
onMounted(fetchEquipmentDetails)
watch(() => route.params.id, fetchEquipmentDetails)
const tabs = computed(() => [
  {
    id: EquipmentInspectionEnum.Inspection,
    label: t('Inspection'),
    count:
      (equipment.value?.tasks_without_result?.length ?? 0) +
      (equipment.value?.tasks_with_result?.length ?? 0),
    icon: 'equipment' as const,
  },
  {
    id: EquipmentInspectionEnum.Results,
    label: t('Results'),
    count: equipment.value?.tasks_with_result?.length ?? 0,
    icon: 'gauge' as const,
  },
])
function tabKeydown(event: KeyboardEvent, index: number) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  const next =
    event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? tabs.value.length - 1
        : (index + 1) % tabs.value.length
  InspectionStatus.value = tabs.value[next].id
  const target = event.currentTarget as HTMLElement
  target.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus()
}
</script>
<template>
  <main data-hse-project class="equipment-details hse-identity hse-project-root">
    <DataStatus :controller="state">
      <template #success>
        <template v-if="equipment">
          <header class="eq-page-heading">
            <!-- <div>
              <p class="eq-eyebrow">
                {{ $t('Equipment') }} / {{ equipment.serial_name || `#${equipment.id}` }}
              </p>
              <h1>{{ $t('eq_equipment_details') }}</h1>
            </div> -->
            <!-- <router-link :to="backLink" class="hse-project-button eq-back"
              ><ProjectIcon name="arrow-right" />{{ $t('Back') }}</router-link
            > -->
          </header>
          <div class="eq-overview">
            <CardEquipment :equipment-data="equipment" />
            <aside class="eq-panel eq-identification">
              <header class="eq-identification-header">
                <ProjectIcon name="equipment" />
                <h2>{{ $t('equipment_asset_card') }}</h2>
              </header>
              <div ref="printArea" class="eq-print-area">
                <DemoCard
                  identification
                  :is-bread-cramp="true"
                  :is-form="true"
                  :equipment-name="equipment.title"
                  :selctedequipment="equipment.title"
                  :selectedequipment-type="equipment.equipment_type"
                  :equipment-type-in-show="EquipmentTypesEnum[equipment.equipment_type?.type]"
                  :qr-code="equipment.qr_code_image"
                  :serial="equipment.serial_name || String(equipment.id)"
                  :license-number="equipment.licensePlateNumber || equipment.licenseNumber"
                  :start-date="equipment.checkinDate"
                  :EndDate="equipment.checkout_date"
                  :expiredate="equipment.certificateExppiredDate || equipment.date"
                  :device-status="equipment.status"
                  :inspection-duration="equipment.inspectionDuration"
                />
              </div>
              <button
                type="button"
                class="hse-project-button hse-project-button--primary eq-print-button"
                @click="print"
              >
                <PrintIcon aria-hidden="true" />{{ $t('eq_print_card') }}
              </button>
            </aside>
          </div>
          <section class="eq-panel eq-history-section">
            <header class="eq-history-heading">
              <div>
                <h2>{{ $t('eq_inspection_records') }}</h2>
                <p class="eq-muted">{{ $t('eq_inspection_records_hint') }}</p>
              </div>
            </header>
            <div class="eq-tabs" role="tablist" :aria-label="$t('eq_inspection_records')">
              <button
                v-for="(tab, index) in tabs"
                :id="`eq-tab-${tab.id}`"
                :key="tab.id"
                type="button"
                role="tab"
                :aria-selected="InspectionStatus === tab.id"
                :tabindex="InspectionStatus === tab.id ? 0 : -1"
                aria-controls="eq-records-panel"
                @click="InspectionStatus = tab.id"
                @keydown="tabKeydown($event, index)"
              >
                <ProjectIcon :name="tab.icon" /><span>{{ tab.label }}</span
                ><b>{{ tab.count }}</b>
              </button>
            </div>
            <div
              id="eq-records-panel"
              role="tabpanel"
              :aria-labelledby="`eq-tab-${InspectionStatus}`"
            >
              <HistoryLog
                :show_tasks="equipment.tasks_without_result ?? []"
                :result_tasks="equipment.tasks_with_result ?? []"
                :inspection-type="InspectionStatus"
              />
            </div>
          </section>
        </template>
      </template>
      <template #initial
        ><div class="eq-skeleton" aria-busy="true" :aria-label="$t('eq_loading')">
          <div class="eq-skeleton-heading"></div>
          <div class="eq-overview">
            <div class="eq-panel eq-skeleton-summary"></div>
            <div class="eq-panel eq-skeleton-summary"></div>
          </div>
          <div class="eq-panel eq-skeleton-record"></div></div
      ></template>
      <template #loader
        ><div class="eq-skeleton" aria-busy="true" :aria-label="$t('eq_loading')">
          <div class="eq-skeleton-heading"></div>
          <div class="eq-overview">
            <div class="eq-panel eq-skeleton-summary"></div>
            <div class="eq-panel eq-skeleton-summary"></div>
          </div>
          <div class="eq-panel eq-skeleton-record"></div></div
      ></template>
      <template #empty
        ><div class="eq-panel eq-empty">
          <ProjectIcon name="equipment" />
          <p>{{ $t('No Equipment Data Found') }}</p>
          <router-link :to="backLink" class="hse-project-button">{{ $t('Back') }}</router-link>
        </div></template
      >
      <template #failed
        ><div class="eq-panel eq-empty" role="alert">
          <p>{{ state.error?.title || $t('eq_load_failed') }}</p>
          <button type="button" class="hse-project-button" @click="fetchEquipmentDetails">
            {{ $t('op.retry') }}
          </button>
        </div></template
      >
    </DataStatus>
  </main>
</template>
