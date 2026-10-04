<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import TitleInterface from '@/base/Data/Models/title_interface'
import HandleFIlesUpload, {
  type UploadedFile,
} from '@/features/Organization/OrganizationEmployee/Presentation/supcomponents/HandleFIlesUpload.vue'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import IndexRootCausesController from '@/features/setting/RootCauses/Presentation/controllers/indexRootCausesController'
import IndexRootCausesParams from '@/features/setting/RootCauses/Core/params/indexRootCausesParams'
import IndexAuditStandardController from '@/features/Organization/AuditStandard/Presentation/controllers/indexAuditStandardController'
import IndexAuditStandardParams from '@/features/Organization/AuditStandard/Core/params/indexAuditStandardParams'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import { NcrCategoryEnum } from '../../../Core/enums/ncrs/NcrCategoryEnum'
import { InrernalAuditStatusEnum } from '../../../Core/enums/plan/PlanStatusENum'
import CreateNcrsParams from '../../../Core/params/ncrs/createNcrsParams'
import NcrAreaUnderReviewParams from '../../../Core/params/ncrs/ncrAreaUnderReviewParams'
import NcrCorrectiveActionParams from '../../../Core/params/ncrs/ncrCorrectiveActionParams'
import NcrInternalAuditTaskParams from '../../../Core/params/ncrs/ncrInternalAuditTaskParams'
import NcrPreventiveActionParams from '../../../Core/params/ncrs/ncrPreventiveActionParams'
import NcrRootCauseParams from '../../../Core/params/ncrs/ncrRootCauseParams'
import IndexNcrsParams from '../../../Core/params/ncrs/indexNcrsParams'
import type InternalAuditNcrModel from '../../../Data/models/ncrs/InternalAuditNcrModel'
import CreateNcrsController from '../../controllers/ncrs/createNcrsController'
import FetchNcrsController from '../../controllers/ncrs/fetchNcrsController'
import ShowInternalAuditPlanParams from '../../../Core/params/plan/showInternalAuditPlanParams'
import ShowInternalAuditPlanController from '../../controllers/plan/showInternalAuditPlanController'

type ActionForm = {
  correction: string
  assignedTo: TitleInterface | null
  targetDate: string
  actualDate: string
}

type CapaForm = {
  corrective: ActionForm
  preventive: ActionForm
}

const props = withDefaults(
  defineProps<{
    internalAuditPlanId?: number
    auditStatus?: string
    auditStartDate?: string
  }>(),
  { internalAuditPlanId: 0, auditStatus: '', auditStartDate: '' },
)

const emit = defineEmits<{
  open: [ncr: InternalAuditNcrModel]
}>()

const fetchController = FetchNcrsController.getInstance()
const createController = CreateNcrsController.getInstance()
const showPlanController = ShowInternalAuditPlanController.getInstance()
const employeeController = IndexOrganizatoinEmployeeController.getInstance()
const rootCauseController = IndexRootCausesController.getInstance()
const auditStandardController = IndexAuditStandardController.getInstance()
const route = useRoute()
const indexParams = new IndexNcrsParams('', 1, 1000, 0)
const employeeParams = new IndexOrganizatoinEmployeeParams('', 1, 1000, 0)
const rootCauseParams = new IndexRootCausesParams('', 1, 1000, 0)
const auditStandardParams = new IndexAuditStandardParams('', 1, 1000, 0)

