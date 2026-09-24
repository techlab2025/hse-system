<script lang="ts" setup>
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import DatePicker from 'primevue/datepicker'
import CreateRiskAssessmentParams from '../../../Core/params/RiskAssessment/CreateRiskAssessmentParams'
import CreateRiskAssessmentController from '../../controllers/RiskAssessment/CreateRiskAssessmentController'
import type TitleInterface from '@/base/Data/Models/title_interface'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import HandleFIlesUpload, {
  type UploadedFile,
} from '@/features/Organization/OrganizationEmployee/Presentation/supcomponents/HandleFIlesUpload.vue'

const route = useRoute()
const router = useRouter()
const projectId = Number(route.params.id)
const listPath = `/organization/project-details/${projectId}/risk-assessments`
const form = ref({ activity: '', desctiprion: '', workAreaStrign: '', date: '' })
const selectedEmployee = ref<TitleInterface | null>(null)
const attachments = ref<string[]>([])
const indexOrganizatoinEmployeeController = IndexOrganizatoinEmployeeController.getInstance()
const indexOrganizatoinEmployeeParams = new IndexOrganizatoinEmployeeParams('', 0, 0, 0)
const saving = ref(false)
const error = ref('')

function setEmployee(employee: TitleInterface | TitleInterface[] | null) {
  selectedEmployee.value = Array.isArray(employee) ? (employee[0] ?? null) : employee
}

function handleFilesChange(files: UploadedFile[]) {
  attachments.value = files.map((file) => file.base64).filter(Boolean)
}

const formatDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

const parseDate = (value: string): Date | null => (value ? new Date(`${value}T00:00:00`) : null)

function setAssessmentDate(value: unknown) {
  form.value.date = value instanceof Date && !Number.isNaN(value.getTime()) ? formatDate(value) : ''
}

