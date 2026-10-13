<script setup lang="ts">
import { vProjectPanels } from '../../../composables/projectPanels'

import HeaderSection from '../DetailsHeader/HeaderSection.vue'
import InspectionsCard from './InspectionsCard.vue'

const {
  inspectionsImage,
  inspectionHeaderTitle,
  inspectionHeaderSubtitle,
  showHeader,
  showArrowLink,
  isAssign,
} = defineProps<{
  inspectionsImage: string
  inspectionHeaderTitle: string
  inspectionHeaderSubtitle: string
  showHeader?: boolean
  showArrowLink?: boolean
  isAssign: boolean
}>()
</script>

<template>
  <div data-hse-project v-project-panels class="hse-project-root inspections">
    <HeaderSection
      :img="inspectionsImage"
      :title="inspectionHeaderTitle"
      :subtitle="inspectionHeaderSubtitle"
    />

    <div class="inspections-cards">
      <InspectionsCard
        :showHeader="showHeader"
        :showArrowLink="showArrowLink"
        :isAssign="isAssign"
        v-for="i in 6"
        :key="i"
      />
    </div>
  </div>
</template>
