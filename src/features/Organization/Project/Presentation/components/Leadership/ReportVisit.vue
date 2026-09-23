<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import CreateLeadershipVisitReportParams, {
  type VisitImprovementInput,
} from '../../../Core/params/Leadership/CreateLeadershipVisitReportParams'
import {
  UnsafeVisitTypeEnum,
  unsafeVisitTypeOptions as unsafeVisitTypes,
} from '../../../Core/Enums/Leadership/UnsafeVisitTypeEnum'
import CreateLeadershipVisitReportController from '../../controllers/Leadership/CreateLeadershipVisitReportController'
import type LeadershipVisitModel from '../../../Data/models/Leadership/LeadershipVisitModel'
import IndexVisitThemeController from '@/features/Organization/VisitTheme/Presentation/controllers/indexVisitThemeController'
import IndexVisitThemeParams from '@/features/Organization/VisitTheme/Core/params/indexVisitThemeParams'
import IndexVisitCategoryController from '@/features/Organization/VisitCategory/Presentation/controllers/indexVisitCategoryController'
import IndexVisitCategoryParams from '@/features/Organization/VisitCategory/Core/params/indexVisitCategoryParams'

const props = defineProps<{ visit: LeadershipVisitModel | null }>()
const emit = defineEmits<{ close: []; submitted: [] }>()
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
const improvements = ref<VisitImprovementInput[]>([])
const attachments = ref<string[]>([])
const errorMessage = ref('')
const unsafeTypeOptions = unsafeVisitTypes.map((option) => new TitleInterface(option))
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

const newImprovement = (): VisitImprovementInput => ({
  areas: '',
  interventionCarriedOut: '',
  uaUc: UnsafeVisitTypeEnum.UnsafeAct,
  visitThemId: 0,
  visitCategoryId: 0,
})

watch(
  () => props.visit,
  (visit) => {
    if (!visit) return
    topic.value = ''
    discussion.value = ''
    observations.value = ''
    improvements.value = [newImprovement()]
    attachments.value = []
    errorMessage.value = ''
  },
)

const submit = async () => {
  if (!props.visit || controller.isDataLoading()) return
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
        !Number.isInteger(item.visitThemId) ||
        item.visitThemId <= 0 ||
        !Number.isInteger(item.visitCategoryId) ||
        item.visitCategoryId <= 0,
    )
  ) {
    errorMessage.value = 'Complete every improvement row.'
    return
  }

  try {
    await controller.createReport(
      new CreateLeadershipVisitReportParams(
        props.visit.id,
        topic.value.trim(),
        discussion.value.trim(),
        observations.value.trim(),
        improvements.value,
        attachments.value.map((item) => item.trim()).filter(Boolean),
      ),
    )
    if (controller.isDataSuccess()) emit('submitted')
    else errorMessage.value = controller.state.value.error?.title ?? 'Unable to submit the report.'
  } catch {
    errorMessage.value = 'Unable to submit the report.'
  }
}
</script>

