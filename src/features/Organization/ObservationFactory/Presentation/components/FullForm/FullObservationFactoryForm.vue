<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'

import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import TabsSelection from '@/shared/HelpersComponents/TabsSelection.vue'
import DatePicker from 'primevue/datepicker'
import ObservationImage from '@/assets/images/create_obs.png'

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
import { useRoute } from 'vue-router'
import { SeverityEnum } from '../../../Core/Enums/SeverityEnum'
import { LikelihoodEnum } from '../../../Core/Enums/LikelihoodEnum'
import IndexHazardTypeParams from '@/features/setting/HazardType/Core/params/indexHazardTypeParams'
import IndexHazardTypeController from '@/features/setting/HazardType/Presentation/controllers/indexHazardTypeController'
import IndexAccidentsTypeController from '@/features/setting/AccidentsTypes/Presentation/controllers/indexAccidentsTypeController'
import IndexAccidentsTypeParams from '@/features/setting/AccidentsTypes/Core/params/indexAccidentsTypeParams'
import Checkbox from 'primevue/checkbox'
import SaveStatusSelector from '../Ovservation/SaveStatusSelector.vue'
import ObservationLevel from '../Ovservation/ObservationLevel.vue'
import HazerdType from '../Ovservation/HazerdType.vue'
import { markRaw } from 'vue'
import { SaveStatusEnum } from '../../../Core/Enums/save_status_enum'
import { RiskLevelEnum } from '../../../Core/Enums/risk_level_enum'
import { TypesEnum } from '../../../Core/Enums/types_enum'
import { HazardTypeParentEnum } from '@/features/setting/HazardType/Core/Enums/HazardTypeEnum'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import AddObserverationType from '@/features/setting/ObserverationType/Presentation/components/AddObserverationType.vue'
import AddFullEquipment from '@/features/setting/Equipment/Presentation/components/AddFullEquipment.vue'
import AddHazardType from '@/features/setting/HazardType/Presentation/components/AddHazardType.vue'
import AddAccidentsType from '@/features/setting/AccidentsTypes/Presentation/components/AddAccidentsType.vue'
import { ActionStatusEnum } from '../../../Core/Enums/ActionStatusEnum'
import IndexRootCausesController from '@/features/setting/RootCauses/Presentation/controllers/indexRootCausesController'
import IndexRootCausesParams from '@/features/setting/RootCauses/Core/params/indexRootCausesParams'

const emit = defineEmits(['update:data'])
const props = defineProps<{
  data?: HazardDetailsModel
}>()
const text = ref<string>('')
const date = ref<string>(new Date())
const descripe = ref<string>('')
const image = ref([])
const route = useRoute()
const ObservationFactoryType = ref(
  route?.path?.includes('incedant')
    ? Observation.AccidentsType
    : route?.path?.includes('hazard')
      ? Observation.HazardType
      : Observation.ObservationType,
)
const saveStatus = ref<SaveStatusEnum | null>(SaveStatusEnum.NotSaved)
const riskLevel = ref<RiskLevelEnum | null>(RiskLevelEnum.Low)
const isNearMiss = ref<boolean | number>(0)
const type = ref<TypesEnum>(TypesEnum.ObservationType)

