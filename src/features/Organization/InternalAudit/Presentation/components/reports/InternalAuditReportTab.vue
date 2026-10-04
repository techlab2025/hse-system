<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import HandleFIlesUpload, {
  type UploadedFile,
} from '@/features/Organization/OrganizationEmployee/Presentation/supcomponents/HandleFIlesUpload.vue'
import CreateInternalAuditReportParams from '../../../Core/params/reports/createInternalAuditReportParams'
import FetchInternalAuditPlanDetailsParams from '../../../Core/params/reports/fetchInternalAuditPlanDetailsParams'
import type InternalAuditPlanReportDetailsModel from '../../../Data/models/reports/InternalAuditPlanReportDetailsModel'
import CreateInternalAuditReportController from '../../controllers/reports/createInternalAuditReportController'
import FetchInternalAuditPlanDetailsController from '../../controllers/reports/fetchInternalAuditPlanDetailsController'

const route = useRoute()
const fetchController = FetchInternalAuditPlanDetailsController.getInstance()
const createController = CreateInternalAuditReportController.getInstance()
const details = ref<InternalAuditPlanReportDetailsModel | null>(null)
const scope = ref('')
const methodology = ref('')
const maintenance = ref('')
const generalObservations = ref('')
const conclusion = ref('')
const reportAttachments = ref<string[]>([])
const feedback = ref('')
const hasError = ref(false)
const previewMode = ref(false)
const isLoading = computed(() => fetchController.isDataLoading())
const isSaving = computed(() => createController.isDataLoading())

function routeNumber(value: unknown): number {
  const rawValue = Array.isArray(value) ? value[0] : value
  const parsed = Number(rawValue)
  return Number.isFinite(parsed) ? parsed : 0
}

const internalAuditPlanId = computed(() =>
  routeNumber(
    route.params.internal_audit_plan_id ??
      route.params.id ??
      route.query.internal_audit_plan_id ??
      route.query.internal_audit_id ??
      route.query.id,
  ),
)

const auditorNames = computed(() =>
  details.value?.internalAuditors.map((auditor) => auditor.name).filter(Boolean).join(', ') ?? '',
)

const auditDates = computed(() => {
  if (!details.value) return ''
  return [details.value.auditStartDate, details.value.auditEndDate].filter(Boolean).join(' / ')
})

function setAttachments(files: UploadedFile[]) {
  reportAttachments.value = files.map((file) => file.base64).filter(Boolean)
}

async function fetchDetails() {
  feedback.value = ''
  hasError.value = false

  if (!internalAuditPlanId.value) {
    details.value = null
    hasError.value = true
    feedback.value = 'Select an audit from the Audit Register to create its report.'
    return
  }

  await fetchController.fetch(
    new FetchInternalAuditPlanDetailsParams(internalAuditPlanId.value),
  )

  if (fetchController.isDataSuccess()) {
    details.value = fetchController.state.value.data
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
  if (!validate()) return

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
    hasError.value = false
    feedback.value = 'Internal audit report created successfully.'
    return
  }

  hasError.value = true
  feedback.value = createController.state.value.error?.title ?? 'Unable to create audit report.'
}

function printReport() {
  window.print()
}

watch(internalAuditPlanId, fetchDetails)
onMounted(fetchDetails)
</script>

<template>
  <section class="report-tab">
    <header class="report-header">
      <div>
        <span class="eyebrow">Final audit record</span>
        <h2>Audit Report</h2>
        <p>Document the audit outcome, observations, and conclusion.</p>
      </div>
      <div class="header-actions">
        <button class="secondary-button" type="button" :disabled="!details" @click="previewMode = !previewMode">
          {{ previewMode ? 'Edit report' : 'Preview' }}
        </button>
        <button class="secondary-button" type="button" :disabled="!details" @click="printReport">Print / PDF</button>
      </div>
    </header>

    <p v-if="feedback" class="message" :class="{ error: hasError, success: !hasError }" role="status">{{ feedback }}</p>

    <div v-if="isLoading" class="report-loading" aria-label="Loading audit details"><span v-for="index in 4" :key="index"></span></div>

    <template v-else-if="details">
      <section v-if="previewMode" class="report-preview">
        <header><div><small>Internal audit report</small><h2>{{ details.auditNumber || `Audit ${details.id}` }}</h2></div><span>{{ auditDates }}</span></header>
        <dl><div><dt>Internal auditors</dt><dd>{{ auditorNames || '—' }}</dd></div><div><dt>Purpose</dt><dd>{{ details.purpose || '—' }}</dd></div><div><dt>Scope</dt><dd>{{ scope || '—' }}</dd></div><div><dt>Methodology</dt><dd>{{ methodology || '—' }}</dd></div><div><dt>Maintenance</dt><dd>{{ maintenance || '—' }}</dd></div><div><dt>General observations</dt><dd>{{ generalObservations || '—' }}</dd></div><div><dt>Conclusion</dt><dd>{{ conclusion || '—' }}</dd></div></dl>
      </section>

      <form v-else class="report-form" @submit.prevent="submit">
        <section class="report-section">
          <div class="details-grid">
            <label class="field"><span>Audit No.</span><input :value="details.auditNumber" type="text" readonly /></label>
            <label class="field"><span>Audit Dates</span><input :value="auditDates" type="text" readonly /></label>
            <label class="field"><span>Internal Auditors</span><input :value="auditorNames" type="text" readonly /></label>
          </div>
          <label class="field"><span>Purpose</span><textarea :value="details.purpose" rows="4" readonly></textarea></label>
          <label class="field"><span>Scope <b>*</b></span><textarea v-model="scope" rows="4" placeholder="Define the scope covered by this report"></textarea></label>
          <label class="field"><span>Methodology <b>*</b></span><textarea v-model="methodology" rows="4" placeholder="Describe the audit methodology"></textarea></label>
        </section>

        <section class="report-section">
          <div class="section-title"><h3>Audit Observations</h3><p>Summarize maintenance findings and any general observations.</p></div>
          <label class="field"><span>Maintenance <b>*</b></span><textarea v-model="maintenance" rows="4" placeholder="Enter maintenance observations"></textarea></label>
          <label class="field"><span>General Observations <small>(optional)</small></span><textarea v-model="generalObservations" rows="4" placeholder="Enter any additional observations"></textarea></label>
        </section>

        <section class="report-section">
          <label class="field"><span>Conclusion <b>*</b></span><textarea v-model="conclusion" rows="4" placeholder="Enter the audit conclusion"></textarea></label>
          <div class="field"><HandleFIlesUpload label="Report attachments (optional)" accept=".pdf,.doc,.docx,.xls,.xlsx,image/*" :multiple="true" :max-files="10" @change="setAttachments" /></div>
        </section>

        <footer class="form-actions"><button class="primary-button" type="submit" :disabled="isSaving">{{ isSaving ? 'Creating report…' : 'Create report' }}</button></footer>
      </form>
    </template>
  </section>
