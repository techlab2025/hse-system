<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import { PpeItemEnum } from '../../../Core/Enums/ppe_enum'

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
import RootCausesIdParams from '../../../Core/params/RootCausesIdParams'
import AddRootCauses from '@/features/setting/RootCauses/Presentation/components/AddRootCauses.vue'
import { useProjectAppStatusStore } from '@/stores/ProjectStatus'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import AddHazard from '@/features/setting/SubHazard/Presentation/components/AddHazard.vue'
import IndexShiftController from '@/features/Organization/Shifts/Presentation/controllers/IndexShiftController.ts'
import IndexShiftParams from '@/features/Organization/Shifts/Core/params/IndexAShiftParams.ts'
import AddShift from '@/features/Organization/Shifts/Presentation/components/AddShift.vue'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import { useThemeMode } from '@/composables/useThemeMode'
import FieldHelpIcon from '@/shared/FormInputs/FieldHelpIcon.vue'
import { useI18n } from 'vue-i18n'
import { useProjectSelectStore } from '@/stores/ProjectSelect.ts'

const emit = defineEmits(['update:data'])
const { isDarkMode } = useThemeMode()
const { t } = useI18n()
const selectedProject = useProjectSelectStore()
//
const RootCauses = ref<TitleInterface[]>([])
const Accidents = ref()
const Fatalities = ref()
const witnesses = ref()

const RootCausesDialog = ref<boolean>(false)
const props = defineProps<{
  data?: HazardDetailsModel
}>()
const text = ref<string>('')
const date = ref<Date>(new Date())
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
const willCreateInvestigation = computed(
  () =>
    riskLevel.value === RiskLevelEnum.High ||
    (riskLevel.value === RiskLevelEnum.Medium && Number(isNearMiss.value) === 1),
)

const getEmployeePayload = (employee: any) => {
  const id = Number(employee?.id) || 0
  const name = String(employee?.title || employee?.name || '').trim()

  return {
    id,
    name: id ? '' : name,
  }
}

const hasEmployeePayload = (employee: any) => {
  const payload = getEmployeePayload(employee)
  return Boolean(payload.id || payload.name)
}

const hasSectionFiles = (files: any) => Array.isArray(files) && files.length > 0
const hasSectionValue = (value: unknown) =>
  value !== null && value !== undefined && String(value).trim().length > 0

const hasWitnessData = (item: any) =>
  hasEmployeePayload(item?.employee) || hasSectionValue(item?.text)

const hasInjuryData = (item: any) =>
  hasEmployeePayload(item?.employee) ||
  hasSectionValue(item?.text) ||
  Boolean(Number(item?.infectionTypeId?.id)) ||
  hasSectionFiles(item?.incidentCategories) ||
  hasSectionFiles(item?.images)

const hasFatalityData = (item: any) =>
  hasEmployeePayload(item?.employee) || hasSectionValue(item?.text) || hasSectionFiles(item?.images)

watch([() => props.data], ([newData]) => {}, { immediate: true })
const ZoneIds = ref<number>()

const indexEquipmentParams = computed(
  () => new IndexEquipmentParams('', 1, 10, 1, undefined, false, ZoneIds.value),
)
const indexEquipmentController = IndexEquipmentController.getInstance()
const SelectedMachine = ref<TitleInterface | null>(null)
const setMachine = (data: TitleInterface | null) => {
  SelectedMachine.value = data
  updateData()
}

const GetZones = (data: number) => {
  ZoneIds.value = data
  updateData()
}

const setImages = async (data: string[]) => {
  image.value = typeof data === 'string' ? data : await filesToBase64(data)
  updateData()
}

const Projects = ref<MyProjectsModel[]>([])
const isProjectsLoading = ref(false)
const selectedProjectName = computed(
  () =>
    selectedProject.project?.title ||
    Projects.value.find((project) => project.id === SelectedProjectId.value)?.title ||
    '',
)
const FetchMyProjects = async () => {
  const fetchMyProjectsParams = new FetchMyProjectsParams()
  const fetchMyProjectsController = FetchMyProjectsController.getInstance()
  isProjectsLoading.value = true

  try {
    const res = await fetchMyProjectsController.getData(fetchMyProjectsParams)
    if (res.value.data) {
      Projects.value = res.value.data

      if (!SelectedProjectId.value && Projects.value.length) {
        GetProjectId(Projects.value[0].id)
      }
    }
  } finally {
    isProjectsLoading.value = false
  }
}
onMounted(() => {
  FetchMyProjects()
})

const SelectedProjectId = ref<number | undefined>(selectedProject.project?.id)
const GetProjectId = (id: number) => {
  if (SelectedProjectId.value !== id) {
    ZoneIds.value = undefined
  }

  SelectedProjectId.value = id
  updateData()
}

watch(
  () => selectedProject.project?.id,
  (projectId) => {
    if (projectId) {
      GetProjectId(projectId)
    } else if (Projects.value.length) {
      GetProjectId(Projects.value[0].id)
    }
  },
)

const UpdateAccidents = (data: any) => {
  Accidents.value = data
  console.log(Accidents.value, 'Accidents.value')
  updateData()
}
const Updatewitnesses = (data: any) => {
  witnesses.value = data
  console.log(witnesses.value, 'witnesses.value')
  updateData()
}
const UpdateFatalities = (data: any) => {
  Fatalities.value = data
  console.log(Fatalities.value, 'Fatalities.value')
  updateData()
}
const takeAction = ref<'yes' | 'no' | null>('no')
const showAction = ref<'Open' | 'Closed' | null>('Open')
const showSolvedAndDescription = computed(() => takeAction.value === 'yes')
const showObservationAndDescription = computed(() => showAction.value === 'Open')
const solved = ref<ActionStatusEnum | null>(
  ObservationFactoryType.value == Observation.AccidentsType
    ? ActionStatusEnum.OPEN
    : ActionStatusEnum.CLOSED,
)
const preventive_action = ref<string>()
const preventive_action_open = ref<string>()

const SelctedTime = ref<Date>(new Date())
const PlaceText = ref<string>()
const SerialNumber = ref()

watch([date, SelctedTime], () => updateData(), { flush: 'sync' })

const fields = ref([
  {
    key: 'SerialNumber',
    label: 'serial_number',
    placeholder: 'You can leave it (auto-generated)',
    value: SerialNumber.value,
    enabled: props?.data?.id ? false : true,
  },
])

const projtecStateus = useProjectAppStatusStore()
const UpdateSerial = (data) => {
  SerialNumber.value = data.target.value
  updateData()
}

