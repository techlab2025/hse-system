<script setup lang="ts">
import type InspectionModel from '../../../Data/models/InspectionModel';
import InspectionCard from '../InspectionUtils/InspectionCard.vue';

const props = defineProps<{
  data: InspectionModel[]
}>()

</script>
<template>
  <div class="inspection-form-page  ">
    <InspectionCard :tasks="data" :isDrag="false" />
  </div>
</template>
