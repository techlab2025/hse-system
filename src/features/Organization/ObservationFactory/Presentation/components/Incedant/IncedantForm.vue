<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'

import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import TabsSelection from '@/shared/HelpersComponents/TabsSelection.vue'
import DatePicker from 'primevue/datepicker'
import HazardImage from '@/assets/images/alert 2.png'

import IndexEquipmentParams from '@/features/setting/Equipment/Core/params/indexEquipmentParams'
import FileUpload from '@/shared/FormInputs/FileUpload.vue'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import { title } from 'process'
import type HazardDetailsModel from '../../../Data/models/hazardDetailsModel'
import EditHazardParams from '../../../Core/params/editHazardParams'
import AddHazardParams from '../../../Core/params/addHazardParams'
import IndexHazardParams from '../../../Core/params/indexHazardParams'
import IndexHazardController from '../../controllers/indexHazardController'
import { Observation } from '../../../Core/Enums/ObservationTypeEnum'
import IndexEquipmentController from '@/features/setting/Equipment/Presentation/controllers/indexEquipmentController'
import MultiImagesInput from '@/shared/FormInputs/MultiImagesInput.vue'
import HeaderProjectsFilter from '../Hazard/HazardUtils/HeaderProjectsFilter.vue'
import FetchMyProjectsParams from '../../../Core/params/fetchMyProjectsParams'
import FetchMyProjectsController from '../../controllers/FetchMyProjectsController'
import type MyProjectsModel from '@/features/Organization/ObservationFactory/Data/models/MyProjectsModel'
import FactoryAccidents from '../FactoryUtils/FactoryAccidents.vue'
import Factorywitnesses from '../FactoryUtils/Factorywitnesses.vue'
import FactoryFatalities from '../FactoryUtils/FactoryFatalities.vue'
import InjuryParams from '../../../Core/params/InjuriesParams'
import DethParams from '../../../Core/params/DethParams'
import WitnessParams from '../../../Core/params/WitnessesParams'
import RadioButton from 'primevue/radiobutton'
import IndexObserverationTypeController from '@/features/setting/ObserverationType/Presentation/controllers/indexObserverationTypeController'
import IndexObserverationTypeParams from '@/features/setting/ObserverationType/Core/params/indexObserverationTypeParams'
import SwitchInput from '@/shared/FormInputs/SwitchInput.vue'

const emit = defineEmits(['update:data'])
const props = defineProps<{
  data?: HazardDetailsModel
}>()
const text = ref<string>('')
const date = ref<string>(new Date())
const descripe = ref<string>('')
const image = ref([])

const updateData = () => {
  const params = props.data?.id
    ? new EditHazardParams(
        props.data?.id! ?? 0,
        text.value,
        descripe.value,
        image.value?.map((el) => el?.file),

        0,
        Observation.AccidentsType,
        SelectedMachine.value?.id ?? null,
        ZoneIds.value ?? 0,
        SelectedProjectId.value,
        0,
        0,
        0,
        '',
        0,
        0,
        date.value ?? '',
        [],
        0,
      )
    : new AddHazardParams({
        title: text.value ?? null,
        description: descripe.value ?? null,
        image: image.value?.map((el) => el?.file) ?? null,
        typeId: 0,
        type: Observation.AccidentsType ?? null,
        equipmentId: SelectedMachine.value?.id ?? null,
        zoonId: ZoneIds.value ?? null,
        projectId: SelectedProjectId.value ?? null,
        isResult: 0,
        riskLevel: 0,
        saveStatus: 0,
        action: preventive_action.value ?? null,
        isNearMiss: 0,
        capaStatus: 0,
        date: date.value ?? null,
        capa: [],
        isAction: takeAction.value === 'yes' ? 1 : 0,
        isThereInjuries: Accidents?.value?.isAnotherMeeting === 1 ? true : false,
        isThereDeath: Fatalities?.value?.isAnotherMeeting === 1 ? true : false,
        isThereWitnessStatement: witnesses?.value?.isAnotherMeeting === 1 ? true : false,
        Injury:
          Accidents?.value?.isAnotherMeeting === 1
            ? [
                new InjuryParams(
                  Accidents?.value?.employeeId || [],
                  Accidents?.value?.employeeName || '',
                  Accidents?.value?.text || null,
                  Accidents?.value?.infectionTypeId || 0,
                ),
              ]
            : [],
        deaths:
          Fatalities?.value?.isAnotherMeeting === 1
            ? [
                new DethParams(
                  Fatalities?.value?.text || '',
                  Fatalities?.value?.SelectedEmployee || 0,
                  Fatalities?.value?.img || [],
                ),
              ]
            : [],
        witnesses:
          witnesses?.value?.isAnotherMeeting === 1
            ? witnesses?.value?.AllWitnessesData?.map(
                (w: any) => new WitnessParams(w?.text || [], w?.employee?.id || '', null),
              )
            : [],

        severity: 0,
        Likelihood: 0,
        time: SelctedTime.value,
        code: SerialNumber.value?.SerialNumber,
        place: PlaceText.value,
      })
  emit('update:data', params)
}

