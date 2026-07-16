<script setup lang="ts">
import DataFailed from './DataFailed.vue'

withDefaults(
  defineProps<{
    title?: string
    description?: string
    link?: string
    addText?: string
  }>(),
  {
    title: '',
    description: '',
    link: '',
    addText: 'Home',
  },
)
</script>

<template>
  <DataFailed :title="title" :description="description" :link="link" :add-text="addText" />
</template>