const SelectedSeverity = ref<TitleInterface>(
  new TitleInterface({ id: SeverityEnum.Catastrophic, title: 'a - Catastrophic' }),
)
const SeverityList = ref<TitleInterface[]>([
  new TitleInterface({ id: SeverityEnum.Catastrophic, title: 'a - Catastrophic' }),
  new TitleInterface({ id: SeverityEnum.Major, title: 'b - Major' }),
  new TitleInterface({ id: SeverityEnum.Serious, title: 'c - Serious' }),
  new TitleInterface({ id: SeverityEnum.Moderate, title: 'd - Moderate' }),
  new TitleInterface({ id: SeverityEnum.Minor, title: 'e - Minor' }),
])
const SelectedLikelihood = ref<TitleInterface>(
  new TitleInterface({ id: LikelihoodEnum.Rare, title: '1 - Rare' }),
)
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
const SubHazardType = ref<TitleInterface[]>([])
const setSubHazardType = (data: TitleInterface[]) => {
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
const setWorkStopped = (isStopped: boolean) => {
  isWorkStopped.value = isStopped ? 1 : 0
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

const updateData = () => {
  const rootCausesIdParams = RootCauses.value?.map((item) => {
    return new RootCausesIdParams({ root_cause_id: item.id })
  })

  const injuryRows =
    Accidents?.value?.isAnotherMeeting === 1
      ? (Accidents.value?.accidentsData ?? []).filter(hasInjuryData)
      : []
  const fatalityRows =
    Fatalities?.value?.isAnotherMeeting === 1
      ? (Fatalities.value?.DethsData ?? []).filter(hasFatalityData)
      : []
  const witnessRows =
    witnesses?.value?.isAnotherMeeting === 1
      ? (witnesses.value?.AllWitnessesData ?? []).filter(hasWitnessData)
      : []

  console.log(
    Accidents.value?.accidentsData?.map((item: any) => item),
    'loop',
  )
  const isThereanyDatainAccidents = Accidents.value?.accidentsData?.map((item: any) => {
    console.log(item?.employee?.id)
    if (
      item?.employee?.id == 0 &&
      item?.employee?.title.length == 0 &&
      item?.employeeName.length > 0 &&
      item?.images?.length > 0 &&
      item?.infectionTypeId?.id == 0 &&
      item?.text
    ) {
      return false
    }
    return true
  })
  console.log(Fatalities.value, 'Fatalities')
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
        isThereInjuries: injuryRows.length ? true : null,
        isThereDeath: fatalityRows.length ? true : null,
        isThereWitnessStatement: witnessRows.length ? true : null,
        Injury: injuryRows.length
          ? injuryRows.map((item: any) => {
              const employee = getEmployeePayload(item?.employee)
              return new InjuryParams(
                employee.id,
                employee.name,
                item?.text || null,
                item?.infectionTypeId?.id || 0,
                item?.incidentCategories
                  ?.map((category: TitleInterface) => Number(category.id))
                  .filter(Boolean) || [],
                item?.images?.map((el: any) => el.file) || [],
                item?.ppeItem?.id === PpeItemEnum.OTHERS
                  ? item?.customPpeItem?.trim() || ''
                  : item?.ppeItem?.id || '',
                item?.ppeItemCondition?.id || '',
              )
            })
          : [],
        deaths: fatalityRows.length
          ? fatalityRows.map((item: any) => {
              const employee = getEmployeePayload(item?.employee)
              return new DethParams(
                employee.name,
                item?.text || null,
                employee.id,
                item?.images?.map((el: any) => el.file) || [],
              )
            })
          : // ? [
            //   new DethParams(
            //     Fatalities?.value?.text || '',
            //     Fatalities?.value?.SelectedEmployee || 0,
            //     Fatalities?.value?.img || [],
            //   ),
            // ]
            [],
        witnesses: witnessRows.length
          ? witnessRows.map((w: any) => {
              const employee = getEmployeePayload(w?.employee)
              return new WitnessParams(employee.name, w?.text || '', employee.id)
            })
          : [],

        severity: SelectedSeverity.value?.id,
        Likelihood: SelectedLikelihood.value?.id,
        time: SelctedTime.value,
        place: PlaceText.value,
        isWorkStopped: isWorkStopped.value ? 1 : 0,
        HazardTypeId: HazardType.value?.id,
        HazardSubtypeId: SubHazardType.value.map((item) => item.id),
        actionstatus: solved.value,
        code: SerialNumber.value,
        RootCausesId: rootCausesIdParams,
        OpenNote: preventive_action_open.value,
        OragnizationemployeeName: isSelectHasContent.value ? OragnizationemployeeName.value : null,
        OragnizationemployeeIds: !isSelectHasContent.value
          ? Oragnizationemployee.value.map((employee) => Number(employee.id))
          : [],
        workShiftId: Shifts.value?.id ?? null,
      })
  console.log(params, 'params')
  emit('update:data', params)
}
const UpdateSaveStatus = (data: SaveStatusEnum) => {
  saveStatus.value = data
  updateData()
}

const ObservationTitle = ref<string>()
const indexRootCaueseController = IndexRootCausesController.getInstance()
const indexRootCaueseParams = new IndexRootCausesParams('', 1, 10, 0)
const setRootCause = (data: TitleInterface[]) => {
  RootCauses.value = data
  updateData()
}

const fetchOriganizatioEmployeeController = IndexOrganizatoinEmployeeController.getInstance()
const fetchOrganizationEmployeeParams = new IndexOrganizatoinEmployeeParams('', 1, 10, 0)

const Oragnizationemployee = ref<TitleInterface[]>([])
const setOragnizationemployee = (data: TitleInterface[]) => {
  Oragnizationemployee.value = data
  updateData()
}
const isSelectHasContent = ref<boolean>(false)

const toggleMode = (isManual: boolean) => {
  isSelectHasContent.value = isManual
  if (isManual) {
    Oragnizationemployee.value = []
  } else {
    OragnizationemployeeName.value = ''
  }
  updateData()
}
const OragnizationemployeeName = ref<string>('')
const setOragnizationemployeeName = (data: Event) => {
  OragnizationemployeeName.value = data?.target?.value
  console.log(OragnizationemployeeName.value, 'OragnizationemployeeName.value')
  updateData()
}

const HazardTypeDialog = ref(false)
const HazardDialog = ref(false)

const shiftsContrller = IndexShiftController.getInstance()
const shiftsParams = new IndexShiftParams('', 1, 10, 0)
const Shifts = ref<TitleInterface | null>(null)
const setShifts = (data: TitleInterface) => {
  Shifts.value = data
  console.log(Shifts.value, 'Shifts')
  updateData()
}
const ShiftsDialog = ref(false)

