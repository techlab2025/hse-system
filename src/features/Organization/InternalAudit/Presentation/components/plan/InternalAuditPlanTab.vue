<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import DatePicker from 'primevue/datepicker'
import TitleInterface from '@/base/Data/Models/title_interface'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import HandleFIlesUpload, { type UploadedFile } from '@/features/Organization/OrganizationEmployee/Presentation/supcomponents/HandleFIlesUpload.vue'
import IndexProjectController from '@/features/Organization/Project/Presentation/controllers/indexProjectController'
import IndexProjectParams from '@/features/Organization/Project/Core/params/indexProjectParams'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import IndexHerikalyController from '@/features/Organization/Herikaly/Presentation/controllers/indexHerikalyController'
import IndexHerikalyParams from '@/features/Organization/Herikaly/Core/params/indexHerikalyParams'
import AddInternalAuditPlanParams from '../../../Core/params/plan/addInternalAuditPlanParams'
import EditInternalAuditPlanParams from '../../../Core/params/plan/editInternalAuditPlanParams'
import ShowInternalAuditPlanParams from '../../../Core/params/plan/showInternalAuditPlanParams'
import InternalAuditPlanEmployeeParams from '../../../Core/params/plan/InternalAuditPlanEmployeeParams'
import InternalAuditPlanActivityParams from '../../../Core/params/plan/InternalAuditPlanActivityParams'
import InternalAuditPlanScopeParams from '../../../Core/params/plan/InternalAuditPlanScopeParams'
import InternalAuditPlanScheduleParams from '../../../Core/params/plan/InternalAuditPlanScheduleParams'
import AddInternalAuditPlanController from '../../controllers/plan/addInternalAuditPlanController'
import EditInternalAuditPlanController from '../../controllers/plan/editInternalAuditPlanController'
import ShowInternalAuditPlanController from '../../controllers/plan/showInternalAuditPlanController'

// TODO: Replace the temporary options below with IndexAuditStandardController and
// IndexAuditStandardParams when the Audit Standard CRUD feature is available.
// import IndexAuditStandardController from '@/features/Organization/AuditStandard/Presentation/controllers/indexAuditStandardController'
// import IndexAuditStandardParams from '@/features/Organization/AuditStandard/Core/params/indexAuditStandardParams'

// TODO: Replace the temporary options below with IndexAuditActivityController and
// IndexAuditActivityParams when the Audit Activity CRUD feature is available.
// import IndexAuditActivityController from '@/features/Organization/AuditActivity/Presentation/controllers/indexAuditActivityController'
// import IndexAuditActivityParams from '@/features/Organization/AuditActivity/Core/params/indexAuditActivityParams'

type ScopeRow = { department: TitleInterface | null; activities: TitleInterface[] }
type ScheduleRow = {
  startTime: Date | null
  endTime: Date | null
  day: Date | null
  focus: TitleInterface | null
  location: string
  assignedAuditor: TitleInterface | null
}

const props = withDefaults(
  defineProps<{
    internalAuditPlanId?: number
    auditStatus?: string
  }>(),
  { internalAuditPlanId: 0, auditStatus: '' },
)
const emit = defineEmits<{ saved: [] }>()

const router = useRouter()
const projectController = IndexProjectController.getInstance()
const employeeController = IndexOrganizatoinEmployeeController.getInstance()
const hierarchyController = IndexHerikalyController.getInstance()
const projectParams = new IndexProjectParams('', 1, 1000, 0)
const employeeParams = new IndexOrganizatoinEmployeeParams('', 1, 1000, 0)
const hierarchyParams = new IndexHerikalyParams('', 1, 1000, 0, true)
const showController = ShowInternalAuditPlanController.getInstance()
const editController = EditInternalAuditPlanController.getInstance()

const fullCompanyOption = new TitleInterface({ id: 0, title: 'Full Company' })
const projectOptions = ref<TitleInterface[]>([fullCompanyOption])
const selectedProject = ref<TitleInterface | null>(null)
const auditStartDate = ref<Date | null>(dateFromString(today()))
const auditEndDate = ref<Date | null>(dateFromString(today()))
const auditStandard = ref<TitleInterface | null>(null)
const auditTeam = ref<TitleInterface[]>([])
const leadAuditor = ref<TitleInterface | null>(null)
const saving = ref(false)
const error = ref('')
const success = ref('')
const loadedStatus = ref(props.auditStatus)

