<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
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
import { safeAttachmentUrl } from '../../Data/models/objectiveProgressModel'
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
            <td class="op-totla">{{ record.progress || '—' }}%</td>
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