type RequiredFieldRule = {
  key: string
  message: string
  isMissing: () => boolean
}

const requiredFieldErrors = ref<Record<string, string>>({})
const hasValue = (value: unknown) =>
  value !== null && value !== undefined && String(value).trim().length > 0
const hasSelectedId = (value?: TitleInterface | TitleInterface[] | null) =>
  Array.isArray(value) ? value.some((item) => Boolean(item?.id)) : Boolean(value?.id)
const hasEmployeeValue = (employee: any) =>
  Boolean(Number(employee?.id)) || hasValue(employee?.title) || hasValue(employee?.name)
const hasFiles = (files: any) => Array.isArray(files) && files.length > 0
const shouldValidateIncidentSections = () =>
  saveStatus.value === SaveStatusEnum.NotSaved &&
  ObservationFactoryType.value !== Observation.ObservationType
const getInvalidWitnessMessage = () => {
  if (!shouldValidateIncidentSections() || witnesses.value?.isAnotherMeeting !== 1) return ''

  const rows = (witnesses.value?.AllWitnessesData ?? []).filter(hasWitnessData)
  if (!rows.length) return ''

  const invalidIndex = rows.findIndex((witness: any) => !hasEmployeePayload(witness?.employee))
  return invalidIndex === -1 ? '' : t('witness_employee_required_at_row', { row: invalidIndex + 1 })
}

const getInvalidInjuryMessage = () => {
  if (!shouldValidateIncidentSections() || Accidents.value?.isAnotherMeeting !== 1) return ''

  const rows = (Accidents.value?.accidentsData ?? []).filter(hasInjuryData)
  if (!rows.length) return ''

  for (const [index, injury] of rows.entries()) {
    const rowNumber = index + 1
    // if (!hasEmployeePayload(injury?.employee)) return `Injury ${rowNumber} Employee Is Required`
    if (!hasEmployeePayload(injury?.employee))
      return t('injured_employee_required_at_row', { row: rowNumber })
  }

  return ''
}

const getInvalidFatalityMessage = () => {
  if (!shouldValidateIncidentSections() || Fatalities.value?.isAnotherMeeting !== 1) return ''

  const rows = (Fatalities.value?.DethsData ?? []).filter(hasFatalityData)
  if (!rows.length) return ''

  for (const [index, fatality] of rows.entries()) {
    const rowNumber = index + 1
    // if (!hasEmployeePayload(fatality?.employee)) return `Fatality ${rowNumber} Employee Is Required`
    if (!hasEmployeePayload(fatality?.employee))
      return t('deceased_employee_required_at_row', { row: rowNumber })
  }

  return ''
}

const requiredFields = computed<RequiredFieldRule[]>(() => [
  {
    key: 'SelectedProjectId',
    message: t('project_required'),
    isMissing: () => !SelectedProjectId.value,
  },
  {
    key: 'ZoneIds',
    message: t('zone_required'),
    isMissing: () => !ZoneIds.value,
  },
  {
    key: 'ObservationTitle',
    message: t('record_title_required'),
    isMissing: () => !hasValue(ObservationTitle.value),
  },
  {
    key: 'date',
    message: t('date_required'),
    isMissing: () => !date.value,
  },
  {
    key: 'SelctedTime',
    message: t('time_required'),
    isMissing: () => !SelctedTime.value,
  },
  // {
  //   key: 'PlaceText',
  //   message: 'Work Area / Facility Is Required',
  //   isMissing: () => !hasValue(PlaceText.value),
  // },
  {
    key: 'SelectedObservationType',
    message: t('observation_type_required'),
    isMissing: () =>
      ObservationFactoryType.value === Observation.ObservationType &&
      !hasSelectedId(SelectedObservationType.value),
  },
  {
    key: 'AccidentsType',
    message: t('incident_type_required'),
    isMissing: () =>
      ObservationFactoryType.value === Observation.AccidentsType &&
      !hasSelectedId(AccidentsType.value),
  },
  {
    key: 'HazardType',
    message: t('hazard_classification_required'),
    isMissing: () =>
      ObservationFactoryType.value !== Observation.AccidentsType &&
      saveStatus.value === SaveStatusEnum.NotSaved &&
      !hasSelectedId(HazardType.value),
  },
  {
    key: 'SubHazardType',
    message: t('hazard_required_for_negative_observation'),
    isMissing: () =>
      ObservationFactoryType.value !== Observation.AccidentsType &&
      saveStatus.value === SaveStatusEnum.NotSaved &&
      !hasSelectedId(SubHazardType.value),
  },
  // {
  //   key: 'text',
  //   message: 'Description Is Required',
  //   isMissing: () => !hasValue(text.value),
  // },
  // {
  //   key: 'Oragnizationemployee',
  //   message: 'Please select the employee who involved before continuing.',
  //   isMissing: () =>
  //     !hasValue(Oragnizationemployee.value) && OragnizationemployeeName.value.length < 1,
  // },
  {
    key: 'witnesses',
    message: getInvalidWitnessMessage() || t('witness_employee_required'),
    isMissing: () => Boolean(getInvalidWitnessMessage()),
  },
  {
    key: 'Accidents',
    message: getInvalidInjuryMessage() || t('injury_data_required'),
    isMissing: () => Boolean(getInvalidInjuryMessage()),
  },
  {
    key: 'Fatalities',
    message: getInvalidFatalityMessage() || t('fatality_data_required'),
    isMissing: () => Boolean(getInvalidFatalityMessage()),
  },
])

const getFieldError = (key: string) => requiredFieldErrors.value[key] ?? ''

const clearResolvedRequiredErrors = () => {
  requiredFields.value.forEach((field) => {
    if (requiredFieldErrors.value[field.key] && !field.isMissing()) {
      const { [field.key]: _removed, ...rest } = requiredFieldErrors.value
      requiredFieldErrors.value = rest
    }
  })
}

const scrollToRequiredField = async (key: string) => {
  await nextTick()
  document.querySelector<HTMLElement>(`[data-required-field="${key}"]`)?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}

const validateRequiredFields = async () => {
  clearResolvedRequiredErrors()
  const missedFields = requiredFields.value.filter((field) => field.isMissing())
  requiredFieldErrors.value = missedFields.reduce<Record<string, string>>((errors, field) => {
    errors[field.key] = field.message
    return errors
  }, {})

  if (!missedFields.length) return true

  new OpenWarningDilaog(missedFields[0].message).openDialog()
  await scrollToRequiredField(missedFields[0].key)
  return false
}

defineExpose({
  validateRequiredFields,
})
</script>