const updateData = () => {
  const params = props.data?.id
    ? new EditHazardParams(
        props.data?.id! ?? 0,
        text.value,
        descripe.value,
        image.value?.map((el) => el?.file),
        0,
        ObservationFactoryType.value,
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
        title: ObservationTitle.value ?? '',
        description: text.value ?? null,
        image: image.value?.map((el) => el?.file) ?? null,
        typeId:
          ObservationFactoryType.value == Observation.ObservationType
            ? SelectedObservationType.value?.id
            : ObservationFactoryType.value == Observation.AccidentsType
              ? AccidentsType.value?.id
              : HazardType.value?.id,
        type: ObservationFactoryType.value,
        equipmentId: SelectedMachine.value?.id ?? null,
        zoonId: ZoneIds.value ?? null,
        projectId: SelectedProjectId.value ?? null,
        isResult: 0,
        riskLevel: riskLevel.value,
        saveStatus: saveStatus.value,
        action: preventive_action.value ?? null,
        isNearMiss: riskLevel.value === RiskLevelEnum.Medium ? (isNearMiss.value ? 1 : 0) : 0,
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
                  Accidents?.value?.isWorkStopped == 1 ? 0 : 1,
                  Accidents?.value?.accidentsImages || [],
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

        severity: SelectedSeverity.value?.id,
        Likelihood: SelectedLikelihood.value?.id,
        time: SelctedTime.value,
        place: PlaceText.value,
        isWorkStopped: isWorkStopped.value ? 1 : 0,
        HazardTypeId: HazardType.value?.id,
        HazardSubtypeId: SubHazardType.value?.id,
        actionstatus: solved.value,
        code: SerialNumber.value?.SerialNumber,
        RootCausesId: RootCauses.value?.map((item) => item.id),
      })
  console.log(solved.value, 'solved.value')
  emit('update:data', params)
}

watch([() => props.data], ([newData]) => {}, { immediate: true })

const indexEquipmentParams = new IndexEquipmentParams('', 1, 10, 1)
const indexEquipmentController = IndexEquipmentController.getInstance()
const SelectedMachine = ref<TitleInterface | null>(null)
const setMachine = (data: TitleInterface | null) => {
  SelectedMachine.value = data
  updateData()
}

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
const takeAction = ref<'yes' | 'no' | null>('no')
const showSolvedAndDescription = computed(() => takeAction.value === 'yes')
const solved = ref<ActionStatusEnum | null>(ActionStatusEnum.CLOSED)
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

const SelectedSeverity = ref<TitleInterface>()
const SeverityList = ref<TitleInterface[]>([
  new TitleInterface({ id: SeverityEnum.Catastrophic, title: 'a - Catastrophic' }),
  new TitleInterface({ id: SeverityEnum.Major, title: 'b - Major' }),
  new TitleInterface({ id: SeverityEnum.Serious, title: 'c - Serious' }),
  new TitleInterface({ id: SeverityEnum.Moderate, title: 'd - Moderate' }),
  new TitleInterface({ id: SeverityEnum.Minor, title: 'e - Minor' }),
])
const SelectedLikelihood = ref<TitleInterface>()
const LikelihoodList = ref<TitleInterface[]>([
  new TitleInterface({ id: LikelihoodEnum.Rare, title: '1 - Rare' }),
  new TitleInterface({ id: LikelihoodEnum.Unlikely, title: '2 - Unlikely' }),
  new TitleInterface({ id: LikelihoodEnum.Possible, title: '3 - Possible' }),
  new TitleInterface({ id: LikelihoodEnum.Likely, title: '4 - Likely' }),
  new TitleInterface({ id: LikelihoodEnum.AlmostCertain, title: '5 - Almost Certain' }),
])

const setSeverity = (data: TitleInterface) => {
  SelectedSeverity.value = data
  updateData()
  CalcObservationLevel()
}
const setLikelihood = (data: TitleInterface) => {
  SelectedLikelihood.value = data
  updateData()
  CalcObservationLevel()
}

const ObservationLevelValue = ref<number>()
const CalcObservationLevel = () => {
  ObservationLevelValue.value = Number(
    Number(SelectedSeverity.value?.id) * Number(SelectedLikelihood.value?.id),
  )

  if (ObservationLevelValue.value > 1 && ObservationLevelValue.value < 5) {
    riskLevel.value = RiskLevelEnum.Low
  } else if (ObservationLevelValue.value > 4 && ObservationLevelValue.value < 10) {
    riskLevel.value = RiskLevelEnum.Medium
  } else if (ObservationLevelValue.value > 9 && ObservationLevelValue.value < 16) {
    riskLevel.value = RiskLevelEnum.High
  } else if (ObservationLevelValue.value > 15 && ObservationLevelValue.value < 25) {
    riskLevel.value = RiskLevelEnum.High
  }
}

