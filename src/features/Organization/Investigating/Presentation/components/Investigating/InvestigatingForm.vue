<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import type ShowInvestigatingTypeModel from '@/features/setting/InvestigatingType/Data/models/hazardTypeDetailsModel'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import TabsSelection from '@/shared/HelpersComponents/TabsSelection.vue'
// import InvestigatingIcon from '@/shared/icons/InvestigatingIcon.vue'
import DatePicker from 'primevue/datepicker'

import IndexEquipmentParams from '@/features/setting/Equipment/Core/params/indexEquipmentParams'
import FileUpload from '@/shared/FormInputs/FileUpload.vue'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
import detectiveImage from '@/assets/images/detective.png'
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
// import IndexInvestigatingTypeParams from '@/features/setting/InvestigatingType/Core/params/indexInvestigatingTypeParams'
// import IndexInvestigatingTypeController from '@/features/setting/InvestigatingType/Presentation/controllers/indexInvestigatingTypeController'
import EditInvestigatingParams from '../../../Core/params/editInvestigatingParams'
import AddInvestigatingParams from '../../../Core/params/addInvestigatingParams'
import { Observation } from '../../../Core/Enums/ObservationTypeEnum'
import type { RiskLevelEnum } from '@/features/Organization/ObservationFactory/Core/Enums/risk_level_enum'
import { TypesEnum } from '@/features/Organization/ObservationFactory/Core/Enums/types_enum'
import { SaveStatusEnum } from '@/features/Organization/ObservationFactory/Core/Enums/save_status_enum'
import ObservationLevel from '../../../../ObservationFactory/Presentation/components/Ovservation/ObservationLevel.vue'
import HazerdType from '../../../../ObservationFactory/Presentation/components/Ovservation/HazerdType.vue'
import IndexEquipmentController from '@/features/setting/Equipment/Presentation/controllers/indexEquipmentController'
import FactorInvestigating from './FactorInvestigating.vue'
import meetingImage from '../../../../../../assets/images/meeting.png'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import { useRoute, useRouter } from 'vue-router'
import MeetingParams from '../../../Core/params/MeetingParams'
import InvestigatingEmployeeParams from '../../../Core/params/InvestegationEmployeeParams'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import { formatTime } from '@/base/Presentation/utils/time_format'
import ShowInvestigatingResultController from '../../controllers/investegationResult/ShowInvestigatingResultController'
import ShowInvestigationResultParams from '../../../Core/params/investegationResult/ShowInvestigationResultParams'
import { InvestigationMeetingEnum } from '../../../Core/Enums/investigation_meeting_enum'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog.ts'

const emit = defineEmits(['update:data'])
const props = defineProps<{
  data?: ShowInvestigatingTypeModel
}>()
const text = ref<string>('')
const date = ref<Date>(new Date())
const descripe = ref<string>('')
const image = ref<string>('')
const route = useRoute()
const id = route.query?.id

const indexOrganizatoinEmployeeController = IndexOrganizatoinEmployeeController.getInstance()
const indexOrganizatoinEmployeeParams = new IndexOrganizatoinEmployeeParams('', 1, 10, 1)

const Employees = ref<InvestigatingEmployeeParams[]>([])
const meetings = ref<MeetingParams[]>([])
const MeetingPlace = ref<string>('')
const isOtherMeetingPlatform = () =>
  Number(SelectedPlatform.value?.id) === InvestigationMeetingEnum.OTHER
const updateData = () => {
  const meeting =
    date?.value != undefined && time?.value != undefined
      ? new MeetingParams(
          formatJoinDate(date?.value),
          formatTime(time?.value) || null,
          SelectedPlatform?.value?.id,
          undefined,
          undefined,
          isOtherMeetingPlatform() ? MeetingPlace.value : undefined,
        )
      : null
  console.log(meeting, 'meeting')
  const params = props.data?.id
    ? new EditInvestigatingParams({
        id: props.data?.id,
        observationId: id as number,
        employees: Employees.value,
        meetings: meeting,
      })
    : new AddInvestigatingParams({
        observationId: id as number,
        employees: Employees.value,
        meetings: meeting,
      })

  emit('update:data', params)
}

watch([() => props.data], ([newData]) => {}, { immediate: true })

// const indexInvestigatingTypeParams = new IndexInvestigatingTypeParams('', 1, 10, 1)
// const indexInvestigatingTypeController = IndexInvestigatingTypeController.getInstance()
const InvestigatingType = ref<TitleInterface>()
const setInvestigatingType = (data: TitleInterface) => {
  InvestigatingType.value = data
  updateData()
}
const indexEquipmentParams = new IndexEquipmentParams('', 1, 10, 1)
const indexEquipmentController = IndexEquipmentController.getInstance()
const SelectedMachine = ref<TitleInterface>()
const setMachine = (data: TitleInterface) => {
  SelectedMachine.value = data
  updateData()
}

