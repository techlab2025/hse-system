<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import CreateLeadershipVisitReportParams, {
  type VisitImprovementInput,
} from '../../../Core/params/Leadership/CreateLeadershipVisitReportParams'
import FetchAllLeadershipVisitsParams from '../../../Core/params/Leadership/FetchAllLeadershipVisitsParams'
import {
  UnsafeVisitTypeEnum,
  unsafeVisitTypeOptions as unsafeVisitTypes,
} from '../../../Core/Enums/Leadership/UnsafeVisitTypeEnum'
import CreateLeadershipVisitReportController from '../../controllers/Leadership/CreateLeadershipVisitReportController'
import FetchAllLeadershipVisitsController from '../../controllers/Leadership/FetchAllLeadershipVisitsController'
import IndexVisitThemeController from '@/features/Organization/VisitTheme/Presentation/controllers/indexVisitThemeController'
import IndexVisitThemeParams from '@/features/Organization/VisitTheme/Core/params/indexVisitThemeParams'
import IndexVisitCategoryController from '@/features/Organization/VisitCategory/Presentation/controllers/indexVisitCategoryController'
import IndexVisitCategoryParams from '@/features/Organization/VisitCategory/Core/params/indexVisitCategoryParams'
import HandleFIlesUpload, {
  type UploadedFile,
} from '@/features/Organization/OrganizationEmployee/Presentation/supcomponents/HandleFIlesUpload.vue'

defineOptions({ name: 'LeadershipVisitReportPage' })

const route = useRoute()
const router = useRouter()
const projectId = computed(() => Number(route.params.id))
const visitId = computed(() => Number(route.params.visitId))
const visitsController = FetchAllLeadershipVisitsController.getInstance()
const visitsState = visitsController.state
const visit = computed(() =>
  (visitsState.value.data ?? []).find((item) => item.id === visitId.value),
)
const controller = CreateLeadershipVisitReportController.getInstance()
const visitThemeController = IndexVisitThemeController.getInstance()
const visitThemeParams = new IndexVisitThemeParams('', 1, 10, 0)
const themeOptions = computed(() => visitThemeController.state.value.data ?? [])
const visitCategoryController = IndexVisitCategoryController.getInstance()
const visitCategoryParams = new IndexVisitCategoryParams('', 1, 10, 0)
const categoryOptions = computed(() => visitCategoryController.state.value.data ?? [])
const topic = ref('')
const discussion = ref('')
const observations = ref('')
const attachments = ref<string[]>([])
const errorMessage = ref('')
const unsafeTypeOptions = unsafeVisitTypes.map((option) => new TitleInterface(option))
const newImprovement = (): VisitImprovementInput => ({
  areas: '',
  interventionCarriedOut: '',
  uaUc: UnsafeVisitTypeEnum.UnsafeAct,
  visitThemId: 0,
  visitCategoryId: 0,
})
const improvements = ref<VisitImprovementInput[]>([newImprovement()])
const selectedOption = (options: TitleInterface[], id: number): TitleInterface | null =>
  options.find((option) => option.id === id) ?? null
const selectedId = (value: TitleInterface | TitleInterface[] | null): number =>
  value && !Array.isArray(value) ? value.id : 0
const selectedUnsafeType = (
  value: TitleInterface | TitleInterface[] | null,
): UnsafeVisitTypeEnum =>
  selectedId(value) === UnsafeVisitTypeEnum.UnsafeCondition
    ? UnsafeVisitTypeEnum.UnsafeCondition
    : UnsafeVisitTypeEnum.UnsafeAct
const visitsPath = computed(
  () => `/organization/project-details/${projectId.value}/leadership/visits`,
)
const handleFilesChange = (files: UploadedFile[]) => {
  attachments.value = files.map((file) => file.base64).filter(Boolean)
}

