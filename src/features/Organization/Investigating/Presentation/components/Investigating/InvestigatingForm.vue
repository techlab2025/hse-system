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
const indexOrganizatoinEmployeeParams = new IndexOrganizatoinEmployeeParams('', 1, 10, 0)

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
  <section class="investigation-workspace col-span-6 md:col-span-6">
    <div class="workspace-glow workspace-glow-primary" aria-hidden="true"></div>
    <div class="workspace-glow workspace-glow-accent" aria-hidden="true"></div>

    <div class="investigation-hero">
      <HeaderPage
        :title="'start investigating'"
        :subtitle="'Document what you observe to improve workplace safety'"
        :img="detectiveImage"
      />

      <div class="investigation-reference">
        <span class="reference-dot" aria-hidden="true"></span>
        <div>
          <small>{{ $t('Investigation form') }}</small>
          <strong>#{{ props.data?.id || 'NEW' }}</strong>
        </div>
      </div>
    </div>

    <!-- <div class="investigation-progress" aria-label="Investigation setup progress">
      <div class="progress-step is-active">
        <span>01</span>
        <div>
          <strong>{{ $t('Build the team') }}</strong>
          <small>{{ $t('Select investigators and assign a leader') }}</small>
        </div>
      </div>
      <span class="progress-connector" aria-hidden="true"></span>
      <div class="progress-step">
        <span>02</span>
        <div>
          <strong>{{ $t('Schedule meeting') }}</strong>
          <small>{{ $t('Set when and where the team will meet') }}</small>
        </div>
      </div>
    </div> -->

    <div class="investigation-section team-section">
      <div class="section-heading">
        <span class="section-symbol team-symbol" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3 19v-1.5A4.5 4.5 0 0 1 7.5 13h1A4.5 4.5 0 0 1 13 17.5V19m1-6h2.5a4 4 0 0 1 4 4v2"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        </span>
        <div>
          <span class="section-kicker">{{ $t('Step 01') }}</span>
          <h3>{{ $t('Investigation Team') }}</h3>
          <p>{{ $t('Choose the people responsible for reviewing this incident') }}</p>
        </div>
        <span class="selection-summary">
          <strong>{{ SelectedTeam.length }}</strong>
          {{ $t('selected') }}
        </span>
      </div>

      <div class="section-fields team-fields">
        <div
          class="modern-field team-picker"
          :class="{ 'has-error': getFieldError('SelectedTeam') }"
          data-required-field="SelectedTeam"
        >
          <span class="field-number">01</span>
          <CustomSelectInput
            :modelValue="SelectedTeam"
            class="input"
            :controller="indexOrganizatoinEmployeeController"
            :params="indexOrganizatoinEmployeeParams"
            label="Investigation team"
            :type="2"
            id="investigation-team"
            placeholder="select your team"
            @update:modelValue="setTeams"
          />
          <p v-if="getFieldError('SelectedTeam')" class="required-field-message">
            {{ getFieldError('SelectedTeam') }}
          </p>
        </div>

        <div
          class="modern-field leader-picker"
          :class="{ 'has-error': getFieldError('SelectedTeamLeader') }"
          data-required-field="SelectedTeamLeader"
        >
          <span class="field-number">02</span>
          <CustomSelectInput
            :modelValue="SelectedTeamLeader"
            class="input"
            :staticOptions="SelectedTeam"
            label="assign team leader"
            id="team-leader"
            placeholder="select your team leader"
            @update:modelValue="setTeamLeader"
          />
          <p v-if="getFieldError('SelectedTeamLeader')" class="required-field-message">
            {{ getFieldError('SelectedTeamLeader') }}
          </p>
        </div>
      </div>
    </div>

    <div class="investigation-section meeting-section">
      <div class="section-heading">
        <span class="section-symbol meeting-symbol" aria-hidden="true">
          <img :src="meetingImage" alt="" />
        </span>
        <div>
          <span class="section-kicker">{{ $t('Step 02') }}</span>
          <h3>{{ $t('Investigation Meeting') }}</h3>
          <p>{{ $t('Coordinate the meeting details for the investigation team') }}</p>
        </div>
        <span class="meeting-state" :class="{ ready: date && time && SelectedPlatform }">
          <i aria-hidden="true"></i>
          {{ date && time && SelectedPlatform ? $t('Ready') : $t('Details required') }}
        </span>
      </div>

      <div class="section-fields meeting-fields">
        <div
          class="modern-field"
          :class="{ 'has-error': getFieldError('date') }"
          data-required-field="date"
        >
          <span class="field-number">01</span>
          <label for="investigation-date">{{ $t('Meeting Date') }}</label>
          <DatePicker
            v-model="date"
            inputId="investigation-date"
            placeholder="Add your date"
            showIcon
          />
          <p v-if="getFieldError('date')" class="required-field-message">
            {{ getFieldError('date') }}
          </p>
        </div>

        <div
          class="modern-field"
          :class="{ 'has-error': getFieldError('time') }"
          data-required-field="time"
        >
          <span class="field-number">02</span>
          <label for="investigation-time">{{ $t('Meeting Time') }}</label>
          <DatePicker
            v-model="time"
            inputId="investigation-time"
            timeOnly
            hourFormat="24"
            placeholder="Add your time"
            showIcon
            @update:modelValue="updateData"
          />
          <p v-if="getFieldError('time')" class="required-field-message">
            {{ getFieldError('time') }}
          </p>
        </div>

        <div
          class="modern-field platform-picker"
          :class="{ 'has-error': getFieldError('SelectedPlatform') }"
          data-required-field="SelectedPlatform"
        >
          <span class="field-number">03</span>
          <CustomSelectInput
            :modelValue="SelectedPlatform"
            class="input"
            :staticOptions="MeetingPlatforms"
            label="meeting platform"
            id="meeting-platform"
            placeholder="select meeting platform"
            @update:modelValue="setSelectedPlatform"
          />
          <p v-if="getFieldError('SelectedPlatform')" class="required-field-message">
            {{ getFieldError('SelectedPlatform') }}
          </p>
        </div>

        <Transition name="field-reveal">
          <div
            v-if="isOtherMeetingPlatform()"
            class="modern-field meeting-place-field"
            :class="{ 'has-error': getFieldError('MeetingPlace') }"
            data-required-field="MeetingPlace"
          >
            <span class="field-number">04</span>
            <label for="meeting-place">{{ $t('Meeting place') }}</label>
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
        </Transition>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.investigation-workspace {
  position: relative;
  isolation: isolate;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  gap: 18px;
  padding: 20px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 17%, var(--main-border));
  border-radius: 26px;
  background:
    linear-gradient(
      145deg,
      color-mix(in srgb, var(--PrimaryColor) 5%, transparent),
      transparent 38%
    ),
    var(--surface-1);
  box-shadow: 0 22px 55px color-mix(in srgb, var(--brand-primary-900) 10%, transparent);
}

