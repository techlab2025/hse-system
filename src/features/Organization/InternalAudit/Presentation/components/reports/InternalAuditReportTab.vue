<script setup lang="ts">
import { canOrganizationOperation } from '@/features/permission/Presentation/Helpers/organization_authorization'

import {
  computed,
  nextTick,
  onMounted,
  onBeforeUnmount,
  onActivated,
  onDeactivated,
  ref,
  watch,
} from 'vue'
import { useRoute } from 'vue-router'
import { usePdfExport } from '@/composables/usePdfExport'
import { DataEmpty } from '@/base/core/networkStructure/Resources/dataState/data_state'
import InternalAuditReportForms from './InternalAuditReportForms.vue'
import InternalAuditReportDocument from './InternalAuditReportDocument.vue'
import ShowInternalAuditPlanUseCase from '../../../Domain/useCase/plan/showInternalAuditPlanUseCase'
import FetchInternalAuditAttendanceUseCase from '../../../Domain/useCase/attendance/fetchInternalAuditAttendanceUseCase'
import ShowInternalAuditPlanParams from '../../../Core/params/plan/showInternalAuditPlanParams'
import FetchInternalAuditAttendanceParams from '../../../Core/params/attendance/fetchInternalAuditAttendanceParams'
import type InternalAuditPlanModel from '../../../Data/models/plan/InternalAuditPlanModel'
import type InternalAuditAttendanceModel from '../../../Data/models/attendance/InternalAuditAttendanceModel'
import { DataSuccess } from '@/base/core/networkStructure/Resources/dataState/data_state'
import HandleFIlesUpload, {
  type UploadedFile,
} from '@/features/Organization/OrganizationEmployee/Presentation/supcomponents/HandleFIlesUpload.vue'
import CreateInternalAuditReportParams from '../../../Core/params/reports/createInternalAuditReportParams'
import FetchInternalAuditPlanDetailsParams from '../../../Core/params/reports/fetchInternalAuditPlanDetailsParams'
import FetchInternalAuditReportParams from '../../../Core/params/reports/fetchInternalAuditReportParams'
import IndexNcrsParams from '../../../Core/params/ncrs/indexNcrsParams'
import type InternalAuditPlanReportDetailsModel from '../../../Data/models/reports/InternalAuditPlanReportDetailsModel'
import type InternalAuditNcrModel from '../../../Data/models/ncrs/InternalAuditNcrModel'
import CreateInternalAuditReportController from '../../controllers/reports/createInternalAuditReportController'
import FetchInternalAuditPlanDetailsController from '../../controllers/reports/fetchInternalAuditPlanDetailsController'
import FetchInternalAuditReportController from '../../controllers/reports/fetchInternalAuditReportController'
import FetchNcrsController from '../../controllers/ncrs/fetchNcrsController'

const props = withDefaults(
  defineProps<{
    internalAuditPlanId?: number
    auditStatus?: string
    auditStartDate?: string
  }>(),
  { internalAuditPlanId: 0, auditStatus: '', auditStartDate: '' },
)

const emit = defineEmits<{ saved: [] }>()
const { exportPdf, isExporting, exportError } = usePdfExport()
const ncrError = ref('')
const issued = ref(false)
let loadVersion = 0
let active = false
const route = useRoute()
const fetchController = FetchInternalAuditPlanDetailsController.getInstance()
const reportController = FetchInternalAuditReportController.getInstance()
const createController = CreateInternalAuditReportController.getInstance()
const ncrController = FetchNcrsController.getInstance()
const details = ref<InternalAuditPlanReportDetailsModel | null>(null)
const ncrs = ref<InternalAuditNcrModel[]>([])
const scope = ref('')
const methodology = ref('')
const maintenance = ref('')
const generalObservations = ref('')
const conclusion = ref('')
const reportAttachments = ref<string[]>([])
const feedback = ref('')
const hasError = ref(false)
const previewMode = ref(false)
const reportPlan = ref<InternalAuditPlanModel | null>(null)
const reportAttendance = ref<InternalAuditAttendanceModel[]>([])
const documentLoading = ref(false)
const documentError = ref('')
const isLoading = computed(
  () =>
    documentLoading.value ||
    fetchController.isDataLoading() ||
    reportController.isDataLoading() ||
    ncrController.isDataLoading(),
)
const isReported = computed(
  () => issued.value || ['reported', '3'].includes(props.auditStatus.toLowerCase()),
)
const isSaving = computed(() => createController.isDataLoading())
const canIssueReport = computed(() => {
  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  return (
    internalAuditPlanId.value > 0 &&
    props.auditStatus.toLowerCase() === 'planned' &&
    (!props.auditStartDate || props.auditStartDate.slice(0, 10) <= today)
  )
})