const auditStandardOptions = ref<TitleInterface[]>([
  new TitleInterface({ id: 1, title: 'ISO 45001:2018' }),
  new TitleInterface({ id: 2, title: 'ISO 14001:2015' }),
  new TitleInterface({ id: 3, title: 'ISO 9001:2015' }),
])
const auditActivityOptions = ref<TitleInterface[]>([
  new TitleInterface({ id: 1, title: 'Equipment maintenance' }),
  new TitleInterface({ id: 2, title: 'Workplace inspection' }),
  new TitleInterface({ id: 3, title: 'Calibration records' }),
  new TitleInterface({ id: 4, title: 'Risk assessment and legal compliance' }),
  new TitleInterface({ id: 5, title: 'Fire and emergency' }),
])

const scopes = ref<ScopeRow[]>([{ department: null, activities: [] }])
const schedules = ref<ScheduleRow[]>([createSchedule()])
const generalInstructions = ref(
  'All staff must be notified in advance of the onsite audit: the purpose of the audit, and of their roles. They may be interviewed.\nBefore the audit, keep aside process maps, procedures, work instructions, and supporting documentation.\nWhere applicable, agree corrective and preventive actions and target dates.\nSenior management should attend opening and closing meetings.',
)
const scheduleAttachments = ref<string[]>([])
const selectedTeamOptions = computed(() => auditTeam.value)
const auditFocusOptions = computed(() =>
  scopes.value
    .map((scope) => scope.department)
    .filter((department): department is TitleInterface => Boolean(department)),
)
const isExisting = computed(() => props.internalAuditPlanId > 0)
const isPublished = computed(() => loadedStatus.value.toLowerCase() === 'planned' && isExisting.value)
const isReported = computed(() => loadedStatus.value.toLowerCase() === 'reported')

onMounted(async () => {
  const projects = await projectController.fetch(projectParams)
  projectOptions.value = [fullCompanyOption, ...projects]
  await loadPlan()
})

watch(
  () => props.internalAuditPlanId,
  () => void loadPlan(),
)

function today(): string {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function dateFromString(value: string): Date | null {
  if (!value) return null
  const [year, month, day] = value.slice(0, 10).split('-').map(Number)
  return year && month && day ? new Date(year, month - 1, day) : null
}

function timeFromString(value: string): Date | null {
  if (!value) return null
  const [hours, minutes] = value.split(':').map(Number)
  const date = new Date()
  date.setHours(hours || 0, minutes || 0, 0, 0)
  return date
}

function titleFrom(value: unknown): TitleInterface | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const item = value as Record<string, unknown>
  return new TitleInterface({
    id: Number(item.id ?? 0),
    title: String(item.title ?? item.name ?? ''),
  })
}

function addOption(options: TitleInterface[], value: TitleInterface | null) {
  if (value && !options.some((option) => Number(option.id) === Number(value.id))) options.push(value)
}

