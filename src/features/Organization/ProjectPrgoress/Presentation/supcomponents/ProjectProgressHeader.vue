<script setup lang="ts">
import ProjectProgressIcon from '@/shared/icons/ProjectProgressIcon.vue';
import { ref, watch } from 'vue';
import Knob from 'primevue/knob';

const props = defineProps<{
  progressValue: number
}>()
const value = ref(props.progressValue);

watch(() => props.progressValue, (newVal) => {
  value.value = newVal
})
</script>

<template>

  <div class="project-progress-header-container">
    <div class="project-progress-info">
      <ProjectProgressIcon />
      <div class="project-progress-info-text">
        <h2 class="title">{{ $t('Lets_Get_Your_Organization_Ready') }}</h2>
        <p class="description">{{
          $t('Add_your_structure,_assign_reporting_levels,_and_register_employees_to_start_managing_tasks_and_workflows.')
        }}
        </p>
      </div>
    </div>
    <div>
      <Knob v-model="value" :valueColor="`#1F41BB`" :disabled="true" />
    </div>

  </div>
</template>