function routeNumber(value: unknown): number {
  const rawValue = Array.isArray(value) ? value[0] : value
  const parsed = Number(rawValue)
  return Number.isFinite(parsed) ? parsed : 0
}

const internalAuditPlanId = computed(
  () =>
    props.internalAuditPlanId ||
    routeNumber(
      route.params.internal_audit_plan_id ??
        route.params.id ??
        route.query.internal_audit_plan_id ??
        route.query.internal_audit_id ??
        route.query.id,
    ),
)

function setAttachments(files: UploadedFile[]) {
  reportAttachments.value = files.map((file) => file.base64).filter(Boolean)
}

const draftKey = computed(() => `internal-audit-report-draft:${internalAuditPlanId.value}`)

function restoreDraft() {
  if (!internalAuditPlanId.value) return
  try {
    const saved = JSON.parse(localStorage.getItem(draftKey.value) ?? '{}') as Record<
      string,
      unknown
    >
    scope.value = String(saved.scope ?? scope.value)
    methodology.value = String(saved.methodology ?? methodology.value)
    maintenance.value = String(saved.maintenance ?? maintenance.value)
    generalObservations.value = String(saved.generalObservations ?? generalObservations.value)
    conclusion.value = String(saved.conclusion ?? conclusion.value)
    reportAttachments.value = Array.isArray(saved.reportAttachments)
      ? saved.reportAttachments.map(String)
      : []
  } catch {
    localStorage.removeItem(draftKey.value)
  }
}

function saveDraft() {
  if (isReported.value) return
  if (!internalAuditPlanId.value) {
    hasError.value = true
    feedback.value = 'Select an audit before saving the report draft.'
    return
  }
  localStorage.setItem(
    draftKey.value,
    JSON.stringify({
      scope: scope.value,
      methodology: methodology.value,
      maintenance: maintenance.value,
      generalObservations: generalObservations.value,
      conclusion: conclusion.value,
      reportAttachments: reportAttachments.value,
    }),
  )
  hasError.value = false
  feedback.value = 'Report draft saved on this device.'
}

async function fetchDetails() {
  const version = ++loadVersion
  const auditId = internalAuditPlanId.value
  ncrs.value = []
  ncrError.value = ''
  feedback.value = ''
  hasError.value = false
  details.value = null
  scope.value = ''
  methodology.value = ''
  maintenance.value = ''
  generalObservations.value = ''
  conclusion.value = ''
  reportAttachments.value = []
  previewMode.value = false
  documentLoading.value = false
  reportPlan.value = null
  reportAttendance.value = []
  documentError.value = ''

  if (!internalAuditPlanId.value) {
    details.value = null
    hasError.value = true
    feedback.value = 'Select an audit from the Audit Register to create its report.'
    return
  }

  await fetchController.fetch(new FetchInternalAuditPlanDetailsParams(auditId))

  if (version !== loadVersion) return
  if (fetchController.isDataSuccess()) {
    details.value = fetchController.state.value.data
    documentLoading.value = true
    try {
      const [planResult, attendanceResult] = await Promise.all([
        new ShowInternalAuditPlanUseCase().call(new ShowInternalAuditPlanParams(auditId)),
        new FetchInternalAuditAttendanceUseCase().call(new FetchInternalAuditAttendanceParams()),
      ])
      if (version !== loadVersion) return
      if (planResult instanceof DataSuccess) reportPlan.value = planResult.data
      else documentError.value = 'Unable to load the full audit plan.'
      if (attendanceResult instanceof DataSuccess || attendanceResult instanceof DataEmpty) {
        reportAttendance.value = attendanceResult.data ?? []
      } else documentError.value = 'Unable to load audit attendance.'
    } catch {
      if (version === loadVersion) documentError.value = 'Unable to load the full report data.'
    } finally {
      if (version === loadVersion) documentLoading.value = false
    }
    await reportController.fetch(new FetchInternalAuditReportParams(auditId))
    if (version !== loadVersion) return
    const report = reportController.isDataSuccess() ? reportController.state.value.data : null
    if (
      report &&
      [
        report.scope,
        report.methodology,
        report.maintenance,
        report.generalObservations,
        report.conclusion,
      ].some(Boolean)
    ) {
      issued.value = true
      scope.value = report.scope
      methodology.value = report.methodology
      maintenance.value = report.maintenance
      generalObservations.value = report.generalObservations
      conclusion.value = report.conclusion
      reportAttachments.value = report.attachments
    } else if (isReported.value) {
      hasError.value = true
      feedback.value = reportController.state.value.error?.title ?? 'Unable to load audit report.'
    }
    if (!isReported.value) restoreDraft()
    if (!methodology.value) {
      methodology.value =
        'Audit was conducted by selecting samples from the relevant processes, reviewing records, interviewing personnel, and observing activities.'
    }
    await ncrController.getData(new IndexNcrsParams('', 1, 1000, 0, auditId))
    if (version !== loadVersion) return
    ncrs.value = ncrController.isDataSuccess() ? (ncrController.state.value.data ?? []) : []
    if (!ncrController.isDataSuccess() && !(ncrController.state.value instanceof DataEmpty)) {
      ncrError.value = ncrController.state.value.error?.title ?? 'Unable to load NCRs.'
    }
    return
  }

  details.value = null
  hasError.value = true
  feedback.value = fetchController.state.value.error?.title ?? 'Unable to load audit details.'
}

