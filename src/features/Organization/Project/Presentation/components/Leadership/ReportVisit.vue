<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import CreateLeadershipVisitReportParams, { type VisitImprovementInput } from '../../../Core/params/Leadership/CreateLeadershipVisitReportParams'
import { UnsafeVisitTypeEnum } from '../../../Core/Enums/Leadership/UnsafeVisitTypeEnum'
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
const unsafeTypeOptions = [
  new TitleInterface({ id: UnsafeVisitTypeEnum.UnsafeAct, title: 'Unsafe act' }),
  new TitleInterface({ id: UnsafeVisitTypeEnum.UnsafeCondition, title: 'Unsafe condition' }),
]
const selectedOption = (options: TitleInterface[], id: number): TitleInterface | null =>
  options.find((option) => option.id === id) ?? null
const selectedId = (value: TitleInterface | TitleInterface[] | null): number =>
  value && !Array.isArray(value) ? value.id : 0
const selectedUnsafeType = (value: TitleInterface | TitleInterface[] | null): UnsafeVisitTypeEnum =>
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
  <Dialog :visible="Boolean(visit)" modal :dismissable-mask="true" :style="{ width: 'min(920px, 96vw)' }"
    class="report-dialog" @update:visible="(visible: boolean) => { if (!visible) emit('close') }">
    <template #header>
      <div class="report-heading">
        <span class="report-heading__icon" aria-hidden="true">▤</span>
        <div>
          <span class="eyebrow">Leadership visits</span>
          <h2>Report visit</h2>
          <p>Record the discussion, observations, and improvement actions.</p>
        </div>
      </div>
    </template>

    <form class="report-form" @submit.prevent="submit">
      <div v-if="visit" class="visit-context">
        <div>
          <span class="eyebrow">Selected visit</span>
          <strong>{{ visit.location }}</strong>
        </div>
        <span class="visit-context__date">{{ visit.date }}</span>
      </div>

      <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>

      <section class="form-section">
        <div class="section-title"><span>01</span>
          <div>
            <h3>Visit details</h3>
            <p>Describe what happened during the visit.</p>
          </div>
        </div>
        <div class="fields">
          <label class="field field--wide">Topic <span>*</span><input v-model="topic" type="text" required
              placeholder="Visit topic" /></label>
          <label class="field field--wide">Discussion <span>*</span><textarea v-model="discussion" rows="4" required
              placeholder="What was discussed?" /></label>
          <label class="field field--wide">Observations <span>*</span><textarea v-model="observations" rows="4" required
              placeholder="What did you observe?" /></label>
        </div>
      </section>

      <section class="form-section">
        <div class="section-title"><span>02</span>
          <div>
            <h3>Improvements</h3>
            <p>Add each intervention as a separate row.</p>
          </div>
        </div>
        <div class="improvement-list">
          <article v-for="(item, index) in improvements" :key="index" class="improvement-card">
            <div class="improvement-card__heading">
              <strong>Improvement {{ index + 1 }}</strong>
              <button type="button" class="text-button text-button--danger"
                @click="improvements.splice(index, 1)">Remove</button>
            </div>
            <div class="fields">
              <label class="field">Areas <span>*</span><input v-model="item.areas" type="text" required
                  placeholder="Area" /></label>
              <label class="field">Intervention carried out <span>*</span><input v-model="item.interventionCarriedOut"
                  type="text" required placeholder="Action taken" /></label>
              <UpdatedCustomInputSelect :id="`unsafe-type-${index}`" label="UA / UC" placeholder="Select UA / UC"
                :required="true" :reload="false" :static-options="unsafeTypeOptions"
                :model-value="selectedOption(unsafeTypeOptions, item.uaUc)"
                @update:model-value="(value) => { item.uaUc = selectedUnsafeType(value) }" />
              <UpdatedCustomInputSelect :id="`visit-theme-${index}`" label="Visit theme"
                placeholder="Select theme" :required="true" :reload="false"
                :controller="visitThemeController" :params="visitThemeParams"
                :model-value="selectedOption(themeOptions, item.visitThemId)"
                @update:model-value="(value) => { item.visitThemId = selectedId(value) }" />
              <UpdatedCustomInputSelect :id="`visit-category-${index}`" label="Visit category"
                placeholder="Select category" :required="true" :reload="false"
                :controller="visitCategoryController" :params="visitCategoryParams"
                :model-value="selectedOption(categoryOptions, item.visitCategoryId)"
                @update:model-value="(value) => { item.visitCategoryId = selectedId(value) }" />
            </div>
          </article>
        </div>
        <button type="button" class="add-button" @click="improvements.push(newImprovement())"><span>＋</span> Add
          improvement</button>
      </section>

      <section class="form-section">
        <div class="section-title"><span>03</span>
          <div>
            <h3>Attachments</h3>
            <p>Add supporting URLs or file paths when available.</p>
          </div>
        </div>
        <div class="attachment-list">
          <div v-for="(_, index) in attachments" :key="index" class="attachment-row">
            <input v-model="attachments[index]" type="text" placeholder="Attachment URL or path" />
            <button type="button" class="text-button text-button--danger"
              @click="attachments.splice(index, 1)">Remove</button>
          </div>
        </div>
        <button type="button" class="add-button" @click="attachments.push('')"><span>＋</span> Add attachment</button>
      </section>

      <footer class="form-footer">
        <button type="button" class="button button--quiet" @click="emit('close')">Cancel</button>
        <button type="submit" class="button button--primary" :disabled="controller.isDataLoading()">
          {{ controller.isDataLoading() ? 'Submitting…' : 'Submit visit report' }}
        </button>
      </footer>
    </form>
  </Dialog>