const setImage = async (data: File) => {
  image.value = await filesToBase64(data)
  updateData()
}
const ZoneIds = ref<number>()
const GetZones = (data: number) => {
  ZoneIds.value = data
  // console.log(ZoneIds.value, 'ZoneIds.value')
  updateData()
}
const riskLevel = ref<RiskLevelEnum | null>(null)
const isNearMiss = ref<boolean | number>(0)
const handleObservationLevel = (data: any) => {
  // console.log(data, 'data')
  riskLevel.value = data.level
  isNearMiss.value = data.is_near_miss
  updateData()
}
watch([riskLevel], () => {
  updateData()
})

const title = ref<string>('')
const isResult = ref<boolean>(false)
const isAction = ref<boolean>()
const saveStatus = ref<SaveStatusEnum | null>(null)
const actionText = ref<string>('')
const type_id = ref<number | null>(null)
const time = ref()

const handleInvestigatingData = (data: any) => {
  type_id.value = data.type_id
  isAction.value = data.take_action === 'yes'
  isResult.value = data.solved === 'yes'
  actionText.value = data.action
  updateData()
}

watch([title, date, riskLevel, isNearMiss, saveStatus, time], () => {
  updateData()
})

const SelectedTeam = ref<TitleInterface[]>([])
const setTeams = (data: TitleInterface[]) => {
  SelectedTeam.value = data

  const selectedLeaderId = SelectedTeamLeader.value?.id
  const leaderStillSelected = data.some((employee) => employee.id === selectedLeaderId)

  if (!leaderStillSelected) {
    SelectedTeamLeader.value = null
  }

  Employees.value = data.map(
    (employee) =>
      new InvestigatingEmployeeParams(
        employee.id!,
        leaderStillSelected && employee.id === selectedLeaderId,
      ),
  )
  updateData()
}

const SelectedTeamLeader = ref<TitleInterface | null>(null)
const setTeamLeader = (data: TitleInterface | null) => {
  SelectedTeamLeader.value = data
  Employees.value = Employees.value.map(
    (el) =>
      new InvestigatingEmployeeParams(
        el.organization_employee_id,
        Boolean(data?.id && el.organization_employee_id === data.id),
      ),
  )
  updateData()
}

type RequiredFieldRule = {
  key: string
  message: string
  isMissing: () => boolean
}

const requiredFieldErrors = ref<Record<string, string>>({})
const hasValue = (value: unknown) =>
  value !== null && value !== undefined && String(value).trim().length > 0

