<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import HandleFIlesUpload, {
  type UploadedFile,
} from '@/features/Organization/OrganizationEmployee/Presentation/supcomponents/HandleFIlesUpload.vue'
import CreateAttachmentMatrixParams from '../../Core/params/CreateAttachmentMatrixParams'
import FetchAttachmentMatrixParams from '../../Core/params/FetchAttachmentMatrixParams'
import type AttachmentMatrixItemModel from '../../Data/models/AttachmentMatrixItemModel'
import CreateAttachmentMatrixController from '../controllers/CreateAttachmentMatrixController'
import FetchAttachmentMatrixController from '../controllers/FetchAttachmentMatrixController'

type GroupKey = 'H' | 'sos' | 's'

const groups: Array<{ key: GroupKey; title: string; description: string }> = [
  {
    key: 'H',
    title: 'hse policy attachments',
    description: 'Upload the documents assigned to block hse_policy.',
  },
  {
    key: 'sos',
    title: 'sos attachments',
    description: 'Upload the documents assigned to block sos.',
  },
  {
    key: 's',
    title: 'standerd policy attachments',
    description: 'Upload the documents assigned to block standerd_policy.',
  },
]

const attachments = reactive<Record<GroupKey, string[]>>({
  H: [],
  sos: [],
  s: [],
})
const fetchController = FetchAttachmentMatrixController.getInstance()
const createController = CreateAttachmentMatrixController.getInstance()
const feedback = ref('')
const hasError = ref(false)
const isLoading = computed(() => fetchController.isDataLoading())
const isSaving = computed(() => createController.isDataLoading())

const setGroupAttachments = (key: GroupKey, items: AttachmentMatrixItemModel[]) => {
  attachments[key] = items.map((item) => item.file).filter(Boolean)
}

const fetchMatrix = async () => {
  feedback.value = ''
  hasError.value = false
  await fetchController.fetch(new FetchAttachmentMatrixParams())

  if (fetchController.isDataSuccess() && fetchController.state.value.data) {
    const matrix = fetchController.state.value.data
    setGroupAttachments('H', matrix.hse_policy)
    setGroupAttachments('sos', matrix.sos)
    setGroupAttachments('s', matrix.standerd_policy)
    return
  }

  hasError.value = true
  feedback.value = fetchController.state.value.error?.title ?? 'Unable to load attachment matrix.'
}

const handleFilesChange = (key: GroupKey, files: UploadedFile[]) => {
  attachments[key] = files.map((file) => file.base64 || file.url).filter(Boolean)
}

const groupValues = (key: GroupKey): string[] => attachments[key].filter(Boolean)

const attachmentCount = (key: GroupKey) => groupValues(key).length
const totalAttachments = computed(() =>
  groups.reduce((total, group) => total + attachmentCount(group.key), 0),
)

const submit = async () => {
  feedback.value = ''
  hasError.value = false

  await createController.create(
    new CreateAttachmentMatrixParams(groupValues('H'), groupValues('sos'), groupValues('s')),
  )

  if (createController.isDataSuccess()) {
    feedback.value = 'Attachment matrix saved successfully.'
    return
  }

  hasError.value = true
  feedback.value = createController.state.value.error?.title ?? 'Unable to save attachment matrix.'
}

onMounted(fetchMatrix)
</script>