function validate(): boolean {
  if (!internalAuditPlanId.value) feedback.value = 'An internal audit is required.'
  else if (!scope.value.trim()) feedback.value = 'Scope is required.'
  else if (!methodology.value.trim()) feedback.value = 'Methodology is required.'
  else if (!maintenance.value.trim()) feedback.value = 'Maintenance is required.'
  else if (!conclusion.value.trim()) feedback.value = 'Conclusion is required.'
  else {
    feedback.value = ''
    hasError.value = false
    return true
  }

  hasError.value = true
  return false
}

async function submit() {
  if (!canOrganizationOperation('create_internal_audit_report')) return

  if (isReported.value || isSaving.value || !canIssueReport.value || ncrError.value || !validate())
    return

  await createController.create(
    new CreateInternalAuditReportParams(
      internalAuditPlanId.value,
      scope.value,
      methodology.value,
      maintenance.value,
      generalObservations.value,
      conclusion.value,
      reportAttachments.value,
    ),
  )

  if (createController.isDataSuccess()) {
    localStorage.removeItem(draftKey.value)
    issued.value = true
    emit('saved')
    await fetchDetails()
    previewMode.value = true
    if (!hasError.value) feedback.value = 'Internal audit report issued successfully.'
    return
  }

  hasError.value = true
  feedback.value = createController.state.value.error?.title ?? 'Unable to create audit report.'
}

async function printReport() {
  if (isExporting.value || isLoading.value || documentError.value || ncrError.value) return
  const wasPreviewing = previewMode.value
  previewMode.value = true
  try {
    await nextTick()
    await exportPdf({
      targetSelector: '.audit-report-document',
      filename: `internal-audit-${details.value?.auditNumber || internalAuditPlanId.value}.pdf`,
      title: `Internal Audit Report${details.value?.auditNumber ? ` — ${details.value.auditNumber}` : ''}`,
      orientation: 'portrait',
    })
  } finally {
    previewMode.value = wasPreviewing
  }
}

watch(internalAuditPlanId, () => {
  issued.value = false
  if (active) void fetchDetails()
})
onBeforeUnmount(() => {
  ++loadVersion
})
onMounted(() => {
  active = true
  void fetchDetails()
})
onActivated(() => {
  if (!active) {
    active = true
    void fetchDetails()
  }
})
onDeactivated(() => {
  active = false
  ++loadVersion
})
</script>

