<script setup lang="ts">
import { vProjectPanels } from '../composables/projectPanels'

import { onBeforeUnmount, ref, useId } from 'vue'
import Popover from 'primevue/popover'

const props = defineProps({ identity: Boolean })
const panelId = useId()
const expanded = ref(false)
const pinned = ref(false)

const op = ref<InstanceType<typeof Popover>>()
let hideTimer: ReturnType<typeof setTimeout> | null = null

const clearHideTimer = () => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

const showPopover = (event: Event) => {
  clearHideTimer()
  op.value?.show(event)
}

const openInteractivePopover = (event: Event) => {
  if (!props.identity) return
  pinned.value = true
  showPopover(event)
}

const hidePopover = () => {
  pinned.value = false
  clearHideTimer()
  op.value?.hide()
}

const scheduleHidePopover = () => {
  if (pinned.value) return
  clearHideTimer()
  hideTimer = setTimeout(() => {
    op.value?.hide()
    hideTimer = null
  }, 180)
}
const onHide = () => {
  expanded.value = false
  pinned.value = false
  clearHideTimer()
}
onBeforeUnmount(clearHideTimer)
</script>

<template>
  <button
    data-hse-project
    class="hse-project-root"
    :class="{ 'hse-identity hse-resource-trigger': props.identity }"
    type="button"
    :aria-expanded="props.identity ? expanded : undefined"
    :aria-controls="props.identity && expanded ? panelId : undefined"
    @click="openInteractivePopover"
    @focus="openInteractivePopover"
    @blur="props.identity && scheduleHidePopover()"
    @keydown.esc="hidePopover"
    v-project-panels
    @mouseenter="showPopover"
    @mouseleave="scheduleHidePopover"
  >
    <slot name="btn"></slot>
  </button>

  <Popover
    data-hse-project
    class="hse-project-root hse-project-overlay"
    :class="{ 'hse-identity hse-project-resource-popover': props.identity }"
    :id="panelId"
    @mouseenter="clearHideTimer"
    @mouseleave="scheduleHidePopover"
    @show="expanded = true"
    @hide="onHide"
    :dir="$i18n.locale.startsWith('ar') ? 'rtl' : 'ltr'"
    ref="op"
  >
    <div class="custom-popover-hover-bridge">
      <slot name="content"></slot>
    </div>
  </Popover>
</template>