<template>
  <Dialog
    :visible="Boolean(visit)"
    modal
    :dismissable-mask="true"
    :style="{ width: 'min(1000px, 96vw)' }"
    class="report-dialog"
    @update:visible="
      (visible: boolean) => {
        if (!visible) emit('close')
      }
    "
  >
    <template #header>
      <div class="report-heading">
        <span class="report-heading__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M8 4h8M9 3h6a1 1 0 0 1 1 1v2H8V4a1 1 0 0 1 1-1Z" />
            <path
              d="M7 5H5.8A1.8 1.8 0 0 0 4 6.8v12.4A1.8 1.8 0 0 0 5.8 21h12.4a1.8 1.8 0 0 0 1.8-1.8V6.8A1.8 1.8 0 0 0 18.2 5H17M8 11h8M8 15h5"
            />
          </svg>
        </span>
        <div>
          <span class="eyebrow">Leadership visits</span>
          <h2>Report visit</h2>
          <p>Record the discussion, observations, and improvement actions.</p>
        </div>
      </div>
    </template>

    <form class="report-form" @submit.prevent="submit">
      <div v-if="visit" class="visit-context">
        <div class="visit-context__location">
          <span class="visit-context__pin" aria-hidden="true">⌖</span>
          <div>
            <span class="eyebrow">Selected visit</span>
            <strong>{{ visit.location }}</strong>
          </div>
        </div>
        <span class="visit-context__date"><span aria-hidden="true">◷</span>{{ visit.date }}</span>
      </div>

      <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>

      <section class="form-section">
        <div class="section-title">
          <span>01</span>
          <div>
            <h3>Visit details</h3>
            <p>Describe what happened during the visit.</p>
          </div>
        </div>
        <div class="fields">
          <label class="field field--wide"
            >Topic <span>*</span
            ><input v-model="topic" type="text" required placeholder="Visit topic"
          /></label>
          <label class="field field--wide"
            >Discussion <span>*</span
            ><textarea v-model="discussion" rows="4" required placeholder="What was discussed?" />
          </label>
          <label class="field field--wide"
            >Observations <span>*</span
            ><textarea
              v-model="observations"
              rows="4"
              required
              placeholder="What did you observe?"
            />
          </label>
        </div>
      </section>

      <section class="form-section">
        <div class="section-title">
          <span>02</span>
          <div>
            <h3>Improvements</h3>
            <p>Add each intervention as a separate row.</p>
          </div>
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
                class="text-button text-button--danger"
                @click="improvements.splice(index, 1)"
              >
                <span aria-hidden="true">×</span> Remove
              </button>
            </div>
            <div class="fields">
              <label class="field"
                >Areas <span>*</span
                ><input v-model="item.areas" type="text" required placeholder="Area"
              /></label>
              <label class="field"
                >Intervention carried out <span>*</span
                ><input
                  v-model="item.interventionCarriedOut"
                  type="text"
                  required
                  placeholder="Action taken"
              /></label>
              <UpdatedCustomInputSelect
                :id="`unsafe-type-${index}`"
                label="UA / UC"
                placeholder="Select UA / UC"
                :required="true"
                :reload="false"
                :static-options="unsafeTypeOptions"
                :model-value="selectedOption(unsafeTypeOptions, item.uaUc)"
                @update:model-value="
                  (value) => {
                    item.uaUc = selectedUnsafeType(value)
                  }
                "
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
                @update:model-value="
                  (value) => {
                    item.visitThemId = selectedId(value)
                  }
                "
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
                @update:model-value="
                  (value) => {
                    item.visitCategoryId = selectedId(value)
                  }
                "
              />
            </div>
          </article>
        </div>
        <button type="button" class="add-button" @click="improvements.push(newImprovement())">
          <span>＋</span> Add improvement
        </button>
      </section>

      <section class="form-section">
        <div class="section-title">
          <span>03</span>
          <div>
            <h3>Attachments</h3>
            <p>Add supporting URLs or file paths when available.</p>
          </div>
        </div>
        <div class="attachment-list">
          <div v-for="(_, index) in attachments" :key="index" class="attachment-row">
            <input v-model="attachments[index]" type="text" placeholder="Attachment URL or path" />
            <button
              type="button"
              class="attachment-remove"
              aria-label="Remove attachment"
              @click="attachments.splice(index, 1)"
            >
              ×
            </button>
          </div>
        </div>
        <button type="button" class="add-button" @click="attachments.push('')">
          <span>＋</span> Add attachment
        </button>
      </section>

      <footer class="form-footer">
        <button type="button" class="button button--quiet" @click="emit('close')">Cancel</button>
        <button type="submit" class="button button--primary" :disabled="controller.isDataLoading()">
          {{ controller.isDataLoading() ? 'Submitting…' : 'Submit visit report' }}
          <span v-if="!controller.isDataLoading()" aria-hidden="true">→</span>
        </button>
      </footer>
    </form>
  </Dialog>
</template>

<style scoped>
:deep(.report-dialog) {
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 20%, var(--main-border));
  border-radius: 24px;
  background: var(--surface-1);
  box-shadow: 0 30px 90px color-mix(in srgb, var(--brand-primary-900) 24%, transparent);
}

:deep(.report-dialog .p-dialog-header) {
  position: relative;
  overflow: hidden;
  padding: 24px clamp(20px, 4vw, 34px);
  border-bottom: 1px solid color-mix(in srgb, var(--PrimaryColor) 15%, var(--main-border));
  background:
    radial-gradient(
      circle at 88% 10%,
      color-mix(in srgb, var(--PrimaryColor) 17%, transparent),
      transparent 30%
    ),
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--PrimaryColor) 8%, var(--surface-1)),
      var(--surface-1)
    );
}