.workspace-glow {
  position: absolute;
  z-index: -1;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  filter: blur(55px);
  pointer-events: none;
}

.workspace-glow-primary {
  top: -130px;
  inset-inline-end: -100px;
  background: color-mix(in srgb, var(--PrimaryColor) 15%, transparent);
}

.workspace-glow-accent {
  bottom: 18%;
  inset-inline-start: -180px;
  background: color-mix(in srgb, var(--brand-accent-500) 10%, transparent);
}

.investigation-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  min-height: 116px;
  padding: 14px 16px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 13%, var(--main-border));
  border-radius: 20px;
  background:
    radial-gradient(
      circle at 100% 0%,
      color-mix(in srgb, var(--PrimaryColor) 10%, transparent),
      transparent 42%
    ),
    color-mix(in srgb, var(--surface-2) 76%, transparent);
}

.investigation-hero :deep(.section-header-page-container) {
  flex: 1;
  margin: 0;
}

.investigation-hero :deep(.section-header-page) {
  min-height: 86px;
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.investigation-hero :deep(.section-img-page) {
  width: 82px;
  height: 82px;
  object-fit: contain;
  filter: drop-shadow(0 10px 16px color-mix(in srgb, var(--PrimaryColor) 16%, transparent));
}

.investigation-hero :deep(.title-page) {
  color: var(--text-strong);
  font-size: clamp(1.2rem, 2vw, 1.55rem);
  font-weight: 900;
  letter-spacing: -0.02em;
  text-transform: capitalize;
}

.investigation-hero :deep(.subtitle-page) {
  max-width: 520px;
  color: var(--text-soft);
  font-size: 0.8rem;
  line-height: 1.55;
}

.investigation-reference {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 150px;
  padding: 11px 13px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 18%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, var(--surface-1) 88%, transparent);
}

