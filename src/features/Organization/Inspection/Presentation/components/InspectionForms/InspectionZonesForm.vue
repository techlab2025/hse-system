<script setup lang="ts">
import TitleInterface from '@/base/Data/Models/title_interface'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import { ref } from 'vue'
import InspectionGeneralForm from './InspectionGeneralForm.vue'
import InspectionTemplateDialog from '@/features/Organization/Inspection/Presentation/components/InspectionDialog/InspectionTemplateDialog.vue'
import FetchMyZonesController from '@/features/Organization/ObservationFactory/Presentation/controllers/FetchMyZonesController'
import FetchMyZonesParams from '@/features/Organization/ObservationFactory/Core/params/FetchMyZonesParams'
import IndexEquipmentController from '@/features/setting/Equipment/Presentation/controllers/indexEquipmentController'
import IndexEquipmentParams from '@/features/setting/Equipment/Core/params/indexEquipmentParams'
import IndexProjectController from '@/features/Organization/Project/Presentation/controllers/indexProjectController'
import IndexProjectParams from '@/features/Organization/Project/Core/params/indexProjectParams'

const emit = defineEmits(['update:data'])
const SelectedZones = ref<TitleInterface>()
const SelectedProject = ref<TitleInterface>()

const fetchMyProjectsController = IndexProjectController.getInstance()
const fetchMyProjectsParams = new IndexProjectParams('', 1, 10, 0)

const fetchMyZonesController = FetchMyZonesController.getInstance()
// const fetchMyZoneaParams = new FetchMyZonesParams(SelectedProject?.value?.id)
const fetchMyZoneaParams = ref(new FetchMyZonesParams(null))

const UpdateData = () => {
  emit('update:data', {
    morph: SelectedZones.value,
    data: date.value,
    TempalteIds: TempalteIds.value,
    ProjectId: SelectedProject.value?.id,
    SelectedEquipment: SelectedEquipment?.value?.id,
  })
}
const setZones = (data: TitleInterface) => {
  SelectedZones.value = data
  UpdateData()
}

const date = ref()
const GetGeneralData = (data) => {
  date.value = data
  UpdateData()
}
const TempalteIds = ref<number>()
const GetTemplateId = (data: number) => {
  TempalteIds.value = data
  UpdateData()
}

const setProject = (data: TitleInterface) => {
  SelectedZones.value = null
  SelectedProject.value = data
  fetchMyZoneaParams.value = new FetchMyZonesParams(SelectedProject.value?.id || null)
  UpdateData()
}

const ClearDate = () => {
  // date.value = null
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
  <div class="zone-inspection-form">
    <section class="zone-selection-section">
      <div class="section-heading">
        <span class="section-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
        </span>
        <div>
          <h3>{{ $t('Zone assignment details') }}</h3>
          <p>{{ $t('Select the project and work zone where this inspection will take place') }}</p>
        </div>
      </div>

      <div class="selection-grid">
        <div class="selection-field">
          <span class="field-step">01</span>
          <CustomSelectInput
            :required="true"
            :modelValue="SelectedProject"
            class="input"
            :controller="fetchMyProjectsController"
            :params="fetchMyProjectsParams"
            :label="$t('Projects')"
            id="zone-project"
            :placeholder="$t('select your project')"
            @update:modelValue="setProject"
          />
        </div>

        <div v-if="SelectedProject" class="selection-field">
          <span class="field-step">02</span>
          <CustomSelectInput
            :required="true"
            :modelValue="SelectedZones"
            class="input"
            :controller="fetchMyZonesController"
            :params="fetchMyZoneaParams"
            :label="$t('Zone')"
            id="inspection-zone"
            :placeholder="$t('select your Zone')"
            @update:modelValue="setZones"
          />
        </div>

        <div class="selection-field selection-field--optional">
          <span class="optional-badge">{{ $t('optional') }}</span>
          <CustomSelectInput
            :modelValue="SelectedEquipment"
            class="input"
            :controller="indexEquipmentController"
            :params="deleteEquipmentTypeParams"
            :label="$t('Equipment')"
            id="zone-equipment"
            :placeholder="$t('select your equipment')"
            @update:modelValue="setEquipment"
          />
        </div>
      </div>
    </section>

    <section class="zone-template-section">
      <InspectionTemplateDialog @update:data="GetTemplateId" />
    </section>

    <section class="zone-schedule-section">
      <InspectionGeneralForm @change:btn="ClearDate" @update:data="GetGeneralData" />
    </section>
  </div>
</template>

<style scoped>
.zone-inspection-form {
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  gap: 1rem;
}

.zone-selection-section,
.zone-template-section,
.zone-schedule-section {
  min-width: 0;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 11%, var(--main-border));
  border-radius: 1.15rem;
  background: var(--surface-2);
  padding: 1rem;
}

.zone-selection-section {
  background:
    radial-gradient(
      circle at 100% 0,
      color-mix(in srgb, var(--status-success) 8%, transparent),
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
  width: 2.65rem;
  height: 2.65rem;
  flex: 0 0 2.65rem;
  align-items: center;
  justify-content: center;
  border: 1px solid color-mix(in srgb, var(--status-success) 22%, transparent);
  border-radius: 0.85rem;
  background: var(--status-success-soft);
  color: var(--status-success);
}

.section-icon svg {
  width: 1.3rem;
  height: 1.3rem;
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
.selection-field :deep(.custom-select-container),
.selection-field :deep(.custom-select) {
  min-width: 0;
}

.zone-template-section,
.zone-schedule-section {
  background: linear-gradient(180deg, var(--surface-2), var(--surface-1));
}

@media (max-width: 700px) {
  .selection-grid {
    grid-template-columns: 1fr;
  }

  .zone-selection-section,
  .zone-template-section,
  .zone-schedule-section {
    padding: 0.8rem;
  }
}
</style>
