<script setup lang="ts">
import { ref } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import DatePicker from 'primevue/datepicker'
import ToggleSwitch from 'primevue/toggleswitch'
import SwitchInput from '@/shared/FormInputs/SwitchInput.vue'
import IndexContractorController from '@/features/setting/contractor/Presentation/controllers/indexContractorController'
import IndexContractorParams from '@/features/setting/contractor/Core/params/indexContractorParams'
import IndexLocationController from '@/features/setting/Location/Presentation/controllers/indexLocationController'
import IndexLocationParams from '@/features/setting/Location/Core/params/indexLocationParams'
import { LocationEnum } from '@/features/setting/Location/Core/Enum/LocationEnum'
import AddContractor from '@/features/setting/contractor/Presentation/components/AddContractor.vue'
import AddZoneDialog from '../../Dialogs/ZoneDialog/AddZoneDialog.vue'
import AddProjectZoneDialog from '../../Dialogs/AddProjectZoneDialog.vue'
import LocationSelectDialog from '../../SelectDialogs/LocationSelectDialog.vue'
import type SohwProjectZoonModel from '../../../../Data/models/ShowProjectZone'
import type {
  BasicProjectForm,
  BasicProjectValidationErrors,
  LangDescriptionValue,
  LangTitleValue,
  ProjectSerialField,
} from '../../../../Core/params/UpdatedProjectFlow/BasicProjectFormParams'

const props = withDefaults(
  defineProps<{
    selectedZones: SohwProjectZoonModel[]
    validationErrors?: BasicProjectValidationErrors
  }>(),
  { validationErrors: () => ({}) },
)

const emit = defineEmits<{
  updateZones: [value: { locationId: number; ZoneIds: number[] }[]]
  clearValidationError: [field: keyof BasicProjectValidationErrors]
}>()

const basic = defineModel<BasicProjectForm>('basic', { required: true })
const serialFields = defineModel<ProjectSerialField[]>('serialFields', { required: true })
const langDefault = defineModel<LangTitleValue[]>('langDefault', { required: true })
const langs = defineModel<LangTitleValue[]>('langs', { required: true })
const langsDescription = defineModel<LangDescriptionValue[]>('langsDescription', {
  required: true,
})
const contractorIds = defineModel<TitleInterface[]>('contractorIds', { required: true })
const locations = defineModel<TitleInterface[]>('locations', { required: true })

const contractorDialog = ref(false)
const locationVisible = ref(false)
const contractorController = IndexContractorController.getInstance()
const contractorParams = new IndexContractorParams('', 0, 0, 0)
const locationController = IndexLocationController.getInstance()
const locationParams = ref(new IndexLocationParams('', 0, 0, 0, LocationEnum.AREA))

const updateSerial = (data: { SerialNumber: string }) => {
  basic.value.serial = data.SerialNumber
}
const setLangTitles = (value: { locale: string; title?: string }[]) => {
  langs.value = value.map((item) => ({ ...item, title: item.title ?? '' }))
  emit('clearValidationError', 'projectName')
}
const setLangDescriptions = (value: { locale: string; description?: string }[]) => {
  langsDescription.value = value.map((item) => ({ ...item, description: item.description ?? '' }))
}
const setContractors = (value: TitleInterface | TitleInterface[] | null) => {
  contractorIds.value = Array.isArray(value) ? value : value ? [value] : []
  emit('clearValidationError', 'contractors')
}
const setLocations = (value: TitleInterface | TitleInterface[] | null) => {
  locations.value = Array.isArray(value) ? value : value ? [value] : []
  emit('clearValidationError', 'locations')
}
const reloadLocations = () => {
  locationParams.value = new IndexLocationParams('', 0, 0, 0, LocationEnum.AREA)
}
const setZones = (value: { locationId: number; ZoneIds: number[] }[]) => {
  emit('updateZones', value)
  emit('clearValidationError', 'zones')
}
</script>

