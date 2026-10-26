<script setup lang="ts">
import { useSidebarDrag } from '../composables/useSidebarDrag'
const props = defineProps<{ container: string; label: string }>()
const emit = defineEmits<{ entered: [] }>()
const drag = useSidebarDrag()
function over(event: DragEvent) {
  drag.over(event, props.container)
  if (drag.canDrop(props.container)) emit('entered')
}
</script>

<template>
  <button
    type="button"
    class="identity-sidebar-drop-zone"
    :class="{
      'is-drop-ready': drag.canDrop(container),
      'is-drop-hovered':
        drag.target.value?.container === container && !drag.target.value?.siblingId,
    }"
    :data-drop-container="container"
    :aria-label="label"
    :aria-disabled="!drag.canDrop(container)"
    :tabindex="drag.activeId.value ? 0 : -1"
    @dragover.prevent.stop="over"
    @drop.prevent.stop="drag.drop(container)"
    @click="drag.drop(container)"
  >
    <span aria-hidden="true">↳</span> {{ label }}
  </button>
</template>
