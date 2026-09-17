<script setup lang="ts">
import { ref, watch } from 'vue'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import InspectionGeneralForm from './InspectionGeneralForm.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
// import IndexEmployeeParams from '@/features/employee/Core
import InspectionTemplateDialog from '../InspectionDialog/InspectionTemplateDialog.vue'
import IndexProjectController from '@/features/Organization/Project/Presentation/controllers/indexProjectController'
import IndexProjectParams from '@/features/Organization/Project/Core/params/indexProjectParams'
import FetchMyZonesController from '@/features/Organization/ObservationFactory/Presentation/controllers/FetchMyZonesController'
import FetchMyZonesParams from '@/features/Organization/ObservationFactory/Core/params/FetchMyZonesParams'
import type MyZonesModel from '@/features/Organization/ObservationFactory/Data/models/MyZonesModel'
import IndexEquipmentController from '@/features/setting/Equipment/Presentation/controllers/indexEquipmentController'
import IndexEquipmentParams from '@/features/setting/Equipment/Core/params/indexEquipmentParams'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'

const emit = defineEmits(['update:data'])
const SelectedProject = ref<TitleInterface>()
const SelectedEmployee = ref<TitleInterface>()
const SelectedProjectZone = ref<TitleInterface>()

const indexOrganizatoinEmployeeController = IndexOrganizatoinEmployeeController.getInstance()
const indexEmployeeParams = ref<IndexOrganizatoinEmployeeParams | null>(null)
watch(SelectedProjectZone, (newVal) => {
  indexEmployeeParams.value = new IndexOrganizatoinEmployeeParams(
    '',
    1,
    1,
    0,
    null,
    newVal?.id,
    false,
  )
})

const indexProjectController = IndexProjectController.getInstance()
const indexProjectParams = new IndexProjectParams('', 1, 10, 0)

const fetchMyZoneController = FetchMyZonesController.getInstance()
const fetchMyZoneParams = ref<FetchMyZonesParams | null>(null)
// watch(SelectedProject, (newVal) => {
//   fetchMyZoneParams.value = new FetchMyZonesParams(newVal?.id);
// });

// const ProjectZoneId = ref<number>()
const UpdateData = () => {
  emit('update:data', {
    morph: SelectedEmployee.value,
    data: Data.value,
    TempalteIds: TempalteIds.value,
    ProjectZoneId: SelectedProjectZone.value?.id,
    ProjectId: SelectedProject.value?.id,
    SelectedEquipment: SelectedEquipment.value?.id,
  })
}
const setEmployee = (data: TitleInterface) => {
  SelectedEmployee.value = data
  UpdateData()
}
const Data = ref()

const GetGeneralData = (data) => {
  Data.value = data
  UpdateData()
}
const TempalteIds = ref<number>()
const GetTemplateId = (data: number) => {
  TempalteIds.value = data
  UpdateData()
}

const setProject = (data: TitleInterface) => {
  SelectedEmployee.value = null
  SelectedProjectZone.value = null
  AllZones.value = []
  SelectedProject.value = data
  if (data?.id) {
    GetProjectZones(data?.id)
  }
  UpdateData()
}

const setProjectZone = (data: TitleInterface) => {
  SelectedProjectZone.value = data
  SelectedEmployee.value = null
  UpdateData()
}

const AllZones = ref<TitleInterface[]>([])

const GetProjectZones = async (projectId: number) => {
  AllZones.value = []

  const params = new FetchMyZonesParams(projectId)
  const state = await fetchMyZoneController.getData(params)

  if (state.value.data) {
    state.value.data.forEach((zone: MyZonesModel) => {
      AllZones.value.push(
        new TitleInterface({
          id: zone.ProjectZoneId,
          title: zone.title,
        }),
      )
    })
  }
}
const ClearDate = () => {
  Data.value = {
    PeridWithDate: [],
    bydates: [],
    fromDate: null,
    toDate: null,
    inspectionType: null,
    WithDays: null,
    onceday: null,
    periodByday: null,
    periodType: null,
  }

  UpdateData()
}

const indexEquipmentController = IndexEquipmentController.getInstance()
const deleteEquipmentTypeParams = new IndexEquipmentParams('', 1, 10, 0)

const SelectedEquipment = ref<TitleInterface>()
const setEquipment = (data: TitleInterface) => {
  SelectedEquipment.value = data
  UpdateData()
}
</script>

