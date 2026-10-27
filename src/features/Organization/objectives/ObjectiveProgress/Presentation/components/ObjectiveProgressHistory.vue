<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Image from 'primevue/image'
import {
  DataLoading,
  DataFailed,
  DataInitial,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import type ObjectivesDetailsModel from '../../../Data/models/objectivesDetailsModel'
import type History from '../../Data/models/objectiveProgressHistoryModel'
import { sortedHistory } from '../../Data/models/objectiveProgressHistoryModel'
import { safeAttachmentUrl, type ProgressMedia } from '../../Data/models/objectiveProgressModel'
import { generatePeriods, actualUnit } from '../../Core/utils/objectiveProgress'
import {
  supportsProgress,
  objectiveProgressContract as contract,
} from '../../Data/apiServices/objectiveProgressContract'
const props = defineProps<{
  objective: ObjectivesDetailsModel
  state: DataState<History>
  canUpdate: boolean
}>()
defineEmits<{ retry: [] }>()
const { locale } = useI18n()
const rows = computed(() => sortedHistory(props.state.data?.records ?? []))
const periodLabel = (value: string) =>
  generatePeriods(props.objective, locale.value, new Date(), contract.reportingFrequency).find(
    (period) => period.value === value,
  )?.label ?? value
const dateLabel = (value: string | null) =>
  value && Number.isFinite(new Date(value).getTime())
    ? new Intl.DateTimeFormat(locale.value, { dateStyle: 'medium', timeStyle: 'short' }).format(
        new Date(value),
      )
    : '—'
const validMedia = (media: ProgressMedia[]) =>
  media.flatMap((file) => {
    const url = safeAttachmentUrl(file.url)
    return url ? [{ ...file, url }] : []
  })
const fileExtension = (file: ProgressMedia) => {
  const path = (() => {
    try {
      return new URL(file.url).pathname
    } catch {
      return file.url
    }
  })()
  const extension = (file.fileName || path).split('.').pop()?.toUpperCase()
  return extension && extension.length <= 5 ? extension : 'FILE'
}
const isImage = (file: ProgressMedia) =>
  file.mimeType?.startsWith('image/') === true ||
  /\.(avif|bmp|gif|ico|jpe?g|png|svg|webp)$/i.test(
    (() => {
      try {
        return new URL(file.url).pathname
      } catch {
        return file.url
      }
    })(),
  )
</script>
<template>
  <section class="op-card">
    <div class="op-section-heading">
      <h2>{{ $t('op.history') }}</h2>
      <span v-if="supportsProgress('index')" class="op-badge">{{ rows.length }}</span>
    </div>
    <p v-if="!supportsProgress('index')" class="op-notice" role="status">
      {{ $t('op.historyUnavailable') }}
    </p>
    <TableLoader
      v-else-if="state instanceof DataLoading || state instanceof DataInitial"
      :cols="7"
      :rows="3"
    />
    <div v-else-if="state instanceof DataFailed" role="alert">
      <p>{{ $t('op.historyFailed') }}</p>
      <button type="button" class="op-button" @click="$emit('retry')">
        {{ $t('op.retry') }}
      </button>
    </div>
    <p v-else-if="!rows.length" class="op-empty">{{ $t('op.noHistory') }}</p>
    <div v-else class="op-table-scroll" tabindex="0" :aria-label="$t('op.history')">
      <table class="main-table op-table">
        <thead>
          <tr>
            <th
              v-for="key in [
                'period',
                'actual',
                'recordedBy',
                'recordedAt',
                'notes',
                'total_progress',
                'attachments',
                // 'corrections',
              ]"
              :key="key"
              scope="col"
            >
              {{ $t(`op.${key}`) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in rows" :key="record.id">
            <td>{{ periodLabel(record.period) }}</td>
            <td>
              {{ record.actualResult ?? '—' }}
              {{ record.actualResult !== null ? actualUnit(objective) : '' }}
            </td>
            <td>{{ record.createdBy?.name ?? record.recordedBy ?? '—' }}</td>
            <td>{{ dateLabel(record.createdAt ?? record.recordedAt) }}</td>
            <td class="op-notes">{{ record.notes || '—' }}</td>
            <td class="op-total">
              {{ record.progress ?? '—' }}{{ record.progress !== null ? '%' : '' }}
            </td>
            <td class="op-media-cell">
              <div v-if="validMedia(record.media).length" class="op-media-gallery">
                <template
                  v-for="file in validMedia(record.media)"
                  :key="`${record.id}-${file.id}-${file.url}`"
                >
                  <Image
                    v-if="isImage(file)"
                    :src="file.url"
                    :alt="file.fileName"
                    preview
                    image-class="op-media-thumbnail"
                  />
                  <a
                    v-else
                    class="op-file-tile"
                    :href="file.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    :title="file.fileName"
                    :aria-label="`${$t('op.openFile')}: ${file.fileName}`"
                  >
                    <span class="op-file-extension">{{ fileExtension(file) }}</span>
                    <span class="op-file-name">{{ file.fileName }}</span>
                  </a>
                </template>
                <span
                  class="op-media-count"
                  :aria-label="$t('uiDynamic.fileCount', { p0: validMedia(record.media).length })"
                >
                  {{ validMedia(record.media).length }}
                </span>
              </div>
              <span v-else>—</span>
            </td>
            <!-- <td>
              <ul v-if="record.attachments.length" class="op-files">
                <li v-for="file in record.attachments" :key="file.id">
                  <a
                    v-if="safeAttachmentUrl(file.url)"
                    :href="safeAttachmentUrl(file.url)!"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      v-if="file.mimeType?.startsWith('image/')"
                      :src="safeAttachmentUrl(file.url)!"
                      :alt="file.name"
                      loading="lazy"
                    />
                    {{ file.name }}
                  </a>
                  <span v-else>{{ file.name }}</span>
                </li>
              </ul>
              <span v-else>—</span>
            </td> -->
            <!-- <td>
              <details v-if="record.corrections.length">
                <summary>{{ $t('op.corrections') }} ({{ record.corrections.length }})</summary>
                <p v-for="(correction, index) in record.corrections" :key="index" class="op-notes">
                  {{ correction.recordedBy || '—' }} · {{ dateLabel(correction.recordedAt) }}<br />
                  {{ correction.notes || '—' }}
                </p>
              </details>
              <span v-else>—</span>
              <RouterLink
                v-if="canUpdate && supportsProgress('edit') && supportsProgress('details')"
                class="op-button"
                :to="{
                  name: 'organization-objectives-edit-progress',
                  params: { objectiveId: objective.id, progressId: record.id },
                }"
              >
                {{ $t('op.correct') }}
              </RouterLink>
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.op-media-cell {
  min-width: 220px;
}

.op-media-gallery {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 72px);
  gap: 8px;
  width: fit-content;
  max-width: 100%;
  padding: 7px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 14%, transparent);
  border-radius: var(--hse-control-radius, 9px);
  background: color-mix(in srgb, var(--brand-primary-50) 72%, var(--surface-1));
}

