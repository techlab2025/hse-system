<script setup lang="ts" generic="T extends string">
import { ref } from 'vue'
const model = defineModel<T[]>({ required: true })
defineProps<{ items: readonly { key: T; label: string }[]; label: string }>()
const dragged = ref<string | null>(null)
const startDrag = (event: DragEvent, field: T) => {
  dragged.value = field
  event.dataTransfer?.setData('text/plain', field)
}
const move = (from: number, to: number) => {
  if (from < 0 || to < 0 || to >= model.value.length) return
  const order = [...model.value]
  const [field] = order.splice(from, 1)
  order.splice(to, 0, field)
  model.value = order
}
const drop = (target: T) => {
  const source = model.value.findIndex((field) => field === dragged.value)
  if (source >= 0) move(source, model.value.indexOf(target))
  dragged.value = null
}
</script>
<template>
  <ol class="identity-order-list" :aria-label="label">
    <li
      v-for="(field, index) in model"
      :key="field"
      draggable="true"
      :data-field="field"
      @dragstart.stop="startDrag($event, field)"
      @dragend.stop="dragged = null"
      @dragover.prevent.stop
      @drop.prevent.stop="drop(field)"
    >
      <span aria-hidden="true">⠿</span
      ><strong>{{ items.find((item) => item.key === field)?.label }}</strong>
      <button
        type="button"
        :aria-label="`Move ${field} earlier`"
        :disabled="index === 0"
        @click="move(index, index - 1)"
      >
        ↑
      </button>
      <button
        type="button"
        :aria-label="`Move ${field} later`"
        :disabled="index === model.length - 1"
        @click="move(index, index + 1)"
      >
        ↓
      </button>
      <slot :item="field" />
    </li>
  </ol>
</template>
