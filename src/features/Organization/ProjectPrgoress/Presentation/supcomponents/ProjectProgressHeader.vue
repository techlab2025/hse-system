<script setup lang="ts">
import ProjectProgressIcon from '@/shared/icons/ProjectProgressIcon.vue'
import { ref, watch } from 'vue'
import Knob from 'primevue/knob'

const props = defineProps<{
  progressValue: number
}>()
const value = ref(props.progressValue)

watch(
  () => props.progressValue,
  (newVal) => {
    value.value = newVal
  },
)
</script>

<template>
  <div class="hse-identity hse-setup-progress">
    <div class="project-progress-info">
      <ProjectProgressIcon />
      <div class="project-progress-info-text">
        <h2 class="title">{{ $t('Lets_Get_Your_Organization_Ready') }}</h2>
        <p class="description">
          {{
            $t(
              'Add_your_structure,_assign_reporting_levels,_and_register_employees_to_start_managing_tasks_and_workflows.',
            )
          }}
        </p>
      </div>
    </div>
    <div>
      <Knob
        v-model="value"
        :valueColor="'var(--hse-project-blue)'"
        :rangeColor="'var(--hse-project-line-soft)'"
        :textColor="'var(--hse-project-ink)'"
        valueTemplate="{value}%"
        :disabled="true"
      />
    </div>
  </div>
</template>

<style scoped>
.hse-setup-progress {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 24px;
  border: 1px solid var(--hse-project-line);
  border-radius: var(--hse-project-radius-card);
  background: var(--hse-project-surface);
  box-shadow: var(--hse-project-shadow-panel);
}
.hse-setup-progress .project-progress-info {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}
.hse-setup-progress .project-progress-info > svg {
  flex: 0 0 44px;
  width: 44px;
  height: 44px;
  padding: 10px;
  border-radius: 12px;
  background: var(--hse-project-ice);
  color: var(--hse-project-blue);
}
.hse-setup-progress .title {
  margin: 0 0 7px;
  color: var(--hse-project-ink);
  font: 700 20px/1.35 var(--hse-project-font);
}
.hse-setup-progress .description {
  max-width: 700px;
  margin: 0;
  color: var(--hse-project-muted);
  font: 400 12px/1.6 var(--hse-project-font);
}
.hse-setup-progress > :last-child {
  flex: 0 0 100px;
}
.hse-setup-progress :deep(.p-knob) {
  opacity: 1;
  flex-shrink: 0;
}
.hse-setup-progress :deep(.p-knob-text) {
  font-family: var(--hse-project-font);
  font-weight: 700;
}
@media (max-width: 600px) {
  .hse-setup-progress {
    padding: 18px;
    gap: 12px;
    align-items: flex-start;
  }
  .hse-setup-progress .title {
    font-size: 17px;
  }
  .hse-setup-progress .project-progress-info > svg {
    display: none;
  }
  .hse-setup-progress > :last-child {
    flex-basis: 70px;
  }
  .hse-setup-progress :deep(.p-knob svg) {
    width: 70px;
    height: 70px;
  }
}
</style>
