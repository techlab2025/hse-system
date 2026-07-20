<script setup lang="ts">
const props = defineProps<{
  img?: string
  title: string
  subtitle?: string
}>()
</script>
<template>
  <div class="section-header">
    <img class="section-img" v-if="img" :src="img" :alt="$t('section_illustration')" />
    <div class="header-text">
      <p class="title" v-if="title">{{ $t(title) }}</p>
      <p class="subtitle" v-if="subtitle">{{ $t(subtitle) }}</p>
    </div>
  </div>
</template>
  