const submit = async () => {
  if (!visit.value || visit.value.reportAdded || controller.isDataLoading()) return
  errorMessage.value = ''
  if (!topic.value.trim() || !discussion.value.trim() || !observations.value.trim()) {
    errorMessage.value = 'Complete the topic, discussion, and observations.'
    return
  }
  if (!improvements.value.length) {
    errorMessage.value = 'Add at least one improvement row.'
    return
  }
  if (
    improvements.value.some(
      (item) =>
        !item.areas.trim() ||
        !item.interventionCarriedOut.trim() ||
        item.visitThemId <= 0 ||
        item.visitCategoryId <= 0,
    )
  ) {
    errorMessage.value = 'Complete every improvement row.'
    return
  }
  try {
    await controller.createReport(
      new CreateLeadershipVisitReportParams(
        visit.value.id,
        topic.value.trim(),
        discussion.value.trim(),
        observations.value.trim(),
        improvements.value,
        attachments.value.map((item) => item.trim()).filter(Boolean),
      ),
    )
    if (controller.isDataSuccess()) {
      await router.push({ path: visitsPath.value, query: { report: 'created' } })
    } else {
      errorMessage.value = controller.state.value.error?.title ?? 'Unable to submit the report.'
    }
  } catch {
    errorMessage.value = 'Unable to submit the report.'
  }
}

onMounted(async () => {
  if (
    Number.isInteger(projectId.value) &&
    projectId.value > 0 &&
    Number.isInteger(visitId.value) &&
    visitId.value > 0
  ) {
    await visitsController.fetchVisits(new FetchAllLeadershipVisitsParams(projectId.value))
  }
})
</script>