const ncrs = ref<InternalAuditNcrModel[]>([])
const showForm = ref(false)
const auditSerialName = ref('')
const auditAuditee = ref<TitleInterface | null>(null)
const auditDetailsStatus = ref<string | number>('')
const auditDetailsStartDate = ref('')
const areaOptions = ref<TitleInterface[]>([])
const category = ref<NcrCategoryEnum>(NcrCategoryEnum.MINOR_NC)
const areaUnderReviews = ref<TitleInterface[]>([])
const auditStandard = ref<TitleInterface | null>(null)
const requirementReference = ref('')
const description = ref('')
const immediateAction = ref('')
const rootCauses = ref<TitleInterface[]>([])
const attachments = ref<string[]>([])
const capas = ref<CapaForm[]>([createCapa()])
const feedback = ref('')
const hasError = ref(false)
const isLoading = computed(() => fetchController.isDataLoading())
const isSaving = computed(() => createController.isDataLoading())
const currentAuditId = computed(() => {
  const value = Number(
    props.internalAuditPlanId ||
      route.query.internal_audit_plan_id ||
      route.query.internal_audit_id ||
      route.query.id ||
      route.params.id,
  )
  return Number.isFinite(value) && value > 0 ? value : 0
})
const canCreateNcr = computed(() => {
  const status = String(auditDetailsStatus.value || props.auditStatus).toLowerCase()
  const isPlanned =
    status === 'planned' || Number(status) === Number(InrernalAuditStatusEnum.planned)
  const auditStartDate = auditDetailsStartDate.value || props.auditStartDate
  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  return (
    currentAuditId.value > 0 &&
    isPlanned &&
    (!auditStartDate || auditStartDate.slice(0, 10) <= today)
  )
})

function emptyAction(): ActionForm {
  return { correction: '', assignedTo: null, targetDate: '', actualDate: '' }
}

function createCapa(): CapaForm {
  return {
    corrective: emptyAction(),
    preventive: emptyAction(),
  }
}

function normalizeSingle(value: TitleInterface | TitleInterface[] | null): TitleInterface | null {
  return Array.isArray(value) ? (value[0] ?? null) : value
}

function normalizeMultiple(value: TitleInterface | TitleInterface[] | null): TitleInterface[] {
  return Array.isArray(value) ? value : value ? [value] : []
}

function setCorrectiveAssignee(index: number, value: TitleInterface | TitleInterface[] | null) {
  capas.value[index]!.corrective.assignedTo = normalizeSingle(value)
}

function setPreventiveAssignee(index: number, value: TitleInterface | TitleInterface[] | null) {
  capas.value[index]!.preventive.assignedTo = normalizeSingle(value)
}

function setRootCauses(value: TitleInterface | TitleInterface[] | null) {
  rootCauses.value = normalizeMultiple(value)
}

function setAttachments(files: UploadedFile[]) {
  attachments.value = files.map((file) => file.base64).filter(Boolean)
}

async function fetchNcrs() {
  feedback.value = ''
  hasError.value = false
  await fetchController.getData(indexParams)

  if (fetchController.isDataSuccess()) {
    ncrs.value = fetchController.state.value.data ?? []
    return
  }

  ncrs.value = []
  hasError.value = true
  feedback.value = fetchController.state.value.error?.title ?? 'Unable to load NCRs.'
}

async function fetchAuditDetails() {
  if (!currentAuditId.value) return

  await showPlanController.getData(new ShowInternalAuditPlanParams(currentAuditId.value))
  if (!showPlanController.isDataSuccess() || !showPlanController.state.value.data) {
    hasError.value = true
    feedback.value =
      showPlanController.state.value.error?.title ?? 'Unable to load internal audit details.'
    return
  }

  const plan = showPlanController.state.value.data
  auditSerialName.value = plan.serial_name || plan.title
  auditAuditee.value = plan.auditee
  auditDetailsStatus.value = plan.status
  auditDetailsStartDate.value = plan.auditStartDate
  const departments = plan.auditScope
    .map((entry) => {
      const item = (entry ?? {}) as Record<string, unknown>
      return titleFrom(item.department ?? item.depertment)
    })
    .filter((department): department is TitleInterface => Boolean(department))
  areaOptions.value = departments.filter(
    (department, index, all) =>
      all.findIndex((item) => Number(item.id) === Number(department.id)) === index,
  )
}

