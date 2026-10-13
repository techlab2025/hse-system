<script setup lang="ts">
import { vProjectPanels } from '../../../composables/projectPanels'

const props = defineProps<{
  object_details: string | undefined
}>()
</script>

<template>
  <div
    data-hse-project
    v-project-panels
    class="hse-project-root objectives"
    :class="{ 'is-empty': !object_details }"
  >
    <p v-if="object_details" v-html="object_details"></p>
    <p v-else>{{ $t('No data available') }}</p>
  </div>
</template>
