<script setup lang="ts">
import type InspectionModel from '../../../Data/models/InspectionModel';
import InspectionCard from '../InspectionUtils/InspectionCard.vue';

const props = defineProps<{
  data: InspectionModel[]
  isAuditPage?:boolean
}>()

</script>
<template>
  <div class="inspection-form-page  ">
    <InspectionCard :isAuditPage="isAuditPage" :tasks="data" :isDrag="false" />
  </div>
</template>