async function create() {
  error.value = ''
  const params = new CreateRiskAssessmentParams(
    form.value.activity.trim(),
    form.value.desctiprion.trim(),
    form.value.workAreaStrign.trim(),
    form.value.date,
    selectedEmployee.value?.id ?? 0,
    attachments.value,
  )
  const validation = params.validate()
  if (!validation.isValid) {
    error.value = validation.errors.map((item) => item.message).join(', ')
    return
  }
  saving.value = true
  try {
    const controller = CreateRiskAssessmentController.getInstance()
    const state = await controller.execute(params)
    if (controller.isDataSuccess()) await router.push(listPath)
    else error.value = state.value.error?.title ?? 'Could not create risk assessment'
  } catch {
    error.value = 'Could not create risk assessment'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <main class="create-page">
    <div class="form-shell">
      <header class="form-header">
        <div class="header-art" aria-hidden="true"><span></span><span></span></div>
        <!-- <RouterLink class="back-link" :to="listPath">
          <span aria-hidden="true">←</span> Risk assessments
        </RouterLink> -->
        <div class="header-content">
          <span class="header-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 3 4.5 6v5.2c0 4.6 3.1 8.2 7.5 9.8 4.4-1.6 7.5-5.2 7.5-9.8V6L12 3Z" />
              <path d="M12 8v8M8 12h8" />
            </svg>
          </span>
          <div>
            <!-- <span class="eyebrow">Project safety · new record</span> -->
            <h1>Create risk assessment</h1>
            <p>Build a clear safety record with the activity, approval, and evidence.</p>
          </div>
        </div>
      </header>
      <form @submit.prevent="create">
        <p v-if="error" class="error" role="alert"><span aria-hidden="true">!</span>{{ error }}</p>

        <section class="form-section">
          <div class="section-heading">
            <!-- <span class="step-number">01</span> -->
            <div>
              <!-- <span class="eyebrow">Assessment basics</span> -->
              <!-- <h2>Describe the work</h2> -->
              <!-- <p>Identify the activity, location, assessment date, and approver.</p> -->
            </div>
          </div>
          <div class="form-grid">
            <label class="field">
              <span class="field-label"
                ><span class="field-icon" aria-hidden="true">◇</span
                ><span>Activity <b>*</b></span></span
              >
              <input v-model="form.activity" required placeholder="e.g. Working at height" />
            </label>
            <label class="field">
              <span class="field-label"
                ><span class="field-icon" aria-hidden="true">⌖</span
                ><span>Work area <b>*</b></span></span
              >
              <input v-model="form.workAreaStrign" required placeholder="e.g. North building" />
            </label>
            <label class="field">
              <span class="field-label"
                ><span class="field-icon" aria-hidden="true">◷</span
                ><span>Date <b>*</b></span></span
              >
              <DatePicker
                input-id="risk-assessment-date"
                :model-value="parseDate(form.date)"
                date-format="yy-mm-dd"
                show-icon
                fluid
                placeholder="Select assessment date"
                @update:model-value="setAssessmentDate"
              />
            </label>
            <UpdatedCustomInputSelect
              class="field field--select"
              :model-value="selectedEmployee"
              :controller="indexOrganizatoinEmployeeController"
              :params="indexOrganizatoinEmployeeParams"
              id="risk-assessment-approver"
              placeholder="Select an approver"
              required
              :has-header="true"
              @update:model-value="setEmployee"
            >
              <template #Header>
                <span class="field-label"
                  ><span class="field-icon" aria-hidden="true">✓</span
                  ><span>Prepared By <b>*</b></span></span
                >
              </template>
            </UpdatedCustomInputSelect>
            <label class="field full">
              <span class="field-label"
                ><span class="field-icon" aria-hidden="true">≡</span
                ><span>Activity description <b>*</b></span></span
              >
              <textarea
                v-model="form.desctiprion"
                rows="5"
                required
                placeholder="Describe the work, hazards, and planned controls"
              />
            </label>
          </div>
        </section>

        <section class="form-section evidence-section">
          <div class="section-heading">
            <span class="step-number">02</span>
            <div>
              <span class="eyebrow">Supporting evidence</span>
              <h2>Add an assessment file</h2>
              <p>Attach the document that supports this safety record.</p>
            </div>
          </div>
          <div class="evidence-layout">
            <div class="field upload-field">
              <HandleFIlesUpload
                label=" Attachments "
                accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
                :max-files="6"
                :multiple="true"
                @change="handleFilesChange"
              />
              <small>PDF, Word, Excel, or image · One file maximum</small>
            </div>
            <!-- <aside class="evidence-note">
              <span class="evidence-note__icon" aria-hidden="true">i</span>
              <div>
                <strong>Before you submit</strong>
                <p>Confirm the key risks are described and the correct approver is selected.</p>
              </div>
            </aside> -->
          </div>
        </section>

        <footer class="form-footer">
          <div class="footer-note">
            <span aria-hidden="true">✓</span>
            <p>
              <strong>Ready to save?</strong
              ><small>Required fields are marked with an asterisk.</small>
            </p>
          </div>
          <div class="footer-actions">
            <RouterLink class="cancel-button" :to="listPath">Cancel</RouterLink>
            <button type="submit" :disabled="saving">
              {{ saving ? 'Creating…' : 'Create assessment' }}
              <span v-if="!saving" aria-hidden="true">→</span>
            </button>
          </div>
        </footer>
      </form>
    </div>
  </main>
</template>

<style scoped>
.create-page {
  /* max-width: 1020px; */
  margin: auto;
  padding: 26px;
  color: var(--text-primary, #172334);
}

.back-link {
  display: inline-block;
  margin-bottom: 20px;
  color: var(--PrimaryColor, #087d80);
  font-weight: 750;
  text-decoration: none;
}

.form-shell {
  border: 1px solid var(--main-border, #e5eaf0);
  border-radius: 24px;
  background: var(--surface-2, #fff);
  box-shadow: 0 20px 55px rgba(22, 45, 65, 0.07);
  overflow: hidden;
}

.form-header {
  padding: 34px;
  background:
    radial-gradient(
      circle at 90% 5%,
      color-mix(in srgb, var(--PrimaryColor, #087d80) 16%, transparent),
      transparent 38%
    ),
    var(--surface-1, #f8fafb);
  border-bottom: 1px solid var(--main-border, #e5eaf0);
}

.eyebrow {
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  font-weight: 800;
  color: var(--PrimaryColor, #087d80);
}

h1 {
  font-size: clamp(1.7rem, 3vw, 2.4rem);
  margin: 9px 0;
}

p {
  color: var(--text-secondary, #687787);
  margin: 0;
}

form {
  padding: 30px 34px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}

.field {
  display: grid;
  gap: 8px;
  font-weight: 700;
}

.field b {
  color: var(--status-danger, #bf3333);
}

input,
textarea {
  width: 100%;
  padding: 13px 15px;
  border: 1px solid var(--main-border, #d9e1e8);
  border-radius: 12px;
  background: var(--surface-1, #fff);
  color: inherit;
  font: inherit;
  font-weight: 400;
  outline: none;
}

input:focus,
textarea:focus {
  border-color: var(--PrimaryColor, #087d80);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--PrimaryColor, #087d80) 14%, transparent);
}

textarea {
  resize: vertical;
}

.full {
  grid-column: 1/-1;
}

small {
  color: var(--text-secondary, #687787);
  font-weight: 400;
}

.error {
  margin-top: 20px;
  color: var(--status-danger, #bf3333);
}

footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 14px;
  margin-top: 30px;
  padding-top: 22px;
  border-top: 1px solid var(--main-border, #e5eaf0);
}

footer button {
  border: 0;
  border-radius: 12px;
  padding: 13px 20px;
  background: var(--PrimaryColor, #087d80);
  color: #fff;
  font-weight: 750;
  cursor: pointer;
}

footer button:disabled {
  opacity: 0.55;
  cursor: wait;
}

.cancel-button {
  color: var(--text-secondary, #687787);
  text-decoration: none;
  font-weight: 700;
}

@media (max-width: 650px) {
  .create-page {
    padding: 12px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  form,
  .form-header {
    padding: 22px;
  }
}

/* Modern assessment workflow */
.create-page {
  min-height: 100%;
  margin: 0;
  padding: clamp(14px, 2vw, 28px);
  background:
    radial-gradient(
      circle at 8% 3%,
      color-mix(in srgb, var(--PrimaryColor) 7%, transparent),
      transparent 26rem
    ),
    var(--surface-2);
  color: var(--text-strong);
}

.form-shell {
  overflow: hidden;
  border-color: var(--main-border);
  border-radius: 28px;
  background: var(--surface-1);
  box-shadow: 0 24px 60px color-mix(in srgb, var(--brand-primary-900) 10%, transparent);
}

.form-header {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(26px, 4vw, 42px);
  border-bottom-color: color-mix(in srgb, var(--PrimaryColor) 18%, transparent);
  background:
    radial-gradient(
      circle at 88% 10%,
      color-mix(in srgb, var(--PrimaryColor) 24%, transparent),
      transparent 35%
    ),
    linear-gradient(
      125deg,
      color-mix(in srgb, var(--brand-primary-900) 96%, var(--surface-1)),
      color-mix(in srgb, var(--PrimaryColor) 76%, var(--brand-primary-900))
    );
}

.header-art {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.header-art span {
  position: absolute;
  border: 1px solid color-mix(in srgb, white 13%, transparent);
  border-radius: 50%;
}
.header-art span:first-child {
  width: 290px;
  height: 290px;
  inset: -180px -70px auto auto;
}
.header-art span:last-child {
  width: 150px;
  height: 150px;
  inset: auto 16% -115px auto;
}

.back-link,
.header-content {
  position: relative;
  z-index: 1;
}
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 25px;
  color: color-mix(in srgb, white 78%, transparent);
  font-size: 0.8rem;
}
.back-link:hover {
  color: white;
  transform: translateX(-2px);
}
.header-content {
  display: flex;
  align-items: center;
  gap: 18px;
}
.header-icon {
  display: grid;
  place-items: center;
  width: 66px;
  height: 66px;
  flex: none;
  border: 1px solid color-mix(in srgb, white 22%, transparent);
  border-radius: 20px;
  color: white;
  background: color-mix(in srgb, white 11%, transparent);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, white 18%, transparent),
    0 14px 30px color-mix(in srgb, black 20%, transparent);
  backdrop-filter: blur(10px);
}
.header-icon svg {
  width: 33px;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.eyebrow {
  color: var(--PrimaryColor);
  font-size: 0.67rem;
  font-weight: 850;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.form-header .eyebrow {
  color: color-mix(in srgb, white 68%, var(--PrimaryColor));
}
.form-header h1 {
  margin: 5px 0 8px;
  color: white;
  font-size: clamp(1.8rem, 3vw, 2.55rem);
  line-height: 1.08;
}
.form-header p {
  max-width: 630px;
  color: color-mix(in srgb, white 72%, transparent);
  line-height: 1.55;
}

form {
  display: grid;
  gap: 18px;
  padding: clamp(18px, 3vw, 30px);
  background: color-mix(in srgb, var(--surface-2) 62%, var(--surface-1));
}
.form-section {
  display: grid;
  gap: 22px;
  padding: clamp(19px, 3vw, 26px);
  border: 1px solid var(--main-border);
  border-radius: 20px;
  background: var(--surface-1);
  box-shadow: 0 10px 28px color-mix(in srgb, var(--brand-primary-900) 4%, transparent);
}
.section-heading {
  display: flex;
  align-items: center;
  gap: 13px;
}
.section-heading > div {
  display: grid;
  gap: 2px;
}
.section-heading h2 {
  margin: 2px 0;
  color: var(--text-strong);
  font-size: 1.25rem;
}
.section-heading p {
  color: var(--text-soft);
  font-size: 0.8rem;
}
.step-number {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex: none;
  border-radius: 14px;
  color: var(--text-on-brand);
  background: linear-gradient(145deg, var(--PrimaryColor), var(--brand-primary-700));
  box-shadow: 0 9px 20px color-mix(in srgb, var(--PrimaryColor) 22%, transparent);
  font-size: 0.73rem;
  font-weight: 850;
}

.form-grid {
  gap: 14px;
}
.field {
  align-content: start;
  gap: 10px;
  min-width: 0;
  padding: 14px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 10%, var(--main-border));
  border-radius: 15px;
  background: color-mix(in srgb, var(--surface-2) 50%, var(--surface-1));
  font-weight: 700;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}
.field:hover,
.field:focus-within {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--PrimaryColor) 34%, var(--main-border));
  box-shadow: 0 10px 24px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
}
.field-label {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
  color: var(--text-strong);
  font-size: 0.8rem;
  font-weight: 800;
}
.field-icon {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  flex: none;
  border-radius: 9px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 10%, var(--surface-1));
}
.field b {
  color: var(--status-danger);
}

input,
textarea {
  min-width: 0;
  min-height: 46px;
  padding: 11px 13px;
  border-color: color-mix(in srgb, var(--PrimaryColor) 10%, var(--main-border));
  border-radius: 11px;
  color: var(--text-strong);
  background: var(--surface-1);
}
textarea {
  min-height: 130px;
  line-height: 1.55;
}
input:focus,
textarea:focus {
  border-color: var(--PrimaryColor);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--PrimaryColor) 14%, transparent);
}
.field--select.updated-custom-input-select {
  display: grid;
  gap: 10px;
}
.field--select :deep(.input-label) {
  min-height: 28px;
  align-items: center;
  justify-content: start;
}
.field--select :deep(.p-select) {
  width: 100%;
  min-height: 46px;
  border-color: color-mix(in srgb, var(--PrimaryColor) 10%, var(--main-border));
  border-radius: 11px;
  background: var(--surface-1);
}
.field--select :deep(.p-select-label) {
  display: flex;
  align-items: center;
  padding-inline: 13px;
}
.field--select :deep(.p-select-dropdown) {
  width: 44px;
  color: var(--PrimaryColor);
}

.field :deep(.p-datepicker),
.field :deep(.p-datepicker-input) {
  width: 100%;
  min-width: 0;
}

.field :deep(.p-datepicker-input) {
  min-height: 46px;
  border-color: color-mix(in srgb, var(--PrimaryColor) 10%, var(--main-border));
  border-radius: 11px;
  color: var(--text-strong);
  background: var(--surface-1);
}

.field :deep(.p-datepicker-dropdown) {
  width: 46px;
  border-start-end-radius: 11px;
  border-end-end-radius: 11px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 8%, var(--surface-1));
}

.field :deep(.p-datepicker:not(.p-disabled).p-focus .p-datepicker-input) {
  border-color: var(--PrimaryColor);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--PrimaryColor) 14%, transparent);
}

.evidence-layout {
  display: grid;
  grid-template-columns: 1;
  gap: 14px;
  align-items: stretch;
}
.upload-field {
  padding: 16px;
  background: var(--surface-1);
}
.upload-field small {
  color: var(--text-soft);
  font-size: 0.7rem;
}
.upload-field :deep(.file-upload-wrapper) {
  gap: 10px;
}
.upload-field :deep(.upload-label) {
  color: var(--text-strong);
  font-size: 0.8rem;
  font-weight: 800;
}
.upload-field :deep(.upload-area) {
  min-height: 132px;
  border: 1.5px dashed color-mix(in srgb, var(--PrimaryColor) 34%, var(--main-border));
  border-radius: 14px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 4%, var(--surface-1));
}
.upload-field :deep(.upload-area:hover:not(.disabled)) {
  background: color-mix(in srgb, var(--PrimaryColor) 8%, var(--surface-1));
}
.upload-field :deep(.upload-icon) {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  color: var(--text-on-brand);
  background: linear-gradient(145deg, var(--PrimaryColor), var(--brand-primary-700));
  font-size: 1.15rem;
}
.upload-field :deep(.upload-text) {
  color: var(--PrimaryColor);
  font-weight: 750;
}

.evidence-note {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  padding: 18px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 18%, var(--main-border));
  border-radius: 15px;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--PrimaryColor) 7%, var(--surface-1)),
    var(--surface-1)
  );
}
.evidence-note__icon {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  flex: none;
  border-radius: 10px;
  color: var(--text-on-brand);
  background: var(--PrimaryColor);
  font-family: serif;
  font-weight: 800;
}
.evidence-note div {
  display: grid;
  gap: 6px;
}
.evidence-note strong {
  color: var(--text-strong);
  font-size: 0.82rem;
}
.evidence-note p {
  color: var(--text-soft);
  font-size: 0.75rem;
  line-height: 1.55;
}

.error {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 0;
  padding: 13px 15px;
  border-inline-start: 4px solid var(--status-danger);
  border-radius: 11px;
  color: var(--status-danger);
  background: var(--status-danger-soft);
  font-weight: 700;
}
.error > span {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 7px;
  color: white;
  background: var(--status-danger);
}

.form-footer {
  position: sticky;
  bottom: -1px;
  z-index: 2;
  justify-content: space-between;
  margin: 0 calc(clamp(18px, 3vw, 30px) * -1) calc(clamp(18px, 3vw, 30px) * -1);
  padding: 16px clamp(18px, 3vw, 30px);
  border-top: 1px solid var(--main-border);
  background: color-mix(in srgb, var(--surface-1) 92%, transparent);
  backdrop-filter: blur(14px);
}
.footer-note {
  display: flex;
  align-items: center;
  gap: 9px;
}
.footer-note > span {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 10%, var(--surface-1));
  font-weight: 850;
}
.footer-note p {
  display: grid;
  gap: 2px;
}
.footer-note strong {
  color: var(--text-strong);
  font-size: 0.78rem;
}
.footer-note small {
  color: var(--text-soft);
  font-size: 0.68rem;
}
.footer-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.cancel-button {
  padding: 11px 15px;
  border: 1px solid var(--main-border);
  border-radius: 11px;
  color: var(--text-strong);
  background: var(--surface-1);
}
.form-footer button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 44px;
  padding: 11px 18px;
  border-radius: 11px;
  color: var(--text-on-brand);
  background: linear-gradient(135deg, var(--PrimaryColor), var(--brand-primary-700));
  box-shadow: 0 10px 22px color-mix(in srgb, var(--PrimaryColor) 24%, transparent);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.form-footer button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 14px 28px color-mix(in srgb, var(--PrimaryColor) 30%, transparent);
}

button:focus-visible,
a:focus-visible,
input:focus-visible,
textarea:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--PrimaryColor) 24%, transparent);
  outline-offset: 2px;
}

@media (max-width: 800px) {
  .evidence-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 650px) {
  .create-page {
    padding: 12px;
  }
  .form-shell {
    border-radius: 21px;
  }
  .form-header {
    padding: 22px;
  }
  .header-content {
    align-items: flex-start;
  }
  .header-icon {
    width: 52px;
    height: 52px;
    border-radius: 16px;
  }
  .header-icon svg {
    width: 27px;
  }
  form {
    padding: 16px;
  }
  .form-section {
    padding: 16px;
    border-radius: 16px;
  }
  .form-footer {
    margin: 0 -16px -16px;
    padding: 14px 16px;
  }
  .footer-note {
    display: none;
  }
  .footer-actions {
    width: 100%;
  }
  .footer-actions > * {
    flex: 1;
    text-align: center;
  }
}

@media (max-width: 440px) {
  .header-content {
    display: block;
  }
  .header-icon {
    margin-bottom: 14px;
  }
  .section-heading {
    align-items: flex-start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .back-link,
  .field,
  .form-footer button {
    transition: none;
  }
}
</style>
