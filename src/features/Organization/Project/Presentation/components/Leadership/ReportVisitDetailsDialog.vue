<script setup lang="ts">
import Dialog from 'primevue/dialog'
import type LeadershipVisitDetailsModel from '../../../Data/models/Leadership/LeadershipVisitDetailsModel'

import Image from 'primevue/image';

defineProps<{
  visible: boolean
  visit: LeadershipVisitDetailsModel | null
  loading: boolean
  error?: string
}>()
const emit = defineEmits<{ close: [] }>()

const unsafeTypeLabel = (value: number | null) => {
  if (value === 1) return 'Unsafe act'
  if (value === 2) return 'Unsafe condition'
  return '—'
}

const isImage = (url: string) => /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(url)
const mediaName = (url: string, index: number) =>
  url.split('/').pop()?.split('?')[0] || `Media ${index + 1}`
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    dismissable-mask
    :style="{ width: 'min(920px, 96vw)' }"
    class="report-details-dialog"
    @update:visible="(visible: boolean) => !visible && emit('close')"
  >
    <template #header>
      <div class="details-heading">
        <!-- <span class="details-heading__icon" aria-hidden="true">✓</span> -->
        <div>
          <!-- <span>Leadership visit</span> -->
          <h2>Report details</h2>
          <p v-if="visit">Report #{{ visit.id }} · {{ visit.date || '—' }}</p>
          <p v-else>{{ loading ? 'Loading selected visit…' : 'Selected visit report' }}</p>
        </div>
      </div>
    </template>

    <div v-if="loading" class="details-feedback" role="status">
      <span class="loading-spinner" aria-hidden="true"></span>
      <div>
        <strong>Loading report details</strong>
        <p>Retrieving the latest leadership visit report…</p>
      </div>
    </div>

    <div v-else-if="error" class="details-feedback details-feedback--error" role="alert">
      <span aria-hidden="true">!</span>
      <div>
        <strong>Unable to load report</strong>
        <p>{{ error }}</p>
      </div>
    </div>

    <div v-else-if="visit" class="details-content">
      <section class="summary-grid">
        <article>
          <span>Topic</span>
          <p>{{ visit.engagementTopic || '—' }}</p>
        </article>
        <article>
          <span>Discussion</span>
          <p>{{ visit.engagementDiscussion || '—' }}</p>
        </article>
        <article class="summary-grid__wide">
          <span>Observations</span>
          <p>{{ visit.positiveObservations || '—' }}</p>
        </article>
      </section>

      <section class="details-section"> 
        <div class="details-section__heading">
          <div>
            <span>Actions</span>
            <h3>Improvements</h3>
          </div>
          <strong>{{ visit.areasOfImprovement.length }}</strong>
        </div>
        <div v-if="visit.areasOfImprovement.length" class="improvement-grid">
          <article
            v-for="(improvement, index) in visit.areasOfImprovement"
            :key="improvement.id || index"
            class="improvement-detail"
          >
            <div class="improvement-detail__top">
              <span>{{ String(index + 1).padStart(2, '0') }}</span>
              <strong>{{ improvement.areaForImprovement || 'Improvement' }}</strong>
              <small>{{ unsafeTypeLabel(improvement.uaUc) }}</small>
            </div>
            <p>{{ improvement.interventionCarriedOut || '—' }}</p>
            <div class="detail-tags">
              <span>{{ improvement.leadershipTheme?.title || 'No theme' }}</span>
              <span>{{ improvement.leadershipCategory?.title || 'No category' }}</span>
            </div>
          </article>
        </div>
        <p v-else class="empty-copy">No improvement details were returned.</p>
      </section>

      <section class="details-section">
        <div class="details-section__heading">
          <div>
            <span>Attachments</span>
            <!-- <h3>Media</h3> -->
          </div>
          <strong>{{ visit.media.length }}</strong>
        </div>
        <div v-if="visit.media.length" class="media-grid">

          
          <div
            v-for="(media, index) in visit.media"
            :key="`${media}-${index}`"

            class="media-item"
          >
           <Image v-if="isImage(media)" :src="media" :alt="mediaName(media, index)" width="250" preview />
            <!-- <img  :src="media" :alt="mediaName(media, index)" /> -->
            <!-- <span v-else class="media-item__file" aria-hidden="true">▤</span>
            <span>{{ mediaName(media, index) }}</span> -->
        </div>
        </div>
        <p v-else class="empty-copy">No media attached to this report.</p>
      </section>
    </div>

    <div v-else class="details-unavailable">
      <span aria-hidden="true">i</span>
      <div>
        <strong>Report saved</strong>
        <p>The visit is marked as reported, but the API response did not include its details.</p>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
:deep(.report-details-dialog) {
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 18%, var(--main-border));
  border-radius: 22px;
  background: var(--surface-1);
  box-shadow: 0 30px 80px color-mix(in srgb, var(--text-strong) 20%, transparent);
}

