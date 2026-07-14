<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import InvestigatingHedaer from './InvestigatingResultsUtils/InvestigatingHedaer.vue'
import investigationImg from '@/assets/images/investigationImg.png'
import CauseOfAccidant from './InvestegationResultParts/CauseOfAccidant.vue'
import RateActions from './InvestegationResultParts/RateActions.vue'
import InvestegationAttachment from './InvestegationResultParts/InvestegationAttachment.vue'
import AnotherMeeting from './InvestegationResultParts/AnotherMeeting.vue'
import AddInvestigatingResultController from '../../controllers/investegationResult/addInvestigatingResultController'
import AddInvestigationResultParams from '../../../Core/params/investegationResult/addInvestigationResultParams'
import { useRoute, useRouter } from 'vue-router'
import ShowInvestigationResultParams from '../../../Core/params/investegationResult/ShowInvestigationResultParams'
import ShowInvestigatingResultController from '../../controllers/investegationResult/ShowInvestigatingResultController'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import IndexRootCausesController from '@/features/setting/RootCauses/Presentation/controllers/indexRootCausesController'
import IndexRootCausesParams from '@/features/setting/RootCauses/Core/params/indexRootCausesParams'
import TitleInterface from '@/base/Data/Models/title_interface'
import FiveWhyQuestions from './InvestegationResultParts/FiveWhyQuestions.vue'
import RootCausesIdParams from '@/features/Organization/ObservationFactory/Core/params/RootCausesIdParams'
import InvestigationCapaDialog from '../../SubComponents/InvestigationCapaDialog.vue'
import InvestegationAnotherMeetingParams from '../../../Core/params/investegationResult/InvestegationAnotherMeetingParams.ts'
import FactoryAccidents from '@/features/Organization/ObservationFactory/Presentation/components/FactoryUtils/FactoryAccidents.vue'
import WitnessesTimeLine from '@/features/Organization/ObservationFactory/Presentation/components/FactoryUtils/WitnessesTimeLine.vue'
import InjuryParams from '@/features/Organization/ObservationFactory/Core/params/InjuriesParams.ts'
import InvestegationWitnessesParams from '../../../Core/params/investegationResult/InvestegationWitnessesParams.ts'
import CapaActionPlan from '@/features/Organization/Capa/Presentation/components/CapaActionPlan.vue'
import AddRootCauses from '@/features/setting/RootCauses/Presentation/components/AddRootCauses.vue'
import SimilarObservationController from '../../controllers/similarObservation/SimilarObservationController.ts'
import SimilarObservatioParams from '../../../Core/params/SimilarObservation/SimilarObservatioParams.ts'
import type HazardDetailsModel from '@/features/Organization/ObservationFactory/Data/models/hazardDetailsModel.ts'
import DeleteIcon from '@/shared/icons/DeleteIcon.vue'
import DatePicker from 'primevue/datepicker'
import { InvestigationMeetingEnum } from '../../../Core/Enums/investigation_meeting_enum'
import { formatTime } from '@/base/Presentation/utils/time_format.ts'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import InvestigationFormSkilaton from '../../SubComponents/InvestigationFormSkilaton.vue'
import DownArrow from '@/shared/icons/DownArrow.vue'
import { Observation } from '../../../Core/Enums/ObservationTypeEnum.ts'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'

interface items {
  title: string
  isDanger: boolean
}

interface EventTimelineItem {
  time: Date | null
  description: string
}

type EventTimelinePayloadItem = {
  time: string
  description: string
}

const route = useRoute()
const id = route.params.id
const investigatingId = route.query.investigating_id
const showInvestigationResultController = ShowInvestigatingResultController.getInstance()
const state = computed(() => showInvestigationResultController.state.value)
const router = useRouter()
const meetingPlatformLabels: Record<number, string> = {
  [InvestigationMeetingEnum.GOOGLE_MEET]: 'Google Meet',
  [InvestigationMeetingEnum.ZOOM]: 'Zoom',
  [InvestigationMeetingEnum.SKYPE]: 'Skype',
  [InvestigationMeetingEnum.TEAM]: 'Teams',
  [InvestigationMeetingEnum.OTHER]: 'Other',
}

const latestMeeting = computed(() => {
  const meetings = state.value?.data?.meeting ?? state.value?.data?.investigationMeetings ?? []
  return meetings.length ? meetings[meetings.length - 1] : null
})

const isLatestMeetingOther = computed(
  () => Number(latestMeeting.value?.type) === InvestigationMeetingEnum.OTHER,
)

const latestMeetingDisplayLabel = computed(() =>
  isLatestMeetingOther.value ? 'meeting place:' : 'meeting platform:',
)

const latestMeetingDisplayValue = computed(() => {
  if (!latestMeeting.value) return '-'
  if (isLatestMeetingOther.value) return latestMeeting.value?.place || '-'

  return (
    meetingPlatformLabels[Number(latestMeeting.value?.type)] || latestMeeting.value?.type || '-'
  )
})
const emptyCapaActionPlan = {
  corrective: [],
  preventive: [],
}

const item = ref<items[]>([
  {
    title: 'High observation',
    isDanger: true,
  },
])

const ShoeInvestegationResultDetails = async () => {
  const showInvestigationResultParams = new ShowInvestigationResultParams(Number(investigatingId))
  await showInvestigationResultController.ShowInvestigatingResult(
    showInvestigationResultParams,
    router,
  )
}
const openDialog = ref(false)