function titleFrom(value: unknown): TitleInterface | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const item = value as Record<string, unknown>
  return new TitleInterface({
    id: Number(item.id ?? 0),
    title: String(item.title ?? item.name ?? ''),
  })
}

function validate(): boolean {
  const today = new Date().toISOString().slice(0, 10)
  if (!areaUnderReviews.value.length || !auditStandard.value) {
    feedback.value = 'Area under review and audit standard are required.'
  } else if (!requirementReference.value.trim() || !description.value.trim()) {
    feedback.value = 'Requirement reference and description are required.'
  } else if (!immediateAction.value.trim()) {
    feedback.value = 'Correction / immediate action is required.'
  } else if (!rootCauses.value.length) {
    feedback.value = 'Select at least one root cause.'
  } else if (!capas.value.length) {
    feedback.value = 'Add at least one CAPA.'
  } else if (
    capas.value.some(
      (capa) =>
        !capa.corrective.correction.trim() ||
        !capa.corrective.assignedTo ||
        !capa.corrective.targetDate ||
        !capa.preventive.correction.trim() ||
        !capa.preventive.assignedTo ||
        !capa.preventive.targetDate,
    )
  ) {
    feedback.value =
      'Complete corrective and preventive actions, assigned employees, and target dates.'
  } else if (
    capas.value.some(
      (capa) =>
        (capa.corrective.actualDate && capa.corrective.actualDate > today) ||
        (capa.preventive.actualDate && capa.preventive.actualDate > today),
    )
  ) {
    feedback.value = 'Actual dates cannot be later than today.'
  } else {
    feedback.value = ''
    return true
  }
  hasError.value = true
  return false
}

function buildParams(): CreateNcrsParams {
  return new CreateNcrsParams(
    category.value,
    areaUnderReviews.value.map((area) => new NcrAreaUnderReviewParams(Number(area.id))),
    Number(auditStandard.value?.id),
    requirementReference.value,
    description.value,
    immediateAction.value,
    rootCauses.value.map((rootCause) => new NcrRootCauseParams(Number(rootCause.id))),
    capas.value.map(
      (capa) =>
        new NcrInternalAuditTaskParams(
          new NcrCorrectiveActionParams(
            capa.corrective.correction,
            Number(capa.corrective.assignedTo?.id ?? 0),
            capa.corrective.targetDate,
            capa.corrective.actualDate,
          ),
          new NcrPreventiveActionParams(
            capa.preventive.correction,
            Number(capa.preventive.assignedTo?.id ?? 0),
            capa.preventive.targetDate,
            capa.preventive.actualDate,
          ),
        ),
    ),
    attachments.value,
    currentAuditId.value,
    false,
  )
}

function resetForm() {
  category.value = NcrCategoryEnum.MINOR_NC
  areaUnderReviews.value = []
  auditStandard.value = null
  requirementReference.value = ''
  description.value = ''
  immediateAction.value = ''
  rootCauses.value = []
  attachments.value = []
  capas.value = [createCapa()]
}

async function submit() {
  hasError.value = false
  if (!validate()) return
  await createController.create(buildParams())

  if (createController.isDataSuccess()) {
    resetForm()
    showForm.value = false
    await fetchNcrs()
    if (!hasError.value) feedback.value = 'NCR created successfully.'
    return
  }

  hasError.value = true
  feedback.value = createController.state.value.error?.title ?? 'Unable to create NCR.'
}

function statusLabel(status: unknown): string {
  const value = String(status ?? '')
  const numericLabels: Record<string, string> = {
    '0': 'Pending',
    '1': 'Open',
    '2': 'In progress',
    '3': 'Closed',
  }
  return (numericLabels[value] ?? value.split('_').join(' ')) || 'Unknown'
}

function categoryLabel(categoryValue: unknown): string {
  const value = String(categoryValue ?? '').toLowerCase()
  if (value === '1' || value === 'minor' || value === 'minor_nc') return 'Minor NC'
  if (value === '2' || value === 'major' || value === 'major_nc') return 'Major NC'
  return value.split('_').join(' ') || '—'
}