<template>
  <main class="report-page">
    <header class="report-hero">
      <div class="report-hero__content">
        <span class="report-hero__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M8 4h8M9 3h6a1 1 0 0 1 1 1v2H8V4a1 1 0 0 1 1-1Z" />
            <path
              d="M7 5H5.8A1.8 1.8 0 0 0 4 6.8v12.4A1.8 1.8 0 0 0 5.8 21h12.4a1.8 1.8 0 0 0 1.8-1.8V6.8A1.8 1.8 0 0 0 18.2 5H17M8 11h8M8 15h5"
            />
          </svg>
        </span>
        <div>
          <!-- <span class="eyebrow">Leadership visits</span> -->
          <h1>Report visit</h1>
          <p>Record the discussion, observations, and improvement actions from this visit.</p>
        </div>
      </div>
      <RouterLink :to="visitsPath" class="back-link">← Back to visits</RouterLink>
    </header>

    <DataStatus :controller="visitsState">
      <template #success>
        <form v-if="visit && !visit.reportAdded" class="report-form" @submit.prevent="submit">
          <!-- <div class="visit-context">
            <div class="visit-context__main">
              <span class="visit-context__pin" aria-hidden="true">⌖</span>
              <div>
                <span class="eyebrow">Selected visit</span>
                <strong>{{ visit.location }}</strong>
                <small>{{ visit.organizationEmployeeName?.name || 'No employee' }}</small>
              </div>
            </div>
            <div class="visit-context__meta">
              <span><i aria-hidden="true">◷</i>{{ visit.date }}</span>
              <span
                ><i aria-hidden="true">◇</i
                >{{ visit.visitActivityName?.title || 'No activity' }}</span
              >
            </div>
          </div> -->

          <p v-if="errorMessage" class="form-error" role="alert">
            <span aria-hidden="true">!</span>{{ errorMessage }}
          </p>

          <section class="form-section">
            <div class="section-title">
              <span>01</span>
              <div>
                <h2>Visit details</h2>
                <p>Describe what happened during the visit.</p>
              </div>
            </div>
            <div class="fields">
              <label class="field field--wide">
                <span class="field__label">Topic <b>*</b></span>
                <input v-model="topic" type="text" required placeholder="Enter the visit topic" />
              </label>
              <label class="field field--wide">
                <span class="field__label">Discussion <b>*</b></span>
                <textarea
                  v-model="discussion"
                  rows="5"
                  required
                  placeholder="Summarize what was discussed"
                />
              </label>
              <label class="field field--wide">
                <span class="field__label">Observations <b>*</b></span>
                <textarea
                  v-model="observations"
                  rows="5"
                  required
                  placeholder="Record the key observations"
                />
              </label>
            </div>
          </section>

          <section class="form-section">
            <div class="section-title section-title--with-action">
              <div class="section-title__copy">
                <span>02</span>
                <div>
                  <h2>Improvements</h2>
                  <p>Add each intervention as a separate action.</p>
                </div>
              </div>
              <button type="button" class="add-button" @click="improvements.push(newImprovement())">
                <span aria-hidden="true">＋</span> Add improvement
              </button>
            </div>
            <div class="improvement-list">
              <article v-for="(item, index) in improvements" :key="index" class="improvement-card">
                <div class="improvement-card__heading">
                  <div>
                    <span class="improvement-card__number">{{
                      String(index + 1).padStart(2, '0')
                    }}</span>
                    <div>
                      <strong>Improvement {{ index + 1 }}</strong
                      ><small>Capture the issue and action taken</small>
                    </div>
                  </div>
                  <button
                    type="button"
                    class="remove-button"
                    :disabled="improvements.length === 1"
                    @click="improvements.splice(index, 1)"
                  >
                    <span aria-hidden="true">×</span> Remove
                  </button>
                </div>
                <div class="fields">
                  <label class="field">
                    <span class="field__label">Area <b>*</b></span>
                    <input v-model="item.areas" type="text" required placeholder="Affected area" />
                  </label>
                  <label class="field">
                    <span class="field__label">Intervention carried out <b>*</b></span>
                    <input
                      v-model="item.interventionCarriedOut"
                      type="text"
                      required
                      placeholder="Action taken"
                    />
                  </label>
                  <UpdatedCustomInputSelect
                    :id="`unsafe-type-${index}`"
                    label="UA / UC"
                    placeholder="Select UA / UC"
                    :required="true"
                    :reload="false"
                    :static-options="unsafeTypeOptions"
                    :model-value="selectedOption(unsafeTypeOptions, item.uaUc)"
                    @update:model-value="(value) => (item.uaUc = selectedUnsafeType(value))"
                  />
                  <UpdatedCustomInputSelect
                    :id="`visit-theme-${index}`"
                    label="Visit theme"
                    placeholder="Select theme"
                    :required="true"
                    :reload="false"
                    :controller="visitThemeController"
                    :params="visitThemeParams"
                    :model-value="selectedOption(themeOptions, item.visitThemId)"
                    @update:model-value="(value) => (item.visitThemId = selectedId(value))"
                  />
                  <UpdatedCustomInputSelect
                    :id="`visit-category-${index}`"
                    label="Visit category"
                    placeholder="Select category"
                    :required="true"
                    :reload="false"
                    :controller="visitCategoryController"
                    :params="visitCategoryParams"
                    :model-value="selectedOption(categoryOptions, item.visitCategoryId)"
                    @update:model-value="(value) => (item.visitCategoryId = selectedId(value))"
                  />
                </div>
              </article>
            </div>
          </section>

          <section class="form-section">
            <div class="section-title">
              <div class="section-title__copy">
                <span>03</span>
                <div>
                  <h2>Attachments</h2>
                  <p>Upload supporting evidence for this leadership visit.</p>
                </div>
              </div>
            </div>
            <div class="report-upload-field">
              <HandleFIlesUpload
                label="Visit report attachment"
                accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
                :max-files="1"
                :multiple="false"
                class-name="report-file-input"
                @change="handleFilesChange"
              />
              <small>PDF, Word, Excel, or image · One file maximum</small>
            </div>
          </section>

          <footer class="form-footer">
            <RouterLink :to="visitsPath" class="button button--quiet">Cancel</RouterLink>
            <button
              type="submit"
              class="button button--primary"
              :disabled="controller.isDataLoading()"
            >
              {{ controller.isDataLoading() ? 'Submitting…' : 'Submit visit report' }}
              <span v-if="!controller.isDataLoading()" aria-hidden="true">→</span>
            </button>
          </footer>
        </form>

        <section v-else-if="visit?.reportAdded" class="page-state">
          <span aria-hidden="true">✓</span>
          <h2>This visit already has a report</h2>
          <p>Return to the visit register to review its report details.</p>
          <RouterLink :to="visitsPath">View leadership visits</RouterLink>
        </section>
        <section v-else class="page-state page-state--error">
          <span aria-hidden="true">!</span>
          <h2>Visit not found</h2>
          <p>The selected visit does not exist in this project.</p>
          <RouterLink :to="visitsPath">Back to leadership visits</RouterLink>
        </section>
      </template>
      <template #loader
        ><div class="loader-card"><TableLoader :cols="2" :rows="5" /></div
      ></template>
      <template #initial
        ><div class="loader-card"><TableLoader :cols="2" :rows="5" /></div
      ></template>
      <template #failed
        ><section class="page-state page-state--error">
          <span>!</span>
          <h2>Unable to load this visit</h2>
          <RouterLink :to="visitsPath">Back to leadership visits</RouterLink>
        </section></template
      >
    </DataStatus>
  </main>