const AddEnvestigatingResult = async () => {
  if (!(await validateRequiredFields())) return

  const RootCausesIds = RootCauses.value.map(
    (el) => new RootCausesIdParams({ root_cause_id: el.id }),
  )
  const DocumentReferenceIds = DocumentRefrences.value.map((el) => el.id)
  const actionPlan = capaActionPlan.value ?? emptyCapaActionPlan
  const eventTimeLines: EventTimelinePayloadItem[] = eventTimelineItems.value.map((item) => ({
    time: formatTimelineTime(item.time),
    description: item.description.trim(),
  }))
  const addInvestigationResultParams = new AddInvestigationResultParams({
    documentation: investigationAttachments.value,
    explainWhyText: rateActions.value?.notes,
    factors: CauseOfAction.value?.factors,
    investigationMeetingId: Number(id),
    isActionCorrect: rateActions.value?.actionRate,
    isInvestigationClosed: anotherMeeting?.value?.isAnother == 1 ? 0 : 1,
    observationId: Number(state.value?.data?.observation?.id),
    tasks: [...actionPlan.corrective, ...actionPlan.preventive],
    witnesses: viewersResults.value ?? [],
    meeting: new InvestegationAnotherMeetingParams(
      anotherMeeting?.value?.meetings?.date,
      anotherMeeting?.value?.meetings?.time,
      anotherMeeting?.value?.meetings?.type,
      anotherMeeting?.value?.meetings?.place,
    ),
    isAnotherMeeting: anotherMeeting?.value?.isAnother,
    corrective: CauseOfAction.value?.description,
    RootCauses: RootCausesIds,
    investegaionLevel: SelectedLevel.value?.id,
    FiveWhyQuestionsData: FiveWhyQuestionsData.value,
    IncidantDescription: IncidantDescription.value,
    eventTimeLines: eventTimeLines,
    recommendation: recommendation.value,
    Injury: Accidents.value?.accidentsData?.map((item: any) => {
      const employeeId = item?.employee?.id || 0
      return new InjuryParams(
        employeeId,
        employeeId ? '' : item?.employee?.title || '',
        item?.text || null,
        item?.infectionTypeId?.id || 0,
        item?.isWorkStopped ? 1 : 0,
        item?.images?.map((el: any) => el.file) || [],
      )
    }),
    correctiveTasks: actionPlan.corrective,
    preventiveTasks: actionPlan.preventive,
    lessonLearnt: lessonLearnt.value,
    documentReferenceIds: DocumentReferenceIds,
  })
  console.log(anotherMeeting.value, 'anotherMeeting')
  const addInvestigatingResultController = AddInvestigatingResultController.getInstance()
  const res = await addInvestigatingResultController.addInvestigatingResult(
    addInvestigationResultParams,
    router,
  )
  // if (res.value.error == null && addInvestigationResultParams.isAnotherMeeting == 0) {
  //   openDialog.value = true
  if (res.value.error == null) {
    router.push('/organization/investigating')
  }

  // console.log(res.value.error, 'error')
}
onMounted(async () => {
  await ShoeInvestegationResultDetails()
  fetchSimilarObservations()
})
watch(
  () => showInvestigationResultController.state.value,
  (newState) => {
    if (newState) state.value = newState
  },
)

const CauseOfAction = ref()
const setCauseOfAction = (data) => {
  CauseOfAction.value = data
}

const investigationTasks = ref()
const setInvestigationTasks = (data) => {
  investigationTasks.value = data
}

const rateActions = ref()
const setRateAction = (data) => {
  rateActions.value = data
  console.log(data, 'data')
}

const investigationAttachments = ref()
const setInvestigationAttachments = (data) => {
  investigationAttachments.value = data
}