function createdAtLabel(value: string): string {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
}

watch(currentAuditId, () => void fetchAuditDetails())
onMounted(() => void Promise.all([fetchNcrs(), fetchAuditDetails()]))
</script>

<template>
  <section class="ncr-tab">
    <header class="ncr-header">
      <h2>Non-conformance reports</h2>
      <div class="header-actions">
        <button
          v-if="canCreateNcr"
          class="primary-button"
          type="button"
          @click="showForm = !showForm"
        >
          {{ showForm ? 'Close form' : 'New NCR' }}
        </button>
      </div>
    </header>

    <!-- <p
      v-if="feedback"
      class="message"
      :class="{ error: hasError, success: !hasError }"
      role="status"
    >
      {{ feedback }}
    </p>
    <p v-if="!canCreateNcr" class="stage-note">
      NCR entry is available after the plan is published and the audit start date is reached.
    </p> -->

    <form v-if="showForm" class="ncr-form" @submit.prevent="submit">
      <section class="form-section">
        <div class="section-heading">
          <span>01</span>
          <div>
            <h3>NCR details</h3>
            <p>Record the finding and applicable requirement.</p>
          </div>
        </div>
        <div class="form-grid">
          <label class="field"
            ><span>Internal Audit</span
            ><input :value="auditSerialName" type="text" disabled placeholder="Audit serial name"
          /></label>
          <label class="field"
            ><span>Category <b>*</b></span
            ><select v-model="category">
              <option :value="NcrCategoryEnum.MINOR_NC">Minor NC</option>
              <option :value="NcrCategoryEnum.MAJOR_NC">Major NC</option>
            </select></label
          >
          <UpdatedCustomInputSelect
            class="field"
            :model-value="areaUnderReviews"
            :static-options="areaOptions"
            type="multiselect"
            label="Area under review"
            placeholder="Select departments"
            required
            @update:model-value="areaUnderReviews = normalizeMultiple($event)"
          />
          <UpdatedCustomInputSelect
            class="field"
            :model-value="auditStandard"
            :controller="auditStandardController"
            :params="auditStandardParams"
            label="Audit standard"
            placeholder="Select audit standard"
            required
            @update:model-value="auditStandard = normalizeSingle($event)"
          />
          <label class="field field-wide"
            ><span>Requirement reference <b>*</b></span
            ><input
              v-model="requirementReference"
              type="text"
              placeholder="Enter requirement reference"
          /></label>
          <label class="field field-wide"
            ><span>Description <b>*</b></span
            ><textarea
              v-model="description"
              rows="4"
              placeholder="Describe the non-conformance"
            ></textarea>
          </label>
          <label class="field field-wide"
            ><span>Correction / Immediate action <b>*</b></span
            ><textarea
              v-model="immediateAction"
              rows="3"
              placeholder="Describe the immediate action taken"
            ></textarea>
          </label>
          <UpdatedCustomInputSelect
            class="field field-wide"
            :model-value="rootCauses"
            :controller="rootCauseController"
            :params="rootCauseParams"
            type="multiselect"
            label="Root causes"
            placeholder="Select root causes"
            required
            @update:model-value="setRootCauses"
          />
        </div>
      </section>

      <section class="form-section">
        <div class="section-heading">
          <span>02</span>
          <div>
            <h3>Add corrective and preventive actions.</h3>
            <!-- <p>Add corrective and preventive actions.</p> -->
          </div>
        </div>
        <article v-for="(capa, index) in capas" :key="index" class="capa-card">
          <header>
            <strong> {{ index + 1 }}</strong
            ><button
              v-if="capas.length > 1"
              type="button"
              class="remove-button"
              @click="capas.splice(index, 1)"
            >
              Remove
            </button>
          </header>
          <div class="action-block">
            <h4>Corrective action</h4>
            <div class="form-grid">
              <label class="field field-wide"
                ><span>Corrective action <b>*</b></span
                ><textarea
                  v-model="capa.corrective.correction"
                  rows="3"
                  placeholder="Describe the corrective action"
                ></textarea>
              </label>
              <UpdatedCustomInputSelect
                class="field"
                :model-value="capa.corrective.assignedTo"
                :controller="employeeController"
                :params="employeeParams"
                label="Assigned to"
                placeholder="Select employee"
                required
                @update:model-value="setCorrectiveAssignee(index, $event)"
              />
              <label class="field"
                ><span>Target date <b>*</b></span
                ><input v-model="capa.corrective.targetDate" type="date"
              /></label>
              <label class="field"
                ><span>Actual date</span
                ><input
                  v-model="capa.corrective.actualDate"
                  type="date"
                  :max="new Date().toISOString().slice(0, 10)"
              /></label>
            </div>
          </div>
          <div class="action-block preventive">
            <h4>Preventive action</h4>
            <div class="form-grid">
              <label class="field field-wide"
                ><span>Preventive action <b>*</b></span
                ><textarea
                  v-model="capa.preventive.correction"
                  rows="3"
                  placeholder="Describe the preventive action"
                ></textarea>
              </label>
              <UpdatedCustomInputSelect
                class="field"
                :model-value="capa.preventive.assignedTo"
                :controller="employeeController"
                :params="employeeParams"
                label="Assigned to"
                placeholder="Select employee"
                required
                @update:model-value="setPreventiveAssignee(index, $event)"
              />
              <label class="field"
                ><span>Target date <b>*</b></span
                ><input v-model="capa.preventive.targetDate" type="date"
              /></label>
              <label class="field"
                ><span>Actual date</span
                ><input
                  v-model="capa.preventive.actualDate"
                  type="date"
                  :max="new Date().toISOString().slice(0, 10)"
              /></label>
            </div>
          </div>
        </article>
        <!-- <button class="add-capa" type="button" @click="capas.push(createCapa())">
          ＋ Add CAPA
        </button> -->
      </section>

      <section class="form-section">
        <div class="section-heading">
          <span>03</span>
          <div>
            <h3>Attachments</h3>
            <p>Add supporting evidence files.</p>
          </div>
        </div>
        <HandleFIlesUpload
          label="NCR attachments"
          accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
          :multiple="true"
          :max-files="10"
          @change="setAttachments"
        />
      </section>

      <footer class="form-actions">
        <button
          class="secondary-button"
          type="button"
          :disabled="isSaving"
          @click="showForm = false"
        >
          Cancel
        </button>
        <button class="primary-button" type="submit" :disabled="isSaving">
          {{ isSaving ? 'Creating…' : 'Create NCR' }}
        </button>
      </footer>
    </form>

    <div v-if="isLoading" class="ncr-loading" aria-label="Loading NCRs">
      <span v-for="index in 4" :key="index"></span>
    </div>
    <div v-else-if="ncrs.length" class="ncr-index">
      <div class="ncr-table-wrap">
        <table class="ncr-table">
          <thead>
            <tr>
              <th>NCR</th>
              <th>Area</th>
              <th>Created by</th>
              <th>Created at</th>
              <th>Auditee</th>
              <th>Due</th>
              <th>Status</th>
              <th>Lead Review</th>
              <th><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in ncrs" :key="item.id || item.ncr">
              <td>
                <div class="ncr-identity">
                  <strong>{{ item.ncr || `NCR-${item.id}` }}</strong
                  ><span
                    class="category"
                    :class="{ major: categoryLabel(item.ncrsCategory) === 'Major NC' }"
                    >{{ categoryLabel(item.ncrsCategory) }}</span
                  >
                </div>
              </td>
              <td>{{ item.area || '—' }}</td>
              <td>{{ item.createdBy.name || '—' }}</td>
              <td>{{ createdAtLabel(item.createdAt) }}</td>
              <td>{{ auditAuditee?.title || auditAuditee?.name || item.auditee.name || '—' }}</td>
              <td>{{ item.dueDate || '—' }}</td>
              <td>
                <span class="status">{{ statusLabel(item.status) }}</span>
              </td>
              <td>{{ item.leadReviewStatus || item.leadReview.name || 'Pending' }}</td>
              <td class="row-action">
                <button type="button" class="open-button" @click="emit('open', item)">Open</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else-if="!hasError" class="empty-tab">
      <span class="tab-icon">!</span>
      <h3>No NCRs found</h3>
      <p>NCR findings, owners, and corrective actions will appear here.</p>
    </div>
  </section>
