<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue'

const emit = defineEmits(['close'])
const props = defineProps({
  open: {
    type: Boolean,
    default: true,
  },
})

const isOpen = computed(() => props.open)
</script>

<template>
  <aside :class="['sidebar', isOpen ? 'open' : 'close']"></aside>
</template>

<style scoped></style>