const viewersResults = ref()
const Updatewitnesses = (data: any[]) => {
  viewersResults.value = (data ?? []).map((item: any) => {
    const employeeId = Number(item?.employee?.id) || 0
    const employeeName = employeeId ? undefined : item?.employee?.title?.trim() || ''

    return new InvestegationWitnessesParams(
      item?.text?.trim() || '',
      employeeId || undefined,
      employeeName,
    )
  })
}
const uniqueByIdOrName = (items: any[]) => {
  const seen = new Set<string>()

  return items.filter((item) => {
    const key = String(
      item?.id ||
        item?.organization_employee?.organization_employee_id ||
        item?.organization_employee?.id ||
        item?.employee_name ||
        JSON.stringify(item),
    )

    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const initialViewers = computed(() =>
  uniqueByIdOrName([
    ...(state.value?.data?.observation?.witness_statements ?? []),
    ...(state.value?.data?.observation?.accident_witness ?? []),
    ...(state.value?.data?.witness_statements ?? []),
  ]),
)
const initialInjuries = computed(() =>
  uniqueByIdOrName([
    ...(state.value?.data?.observation?.injuries ?? []),
    ...(state.value?.data?.observation?.accident_victim ?? []),
    ...(state.value?.data?.injuries ?? []),
  ]),
)
const FiveWhyQuestionsData = ref()
const setFiveWhyQuestions = (data) => {
  FiveWhyQuestionsData.value = data
}

const anotherMeeting = ref()
const setAnotherMeeting = (data) => {
  console.log(data, 'data')
  anotherMeeting.value = data
}
const indexRootCaueseController = IndexRootCausesController.getInstance()
const indexRootCaueseParams = new IndexRootCausesParams('', 1, 10, 0)
const RootCauses = ref<TitleInterface[]>([])
const setRootCause = (data: TitleInterface[]) => {
  RootCauses.value = data
}
const RootCausesDialog = ref<boolean>(false)

const InvestigationLevel = ref<TitleInterface[]>([
  new TitleInterface({ id: 1, title: 'low' }),
  new TitleInterface({ id: 2, title: 'meduim' }),
  new TitleInterface({ id: 3, title: 'high' }),
])
const SelectedLevel = ref<TitleInterface>()
const setSelectedLevel = (data: TitleInterface) => {
  SelectedLevel.value = data
}
const recommendation = ref<string>()
const updateRecommendation = (data) => {
  recommendation.value = data.target.value
}
const CloseCapa = async () => {
  openDialog.value = false
  router.push('/organization/investigating')
}
const IncidantDescription = ref<string>()
const eventTimelineItems = ref<EventTimelineItem[]>([
  {
    time: null,
    description: '',
  },
])

const formatTimelineTime = (time: Date | null) => {
  if (!time) return ''
  console.log(formatTime(time), 'timeee')
  return formatTime(time)
  // return time.toLocaleTimeString([], {
  //   hour: '2-digit',
  //   minute: '2-digit',
  // })
}

const updateIncidentTimelineDescription = () => {
  // IncidantDescription.value = eventTimelineItems.value
  // .map((item, index) => {
  //   const time = formatTimelineTime(item.time)
  //   const description = item.description.trim()
  //   if (!time && !description) return ''
  //   return `${index + 1}. ${time ? `[${time}] ` : ''}${description}`
  // })
  // .filter(Boolean)
  // .join('\n')
}

const addEventTimelineItem = () => {
  eventTimelineItems.value.push({
    time: null,
    description: '',
  })
  updateIncidentTimelineDescription()
}

const deleteEventTimelineItem = (index: number) => {
  eventTimelineItems.value.splice(index, 1)
  if (!eventTimelineItems.value.length) addEventTimelineItem()
  updateIncidentTimelineDescription()
}

const Accidents = ref()
const UpdateAccidents = (data: any) => {
  Accidents.value = data
  console.log(Accidents.value, 'Accidents.value')
}

const capaActionPlan = ref()
const setCapaActionPlan = (data: any) => {
  capaActionPlan.value = {
    corrective: data?.corrective ?? [],
    preventive: data?.preventive ?? [],
    rawCorrective: data?.rawCorrective ?? capaActionPlan.value?.rawCorrective ?? [],
    rawPreventive: data?.rawPreventive ?? capaActionPlan.value?.rawPreventive ?? [],
  }
}
const lessonLearnt = ref('')
const DocumentRefrences = ref<TitleInterface[]>([])
const setDocumentRefrences = (data: TitleInterface[]) => {
  DocumentRefrences.value = data
}
const SimilarObservations = ref<HazardDetailsModel[]>()
const similarObservationsLoading = ref(false)
const fetchedSimilarObservationId = ref<number | null>(null)
const fetchSimilarObservations = async () => {
  const observationId = state.value.data?.observation?.id
  if (!observationId || fetchedSimilarObservationId.value === observationId) return

  similarObservationsLoading.value = true
  try {
    const similarObservationController = SimilarObservationController.getInstance()
    const similarObservationParams = new SimilarObservatioParams({
      observationId: observationId,
      word: '',
      withPage: 1,
      perPage: 5,
      pageNumber: 1,
    })
    const result = await similarObservationController.fetchSimilarObservations(
      similarObservationParams,
      router,
      true,
    )
    console.log(result.value?.data, 'result.value?.data ')
    SimilarObservations.value = result.value?.data ?? []
    fetchedSimilarObservationId.value = observationId
  } finally {
    similarObservationsLoading.value = false
  }
}

watch(
  () => state.value.data?.observation?.id,
  () => {
    fetchSimilarObservations()
  },
)

const ActivePanel = ref<string | null>('1')
const isPanelOpen = (panel: string) => ActivePanel.value === panel

const scrollToActivePanel = async (panel: string | null) => {
  if (!panel) return

  await nextTick()

  window.setTimeout(() => {
    const activePanel = document.querySelector<HTMLElement>(`[data-investigation-panel="${panel}"]`)

    if (!activePanel) return

    const headerOffset = 96
    const activePanelRect = activePanel.getBoundingClientRect()
    const activePanelTop = activePanelRect.top + window.scrollY - headerOffset

    window.scrollTo({
      top: Math.max(activePanelTop, 0),
      behavior: 'smooth',
    })
  }, 160)
}

watch(ActivePanel, (panel, previousPanel) => {
  if (panel && panel !== previousPanel) {
    scrollToActivePanel(panel)
  }
})

type RequiredFieldRule = {
  key: string
  message: string
  panel: string
  isMissing: () => boolean
}

const requiredFieldErrors = ref<Record<string, string>>({})
const hasValue = (value: unknown) =>
  value !== null && value !== undefined && String(value).trim().length > 0
const hasSelectedId = (value: any) => Boolean(Number(value?.id))
const hasEmployeeValue = (employee: any) =>
  hasSelectedId(employee) || hasValue(employee?.title) || hasValue(employee?.name)
const hasFiles = (files: any) => Array.isArray(files) && files.length > 0
const timelineFieldKey = (field: 'time' | 'description', index: number) =>
  `eventTimelineItems.${index}.${field}`
const viewerFieldKey = (field: 'employee' | 'statement', index: number) =>
  `viewersResults.${index}.${field}`
const capaFieldKey = (
  type: 'corrective' | 'preventive',
  field: 'text' | 'date' | 'employee' | 'responsible',
  index: number,
) => `capaActionPlan.${type}.${index}.${field}`

const isTimelineStarted = (item: EventTimelineItem) =>
  Boolean(item.time) || hasValue(item.description)
const hasInjuryEmployee = (item: any) =>
  hasEmployeeValue(item?.employee) ||
  Boolean(Number(item?.organization_employee_id)) ||
  hasValue(item?.employee_name)
const hasInjuryType = (item: any) =>
  hasSelectedId(item?.infectionTypeId) || Boolean(Number(item?.injury_type_id))
const hasInjuryDescription = (item: any) => hasValue(item?.text) || hasValue(item?.note)
const isInjuryStarted = (item: any) =>
  hasInjuryEmployee(item) ||
  hasInjuryType(item) ||
  hasInjuryDescription(item) ||
  hasFiles(item?.images) ||
  hasFiles(item?.files)
const isAddedInjuryRow = (index: number) => index >= Math.max(initialInjuries.value?.length ?? 0, 1)
const hasInitialInjuryRows = () => Boolean(initialInjuries.value?.length)
const shouldValidateInjury = (item: any, index: number) =>
  isInjuryStarted(item) || hasInitialInjuryRows() || isAddedInjuryRow(index)
const isViewerStarted = (item: any) =>
  hasValue(item?.witnessesStatements) ||
  hasValue(item?.employeeName) ||
  Boolean(Number(item?.organizationEmployeeId))
const isAddedViewerRow = (index: number) => index >= Math.max(initialViewers.value?.length ?? 0, 1)
const hasInitialViewerRows = () => Boolean(initialViewers.value?.length)
const shouldValidateViewer = (item: any, index: number) =>
  isViewerStarted(item) || hasInitialViewerRows() || isAddedViewerRow(index)
const getTaskEmployee = (task: any) => task?.employee ?? task?.investigation_task_employees?.[0]
const getTaskResponsible = (task: any) =>
  task?.ResponablePerson ?? {
    id: task?.investigation_task_employees?.[0]?.organization_employee_follow_id,
  }
const isCapaTaskStarted = (task: any) =>
  hasValue(task?.text ?? task?.title) ||
  Boolean(task?.date) ||
  hasSelectedId(getTaskEmployee(task)) ||
  hasSelectedId(getTaskResponsible(task))
const getRawCapaTasks = (type: 'corrective' | 'preventive') =>
  type === 'corrective'
    ? (capaActionPlan.value?.rawCorrective ?? [])
    : (capaActionPlan.value?.rawPreventive ?? [])

const requiredFields = computed<RequiredFieldRule[]>(() => [
  ...eventTimelineItems.value.flatMap((item, index) => [
    {
      key: timelineFieldKey('time', index),
      message: `Event ${index + 1} Time Is Required`,
      panel: '3',
      isMissing: () => isTimelineStarted(item) && !item.time,
    },
    {
      key: timelineFieldKey('description', index),
      message: `Event ${index + 1} Description Is Required`,
      panel: '3',
      isMissing: () => isTimelineStarted(item) && !hasValue(item.description),
    },
  ]),
  ...(Accidents.value?.accidentsData ?? []).flatMap((item: any, index: number) => [
    {
      key: `Accidents.${index}.employee`,
      message: `Injury ${index + 1} Employee Is Required`,
      panel: '4',
      isMissing: () => shouldValidateInjury(item, index) && !hasInjuryEmployee(item),
    },
    {
      key: `Accidents.${index}.infectionTypeId`,
      message: `Injury ${index + 1} Type Is Required`,
      panel: '4',
      isMissing: () => shouldValidateInjury(item, index) && !hasInjuryType(item),
    },
    {
      key: `Accidents.${index}.text`,
      message: `Injury ${index + 1} Description Is Required`,
      panel: '4',
      isMissing: () => shouldValidateInjury(item, index) && !hasInjuryDescription(item),
    },
    // {
    //   key: `Accidents.${index}.images`,
    //   message: `Injury ${index + 1} Evidence Is Required`,
    //   panel: '4',
    //   isMissing: () => isInjuryStarted(item) && !hasFiles(item?.images),
    // },
  ]),
  ...(viewersResults.value ?? []).flatMap((item: any, index: number) => [
    {
      key: viewerFieldKey('employee', index),
      message: `Witness ${index + 1} Employee Is Required`,
      panel: '5',
      isMissing: () =>
        shouldValidateViewer(item, index) &&
        !item?.organizationEmployeeId &&
        !hasValue(item?.employeeName),
    },
    {
      key: viewerFieldKey('statement', index),
      message: `Witness ${index + 1} Statement Is Required`,
      panel: '5',
      isMissing: () => shouldValidateViewer(item, index) && !hasValue(item?.witnessesStatements),
    },
  ]),

  ...(['corrective', 'preventive'] as const).flatMap((type) =>
    getRawCapaTasks(type).flatMap((task: any, index: number) => [
      {
        key: capaFieldKey(type, 'text', index),
        message: `${type === 'corrective' ? 'Corrective' : 'Preventive'} Action ${index + 1} Title Is Required`,
        panel: '8',
        isMissing: () => isCapaTaskStarted(task) && !hasValue(task?.text ?? task?.title),
      },
      {
        key: capaFieldKey(type, 'date', index),
        message: `${type === 'corrective' ? 'Corrective' : 'Preventive'} Action ${index + 1} Date Is Required`,
        panel: '8',
        isMissing: () => isCapaTaskStarted(task) && !task?.date,
      },
      {
        key: capaFieldKey(type, 'employee', index),
        message: `${type === 'corrective' ? 'Corrective' : 'Preventive'} Action ${index + 1} Implementation Responsibility Is Required`,
        panel: '8',
        isMissing: () => isCapaTaskStarted(task) && !hasSelectedId(getTaskEmployee(task)),
      },
      {
        key: capaFieldKey(type, 'responsible', index),
        message: `${type === 'corrective' ? 'Corrective' : 'Preventive'} Action ${index + 1} Monitoring Responsibility Is Required`,
        panel: '8',
        isMissing: () => isCapaTaskStarted(task) && !hasSelectedId(getTaskResponsible(task)),
      },
    ]),
  ),
  // {
  //   key: 'RootCauses',
  //   message: 'Root Cause Is Required',
  //   panel: '7',
  //   isMissing: () => !RootCauses.value?.length,
  // },
  // {
  //   key: 'CauseOfAction',
  //   message: 'Root Cause Factors Is Required',
  //   panel: '7',
  //   isMissing: () => !CauseOfAction.value?.factors?.length,
  // },
  // {
  //   key: 'lessonLearnt',
  //   message: 'Lesson Learnt Is Required',
  //   panel: '9',
  //   isMissing: () => !hasValue(lessonLearnt.value),
  // },
  // {
  //   key: 'anotherMeeting',
  //   message: 'Another Meeting Status Is Required',
  //   panel: '12',
  //   isMissing: () =>
  //     anotherMeeting.value?.isAnother === null || anotherMeeting.value?.isAnother === undefined,
  // },
])

const getFieldError = (key: string) => requiredFieldErrors.value[key] ?? ''
const getFirstFieldError = (prefix: string) =>
  Object.entries(requiredFieldErrors.value).find(([key]) => key.startsWith(prefix))?.[1] ?? ''

const clearResolvedRequiredErrors = () => {
  requiredFields.value.forEach((field) => {
    if (requiredFieldErrors.value[field.key] && !field.isMissing()) {
      const { [field.key]: _removed, ...rest } = requiredFieldErrors.value
      requiredFieldErrors.value = rest
    }
  })
}

const scrollToRequiredField = async (field: RequiredFieldRule) => {
  ActivePanel.value = field.panel
  await nextTick()
  window.setTimeout(() => {
    const target =
      document.querySelector<HTMLElement>(`[data-required-field="${field.key}"]`) ??
      (field.key.startsWith('Accidents.')
        ? document.querySelector<HTMLElement>('[data-required-field="Accidents.0.employee"]')
        : null) ??
      (field.key.startsWith('viewersResults.')
        ? document.querySelector<HTMLElement>('[data-required-field="viewersResults.0.employee"]')
        : null) ??
      (field.key.startsWith('capaActionPlan.')
        ? document.querySelector<HTMLElement>(
            '[data-required-field="capaActionPlan.corrective.0.text"]',
          )
        : null)

    target?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }, 180)
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
  await scrollToRequiredField(missedFields[0])
  return false
}
</script>
<template>
  <DataStatus :controller="state">
    <template #success>
      <div class="investigation-result">
        <Accordion v-model:value="ActivePanel">
          <AccordionPanel value="1" data-investigation-panel="1">
            <AccordionHeader>
              <div class="investigation-title">
                <img :src="investigationImg" alt="" />
                <p>General Identification</p>
                <span class="arrow" :class="{ open: isPanelOpen('1') }"><DownArrow /></span>
              </div>
            </AccordionHeader>
            <AccordionContent>
              <InvestigatingHedaer
                :title="state?.data?.observation?.title"
                :serial="state?.data?.observation?.serial_name"
                :victim="state?.data?.observation?.observer?.name"
                :date="state?.data?.investigationMeetingDate"
                :meetingDate="state?.data?.date"
                :TeamLeader="state?.data?.TeamLeader.name"
                :TeamNumbers="state.data?.investigationEmployees?.length"
                :incidantType="state?.data?.observation?.type_model"
                :place="state?.data?.observation?.place"
                :equipment="state?.data?.observation?.equipment"
                :incidantDescription="state?.data?.observation?.description"
                :team="state.data?.investigationEmployees"
                :time="state.data?.investigationMeetingTime"
                :shift="state.data?.observation.work_shift"
                :serialName="state.data?.serialName"
                :observationCreator="state?.data?.observation?.observer?.name"
                @update:documentRefrences="setDocumentRefrences"
              />
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel value="2" data-investigation-panel="2">
            <AccordionHeader>
              <div class="investigation-title">
                <img :src="investigationImg" alt="" />
                <p>Investigation Team</p>
                <span class="arrow" :class="{ open: isPanelOpen('2') }"><DownArrow /></span>
              </div>
            </AccordionHeader>
            <AccordionContent>
              <div class="investigating-header-container">
                <div class="meeting-info-container">
                  <!-- <div class="metting-info-header-container">
        <p class="metting-info-header">{{ $t('investigation_meeting') }}</p>
        <hr class="meeting-hr" />
      </div> -->
                  <div class="meeting-info">
                    <p>
                      Investigation team leader :
                      <span class="team-leader">{{ state?.data?.TeamLeader?.name }}</span>
                    </p>
                    <p>
                      Investigation Team Members :
                      <span class="team-number">{{
                        state?.data?.investigationEmployees?.length
                      }}</span>
                    </p>
                    <p>
                      Date and Time of meeting :
                      <span class="team-number"
                        >{{ state?.data?.investigationMeetingDate }} &
                        {{ state?.data?.investigationMeetingTime }}</span
                      >
                    </p>
                    <p>
                      {{ latestMeetingDisplayLabel }}

                      <span class="team-number">{{ latestMeetingDisplayValue }}</span>
                    </p>
                  </div>
                </div>
                <div class="team-container">
                  <p class="title">{{ $t('team') }}</p>
                  <div class="team">
                    <div
                      class="team-member"
                      v-for="member in state.data?.investigationEmployees"
                      :key="member.id"
                    >
                      <img
                        :src="
                          member?.organizationEmployee?.image ||
                          'https://cyber.comolho.com/static/img/avatar.png'
                        "
                        alt=""
                        class="equipemtn-card-image"
                      />

                      <div class="employee-text">
                        <p class="name">{{ member.organizationEmployee?.name }}</p>
                        <p class="serial">{{ member.organizationEmployee?.serialName }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel value="3" data-investigation-panel="3">
            <AccordionHeader>
              <div class="investigation-title">
                <img :src="investigationImg" alt="" />
                <p>Events Timeline Builder</p>
                <span class="arrow" :class="{ open: isPanelOpen('3') }"><DownArrow /></span>
              </div>
            </AccordionHeader>
            <AccordionContent>
              <section class="event-timeline-builder">
                <div class="event-timeline-summary">
                  <p class="title">{{ $t('incidant_description') }}</p>
                  <p class="description">{{ state?.data?.observation?.description }}</p>
                </div>

                <div class="event-timeline-list">
                  <article
                    v-for="(item, index) in eventTimelineItems"
                    :key="index"
                    class="event-timeline-item"
                  >
                    <div class="event-timeline-marker">
                      <span>{{ index + 1 }}</span>
                    </div>

                    <div class="event-timeline-card">
                      <div class="event-timeline-card-header">
                        <div>
                          <span>Event {{ index + 1 }}</span>
                          <h4>{{ $t('event_time_line') }}</h4>
                        </div>
                        <button
                          v-if="eventTimelineItems.length > 1"
                          class="event-timeline-delete"
                          type="button"
                          @click="deleteEventTimelineItem(index)"
                        >
                          {{ $t('delete') }}
                        </button>
                      </div>

                      <div class="event-timeline-fields">
                        <div
                          class="input-wrapper"
                          :data-required-field="timelineFieldKey('time', index)"
                        >
                          <label :for="`event_time_${index}`">{{ $t('time') }}</label>
                          <DatePicker
                            :id="`event_time_${index}`"
                            v-model="item.time"
                            timeOnly
                            hourFormat="12"
                            fluid
                            :placeholder="`Enter the time `"
                            @update:model-value="updateIncidentTimelineDescription"
                          />
                          <p
                            v-if="getFieldError(timelineFieldKey('time', index))"
                            class="required-field-message"
                          >
                            {{ getFieldError(timelineFieldKey('time', index)) }}
                          </p>
                        </div>

                        <div
                          class="input-wrapper event-description-field"
                          :data-required-field="timelineFieldKey('description', index)"
                        >
                          <label :for="`event_description_${index}`">{{ $t('description') }}</label>
                          <textarea
                            :id="`event_description_${index}`"
                            v-model="item.description"
                            class="input"
                            style="min-height: 10px !important"
                            :placeholder="'What happened? (in detail)'"
                            @input="updateIncidentTimelineDescription"
                          ></textarea>
                          <p
                            v-if="getFieldError(timelineFieldKey('description', index))"
                            class="required-field-message"
                          >
                            {{ getFieldError(timelineFieldKey('description', index)) }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>

                <button class="btn btn-primary mt-2" type="button" @click="addEventTimelineItem">
                  + Add new timeline
                </button>
              </section>
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel
            value="4"
            data-investigation-panel="4"
            v-if="state?.data?.observation?.type == Observation.AccidentsType"
          >
            <AccordionHeader>
              <div class="investigation-title">
                <img :src="investigationImg" alt="" />
                <p>Health Impact Integration</p>
                <span class="arrow" :class="{ open: isPanelOpen('4') }"><DownArrow /></span>
              </div>
            </AccordionHeader>
            <AccordionContent>
              <div class="investigation-injury" data-required-field="Accidents.0.employee">
                <FactoryAccidents
                  :injuries="initialInjuries"
                  class="not-colored"
                  @update:data="UpdateAccidents"
                  :isOpen="true"
                />
                <p v-if="getFirstFieldError('Accidents.')" class="required-field-message">
                  {{ getFirstFieldError('Accidents.') }}
                </p>
              </div>
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel value="5" data-investigation-panel="5">
            <AccordionHeader>
              <div class="investigation-title">
                <img :src="investigationImg" alt="" />
                <p>Witness Management</p>
                <span class="arrow" :class="{ open: isPanelOpen('5') }"><DownArrow /></span>
              </div>
            </AccordionHeader>
            <AccordionContent>
              <div data-required-field="viewersResults.0.employee">
                <WitnessesTimeLine @update:data="Updatewitnesses" />
                <p v-if="getFirstFieldError('viewersResults.')" class="required-field-message">
                  {{ getFirstFieldError('viewersResults.') }}
                </p>
              </div>
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel value="6" data-investigation-panel="6">
            <AccordionHeader>
              <div class="investigation-title">
                <img :src="investigationImg" alt="" />
                <p>Immediate Action Evaluation</p>
                <span class="arrow" :class="{ open: isPanelOpen('6') }"><DownArrow /></span>
              </div>
            </AccordionHeader>
            <AccordionContent>
              <div class="investigating-header-container">
                <div
                  class="incidant-description col-span-2"
                  v-if="state?.data?.observation?.action"
                >
                  <p class="title">{{ $t('Immediate Action Retrieval') }}</p>
                  <p class="description">{{ state?.data?.observation?.action }}</p>
                </div>
              </div>
              <RateActions @update:data="setRateAction" />
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel value="7" data-investigation-panel="7">
            <AccordionHeader>
              <div class="investigation-title">
                <img :src="investigationImg" alt="" />
                <p>Root Cause Analysis (5 Whys)</p>
                <span class="arrow" :class="{ open: isPanelOpen('7') }"><DownArrow /></span>
              </div>
            </AccordionHeader>
            <AccordionContent>
              <FiveWhyQuestions @update:data="setFiveWhyQuestions" />
              <!-- root causes -->
              <div class="input-wrapper w-full root-cause-panel" data-required-field="RootCauses">
                <UpdatedCustomInputSelect
                  :modelValue="RootCauses"
                  class="input"
                  :controller="indexRootCaueseController"
                  :params="indexRootCaueseParams"
                  :label="$t('Identified Root Cause')"
                  id="rootCause"
                  :placeholder="$t('select your root_cause')"
                  @update:modelValue="setRootCause"
                  :type="2"
                  @close="RootCausesDialog = false"
                  :isDialog="true"
                  v-model:dialogVisible="RootCausesDialog"
                >
                  <template #LabelHeader>
                    <span class="add-dialog" @click="RootCausesDialog = true">{{ $t('New') }}</span>
                  </template>
                  <template #Dialog>
                    <AddRootCauses @close:data="RootCausesDialog = false" />
                  </template>
                </UpdatedCustomInputSelect>
                <p v-if="getFieldError('RootCauses')" class="required-field-message">
                  {{ getFieldError('RootCauses') }}
                </p>
              </div>
              <div data-required-field="CauseOfAction">
                <CauseOfAccidant @update:data="setCauseOfAction" />
                <p v-if="getFieldError('CauseOfAction')" class="required-field-message">
                  {{ getFieldError('CauseOfAction') }}
                </p>
              </div>
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel value="8" data-investigation-panel="8">
            <AccordionHeader>
              <div class="investigation-title">
                <img :src="investigationImg" alt="" />
                <p>Action Plan : Corrective and Preventive Actions</p>
                <span class="arrow" :class="{ open: isPanelOpen('8') }"><DownArrow /></span>
              </div>
            </AccordionHeader>
            <AccordionContent>
              <div data-required-field="capaActionPlan.corrective.0.text">
                <CapaActionPlan @update:data="setCapaActionPlan" />
                <p v-if="getFirstFieldError('capaActionPlan.')" class="required-field-message">
                  {{ getFirstFieldError('capaActionPlan.') }}
                </p>
              </div>
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel value="9" data-investigation-panel="9">
            <AccordionHeader>
              <div class="investigation-title">
                <img :src="investigationImg" alt="" />
                <p>Lessons Learned</p>
                <span class="arrow" :class="{ open: isPanelOpen('9') }"><DownArrow /></span>
              </div>
            </AccordionHeader>
            <AccordionContent>
              <section class="lesson-section">
                <div class="section-heading">
                  <!-- <span>Lesson learnt</span> -->
                  <h2>Lessons Learned</h2>
                </div>
                <div class="input-wrapper" data-required-field="lessonLearnt">
                  <textarea
                    id="lesson_learnt"
                    v-model="lessonLearnt"
                    placeholder="Write the lesson learnt, what changed, and what should be shared with other teams."
                  ></textarea>
                  <p v-if="getFieldError('lessonLearnt')" class="required-field-message">
                    {{ getFieldError('lessonLearnt') }}
                  </p>
                </div>
              </section>
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel value="10" data-investigation-panel="10">
            <AccordionHeader>
              <div class="investigation-title">
                <img :src="investigationImg" alt="" />
                <p>Similar incident Retrieval</p>
                <span class="arrow" :class="{ open: isPanelOpen('10') }"><DownArrow /></span>
              </div>
            </AccordionHeader>
            <AccordionContent>
              <section class="similar-observations-section">
                <div v-if="similarObservationsLoading" class="similar-observations-grid">
                  <div v-for="item in 3" :key="item" class="similar-observation-card loading">
                    <span></span>
                    <strong></strong>
                    <small></small>
                  </div>
                </div>

                <div v-else-if="SimilarObservations?.length" class="similar-observations-grid">
                  <article
                    v-for="observation in SimilarObservations"
                    :key="observation.id"
                    class="similar-observation-card"
                  >
                    <span>#{{ observation.serialName || observation.serial || 'N/A' }}</span>
                    <strong>{{ observation.title || 'Untitled observation' }}</strong>
                    <small>{{ observation.date || 'N/A' }}</small>
                  </article>
                </div>

                <p v-else class="similar-observations-empty">No similar incidents found.</p>
              </section>
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel value="11" data-investigation-panel="11">
            <AccordionHeader>
              <div class="investigation-title">
                <img :src="investigationImg" alt="" />
                <p>Attachments</p>
                <span class="arrow" :class="{ open: isPanelOpen('11') }"><DownArrow /></span>
              </div>
            </AccordionHeader>
            <AccordionContent>
              <InvestegationAttachment @update:data="setInvestigationAttachments" />
              <div class="attachments-show" v-if="investigationAttachments?.files?.length">
                <p class="title">{{ investigationAttachments?.title }}</p>
                <div class="image-container">
                  <div
                    class="attachment-preview"
                    v-for="(image, index) in investigationAttachments?.files"
                    :key="index"
                  >
                    <DeleteIcon
                      class="cursor-pointer"
                      @click="investigationAttachments?.files.splice(index, 1)"
                    />
                    <img :src="image" alt="attachment" width="150" />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel value="12" data-investigation-panel="12">
            <AccordionHeader>
              <div class="investigation-title">
                <img :src="investigationImg" alt="" />
                <p>Another Meeting</p>
                <span class="arrow" :class="{ open: isPanelOpen('12') }"><DownArrow /></span>
              </div>
            </AccordionHeader>
            <AccordionContent>
              <div data-required-field="anotherMeeting">
                <AnotherMeeting @update:data="setAnotherMeeting" />
                <p v-if="getFieldError('anotherMeeting')" class="required-field-message">
                  {{ getFieldError('anotherMeeting') }}
                </p>
              </div>
              <div class="btns">
                <!-- <CloseInvestegaionDialog :investegationId="state.data?.id" /> -->
                <router-link to="/organization/investigating" class="btn btn-cancel">{{
                  $t('cancel')
                }}</router-link>
                <button @click="AddEnvestigatingResult" class="btn btn-primary">
                  {{ $t('confirm') }}
                </button>
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>

        <!-- Regulatory/Legal Compliance Reference -->

        <!-- <div class="input-wrapper w-full root-cause-panel">
          <UpdatedCustomInputSelect
            :modelValue="DocumentRefrences"
            class="input"
            :controller="indexDocumentRefrencesController"
            :params="indexDocumentRefrencesParams"
            :label="$t('Document_refrence')"
            id="DocumentRefrence"
            :placeholder="$t('select your Document_refrence')"
            @update:modelValue="setDocumentRefrences"
            :type="2"
            @close="DocumentRefrenceDialog = false"
            :isDialog="true"
            v-model:dialogVisible="DocumentRefrenceDialog"
          >
            <template #LabelHeader>
              <span class="add-dialog" @click="DocumentRefrenceDialog = true">{{ $t('New') }}</span>
            </template>
            <template #Dialog>
              <AddDocumentRefrence @close:data="DocumentRefrenceDialog = false" />
            </template>
          </UpdatedCustomInputSelect>
        </div> -->

        <!-- Similat Observatio -->
        <!-- title date serial only  -->

        <!-- <CauseOfAccidant @update:data="setCauseOfAction" /> -->
        <!-- <InvestigationTasks @update:data="setInvestigationTasks" /> -->
        <!-- <div class="input-wrapper w-full reccomendation recommendation-panel">
          <label for="recommendation">{{ $t('recommendation action for capa') }}</label>
          <textarea
            id="recommendation"
            class="input"
            placeholder="add your recommendation for capa"
            v-model="recommendation"
            @input="updateRecommendation"
          ></textarea>
        </div> -->

        <!-- <TimeLine :items="item" /> -->
      </div>
      <InvestigationCapaDialog
        v-model:visible="openDialog"
        :observationId="Number(state?.data?.observation?.id)"
        @close="CloseCapa"
      />
    </template>
    <template #loader>
      <InvestigationFormSkilaton :cols="3" :rows="10" />
    </template>
    <template #initial>
      <InvestigationFormSkilaton :cols="3" :rows="10" />
    </template>
    <template #empty>
      <DataEmpty
        description="Sorry .. You have no Investegation Result .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Investegation Result"
      />
    </template>
    <template #failed>
      <DataFailed
        description="Sorry .. You have no Investegation Result Data .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Investegation Result Data"
      />
    </template>

    <template #notPermitted>
      <DataFailed
        addText="Have not Permission"
        description="Sorry .. You have no Hazard .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </DataStatus>
</template>

<style scoped lang="scss">
.arrow {
  margin-left: auto;
}
.p-accordion {
  width: 100%;
}

.investigation-title {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0.65rem;

  p {
    flex: 1;
  }

  .arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    margin-inline-start: auto;
    color: #94a3b8;
    transform: rotate(0deg);
    transition:
      transform 0.25s ease,
      color 0.25s ease;

    &.open {
      color: var(--PrimaryColor);
      transform: rotate(180deg);
    }

    :deep(svg) {
      width: 18px;
      height: 18px;
    }

    :deep(path) {
      fill: currentColor;
      transition: fill 0.25s ease;
    }
  }
}

.investigation-result {
  :deep(.p-accordion div.input-select),
  :deep(.p-accordion div.p-select),
  :deep(.p-accordion div.p-multiselect),
  :deep(.p-accordion div.p-datepicker),
  :deep(.p-accordion div.p-inputwrapper),
  :deep(.p-accordion .input-wrapper input),
  :deep(.p-accordion .input-wrapper textarea),
  :deep(.p-accordion .p-inputtext),
  :deep(.multi-image-uploader) {
    border: 1px solid #cbd5e1 !important;
    border-radius: 14px !important;
    background-color: #ffffff !important;
    box-shadow: none !important;
  }

  :deep(.p-accordion div.input-select:hover),
  :deep(.p-accordion div.p-select:hover),
  :deep(.p-accordion div.p-multiselect:hover),
  :deep(.p-accordion .input-wrapper input:hover),
  :deep(.p-accordion .input-wrapper textarea:hover),
  :deep(.p-accordion .p-inputtext:hover) {
    border-color: #94a3b8 !important;
  }

  :deep(.p-accordion div.input-select:focus-within),
  :deep(.p-accordion div.input-select.p-focus),
  :deep(.p-accordion div.p-select:focus-within),
  :deep(.p-accordion div.p-select.p-focus),
  :deep(.p-accordion div.p-multiselect:focus-within),
  :deep(.p-accordion div.p-multiselect.p-focus),
  :deep(.p-accordion .input-wrapper input:focus),
  :deep(.p-accordion .input-wrapper textarea:focus),
  :deep(.p-accordion .p-inputtext:focus) {
    border-color: #94a3b8 !important;
    box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.16) !important;
    outline: none !important;
  }
}

.required-field-message {
  margin-top: 0.35rem;
  color: #dc2626;
  font-size: 0.82rem;
  font-weight: 700;
}

.lesson-section {
  width: 100%;
}
.w-50 {
  width: 50%;
}
.btn-cancel {
  width: 20%;
}
.mt-12 {
  margin-top: 3rem !important;
}

.reccomendation {
  /* padding-inline: 10px; */
}

.lesson-section {
  border: 1px solid var(--main-border);
  border-radius: 18px;
  background: var(--BgWhite);
  box-shadow: 0 8px 16px color-mix(in srgb, var(--Black) 10%, transparent);
  padding: 1.25rem;
}

.event-timeline-builder {
  position: relative;
  width: 100%;
  overflow: hidden;
  border: 1px solid var(--main-border);
  border-radius: 20px;
  background:
    radial-gradient(
      circle at 0% 0%,
      color-mix(in srgb, var(--PrimaryColor) 10%, transparent),
      transparent 34%
    ),
    linear-gradient(180deg, var(--BgWhite), #f8fbff);
  box-shadow: 0 14px 32px color-mix(in srgb, var(--Black) 8%, transparent);
  padding: clamp(14px, 2vw, 22px);
}

.event-timeline-summary {
  margin-bottom: 1rem;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 12%, var(--main-border));
  border-radius: 16px;
  background: color-mix(in srgb, var(--PrimaryColor) 5%, white);
  padding: 1rem;

  .title,
  .description {
    margin: 0;
  }

  .title {
    color: var(--PrimaryColor);
    font-size: 0.78rem;
    font-weight: 900;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .description {
    margin-top: 0.45rem;
    color: var(--header-page-color);
    font-size: 0.95rem;
    font-weight: 700;
    line-height: 1.7;
  }
}

.event-timeline-list {
  position: relative;
  display: grid;
  gap: 1rem;

  &::before {
    content: '';
    position: absolute;
    inset-block: 16px;
    inset-inline-start: 20px;
    width: 2px;
    border-radius: 999px;
    background: linear-gradient(180deg, var(--PrimaryColor), #14b8a6);
    opacity: 0.28;
  }
}

.event-timeline-item {
  position: relative;
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: 0.9rem;
  align-items: flex-start;
}

.event-timeline-marker {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  padding-top: 1rem;

  span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border: 4px solid #ffffff;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--PrimaryColor), #14b8a6);
    color: #ffffff;
    font-size: 0.85rem;
    font-weight: 900;
    box-shadow: 0 12px 24px color-mix(in srgb, var(--PrimaryColor) 24%, transparent);
  }
}

.event-timeline-card {
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 12px 24px color-mix(in srgb, var(--Black) 6%, transparent);
  padding: 1rem;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: color-mix(in srgb, var(--PrimaryColor) 24%, var(--main-border));
    box-shadow: 0 18px 34px color-mix(in srgb, var(--Black) 9%, transparent);
  }
}

.event-timeline-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.9rem;

  span {
    color: var(--GrayText-1);
    font-size: 0.72rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h4 {
    margin: 0.2rem 0 0;
    color: var(--header-page-color);
    font-size: 1rem;
    font-weight: 900;
  }
}

.event-timeline-delete,
.event-timeline-add {
  border: 0;
  cursor: pointer;
  font-weight: 900;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(0.97);
  }
}

.event-timeline-delete {
  border-radius: 999px;
  background: #fef2f2;
  color: #dc2626;
  font-size: 0.78rem;
  padding: 0.45rem 0.75rem;
}

.event-timeline-fields {
  display: flex;
  // flex-direction: column;
  grid-template-columns: minmax(190px, 0.34fr) minmax(0, 1fr);
  gap: 0.9rem;

  .input-wrapper {
    margin: 0;
    width: 75% !important;
    &:first-child {
      width: 25% !important;
    }
    textarea {
      max-height: 50px;
      border-radius: 15px;
    }
  }

  label {
    display: block;
    margin-bottom: 0.45rem;
    color: #64748b;
    font-size: 0.78rem;
    font-weight: 900;
  }

  textarea {
    min-height: 118px;
    resize: vertical;
  }
}

.event-timeline-add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  margin-top: 1rem;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--PrimaryColor), #14b8a6);
  color: #ffffff;
  font-size: 0.9rem;
  padding: 0.7rem 1.1rem;
  box-shadow: 0 14px 26px color-mix(in srgb, var(--PrimaryColor) 22%, transparent);
}