<template>
  <form class="attachment-matrix" @submit.prevent="submit">
    <header class="attachment-matrix__header">
      <span class="hero-orb hero-orb--one" aria-hidden="true"></span>
      <span class="hero-orb hero-orb--two" aria-hidden="true"></span>

      <div class="attachment-matrix__hero-copy">
        <span class="attachment-matrix__eyebrow"><i></i> Organization configuration</span>
        <h1>Attachment <em>matrix</em></h1>
        <p>
          Build a clear, organized library of supporting documents across your three operational
          blocks.
        </p>

        <div class="attachment-matrix__stats" aria-label="Attachment summary">
          <span v-for="group in groups" :key="group.key" :data-stat="group.key">
            <b>{{ group.key.toUpperCase() }}</b>
            {{ attachmentCount(group.key) }} files
          </span>
          <span class="attachment-matrix__total">
            <b>{{ totalAttachments }}</b>
            total
          </span>
        </div>
      </div>

      <div class="attachment-matrix__hero-action">
        <span class="attachment-matrix__hero-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M7 3h8l4 4v14H7V3Z" />
            <path d="M15 3v5h4M10 12h6M10 16h6" />
          </svg>
        </span>
        <button class="matrix-save-button" type="submit" :disabled="isLoading || isSaving">
          <svg v-if="!isSaving" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 4h12l2 2v14H5V4Z" />
            <path d="M8 4v6h8V4M8 20v-6h8v6" />
          </svg>
          <span v-else class="matrix-save-button__spinner" aria-hidden="true"></span>
          {{ isSaving ? 'Saving changes…' : 'Save matrix' }}
        </button>
        <small>PDF, Word, Excel and images supported</small>
      </div>
    </header>

    <div v-if="isLoading" class="attachment-matrix__loading" aria-label="Loading attachment matrix">
      <span v-for="index in 3" :key="index"></span>
    </div>

    <div v-else class="attachment-matrix__groups">
      <section
        v-for="(group, groupIndex) in groups"
        :key="group.key"
        class="matrix-group"
        :data-group="group.key"
      >
        <span class="matrix-group__watermark" aria-hidden="true">{{ group.key }}</span>
        <header class="matrix-group__header">
          <div class="matrix-group__title">
            <span class="matrix-group__symbol">{{ group.key.toUpperCase() }}</span>
            <div>
              <small>Block {{ String(groupIndex + 1).padStart(2, '0') }}</small>
              <h2>{{ group.title }}</h2>
              <p>{{ group.description }}</p>
            </div>
          </div>
          <div class="matrix-group__actions">
            <span class="matrix-group__count">
              <b>{{ attachmentCount(group.key) }}</b>
              {{ attachmentCount(group.key) === 1 ? 'file' : 'files' }}
            </span>
          </div>
        </header>

        <div class="matrix-group__attachments">
          <article
            class="attachment-slot attachment-slot--multiple"
            :class="{ 'attachment-slot--filled': attachmentCount(group.key) }"
          >
            <HandleFIlesUpload
              :label="group.title"
              accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
              :max-files="10"
              :multiple="true"
              :index="groupIndex"
              :file="attachments[group.key]"
              class-name="report-file-input"
              @change="(files) => handleFilesChange(group.key, files)"
            />
            <p class="attachment-slot__hint">
              Select up to 10 files at once. You can remove individual files from the preview list.
            </p>
          </article>
        </div>
      </section>
    </div>

    <p
      v-if="feedback"
      class="attachment-matrix__feedback"
      :class="{ 'attachment-matrix__feedback--error': hasError }"
      role="status"
    >
      {{ feedback }}
    </p>
  </form>
</template>

<style scoped lang="scss">
.report-file-input {
  justify-content: center !important;
  display: flex !important;
  align-items: center !important;
}
:deep(.report-file-input) {
  justify-content: center !important;
  display: flex !important;
  align-items: center !important;
}

.attachment-matrix {
  --matrix-radius: 24px;
  display: flex;
  max-width: 1500px;
  flex-direction: column;
  gap: 22px;
  margin: 0 auto;
  padding: 10px;
}

.attachment-matrix__header,
.matrix-group__header,
.matrix-group__title {
  display: flex;
  align-items: center;
}

.attachment-matrix__header {
  position: relative;
  min-height: 290px;
  justify-content: space-between;
  gap: 48px;
  overflow: hidden;
  padding: clamp(28px, 5vw, 58px);
  border: 1px solid color-mix(in srgb, var(--identity-primary) 25%, transparent);
  border-radius: 30px;
  background:
    linear-gradient(
      125deg,
      color-mix(in srgb, var(--brand-secondary-900) 94%, transparent),
      color-mix(in srgb, var(--brand-primary-700) 88%, var(--identity-accent))
    ),
    var(--brand-secondary-900);
  box-shadow: 0 30px 70px color-mix(in srgb, var(--identity-secondary) 22%, transparent);
  isolation: isolate;
}

