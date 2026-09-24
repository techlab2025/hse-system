<script setup lang="ts">
import Dialog from 'primevue/dialog'
import type LeadershipVisitModel from '../../../Data/models/Leadership/LeadershipVisitModel'

defineProps<{ visit: LeadershipVisitModel | null }>()
const emit = defineEmits<{ close: [] }>()

const unsafeTypeLabel = (value: string) => {
  if (value === '1') return 'Unsafe act'
  if (value === '2') return 'Unsafe condition'
  return value || '—'
}
</script>

<template>
  <Dialog
    :visible="Boolean(visit)"
    modal
    dismissable-mask
    :style="{ width: 'min(920px, 96vw)' }"
    class="report-details-dialog"
    @update:visible="(visible: boolean) => !visible && emit('close')"
  >
    <template #header>
      <div class="details-heading">
        <span class="details-heading__icon" aria-hidden="true">✓</span>
        <div>
          <span>Leadership visit</span>
          <h2>Report details</h2>
          <p>{{ visit?.location }} · {{ visit?.date }}</p>
        </div>
      </div>
    </template>

    <div v-if="visit?.report" class="details-content">
      <section class="summary-grid">
        <article>
          <span>Topic</span>
          <p>{{ visit.report.topic || '—' }}</p>
        </article>
        <article>
          <span>Discussion</span>
          <p>{{ visit.report.discussion || '—' }}</p>
        </article>
        <article class="summary-grid__wide">
          <span>Observations</span>
          <p>{{ visit.report.observations || '—' }}</p>
        </article>
      </section>

      <section class="details-section">
        <div class="details-section__heading">
          <div>
            <span>Actions</span>
            <h3>Improvements</h3>
          </div>
          <strong>{{ visit.report.improvements.length }}</strong>
        </div>
        <div v-if="visit.report.improvements.length" class="improvement-grid">
          <article
            v-for="(improvement, index) in visit.report.improvements"
            :key="improvement.id || index"
            class="improvement-detail"
          >
            <div class="improvement-detail__top">
              <span>{{ String(index + 1).padStart(2, '0') }}</span>
              <strong>{{ improvement.areas || 'Improvement' }}</strong>
              <small>{{ unsafeTypeLabel(improvement.uaUc) }}</small>
            </div>
            <p>{{ improvement.interventionCarriedOut || '—' }}</p>
            <div class="detail-tags">
              <span>{{ improvement.visitTheme?.title || 'No theme' }}</span>
              <span>{{ improvement.visitCategory?.title || 'No category' }}</span>
            </div>
          </article>
        </div>
        <p v-else class="empty-copy">No improvement details were returned.</p>
      </section>

      <section v-if="visit.report.attachments.length" class="details-section">
        <div class="details-section__heading">
          <div>
            <span>Evidence</span>
            <h3>Attachments</h3>
          </div>
          <strong>{{ visit.report.attachments.length }}</strong>
        </div>
        <div class="attachment-grid">
          <a
            v-for="(attachment, index) in visit.report.attachments"
            :key="`${attachment}-${index}`"
            :href="attachment"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span aria-hidden="true">↗</span> Attachment {{ index + 1 }}
          </a>
        </div>
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