<template>
  <section class="report-tab">
    <header class="report-header" data-pdf-exclude>
      <div>
        <span class="eyebrow">Final audit record</span>
        <h2>Audit Report</h2>
        <p>Audit plan, attendance, all NCRs, and report details.</p>
      </div>
      <div class="header-actions">
        <button
          class="secondary-button"
          type="button"
          :disabled="!details || isLoading || isExporting || !!documentError || !!ncrError"
          @click="previewMode = !previewMode"
        >
          {{ previewMode ? 'Back to form' : 'Preview' }}
        </button>
        <button
          class="secondary-button"
          type="button"
          :disabled="!details || isLoading || isExporting || !!documentError || !!ncrError"
          @click="printReport"
        >
          {{ isExporting ? 'Exporting…' : 'Export PDF' }}
        </button>
      </div>
    </header>
    <p
      v-if="feedback"
      data-pdf-exclude
      class="message"
      :class="{ error: hasError, success: !hasError }"
      role="status"
    >
      {{ feedback }}
    </p>
    <p v-if="exportError" class="message error" role="alert" data-pdf-exclude>{{ exportError }}</p>
    <div v-if="isLoading" class="report-loading" aria-label="Loading audit details">
      <span v-for="index in 4" :key="index"></span>
    </div>
    <template v-else-if="details">
      <InternalAuditReportForms
        v-show="!previewMode"
        :key="internalAuditPlanId"
        :audit-id="internalAuditPlanId"
        :audit-serial-name="details.auditNumber"
        :ncrs="ncrs"
        :ncr-error="ncrError"
      />
      <p v-if="documentError" class="message error" role="alert">{{ documentError }}</p>
      <InternalAuditReportDocument
        v-if="previewMode"
        :details="details"
        :plan="reportPlan"
        :attendance="reportAttendance"
        :ncrs="ncrs"
        :scope="scope"
        :methodology="methodology"
        :maintenance="maintenance"
        :general-observations="generalObservations"
        :conclusion="conclusion"
        :attachments="reportAttachments"
      />
      <form v-else class="report-form" @submit.prevent="submit">
        <section class="report-section">
          <div class="section-title">
            <h3>4. Report details</h3>
            <p>Audit findings and conclusion.</p>
          </div>
          <label class="field"
            ><span>Scope clarifications <b>*</b></span
            ><textarea v-model="scope" rows="4" :disabled="isReported || previewMode"></textarea>
          </label>
          <label class="field"
            ><span>Methodology <b>*</b></span
            ><textarea
              v-model="methodology"
              rows="4"
              :disabled="isReported || previewMode"
            ></textarea>
          </label>
          <label class="field"
            ><span>Maintenance <b>*</b></span
            ><textarea
              v-model="maintenance"
              rows="4"
              :disabled="isReported || previewMode"
            ></textarea>
          </label>
          <label class="field"
            ><span>General observations</span
            ><textarea
              v-model="generalObservations"
              rows="4"
              :disabled="isReported || previewMode"
            ></textarea>
          </label>
          <label class="field"
            ><span>Conclusion <b>*</b></span
            ><textarea
              v-model="conclusion"
              rows="4"
              :disabled="isReported || previewMode"
            ></textarea>
          </label>
          <HandleFIlesUpload
            v-if="!isReported && !previewMode"
            label="Report attachments (optional)"
            accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
            :multiple="true"
            :file="reportAttachments"
            :max-files="10"
            @change="setAttachments"
          />
        </section>
        <p v-if="!isReported && !canIssueReport" class="stage-note">
          The report can be issued after the plan is published and the audit start date is reached.
        </p>
        <footer v-if="!isReported && !previewMode" class="form-actions" data-pdf-exclude>
          <button class="secondary-button" type="button" :disabled="isSaving" @click="saveDraft">
            Save Draft</button
          ><button v-if="canOrganizationOperation('create_internal_audit_report')"
            class="primary-button"
            type="submit"
            :disabled="isSaving || !canIssueReport || !!ncrError"
          >
            {{ isSaving ? 'Issuing report…' : 'Issue Report' }}
          </button>
        </footer>
      </form>
    </template>
  </section>
</template>
<style scoped>
:deep(.upload-area) {
  border: 1px solid lightgray !important;
}
.report-tab {
  display: grid;
  gap: 18px;
}

