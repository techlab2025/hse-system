<script setup lang="ts">
import { usePdfExport } from '@/composables/usePdfExport'
import PdefActionIcon from '../icons/PdefActionIcon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    isDropList?: boolean
    targetSelector?: string
    filename?: string
    title?: string
    orientation?: 'portrait' | 'landscape'
  }>(),
  {
    targetSelector: '.table-responsive',
    filename: 'export.pdf',
    orientation: 'landscape',
  },
)

const { exportPdf, isExporting, exportError } = usePdfExport()
const exportPDF = () =>
  exportPdf({
    targetSelector: props.targetSelector,
    filename: props.filename,
    title: props.title,
    orientation: props.orientation,
  })
</script>

<template>
  <button
    v-bind="$attrs"
    :class="isDropList ? 'export-pdf-btn ms-2' : 'btn btn-secondary'"
    type="button"
    data-pdf-exclude
    :disabled="isExporting"
    :aria-busy="isExporting"
    @click="exportPDF"
  >
    <PdefActionIcon v-if="isDropList" />
    {{ isExporting ? $t('Exporting…') : $t('Export to PDF') }}
  </button>
  <p v-if="exportError" class="pdf-export-error" role="alert" data-pdf-exclude>{{ exportError }}</p>
</template>

<style scoped>
.pdf-export-error {
  color: var(--status-danger, #b42318);
  font-size: 0.8rem;
  margin: 6px 0;
}
button:disabled {
  opacity: 0.6;
  cursor: wait;
}
.export-pdf-btn {
  font-family: 'Regular';
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 5px;
  margin-top: 5px;
  transition: linear all 0.3s;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 5px;
  background-color: color-mix(in srgb, var(--main-border) 5.88%, transparent);
  color: var(--text-soft);
  border: none !important;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;

  &:hover {
    background-color: color-mix(in srgb, var(--status-danger) 5.88%, transparent);
  }
}
</style>
