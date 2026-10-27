<script setup lang="ts">
import { translate as localizeUi } from '@/localization/i18n'

import '../../../styles/project.css'

import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import type LeadershipVisitDetailsModel from '../../../Data/models/Leadership/LeadershipVisitDetailsModel'

import Image from 'primevue/image'

defineProps<{
  visible: boolean
  visit: LeadershipVisitDetailsModel | null
  loading: boolean
  error?: string
}>()
const emit = defineEmits<{ close: [] }>()
const reportContent = ref<HTMLElement | null>(null)
const printing = ref(false)
const printError = ref('')

const printReport = async () => {
  if (!reportContent.value || printing.value) return
  printing.value = true
  printError.value = ''
  const frame = document.createElement('iframe')
  frame.title = 'Printable leadership visit report'
  frame.setAttribute('aria-hidden', 'true')
  frame.tabIndex = -1
  frame.style.cssText = 'position:fixed;left:-10000px;top:0;width:900px;height:1px;border:0;'
  try {
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((style) => style.outerHTML)
      .join('')
    const loaded = new Promise<void>((resolve, reject) => {
      frame.onload = () => resolve()
      frame.onerror = () => reject(new Error(localizeUi('Unable to prepare report')))
    })
    frame.srcdoc = `<!doctype html><html><head><meta charset="utf-8">${styles}
      <style>
        @page { size: A4; margin: 14mm; }
        html, body { margin: 0; background: white; color: #172c40; }
        body { padding: 0; font-family: Arial, sans-serif; }
        .print-report { color-scheme: light; --hse-project-ink: #172c40;
          --hse-project-muted: #526577; --hse-project-surface: #fff;
          --hse-project-surface-soft: #f3f7fa; --hse-project-line: #dce4eb;
          --hse-project-blue: #176b8c; --hse-project-on-primary: #fff;
          --hse-project-red: #b33d42; }
        * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .details-content { display: block !important; }
        .details-content > * { margin-bottom: 16px; }
        .report-cover { display: block !important; }
        .report-cover, .summary-grid article, .improvement-detail, .media-item {
          break-inside: avoid; }
        .details-section { display: block !important; }
        .details-section__heading { break-after: avoid; margin-bottom: 14px; }
        .improvement-grid { display: block !important; }
        .improvement-detail { margin-bottom: 12px; }
        .media-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        .media-item img { height: auto !important; max-height: 240px; object-fit: contain !important; }
        .p-image-preview-mask, .p-image-mask { display: none !important; }
        a { color: inherit; overflow-wrap: anywhere; }
      </style></head><body><main class="hse-project-root hse-project-assurance print-report"
      dir="${reportContent.value.closest('[dir]')?.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr'}">
      ${reportContent.value.outerHTML}</main></body></html>`
    document.body.appendChild(frame)
    await loaded
    const printWindow = frame.contentWindow
    if (!printWindow) throw new Error(localizeUi('Unable to open print preview'))
    printWindow.document.title = localizeUi('navigationLabels.report_visit')
    printWindow.document.documentElement.lang = document.documentElement.lang
    printWindow.document.documentElement.dir = getComputedStyle(reportContent.value).direction
    await printWindow.document.fonts.ready
    printWindow.addEventListener('afterprint', () => frame.remove(), { once: true })
    printWindow.focus()
    printWindow.print()
    // Some browsers do not emit afterprint for embedded documents.
    window.setTimeout(() => frame.remove(), 60_000)
  } catch {
    frame.remove()
    printError.value = localizeUi('Unable to prepare the report. Please try printing again.')
  } finally {
    printing.value = false
  }
}

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
    data-hse-project
    :dir="$i18n.locale.startsWith('ar') ? 'rtl' : 'ltr'"
    :visible="visible"
    modal
    dismissable-mask
    :style="{ width: 'min(920px, 96vw)' }"
    class="hse-project-root hse-project-assurance hse-project-overlay report-details-dialog"
    @update:visible="(visible: boolean) => !visible && emit('close')"
  >
    <template #header>
      <div class="details-toolbar">
        <div class="details-heading">
          <span class="details-heading__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <path d="M6 3h9l3 3v15H6zM14 3v5h4M9 12h6M9 16h4" />
            </svg>
          </span>
          <div>
            <span>{{ $t('Leadership engagement') }}</span>
            <h2>{{ $t('Visit report') }}</h2>
            <p>{{ $t('Insights, actions & evidence') }}</p>
          </div>
        </div>
        <button
          type="button"
          class="report-print-button"
          :disabled="!visit || loading || !!error || printing"
          @click="printReport"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            aria-hidden="true"
          >
            <path d="M7 8V3h10v5M7 17H4V9h16v8h-3M7 14h10v7H7zM16 11h1" />
          </svg>
          {{ printing ? $t('Preparing…') : $t('Print report') }}
        </button>
      </div>
    </template>

    <p v-if="printError" class="print-error" role="alert">{{ printError }}</p>

    <div v-if="loading" class="details-feedback" role="status">
      <span class="loading-spinner" aria-hidden="true"></span>
      <div>
        <strong>{{ $t('Loading report details') }}</strong>
        <p>{{ $t('Retrieving the latest leadership visit report…') }}</p>
      </div>
    </div>

    <div v-else-if="error" class="details-feedback details-feedback--error" role="alert">
      <span aria-hidden="true">!</span>
      <div>
        <strong>{{ $t('Unable to load report') }}</strong>
        <p>{{ error }}</p>
      </div>
    </div>

    <div v-else-if="visit" ref="reportContent" class="details-content">
      <header class="report-cover">
        <div class="report-cover__intro">
          <span class="report-eyebrow">{{ $t('HSE / LEADERSHIP ENGAGEMENT') }}</span>
          <h2>{{ $t('Leadership in action.') }}</h2>
          <p>{{ $t('A record of engagement, observations and opportunities to improve.') }}</p>
        </div>
        <div class="report-meta">
          <div>
            <span>{{ $t('Report reference') }}</span
            ><strong>{{
              visit.serial_name || visit.serial || $t('uiDynamic.reportReference', { p0: visit.id })
            }}</strong>
          </div>
          <div>
            <span>{{ $t('Visit Date') }}</span
            ><strong>{{ visit.date || '—' }}</strong>
          </div>
          <div>
            <span>{{ $t('Improvements') }}</span
            ><strong>{{ String(visit.areasOfImprovement.length).padStart(2, '0') }}</strong>
          </div>
          <div>
            <span>{{ $t('Attachments') }}</span
            ><strong>{{ String(visit.media.length).padStart(2, '0') }}</strong>
          </div>
        </div>
      </header>
      <div class="report-section-title">
        <span>01</span>
        <h3>{{ $t('Engagement & observations') }}</h3>
      </div>
      <section class="summary-grid">
        <article>
          <span>{{ $t('topic') }}</span>
          <p>{{ visit.engagementTopic || '—' }}</p>
        </article>
        <article>
          <span>{{ $t('Discussion') }}</span>
          <p>{{ visit.engagementDiscussion || '—' }}</p>
        </article>
        <article class="summary-grid__wide">
          <span>{{ $t('Positive observations') }}</span>
          <p>{{ visit.positiveObservations || '—' }}</p>
        </article>
      </section>

      <section class="details-section">
        <div class="details-section__heading">
          <div>
            <span>{{ $t('02 / ACTIONS & FOLLOW-UP') }}</span>
            <h3>{{ $t('Opportunities for improvement') }}</h3>
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
              <strong>{{ improvement.areaForImprovement || $t('Improvement') }}</strong>
              <small>{{ unsafeTypeLabel(improvement.uaUc) }}</small>
            </div>
            <div class="intervention">
              <span>{{ $t('Intervention carried out') }}</span>
              <p>{{ improvement.interventionCarriedOut || '—' }}</p>
            </div>
            <div class="detail-tags">
              <span>{{ improvement.leadershipTheme?.title || $t('No theme') }}</span>
              <span>{{ improvement.leadershipCategory?.title || $t('No category') }}</span>
            </div>
          </article>
        </div>
        <p v-else class="empty-copy">{{ $t('No improvement details were returned.') }}</p>
      </section>

      <section class="details-section">
        <div class="details-section__heading">
          <div>
            <span>{{ $t('03 / EVIDENCE') }}</span>
            <h3>{{ $t('Attachments & field notes') }}</h3>
          </div>
          <strong>{{ visit.media.length }}</strong>
        </div>
        <div v-if="visit.media.length" class="media-grid">
          <div v-for="(media, index) in visit.media" :key="`${media}-${index}`" class="media-item">
            <Image
              v-if="isImage(media)"
              :src="media"
              :alt="mediaName(media, index)"
              width="250"
              preview
            />
            <a v-else :href="media" target="_blank" rel="noopener noreferrer" class="media-file">
              <span class="media-item__file" aria-hidden="true">↗</span>
              {{ $t('Open attachment') }}
            </a>
            <span>{{ mediaName(media, index) }}</span>
          </div>
        </div>
        <p v-else class="empty-copy">{{ $t('No media attached to this report.') }}</p>
      </section>
      <footer class="report-footer">
        <strong>{{ $t('Leadership engagement report') }}</strong
        ><span>{{ $t('Report #') }}{{ visit.id }} {{ $t('· Visit #') }}{{ visit.visitId }}</span>
      </footer>
    </div>

    <div v-else class="details-unavailable">
      <span aria-hidden="true">i</span>
      <div>
        <strong>{{ $t('Report saved') }}</strong>
        <p>
          {{
            $t('The visit is marked as reported, but the API response did not include its details.')
          }}
        </p>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
