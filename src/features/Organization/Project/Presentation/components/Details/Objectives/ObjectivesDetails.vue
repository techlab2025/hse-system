<script setup lang="ts">

const props = defineProps<{
  object_details: string[]
}>()
</script>

<template>
  <div class="objectives">
    <p class="object" v-for="(object, index) in object_details" :key="index">{{ object }}</p>
  </div>
</template>