:deep(.event-timeline-fields .p-datepicker) {
  width: 100%;
}

:deep(.event-timeline-fields .p-inputtext) {
  width: 100%;
  border-color: rgba(226, 232, 240, 0.95);
  border-radius: 14px !important;
  background: #ffffff;
  color: var(--header-page-color);
  font-weight: 800;
  padding: 0.78rem 0.9rem !important;
}

@media (max-width: 760px) {
  .event-timeline-item {
    grid-template-columns: 34px minmax(0, 1fr);
    gap: 0.65rem;
  }

  .event-timeline-list::before {
    inset-inline-start: 17px;
  }

  .event-timeline-marker span {
    width: 32px;
    height: 32px;
    border-width: 3px;
  }

  .event-timeline-fields {
    grid-template-columns: 1fr;
  }

  .event-timeline-card-header {
    flex-direction: column;
  }
}

.similar-observations-section {
  width: 100%;
  margin-top: 1rem;
  border: 1px solid var(--main-border);
  border-radius: 18px;
  background:
    radial-gradient(
      circle at 0% 0%,
      color-mix(in srgb, var(--PrimaryColor) 9%, transparent),
      transparent 34%
    ),
    var(--BgWhite);
  box-shadow: 0 8px 16px color-mix(in srgb, var(--Black) 10%, transparent);
  padding: 1.25rem;
}