<template>
  <div
    :class="[
      'full-observation-form col-span-6 grid items-start grid-cols-1 md:grid-cols-6 gap-4',
      { 'is-dark': isDarkMode },
    ]"
  >
    <div class="Hazard-form col-span-6 md:col-span-6">
      <div class="Hazard-form-header">
        <!-- <HazardIcon class="icon" /> -->
        <p class="title">
          {{ GetHeader(ObservationFactoryType) }} {{ $t('Report') }}
          <!-- <span v-if="SerialNumber">( #{{ SerialNumber.SerialNumber }} )</span> -->
        </p>
      </div>
    </div>
    <div
      class="form-filter-panel form-projects-panel col-span-6 md:col-span-6"
      data-required-field="SelectedProjectId"
    >
      <div class="form-filter-panel-header">
        <span class="filter-marker"></span>
        <p>{{ $t('Projects') }}</p>
      </div>
      <div
        v-if="selectedProject.project?.id"
        class="locked-filter-selection selected-project-summary"
      >
        <span class="locked-selection-icon" aria-hidden="true">P</span>
        <span class="locked-selection-copy">
          <small>{{ $t('selected') }} {{ $t('project') }}</small>
          <strong>{{ selectedProjectName || '—' }}</strong>
        </span>
        <span class="locked-selection-check" aria-hidden="true">✓</span>
      </div>

      <template v-else>
        <div v-if="isProjectsLoading" class="form-filter-skeleton" aria-hidden="true">
          <span v-for="item in 4" :key="item"></span>
        </div>
        <HeaderProjectsFilter
          v-show="!isProjectsLoading"
          class="colored"
          :projects="Projects"
          :isForm="true"
          @update:data="GetProjectId"
        />
      </template>
      <p v-if="getFieldError('SelectedProjectId')" class="required-field-message">
        {{ getFieldError('SelectedProjectId') }}
      </p>
    </div>

    <div
      class="form-filter-panel form-zones-panel col-span-6 md:col-span-6"
      data-required-field="ZoneIds"
    >
      <div class="form-filter-panel-header">
        <span class="filter-marker"></span>
        <p>{{ $t('zones') }}</p>
      </div>
      <div
        v-if="isProjectsLoading && !SelectedProjectId"
        class="form-filter-skeleton zones"
        aria-hidden="true"
      >
        <span v-for="item in 3" :key="item"></span>
      </div>
      <TabsSelection
        v-if="SelectedProjectId"
        :ProjectId="SelectedProjectId"
        @update:data="GetZones"
      />
      <p v-if="getFieldError('ZoneIds')" class="required-field-message">
        {{ getFieldError('ZoneIds') }}
      </p>
    </div>

    <!-- title -->
    <div class="input-wrapper col-span-6 field-required" data-required-field="ObservationTitle">
      <div class="field-label">
        <label for="title">{{ GetHeader(ObservationFactoryType) }} {{ $t('title') }}</label>
        <FieldHelpIcon
          text="A short, clear name that summarizes the reported event or observation."
        />
      </div>
      <input
        type="text"
        id="title"
        v-model="ObservationTitle"
        @input="updateData"
        :placeholder="$t(`Enter ${GetHeader(ObservationFactoryType)} title`)"
      />
      <p v-if="getFieldError('ObservationTitle')" class="required-field-message">
        {{ getFieldError('ObservationTitle') }}
      </p>
    </div>

    <!-- Date -->
    <div class="col-span-2 md:col-span-2 input-wrapper" data-required-field="date">
      <div class="field-label">
        <label for="date">{{ $t('date') }}</label
        ><FieldHelpIcon text="The date when the event or observation occurred." />
      </div>
      <DatePicker input-id="date" v-model="date" :Lplaceholder="$t('Add your date')" />
      <p v-if="getFieldError('date')" class="required-field-message">
        {{ getFieldError('date') }}
      </p>
    </div>

    <!-- Time -->
    <div class="input-wrapper col-span-2 md:grid-cols-12" data-required-field="SelctedTime">
      <div class="field-label">
        <label for="time">{{ $t('time') }}</label
        ><FieldHelpIcon text="The approximate time when the event or observation occurred." />
      </div>
      <DatePicker
        v-model="SelctedTime"
        class="mt-4 mr-2 input date-picker"
        :placeholder="$t('Select time')"
        input-id="time"
        :time-only="true"
      />
      <p v-if="getFieldError('SelctedTime')" class="required-field-message">
        {{ getFieldError('SelctedTime') }}
      </p>
    </div>

    <!-- Serial -->
    <div class="input-wrapper col-span-2 md:grid-cols-12" v-if="!data?.id">
      <div class="field-label">
        <label for="serialNumber">{{ GetHeader(ObservationFactoryType) }} {{ $t(`serial`) }}.</label
        ><FieldHelpIcon
          text="The unique reference number for this report. It may be generated automatically."
        />
      </div>
      <input
        type="text"
        v-model="SerialNumber"
        @input="UpdateSerial"
        id="serialNumber"
        :disabled="projtecStateus.isSerialNumberAuto()"
        :placeholder="
          projtecStateus.isSerialNumberAuto()
            ? 'You can leave it (auto-generated)'
            : 'Enter Your Serial Number'
        "
      />
    </div>

    <!-- Place -->
    <div class="input-wrapper col-span-3 md:grid-cols-12" data-required-field="PlaceText">
      <div class="field-label">
        <label for="place">{{ $t('Work Area / Facility') }}</label
        ><FieldHelpIcon
          text="The specific work area, building, or facility where the event occurred."
        />
      </div>
      <input
        type="text"
        id="place"
        v-model="PlaceText"
        @input="updateData"
        :placeholder="$t('Enter Work Area / Facility')"
      />
      <p v-if="getFieldError('PlaceText')" class="required-field-message">
        {{ getFieldError('PlaceText') }}
      </p>
    </div>

    <!-- Observation Type -->
    <div
      class="col-span-3 md:col-span-3 input-wrapper"
      data-required-field="SelectedObservationType"
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
        :required="true"
        :modelValue="SelectedObservationType"
        :controller="indexObservatioTyepController"
        :params="indexObservationTypeParams"
        :label="$t('Observation Type')"
        help-text="The category that best describes this observation."
        id="Equipment"
        :placeholder="$t('Select Observation Type')"
        @update:modelValue="setSelectedObservationType"
        @close="observationTypeDialog = false"
        :isDialog="true"
        v-model:dialogVisible="observationTypeDialog"
      >
        <template #LabelHeader>
          <span class="add-dialog" @click="observationTypeDialog = true">{{ $t('New') }}</span>
        </template>
        <template #Dialog>
          <AddObserverationType @update:data="observationTypeDialog = false" />
        </template>
      </UpdatedCustomInputSelect>
      <p v-if="getFieldError('SelectedObservationType')" class="required-field-message">
        {{ getFieldError('SelectedObservationType') }}
      </p>
    </div>

    <!-- Incedant Type -->
    <div
      class="col-span-3 md:col-span-3 input-wrapper"
      data-required-field="AccidentsType"
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
        :label="$t('incident Type')"
        help-text="The category that best describes the incident."
        id="incident"
        placeholder="Select Incident Type"
        @update:modelValue="setAccidentsType"
        @close="acedentDialogRef = false"
        :isDialog="true"
        :required="true"
        v-model:dialogVisible="acedentDialogRef"
      >
        <template #LabelHeader>
          <span class="add-dialog" @click="acedentDialogRef = true">{{ $t('New') }}</span>
        </template>
        <template #Dialog>
          <AddAccidentsType @update:data="acedentDialogRef = false" />
        </template>
      </UpdatedCustomInputSelect>
      <p v-if="getFieldError('AccidentsType')" class="required-field-message">
        {{ getFieldError('AccidentsType') }}
      </p>
    </div>

    <!-- Root Cause -->
    <!-- <div
      class="col-span-3 md:col-span-3 input-wrapper"
      v-if="ObservationFactoryType == Observation.AccidentsType"
    >
      <UpdatedCustomInputSelect
        :modelValue="RootCauses"
        class="input"
        :controller="indexRootCaueseController"
        :params="indexRootCaueseParams"
        :label="$t('Immediate Apparent Cause')"
        id="rootCause"
        :placeholder="$t('select your Immediate Apparent Cause')"
        @update:modelValue="setRootCause"
        :type="2"
        @close="RootCausesDialog = false"
        :isDialog="true"
        :dialogVisible="RootCausesDialog"
      >
        <template #LabelHeader>
          <span class="add-dialog" @click="RootCausesDialog = true">{{ $t('New') }}</span>
        </template>
        <template #Dialog>
          <AddRootCauses @close:data="RootCausesDialog = false" />
        </template>
      </UpdatedCustomInputSelect>
    </div> -->

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
        :label="$t('Equipment / Tag No')"
        help-text="The equipment involved in the event, including its tag number when available."
        id="machine"
        :placeholder="$t('select Equipment')"
        showOptionLicensePlate
        @update:modelValue="setMachine"
        @close="machineDialogRef = false"
        :isDialog="true"
        v-model:dialogVisible="machineDialogRef"
      >
      </UpdatedCustomInputSelect>
    </div>
    <div class="col-span-3 md:col-span-3 input-wrapper">
      <UpdatedCustomInputSelect
        :controller="fetchOriganizatioEmployeeController"
        :params="fetchOrganizationEmployeeParams"
        v-model="Oragnizationemployee"
        placeholder="Select Involved Persons"
        :required="false"
        class="mt-4 mr-2 input"
        :label="$t('Involved Persons')"
        help-text="The employee or external person directly involved in the event."
        @update:model-value="setOragnizationemployee"
        :hascontent="isSelectHasContent"
        :reload="false"
        :type="2"
      >
        <template #reloadHeader>
          <div class="flex gap-2 items-center">
            <button
              :class="isSelectHasContent ? 'active' : ''"
              class="emp-name"
              @click.prevent="toggleMode(true)"
            >
              {{ $t('not_stuff_member') }}
            </button>

            <button
              :class="isSelectHasContent ? '' : 'active'"
              class="emp-select"
              @click.prevent="toggleMode(false)"
            >
              {{ $t('stuff_member') }}
            </button>
          </div>
        </template>
        <template #content>
          <input
            type="text"
            v-model="OragnizationemployeeName"
            class="input"
            placeholder="Select Employee"
            @input="setOragnizationemployeeName"
          />
        </template>
      </UpdatedCustomInputSelect>
      <p v-if="getFieldError('Oragnizationemployee')" class="required-field-message">
        {{ getFieldError('Oragnizationemployee') }}
      </p>
    </div>

    <!-- Shifts -->
    <div class="col-span-3 md:col-span-3 input-wrapper">
      <UpdatedCustomInputSelect
        :controller="shiftsContrller"
        :params="shiftsParams"
        v-model="Shifts"
        placeholder="Select Shift"
        class="mt-4 mr-2 input"
        :label="$t('work shift')"
        help-text="The work shift during which the event or observation occurred."
        @update:model-value="setShifts"
        :reload="true"
        @close="ShiftsDialog = false"
        :isDialog="true"
        :type="1"
        v-model:dialogVisible="ShiftsDialog"
      >
        <template #LabelHeader>
          <span class="add-dialog" @click="ShiftsDialog = true">{{ $t('New') }}</span>
        </template>
        <template #Dialog>
          <AddShift @close:dialog="ShiftsDialog = false" />
        </template>
      </UpdatedCustomInputSelect>
    </div>

    <!-- description -->
    <div class="col-span-6 md:col-span-6 input-wrapper" data-required-field="text">
      <div class="field-label">
        <label for="description">{{ $t('description') }}</label
        ><FieldHelpIcon
          text="Describe what happened, what was observed, and any important surrounding details."
        />
      </div>
      <input
        :placeholder="$t('Add your description')"
        type="text"
        class="input"
        id="description"
        v-model="text"
        @input="updateData"
      />
      <p v-if="getFieldError('text')" class="required-field-message">
        {{ getFieldError('text') }}
      </p>
    </div>

    <!-- Image -->
    <div class="col-span-6 md:col-span-6 input-wrapper w-full">
      <div class="field-label">
        <label>{{ $t('upload image') }}</label
        ><FieldHelpIcon
          text="Attach photos that help document the location, condition, damage, or evidence."
        />
      </div>
      <MultiImagesInput :initialImages="image" @update:images="setImages" />
    </div>

    <!-- Description -->
    <!-- <div class="col-span-6 md:col-span-6 input-wrapper w-full">
      <label for="descripe">descripe <span class="optional">(optional)</span></label>
      <textarea v-model="descripe" id="descripe" placeholder="add your descripe"></textarea>
    </div> -->

    <!-- Save Status Positive or Negative -->
    <div
      class="factory-people-section witnesses-section col-span-6 md:col-span-6 input-wrapper w-full"
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
        :reload="false"
        :label="$t('Consequence Severity')"
        help-text="The potential seriousness of the outcome if the hazard causes harm."
        id="Severity"
        :placeholder="$t('Select Consequence Severity')"
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
        :reload="false"
        :label="$t('Probability of Occurrence')"
        help-text="How likely it is that this event or harmful outcome could occur."
        id="Likelihood"
        :placeholder="$t('Select Probability of Occurrence')"
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
        :risk-level-readonly="true"
        @update:data="handleObservationLevel"
      />
      <Transition name="investigation-notice">
        <div
          v-if="willCreateInvestigation"
          class="investigation-creation-notice"
          role="status"
          aria-live="polite"
        >
          <span class="investigation-creation-notice-icon" aria-hidden="true">!</span>
          <div>
            <strong>{{ $t('investigation_creation_notice_title') }}</strong>
            <p>{{ $t('investigation_creation_notice_description') }}</p>
          </div>
        </div>
      </Transition>
    </div>
    <!-- Hazard Type -->
    <!-- {{
      ObservationFactoryType !== Observation.AccidentsType &&
      saveStatus === SaveStatusEnum.NotSaved &&
      !hasSelectedId(HazardType)
    }} -->
    <div
      class="col-span-3 md:col-span-3 input-wrapper"
      data-required-field="HazardType"
      v-if="
        saveStatus == SaveStatusEnum.NotSaved && ObservationFactoryType != Observation.AccidentsType
      "
    >
      <UpdatedCustomInputSelect
        :modelValue="HazardType"
        class="input"
        :controller="indexHazardTypeController"
        :params="indexHazardTypeParams"
        :label="$t('Hazard Classification')"
        help-text="The main category of hazard associated with this report."
        id="HazardType"
        :placeholder="$t('Select Hazard Classification')"
        @update:modelValue="setHazardType"
        :isDialog="true"
        :required="true"
        v-model:dialogVisible="HazardTypeDialog"
      >
        <template #LabelHeader>
          <span class="add-dialog" @click="HazardTypeDialog = true">New</span>
        </template>
        <template #Dialog>
          <AddHazardType @update:data="HazardTypeDialog = false" />
        </template>
      </UpdatedCustomInputSelect>
      <p v-if="getFieldError('HazardType')" class="required-field-message">
        {{ getFieldError('HazardType') }}
      </p>
    </div>

    <!--Sub Hazard Type -->
    <div
      class="col-span-3 md:col-span-3 input-wrapper"
      v-if="
        HazardType &&
        ObservationFactoryType != Observation.AccidentsType &&
        saveStatus == SaveStatusEnum.NotSaved
      "
    >
      <UpdatedCustomInputSelect
        :modelValue="SubHazardType"
        class="input"
        :controller="indexSubHazardTypeController"
        :params="indexSubHazardTypeParams"
        :label="$t('Risk')"
        help-text="Select the specific hazard or risk within the chosen classification."
        id="Hazard"
        :placeholder="$t('Select Risk')"
        @update:modelValue="setSubHazardType"
        :isDialog="true"
        :required="true"
        v-model:dialogVisible="HazardDialog"
        :type="2"
      >
        <template #LabelHeader>
          <span class="add-dialog" @click="HazardDialog = true">New</span>
        </template>
        <template #Dialog>
          <AddHazard @update:data="HazardDialog = false" :hazardTypeId="HazardType.id" />
        </template>
      </UpdatedCustomInputSelect>
      <p v-if="getFieldError('SubHazardType')" class="required-field-message">
        {{ getFieldError('SubHazardType') }}
      </p>
    </div>

    <!-- IsWorkStopped -->
    <!-- isWorkStopped = !isWorkStopped -->
    <!-- input-wrapper -->
    <div
      v-if="saveStatus == SaveStatusEnum.NotSaved"
      class="col-span-6 md:col-span-6 w-full is-stopped"
    >
      <div class="field-label w-full">
        <label for="is_stopedd">{{ $t('is_work_stopped') }} ?</label
        ><FieldHelpIcon
          text="Indicate whether work was stopped because of this event or unsafe condition."
        />
      </div>
      <div class="meeting-status">
        <button
          type="button"
          class="meeting-status-yes"
          @click="setWorkStopped(true)"
          :class="isWorkStopped == 1 ? 'active' : ''"
        >
          {{ $t('Yes') }}
        </button>
        <button
          type="button"
          class="meeting-status-on"
          @click="setWorkStopped(false)"
          :class="isWorkStopped == 0 ? 'active' : ''"
        >
          {{ $t('No') }}
        </button>
      </div>
    </div>
    <!-- <div class="col-span-6 md:col-span-6 input-wrapper w-full is-stopped">
      <label class="w-full" for="is_stopedd" @click="isWorkStopped = !isWorkStopped">{{ $t('is_there_work_days_lost')
        }}</label>
      <Checkbox binary :modelValue="isWorkStopped" @change="UpdateWorkStatus" inputId="is_stopedd"
        :name="`is_stoped`" />
    </div> -->

    <!-- Take Action -->
    <div
      v-if="saveStatus == SaveStatusEnum.NotSaved"
      class="hazard-type-container incedant col-span-6 md:col-span-6"
    >
      <div class="input-wrapper radio-container incedant col-span-12 md:col-span-12">
        <div class="col-span-12 md:col-span-12">
          <div class="field-label">
            <label class="radio-title">{{ $t('action_taken') }}</label
            ><FieldHelpIcon
              text="Indicate whether an immediate action was taken to control or correct the issue."
            />
          </div>
          <div class="radio-answers flex">
            <div class="radio-selection" :class="{ selected: takeAction === 'yes' }">
              <RadioButton
                inputId="yes"
                v-model="takeAction"
                name="takeAction"
                value="yes"
                @update:model-value="updateData"
              />
              <label for="yes">{{ $t('Yes') }}</label>
            </div>

            <div class="radio-selection" :class="{ selected: takeAction === 'no' }">
              <RadioButton
                inputId="no"
                v-model="takeAction"
                name="takeAction"
                value="no"
                @update:model-value="updateData"
              />
              <label for="no">{{ $t('No') }}</label>
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
      <div class="field-label">
        <label for="action">{{ $t('immediatly_action_taken') }}</label
        ><FieldHelpIcon
          text="Describe the immediate action taken to make the situation safe or prevent recurrence."
        />
      </div>
      <textarea
        id="action"
        class="input"
        v-model="preventive_action"
        @input="updateData"
        placeholder="add your descripe"
      ></textarea>
    </div>

    <div
      v-if="
        saveStatus == SaveStatusEnum.NotSaved && ObservationFactoryType != Observation.AccidentsType
      "
      class="hazard-type-container incedant col-span-6 md:col-span-6"
    >
      <div class="input-wrapper radio-container incedant col-span-12 md:col-span-12">
        <div class="col-span-12 md:col-span-12">
          <div class="field-label">
            <label class="radio-title">{{ $t('observation_status') }}</label
            ><FieldHelpIcon
              text="Choose Closed when the issue is resolved, or Open when further action is required."
            />
          </div>
          <div class="radio-answers flex">
            <div class="radio-selection" :class="{ selected: solved === ActionStatusEnum.CLOSED }">
              <RadioButton
                inputId="closed"
                v-model="solved"
                name="solved"
                :value="ActionStatusEnum.CLOSED"
                @update:model-value="updateData"
              />
              <label for="closed">{{ $t('Closed') }}</label>
            </div>

            <div class="radio-selection" :class="{ selected: solved === ActionStatusEnum.OPEN }">
              <RadioButton
                inputId="open"
                v-model="solved"
                name="solved"
                :value="ActionStatusEnum.OPEN"
                @update:model-value="updateData"
              />
              <label for="open">{{ $t('Open') }}</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--if ActionStatusEnum OPEN  -->
    <div
      v-if="
        solved == ActionStatusEnum.OPEN &&
        saveStatus == SaveStatusEnum.NotSaved &&
        ObservationFactoryType != Observation.AccidentsType
      "
      class="input-wrapper col-span-6 md:col-span-6"
      v-show="showObservationAndDescription"
    >
      <div class="field-label">
        <label for="open-note">{{ $t('Open Note') }}</label
        ><FieldHelpIcon
          text="Explain what remains open and what follow-up action is still needed."
        />
      </div>
      <textarea
        id="open-note"
        class="input"
        v-model="preventive_action_open"
        @input="updateData"
        placeholder="add your descripe"
      ></textarea>
    </div>

    <!-- Factorywitnesses -->

    <div
      class="factory-people-section witnesses-section col-span-6 md:col-span-6 input-wrapper w-full"
      data-required-field="witnesses"
      v-if="
        saveStatus == SaveStatusEnum.NotSaved &&
        ObservationFactoryType != Observation?.ObservationType
      "
    >
      <Factorywitnesses class="not-colored" @update:data="Updatewitnesses" />
      <p v-if="getFieldError('witnesses')" class="required-field-message">
        {{ getFieldError('witnesses') }}
      </p>
    </div>

    <!-- FactoryAccidents -->
    <!-- v-if="ObservationFactoryType != Observation?.ObservationType" -->
    <div
      class="factory-people-section injuries-section col-span-6 md:col-span-6 input-wrapper w-full"
      data-required-field="Accidents"
      v-if="
        saveStatus == SaveStatusEnum.NotSaved &&
        ObservationFactoryType != Observation?.ObservationType
      "
    >
      <FactoryAccidents
        class="not-colored"
        :incident-type-id="AccidentsType?.id ?? null"
        @update:data="UpdateAccidents"
      />
      <p v-if="getFieldError('Accidents')" class="required-field-message">
        {{ getFieldError('Accidents') }}
      </p>
    </div>

    <!-- FactoryFatalities -->
    <!-- v-if="ObservationFactoryType != Observation?.ObservationType" -->
    <div
      class="factory-people-section fatalities-section col-span-6 md:col-span-6 input-wrapper w-full"
      data-required-field="Fatalities"
      v-if="
        saveStatus == SaveStatusEnum.NotSaved &&
        ObservationFactoryType != Observation?.ObservationType
      "
    >
      <FactoryFatalities class="not-colored" @update:data="UpdateFatalities" />
      <p v-if="getFieldError('Fatalities')" class="required-field-message">
        {{ getFieldError('Fatalities') }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.investigation-creation-notice {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  margin-top: 14px;
  padding: 14px 16px;
  border: 1px solid color-mix(in srgb, var(--status-warning) 42%, var(--main-border));
  border-radius: 16px;
  background:
    radial-gradient(
      circle at 100% 0,
      color-mix(in srgb, var(--status-warning) 17%, transparent),
      transparent 42%
    ),
    var(--status-warning-soft);
  box-shadow: 0 8px 22px color-mix(in srgb, var(--status-warning) 11%, transparent);
}

.investigation-creation-notice-icon {
  display: inline-grid;
  place-items: center;
  flex: 0 0 auto;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: var(--status-warning);
  color: var(--text-on-brand);
  font-size: 20px;
  font-weight: 900;
  box-shadow: 0 6px 14px color-mix(in srgb, var(--status-warning) 28%, transparent);
}

.investigation-creation-notice strong {
  display: block;
  color: var(--text-strong);
  font-size: 14px;
  font-weight: 800;
}

.investigation-creation-notice p {
  margin: 3px 0 0;
  color: var(--text-soft);
  font-size: 13px;
  line-height: 1.45;
}

.investigation-notice-enter-active,
.investigation-notice-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.investigation-notice-enter-from,
.investigation-notice-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* .add-dialog {
  width: 20px;
  height: 20px;
  margin-right: 6px;
  cursor: pointer;
  color: var(--brand-primary-500);
  text-decoration: underline;
  font-family: 'Regular';
} */
.is-stopped {
  display: flex;
  justify-content: space-between;
  align-items: center;
  div {
    &:first-child {
      width: 85%;
    }
    &:last-child {
      width: 15%;
    }
  }
}
.meeting-status {
  button {
    width: 100%;
  }
}

.add-dialog svg {
  width: 18px;
  height: 18px;
}

.required-field-message {
  margin-top: 0.35rem;
  color: var(--status-danger);
  font-size: 0.82rem;
  font-weight: 700;
}

.locked-filter-selection {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 64px;
  padding: 12px 14px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 30%, var(--main-border));
  border-radius: 16px;
  background: color-mix(in srgb, var(--brand-primary-500) 8%, var(--surface-1));
}

.locked-selection-icon,
.locked-selection-check {
  display: inline-grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 12px;
  background: var(--brand-primary-500);
  color: var(--text-on-brand);
  font-weight: 900;
}

.locked-selection-icon {
  width: 40px;
  height: 40px;
}

.locked-selection-check {
  width: 28px;
  height: 28px;
  margin-inline-start: auto;
  border-radius: 50%;
  font-size: 13px;
}

.locked-selection-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
}

