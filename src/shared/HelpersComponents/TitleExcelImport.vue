<script setup lang="ts">
import { ref, watch } from 'vue'
import * as XLSX from 'xlsx'

const props = defineProps<{ initialFile?: File | null }>()
const emit = defineEmits<{
  (event: 'imported', titles: string[]): void
}>()

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
</script>

<template>
  <div class="title-excel-import">
    <p v-if="isLoading">Processing file...</p>
    <p v-else-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <template v-else-if="titles.length">
      <div class="table-responsive">
        <table class="main-table">
          <thead><tr><th>#</th><th>Title</th></tr></thead>
          <tbody>
            <tr v-for="(title, index) in titles" :key="`${title}-${index}`">
              <td>{{ index + 1 }}</td>
              <td>{{ title }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button type="button" class="btn btn-primary" @click="submit">
        Confirm &amp; Submit
      </button>
    </template>
  </div>
</template>

<style scoped>
.title-excel-import { display: grid; gap: 1rem; }
.error-message { color: var(--status-danger); font-weight: 600; }
</style>