.similar-observations-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.85rem;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.similar-observation-card {
  display: flex;
  min-height: 122px;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.6rem;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 12%, var(--main-border));
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    var(--BgWhite),
    color-mix(in srgb, var(--PrimaryColor) 5%, white)
  );
  padding: 1rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: color-mix(in srgb, var(--PrimaryColor) 30%, var(--main-border));
    box-shadow: 0 16px 30px color-mix(in srgb, var(--Black) 8%, transparent);
  }

  span {
    width: fit-content;
    border-radius: 999px;
    background: color-mix(in srgb, var(--PrimaryColor) 12%, white);
    color: var(--PrimaryColor);
    font-size: 0.75rem;
    font-weight: 900;
    padding: 0.35rem 0.7rem;
  }

  strong {
    color: var(--header-page-color);
    font-size: 1rem;
    font-weight: 900;
    line-height: 1.45;
  }

  small {
    color: var(--GrayText-1);
    font-size: 0.8rem;
    font-weight: 800;
  }

  &.loading {
    overflow: hidden;
    pointer-events: none;

    span,
    strong,
    small {
      display: block;
      border-radius: 999px;
      background: linear-gradient(90deg, #eef2f7, #f8fafc, #eef2f7);
      background-size: 220% 100%;
      color: transparent;
      animation: similarLoading 1.2s ease-in-out infinite;
    }

    span {
      width: 72px;
      height: 28px;
    }

    strong {
      width: 80%;
      height: 18px;
    }

    small {
      width: 44%;
      height: 14px;
    }
  }
}