.locked-selection-copy small {
  color: var(--text-soft);
  font-size: 11px;
  font-weight: 700;
}

.locked-selection-copy strong {
  overflow: hidden;
  color: var(--text-strong);
  font-size: 15px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.factory-people-section {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  overflow: clip;
}

.factory-people-section :deep(.another-meeting),
.factory-people-section :deep(.another-meeting-contect),
.factory-people-section :deep(.template-container),
.factory-people-section :deep(.heirarchy-info),
.factory-people-section :deep(.timeline-container),
.factory-people-section :deep(.timeline-wrapper),
.factory-people-section :deep(.timeline-item) {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
}

.form-filter-skeleton {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  overflow: hidden;
  border: none !important;
}

.form-filter-skeleton span {
  width: 126px;
  height: 40px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    var(--brand-primary-50) 25%,
    var(--brand-primary-50) 50%,
    var(--brand-primary-50) 75%
  );
  background-size: 220% 100%;
  animation: form-filter-shimmer 1.15s linear infinite;
}

.form-filter-skeleton span:nth-child(2) {
  width: 154px;
}

.form-filter-skeleton span:nth-child(3) {
  width: 112px;
}

.form-filter-skeleton.zones span {
  height: 58px;
  border-radius: 16px;
}

@keyframes form-filter-shimmer {
  0% {
    background-position: 220% 0;
  }

  100% {
    background-position: -220% 0;
  }
}