</template>

<style scoped>
.report-tab{display:grid;gap:18px}.report-header{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:22px;border:1px solid var(--main-border,#d9e1df);border-radius:18px;background:var(--card-bg,#fff)}.eyebrow{color:var(--PrimaryColor,#087d80);font-size:.72rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.report-header h2{margin:4px 0;color:var(--text-primary,#172334);font-size:1.2rem}.report-header p,.section-title p{margin:0;color:var(--text-soft,#687777);font-size:.86rem}.header-actions{display:flex;gap:9px}.secondary-button,.primary-button{border-radius:9px;padding:10px 15px;font-weight:650}.secondary-button{border:1px solid var(--PrimaryColor,#087d80);background:transparent;color:var(--PrimaryColor,#087d80)}.primary-button{border:1px solid var(--PrimaryColor,#087d80);background:var(--PrimaryColor,#087d80);color:#fff}button:disabled{cursor:not-allowed;opacity:.55}.message{margin:0;border-radius:10px;padding:12px 16px}.message.error{background:#fff0f0;color:#b42318}.message.success{background:#e9f8f1;color:#16734b}.report-form{display:grid;gap:18px}.report-section{display:grid;gap:18px;padding:22px;border:1px solid var(--main-border,#d9e1df);border-radius:18px;background:var(--card-bg,#fff)}.details-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.field{display:flex;min-width:0;flex-direction:column;gap:8px}.field>span{color:var(--text-primary,#172334);font-size:.84rem;font-weight:650}.field b{color:#b42318}.field small{color:var(--text-soft,#687777);font-weight:500}.field input,.field textarea{width:100%;border:1px solid var(--main-border,#cbd8d6);border-radius:10px;background:transparent;padding:11px 13px;color:var(--text-primary,#172334);outline:none}.field input[readonly],.field textarea[readonly]{background:var(--surface-ground,#f4f7f6);color:var(--text-soft,#687777)}.field textarea:focus{border-color:var(--PrimaryColor,#087d80);box-shadow:0 0 0 3px color-mix(in srgb,var(--PrimaryColor,#087d80) 10%,transparent)}.section-title{padding-bottom:14px;border-bottom:1px solid var(--main-border,#d9e1df)}.section-title h3{margin:0 0 4px;font-size:1rem}.form-actions{display:flex;justify-content:flex-end}.report-preview{padding:30px;border:1px solid var(--main-border,#d9e1df);border-radius:18px;background:var(--card-bg,#fff)}.report-preview>header{display:flex;justify-content:space-between;gap:20px;padding-bottom:20px;border-bottom:2px solid var(--PrimaryColor,#087d80)}.report-preview small{color:var(--PrimaryColor,#087d80);font-weight:700;text-transform:uppercase}.report-preview h2{margin:5px 0 0}.report-preview dl{display:grid;gap:0;margin:20px 0 0}.report-preview dl>div{display:grid;grid-template-columns:190px 1fr;gap:20px;padding:14px 0;border-bottom:1px solid var(--main-border,#e5e9e8)}.report-preview dt{font-weight:700}.report-preview dd{margin:0;white-space:pre-wrap}.report-loading{display:grid;gap:10px}.report-loading span{height:86px;border-radius:12px;background:linear-gradient(90deg,#eef2f1 25%,#f8faf9 50%,#eef2f1 75%);background-size:200% 100%;animation:pulse 1.3s infinite}@keyframes pulse{to{background-position:-200% 0}}@media(max-width:800px){.details-grid{grid-template-columns:1fr}.report-header{align-items:flex-start;flex-direction:column}.header-actions{width:100%}.header-actions button{flex:1}.report-preview dl>div{grid-template-columns:1fr;gap:5px}}@media print{.report-header,.message,.form-actions{display:none}.report-preview{border:0;padding:0}}
</style>