.report-header {
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

.report-header h2 {
  margin: 4px 0;
  color: var(--text-primary, #172334);
  font-size: 1.2rem;
}

.report-header p,
.section-title p {
  margin: 0;
  color: var(--text-soft, #687777);
  font-size: 0.86rem;
}

.header-actions {
  display: flex;
  gap: 9px;
}

.secondary-button,
.primary-button {
  border-radius: 9px;
  padding: 10px 15px;
  font-weight: 650;
}

.secondary-button {
  border: 1px solid var(--PrimaryColor, #087d80);
  background: transparent;
  color: var(--PrimaryColor, #087d80);
}

.primary-button {
  border: 1px solid var(--PrimaryColor, #087d80);
  background: var(--PrimaryColor, #087d80);
  color: #fff;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.message,
.stage-note {
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

.stage-note {
  border-inline-start: 4px solid #c6841b;
  background: #fff6e5;
  color: #76501b;
}

.report-form {
  display: grid;
  gap: 18px;
}

.report-section {
  display: grid;
  gap: 18px;
  padding: 22px;
  border: 1px solid var(--main-border, #d9e1df);
  border-radius: 18px;
  background: var(--card-bg, #fff);
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.field {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 8px;
}

.field > span {
  color: var(--text-primary, #172334);
  font-size: 0.84rem;
  font-weight: 650;
}

.field b {
  color: #b42318;
}

.field small {
  color: var(--text-soft, #687777);
  font-weight: 500;
}

.field input,
.field textarea {
  width: 100%;
  border: 1px solid var(--main-border, #cbd8d6);
  border-radius: 10px;
  background: transparent;
  padding: 11px 13px;
  color: var(--text-primary, #172334);
  outline: none;
}

.field input[readonly],
.field textarea[readonly] {
  background: var(--surface-ground, #f4f7f6);
  color: var(--text-soft, #687777);
}

.field textarea:focus {
  border-color: var(--PrimaryColor, #087d80);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--PrimaryColor, #087d80) 10%, transparent);
}

.section-title {
  padding-bottom: 14px;
  border-bottom: 1px solid var(--main-border, #d9e1df);
}

.section-title h3 {
  margin: 0 0 4px;
  font-size: 1rem;
}

.audit-scope {
  display: grid;
  gap: 14px;
}

.audit-scope-list {
  display: grid;
  gap: 10px;
}

.audit-scope-list article {
  display: grid;
  grid-template-columns: minmax(160px, 0.35fr) 1fr;
  gap: 16px;
  padding: 12px 14px;
  border: 1px solid var(--main-border, #d9e1df);
  border-radius: 10px;
  background: var(--surface-ground, #f4f7f6);
}

.audit-scope-list span,
.audit-scope-list p {
  color: var(--text-soft, #687777);
}

.audit-scope-list p {
  margin: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.ncr-table-wrap,
.schedule-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--main-border, #cbd8d6);
}

.ncr-table-wrap table,
.schedule-table-wrap table {
  width: 100%;
  border-collapse: collapse;
}

.ncr-table-wrap th,
.ncr-table-wrap td,
.schedule-table-wrap th,
.schedule-table-wrap td {
  padding: 11px 12px;
  border-bottom: 1px solid var(--main-border, #d9e1df);
  text-align: start;
  white-space: nowrap;
}

.ncr-table-wrap th,
.schedule-table-wrap th {
  background: color-mix(in srgb, var(--PrimaryColor, #087d80) 7%, #fff);
  font-size: 0.75rem;
}

.ncr-table-wrap tbody tr:last-child td,
.schedule-table-wrap tbody tr:last-child td {
  border-bottom: 0;
}

.empty-row {
  text-align: center;
  color: var(--text-soft, #687777);
}

.full-ncrs {
  display: grid;
  gap: 18px;
}

.full-ncrs p {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  margin: 0;
  padding: 11px 0;
  border-bottom: 1px solid var(--main-border, #e5e9e8);
}

.full-ncrs span {
  color: var(--text-soft, #687777);
}

.report-preview {
  padding: 30px;
  border: 1px solid var(--main-border, #d9e1df);
  border-radius: 18px;
  background: var(--card-bg, #fff);
}

.report-preview > header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--PrimaryColor, #087d80);
}

.report-preview small {
  color: var(--PrimaryColor, #087d80);
  font-weight: 700;
  text-transform: uppercase;
}

.report-preview h2 {
  margin: 5px 0 0;
}

.report-preview dl {
  display: grid;
  gap: 0;
  margin: 20px 0 0;
}

.report-preview dl > div {
  display: grid;
  grid-template-columns: 190px 1fr;
  gap: 20px;
  padding: 14px 0;
  border-bottom: 1px solid var(--main-border, #e5e9e8);
}

.report-preview dt {
  font-weight: 700;
}

.report-preview dd {
  margin: 0;
  white-space: pre-wrap;
}

.preview-ncrs,
.preview-audit-scope,
.preview-schedule {
  margin-top: 24px;
}

.preview-ncrs p {
  padding: 8px 0;
  border-bottom: 1px solid var(--main-border, #e5e9e8);
}

.report-loading {
  display: grid;
  gap: 10px;
}

.report-loading span {
  height: 86px;
  border-radius: 12px;
  background: linear-gradient(90deg, #eef2f1 25%, #f8faf9 50%, #eef2f1 75%);
  background-size: 200% 100%;
  animation: pulse 1.3s infinite;
}

@keyframes pulse {
  to {
    background-position: -200% 0;
  }
}

@media (max-width: 800px) {
  .details-grid {
    grid-template-columns: 1fr;
  }

  .report-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions button {
    flex: 1;
  }

  .report-preview dl > div {
    grid-template-columns: 1fr;
    gap: 5px;
  }

  .audit-scope-list article {
    grid-template-columns: 1fr;
    gap: 5px;
  }

  .full-ncrs p {
    flex-direction: column;
  }
}

@media print {
  .report-header,
  .message,
  .form-actions {
    display: none;
  }

  .report-preview {
    border: 0;
    padding: 0;
  }
}
</style>