@media (max-width: 768px) {
  .form-filter-skeleton span {
    min-width: 96px;
    width: 96px;
  }
}

label {
  width: fit-content;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  width: fit-content;
}

.is-stopped {
  cursor: default;
}

.meeting-status {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  width: 100%;
}

.meeting-status button {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-width: 0;
  min-height: 48px;
  padding: 10px 14px;
  border: 1px solid var(--brand-primary-100);
  border-radius: 14px;
  background: var(--brand-primary-50);
  color: var(--brand-primary-600);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.meeting-status button.active {
  border-color: color-mix(in srgb, var(--brand-primary-500) 42%, transparent);
  background: color-mix(in srgb, var(--brand-primary-500) 8%, transparent);
  color: var(--PrimaryColor);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--brand-primary-500) 8%, transparent);
}

@media (max-width: 768px) {
  .is-stopped {
    flex-wrap: wrap;
  }

  .meeting-status {
    grid-template-columns: 1fr;
  }
}

.full-observation-form.is-dark {
  .Hazard-form-header,
  .form-filter-panel,
  .hazard-type-container,
  .not-colored,
  .is-stopped {
    background: var(--surface-1) !important;
    border-color: var(--text-muted) !important;
    color: var(--text-strong) !important;
    box-shadow: 0 14px 34px color-mix(in srgb, var(--text-strong) 22%, transparent) !important;
  }

  .Hazard-form-header .title,
  .form-filter-panel-header p,
  label,
  .radio-title {
    color: var(--text-strong) !important;
  }

  input,
  textarea {
    background-color: var(--text-on-brand) !important;
    border-color: var(--text-muted) !important;
    color: var(--text-strong) !important;
  }

  input::placeholder,
  textarea::placeholder {
    color: var(--text-muted) !important;
  }

  .radio-selection {
    background-color: var(--text-on-brand) !important;
    border-color: var(--text-muted) !important;
    color: var(--text-soft) !important;
  }

  .radio-selection.selected {
    background-color: color-mix(in srgb, var(--PrimaryColor) 18%, var(--surface-2)) !important;
    border-color: color-mix(in srgb, var(--PrimaryColor) 48%, var(--main-border)) !important;
    color: var(--text-strong) !important;
  }

  .form-filter-skeleton span {
    background: linear-gradient(
      90deg,
      var(--brand-primary-800) 25%,
      var(--brand-primary-700) 50%,
      var(--brand-primary-800) 75%
    ) !important;
    background-size: 220% 100%;
  }

  :deep(.colored),
  :deep(.another-meeting),
  :deep(.another-meeting-header),
  :deep(.another-meeting-contect),
  :deep(.timeline-content),
  :deep(.timeline-wrapper),
  :deep(.timeline-content-text),
  :deep(.injury-timeline-card),
  :deep(.timeline-contect-select),
  :deep(.title-header),
  :deep(.meeting-status),
  :deep(.multi-image-uploader),
  :deep(.radio-wrapper),
  :deep(.observation-container),
  :deep(.observation-level),
  :deep(.save-status-selector),
  :deep(.is-stopped-white) {
    background:
      radial-gradient(
        circle at 100% 0%,
        color-mix(in srgb, var(--PrimaryColor) 7%, transparent),
        transparent 40%
      ),
      linear-gradient(180deg, var(--surface-1), var(--surface-2)) !important;
    border-color: var(--text-muted) !important;
    color: var(--text-strong) !important;
    box-shadow: none !important;
  }

  :deep(.meeting-status),
  :deep(.injury-timeline-card),
  :deep(.timeline-content),
  :deep(.timeline-contect-select),
  :deep(.multi-image-uploader),
  :deep(.radio-wrapper),
  :deep(.observation-level) {
    border: 1px solid var(--main-border) !important;
  }

  :deep(.title-header .title),
  :deep(.title-header h1),
  :deep(.title-header h2),
  :deep(.injury-card-header strong),
  :deep(.timeline-content .title),
  :deep(.radio-wrapper.active),
  :deep(.add-dialog) {
    color: var(--text-strong) !important;
  }

  :deep(.title-header .subtitle),
  :deep(.title-header p),
  :deep(.injury-card-header span),
  :deep(.timeline-content label),
  :deep(.timeline-content-text),
  :deep(.timeline-content-text p),
  :deep(.meeting-status button),
  :deep(.emp-name),
  :deep(.emp-select) {
    color: var(--text-soft) !important;
  }

  :deep(.input-select),
  :deep(.p-select),
  :deep(.p-multiselect),
  :deep(.p-datepicker),
  :deep(.p-inputtext),
  :deep(.timeline-content input),
  :deep(.timeline-content textarea),
  :deep(.injury-timeline-card .input) {
    background-color: var(--text-on-brand) !important;
    border-color: var(--text-muted) !important;
    color: var(--text-strong) !important;
  }

  :deep(.emp-name.active),
  :deep(.emp-select.active),
  :deep(.meeting-status button.active) {
    color: var(--text-on-brand) !important;
  }
}
@media (max-width: 768px) {
  .full-observation-form > div {
    grid-column: 1 / -1 !important;
  }

  .factory-people-section {
    padding: 12px !important;
    border-radius: 16px !important;
  }

  .factory-people-section :deep(.another-meeting-contect) {
    margin-top: 12px;
  }
}

@media (max-width: 420px) {
  .factory-people-section {
    padding: 10px !important;
  }
}
.is-stopped .field-label {
  width: fit-content !important;
}
.meeting-status {
  margin-right: auto !important;
}
</style>
