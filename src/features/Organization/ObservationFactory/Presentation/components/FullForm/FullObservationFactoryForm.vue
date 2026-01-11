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

const emit = defineEmits(['update:data'])
const props = defineProps<{
  data?: HazardDetailsModel
}>()
const text = ref<string>('')
const date = ref<string>(new Date())
const descripe = ref<string>('')
const image = ref([])
const route = useRoute()
const ObservationFactoryType = ref(route?.path?.includes('incedant') ? Observation.AccidentsType : route?.path?.includes('hazard') ? Observation.HazardType : Observation.ObservationType)
const saveStatus = ref<SaveStatusEnum | null>(SaveStatusEnum.NotSaved)
const riskLevel = ref<RiskLevelEnum | null>(RiskLevelEnum.Low)
const isNearMiss = ref<boolean | number>(0)
const type = ref<TypesEnum>(TypesEnum.ObservationType)

const updateData = () => {
  console.log(Accidents?.value?.isAnotherMeeting, "Accidents?.value?.isAnotherMeeting")
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
      title: text.value ?? null,
      description: descripe.value ?? null,
      image: image.value?.map(el => el?.file) ?? null,
      typeId: SelectedObservationType.value?.id || HazardType?.value?.id || AccidentsType?.value?.id || null,
      type: ObservationFactoryType.value,
      equipmentId: SelectedMachine.value?.id ?? null,
      zoonId: ZoneIds.value ?? null,
      projectId: SelectedProjectId.value ?? null,
      isResult: 0,
      riskLevel: riskLevel.value,
      saveStatus: saveStatus.value,
      action: preventive_action.value ?? null,
      isNearMiss: riskLevel.value === RiskLevelEnum.Medium ? isNearMiss.value ? 1 : 0 : 0,
      capaStatus: 0,
      date: date.value ?? null,
      capa: [],
      isAction: takeAction.value === "yes" ? 1 : 0,
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
              Accidents?.value?.accidentsImages || []
            )
          ]
          : [],
      deaths:
        Fatalities?.value?.isAnotherMeeting === 1
          ? [
            new DethParams(
              Fatalities?.value?.text || '',
              Fatalities?.value?.SelectedEmployee || 0,
              Fatalities?.value?.img || []
            )
          ]
          : [],
      witnesses:
        witnesses?.value?.isAnotherMeeting === 1
          ? witnesses?.value?.AllWitnessesData?.map(
            (w: any) =>
              new WitnessParams(
                w?.text || [],
                w?.employee?.id || '',
                null
              )
          )
          : [],

      severity: 0,
      Likelihood: 0,
      time: SelctedTime.value,
      code: SerialNumber.value?.SerialNumber,
      place: PlaceText.value,
      isWorkStopped: isWorkStopped.value ? 1 : 0,
      HazardTypeId: HazardType.value?.id,
      HazardSubtypeId: SubHazardType.value?.id

    })
  console.log(isWorkStopped.value, "isWorkStopped.value");
  emit('update:data', params)
}

watch([() => props.data], ([newData]) => { }, { immediate: true })

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
  updateData();
}

const Accidents = ref()
const UpdateAccidents = (data: any) => {
  Accidents.value = data
  updateData()
}
const witnesses = ref()
const Updatewitnesses = (data: any) => {
  witnesses.value = data
  console.log(witnesses.value, "witnesses.value");
  updateData()
}
const Fatalities = ref()
const UpdateFatalities = (data: any) => {
  Fatalities.value = data
  console.log(Fatalities.value, "Fatalities.value");
  updateData()
}
const takeAction = ref<'yes' | 'no' | null>("no")
const showSolvedAndDescription = computed(() => takeAction.value === 'yes')
const solved = ref<'yes' | 'no' | null>()
const preventive_action = ref<string>()


const SelctedTime = ref<Date>(new Date())
const PlaceText = ref<string>()
const SerialNumber = ref()