watch([() => props.data], ([newData]) => {}, { immediate: true })

// const indexHazardTypeParams = new IndexHazardParams('', 1, 10, 1)
// const indexHazardTypeController = IndexHazardController.getInstance()
const HazardType = ref<TitleInterface[]>([])
const setHazardType = (data: TitleInterface[]) => {
  HazardType.value = data
  updateData()
}
const indexEquipmentParams = new IndexEquipmentParams('', 1, 10, 1)
const indexEquipmentController = IndexEquipmentController.getInstance()
const SelectedMachine = ref<TitleInterface | null>(null)
const setMachine = (data: TitleInterface | null) => {
  SelectedMachine.value = data
  updateData()
}

// const setImage = async (data: File) => {
//   image.value = await filesToBase64(data)
//   updateData()
// }
const ZoneIds = ref<number>()
const GetZones = (data: number) => {
  ZoneIds.value = data
  updateData()
}

const setImages = async (data: string[]) => {
  image.value = typeof data === 'string' ? data : await filesToBase64(data)
  updateData()
}

const Projects = ref<MyProjectsModel[]>([])
const FetchMyProjects = async () => {
  const fetchMyProjectsParams = new FetchMyProjectsParams()
  const fetchMyProjectsController = FetchMyProjectsController.getInstance()
  const res = await fetchMyProjectsController.getData(fetchMyProjectsParams)
  if (res.value.data) {
    Projects.value = res.value.data
  }
}
onMounted(() => {
  FetchMyProjects()
})

const SelectedProjectId = ref<number>()
const GetProjectId = (id: number) => {
  SelectedProjectId.value = id
  updateData()
}

const Accidents = ref()
const UpdateAccidents = (data: any) => {
  Accidents.value = data
  updateData()
}
const witnesses = ref()
const Updatewitnesses = (data: any) => {
  witnesses.value = data
  console.log(witnesses.value, 'witnesses.value')
  updateData()
}
const Fatalities = ref()
const UpdateFatalities = (data: any) => {
  Fatalities.value = data
  console.log(Fatalities.value, 'Fatalities.value')
  updateData()
}
const takeAction = ref<'yes' | 'no' | null>()
const showSolvedAndDescription = computed(() => takeAction.value === 'yes')
const solved = ref<'yes' | 'no' | null>()
const preventive_action = ref<string>()

const SelctedTime = ref<Date>(new Date())
const PlaceText = ref<string>()
const SerialNumber = ref()

const fields = ref([
  {
    key: 'SerialNumber',
    label: 'serial_number',
    placeholder: 'You can leave it (auto-generated)',
    value: SerialNumber.value,
    enabled: props?.data?.id ? false : true,
  },
])

const UpdateSerial = (data) => {
  SerialNumber.value = data
  updateData()
}
</script>

