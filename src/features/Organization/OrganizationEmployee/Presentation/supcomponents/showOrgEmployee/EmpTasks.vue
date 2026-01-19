<script setup lang="ts">
import type InspectionModel from '@/features/Organization/Inspection/Data/models/InspectionModel'
import InspectionCard from '@/features/Organization/Inspection/Presentation/components/InspectionUtils/InspectionCard.vue'
const props = defineProps<{
  data: InspectionModel[]
}>()
</script>

<template>
  <InspectionCard :tasks="data" :isDrag="true" />
</template>
