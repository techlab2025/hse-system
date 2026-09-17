<script setup>
import { ref } from 'vue'
import Popover from 'primevue/popover'

const op = ref()
let hideTimer = null

const clearHideTimer = () => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

const showPopover = (event) => {
  clearHideTimer()
  op.value?.show(event)
}

const hidePopover = () => {
  clearHideTimer()
  op.value?.hide()
}

const scheduleHidePopover = () => {
  clearHideTimer()
  hideTimer = setTimeout(() => {
    op.value?.hide()
    hideTimer = null
  }, 180)
}
</script>

<template>
  <button @mouseenter="showPopover" @mouseleave="scheduleHidePopover">
    <slot name="btn"></slot>
  </button>

  <Popover ref="op">
    <div class="custom-popover-hover-bridge" @mouseenter="clearHideTimer" @mouseleave="hidePopover">
      <slot name="content"></slot>
    </div>
  </Popover>
</template>