async function loadPlan() {
  if (!props.internalAuditPlanId) return
  error.value = ''
  await showController.getData(new ShowInternalAuditPlanParams(props.internalAuditPlanId))
  if (!showController.isDataSuccess() || !showController.state.value.data) {
    error.value = showController.state.value.error?.title ?? 'Unable to load the audit plan.'
    return
  }

  const plan = showController.state.value.data
  loadedStatus.value = plan.status
  auditStartDate.value = dateFromString(plan.auditStartDate)
  auditEndDate.value = dateFromString(plan.auditEndDate)
  selectedProject.value = plan.fullCompany ? fullCompanyOption : plan.project
  auditStandard.value = plan.auditStandard
  addOption(auditStandardOptions.value, plan.auditStandard)

  auditTeam.value = plan.auditTeam
    .map((entry) => {
      const item = (entry ?? {}) as Record<string, unknown>
      return titleFrom(item.employee ?? item.organization_employee ?? item)
    })
    .filter((employee): employee is TitleInterface => Boolean(employee))
  const leaderEntry = plan.auditTeam.find((entry) => {
    const item = (entry ?? {}) as Record<string, unknown>
    return Boolean(item.is_leader ?? item.is_lead_auditor)
  }) as Record<string, unknown> | undefined
  leadAuditor.value = titleFrom(
    leaderEntry?.employee ?? leaderEntry?.organization_employee ?? leaderEntry,
  )

  scopes.value = plan.auditScope.map((entry) => {
    const item = (entry ?? {}) as Record<string, unknown>
    const activities = Array.isArray(item.activities)
      ? item.activities
      : Array.isArray(item.audit_activities)
        ? item.audit_activities
        : Array.isArray(item.audit_activitys)
          ? item.audit_activitys
          : []
    const mappedActivities = activities
      .map((activity) => titleFrom(activity))
      .filter((activity): activity is TitleInterface => Boolean(activity))
    mappedActivities.forEach((activity) => addOption(auditActivityOptions.value, activity))
    return {
      department: titleFrom(item.department ?? item.depertment),
      activities: mappedActivities,
    }
  })
  if (!scopes.value.length) scopes.value = [{ department: null, activities: [] }]

  schedules.value = plan.auditSchedule.map((entry) => {
    const item = (entry ?? {}) as Record<string, unknown>
    const attachments = item.attachments
    if (Array.isArray(attachments)) scheduleAttachments.value = attachments.map(String)
    if (typeof item.general_instructions === 'string') generalInstructions.value = item.general_instructions
    return {
      startTime: timeFromString(String(item.start_time ?? '')),
      endTime: timeFromString(String(item.end_time ?? '')),
      day: dateFromString(String(item.day ?? item.date ?? '')),
      focus: titleFrom(item.audit_focus ?? item.audit_foucse ?? item.focus),
      location: String(item.location ?? ''),
      assignedAuditor: titleFrom(
        item.assigned_auditor ?? item.assigend_auditor ?? item.assigned_auditors,
      ),
    }
  })
  if (!schedules.value.length) schedules.value = [createSchedule()]
}

function createSchedule(): ScheduleRow {
  return {
    startTime: timeFromString('09:00'),
    endTime: timeFromString('10:00'),
    day: auditStartDate.value ? new Date(auditStartDate.value) : dateFromString(today()),
    focus: null,
    location: '',
    assignedAuditor: null,
  }
}

function normalizeSingle(value: TitleInterface | TitleInterface[] | null): TitleInterface | null {
  return Array.isArray(value) ? (value[0] ?? null) : value
}

function setTeam(value: TitleInterface | TitleInterface[] | null) {
  auditTeam.value = Array.isArray(value) ? value : value ? [value] : []
  if (leadAuditor.value && !auditTeam.value.some((member) => member.id === leadAuditor.value?.id)) {
    leadAuditor.value = null
  }
}

function setScopeDepartment(index: number, value: TitleInterface | TitleInterface[] | null) {
  scopes.value[index]!.department = Array.isArray(value) ? (value[0] ?? null) : value
  scopes.value[index]!.activities = []
  schedules.value.forEach((schedule) => {
    if (
      schedule.focus &&
      !scopes.value.some((scope) => Number(scope.department?.id) === Number(schedule.focus?.id))
    ) {
      schedule.focus = null
    }
  })
}

function setScopeActivities(index: number, value: TitleInterface | TitleInterface[] | null) {
  scopes.value[index]!.activities = Array.isArray(value) ? value : value ? [value] : []
}

function setScheduleValue(index: number, key: 'focus' | 'assignedAuditor', value: TitleInterface | TitleInterface[] | null) {
  schedules.value[index]![key] = Array.isArray(value) ? (value[0] ?? null) : value
}

function setScheduleFiles(files: UploadedFile[]) {
  scheduleAttachments.value = files.map((file) => file.base64 || file.url).filter(Boolean)
}