<template>
  <div class="col-span-6 md:col-span-6">
    <HeaderPage
      :title="'create Incedant'"
      :subtitle="'Identify and report potential Incedants before they cause harm'"
      :img="HazardImage"
    />
    <HeaderProjectsFilter class="colored" :projects="Projects" @update:data="GetProjectId" />
  </div>

  <div class="col-span-6 md:col-span-6">
    <TabsSelection
      v-if="SelectedProjectId"
      :ProjectId="SelectedProjectId"
      @update:data="GetZones"
    />
  </div>
  <div class="Hazard-form col-span-6 md:col-span-6">
    <div class="Hazard-form-header">
      <HazardIcon class="icon" />
      <p class="title">
        Incedant form
        <!-- <span>( #001 )</span> -->
      </p>
    </div>
  </div>

  <!-- Date -->
  <div class="col-span-2 md:col-span-2 input-wrapper">
    <label for="date">Date</label>
    <DatePicker v-model="date" placeholder="Add your date" />
  </div>

  <!-- Time -->
  <div class="input-wrapper col-span-2 md:grid-cols-12">
    <label for="time">time</label>
    <DatePicker
      v-model="SelctedTime"
      class="mt-4 mr-2 input date-picker"
      placeholder="Select time"
      @update:model-value="updateData"
      input-id="time"
      :time-only="true"
    />
  </div>

  <!-- Serial -->
  <div class="col-span-2 md:grid-cols-12" v-if="!data?.id">
    <SwitchInput
      :fields="fields"
      :switch_title="$t('auto')"
      :switch_reverse="true"
      @update:value="UpdateSerial"
    />
  </div>

  <!-- Place -->
  <div class="input-wrapper col-span-3 md:grid-cols-12">
    <label for="time">Placa</label>
    <input type="text" v-model="PlaceText" @input="updateData" placeholder="Enter Place" />
  </div>

  <!-- description -->
  <div class="col-span-3 md:col-span-3 input-wrapper">
    <label for="text">{{ $t('description') }}</label>
    <input
      placeholder="Add your title"
      type="text"
      class="input"
      id="text"
      v-model="text"
      @input="updateData"
    />
  </div>

  <!-- Machine -->
  <div class="col-span-3 md:col-span-3 input-wrapper">
    <CustomSelectInput
      :modelValue="SelectedMachine"
      class="input"
      :controller="indexEquipmentController"
      :params="indexEquipmentParams"
      label="select machine (optional)"
      id="machine"
      placeholder="select your machine"
      @update:modelValue="setMachine"
    />
  </div>

  <!-- Image -->
  <div class="col-span-6 md:col-span-6 input-wrapper w-full">
    <label for="">upload image</label>
    <MultiImagesInput :initialImages="image" @update:images="setImages" />
  </div>

  <div class="hazard-type-container incedant col-span-6 md:col-span-6">
    <div class="input-wrapper radio-container incedant col-span-6 md:col-span-6">
      <div class="col-span-12 md:col-span-6">
        <label class="radio-title">{{ $t('take action') }}</label>
        <div class="radio-answers flex">
          <div class="radio-selection" :class="{ selected: takeAction === 'yes' }">
            <RadioButton
              v-model="takeAction"
              name="takeAction"
              value="yes"
              @update:model-value="updateData"
            />
            <label>Yes</label>
          </div>

          <div class="radio-selection" :class="{ selected: takeAction === 'no' }">
            <RadioButton
              v-model="takeAction"
              name="takeAction"
              value="no"
              @update:model-value="updateData"
            />
            <label>No</label>
          </div>
        </div>
      </div>

      <div class="col-span-12 md:col-span-6" v-show="showSolvedAndDescription">
        <label class="radio-title">{{ $t('solved') }}</label>
        <div class="radio-answers flex">
          <div class="radio-selection" :class="{ selected: solved === 'yes' }">
            <RadioButton
              v-model="solved"
              name="solved"
              value="yes"
              @update:model-value="updateData"
            />
            <label>Yes</label>
          </div>

          <div class="radio-selection" :class="{ selected: solved === 'no' }">
            <RadioButton
              v-model="solved"
              name="solved"
              value="no"
              @update:model-value="updateData"
            />
            <label>No</label>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="input-wrapper col-span-6 md:col-span-6" v-show="showSolvedAndDescription">
    <label for="action">{{ $t('preventive_action') }}</label>
    <textarea
      id="action"
      class="input"
      v-model="preventive_action"
      @input="updateData"
      placeholder="add your descripe"
    ></textarea>
  </div>

  <div class="col-span-6 md:col-span-6 input-wrapper w-full">
    <label for="descripe">descripe <span class="optional">(optional)</span></label>
    <textarea v-model="descripe" id="descripe" placeholder="add your descripe"></textarea>
  </div>

  <div class="col-span-6 md:col-span-6 input-wrapper w-full">
    <FactoryAccidents class="not-colored" @update:data="UpdateAccidents" />
  </div>
  <div class="col-span-6 md:col-span-6 input-wrapper w-full">
    <Factorywitnesses class="not-colored" @update:data="Updatewitnesses" />
  </div>
  <div class="col-span-6 md:col-span-6 input-wrapper w-full">
    <FactoryFatalities class="not-colored" @update:data="UpdateFatalities" />
  </div>
</template>