</template>

<style scoped>
.report-page {
  display: grid;
  gap: 22px;
  min-height: 100%;
  padding: clamp(14px, 2vw, 28px);
  background:
    radial-gradient(
      circle at 8% 4%,
      color-mix(in srgb, var(--PrimaryColor) 7%, transparent),
      transparent 24rem
    ),
    var(--surface-2);
}
.report-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  overflow: hidden;
  padding: clamp(26px, 4vw, 42px);
  border-radius: 26px;
  color: white;
  background:
    radial-gradient(circle at 88% 8%, color-mix(in srgb, white 13%, transparent), transparent 30%),
    linear-gradient(125deg, var(--brand-primary-900), var(--PrimaryColor));
  box-shadow: 0 22px 52px color-mix(in srgb, var(--brand-primary-900) 19%, transparent);
}
.report-hero__content,
.visit-context__main,
.section-title,
.section-title__copy,
.improvement-card__heading,
.improvement-card__heading > div {
  display: flex;
  align-items: center;
}
.report-hero__content {
  gap: 18px;
}
.report-hero__icon {
  display: grid;
  place-items: center;
  width: 66px;
  height: 66px;
  flex: none;
  border: 1px solid color-mix(in srgb, white 22%, transparent);
  border-radius: 20px;
  background: color-mix(in srgb, white 12%, transparent);
}
.report-hero__icon svg {
  width: 31px;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.eyebrow {
  color: var(--PrimaryColor);
  font-size: 0.68rem;
  font-weight: 850;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.report-hero .eyebrow {
  color: color-mix(in srgb, white 72%, var(--PrimaryColor));
}
.report-hero h1 {
  margin: 4px 0 7px;
  font-size: clamp(1.7rem, 3vw, 2.45rem);
}
.report-hero p {
  margin: 0;
  color: color-mix(in srgb, white 72%, transparent);
}
.back-link {
  flex: none;
  padding: 11px 15px;
  border: 1px solid color-mix(in srgb, white 22%, transparent);
  border-radius: 12px;
  color: white;
  background: color-mix(in srgb, white 10%, transparent);
  font-weight: 750;
  text-decoration: none;
}
.report-form {
  display: grid;
  gap: 18px;
  /* width: min(1120px, 100%); */
  margin-inline: auto;
}
.visit-context,
.form-section,
.form-footer,
.loader-card,
.page-state {
  border: 1px solid var(--main-border);
  background: var(--surface-1);
  box-shadow: 0 12px 34px color-mix(in srgb, var(--brand-primary-900) 6%, transparent);
}
.visit-context {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 17px 20px;
  border-color: color-mix(in srgb, var(--PrimaryColor) 20%, var(--main-border));
  border-radius: 18px;
  background: linear-gradient(
    110deg,
    color-mix(in srgb, var(--PrimaryColor) 9%, var(--surface-1)),
    var(--surface-1)
  );
}
.visit-context__main {
  gap: 12px;
}
.visit-context__main > div {
  display: grid;
  gap: 3px;
}
.visit-context__main strong {
  color: var(--text-strong);
  font-size: 1rem;
}
.visit-context__main small {
  color: var(--text-soft);
}
.visit-context__pin {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex: none;
  border-radius: 13px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 12%, var(--surface-1));
  font-size: 1.3rem;
  font-weight: 900;
}
.visit-context__meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 9px;
}
.visit-context__meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 11px;
  border-radius: 999px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 7%, var(--surface-1));
  font-size: 0.78rem;
  font-weight: 800;
}
.visit-context__meta i {
  font-style: normal;
}
.form-error {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 0;
  padding: 13px 15px;
  border-radius: 12px;
  color: var(--status-danger);
  background: var(--status-danger-soft);
  font-weight: 750;
}
.form-error span {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  color: white;
  background: var(--status-danger);
}
.form-section {
  display: grid;
  gap: 20px;
  padding: clamp(19px, 3vw, 28px);
  border-radius: 20px;
}
.section-title {
  gap: 12px;
}
.section-title--with-action {
  justify-content: space-between;
  gap: 16px;
}
.section-title__copy {
  gap: 12px;
}
.section-title > span,
.section-title__copy > span {
  display: grid;
  place-items: center;
  width: 43px;
  height: 43px;
  flex: none;
  border-radius: 13px;
  color: var(--text-on-brand);
  background: linear-gradient(145deg, var(--PrimaryColor), var(--brand-primary-700));
  font-size: 0.74rem;
  font-weight: 850;
}
.section-title h2 {
  margin: 0 0 4px;
  color: var(--text-strong);
  font-size: 1.08rem;
}
.section-title p {
  margin: 0;
  color: var(--text-soft);
  font-size: 0.82rem;
}
.fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.field {
  display: grid;
  align-content: start;
  gap: 8px;
  min-width: 0;
}
.field--wide {
  grid-column: 1 / -1;
}
.field__label {
  color: var(--text-strong);
  font-size: 0.82rem;
  font-weight: 800;
}
.field__label b {
  color: var(--status-danger);
}
.field input,
.field textarea {
  width: 100%;
  min-width: 0;
  padding: 12px 14px !important;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 10%, var(--main-border));
  border-radius: 12px !important;
  outline: 0;
  color: var(--text-strong);
  background: color-mix(in srgb, var(--surface-2) 48%, var(--surface-1));
  font: inherit;
  font-weight: 500;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}
