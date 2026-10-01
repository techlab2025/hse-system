<script setup lang="ts">
import DataFailed from './DataFailed.vue'

withDefaults(
  defineProps<{
    title?: string
    description?: string
    link?: string
    addText?: string
    withbtn?: boolean
  }>(),
  {
    title: '',
    description: '',
    link: '',
    addText: 'Home',
    withbtn: true,
  },
)
</script>

<template>
  <DataFailed
    :title="title"
    :description="description"
    :link="link"
    :add-text="addText"
    :withbtn="withbtn"
  />
</template>