</template>

<style scoped>
:deep(.upload-area) {
  border: 1px solid lightgray !important;
}
label:has(textarea) {
  grid-column: span 3 !important;
}
.ncr-tab {
  display: grid;
  gap: 18px;
}
.ncr-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 22px;
  border: 1px solid var(--main-border, #d9e1df);
  border-radius: 18px;
  background: var(--card-bg, #fff);
}
.eyebrow {
  color: var(--PrimaryColor, #087d80);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.ncr-header h2 {
  margin: 4px 0;
  color: var(--text-primary, #172334);
  font-size: 1.2rem;
}
.ncr-header p,
.section-heading p {
  margin: 0;
  color: var(--text-soft, #687777);
  font-size: 0.86rem;
}
.header-actions,
.form-actions {
  display: flex;
  gap: 10px;
}
.primary-button,
.secondary-button,
.add-capa,
.remove-button {
  border-radius: 9px;
  padding: 10px 15px;
  font-weight: 650;
}
.primary-button {
  border: 1px solid var(--PrimaryColor, #087d80);
  background: var(--PrimaryColor, #087d80);
  color: #fff;
}
.secondary-button,
.add-capa {
  border: 1px solid var(--PrimaryColor, #087d80);
  background: transparent;
  color: var(--PrimaryColor, #087d80);
}
button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
.message {
  margin: 0;
  border-radius: 10px;
  padding: 12px 16px;
}
.message.error {
  background: #fff0f0;
  color: #b42318;
}
.message.success {
  background: #e9f8f1;
  color: #16734b;
}
.ncr-form {
  display: grid;
  gap: 18px;
}
.form-section {
  padding: 22px;
  border: 1px solid var(--main-border, #d9e1df);
  border-radius: 18px;
  background: var(--card-bg, #fff);
}
.section-heading {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
}
.section-heading > span {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 10px;
  background: color-mix(in srgb, var(--PrimaryColor, #087d80) 12%, transparent);
  color: var(--PrimaryColor, #087d80);
  font-weight: 700;
}
.section-heading h3 {
  margin: 0 0 4px;
  color: var(--text-primary, #172334);
  font-size: 1rem;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
.field {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 7px;
}
.field-wide {
  grid-column: span 2;
}
.field > span {
  font-size: 0.82rem;
  font-weight: 650;
}
.field b {
  color: #b42318;
}
.field input,
.field select,
.field textarea {
  width: 100%;
  border: 1px solid var(--main-border, #cbd8d6);
  border-radius: 10px;
  background: transparent;
  padding: 10px 12px;
  color: var(--text-primary, #172334);
  outline: none;
}
.field input:focus,
.field select:focus,
.field textarea:focus {
  border-color: var(--PrimaryColor, #087d80);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--PrimaryColor, #087d80) 10%, transparent);
}
.capa-card {
  overflow: hidden;
  margin-bottom: 16px;
  border: 1px solid var(--main-border, #d9e1df);
  border-radius: 14px;
}
.capa-card > header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: color-mix(in srgb, var(--PrimaryColor, #087d80) 7%, transparent);
}
.remove-button {
  border: 0;
  background: transparent;
  color: #b42318;
}
.action-block {
  padding: 18px;
}
.action-block.preventive {
  border-top: 1px solid var(--main-border, #d9e1df);
  background: color-mix(in srgb, var(--PrimaryColor, #087d80) 2%, transparent);
}
.action-block h4 {
  margin: 0 0 14px;
}
.form-actions {
  justify-content: flex-end;
}
.ncr-loading {
  display: grid;
  gap: 10px;
}
.ncr-loading span {
  height: 120px;
  border-radius: 12px;
  background: linear-gradient(90deg, #eef2f1 25%, #f8faf9 50%, #eef2f1 75%);
  background-size: 200% 100%;
  animation: pulse 1.3s infinite;
}
.empty-tab {
  display: grid;
  min-height: 260px;
  place-items: center;
  align-content: center;
  gap: 8px;
  border: 1px dashed var(--main-border, #cbd8d6);
  border-radius: 18px;
  background: var(--card-bg, #fff);
  text-align: center;
}
.tab-icon {
  display: grid;
  width: 52px;
  height: 52px;
  place-items: center;
  border-radius: 50%;
  background: color-mix(in srgb, var(--PrimaryColor, #087d80) 12%, transparent);
  color: var(--PrimaryColor, #087d80);
  font-size: 1.4rem;
}
.empty-tab h3,
.empty-tab p {
  margin: 0;
}
.empty-tab p {
  color: var(--text-soft, #687777);
}
@keyframes pulse {
  to {
    background-position: -200% 0;
  }
}
@media (max-width: 900px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }
  .field-wide {
    grid-column: span 2;
  }
}
@media (max-width: 600px) {
  .ncr-header {
    align-items: flex-start;
    flex-direction: column;
  }
  .header-actions {
    width: 100%;
  }
  .header-actions button {
    flex: 1;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
  .field-wide {
    grid-column: span 1;
  }
  .form-section {
    padding: 16px;
  }
}
.ncr-header {
  padding: 8px 0 16px;
  border: 0;
  border-bottom: 1px solid var(--main-border, #d9e1df);
  border-radius: 0;
  background: transparent;
}
.ncr-header h2 {
  margin: 0;
  font-size: 1.05rem;
}
.stage-note {
  margin: 0;
  border-inline-start: 4px solid #c6841b;
  background: #fff6e5;
  padding: 12px 16px;
  color: #76501b;
}
.ncr-index {
  display: grid;
  gap: 16px;
}
.ncr-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--main-border, #cbd8d6);
  background: var(--card-bg, #fff);
}
.ncr-table {
  width: 100%;
  border-collapse: collapse;
}
.ncr-table th,
.ncr-table td {
  padding: 13px 12px;
  border-bottom: 1px solid var(--main-border, #cbd8d6);
  text-align: start;
  white-space: nowrap;
}
.ncr-table th {
  background: color-mix(in srgb, var(--PrimaryColor, #087d80) 8%, #fff);
  color: var(--text-primary, #172334);
  font-size: 0.73rem;
}
.ncr-table td {
  font-size: 0.82rem;
}
.ncr-table tbody tr:last-child td {
  border-bottom: 0;
}
.ncr-identity {
  display: flex;
  align-items: center;
  gap: 7px;
}
.category,
.status {
  display: inline-flex;
  border-radius: 4px;
  background: #e8eef7;
  padding: 4px 8px;
  color: #294b75;
  font-size: 0.69rem;
  font-weight: 700;
}
.category.major {
  background: #fff0e8;
  color: #a14519;
}
.row-action {
  text-align: end !important;
}
.open-button {
  border: 1px solid color-mix(in srgb, var(--PrimaryColor, #087d80) 45%, #cbd8d6);
  border-radius: 6px;
  background: #fff;
  padding: 8px 12px;
  color: var(--text-primary, #172334);
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}
</style>