.details-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  width: 100%;
}
.details-heading__icon svg {
  width: 27px;
  height: 27px;
}
.report-print-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 11px 17px;
  border: 0;
  border-radius: 10px;
  background: var(--hse-project-blue);
  color: var(--hse-project-on-primary);
  font: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  flex-shrink: 0;
}
.report-print-button svg {
  width: 19px;
  height: 19px;
}
.report-print-button:hover {
  filter: brightness(0.92);
}
.report-print-button:focus-visible {
  outline: 3px solid var(--hse-project-blue);
  outline-offset: 3px;
}
.report-print-button:disabled {
  opacity: 0.5;
  cursor: default;
}
.print-error {
  color: var(--hse-project-red);
}
.report-cover {
  display: none;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--hse-project-line);
  border-radius: 16px;
  background: var(--hse-project-surface);
}
.report-cover__intro {
  padding: 30px;
  border-inline-start: 5px solid #57c5b0;
  background: linear-gradient(120deg, #122e45, #1b5971);
  color: white;
}
.report-eyebrow {
  font-size: 0.65rem;
  letter-spacing: 0.17em;
  font-weight: 700;
  color: #b5e9e3;
}
.details-content .report-cover .report-cover__intro h2 {
  margin: 12px 0 8px;
  font-size: clamp(1.6rem, 4vw, 2.2rem);
  line-height: 1.15;
  color: white;
  letter-spacing: -0.04em;
}
.report-cover__intro p {
  margin: 0;
  max-width: 420px;
  color: #d4e6ee;
  font-size: 0.85rem;
  line-height: 1.7;
}
.report-meta {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr 1fr;
  gap: 16px;
  padding: 20px 26px;
}
.report-meta div {
  display: grid;
  align-content: start;
  gap: 6px;
  min-width: 0;
}
.report-meta span {
  color: var(--hse-project-muted);
  font-size: 0.7rem;
}
.report-meta strong {
  color: var(--hse-project-ink);
  font-size: 0.9rem;
  overflow-wrap: anywhere;
}
.report-section-title {
  display: flex;
  align-items: center;
  gap: 10px;
}
.report-section-title > span {
  font-size: 0.7rem;
  font-weight: 800;
  color: var(--hse-project-blue);
  border: 1px solid var(--hse-project-line);
  border-radius: 50%;
  padding: 8px;
}
.report-section-title h3 {
  font-size: 1rem;
  margin: 0;
  color: var(--hse-project-ink);
}
.summary-grid p,
.intervention p {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.summary-grid__wide {
  border-inline-start: 3px solid #299e87 !important;
}
.intervention > span {
  display: block;
  margin-bottom: 5px;
  color: var(--hse-project-muted);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.improvement-detail__top {
  flex-wrap: wrap;
}
.improvement-detail__top > span {
  flex-shrink: 0;
}
.improvement-detail__top strong {
  overflow-wrap: anywhere;
}
.media-item :deep(.p-image) {
  width: 100%;
}
.media-file {
  display: grid;
  gap: 8px;
  color: var(--hse-project-blue);
  text-decoration: none;
}
.report-footer {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  border-top: 1px solid var(--hse-project-line);
  padding-top: 16px;
  color: var(--hse-project-muted);
  font-size: 0.7rem;
}
@media (max-width: 640px) {
  .details-toolbar {
    flex-wrap: wrap;
  }
  .details-heading__icon {
    display: none !important;
  }
  .report-meta {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: 18px;
  }
  .report-cover__intro {
    padding: 22px;
  }
  .report-footer {
    flex-direction: column;
    gap: 6px;
  }
}

:global(.report-details-dialog.hse-project-root.hse-project-assurance) {
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--hse-project-blue) 18%, var(--hse-project-line));
  border-radius: var(--hse-project-radius-panel);
  background: var(--hse-project-surface);
  box-shadow: 0 30px 80px color-mix(in srgb, var(--hse-project-ink) 20%, transparent);
}

:global(.report-details-dialog.hse-project-root.hse-project-assurance .p-dialog-header) {
  padding: 22px 26px;
  border-bottom: 1px solid var(--hse-project-line);
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--hse-project-blue) 9%, var(--hse-project-surface)),
    var(--hse-project-surface)
  );
}

