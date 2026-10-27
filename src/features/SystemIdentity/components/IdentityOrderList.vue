<script setup lang="ts" generic="T extends string">
import { ref } from 'vue'
const model = defineModel<T[]>({ required: true })
const props = withDefaults(
  defineProps<{
    items: readonly { key: T; label: string }[]
    label: string
    locked?: readonly T[]
    externalDrag?: boolean
    draggingKey?: string | null
    dropBefore?: string
    dropAfter?: string
  }>(),
  { locked: () => [] },
)
const emit = defineEmits<{
  dragItemStart: [event: DragEvent, field: T]
  dragItemEnd: []
  dragItemOver: [event: DragEvent, field: T]
  dropItem: [event: DragEvent, field: T]
}>()
const dragged = ref<string | null>(null)
const startDrag = (event: DragEvent, field: T) => {
  if (props.locked.includes(field)) return
  if (!props.externalDrag) {
    dragged.value = field
    event.dataTransfer?.setData('text/plain', field)
  }
  emit('dragItemStart', event, field)
}
const endDrag = () => {
  dragged.value = null
  emit('dragItemEnd')
}
const move = (from: number, to: number) => {
  if (from < 0 || to < 0 || to >= model.value.length) return
  if (props.locked.includes(model.value[from]) || props.locked.includes(model.value[to])) return
  const order = [...model.value]
  const [field] = order.splice(from, 1)
  order.splice(to, 0, field)
  model.value = order
}
const drop = (event: DragEvent, target: T) => {
  emit('dropItem', event, target)
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
      :draggable="!locked.includes(field)"
      :data-field="field"
      :class="{
        'is-dragging': draggingKey === field,
        'is-drop-before': dropBefore === field,
        'is-drop-after': dropAfter === field,
      }"
      @dragstart.stop="startDrag($event, field)"
      @dragend.stop="endDrag"
      @dragover.prevent.stop="emit('dragItemOver', $event, field)"
      @drop.prevent.stop="drop($event, field)"
    >
      <slot name="handle" :item="field"
        ><span class="identity-order-drag-handle" aria-hidden="true">⠿</span></slot
      ><strong
        ><slot name="label" :item="field">{{
          items.find((item) => item.key === field)?.label
        }}</slot></strong
      >
      <button
        type="button"
        :aria-label="$t('uiDynamic.moveEarlier', { p0: field })"
        :disabled="index === 0 || locked.includes(field) || locked.includes(model[index - 1])"
        @click="move(index, index - 1)"
      >
        ↑
      </button>
      <button
        type="button"
        :aria-label="$t('uiDynamic.moveLater', { p0: field })"
        :disabled="
          index === model.length - 1 || locked.includes(field) || locked.includes(model[index + 1])
        "
        @click="move(index, index + 1)"
      >
        ↓
      </button>
      <slot :item="field" />
    </li>
  </ol>
</template>
