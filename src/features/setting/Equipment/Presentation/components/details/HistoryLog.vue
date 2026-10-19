<script setup lang="ts">
import { computed } from 'vue'
import type InspectionModel from '@/features/Organization/Inspection/Data/models/InspectionModel'
import { EquipmentInspectionEnum } from '../../../Core/enum/EquipmentInspectionEnum'
import EquipmentInspectionCard from './EquipmentInspectionCard.vue'
import ProjectIcon from '@/features/Organization/Project/Presentation/components/ProjectUtils/ProjectIcon.vue'
const props = defineProps<{
  show_tasks: InspectionModel[]
  result_tasks: InspectionModel[]
  inspectionType: EquipmentInspectionEnum
}>()
const isResults = computed(() => props.inspectionType === EquipmentInspectionEnum.Results)
const records = computed(() =>
  isResults.value ? props.result_tasks : [...props.show_tasks, ...props.result_tasks],
)
</script>
<template>
  <div class="eq-history">
    <EquipmentInspectionCard
      v-if="records.length"
      :tasks="records"
      :is-equipment-show-questions="!isResults"
      :is-equipment-result="isResults"
      :is-drag="false"
      :showresult="false"
      :is-equipment="true"
    />
    <div v-else class="eq-empty" role="status">
      <ProjectIcon name="folder" /><strong>{{
        $t(isResults ? 'eq_no_results' : 'eq_no_inspections')
      }}</strong>
      <p>{{ $t('eq_records_empty_hint') }}</p>
    </div>
  </div>
</template>
