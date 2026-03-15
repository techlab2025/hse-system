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

<style scoped>
.objectives {
  word-break: break-word;
  overflow-wrap: anywhere;
  grid-column: span 3;
  p{
  grid-column: span 3;

  }
}
</style>