:deep(.report-details-dialog .p-dialog-header) {
  padding: 22px 26px;
  border-bottom: 1px solid var(--main-border);
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--PrimaryColor) 9%, var(--surface-1)),
    var(--surface-1)
  );
}

:deep(.report-details-dialog .p-dialog-content) {
  padding: clamp(18px, 3vw, 28px);
  background: color-mix(in srgb, var(--surface-2) 68%, var(--surface-1));
}

.details-heading {
  display: flex;
  align-items: center;
  gap: 14px;
}

.details-heading__icon {
  display: grid;
  place-items: center;
  width: 50px;
  height: 50px;
  flex: none;
  border-radius: 15px;
  color: var(--text-on-brand);
  background: linear-gradient(145deg, var(--status-success), var(--brand-primary-700));
  font-size: 1.25rem;
  font-weight: 900;
}

.details-heading span,
.details-section__heading span,
.summary-grid article > span {
  color: var(--PrimaryColor);
  font-size: 0.7rem;
  font-weight: 850;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.details-heading h2,
.details-section__heading h3 {
  margin: 3px 0;
  color: var(--text-strong);
}

.details-heading p,
.summary-grid p,
.improvement-detail p,
.details-feedback p,
.details-unavailable p,
.empty-copy {
  margin: 0;
  color: var(--text-soft);
  line-height: 1.6;
}

.details-content {
  display: grid;
  gap: 18px;
}

.details-feedback {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 120px;
  padding: 20px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 18%, var(--main-border));
  border-radius: 15px;
  background: var(--surface-1);
}

.details-feedback > span {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  flex: none;
  border-radius: 50%;
  color: var(--text-on-brand);
  background: var(--PrimaryColor);
  font-weight: 900;
}

.details-feedback strong {
  color: var(--text-strong);
}

.details-feedback--error {
  border-color: color-mix(in srgb, var(--status-danger) 28%, var(--main-border));
  background: var(--status-danger-soft);
}

.details-feedback--error > span {
  background: var(--status-danger);
}

.loading-spinner {
  border: 3px solid color-mix(in srgb, white 35%, transparent);
  border-top-color: white;
  animation: report-details-spin 0.8s linear infinite;
}

@keyframes report-details-spin {
  to {
    transform: rotate(360deg);
  }
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.summary-grid article,
.details-section {
  padding: 18px;
  border: 1px solid var(--main-border);
  border-radius: 16px;
  background: var(--surface-1);
}

.summary-grid article {
  display: grid;
  gap: 8px;
}

.summary-grid__wide {
  grid-column: 1 / -1;
}

.details-section {
  display: grid;
  gap: 14px;
}

.details-section__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.details-section__heading strong {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 10%, var(--surface-1));
}

.improvement-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.improvement-detail {
  display: grid;
  gap: 12px;
  padding: 15px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 14%, var(--main-border));
  border-radius: 14px;
  background: color-mix(in srgb, var(--surface-2) 58%, var(--surface-1));
}

.improvement-detail__top {
  display: flex;
  align-items: center;
  gap: 9px;
}

.improvement-detail__top > span {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  color: var(--text-on-brand);
  background: var(--PrimaryColor);
  font-size: 0.7rem;
  font-weight: 850;
}

.improvement-detail__top strong {
  min-width: 0;
  color: var(--text-strong);
}

.improvement-detail__top small {
  margin-inline-start: auto;
  color: var(--status-danger);
  font-weight: 750;
}

.detail-tags,
.attachment-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.detail-tags span,
.attachment-grid a {
  padding: 7px 10px;
  border-radius: 9px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 8%, var(--surface-1));
  font-size: 0.75rem;
  font-weight: 750;
  text-decoration: none;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

.media-item {
  display: grid;
  gap: 7px;
  min-width: 0;
  color: var(--text-soft);
  font-size: 0.75rem;
  text-decoration: none;
}

.media-item img,
.media-item__file {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100px;
  overflow: hidden;
  border: 1px solid var(--main-border);
  border-radius: 10px;
  background: var(--surface-2);
  object-fit: cover;
}

.media-item__file {
  color: var(--PrimaryColor);
  font-size: 1.5rem;
}

.media-item > span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.details-unavailable {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  border: 1px dashed color-mix(in srgb, var(--PrimaryColor) 28%, var(--main-border));
  border-radius: 15px;
  background: color-mix(in srgb, var(--PrimaryColor) 5%, var(--surface-1));
}

.details-unavailable > span {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  flex: none;
  border-radius: 12px;
  color: var(--text-on-brand);
  background: var(--PrimaryColor);
  font-weight: 900;
}

.details-unavailable strong {
  color: var(--text-strong);
}

@media (max-width: 640px) {
  .summary-grid,
  .improvement-grid {
    grid-template-columns: 1fr;
  }

  .summary-grid__wide {
    grid-column: auto;
  }
}
</style>
