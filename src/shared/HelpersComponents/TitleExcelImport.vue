<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import * as XLSX from 'xlsx'
import IconDelete from '@/shared/icons/IconDelete.vue'

const props = defineProps<{ initialFile?: File | null }>()
const emit = defineEmits<{
  (event: 'imported', titles: string[]): void
}>()

const { t } = useI18n()
const titles = ref<string[]>([])
const errorMessage = ref('')
const isLoading = ref(false)

const parseFile = async (file?: File | null) => {
  titles.value = []
  errorMessage.value = ''
  if (!file) return

  isLoading.value = true
  try {
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
      header: 1,
      raw: false,
      defval: '',
      blankrows: false,
    })

    if (rows.length < 2) {
      errorMessage.value = 'The Excel file must contain a header and at least one row.'
      return
    }

    const headers = (rows[0] ?? []).map((value) => String(value).trim().toLowerCase())
    const titleIndex = Math.max(
      headers.findIndex((header) => header === 'title' || header.includes('title')),
      0,
    )
    titles.value = rows
      .slice(1)
      .map((row) => String(row?.[titleIndex] ?? '').trim())
      .filter(Boolean)

    if (!titles.value.length) {
      errorMessage.value = 'No titles were found in the Excel file.'
    }
  } catch {
    errorMessage.value = 'Failed to process the Excel file.'
  } finally {
    isLoading.value = false
  }
}

watch(() => props.initialFile, parseFile, { immediate: true })

const submit = () => {
  if (titles.value.length) emit('imported', titles.value)
}

const deleteRow = (rowIndex: number) => {
  titles.value = titles.value.filter((_, index) => index !== rowIndex)
}
</script>

<template>
  <div class="title-excel-import">
    <div v-if="isLoading" class="loading-bar">
      <span class="loading-dot" />
      <span class="loading-dot" />
      <span class="loading-dot" />
      <span class="loading-label">Processing file...</span>
    </div>
    <p v-else-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <template v-else-if="titles.length">
      <div class="table-container">
        <div class="table-header">
          <h3 class="table-title">{{ t('mapped_data_preview') }}</h3>
          <span class="table-badge">{{ t('row_count', { count: titles.length }) }}</span>
        </div>
        <div class="table-responsive">
          <table class="main-table">
            <thead>
              <tr>
                <th>{{ t('title') }}</th>
                <th class="last"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(title, index) in titles" :key="title + '-' + index">
                <td>{{ title }}</td>
                <td>
                  <button
                    type="button"
                    class="btn-delete-row"
                    :title="t('delete_row')"
                    @click="deleteRow(index)"
                  >
                    <IconDelete />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <button type="button" class="btn-confirm" @click="submit">
        {{ t('confirm_and_submit') }}
      </button>
    </template>
  </div>
</template>

<style scoped>
.title-excel-import {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.error-message {
  color: var(--status-danger);
  font-weight: 600;
}

.loading-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--brand-primary-50);
  border-radius: 10px;
}

.loading-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--brand-primary-400);
  animation: bounce 1s infinite alternate;
}

@keyframes bounce {
  from {
    transform: translateY(0);
    opacity: 0.6;
  }

  to {
    transform: translateY(-6px);
    opacity: 1;
  }
}

.table-container {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px color-mix(in srgb, var(--text-strong) 6%, transparent);
  background: var(--surface-1);
}

.table-header {
  padding: 10px;
}

.table-title {
  margin: 0;
}

.last {
  display: table-cell !important;
}

.main-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.main-table th {
  padding: 12px 16px;
  text-align: left;
  color: var(--brand-primary-500);
  border-bottom: 2px solid var(--brand-primary-100);
}

.main-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--brand-primary-50);
}

.btn-delete-row {
  background: var(--status-danger-soft);
  color: var(--status-danger);
  border: 1px solid var(--status-danger-soft);
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 14px;
  transition:
    background 0.2s,
    transform 0.15s;
}

.btn-delete-row:hover {
  background: var(--status-danger-soft);
  transform: scale(1.1);
}

.btn-confirm {
  width: 100%;
  padding: 14px;
  background: var(--brand-primary-500);
  color: var(--text-on-brand);
  border-radius: 12px;
  cursor: pointer;
  border: none;
  font-weight: 600;
}
</style>
