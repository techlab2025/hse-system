<script setup lang="ts">
const props = defineProps<{
  img: string
  title: string
  subtitle: string
}>()
</script>
<template>
  <div class="section-header">
    <img class="section-img" :src="img" alt="objective logo" />
    <div class="header-text">
      <p class="title">{{ $t(title) }}</p>
      <p class="subtitle">{{ $t(subtitle) }}</p>
    </div>
  </div>
</template>