.field input:focus,
.field textarea:focus {
  border-color: var(--PrimaryColor);
  background: var(--surface-1);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--PrimaryColor) 13%, transparent);
}
.field textarea {
  min-height: 120px;
  resize: vertical;
  line-height: 1.55;
}
.fields :deep(.updated-custom-input-select) {
  min-width: 0;
}
.fields :deep(.p-select) {
  width: 100%;
  min-height: 46px;
}
.improvement-list {
  display: grid;
  gap: 13px;
}
.improvement-card {
  position: relative;
  overflow: hidden;
  padding: 18px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 13%, var(--main-border));
  border-radius: 17px;
  background: color-mix(in srgb, var(--surface-2) 67%, var(--surface-1));
}
.improvement-card::before {
  content: '';
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  width: 3px;
  background: var(--PrimaryColor);
}
.improvement-card__heading {
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 17px;
}
.improvement-card__heading > div {
  gap: 10px;
}
.improvement-card__heading > div > div {
  display: grid;
  gap: 2px;
}
.improvement-card__heading strong {
  color: var(--text-strong);
}
.improvement-card__heading small {
  color: var(--text-soft);
  font-size: 0.72rem;
}
.improvement-card__number {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 11px;
  color: var(--PrimaryColor);
  background: var(--surface-1);
  font-size: 0.72rem;
  font-weight: 850;
}
.remove-button {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 10px;
  border: 0;
  border-radius: 9px;
  color: var(--status-danger);
  background: var(--status-danger-soft);
  cursor: pointer;
  font: inherit;
  font-weight: 750;
}
.remove-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.add-button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 13px;
  border: 1px dashed var(--PrimaryColor);
  border-radius: 11px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 6%, var(--surface-1));
  cursor: pointer;
  font: inherit;
  font-weight: 800;
}
.report-upload-field {
  display: grid;
  gap: 8px;
  padding: 16px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 12%, var(--main-border));
  border-radius: 15px;
  background: color-mix(in srgb, var(--surface-2) 55%, var(--surface-1));
}