const requiredFields = computed<RequiredFieldRule[]>(() => [
  {
    key: 'SelectedTeam',
    message: 'Investigation Team Is Required',
    isMissing: () => !SelectedTeam.value.length,
  },
  {
    key: 'SelectedTeamLeader',
    message: 'Team Leader Is Required',
    isMissing: () => SelectedTeam.value.length > 0 && !hasValue(SelectedTeamLeader.value?.id),
  },
  {
    key: 'date',
    message: 'Meeting Date Is Required',
    isMissing: () => !date.value,
  },
  {
    key: 'time',
    message: 'Meeting Time Is Required',
    isMissing: () => !time.value,
  },
  {
    key: 'SelectedPlatform',
    message: 'Meeting Platform Is Required',
    isMissing: () => !hasValue(SelectedPlatform.value?.id),
  },
  {
    key: 'MeetingPlace',
    message: 'Meeting Place Is Required When Platform Is Other',
    isMissing: () => isOtherMeetingPlatform() && !hasValue(MeetingPlace.value),
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
  const container = document.querySelector<HTMLElement>(`[data-required-field="${key}"]`)
  container?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}

const validateRequiredFields = async () => {
  clearResolvedRequiredErrors()
  const missedFields = requiredFields.value.filter((field) => field.isMissing())
  requiredFieldErrors.value = missedFields.reduce<Record<string, string>>((acc, field) => {
    acc[field.key] = field.message
    return acc
  }, {})

  if (!missedFields.length) return true

  new OpenWarningDilaog(missedFields[0].message).openDialog()
  await scrollToRequiredField(missedFields[0].key)
  return false
}

defineExpose({
  validateRequiredFields,
})

const MeetingPlatforms = ref<TitleInterface[]>([
  new TitleInterface({ id: InvestigationMeetingEnum.ZOOM, title: 'Zoom' }),
  new TitleInterface({ id: InvestigationMeetingEnum.TEAM, title: 'Teams' }),
  new TitleInterface({ id: InvestigationMeetingEnum.SKYPE, title: 'Skype' }),
  new TitleInterface({ id: InvestigationMeetingEnum.GOOGLE_MEET, title: 'Google Meet' }),
  new TitleInterface({ id: InvestigationMeetingEnum.OTHER, title: 'Other' }),
])
const SelectedPlatform = ref<TitleInterface>(null)
const setSelectedPlatform = (data: TitleInterface) => {
  SelectedPlatform.value = data
  if (!isOtherMeetingPlatform()) MeetingPlace.value = ''
  updateData()
}

const setMeetingPlace = () => {
  updateData()
}

const router = useRouter()
const showInvestigationResultController = ShowInvestigatingResultController.getInstance()
const state = ref(showInvestigationResultController.state.value)
const ShoeInvestegationResultDetails = () => {
  const showInvestigationResultParams = new ShowInvestigationResultParams(route.query.id)
  showInvestigationResultController.ShowInvestigatingResult(showInvestigationResultParams, router)
}

onMounted(() => {
  ShoeInvestegationResultDetails()
})

watch(
  () => showInvestigationResultController.state.value,
  (newState) => {
    if (newState) {
      const latestMeeting =
        newState?.data?.investigationMeetings?.[newState.data.investigationMeetings.length - 1]
      state.value = newState
      date.value = latestMeeting?.date
      time.value = latestMeeting?.time
      SelectedPlatform.value = new TitleInterface({
        id: latestMeeting?.type,
        title: MeetingPlatforms.value.find((el) => el.id === latestMeeting?.type)?.title,
      })
      MeetingPlace.value = latestMeeting?.place ?? ''
      // Employees.value = newState?.data?.employees?.map(el => new InvestigatingEmployeeParams(el.id!, el.is_leader))
      // SelectedTeam.value = newState?.data?.employees?.map(el => new TitleInterface({ id: el.id!, title: el.name }))
      // SelectedTeamLeader.value = newState?.data?.employees?.find(el => el.is_leader)?.id
    }
  },
)
</script>

<template>
  <div class="col-span-6 md:col-span-6">
    <HeaderPage
      :title="'start investigating'"
      :subtitle="'Document what you observe to improve workplace safety'"
      :img="detectiveImage"
    />
  </div>
  <!-- <div class="col-span-6 md:col-span-6">
    <TabsSelection :LocationIds="[137]" @update:data="GetZones" />
  </div> -->
  <div class="investigating-form col-span-6 md:col-span-6">
    <div class="investigating-form-header">
      <p class="title">Investigating form <span>( #001 )</span></p>
    </div>
  </div>

  <div class="col-span-6 md:col-span-4 input-wrapper" data-required-field="SelectedTeam">
    <CustomSelectInput
      :modelValue="SelectedTeam"
      class="input"
      :controller="indexOrganizatoinEmployeeController"
      :params="indexOrganizatoinEmployeeParams"
      label="Investigation team"
      :type="2"
      id="machine"
      placeholder="select your team"
      @update:modelValue="setTeams"
    />
    <p v-if="getFieldError('SelectedTeam')" class="required-field-message">
      {{ getFieldError('SelectedTeam') }}
    </p>
  </div>
  <div class="col-span-6 md:col-span-2 input-wrapper" data-required-field="SelectedTeamLeader">
    <CustomSelectInput
      :modelValue="SelectedTeamLeader"
      class="input"
      :staticOptions="SelectedTeam"
      label="assign team leader "
      id="leader"
      placeholder="select your team leader"
      @update:modelValue="setTeamLeader"
    />
    <p v-if="getFieldError('SelectedTeamLeader')" class="required-field-message">
      {{ getFieldError('SelectedTeamLeader') }}
    </p>
  </div>

  <div class="meeting-investigation col-span-6 md:col-span-6">
    <img :src="meetingImage" alt="" class="meeting-icon" />

    <p>{{ $t('Investigation Meeting') }}</p>
  </div>

  <div class="col-span-6 md:col-span-3 input-wrapper" data-required-field="date">
    <label for="date">{{ $t('Date') }}</label>
    <DatePicker v-model="date" placeholder="Add your date" />
    <p v-if="getFieldError('date')" class="required-field-message">
      {{ getFieldError('date') }}
    </p>
  </div>
  <div class="col-span-6 md:col-span-3 input-wrapper" data-required-field="time">
    <label for="time">{{ $t('Time') }}</label>
    <DatePicker
      v-model="time"
      timeOnly
      hourFormat="24"
      placeholder="Add your time"
      @update:modelValue="updateData"
    />
    <p v-if="getFieldError('time')" class="required-field-message">
      {{ getFieldError('time') }}
    </p>
  </div>

  <!-- <FactorInvestigating /> -->
  <div class="col-span-6 md:col-span-6 input-wrapper" data-required-field="SelectedPlatform">
    <CustomSelectInput
      :modelValue="SelectedPlatform"
      class="input"
      :staticOptions="MeetingPlatforms"
      label="meeting platform "
      id="machine"
      placeholder="select meeting platform"
      @update:modelValue="setSelectedPlatform"
    />
    <p v-if="getFieldError('SelectedPlatform')" class="required-field-message">
      {{ getFieldError('SelectedPlatform') }}
    </p>
  </div>
  <div
    v-if="isOtherMeetingPlatform()"
    class="col-span-6 md:col-span-6 input-wrapper"
    data-required-field="MeetingPlace"
  >
    <label for="meeting-place">Meeting place</label>
    <input
      id="meeting-place"
      v-model="MeetingPlace"
      class="input"
      type="text"
      placeholder="Enter meeting place"
      @input="setMeetingPlace"
    />
    <p v-if="getFieldError('MeetingPlace')" class="required-field-message">
      {{ getFieldError('MeetingPlace') }}
    </p>
  </div>
</template>

<style scoped>
.required-field-message {
  margin-top: 0.35rem;
  color: var(--status-danger);
  font-size: 0.82rem;
  font-weight: 700;
}
</style>