.similar-observations-empty {
  margin: 0;
  border-radius: 14px;
  background: var(--Gray-1);
  color: var(--GrayText-1);
  font-weight: 800;
  padding: 1rem;
}

@keyframes similarLoading {
  0% {
    background-position: 120% 0;
  }

  100% {
    background-position: -120% 0;
  }
}

.section-heading {
  margin-bottom: 1rem;

  span {
    color: var(--PrimaryColor);
    font-size: 0.76rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h2 {
    margin: 0.25rem 0 0;
    color: var(--header-page-color);
    font-size: 1.35rem;
    font-weight: 900;
  }
}

:deep(.p-editor-container) {
  border-radius: 16px;
  overflow: hidden;
}

:deep(.p-editor-toolbar) {
  border-color: var(--main-border);
  background: var(--Gray-1);
}

:deep(.p-editor-content) {
  border-color: var(--main-border);
}

.investigation-result-inputs {
  @media (max-width: 568px) {
    flex-wrap: wrap;

    .input-wrapper {
      width: 100%;
    }
  }
}
.btns {
  display: flex;
  gap: 1rem;
  justify-content: space-between !important;

  button,
  a {
    width: 50% !important;
  }
}
.investigation-result .btns .btn-primary {
  max-width: 100% !important;
}
</style>