.report-upload-field > small {
  color: var(--text-soft);
  font-size: 0.75rem;
}

.report-upload-field :deep(.file-upload-wrapper) {
  gap: 10px;
}

.report-upload-field :deep(.upload-label) {
  color: var(--text-strong);
  font-size: 0.82rem;
  font-weight: 800;
}

.report-upload-field :deep(.report-file-input) {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 92px;
  padding: 18px;
  border: 1px dashed color-mix(in srgb, var(--PrimaryColor) 42%, var(--main-border));
  border-radius: 13px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 5%, var(--surface-1));
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease;
}

.report-upload-field :deep(.report-file-input:hover:not(.disabled)) {
  border-color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 9%, var(--surface-1));
  transform: translateY(-1px);
}

.report-upload-field :deep(.report-file-input.disabled) {
  cursor: not-allowed;
  opacity: 0.55;
}

.report-upload-field :deep(.preview-grid) {
  margin-top: 2px;
}

.report-upload-field :deep(.preview-item) {
  width: 112px;
  height: 112px;
  border-color: color-mix(in srgb, var(--PrimaryColor) 18%, var(--main-border));
  border-radius: 13px;
  background: var(--surface-1);
}
.form-footer {
  position: sticky;
  bottom: 12px;
  z-index: 3;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px;
  border-radius: 16px;
  background: color-mix(in srgb, var(--surface-1) 90%, transparent);
  backdrop-filter: blur(14px);
}
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 45px;
  padding: 11px 18px;
  border: 1px solid var(--main-border);
  border-radius: 11px;
  cursor: pointer;
  font: inherit;
  font-weight: 800;
  text-decoration: none;
}
.button--quiet {
  color: var(--text-strong);
  background: var(--surface-1);
}
.button--primary {
  color: var(--text-on-brand);
  border-color: var(--PrimaryColor);
  background: linear-gradient(135deg, var(--PrimaryColor), var(--brand-primary-700));
  box-shadow: 0 10px 22px color-mix(in srgb, var(--PrimaryColor) 23%, transparent);
}
.button:disabled {
  opacity: 0.55;
  cursor: wait;
}
.loader-card,
.page-state {
  width: min(1120px, 100%);
  margin-inline: auto;
  padding: clamp(22px, 4vw, 40px);
  border-radius: 20px;
}
.page-state {
  display: grid;
  place-items: center;
  gap: 9px;
  text-align: center;
}
.page-state > span {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  color: white;
  background: var(--status-success);
  font-size: 1.4rem;
  font-weight: 900;
}
.page-state h2 {
  margin: 4px 0 0;
  color: var(--text-strong);
}
.page-state p {
  margin: 0;
  color: var(--text-soft);
}
.page-state a {
  margin-top: 6px;
  color: var(--PrimaryColor);
  font-weight: 800;
}
.page-state--error > span {
  background: var(--status-danger);
}
@media (max-width: 720px) {
  .report-hero,
  .visit-context,
  .section-title--with-action {
    flex-wrap: wrap;
  }
  .back-link {
    width: 100%;
    text-align: center;
  }
  .visit-context__meta {
    justify-content: flex-start;
  }
  .fields {
    grid-template-columns: 1fr;
  }
  .field--wide {
    grid-column: auto;
  }
}
@media (max-width: 520px) {
  .report-hero__icon {
    width: 52px;
    height: 52px;
    border-radius: 16px;
  }
  .form-section {
    padding: 16px;
  }
  .improvement-card {
    padding: 15px;
  }
  .improvement-card__heading {
    align-items: flex-start;
  }
  .form-footer {
    position: static;
    flex-direction: column-reverse;
  }
  .form-footer .button {
    width: 100%;
  }
}
</style>
