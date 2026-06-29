<script setup lang="ts">
import type witnessStatementsModel from '@/features/Organization/Investigating/Data/models/InvestegationwitnessStatementsModel'
import { computed } from 'vue'

const props = defineProps<{
  viewer: witnessStatementsModel
  index: number
}>()

const viewerValue = computed(() => props.viewer as any)
const personName = computed(
  () =>
    viewerValue.value?.organization_employee?.name ||
    viewerValue.value?.employee_name ||
    viewerValue.value?.employeeName ||
    'N/A',
)
const personTitle = computed(() => {
  const hierarchy = viewerValue.value?.organization_employee?.hierarchy ?? []
  return hierarchy
    .flatMap((item: any) => item?.titles ?? [])
    .map((item: any) => item?.title)
    .filter(Boolean)
    .join(', ')
})
const note = computed(
  () => viewerValue.value?.note || viewerValue.value?.result || 'No result added yet.',
)
</script>
<template>
  <div class="investegaion-viewers-card-conatiner">
    <p class="viewer-number">Witness.{{ index + 1 }}</p>
    <div class="investegaion-viewers-card">
      <div class="view">
        <div class="view-header">
          <span>result</span>
          <hr class="hr" />
        </div>
        <p class="view-content">{{ note }}</p>
      </div>
      <div class="person">
        <!-- <img :src="viewer?.ResponsablePerson?.img" alt="person"> -->
        <div class="person-data">
          <p class="person-name">{{ personName }}</p>

          <p v-if="personTitle" class="person-title">{{ personTitle }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