<template>
  <div class="employee-inspection-form">
    <section class="employee-selection-section">
      <div class="section-heading">
        <span class="section-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M16 20v-1.5a4.5 4.5 0 0 0-4.5-4.5h-4A4.5 4.5 0 0 0 3 18.5V20" />
            <circle cx="9.5" cy="7" r="4" />
            <path d="M17 8h4M19 6v4" />
          </svg>
        </span>
        <div>
          <h3>{{ $t('Assignment details') }}</h3>
          <p>{{ $t('Locate the employee and add any equipment used for this inspection') }}</p>
        </div>
      </div>

      <div class="selection-grid">
        <div class="selection-field">
          <span class="field-step">01</span>
          <UpdatedCustomInputSelect
            :required="true"
            :modelValue="SelectedProject"
            class="input"
            :controller="indexProjectController"
            :params="indexProjectParams"
            :label="$t('Projects')"
            id="project"
            :placeholder="$t('select your Project')"
            @update:modelValue="setProject"
          />
        </div>

        <div v-if="SelectedProject" class="selection-field">
          <span class="field-step">02</span>
          <UpdatedCustomInputSelect
            :required="true"
            :modelValue="SelectedProjectZone"
            class="input"
            :static-options="AllZones"
            :label="$t('Zones')"
            id="project-zone"
            :placeholder="$t('select your Zone')"
            @update:modelValue="setProjectZone"
          />
        </div>

        <div v-if="SelectedProjectZone" class="selection-field">
          <span class="field-step">03</span>
          <UpdatedCustomInputSelect
            :required="true"
            :modelValue="SelectedEmployee"
            class="input"
            :controller="indexOrganizatoinEmployeeController"
            :params="indexEmployeeParams"
            :label="$t('Employee')"
            id="employee"
            :placeholder="$t('select your employee')"
            @update:modelValue="setEmployee"
          />
        </div>

        <div class="selection-field selection-field--optional">
          <span class="optional-badge">{{ $t('optional') }}</span>
          <UpdatedCustomInputSelect
            :modelValue="SelectedEquipment"
            class="input"
            :controller="indexEquipmentController"
            :params="deleteEquipmentTypeParams"
            :label="$t('Equipment')"
            id="equipment"
            :placeholder="$t('select your equipment')"
            @update:modelValue="setEquipment"
          />
        </div>
      </div>
    </section>

    <section class="employee-template-section">
      <InspectionTemplateDialog @update:data="GetTemplateId" />
    </section>

    <section class="employee-schedule-section">
      <InspectionGeneralForm @change:btn="ClearDate" @update:data="GetGeneralData" />
    </section>
  </div>
</template>

<style scoped>
.employee-inspection-form {
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  gap: 1rem;
}

.employee-selection-section,
.employee-template-section,
.employee-schedule-section {
  min-width: 0;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 11%, var(--main-border));
  border-radius: 1.15rem;
  background: var(--surface-2);
  padding: 1rem;
}

.employee-selection-section {
  background:
    radial-gradient(
      circle at 100% 0,
      color-mix(in srgb, var(--brand-primary-500) 7%, transparent),
      transparent 32%
    ),
    var(--surface-2);
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.section-heading > div {
  min-width: 0;
}

.section-icon {
  display: inline-flex;
  width: 2.6rem;
  height: 2.6rem;
  flex: 0 0 2.6rem;
  align-items: center;
  justify-content: center;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 18%, transparent);
  border-radius: 0.85rem;
  background: var(--brand-primary-50);
  color: var(--brand-primary-500);
}

.section-icon svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.section-heading h3 {
  margin: 0 0 0.15rem;
  color: var(--text-strong);
  font-family: 'Bold', sans-serif;
  font-size: 1rem;
}

.section-heading p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.8rem;
  line-height: 1.4;
}

.selection-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
}

.selection-field {
  position: relative;
  min-width: 0;
  border: 1px solid var(--main-border);
  border-radius: 1rem;
  background: var(--surface-1);
  padding: 0.9rem;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.selection-field:focus-within {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--brand-primary-500) 38%, var(--main-border));
  box-shadow: 0 9px 22px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
}

.field-step,
.optional-badge {
  position: absolute;
  z-index: 2;
  top: 0.65rem;
  inset-inline-end: 0.75rem;
  border-radius: 999px;
  padding: 0.2rem 0.48rem;
  font-family: 'Bold', sans-serif;
  font-size: 0.62rem;
  line-height: 1;
}

.field-step {
  background: var(--brand-primary-50);
  color: var(--brand-primary-500);
}

.optional-badge {
  background: var(--status-success-soft);
  color: var(--status-success);
}

.selection-field :deep(.input-wrapper),
.selection-field :deep(.custom-select-container) {
  min-width: 0;
}

.employee-template-section,
.employee-schedule-section {
  background: linear-gradient(180deg, var(--surface-2), var(--surface-1));
}

@media (max-width: 700px) {
  .selection-grid {
    grid-template-columns: 1fr;
  }

  .employee-selection-section,
  .employee-template-section,
  .employee-schedule-section {
    padding: 0.8rem;
  }
}
</style>
