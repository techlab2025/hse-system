<script setup lang="ts">

const props = defineProps<{
  object_details: string
}>()
</script>

<template>
  <div class="objectives">
    <p v-html="object_details"></p>
  </div>
</template>