const fields = ref([
  { key: 'SerialNumber', label: 'serial_number', placeholder: 'You can leave it (auto-generated)', value: SerialNumber.value, enabled: props?.data?.id ? false : true },
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
  ObservationLevelValue.value = Number(Number(SelectedSeverity.value?.id) * Number(SelectedLikelihood.value?.id))

  if (ObservationLevelValue.value > 1 && ObservationLevelValue.value < 5) {
    riskLevel.value = RiskLevelEnum.Low
  }
  else if (ObservationLevelValue.value > 4 && ObservationLevelValue.value < 10) {
    riskLevel.value = RiskLevelEnum.Medium
  }
  else if (ObservationLevelValue.value > 9 && ObservationLevelValue.value < 16) {
    riskLevel.value = RiskLevelEnum.High
  }
  else if (ObservationLevelValue.value > 15 && ObservationLevelValue.value < 25) {
    riskLevel.value = RiskLevelEnum.High
  }

}

watch(() => route.path, (newVal) => {
  ObservationFactoryType.value = newVal.includes('incedant') ? Observation.AccidentsType : newVal.includes('hazard') ? Observation.HazardType : Observation.ObservationType
  console.log(ObservationFactoryType.value, "ObservationFactoryType.value");
}, { immediate: true })


const GetObservationType = (type) => {
  return Observation[type]
}

const indexObservatioTyepController = IndexObserverationTypeController.getInstance()
const indexObservationTypeParams = new IndexObserverationTypeParams("", 1, 10, 0)
const SelectedObservationType = ref<TitleInterface>()
const setSelectedObservationType = (data: TitleInterface) => {
  SelectedObservationType.value = data
  updateData()
}


const indexHazardTypeParams = new IndexHazardTypeParams('', 1, 10, 0, null, HazardTypeParentEnum?.Parent)
const indexHazardTypeController = IndexHazardTypeController.getInstance()

const HazardType = ref<TitleInterface>()
const setHazardType = (data: TitleInterface) => {
  HazardType.value = data
  updateData()
}

const indexSubHazardTypeParams = ref(new IndexHazardTypeParams('', 1, 10, 0, HazardType?.value?.id, HazardTypeParentEnum?.Child))
const indexSubHazardTypeController = IndexHazardTypeController.getInstance()
const SubHazardType = ref<TitleInterface>()
const setSubHazardType = (data: TitleInterface) => {
  SubHazardType.value = data
  updateData()
}

const indexAccidentsTypeController = IndexAccidentsTypeController.getInstance()
const indexAccidentsTypeParams = new IndexAccidentsTypeParams("", 1, 10, 0)
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
  return Observation[value] == "ObservationType" ? "Observation" : Observation[value] == "HazardType" ? "Hazard" : "Accidents"
}

watch(() => HazardType.value, () => {
  indexSubHazardTypeParams.value = new IndexHazardTypeParams('', 1, 10, 0, HazardType?.value?.id, HazardTypeParentEnum?.Child)
}, { immediate: true })
</script>

