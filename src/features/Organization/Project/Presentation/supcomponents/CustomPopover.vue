<script setup>
import { ref } from 'vue'
import Popover from 'primevue/popover'

const op = ref()

const showPopover = (event) => {
  op.value?.show(event)
}

const hidePopover = () => {
  op.value?.hide()
}
</script>

<template>
  <button @mouseenter="showPopover" @mouseleave="hidePopover">
    <slot name="btn"></slot>
  </button>

  <Popover ref="op">
    <slot name="content"></slot>
  </Popover>
</template>
