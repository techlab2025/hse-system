<script setup lang="ts">
import { vProjectPanels } from '../../composables/projectPanels'
</script>
<template>
  <article
    data-hse-project
    v-project-panels
    class="hse-project-root hse-project-card hse-project-card--skeleton"
    aria-busy="true"
    :aria-label="$t('Loading Data')"
  >
    <div class="hse-project-card__photo"></div>
    <div class="hse-project-card__body">
      <div v-for="line in 6" :key="line" class="hse-project-skeleton-line"></div>
    </div>
  </article>
</template>