.op-media-gallery :deep(.p-image) {
  display: block;
  width: 72px;
  height: 72px;
  overflow: hidden;
  border: 2px solid var(--surface-1);
  border-radius: var(--hse-control-radius, 9px);
  box-shadow: 0 5px 14px color-mix(in srgb, var(--brand-primary-900) 12%, transparent);
}

.op-media-gallery :deep(.op-media-thumbnail) {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: zoom-in;
  transition:
    transform 160ms ease,
    filter 160ms ease;
}

.op-media-gallery :deep(.p-image:hover .op-media-thumbnail) {
  transform: scale(1.06);
  filter: saturate(1.08);
}

.op-media-gallery :deep(.p-image:focus-within) {
  outline: 2px solid var(--PrimaryColor);
  outline-offset: 2px;
}

.op-file-tile {
  display: flex;
  width: 72px;
  height: 72px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 7px;
  overflow: hidden;
  border: 2px solid var(--surface-1);
  border-radius: var(--hse-control-radius, 9px);
  background: linear-gradient(
    145deg,
    var(--surface-1),
    color-mix(in srgb, var(--brand-primary-50) 80%, var(--surface-1))
  );
  box-shadow: 0 5px 14px color-mix(in srgb, var(--brand-primary-900) 12%, transparent);
  color: var(--text-strong);
  text-decoration: none;
  transition:
    border-color 160ms ease,
    transform 160ms ease;
}

.op-file-tile:hover {
  border-color: color-mix(in srgb, var(--PrimaryColor) 42%, var(--surface-1));
  transform: translateY(-2px);
}

.op-file-tile:focus-visible {
  outline: 2px solid var(--PrimaryColor);
  outline-offset: 2px;
}

.op-file-extension {
  display: inline-flex;
  min-width: 38px;
  min-height: 23px;
  align-items: center;
  justify-content: center;
  padding-inline: 6px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--PrimaryColor) 12%, var(--surface-1));
  color: var(--PrimaryColor);
  font-size: 0.66rem;
  font-weight: 900;
  letter-spacing: 0.04em;
}

.op-file-name {
  display: block;
  width: 100%;
  overflow: hidden;
  color: var(--text-soft);
  font-size: 0.64rem;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.op-media-count {
  position: absolute;
  inset-block-start: -8px;
  inset-inline-end: -8px;
  display: inline-flex;
  min-width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  padding-inline: 6px;
  border: 2px solid var(--surface-1);
  border-radius: 999px;
  background: var(--PrimaryColor);
  color: var(--text-on-brand);
  font-size: 0.72rem;
  font-weight: 800;
}
</style>