<template>
  <div class="form-grid">
    <div class="section-title full">
      <span>01</span>
      <div>
        <h2>Basic project data</h2>
        <p>Define the project, its scope, and timeline.</p>
      </div>
    </div>
    <div class="input-wrapper" :class="{ 'field-has-error': props.validationErrors.projectName }">
      <LangTitleInput
        label="Project Name"
        :langs="langDefault"
        :model-value="langs"
        help-text="Enter the project name in each available language."
        @update:model-value="setLangTitles"
      />
      <small v-if="props.validationErrors.projectName" class="field-error">
        {{ props.validationErrors.projectName }}
      </small>
    </div>
    <div class="input-wrapper">
      <SwitchInput
        :fields="serialFields"
        :switch-title="$t('auto')"
        :is-auto="true"
        :switch-reverse="true"
        help-text="Enter a unique project serial number, or enable automatic generation to let the system create it."
        @update:value="updateSerial"
      />
    </div>
    <div class="input-wrapper" :class="{ 'field-has-error': props.validationErrors.contractors }">
      <UpdatedCustomInputSelect
        :required="true"
        :model-value="contractorIds"
        :type="2"
        :controller="contractorController"
        :params="contractorParams"
        label="sub contractors"
        placeholder="Select sub contractors"
        :is-dialog="true"
        v-model:dialog-visible="contractorDialog"
        @update:model-value="setContractors"
      >
        <template #LabelHeader>
          <span class="add-dialog" @click="contractorDialog = true">{{ $t('New') }}</span>
        </template>
        <template #Dialog><AddContractor @update:data="contractorDialog = false" /></template>
      </UpdatedCustomInputSelect>
      <small v-if="props.validationErrors.contractors" class="field-error">
        {{ props.validationErrors.contractors }}
      </small>
    </div>
    <div class="input-wrapper" :class="{ 'field-has-error': props.validationErrors.locations }">
      <UpdatedCustomInputSelect
        :required="true"
        :model-value="locations"
        :controller="locationController"
        :params="locationParams"
        label="location"
        placeholder="Select locations"
        :type="2"
        :onclick="() => (locationVisible = true)"
        @update:model-value="setLocations"
      />
      <small v-if="props.validationErrors.locations" class="field-error">
        {{ props.validationErrors.locations }}
      </small>
    </div>
    <label class="input-wrapper">
      <span class="required-label"> Start date <span aria-hidden="true">*</span> </span>
      <DatePicker
        v-model="basic.startDate"
        date-format="yy-mm-dd"
        placeholder="Select start date"
        required
        :invalid="Boolean(props.validationErrors.startDate)"
        @update:model-value="emit('clearValidationError', 'startDate')"
      />
      <small v-if="props.validationErrors.startDate" class="field-error">
        {{ props.validationErrors.startDate }}
      </small>
    </label>
    <label class="input-wrapper">
      <span class="required-label">End date <span aria-hidden="true">*</span> </span>
      <DatePicker
        v-model="basic.endDate"
        date-format="yy-mm-dd"
        placeholder="Select end date"
        :min-date="basic.startDate ?? undefined"
        required
        :invalid="Boolean(props.validationErrors.endDate)"
        @update:model-value="emit('clearValidationError', 'endDate')"
      />
      <small v-if="props.validationErrors.endDate" class="field-error">
        {{ props.validationErrors.endDate }}
      </small>
    </label>
    <label class="input-wrapper">
      <span class="required-label"> Cost <span aria-hidden="true">*</span></span>
      <input
        v-model="basic.cost"
        type="number"
        inputmode="decimal"
        min="0"
        step="0.01"
        required
        placeholder="0.00"
        :class="{ 'field-invalid': props.validationErrors.cost }"
        @input="emit('clearValidationError', 'cost')"
      />
      <small v-if="props.validationErrors.cost" class="field-error">
        {{ props.validationErrors.cost }}
      </small>
    </label>
    <div class="switch-row zone-switch">
      <span>
        <strong>Project has zones</strong>
        <small>Turn this on to select zones for the chosen locations.</small>
      </span>
      <ToggleSwitch v-model="basic.hasZoon" />
    </div>
    <div v-if="basic.hasZoon" class="input-wrapper full zone-selector">
      <label class="zone-label">
        <span>{{ $t('zones') }} <span class="required-star" aria-hidden="true">*</span></span>
        <AddProjectZoneDialog @update:data="setZones" />
      </label>
      <AddZoneDialog
        :locations="locations"
        :selected-zones="props.selectedZones"
        @update:data="setZones"
      />
      <small v-if="props.validationErrors.zones" class="field-error">
        {{ props.validationErrors.zones }}
      </small>
    </div>
    <div class="input-wrapper full">
      <LangTitleInput
        label="project_scope_of_work"
        :langs="langDefault"
        :model-value="langsDescription"
        field-type="description"
        type="textarea"
        placeholder="What is the project scope of work?"
        :required="false"
        help-text="Describe the scope, main activities, and work boundaries in each language."
        @update:model-value="setLangDescriptions"
      />
    </div>
    <LocationSelectDialog v-model:visible="locationVisible" @location-added="reloadLocations" />
  </div>
</template>

<style scoped src="../ProjectFlowStepStyles.css">
.switch-row.zone-switch {
  display: flex !important;
  flex-direction: row !important;
  span {
    width: fit-content !important;
  }
}

.required-label > span {
  color: #ef4444;
}

.field-error {
  display: block;
  margin-top: 6px;
  color: #c0392b;
  font-size: 12px;
  font-weight: 600;
}

.field-invalid {
  border-color: #ef4444;
}

.required-star {
  color: #ef4444;
}

.field-has-error :deep(.p-select),
.field-has-error :deep(.p-multiselect) {
  border-color: #ef4444;
}
</style>