.attachment-matrix__header::before {
  position: absolute;
  z-index: -1;
  inset: 0;
  background-image:
    linear-gradient(color-mix(in srgb, var(--text-on-brand) 6%, transparent) 1px, transparent 1px),
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--text-on-brand) 6%, transparent) 1px,
      transparent 1px
    );
  background-size: 34px 34px;
  content: '';
  mask-image: linear-gradient(90deg, #000, transparent 72%);
}

.hero-orb {
  position: absolute;
  z-index: -1;
  border-radius: 999px;
  filter: blur(2px);
  pointer-events: none;
}

.hero-orb--one {
  width: 260px;
  height: 260px;
  inset: -125px -45px auto auto;
  background: color-mix(in srgb, var(--identity-accent) 48%, transparent);
}

.hero-orb--two {
  width: 190px;
  height: 190px;
  inset: auto 25% -145px auto;
  background: color-mix(in srgb, var(--identity-primary) 42%, transparent);
}

.attachment-matrix__hero-copy {
  position: relative;
  z-index: 1;
  max-width: 720px;
}

.attachment-matrix__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: color-mix(in srgb, var(--identity-primary) 38%, var(--text-on-brand));
  font-size: 0.75rem;
  font-weight: 850;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.attachment-matrix__eyebrow i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--identity-primary);
  box-shadow: 0 0 0 6px color-mix(in srgb, var(--identity-primary) 18%, transparent);
}

.attachment-matrix__header h1 {
  margin: 12px 0 10px;
  color: var(--text-on-brand);
  font-size: clamp(2.1rem, 5vw, 4.35rem);
  font-weight: 850;
  letter-spacing: -0.055em;
  line-height: 0.98;
}

.attachment-matrix__header h1 em {
  color: color-mix(in srgb, var(--identity-primary) 60%, var(--text-on-brand));
  font-style: normal;
}

.attachment-matrix__header p {
  max-width: 610px;
  margin: 0;
  color: color-mix(in srgb, var(--text-on-brand) 72%, transparent);
  font-size: 1rem;
  line-height: 1.7;
}

.attachment-matrix__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 26px;
}

.attachment-matrix__stats > span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 12px;
  border: 1px solid color-mix(in srgb, var(--text-on-brand) 14%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--text-on-brand) 8%, transparent);
  color: color-mix(in srgb, var(--text-on-brand) 78%, transparent);
  font-size: 0.75rem;
  backdrop-filter: blur(8px);
}

.attachment-matrix__stats b {
  color: var(--text-on-brand);
  font-size: 0.78rem;
}

.attachment-matrix__hero-action {
  position: relative;
  z-index: 1;
  display: flex;
  min-width: 220px;
  align-items: center;
  flex-direction: column;
  gap: 12px;
}

.attachment-matrix__hero-icon {
  display: grid;
  width: 74px;
  height: 74px;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--text-on-brand) 20%, transparent);
  border-radius: 24px;
  background: color-mix(in srgb, var(--text-on-brand) 10%, transparent);
  color: var(--text-on-brand);
  transform: rotate(4deg);
  backdrop-filter: blur(12px);
}

.attachment-matrix__hero-icon svg {
  width: 34px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}

.matrix-save-button {
  display: inline-flex;
  min-width: 210px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 20px;
  border: 0;
  border-radius: 14px;
  background: var(--text-on-brand);
  color: var(--brand-secondary-900);
  cursor: pointer;
  font-weight: 850;
  box-shadow: 0 14px 28px color-mix(in srgb, var(--brand-secondary-900) 35%, transparent);
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    opacity 180ms ease;
}

.matrix-save-button:hover:not(:disabled) {
  box-shadow: 0 18px 34px color-mix(in srgb, var(--brand-secondary-900) 45%, transparent);
  transform: translateY(-2px);
}

.matrix-save-button:disabled {
  cursor: wait;
  opacity: 0.65;
}