watch(
  () => route.path,
  (newVal) => {
    ObservationFactoryType.value = newVal.includes('incedant')
      ? Observation.AccidentsType
      : newVal.includes('hazard')
        ? Observation.HazardType
        : Observation.ObservationType
    console.log(ObservationFactoryType.value, 'ObservationFactoryType.value')
  },
  { immediate: true },
)

const GetObservationType = (type) => {
  return Observation[type]
}

const indexObservatioTyepController = IndexObserverationTypeController.getInstance()
const indexObservationTypeParams = new IndexObserverationTypeParams('', 1, 10, 0)
const SelectedObservationType = ref<TitleInterface>()
const setSelectedObservationType = (data: TitleInterface) => {
  SelectedObservationType.value = data
  updateData()
}

const indexHazardTypeParams = new IndexHazardTypeParams(
  '',
  1,
  10,
  0,
  null,
  HazardTypeParentEnum?.Parent,
)
const indexHazardTypeController = IndexHazardTypeController.getInstance()

const HazardType = ref<TitleInterface>()
const setHazardType = (data: TitleInterface) => {
  HazardType.value = data
  updateData()
}

const indexSubHazardTypeParams = ref(
  new IndexHazardTypeParams('', 1, 10, 0, HazardType?.value?.id, HazardTypeParentEnum?.Child),
)
const indexSubHazardTypeController = IndexHazardTypeController.getInstance()
const SubHazardType = ref<TitleInterface>()
const setSubHazardType = (data: TitleInterface) => {
  SubHazardType.value = data
  updateData()
}

const indexAccidentsTypeController = IndexAccidentsTypeController.getInstance()
const indexAccidentsTypeParams = new IndexAccidentsTypeParams('', 1, 10, 0)
const AccidentsType = ref<TitleInterface>()
const setAccidentsType = (data: TitleInterface) => {
  AccidentsType.value = data
  updateData()
}

const isWorkStopped = ref()
const UpdateWorkStatus = (data) => {
  isWorkStopped.value = data?.target?.checked
  updateData()
}

const handleObservationLevel = (data: any) => {
  riskLevel.value = data.level
  isNearMiss.value = data.is_near_miss
  type.value = data.is_near_miss === 1 ? TypesEnum.HazardType : TypesEnum.ObservationType
  updateData()
}

const GetHeader = (value: number) => {
  return Observation[value] == 'ObservationType'
    ? 'Observation'
    : Observation[value] == 'HazardType'
      ? 'Hazard'
      : 'incident'
}

watch(
  () => HazardType.value,
  () => {
    indexSubHazardTypeParams.value = new IndexHazardTypeParams(
      '',
      1,
      10,
      0,
      HazardType?.value?.id,
      HazardTypeParentEnum?.Child,
    )
  },
  { immediate: true },
)

//Dialouges Re
const observationTypeDialog = ref(false)
const machineDialogRef = ref(false)
const acedentDialogRef = ref(false)

const UpdateSaveStatus = (data: SaveStatusEnum) => {
  saveStatus.value = data
  updateData()
}

const ObservationTitle = ref<string>()
const indexRootCaueseController = IndexRootCausesController.getInstance()
const indexRootCaueseParams = new IndexRootCausesParams('', 1, 10, 0)
const RootCauses = ref<TitleInterface[]>([])
const setRootCause = (data: TitleInterface[]) => {
  RootCauses.value = data
  updateData()
}
</script>