</template>

<style scoped>
.report-heading {
  display: flex;
  align-items: center;
  gap: 14px;
}

.report-heading__icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  flex: none;
  border-radius: 15px;
  color: var(--text-on-brand);
  background: var(--PrimaryColor);
  font-size: 1.7rem;
}

.report-heading h2,
.section-title h3 {
  margin: 2px 0;
  color: var(--text-strong);
}

.report-heading p,
.section-title p {
  margin: 0;
  color: var(--text-soft);
  font-size: .85rem;
}

.eyebrow {
  color: var(--PrimaryColor);
  font-size: .68rem;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
}

.report-form {
  display: grid;
  gap: 22px;
  padding-top: 8px;
}

.visit-context {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 16px 18px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 18%, var(--main-border));
  border-radius: 16px;
  background: color-mix(in srgb, var(--PrimaryColor) 7%, var(--surface-1));
}

.visit-context div {
  display: grid;
  gap: 4px;
}

.visit-context strong {
  color: var(--text-strong);
}

.visit-context__date {
  color: var(--PrimaryColor);
  font-weight: 800;
}

.form-error {
  margin: 0;
  padding: 12px 14px;
  border-radius: 10px;
  color: var(--status-danger);
  background: var(--status-danger-soft);
}

.form-section {
  display: grid;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--main-border);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title>span {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  flex: none;
  border-radius: 12px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 11%, var(--surface-1));
  font-weight: 800;
}

.fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.field {
  display: grid;
  align-content: start;
  gap: 7px;
  color: var(--text-strong);
  font-size: .82rem;
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
  padding: 11px 12px;
  border: 1px solid var(--main-border);
  border-radius: 10px;
  outline: none;
  color: var(--text-strong);
  background: var(--surface-1);
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
}

.fields :deep(.p-select) {
  width: 100%;
  min-width: 0;
  min-height: 42px;
  border-radius: 10px;
}

.improvement-list,
.attachment-list {
  display: grid;
  gap: 12px;
}

.improvement-card {
  padding: 18px;
  border: 1px solid var(--main-border);
  border-radius: 16px;
  background: var(--surface-2);
}

.improvement-card__heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  color: var(--text-strong);
}

.text-button {
  border: 0;
  background: none;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
}

.text-button--danger {
  color: var(--status-danger);
}

.add-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  padding: 10px 14px;
  border: 1px dashed var(--PrimaryColor);
  border-radius: 10px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 6%, var(--surface-1));
  cursor: pointer;
  font-weight: 800;
}

.add-button span {
  font-size: 1.15rem;
}

.attachment-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.button {
  padding: 11px 17px;
  border-radius: 10px;
  border: 1px solid var(--main-border);
  cursor: pointer;
  font-weight: 800;
}

.button--quiet {
  color: var(--text-strong);
  background: var(--surface-1);
}

.button--primary {
  color: var(--text-on-brand);
  border-color: var(--PrimaryColor);
  background: var(--PrimaryColor);
}

.button:disabled {
  opacity: .55;
  cursor: wait;
}

@media (max-width: 640px) {
  .fields {
    grid-template-columns: 1fr;
  }

  .visit-context,
  .form-footer {
    flex-wrap: wrap;
  }

  .form-footer .button {
    flex: 1;
  }
}
</style>
