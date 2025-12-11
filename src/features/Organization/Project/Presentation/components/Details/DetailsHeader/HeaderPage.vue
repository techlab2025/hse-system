<script setup lang="ts">
const props = defineProps<{
  img?: string
  number?: number
  title: string
  subtitle?: string
  showAll: boolean
}>()
</script>
<template>
  <div class="section-header-page-container">

      <div class="section-header-page">
      <img class="section-img-page" :src="img" alt="objective logo" v-if="img" />
      <div class="section-number-page" v-if="number">
        <span>{{ number }}</span>
      </div>
      <div class="header-text-page">
        <p class="title-page">{{ $t(title) }}</p>
        <p class="subtitle-page" v-if="subtitle">{{ $t(subtitle) }}</p>
      </div>
    </div>
  </div>

</template>