function formatDate(value: Date | null): string {
  if (!value) return ''
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`
}

function formatTime(value: Date | null): string {
  if (!value) return ''
  return `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`
}

function buildParams(isDraft: boolean): AddInternalAuditPlanParams {
  const team = auditTeam.value.map(
    (employee) => new InternalAuditPlanEmployeeParams(Number(employee.id), employee.id === leadAuditor.value?.id),
  )
  const scopeParams = scopes.value
    .filter((scope) => scope.department)
    .map(
      (scope) =>
        new InternalAuditPlanScopeParams(
          Number(scope.department!.id),
          scope.activities.map((activity) => new InternalAuditPlanActivityParams(Number(activity.id))),
        ),
    )
  const scheduleParams = schedules.value.map(
    (schedule) =>
      new InternalAuditPlanScheduleParams(
        formatTime(schedule.startTime),
        formatTime(schedule.endTime),
        formatDate(schedule.day),
        Number(schedule.focus?.id ?? 0),
        schedule.location,
        Number(schedule.assignedAuditor?.id ?? 0),
        generalInstructions.value,
        scheduleAttachments.value,
      ),
  )
  const isFullCompany = Number(selectedProject.value?.id) === 0
  return new AddInternalAuditPlanParams(
    formatDate(auditStartDate.value),
    formatDate(auditEndDate.value),
    isFullCompany ? null : Number(selectedProject.value?.id ?? 0),
    isFullCompany,
    Number(auditStandard.value?.id ?? 0),
    team,
    scopeParams,
    scheduleParams,
    isDraft,
  )
}

function validate(isDraft: boolean): boolean {
  error.value = ''
  if (isDraft) return true
  if (!auditStartDate.value || !auditEndDate.value || !selectedProject.value) error.value = 'Complete the audit dates and project scope.'
  else if (auditEndDate.value < auditStartDate.value) error.value = 'Audit end date must be on or after the start date.'
  else if (!auditStandard.value) error.value = 'Select an audit standard.'
  else if (!auditTeam.value.length || !leadAuditor.value || !auditTeam.value.some((member) => Number(member.id) === Number(leadAuditor.value?.id))) error.value = 'Select a lead auditor from the audit team.'
  else if (!scopes.value.length || scopes.value.some((scope) => !scope.department || !scope.activities.length)) error.value = 'Every audit scope row requires a department and at least one activity.'
  else if (!schedules.value.length) error.value = 'Add at least one audit schedule activity.'
  else {
    const start = formatDate(auditStartDate.value)
    const end = formatDate(auditEndDate.value)
    const invalidSchedule = schedules.value.find((schedule) => {
      const day = formatDate(schedule.day)
      return (
        !schedule.startTime ||
        !schedule.endTime ||
        formatTime(schedule.endTime) <= formatTime(schedule.startTime) ||
        !day ||
        day < start ||
        day > end ||
        !schedule.focus ||
        !schedule.location.trim() ||
        !schedule.assignedAuditor ||
        !auditTeam.value.some(
          (member) => Number(member.id) === Number(schedule.assignedAuditor?.id),
        )
      )
    })
    if (invalidSchedule) {
      error.value = 'Complete every schedule row. Dates must be inside the audit period and end time must follow start time.'
    }
  }
  return !error.value
}

async function submit(isDraft: boolean) {
  if (isReported.value) {
    error.value = 'Issued audit reports are fixed and the audit plan can no longer be changed.'
    return
  }
  if (!validate(isDraft)) return
  saving.value = true
  success.value = ''
  try {
    if (isExisting.value) {
      const params = buildParams(isDraft)
      await editController.editInternalAuditPlan(
        new EditInternalAuditPlanParams(
          props.internalAuditPlanId,
          params.auditStartDate,
          params.auditEndDate,
          params.projectId,
          params.fullCompany,
          params.auditStandardId,
          params.auditTeam,
          params.auditScope,
          params.auditSchedule,
          params.isDraft,
        ),
      )
      if (editController.isDataSuccess()) {
        loadedStatus.value = isDraft ? 'draft' : 'planned'
        success.value = isDraft ? 'Audit draft saved.' : 'Audit plan updated.'
        emit('saved')
      } else {
        error.value = editController.state.value.error?.title ?? 'Unable to update the audit plan.'
      }
    } else {
      await AddInternalAuditPlanController.getInstance().addInternalAuditPlan(buildParams(isDraft), router)
    }
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <form class="audit-plan" @submit.prevent="submit(false)">
    <section class="audit-section">
      <div class="section-title"><span>01</span><div><h2>Audit Overview</h2><p>Define when, where, and who will conduct this internal audit.</p></div></div>
      <div class="form-grid">
        <label v-if="isExisting" class="field"><span>Audit No.</span><input :value="showController.state.value.data?.title" type="text" readonly /></label>
        <label class="field"><span>Audit Start Date <b>*</b></span><DatePicker v-model="auditStartDate" date-format="yy-mm-dd" show-icon fluid placeholder="Select start date" /></label>
        <label class="field"><span>Audit End Date <b>*</b></span><DatePicker v-model="auditEndDate" date-format="yy-mm-dd" show-icon fluid placeholder="Select end date" /></label>
        <UpdatedCustomInputSelect class="field" :model-value="selectedProject" :static-options="projectOptions" label="Project / company" placeholder="Select a project" required @update:model-value="selectedProject = normalizeSingle($event)">
          <template #option="{ option }"><span>{{ option.title }}<small v-if="Number(option.id) === 0" class="company-option">Company-wide audit</small></span></template>
        </UpdatedCustomInputSelect>
        <UpdatedCustomInputSelect class="field" :model-value="auditStandard" :static-options="auditStandardOptions" label="Audit Standard" placeholder="Select audit standard" required @update:model-value="auditStandard = normalizeSingle($event)" />
        <UpdatedCustomInputSelect class="field field-wide" :model-value="auditTeam" :controller="employeeController" :params="employeeParams" type="multiselect" label="Audit Team" placeholder="Select audit team members" required @update:model-value="setTeam" />
        <UpdatedCustomInputSelect class="field" :model-value="leadAuditor" :static-options="selectedTeamOptions" label="Lead Auditor" placeholder="Select from audit team" required @update:model-value="leadAuditor = normalizeSingle($event)" />
      </div>
    </section>

    <section class="audit-section">
      <div class="section-title"><span>02</span><div><h2>Audit Scope</h2><p>Select the departments and activities included in this audit.</p></div></div>
      <div v-for="(scope, index) in scopes" :key="index" class="scope-row">
        <UpdatedCustomInputSelect :model-value="scope.department" :controller="hierarchyController" :params="hierarchyParams" label="Department" placeholder="Select department" @update:model-value="setScopeDepartment(index, $event)" />
        <UpdatedCustomInputSelect :model-value="scope.activities" :static-options="auditActivityOptions" type="multiselect" label="Audit Activities" placeholder="Select activities" @update:model-value="setScopeActivities(index, $event)" />
        <button class="icon-button danger" type="button" aria-label="Remove audit scope" @click="scopes.splice(index, 1)">×</button>
      </div>
      <button class="outline-button" type="button" @click="scopes.push({ department: null, activities: [] })">＋ Add Audit Scope</button>
    </section>

    <section class="audit-section">
      <div class="section-title"><span>03</span><div><h2>Audit Schedule</h2><p>Break the audit into timed activities and assign an auditor.</p></div></div>
      <article v-for="(schedule, index) in schedules" :key="index" class="schedule-card">
        <header><strong>Activity {{ index + 1 }}</strong><button v-if="schedules.length > 1" class="icon-button danger" type="button" @click="schedules.splice(index, 1)">×</button></header>
        <div class="schedule-grid">
          <label class="field"><span>Start Time <b>*</b></span><DatePicker v-model="schedule.startTime" time-only hour-format="24" fluid placeholder="09:00" /></label>
          <label class="field"><span>End Time <b>*</b></span><DatePicker v-model="schedule.endTime" time-only hour-format="24" fluid placeholder="10:00" /></label>
          <label class="field"><span>Day <b>*</b></span><DatePicker v-model="schedule.day" date-format="yy-mm-dd" show-icon fluid placeholder="Select day" /></label>
          <UpdatedCustomInputSelect class="field" :model-value="schedule.focus" :static-options="auditFocusOptions" label="Audit Focus" placeholder="Select from audit scope" required @update:model-value="setScheduleValue(index, 'focus', $event)" />
          <label class="field"><span>Location <b>*</b></span><input v-model="schedule.location" type="text" placeholder="Enter location" /></label>
          <UpdatedCustomInputSelect class="field" :model-value="schedule.assignedAuditor" :static-options="selectedTeamOptions" label="Assigned Auditor" placeholder="Select from audit team" required @update:model-value="setScheduleValue(index, 'assignedAuditor', $event)" />
        </div>
      </article>
      <button class="outline-button" type="button" @click="schedules.push(createSchedule())">＋ Add Activity</button>

    </section>
      <div class="schedule-shared-fields">
        <label class="field field-wide"><span>General Instructions</span><textarea v-model="generalInstructions" rows="4" placeholder="Add general instructions for the audit schedule" /></label>
        <div class="field field-wide"><HandleFIlesUpload label="Schedule attachments" accept=".pdf,.doc,.docx,.xls,.xlsx,image/*" :multiple="true" :max-files="8" @change="setScheduleFiles" /></div>
      </div>
    <p v-if="error" class="form-error" role="alert">{{ error }}</p>
    <p v-if="success" class="form-success" role="status">{{ success }}</p>
    <p v-if="isReported" class="form-success">This audit has been reported. The issued record is read-only.</p>
    <footer v-if="!isReported" class="form-actions">
      <button v-if="!isPublished" class="btn btn-secondary" type="button" :disabled="saving" @click="submit(true)">Save Draft</button>
      <button class="btn btn-primary" type="submit" :disabled="saving">{{ saving ? 'Saving…' : isPublished ? 'Save Changes' : 'Publish Plan' }}</button>
    </footer>
  </form>
</template>

<style scoped>
:deep(.upload-area){
  border: 1px solid lightgray !important;
}
.audit-plan{display:grid;gap:20px}.audit-section{padding:24px;border:1px solid var(--main-border,#d9e1df);border-radius:18px;background:var(--card-bg,#fff)}.section-title{display:flex;gap:12px;align-items:flex-start;margin-bottom:22px}.section-title>span{display:grid;width:34px;height:34px;place-items:center;border-radius:10px;background:color-mix(in srgb,var(--PrimaryColor,#087d80) 12%,transparent);color:var(--PrimaryColor,#087d80);font-weight:700}.section-title h2{margin:0;color:var(--text-primary,#172334);font-size:1.08rem}.section-title p{margin:4px 0 0;color:var(--text-soft,#687777);font-size:.86rem}.form-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.field{display:flex;min-width:0;flex-direction:column;gap:8px}.field-wide{grid-column:span 2}.field>span{color:var(--text-primary,#172334);font-size:.84rem;font-weight:600}.field b{color:#cf3030}.field input,.field textarea{width:100%;border:1px solid var(--main-border,#cbd8d6);border-radius:10px;background:transparent;padding:11px 13px;color:var(--text-primary,#172334);outline:none}.field input[readonly]{background:var(--surface-ground,#f4f7f6)}.field input:focus,.field textarea:focus{border-color:var(--PrimaryColor,#087d80);box-shadow:0 0 0 3px color-mix(in srgb,var(--PrimaryColor,#087d80) 10%,transparent)}.company-option{display:block;color:var(--text-soft,#687777);font-size:.72rem}.scope-row{display:grid;grid-template-columns:1fr 1.5fr auto;gap:14px;align-items:end;margin-bottom:14px;padding:16px;border-radius:12px;background:var(--surface-ground,#f6f9f8)}.schedule-card{overflow:hidden;margin-bottom:14px;border:1px solid var(--main-border,#d9e1df);border-radius:14px}.schedule-card header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:color-mix(in srgb,var(--PrimaryColor,#087d80) 7%,transparent);color:var(--text-primary,#172334)}.schedule-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;padding:18px}.schedule-shared-fields{display:grid;grid-template-columns:minmax(0,2fr) minmax(0,1fr);gap:16px;margin-top:18px;padding-top:18px;border-top:1px solid var(--main-border,#d9e1df)}.icon-button{width:36px;height:36px;border:1px solid var(--main-border,#cbd8d6);border-radius:9px;background:transparent;font-size:1.35rem}.danger{color:#b42318}.outline-button{border:1px solid var(--PrimaryColor,#087d80);border-radius:10px;background:transparent;padding:10px 15px;color:var(--PrimaryColor,#087d80);font-weight:600}.form-actions{display:flex;justify-content:flex-end;gap:12px;padding:4px}.form-error,.form-success{margin:0;border-radius:10px;padding:12px 16px}.form-error{background:#fff0f0;color:#b42318}.form-success{background:#e9f8f1;color:#16734b}@media(max-width:900px){.form-grid,.schedule-grid{grid-template-columns:1fr 1fr}.field-wide{grid-column:span 2}.scope-row{grid-template-columns:1fr}.schedule-shared-fields{grid-template-columns:1fr}}@media(max-width:600px){.form-grid,.schedule-grid{grid-template-columns:1fr}.field-wide{grid-column:span 1}.audit-section{padding:16px}}
</style>