:global(.report-details-dialog.hse-project-root.hse-project-assurance .p-dialog-content) {
  padding: clamp(18px, 3vw, 28px);
  background: color-mix(in srgb, var(--hse-project-surface-soft) 68%, var(--hse-project-surface));
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
  border-radius: var(--hse-project-radius-panel);
  color: var(--hse-project-on-primary);
  background: linear-gradient(145deg, var(--hse-project-green), var(--hse-project-navy2));
  font-size: 1.25rem;
  font-weight: 900;
}

.details-heading span,
.details-section__heading span,
.summary-grid article > span {
  color: var(--hse-project-blue);
  font-size: 0.7rem;
  font-weight: 850;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.report-details-dialog.hse-project-root .details-heading h2,
.details-section__heading h3 {
  margin: 3px 0;
  color: var(--hse-project-ink);
}

.report-details-dialog.hse-project-root .details-heading h2 {
  font-size: 1.15rem;
}

.details-heading p,
.summary-grid p,
.improvement-detail p,
.details-feedback p,
.details-unavailable p,
.empty-copy {
  margin: 0;
  color: var(--hse-project-muted);
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
  border: 1px solid color-mix(in srgb, var(--hse-project-blue) 18%, var(--hse-project-line));
  border-radius: var(--hse-project-radius-panel);
  background: var(--hse-project-surface);
}

.details-feedback > span {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  flex: none;
  border-radius: 50%;
  color: var(--hse-project-on-primary);
  background: var(--hse-project-blue);
  font-weight: 900;
}

.details-feedback strong {
  color: var(--hse-project-ink);
}

.details-feedback--error {
  border-color: color-mix(in srgb, var(--hse-project-red) 28%, var(--hse-project-line));
  background: var(--hse-project-red-soft);
}

.details-feedback--error > span {
  background: var(--hse-project-red);
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
  border: 1px solid var(--hse-project-line);
  border-radius: var(--hse-project-radius-panel);
  background: var(--hse-project-surface);
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
  border-radius: var(--hse-project-radius-control);
  color: var(--hse-project-blue);
  background: color-mix(in srgb, var(--hse-project-blue) 10%, var(--hse-project-surface));
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
  border: 1px solid color-mix(in srgb, var(--hse-project-blue) 14%, var(--hse-project-line));
  border-radius: var(--hse-project-radius-panel);
  background: color-mix(in srgb, var(--hse-project-surface-soft) 58%, var(--hse-project-surface));
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
  border-radius: var(--hse-project-radius-control);
  color: var(--hse-project-on-primary);
  background: var(--hse-project-blue);
  font-size: 0.7rem;
  font-weight: 850;
}

.improvement-detail__top strong {
  min-width: 0;
  color: var(--hse-project-ink);
}

.improvement-detail__top small {
  margin-inline-start: auto;
  color: var(--hse-project-red);
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
  border-radius: var(--hse-project-radius-control);
  color: var(--hse-project-blue);
  background: color-mix(in srgb, var(--hse-project-blue) 8%, var(--hse-project-surface));
  font-size: 0.75rem;
  font-weight: 750;
  text-decoration: none;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 10px;
}

.media-item {
  display: grid;
  gap: 7px;
  min-width: 0;
  color: var(--hse-project-muted);
  font-size: 0.75rem;
  text-decoration: none;
}

.media-item :deep(img),
.media-item__file {
  display: grid;
  place-items: center;
  width: 100%;
  height: 160px;
  overflow: hidden;
  border: 1px solid var(--hse-project-line);
  border-radius: var(--hse-project-radius-control);
  background: var(--hse-project-surface-soft);
  object-fit: cover;
}

.media-item__file {
  color: var(--hse-project-blue);
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
  border: 1px dashed color-mix(in srgb, var(--hse-project-blue) 28%, var(--hse-project-line));
  border-radius: var(--hse-project-radius-panel);
  background: color-mix(in srgb, var(--hse-project-blue) 5%, var(--hse-project-surface));
}

.details-unavailable > span {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  flex: none;
  border-radius: var(--hse-project-radius-control);
  color: var(--hse-project-on-primary);
  background: var(--hse-project-blue);
  font-weight: 900;
}

.details-unavailable strong {
  color: var(--hse-project-ink);
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