<template>
  <div class="full-observation-form col-span-6 grid items-start grid-cols-1 md:grid-cols-6 gap-4">
    <div class="col-span-6 md:col-span-6">
      <HeaderPage
        :title="`create ${GetHeader(ObservationFactoryType)}`"
        :subtitle="'Identify and report potential Incedants before they cause harm'"
        :img="ObservationImage"
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
          {{ GetHeader(ObservationFactoryType) }} form
          <!-- <span v-if="SerialNumber">( #{{ SerialNumber.SerialNumber }} )</span> -->
        </p>
      </div>
    </div>

    <!-- title -->
    <div class="input-wrapper col-span-6">
      <label for="time">title</label>
      <input type="text" v-model="ObservationTitle" @input="updateData" placeholder="Enter title" />
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
    <div class="input-wrapper col-span-2 md:grid-cols-12" v-if="!data?.id">
      <SwitchInput
        :fields="fields"
        :switch_title="$t('auto')"
        :switch_reverse="true"
        :is-auto="true"
        @update:value="UpdateSerial"
      />
    </div>

    <!-- Place -->
    <div class="input-wrapper col-span-3 md:grid-cols-12">
      <label for="time">Place</label>
      <input type="text" v-model="PlaceText" @input="updateData" placeholder="Enter Place" />
    </div>

    <!-- Observation Type -->
    <div
      class="col-span-3 md:col-span-3 input-wrapper"
      v-if="ObservationFactoryType == Observation.ObservationType"
    >
      <!-- <CustomSelectInput
      :required="false" :modelValue="SelectedObservationType"
        :controller="indexObservatioTyepController"
        :params="indexObservationTypeParams"
         label="Observation Type "
        id="Equipment" placeholder="Select Observation Type"
        @update:modelValue="setSelectedObservationType" /> -->

      <!-- <CustomSelectInput
                 New Update => Custom input Select inspection Observisoon Form
        /> -->

      <UpdatedCustomInputSelect
        :required="false"
        :modelValue="SelectedObservationType"
        :controller="indexObservatioTyepController"
        :params="indexObservationTypeParams"
        label="Observation Type "
        id="Equipment"
        placeholder="Select Observation Type"
        @update:modelValue="setSelectedObservationType"
        @close="observationTypeDialog = false"
        :isDialog="true"
        :dialogVisible="observationTypeDialog"
      >
        <template #LabelHeader>
          <span class="add-dialog" @click="observationTypeDialog = true">New</span>
        </template>
        <template #Dialog>
          <AddObserverationType @update:data="observationTypeDialog = false" />
        </template>
      </UpdatedCustomInputSelect>
    </div>

    <!-- Incedant Type -->
    <div
      class="col-span-3 md:col-span-3 input-wrapper"
      v-if="ObservationFactoryType == Observation.AccidentsType"
    >
      <!-- <CustomSelectInput
        :modelValue="AccidentsType"
        class="input"
        :controller="indexAccidentsTypeController"
        :params="indexAccidentsTypeParams"
        label="Incidant Type"
        id="incedant"
        placeholder="Select Incedant Type"
        @update:modelValue="setAccidentsType"
      /> -->

      <UpdatedCustomInputSelect
        :modelValue="AccidentsType"
        class="input"
        :controller="indexAccidentsTypeController"
        :params="indexAccidentsTypeParams"
        label="incident Type"
        id="incident"
        placeholder="Select Incident Type"
        @update:modelValue="setAccidentsType"
        @close="acedentDialogRef = false"
        :isDialog="true"
        :dialogVisible="acedentDialogRef"
      >
        <template #LabelHeader>
          <span class="add-dialog" @click="acedentDialogRef = true">New</span>
        </template>
        <template #Dialog>
          <AddAccidentsType @update:data="acedentDialogRef = false" />
        </template>
      </UpdatedCustomInputSelect>
    </div>

    <!-- Machine -->
    <div class="col-span-3 md:col-span-3 input-wrapper">
      <UpdatedCustomInputSelect
        :modelValue="SelectedMachine"
        class="input"
        :controller="indexRootCaueseController"
        :params="indexRootCaueseParams"
        label="select Root Cause"
        id="rootCause"
        placeholder="select your root cause"
        @update:modelValue="setRootCause"
        :type="2"
      />
    </div>

    <div class="col-span-3 md:col-span-3 input-wrapper">
      <!-- <CustomSelectInput
        :modelValue="SelectedMachine"
        class="input"
        :controller="indexEquipmentController"
        :params="indexEquipmentParams"
        label="select machine (optional)"
        id="machine"
        placeholder="select your machine"
        @update:modelValue="setMachine"
      /> -->

      <UpdatedCustomInputSelect
        :modelValue="SelectedMachine"
        class="input"
        :controller="indexEquipmentController"
        :params="indexEquipmentParams"
        label="select Equipment (optional)"
        id="machine"
        placeholder="select your machine"
        @update:modelValue="setMachine"
        @close="machineDialogRef = false"
        :isDialog="true"
        :dialogVisible="machineDialogRef"
      >
        <template #LabelHeader>
          <span class="add-dialog" @click="machineDialogRef = true">New</span>
        </template>
        <template #Dialog>
          <AddFullEquipment @update:data="machineDialogRef = false" />
        </template>
      </UpdatedCustomInputSelect>
    </div>

    <!-- description -->
    <div class="col-span-6 md:col-span-6 input-wrapper">
      <label for="text">{{ $t('description') }}</label>
      <input
        placeholder="Add your description"
        type="text"
        class="input"
        id="text"
        v-model="text"
        @input="updateData"
      />
    </div>

    <!-- Image -->
    <div class="col-span-6 md:col-span-6 input-wrapper w-full">
      <label for="">upload image</label>
      <MultiImagesInput :initialImages="image" @update:images="setImages" />
    </div>

    <!-- Description -->
    <!-- <div class="col-span-6 md:col-span-6 input-wrapper w-full">
      <label for="descripe">descripe <span class="optional">(optional)</span></label>
      <textarea v-model="descripe" id="descripe" placeholder="add your descripe"></textarea>
    </div> -->

    <!-- Save Status Positive or Negative -->
    <div
      class="col-span-6 md:col-span-6 input-wrapper w-full"
      v-if="ObservationFactoryType != Observation.AccidentsType"
    >
      <SaveStatusSelector :modelValue="saveStatus" @update:saveStatus="UpdateSaveStatus" />
    </div>
    <!-- Sevarity -->
    <div
      class="col-span-3 md:col-span-3"
      v-if="
        ObservationFactoryType != Observation?.AccidentsType &&
        saveStatus == SaveStatusEnum.NotSaved
      "
    >
      <CustomSelectInput
        :required="false"
        :modelValue="SelectedSeverity"
        :static-options="SeverityList"
        label="Severity"
        id="Severity"
        placeholder="Select Severity"
        @update:modelValue="setSeverity"
      />
    </div>

    <!-- Likelihood -->
    <div
      class="col-span-3 md:col-span-3"
      v-if="
        ObservationFactoryType != Observation?.AccidentsType &&
        saveStatus == SaveStatusEnum.NotSaved
      "
    >
      <CustomSelectInput
        :required="false"
        :modelValue="SelectedLikelihood"
        :static-options="LikelihoodList"
        label="Likelihood"
        id="Likelihood"
        placeholder="Select Likelihood"
        @update:modelValue="setLikelihood"
      />
    </div>

    <!-- Observation Level -->
    <div
      class="col-span-6 md:col-span-6 input-wrapper w-full"
      v-if="
        saveStatus == SaveStatusEnum.NotSaved && ObservationFactoryType != Observation.AccidentsType
      "
    >
      <ObservationLevel
        :modelRiskLevel="riskLevel"
        :modelIsNearMiss="isNearMiss"
        @update:data="handleObservationLevel"
      />
    </div>
    <!-- Hazard Type -->
    <div
      class="col-span-3 md:col-span-3 input-wrapper"
      v-if="
        saveStatus == SaveStatusEnum.NotSaved && ObservationFactoryType != Observation.AccidentsType
      "
    >
      <CustomSelectInput
        :modelValue="HazardType"
        class="input"
        :controller="indexHazardTypeController"
        :params="indexHazardTypeParams"
        label="HazardType"
        id="HazardType"
        placeholder="Select Hazard Type"
        @update:modelValue="setHazardType"
      />
    </div>

    <!--Sub Hazard Type -->
    <div
      class="col-span-3 md:col-span-3 input-wrapper"
      v-if="HazardType && ObservationFactoryType != Observation.AccidentsType"
    >
      <CustomSelectInput
        :modelValue="SubHazardType"
        class="input"
        :controller="indexSubHazardTypeController"
        :params="indexSubHazardTypeParams"
        label="Hazard"
        id="Hazard"
        placeholder="Select Hazard"
        @update:modelValue="setSubHazardType"
      />
    </div>

    <!-- IsWorkStopped -->
    <div
      v-if="saveStatus == SaveStatusEnum.NotSaved"
      class="col-span-6 md:col-span-6 input-wrapper w-full is-stopped"
      @click="
        isWorkStopped = !isWorkStopped
        updateData()
      "
    >
      <label for="is_stoped">{{ $t('is_work_stopped') }}</label>
      <Checkbox
        binary
        :modelValue="isWorkStopped"
        @change="UpdateWorkStatus"
        inputId="is_stoped"
        :name="`is_stoped`"
      />
    </div>

    <!-- Take Action -->
    <div
      v-if="saveStatus == SaveStatusEnum.NotSaved"
      class="hazard-type-container incedant col-span-6 md:col-span-6"
    >
      <div class="input-wrapper radio-container incedant col-span-12 md:col-span-12">
        <div class="col-span-12 md:col-span-12">
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

        <div class="col-span-12 md:col-span-12" v-show="showSolvedAndDescription">
          <label class="radio-title">{{ $t('Status') }}</label>
          <div class="radio-answers flex">
            <div class="radio-selection" :class="{ selected: solved === ActionStatusEnum.CLOSED }">
              <RadioButton
                id="closed"
                v-model="solved"
                name="solved"
                :value="ActionStatusEnum.CLOSED"
                @update:model-value="updateData"
              />
              <label for="closed">Closed</label>
            </div>

            <div class="radio-selection" :class="{ selected: solved === ActionStatusEnum.OPEN }">
              <RadioButton
                id="open"
                v-model="solved"
                name="solved"
                :value="ActionStatusEnum.OPEN"
                @update:model-value="updateData"
              />
              <label for="open">Open</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Description -->
    <div
      v-if="saveStatus == SaveStatusEnum.NotSaved"
      class="input-wrapper col-span-6 md:col-span-6"
      v-show="showSolvedAndDescription"
    >
      <label for="action">{{ $t('action') }}</label>
      <textarea
        id="action"
        class="input"
        v-model="preventive_action"
        @input="updateData"
        placeholder="add your descripe"
      ></textarea>
    </div>

    <!-- Factorywitnesses -->

    <div
      class="col-span-6 md:col-span-6 input-wrapper w-full"
      v-if="
        saveStatus == SaveStatusEnum.NotSaved &&
        ObservationFactoryType != Observation?.ObservationType
      "
    >
      <Factorywitnesses class="not-colored" @update:data="Updatewitnesses" />
    </div>

    <!-- FactoryAccidents -->
    <!-- v-if="ObservationFactoryType != Observation?.ObservationType" -->
    <div
      class="col-span-6 md:col-span-6 input-wrapper w-full"
      v-if="
        saveStatus == SaveStatusEnum.NotSaved &&
        ObservationFactoryType != Observation?.ObservationType
      "
    >
      <FactoryAccidents idents class="not-colored" @update:data="UpdateAccidents" />
    </div>

    <!-- FactoryFatalities -->
    <!-- v-if="ObservationFactoryType != Observation?.ObservationType" -->
    <div
      class="col-span-6 md:col-span-6 input-wrapper w-full"
      v-if="
        saveStatus == SaveStatusEnum.NotSaved &&
        ObservationFactoryType != Observation?.ObservationType
      "
    >
      <FactoryFatalities class="not-colored" @update:data="UpdateFatalities" />
    </div>
  </div>
</template>

<style scoped>
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
</style>
