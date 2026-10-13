<script setup lang="ts">
import { vProjectPanels } from '../../../composables/projectPanels'

import ArrowIcons from '@/shared/icons/ArrowIcons.vue'
</script>
<template>
  <div data-hse-project v-project-panels class="hse-project-root breadcrumbs-project">
    <div class="first-item">
      <div class="small-circle"></div>
      <p>{{ $t('select hierarchy') }}</p>
    </div>

    <ArrowIcons />

    <p class="last-child">{{ $t('select hierarchy') }}</p>
  </div>
</template>