.reference-dot {
  width: 10px;
  height: 10px;
  flex: 0 0 10px;
  border-radius: 50%;
  background: var(--status-success);
  box-shadow: 0 0 0 5px color-mix(in srgb, var(--status-success) 12%, transparent);
}

.investigation-reference div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.investigation-reference small {
  color: var(--text-soft);
  font-size: 0.65rem;
  font-weight: 800;
}

.investigation-reference strong {
  color: var(--PrimaryColor);
  font-family: 'Bold';
  font-size: 0.84rem;
}

.investigation-progress {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 70px minmax(0, 1fr);
  align-items: center;
  gap: 14px;
  padding: 4px 10px;
}

.progress-step {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 10px;
}

.progress-step > span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  border: 1px solid var(--main-border);
  border-radius: 12px;
  background: var(--surface-2);
  color: var(--text-soft);
  font-family: 'Bold';
  font-size: 0.72rem;
}

.progress-step.is-active > span {
  border-color: color-mix(in srgb, var(--PrimaryColor) 30%, transparent);
  background: var(--PrimaryColor);
  box-shadow: 0 8px 18px color-mix(in srgb, var(--PrimaryColor) 22%, transparent);
  color: white;
}

.progress-step > div {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
}

.progress-step strong {
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.78rem;
}

.progress-step small {
  overflow: hidden;
  color: var(--text-soft);
  font-size: 0.66rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.progress-connector {
  height: 1px;
  background: linear-gradient(90deg, var(--PrimaryColor), var(--main-border));
  position: relative;
}

.progress-connector::after {
  content: '';
  position: absolute;
  top: 50%;
  inset-inline-end: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--main-border);
  transform: translateY(-50%);
}

.investigation-section {
  overflow: hidden;
  border: 1px solid var(--main-border);
  border-radius: 20px;
  background: var(--surface-1);
  box-shadow: 0 10px 28px color-mix(in srgb, var(--brand-primary-900) 6%, transparent);
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 17px 18px;
  border-bottom: 1px solid var(--main-border);
  background: color-mix(in srgb, var(--surface-2) 72%, transparent);
}

.section-symbol {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  border-radius: 14px;
}

.team-symbol {
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 20%, transparent);
  background: color-mix(in srgb, var(--PrimaryColor) 10%, transparent);
  color: var(--PrimaryColor);
}

.team-symbol svg {
  width: 24px;
  height: 24px;
}

.meeting-symbol {
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--brand-accent-500) 22%, transparent);
  background: color-mix(in srgb, var(--brand-accent-500) 10%, transparent);
}

.meeting-symbol img {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.section-heading > div {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
}

.section-kicker {
  margin-bottom: 2px;
  color: var(--PrimaryColor);
  font-size: 0.62rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.section-heading h3 {
  margin: 0;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.98rem;
  font-weight: 900;
}

.section-heading p {
  margin: 2px 0 0;
  color: var(--text-soft);
  font-size: 0.7rem;
  line-height: 1.4;
}

.selection-summary,
.meeting-state {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 32px;
  padding: 6px 10px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 16%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--PrimaryColor) 7%, transparent);
  color: var(--PrimaryColor);
  font-size: 0.68rem;
  font-weight: 800;
  white-space: nowrap;
}

.selection-summary strong {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 21px;
  height: 21px;
  border-radius: 50%;
  background: var(--PrimaryColor);
  color: white;
  font-size: 0.65rem;
}

.meeting-state {
  border-color: color-mix(in srgb, var(--brand-accent-500) 23%, transparent);
  background: color-mix(in srgb, var(--brand-accent-500) 8%, transparent);
  color: var(--brand-accent-600);
}

.meeting-state i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}

.meeting-state.ready {
  border-color: color-mix(in srgb, var(--status-success) 24%, transparent);
  background: color-mix(in srgb, var(--status-success) 9%, transparent);
  color: var(--status-success);
}

.section-fields {
  display: grid;
  gap: 14px;
  padding: 18px;
}

.team-fields {
  grid-template-columns: minmax(0, 2fr) minmax(230px, 1fr);
}