:deep(.report-dialog .p-dialog-header)::after {
  content: '';
  position: absolute;
  width: 150px;
  height: 150px;
  inset-inline-end: 9%;
  top: -112px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 20%, transparent);
  border-radius: 50%;
  pointer-events: none;
}

:deep(.report-dialog .p-dialog-content) {
  padding: 0;
  background: color-mix(in srgb, var(--surface-2) 72%, var(--surface-1));
}

:deep(.report-dialog .p-dialog-close-button) {
  z-index: 1;
  border: 1px solid var(--main-border);
  background: var(--surface-1);
}

.report-heading {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 16px;
}

.report-heading__icon {
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  flex: none;
  border-radius: 18px;
  color: var(--text-on-brand);
  background: linear-gradient(145deg, var(--PrimaryColor), var(--brand-primary-700));
  box-shadow: 0 12px 28px color-mix(in srgb, var(--PrimaryColor) 28%, transparent);
}

.report-heading__icon svg {
  width: 28px;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.report-heading h2,
.section-title h3 {
  margin: 3px 0;
  color: var(--text-strong);
}

.report-heading h2 {
  font-size: clamp(1.35rem, 3vw, 1.75rem);
  line-height: 1.15;
}

.report-heading p,
.section-title p {
  margin: 0;
  color: var(--text-soft);
  font-size: 0.85rem;
}

.eyebrow {
  color: var(--PrimaryColor);
  font-size: 0.66rem;
  font-weight: 850;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.report-form {
  display: grid;
  gap: 18px;
  padding: clamp(18px, 3vw, 30px);
}

.visit-context {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 15px 18px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 20%, var(--main-border));
  border-radius: 18px;
  background: linear-gradient(
    110deg,
    color-mix(in srgb, var(--PrimaryColor) 9%, var(--surface-1)),
    var(--surface-1)
  );
  box-shadow: 0 8px 24px color-mix(in srgb, var(--brand-primary-900) 5%, transparent);
}

.visit-context__location {
  display: flex;
  align-items: center;
  gap: 12px;
}

.visit-context__location > div {
  display: grid;
  gap: 4px;
}

.visit-context__pin {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 12%, var(--surface-1));
  font-size: 1.25rem;
  font-weight: 900;
}

.visit-context strong {
  color: var(--text-strong);
}

.visit-context__date {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 12px;
  border-radius: 999px;
  color: var(--PrimaryColor);
  background: var(--surface-1);
  font-weight: 800;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--PrimaryColor) 14%, var(--main-border));
}

.form-error {
  margin: 0;
  padding: 13px 15px;
  border-inline-start: 4px solid var(--status-danger);
  border-radius: 11px;
  color: var(--status-danger);
  background: var(--status-danger-soft);
  font-weight: 700;
}

.form-section {
  display: grid;
  gap: 18px;
  padding: clamp(18px, 3vw, 24px);
  border: 1px solid var(--main-border);
  border-radius: 20px;
  background: var(--surface-1);
  box-shadow: 0 10px 28px color-mix(in srgb, var(--brand-primary-900) 4%, transparent);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title > span {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  flex: none;
  border-radius: 13px;
  color: var(--text-on-brand);
  background: linear-gradient(145deg, var(--PrimaryColor), var(--brand-primary-700));
  box-shadow: 0 8px 18px color-mix(in srgb, var(--PrimaryColor) 22%, transparent);
  font-size: 0.74rem;
  font-weight: 850;
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
  color: var(--text-strong);
  font-size: 0.82rem;
  font-weight: 700;
}

.field span {
  color: var(--status-danger);
}

.field--wide {
  grid-column: 1 / -1;
}

.field input,
.field select,
.field textarea,
.attachment-row input {
  min-width: 0;
  width: 100%;
  padding: 12px 13px;
  border: 1px solid var(--main-border);
  border-radius: 11px;
  outline: none;
  color: var(--text-strong);
  background: color-mix(in srgb, var(--surface-2) 46%, var(--surface-1));
  font: inherit;
  font-weight: 500;
}

.field input:focus,
.field select:focus,
.field textarea:focus,
.attachment-row input:focus {
  border-color: var(--PrimaryColor);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--PrimaryColor) 14%, transparent);
}

.field textarea {
  resize: vertical;
  min-height: 112px;
  line-height: 1.55;
}

