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
  LangDescriptionValue,
  LangTitleValue,
  ProjectSerialField,
} from '../../../../Core/params/UpdatedProjectFlow/BasicProjectFormParams'

defineProps<{ selectedZones: SohwProjectZoonModel[] }>()

const emit = defineEmits<{
  updateZones: [value: { locationId: number; ZoneIds: number[] }[]]
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
}
const setLangDescriptions = (value: { locale: string; description?: string }[]) => {
  langsDescription.value = value.map((item) => ({ ...item, description: item.description ?? '' }))
}
const setContractors = (value: TitleInterface | TitleInterface[] | null) => {
  contractorIds.value = Array.isArray(value) ? value : value ? [value] : []
}
const setLocations = (value: TitleInterface | TitleInterface[] | null) => {
  locations.value = Array.isArray(value) ? value : value ? [value] : []
}
const reloadLocations = () => {
  locationParams.value = new IndexLocationParams('', 0, 0, 0, LocationEnum.AREA)
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
    <div class="input-wrapper">
      <LangTitleInput
        label="Project Name"
        :langs="langDefault"
        :model-value="langs"
        help-text="Enter the project name in each available language."
        @update:model-value="setLangTitles"
      />
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
    <div class="input-wrapper">
      <UpdatedCustomInputSelect
        :required="false"
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
    </div>
    <div class="input-wrapper">
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
    </div>
    <label class="input-wrapper required-field">
      Start date
      <DatePicker
        v-model="basic.startDate"
        date-format="yy-mm-dd"
        placeholder="Select start date"
      />
    </label>
    <label>
      End date
      <DatePicker v-model="basic.endDate" date-format="yy-mm-dd" placeholder="Select end date" />
    </label>
    <label
      >Cost<input v-model="basic.cost" inputmode="decimal" required placeholder="0.00"
    /></label>
    <div class="switch-row zone-switch">
      <span>
        <strong>Project has zones</strong>
        <small>Turn this on to select zones for the chosen locations.</small>
      </span>
      <ToggleSwitch v-model="basic.hasZoon" />
    </div>
    <div v-if="basic.hasZoon" class="input-wrapper full zone-selector">
      <label class="zone-label">
        <span>{{ $t('zones') }}</span>
        <AddProjectZoneDialog @update:data="emit('updateZones', $event)" />
      </label>
      <AddZoneDialog
        :locations="locations"
        :selected-zones="selectedZones"
        @update:data="emit('updateZones', $event)"
      />
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
</style>
