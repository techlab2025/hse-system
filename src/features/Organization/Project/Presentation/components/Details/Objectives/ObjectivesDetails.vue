<script setup lang="ts">
const props = defineProps<{
  object_details: string | undefined
}>()
</script>

<template>
  <div class="objectives" :class="{ 'is-empty': !object_details }">
    <p v-if="object_details" v-html="object_details"></p>
    <p v-else>{{ $t('No data available') }}</p>
  </div>
</template>