<template>
  <div class="full-observation-form col-span-6 grid grid-cols-1 md:grid-cols-6 gap-4">
    <div class="col-span-6 md:col-span-6">
      <HeaderPage :title="`create ${GetHeader(ObservationFactoryType)}`"
        :subtitle="'Identify and report potential Incedants before they cause harm'" :img="HazardImage" />
      <HeaderProjectsFilter class="colored" :projects="Projects" @update:data="GetProjectId" />
    </div>

    <div class="col-span-6 md:col-span-6">
      <TabsSelection v-if="SelectedProjectId" :ProjectId="SelectedProjectId" @update:data="GetZones" />
    </div>

    <div class="Hazard-form col-span-6 md:col-span-6">
      <div class="Hazard-form-header">
        <HazardIcon class="icon" />
        <p class="title">{{ GetHeader(ObservationFactoryType) }} form
          <!-- <span v-if="SerialNumber">( #{{ SerialNumber.SerialNumber }} )</span> -->
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
      <DatePicker v-model="SelctedTime" class="mt-4 mr-2 input date-picker" placeholder="Select time"
        @update:model-value="updateData" input-id="time" :time-only="true" />
    </div>

    <!-- Serial -->
    <div class="col-span-2 md:grid-cols-12" v-if="!(data?.id)">
      <SwitchInput :fields="fields" :switch_title="$t('auto')" :switch_reverse="true" :is-auto="true"
        @update:value="UpdateSerial" />
    </div>

    <!-- Place -->
    <div class="input-wrapper col-span-3 md:grid-cols-12">
      <label for="time">Place</label>
      <input type="text" v-model="PlaceText" @input="updateData" placeholder="Enter Place">
    </div>

    <!-- Observation Type -->
    <div class="col-span-3 md:col-span-3 input-wrapper" v-if="ObservationFactoryType == Observation.ObservationType">
      <CustomSelectInput :required="false" :modelValue="SelectedObservationType"
        :controller="indexObservatioTyepController" :params="indexObservationTypeParams" label="Observation Type "
        id="Equipment" placeholder="Select Observation Type" @update:modelValue="setSelectedObservationType" />
    </div>

    <!-- Hazard Type -->
    <div class="col-span-3 md:col-span-3 input-wrapper">
      <CustomSelectInput :modelValue="HazardType" class="input" :controller="indexHazardTypeController"
        :params="indexHazardTypeParams" label="HazardType" id="HazardType" placeholder="Select Hazard Type"
        @update:modelValue="setHazardType" />
    </div>

    <!--Sub Hazard Type -->
    <div class="col-span-3 md:col-span-3 input-wrapper" v-if="HazardType">
      <CustomSelectInput :modelValue="SubHazardType" class="input" :controller="indexSubHazardTypeController"
        :params="indexSubHazardTypeParams" label="Hazard" id="Hazard" placeholder="Select Hazard"
        @update:modelValue="setSubHazardType" />
    </div>

    <!-- Incedant Type -->
    <div class="col-span-3 md:col-span-3 input-wrapper" v-if="ObservationFactoryType == Observation.AccidentsType">
      <CustomSelectInput :modelValue="AccidentsType" class="input" :controller="indexAccidentsTypeController"
        :params="indexAccidentsTypeParams" label="Incidant Type" id="incedant" placeholder="Select Incedant Type"
        @update:modelValue="setAccidentsType" />
    </div>

    <!-- Machine -->
    <div class="col-span-3 md:col-span-3 input-wrapper">
      <CustomSelectInput :modelValue="SelectedMachine" class="input" :controller="indexEquipmentController"
        :params="indexEquipmentParams" label="select machine (optional)" id="machine" placeholder="select your machine"
        @update:modelValue="setMachine" />
    </div>

    <!-- description -->
    <div class="col-span-6 md:col-span-6 input-wrapper">
      <label for="text">{{ $t('description') }}</label>
      <input placeholder="Add your title" type="text" class="input" id="text" v-model="text" @input="updateData" />
    </div>

    <!-- Sevarity -->
    <div class="col-span-3 md:col-span-3">
      <CustomSelectInput :required="false" :modelValue="SelectedSeverity" :static-options="SeverityList"
        label="Severity" id="Severity" placeholder="Select Severity" @update:modelValue="setSeverity" />
    </div>

    <!-- Likelihood -->
    <div class="col-span-3 md:col-span-3">
      <CustomSelectInput :required="false" :modelValue="SelectedLikelihood" :static-options="LikelihoodList"
        label="Likelihood" id="Likelihood" placeholder="Select Likelihood" @update:modelValue="setLikelihood" />
    </div>

    <!-- Image -->
    <div class="col-span-6 md:col-span-6 input-wrapper w-full">
      <label for="">upload image</label>
      <MultiImagesInput :initialImages="image" @update:images="setImages" />
    </div>

    <!-- IsWorkStopped -->
    <div class="col-span-6 md:col-span-6 input-wrapper w-full is-stopped"
      @click="isWorkStopped = !isWorkStopped; updateData()">
      <label for="is_stoped">{{ $t('is_work_stopped') }}</label>
      <Checkbox binary :modelValue="isWorkStopped" @change="UpdateWorkStatus" inputId="is_stoped" :name="`is_stoped`" />
    </div>

    <!-- Take Action -->
    <div class="hazard-type-container incedant col-span-6 md:col-span-6">
      <div class="input-wrapper radio-container incedant  col-span-12 md:col-span-12">
        <div class="col-span-12 md:col-span-12">
          <label class="radio-title">{{ $t('take action') }}</label>
          <div class="radio-answers flex">
            <div class="radio-selection" :class="{ selected: takeAction === 'yes' }">
              <RadioButton v-model="takeAction" name="takeAction" value="yes" @update:model-value="updateData" />
              <label>Yes</label>
            </div>

            <div class="radio-selection" :class="{ selected: takeAction === 'no' }">
              <RadioButton v-model="takeAction" name="takeAction" value="no" @update:model-value="updateData" />
              <label>No</label>
            </div>
          </div>
        </div>

        <div class="col-span-12 md:col-span-12" v-show="showSolvedAndDescription">
          <label class="radio-title">{{ $t('Status') }}</label>
          <div class="radio-answers flex">
            <div class="radio-selection" :class="{ selected: solved === 'yes' }">
              <RadioButton v-model="solved" name="solved" value="yes" @update:model-value="updateData" />
              <label>Closed</label>
            </div>

            <div class="radio-selection" :class="{ selected: solved === 'no' }">
              <RadioButton v-model="solved" name="solved" value="no" @update:model-value="updateData" />
              <label>Open</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Description -->
    <div class="input-wrapper col-span-6 md:col-span-6" v-show="showSolvedAndDescription">
      <label for="action">{{ $t('action') }}</label>
      <textarea id="action" class="input" v-model="preventive_action" @input="updateData"
        placeholder="add your descripe"></textarea>
    </div>

    <!-- Description -->
    <!-- <div class="col-span-6 md:col-span-6 input-wrapper w-full">
      <label for="descripe">descripe <span class="optional">(optional)</span></label>
      <textarea v-model="descripe" id="descripe" placeholder="add your descripe"></textarea>
    </div> -->

    <!-- Save Status Positive or Negative -->
    <div class="col-span-6 md:col-span-6 input-wrapper w-full">
      <SaveStatusSelector :modelValue="saveStatus" @update:saveStatus="saveStatus = $event" />
    </div>


    <!-- Observation Level -->
    <div class="col-span-6 md:col-span-6 input-wrapper w-full" v-if="saveStatus == SaveStatusEnum.NotSaved">
      <ObservationLevel :modelRiskLevel="riskLevel" :modelIsNearMiss="isNearMiss"
        @update:data="handleObservationLevel" />
    </div>


    <!-- Factorywitnesses -->
    <div class="col-span-6 md:col-span-6 input-wrapper w-full"
      v-if="ObservationFactoryType != Observation?.ObservationType">
      <Factorywitnesses class="not-colored" @update:data="Updatewitnesses" />
    </div>

    <!-- FactoryAccidents -->
    <div class="col-span-6 md:col-span-6 input-wrapper w-full"
      v-if="ObservationFactoryType != Observation?.ObservationType">
      <FactoryAccidents class="not-colored" @update:data="UpdateAccidents" />
    </div>

    <!-- FactoryFatalities -->
    <div class="col-span-6 md:col-span-6 input-wrapper w-full"
      v-if="ObservationFactoryType != Observation?.ObservationType">
      <FactoryFatalities class="not-colored" @update:data="UpdateFatalities" />
    </div>



  </div>

</template>