.meeting-fields {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.platform-picker,
.meeting-place-field {
  grid-column: 1 / -1;
}

.modern-field {
  position: relative;
  min-width: 0;
  padding: 16px 14px 14px;
  border: 1px solid var(--main-border);
  border-radius: 15px;
  background: color-mix(in srgb, var(--surface-2) 56%, transparent);
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;
}

.modern-field:focus-within {
  border-color: color-mix(in srgb, var(--PrimaryColor) 45%, var(--main-border));
  background: var(--surface-1);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--PrimaryColor) 8%, transparent);
}

.modern-field.has-error {
  border-color: color-mix(in srgb, var(--status-danger) 55%, var(--main-border));
  background: color-mix(in srgb, var(--status-danger) 4%, var(--surface-1));
}

.field-number {
  position: absolute;
  z-index: 2;
  top: 10px;
  inset-inline-end: 11px;
  color: color-mix(in srgb, var(--PrimaryColor) 55%, var(--text-soft));
  font-family: 'Bold';
  font-size: 0.6rem;
  letter-spacing: 0.05em;
}

.modern-field > label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-strong);
  font-size: 0.75rem;
  font-weight: 850;
}

.modern-field :deep(label) {
  color: var(--text-strong);
  font-size: 0.75rem;
  font-weight: 850;
}

.modern-field :deep(.p-datepicker),
.modern-field :deep(.p-datepicker-input),
.meeting-place-field > input {
  width: 100%;
}

.modern-field :deep(.p-datepicker-input),
.meeting-place-field > input {
  min-height: 48px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 13%, var(--main-border));
  border-radius: 12px;
  background: var(--surface-1);
  color: var(--text-strong);
  font-size: 0.8rem;
  box-shadow: none;
}

.modern-field :deep(.p-datepicker-input:focus),
.meeting-place-field > input:focus {
  border-color: var(--PrimaryColor);
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--PrimaryColor) 10%, transparent);
}

.modern-field :deep(.p-datepicker-dropdown) {
  width: 46px;
  border-color: color-mix(in srgb, var(--PrimaryColor) 13%, var(--main-border));
  border-radius: 0 12px 12px 0;
  background: color-mix(in srgb, var(--PrimaryColor) 8%, var(--surface-1));
  color: var(--PrimaryColor);
}

[dir='rtl'] .modern-field :deep(.p-datepicker-dropdown) {
  border-radius: 12px 0 0 12px;
}

.field-reveal-enter-active,
.field-reveal-leave-active {
  transition: 0.2s ease;
}

.field-reveal-enter-from,
.field-reveal-leave-to {
  transform: translateY(-6px);
  opacity: 0;
}

.required-field-message {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 8px 0 0;
  color: var(--status-danger);
  font-size: 0.72rem;
  font-weight: 800;
}

.required-field-message::before {
  content: '!';
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 17px;
  height: 17px;
  flex: 0 0 17px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--status-danger) 11%, transparent);
  font-family: 'Bold';
  font-size: 0.62rem;
}

@media (max-width: 820px) {
  .investigation-workspace {
    padding: 15px;
    border-radius: 21px;
  }

  .investigation-hero {
    align-items: stretch;
    flex-direction: column;
  }

  .investigation-reference {
    align-self: flex-start;
  }

  .investigation-progress {
    grid-template-columns: 1fr;
  }

  .progress-connector {
    display: none;
  }

  .team-fields,
  .meeting-fields {
    grid-template-columns: 1fr;
  }

  .platform-picker,
  .meeting-place-field {
    grid-column: auto;
  }
}

@media (max-width: 560px) {
  .investigation-workspace {
    gap: 14px;
    padding: 11px;
    border-radius: 17px;
  }

  .investigation-hero,
  .investigation-section {
    border-radius: 15px;
  }

  .investigation-hero :deep(.section-header-page) {
    align-items: flex-start;
    flex-direction: column;
  }

  .investigation-hero :deep(.section-img-page) {
    width: 64px;
    height: 64px;
  }

  .section-heading {
    align-items: flex-start;
    flex-wrap: wrap;
    padding: 15px;
  }

  .selection-summary,
  .meeting-state {
    margin-inline-start: 59px;
  }

  .section-fields {
    padding: 12px;
  }
}
</style>