.fields :deep(.p-select) {
  width: 100%;
  min-width: 0;
  min-height: 45px;
  border-radius: 11px;
}

.improvement-list,
.attachment-list {
  display: grid;
  gap: 12px;
}

.improvement-card {
  position: relative;
  overflow: hidden;
  padding: 18px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 12%, var(--main-border));
  border-radius: 17px;
  background: color-mix(in srgb, var(--surface-2) 70%, var(--surface-1));
  transition:
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.improvement-card::before {
  content: '';
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  width: 3px;
  background: linear-gradient(var(--PrimaryColor), var(--brand-primary-700));
}

.improvement-card:hover {
  border-color: color-mix(in srgb, var(--PrimaryColor) 32%, var(--main-border));
  box-shadow: 0 12px 28px color-mix(in srgb, var(--brand-primary-900) 6%, transparent);
}

.improvement-card__heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  color: var(--text-strong);
}

.improvement-card__heading > div {
  display: flex;
  align-items: center;
  gap: 10px;
}

.improvement-card__heading > div > div {
  display: grid;
  gap: 2px;
}

.improvement-card__heading small {
  color: var(--text-soft);
  font-size: 0.71rem;
  font-weight: 500;
}

.improvement-card__number {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 18%, var(--main-border));
  border-radius: 11px;
  color: var(--PrimaryColor);
  background: var(--surface-1);
  font-size: 0.72rem;
  font-weight: 850;
}

.text-button {
  border: 0;
  background: none;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
}

.text-button--danger {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 9px;
  border-radius: 9px;
  color: var(--status-danger);
}

.text-button--danger:hover {
  background: var(--status-danger-soft);
}

.add-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  padding: 11px 15px;
  border: 1px dashed var(--PrimaryColor);
  border-radius: 11px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 6%, var(--surface-1));
  cursor: pointer;
  font-weight: 800;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;
}

.add-button:hover {
  transform: translateY(-1px);
  color: var(--text-on-brand);
  background: var(--PrimaryColor);
}

.add-button span {
  font-size: 1.15rem;
}

.attachment-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.attachment-remove {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  flex: none;
  border: 0;
  border-radius: 11px;
  color: var(--status-danger);
  background: var(--status-danger-soft);
  cursor: pointer;
  font-size: 1.25rem;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  position: sticky;
  bottom: -1px;
  z-index: 2;
  margin: 0 calc(clamp(18px, 3vw, 30px) * -1) calc(clamp(18px, 3vw, 30px) * -1);
  padding: 16px clamp(18px, 3vw, 30px);
  border-top: 1px solid color-mix(in srgb, var(--PrimaryColor) 10%, var(--main-border));
  background: color-mix(in srgb, var(--surface-1) 92%, transparent);
  backdrop-filter: blur(14px);
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 44px;
  padding: 11px 18px;
  border-radius: 11px;
  border: 1px solid var(--main-border);
  cursor: pointer;
  font-weight: 800;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.button--quiet {
  color: var(--text-strong);
  background: var(--surface-1);
}

.button--primary {
  color: var(--text-on-brand);
  border-color: var(--PrimaryColor);
  background: linear-gradient(135deg, var(--PrimaryColor), var(--brand-primary-700));
  box-shadow: 0 10px 22px color-mix(in srgb, var(--PrimaryColor) 24%, transparent);
}

.button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.button--primary:hover:not(:disabled) {
  box-shadow: 0 14px 28px color-mix(in srgb, var(--PrimaryColor) 30%, transparent);
}

.button:disabled {
  opacity: 0.55;
  cursor: wait;
}

@media (max-width: 640px) {
  :deep(.report-dialog .p-dialog-header) {
    padding: 18px;
  }

  .report-heading__icon {
    width: 48px;
    height: 48px;
    border-radius: 15px;
  }

  .report-heading p {
    display: none;
  }

  .fields {
    grid-template-columns: 1fr;
  }

  .visit-context,
  .form-footer {
    flex-wrap: wrap;
  }

  .form-section {
    padding: 16px;
    border-radius: 16px;
  }

  .improvement-card {
    padding: 15px;
  }

  .improvement-card__heading {
    align-items: flex-start;
  }

  .attachment-row input {
    min-width: 0;
  }

  .form-footer .button {
    flex: 1;
  }
}
</style>
