<script setup lang="ts">
import '../../../styles/project.css'

import { computed } from 'vue'
import Dialog from 'primevue/dialog'
import type RiskAssessmentModel from '../../../Data/models/RiskAssessment/RiskAssessmentModel'
import type RiskAssessmentMediaModel from '../../../Data/models/RiskAssessment/RiskAssessmentMediaModel'

const props = defineProps<{
  visible: boolean
  assessment: RiskAssessmentModel | null
  loading: boolean
  error?: string
}>()

const emit = defineEmits<{ close: [] }>()

const approverName = computed(() => props.assessment?.employeeApproverId?.name || '—')
const approverInitial = computed(() => approverName.value.charAt(0).toUpperCase() || 'A')

const isImage = (media: RiskAssessmentMediaModel) =>
  media.mimeType.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg)$/i.test(media.url)

const mediaName = (media: RiskAssessmentMediaModel, index: number) =>
  media.fileName || media.url.split('/').pop()?.split('?')[0] || `Attachment ${index + 1}`
</script>

<template>
  <Dialog
    data-hse-project
    :dir="$i18n.locale.startsWith('ar') ? 'rtl' : 'ltr'"
    :visible="visible"
    modal
    :dismissable-mask="true"
    :style="{ width: 'min(920px, 96vw)' }"
    class="hse-project-root hse-project-assurance hse-project-overlay risk-details-dialog"
    @update:visible="
      (value: boolean) => {
        if (!value) emit('close')
      }
    "
  >
    <template #header>
      <div class="dialog-heading">
        <span class="dialog-heading__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 3 4.5 6v5.2c0 4.6 3.1 8.2 7.5 9.8 4.4-1.6 7.5-5.2 7.5-9.8V6L12 3Z" />
            <path d="m8.5 12 2.2 2.2 4.8-5" />
          </svg>
        </span>
        <div>
          <span class="eyebrow">Risk assessment</span>
          <h2>{{ assessment?.activity || 'Assessment details' }}</h2>
          <p>Review the activity, approval, description, and supporting evidence.</p>
        </div>
      </div>
    </template>

    <div class="dialog-content">
      <div v-if="loading" class="dialog-loading" role="status">
        <span class="loading-spinner"></span>
        <div>
          <strong>Loading assessment details</strong><small>Retrieving the selected record…</small>
        </div>
      </div>

      <div v-else-if="error" class="dialog-error" role="alert">
        <span aria-hidden="true">!</span>
        <div>
          <strong>Unable to load details</strong><small>{{ error }}</small>
        </div>
      </div>

      <template v-else-if="assessment">
        <section class="overview-grid" aria-label="Assessment overview">
          <article>
            <span class="overview-icon" aria-hidden="true">⌖</span>
            <div>
              <small>Work area</small><strong>{{ assessment.workAreaStrign || '—' }}</strong>
            </div>
          </article>
          <article>
            <span class="overview-icon" aria-hidden="true">◷</span>
            <div>
              <small>Assessment date</small><strong>{{ assessment.date || '—' }}</strong>
            </div>
          </article>
          <article>
            <span class="overview-icon" aria-hidden="true">⌁</span>
            <div>
              <small>Attachments</small><strong>{{ assessment.media.length }}</strong>
            </div>
          </article>
        </section>

        <section class="detail-section approver-section">
          <div class="section-heading">
            <span class="section-number">01</span>
            <div>
              <h3>Created By</h3>
              <p>The employee responsible for this assessment.</p>
            </div>
          </div>
          <div class="approver-card">
            <span class="approver-avatar">{{ approverInitial }}</span>
            <div class="approver-copy">
              <strong>{{ approverName }}</strong>
              <span>{{ assessment.employeeApproverId?.email || 'No email available' }}</span>
            </div>
            <span v-if="assessment.employeeApproverId?.phone" class="approver-phone">
              {{ assessment.employeeApproverId.phone }}
            </span>
          </div>
        </section>

        <section class="detail-section">
          <div class="section-heading">
            <span class="section-number">02</span>
            <div>
              <h3>Activity description</h3>
              <p>Documented work, hazards, and controls.</p>
            </div>
          </div>
          <p class="description-text">{{ assessment.desctiprion || 'No description provided.' }}</p>
        </section>

        <section class="detail-section">
          <div class="section-heading">
            <span class="section-number">03</span>
            <div>
              <h3>Files attached to this assessment.</h3>
              <!-- <p>Files attached to this assessment.</p> -->
            </div>
            <span class="file-count">{{ assessment.media.length }} files</span>
          </div>

          <div v-if="assessment.media.length" class="media-grid">
            <a
              v-for="(media, index) in assessment.media"
              :key="media.id || `${media.url}-${index}`"
              :href="media.url"
              target="_blank"
              rel="noopener noreferrer"
              class="media-card"
            >
              <span class="media-preview">
                <img v-if="isImage(media)" :src="media.url" :alt="mediaName(media, index)" />
                <span v-else class="file-symbol" aria-hidden="true">▤</span>
              </span>
              <span class="media-copy">
                <strong>{{ mediaName(media, index) }}</strong>
                <small>{{ media.mimeType || 'Supporting file' }}</small>
              </span>
              <span class="open-icon" aria-hidden="true">↗</span>
            </a>
          </div>
          <div v-else class="media-empty">
            <span aria-hidden="true">⌁</span>
            <div>
              <strong>No attachments</strong
              ><small>No supporting media was added to this assessment.</small>
            </div>
          </div>
        </section>
      </template>
    </div>
  </Dialog>