.matrix-save-button svg {
  width: 19px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.matrix-save-button__spinner {
  width: 18px;
  height: 18px;
  border: 2px solid color-mix(in srgb, currentColor 24%, transparent);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: matrix-spin 700ms linear infinite;
}

.attachment-matrix__hero-action small {
  max-width: 190px;
  color: color-mix(in srgb, var(--text-on-brand) 58%, transparent);
  font-size: 0.68rem;
  line-height: 1.45;
  text-align: center;
}

.attachment-matrix__groups {
  display: grid;
  gap: 22px;
}

.matrix-group {
  --group-color: var(--identity-primary);
  position: relative;
  overflow: hidden;
  padding: clamp(20px, 3vw, 30px);
  border: 1px solid color-mix(in srgb, var(--group-color) 18%, var(--surface-3));
  border-radius: var(--matrix-radius);
  background:
    linear-gradient(
      120deg,
      color-mix(in srgb, var(--group-color) 5%, var(--surface-1)),
      var(--surface-1) 45%
    ),
    var(--surface-1);
  box-shadow: 0 14px 42px color-mix(in srgb, var(--text-strong) 7%, transparent);
}

.matrix-group[data-group='y'] {
  --group-color: var(--identity-accent);
}

.matrix-group[data-group='z'] {
  --group-color: var(--status-success);
}

.matrix-group::before {
  position: absolute;
  width: 5px;
  border-radius: 0 5px 5px 0;
  background: linear-gradient(
    var(--group-color),
    color-mix(in srgb, var(--group-color) 38%, transparent)
  );
  content: '';
  inset: 26px auto 26px 0;
}

[dir='rtl'] .matrix-group::before {
  border-radius: 5px 0 0 5px;
  inset: 26px 0 26px auto;
}

.matrix-group__watermark {
  position: absolute;
  inset: -34px 28px auto auto;
  color: color-mix(in srgb, var(--group-color) 5%, transparent);
  font-size: 11rem;
  font-weight: 950;
  line-height: 1;
  pointer-events: none;
  text-transform: uppercase;
}

[dir='rtl'] .matrix-group__watermark {
  inset: -34px auto auto 28px;
}

.matrix-group__header {
  position: relative;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.matrix-group__title {
  gap: 16px;
}

.matrix-group__symbol {
  display: grid;
  width: 58px;
  height: 58px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--group-color) 18%, transparent);
  border-radius: 18px;
  background: color-mix(in srgb, var(--group-color) 11%, var(--surface-1));
  color: var(--group-color);
  font-size: 1.25rem;
  font-weight: 900;
  box-shadow: inset 0 0 0 5px color-mix(in srgb, var(--group-color) 3%, transparent);
}

.matrix-group__title small {
  color: var(--group-color);
  font-size: 0.65rem;
  font-weight: 850;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.matrix-group h2 {
  margin: 3px 0;
  color: var(--text-strong);
  font-size: 1.25rem;
}

.matrix-group p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.84rem;
}

.matrix-group__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.matrix-group__count {
  display: inline-flex;
  align-items: baseline;
  gap: 5px;
  color: var(--text-muted);
  font-size: 0.72rem;
}

.matrix-group__count b {
  color: var(--text-strong);
  font-size: 1rem;
}

.matrix-group__attachments {
  position: relative;
}

.attachment-slot {
  position: relative;
  min-width: 0;
  padding: 14px;
  border: 1px solid color-mix(in srgb, var(--text-muted) 15%, transparent);
  border-radius: 18px;
  background: color-mix(in srgb, var(--surface-2) 84%, transparent);
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
}

.attachment-slot:hover {
  border-color: color-mix(in srgb, var(--group-color) 36%, transparent);
  box-shadow: 0 14px 26px color-mix(in srgb, var(--group-color) 9%, transparent);
  transform: translateY(-2px);
}

.attachment-slot--filled {
  border-color: color-mix(in srgb, var(--group-color) 30%, transparent);
}

.attachment-slot--multiple {
  padding: 18px;
}

