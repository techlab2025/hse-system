<script setup lang="ts">

const props = defineProps<{
  img: string,
  title: string,
  subtitle: string
}>()

</script>
<template>
  <div class="empty-teams">
    <img :src="img" alt="empty">
    <div class="empty-text">
      <p class="title">{{ title }}</p>
      <p class="subtitle">{{ subtitle }}</p>
    </div>
  </div>
</template>