</template>

<style scoped>
:deep(.risk-details-dialog) {
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--hse-project-blue) 18%, var(--hse-project-line));
  border-radius: var(--hse-project-radius-panel);
  background: var(--hse-project-surface);
  box-shadow: 0 30px 90px color-mix(in srgb, var(--hse-project-navy) 24%, transparent);
}
:deep(.risk-details-dialog .p-dialog-header) {
  position: relative;
  overflow: hidden;
  padding: 23px clamp(20px, 4vw, 32px);
  border-bottom: 1px solid color-mix(in srgb, var(--hse-project-blue) 14%, var(--hse-project-line));
  background:
    radial-gradient(
      circle at 88% 10%,
      color-mix(in srgb, var(--hse-project-blue) 17%, transparent),
      transparent 30%
    ),
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--hse-project-blue) 8%, var(--hse-project-surface)),
      var(--hse-project-surface)
    );
}
:deep(.risk-details-dialog .p-dialog-content) {
  padding: 0;
  background: color-mix(in srgb, var(--hse-project-surface-soft) 70%, var(--hse-project-surface));
}
:deep(.risk-details-dialog .p-dialog-close-button) {
  z-index: 1;
  border: 1px solid var(--hse-project-line);
  background: var(--hse-project-surface);
}

.dialog-heading {
  display: flex;
  align-items: center;
  gap: 15px;
}
.dialog-heading__icon {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  flex: none;
  border-radius: var(--hse-project-radius-panel);
  color: var(--hse-project-on-primary);
  background: linear-gradient(145deg, var(--hse-project-blue), var(--hse-project-navy2));
  box-shadow: 0 11px 25px color-mix(in srgb, var(--hse-project-blue) 25%, transparent);
}
.dialog-heading__icon svg {
  width: 28px;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.eyebrow {
  color: var(--hse-project-blue);
  font-size: 0.66rem;
  font-weight: 850;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.dialog-heading h2 {
  margin: 3px 0;
  color: var(--hse-project-ink);
  font-size: clamp(1.25rem, 3vw, 1.65rem);
}
.dialog-heading p {
  margin: 0;
  color: var(--hse-project-muted);
  font-size: 0.8rem;
}
.dialog-content {
  display: grid;
  gap: 16px;
  padding: clamp(18px, 3vw, 28px);
}

.dialog-loading,
.dialog-error {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 22px;
  border-radius: var(--hse-project-radius-panel);
}
.dialog-loading {
  border: 1px dashed color-mix(in srgb, var(--hse-project-blue) 25%, var(--hse-project-line));
  background: var(--hse-project-surface);
}
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid color-mix(in srgb, var(--hse-project-blue) 18%, transparent);
  border-top-color: var(--hse-project-blue);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.dialog-loading div,
.dialog-error div {
  display: grid;
  gap: 3px;
}
.dialog-loading strong,
.dialog-error strong {
  color: var(--hse-project-ink);
}
.dialog-loading small {
  color: var(--hse-project-muted);
}
.dialog-error {
  color: var(--hse-project-red);
  background: var(--hse-project-red-soft);
}
.dialog-error > span {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: var(--hse-project-radius-control);
  color: white;
  background: var(--hse-project-red);
  font-weight: 850;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 11px;
}
.overview-grid article {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 14px;
  border: 1px solid var(--hse-project-line);
  border-radius: var(--hse-project-radius-panel);
  background: var(--hse-project-surface);
}
.overview-icon {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  flex: none;
  border-radius: var(--hse-project-radius-control);
  color: var(--hse-project-blue);
  background: color-mix(in srgb, var(--hse-project-blue) 10%, var(--hse-project-surface));
}
.overview-grid article > div {
  display: grid;
  min-width: 0;
  gap: 3px;
}
.overview-grid small {
  color: var(--hse-project-muted);
  font-size: 0.68rem;
}
.overview-grid strong {
  overflow: hidden;
  color: var(--hse-project-ink);
  font-size: 0.82rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-section {
  display: grid;
  gap: 15px;
  padding: 19px;
  border: 1px solid var(--hse-project-line);
  border-radius: var(--hse-project-radius-panel);
  background: var(--hse-project-surface);
  box-shadow: 0 8px 22px color-mix(in srgb, var(--hse-project-navy) 4%, transparent);
}
.section-heading {
  display: flex;
  align-items: center;
  gap: 11px;
}
.section-number {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  flex: none;
  border-radius: var(--hse-project-radius-control);
  color: var(--hse-project-on-primary);
  background: linear-gradient(145deg, var(--hse-project-blue), var(--hse-project-navy2));
  font-size: 0.7rem;
  font-weight: 850;
}
.section-heading > div {
  display: grid;
  gap: 2px;
}
.section-heading h3 {
  margin: 0;
  color: var(--hse-project-ink);
  font-size: 0.95rem;
}
.section-heading p {
  margin: 0;
  color: var(--hse-project-muted);
  font-size: 0.72rem;
}
.file-count {
  margin-inline-start: auto;
  padding: 6px 9px;
  border-radius: 999px;
  color: var(--hse-project-blue);
  background: color-mix(in srgb, var(--hse-project-blue) 9%, var(--hse-project-surface));
  font-size: 0.68rem;
  font-weight: 800;
}

.approver-card {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 13px;
  border-radius: var(--hse-project-radius-panel);
  background: color-mix(in srgb, var(--hse-project-surface-soft) 68%, var(--hse-project-surface));
}
.approver-avatar {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  flex: none;
  border-radius: var(--hse-project-radius-control);
  color: var(--hse-project-blue);
  background: color-mix(in srgb, var(--hse-project-blue) 11%, var(--hse-project-surface));
  font-weight: 850;
}
.approver-copy {
  display: grid;
  min-width: 0;
  gap: 3px;
}
.approver-copy strong {
  color: var(--hse-project-ink);
}
.approver-copy span,
.approver-phone {
  color: var(--hse-project-muted);
  font-size: 0.72rem;
}
.approver-phone {
  margin-inline-start: auto;
  padding: 7px 10px;
  border-radius: var(--hse-project-radius-control);
  background: var(--hse-project-surface);
}
.description-text {
  margin: 0;
  color: var(--hse-project-muted);
  line-height: 1.7;
  white-space: pre-wrap;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.media-card {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
  padding: 11px;
  border: 1px solid var(--hse-project-line);
  border-radius: var(--hse-project-radius-control);
  color: var(--hse-project-ink);
  background: color-mix(in srgb, var(--hse-project-surface-soft) 65%, var(--hse-project-surface));
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.media-card:hover {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--hse-project-blue) 35%, var(--hse-project-line));
  box-shadow: 0 9px 20px color-mix(in srgb, var(--hse-project-navy) 6%, transparent);
}
.media-preview {
  display: grid;
  place-items: center;
  overflow: hidden;
  width: 46px;
  height: 46px;
  flex: none;
  border-radius: var(--hse-project-radius-control);
  color: var(--hse-project-blue);
  background: color-mix(in srgb, var(--hse-project-blue) 9%, var(--hse-project-surface));
}
.media-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.file-symbol {
  font-size: 1.3rem;
}
.media-copy {
  display: grid;
  min-width: 0;
  flex: 1;
  gap: 3px;
}
.media-copy strong,
.media-copy small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.media-copy strong {
  font-size: 0.78rem;
}
.media-copy small {
  color: var(--hse-project-muted);
  font-size: 0.66rem;
}
.open-icon {
  color: var(--hse-project-blue);
}
.media-empty {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 17px;
  border: 1px dashed var(--hse-project-line);
  border-radius: var(--hse-project-radius-panel);
  color: var(--hse-project-muted);
  background: var(--hse-project-surface-soft);
}
.media-empty > span {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: var(--hse-project-radius-control);
  color: var(--hse-project-blue);
  background: var(--hse-project-surface);
}
.media-empty div {
  display: grid;
  gap: 3px;
}
.media-empty strong {
  color: var(--hse-project-ink);
  font-size: 0.8rem;
}
.media-empty small {
  font-size: 0.7rem;
}

@media (max-width: 650px) {
  :deep(.risk-details-dialog .p-dialog-header) {
    padding: 18px;
  }
  .dialog-heading__icon {
    width: 48px;
    height: 48px;
    border-radius: var(--hse-project-radius-panel);
  }
  .dialog-heading p {
    display: none;
  }
  .overview-grid,
  .media-grid {
    grid-template-columns: 1fr;
  }
  .detail-section {
    padding: 16px;
  }
  .approver-card {
    align-items: flex-start;
    flex-wrap: wrap;
  }
  .approver-phone {
    margin-inline-start: 53px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .media-card {
    transition: none;
  }
}
.dialog-content {
  padding: 10px !important;
}
</style>