:deep(.file-upload-wrapper) {
  gap: 10px;
}

:deep(.file-upload-wrapper .upload-label) {
  overflow: hidden;
  color: var(--text-strong);
  font-size: 0.78rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.report-file-input) {
  min-height: 150px;
  border: 1.5px dashed color-mix(in srgb, var(--group-color) 34%, var(--surface-3));
  border-radius: 14px;
  background:
    radial-gradient(
      circle at 50% 0,
      color-mix(in srgb, var(--group-color) 10%, transparent),
      transparent 55%
    ),
    var(--surface-1);
  transition:
    border-color 180ms ease,
    background 180ms ease,
    transform 180ms ease;
}

:deep(.report-file-input:hover:not(.disabled)) {
  border-color: var(--group-color);
  background: color-mix(in srgb, var(--group-color) 7%, var(--surface-1));
  transform: scale(1.008);
}

:deep(.report-file-input .upload-icon) {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border-radius: 12px;
  background: color-mix(in srgb, var(--group-color) 11%, var(--surface-1));
  color: var(--group-color);
  font-size: 1.2rem;
  font-weight: 700;
}

:deep(.preview-grid) {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(105px, 1fr));
  gap: 8px;
}

:deep(.preview-item) {
  width: 100%;
  height: 105px;
  border-radius: 12px;
}

.attachment-slot__hint {
  margin: 12px 2px 0;
  color: var(--text-muted);
  font-size: 0.7rem;
  line-height: 1.5;
}

.attachment-matrix__feedback {
  position: sticky;
  z-index: 5;
  bottom: 18px;
  margin: 0 auto;
  padding: 13px 18px;
  border: 1px solid color-mix(in srgb, var(--status-success) 22%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, var(--status-success) 9%, var(--surface-1));
  color: var(--text-strong);
  font-size: 0.82rem;
  font-weight: 750;
  box-shadow: 0 12px 30px color-mix(in srgb, var(--text-strong) 12%, transparent);
}

.attachment-matrix__feedback--error {
  border-color: color-mix(in srgb, var(--status-danger) 22%, transparent);
  background: color-mix(in srgb, var(--status-danger) 9%, var(--surface-1));
  color: var(--status-danger);
}

.attachment-matrix__loading {
  display: grid;
  gap: 18px;
}

.attachment-matrix__loading span {
  height: 190px;
  border-radius: var(--matrix-radius);
  background: linear-gradient(90deg, var(--surface-2), var(--surface-3), var(--surface-2));
  background-size: 220% 100%;
  animation: matrix-shimmer 1.5s infinite linear;
}

@keyframes matrix-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes matrix-shimmer {
  to {
    background-position: -220% 0;
  }
}

@media (max-width: 820px) {
  .attachment-matrix__header,
  .matrix-group__header {
    align-items: stretch;
    flex-direction: column;
  }

  .attachment-matrix__header {
    min-height: 0;
  }

  .attachment-matrix__hero-action {
    align-items: stretch;
  }

  .attachment-matrix__hero-icon,
  .attachment-matrix__hero-action small {
    display: none;
  }

  .matrix-group__actions {
    justify-content: space-between;
  }
}

@media (max-width: 520px) {
  .attachment-matrix {
    padding: 0;
  }

  .attachment-matrix__header,
  .matrix-group {
    border-radius: 20px;
  }

  .attachment-matrix__stats {
    gap: 6px;
  }

  .attachment-matrix__stats > span {
    padding: 7px 9px;
  }

  .matrix-group__title {
    align-items: flex-start;
  }

  .matrix-group__symbol {
    width: 48px;
    height: 48px;
    border-radius: 15px;
  }

  .matrix-group__actions {
    align-items: stretch;
    flex-direction: column;
  }
}

@media (prefers-reduced-motion: reduce) {
  .matrix-save-button,
  .attachment-slot,
  :deep(.report-file-input) {
    transition: none;
  }

  .matrix-save-button__spinner,
  .attachment-matrix__loading span {
    animation: none;
  }
}
</style>
