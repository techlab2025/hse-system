<script lang="ts" setup>
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog';

const props = defineProps<{
  columns: string[]
  visable: boolean
  sentData: string[]
}>()

const emit = defineEmits<{
  (e: 'update:columnMapping', mapping: Record<string, string>): void
  (e: 'close'): void
}>()

const visible = ref(props.visable)

// Ordered list of excel columns (user can drag to reorder)
const orderedColumns = ref<string[]>([...props.columns])

// Drag state
const draggedIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

watch(() => props.visable, (val) => {
  visible.value = val
})

watch(() => props.columns, (val) => {
  orderedColumns.value = [...val]
})

const onDragStart = (index: number) => {
  draggedIndex.value = index
}

const onDragOver = (e: DragEvent, index: number) => {
  e.preventDefault()
  dragOverIndex.value = index
}

const onDrop = (index: number) => {
  if (draggedIndex.value === null || draggedIndex.value === index) return

  const newOrder = [...orderedColumns.value]
  const [moved] = newOrder.splice(draggedIndex.value, 1)
  newOrder.splice(index, 0, moved)
  orderedColumns.value = newOrder

  draggedIndex.value = null
  dragOverIndex.value = null
}

const onDragEnd = () => {
  draggedIndex.value = null
  dragOverIndex.value = null
}

const onDragLeave = () => {
  dragOverIndex.value = null
}

// When dialog closes, emit the mapping: sentData[i] -> orderedColumns[i]
const onHide = () => {
  const mapping: Record<string, string> = {}
  props.sentData.forEach((key, i) => {
    mapping[key] = orderedColumns.value[i] ?? ''
  })
  emit('update:columnMapping', mapping)
  emit('close')
}

// Current mapping label for each row
const getMappedSentKey = (colIndex: number): string => {
  return props.sentData[colIndex] ?? '—'
}
</script>

<template>
  <div class="excel-select-dialog">
    <Dialog
      v-model:visible="visible"
      modal
      :dismissable-mask="true"
      :style="{ width: '56rem' }"
      header="Map Excel Columns"
      @hide="onHide"
    >
      <div class="instructions">
        <span>Drag the <strong>Excel columns</strong> (right) to align them with the <strong>target fields</strong> (left).</span>
      </div>

      <div class="mapping-container">
        <!-- Sent Data (target fields) -->
        <div class="column-list">
          <p class="column-list__title">Target Fields</p>
          <div
            class="column-list__items"
            :style="{ gap: '12px' }"
          >
            <label
              class="sent-columns"
              v-for="(data, i) in sentData"
              :key="data"
            >
              {{ data }}
            </label>
          </div>
        </div>

        <!-- Arrow indicator -->
        <div class="arrow-column">
          <div
            v-for="(_, i) in sentData"
            :key="i"
            class="arrow-row"
          >
            <svg viewBox="0 0 40 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="8" x2="32" y2="8" stroke="#1D4ED8" stroke-width="2" stroke-dasharray="4 3"/>
              <path d="M32 4L40 8L32 12V4Z" fill="#1D4ED8"/>
            </svg>
          </div>
        </div>

        <!-- Excel Columns (draggable) -->
        <div class="column-list">
          <p class="column-list__title">Excel Columns <span class="drag-hint">(drag to reorder)</span></p>
          <div class="column-list__items">
            <label
              v-for="(column, index) in orderedColumns"
              :key="column"
              class="excel-columns"
              :class="{
                'is-dragging': draggedIndex === index,
                'is-drag-over': dragOverIndex === index && draggedIndex !== index,
              }"
              draggable="true"
              @dragstart="onDragStart(index)"
              @dragover="onDragOver($event, index)"
              @drop="onDrop(index)"
              @dragend="onDragEnd"
              @dragleave="onDragLeave"
            >
              <span class="drag-handle">⠿</span>
              {{ column }}
            </label>
          </div>
        </div>
      </div>

      <template #footer>
        <button class="confirm-btn" @click="onHide">Confirm Mapping</button>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.excel-select-dialog {
  width: 100%;
}

.instructions {
  color: #6B7280;
  font-size: 14px;
  margin-bottom: 20px;
}

.mapping-container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 16px;
  width: 100%;
}

.column-list {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.column-list__title {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
  text-align: center;
}

.column-list__items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.arrow-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 33px; /* align with items (offset title height) */
}

.arrow-row {
  display: flex;
  align-items: center;
  height: 57px; /* match label height approx */
}

.arrow-row svg {
  width: 60px;
  height: 16px;
}

/* Sent columns */
.sent-columns {
  background-color: #F7F8F9;
  color: #9CA3AF;
  font-size: 16px;
  font-weight: 700;
  padding: 16px 32px;
  border-radius: 16px;
  width: 100%;
  text-align: center;
  display: block;
}

/* Excel columns */
.excel-columns {
  background-color: #1D4ED80D;
  color: #1D4ED8;
  font-size: 16px;
  font-weight: 700;
  padding: 16px 32px;
  border-radius: 16px;
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: grab;
  transition: transform 0.15s, box-shadow 0.15s, background-color 0.15s;
  user-select: none;
}

.excel-columns:active {
  cursor: grabbing;
}

.excel-columns.is-dragging {
  opacity: 0.4;
  transform: scale(0.97);
}

.excel-columns.is-drag-over {
  background-color: #1D4ED81A;
  box-shadow: 0 0 0 2px #1D4ED8;
  transform: scale(1.02);
}

.drag-handle {
  font-size: 18px;
  color: #93C5FD;
  line-height: 1;
  flex-shrink: 0;
}

.drag-hint {
  color: #9CA3AF;
  font-weight: 400;
  font-size: 11px;
}

/* Footer button */
.confirm-btn {
  background-color: #1D4ED8;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 10px 28px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.confirm-btn:hover {
  background-color: #1e40af;
}
</style>
