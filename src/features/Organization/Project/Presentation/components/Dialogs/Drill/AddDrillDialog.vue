<script setup lang="ts">
import { inject } from 'vue'
import { overviewPresentationKey } from '../../Details/overviewPresentation'
const overviewPresentation = inject(overviewPresentationKey, false)

import { vProjectPanels } from '../../../composables/projectPanels'

import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import DrillForm from './DrillForm.vue'

defineProps<{ projectId: number; compact?: boolean }>()
const emit = defineEmits<{ (event: 'saved'): void }>()
const visible = ref(false)

const saved = () => {
  visible.value = false
  emit('saved')
}
</script>

<template>
  <button
    data-hse-project
    v-project-panels
    class="hse-project-root add-drill-trigger hse-project-planning"
    :class="{ compact }"
    type="button"
    @click="visible = true"
  >
    <span class="add-drill-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 5v14M5 12h14" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    </span>
    <span
      ><strong>{{ $t('Add Drill') }}</strong
      ><small v-if="!compact">{{ $t('Schedule an emergency preparedness exercise') }}</small></span
    >
  </button>

  <Dialog
    :class="{ 'hse-project-overview-overlay': overviewPresentation }"
    data-hse-project
    class="hse-project-root hse-project-overlay hse-project-planning"
    :dir="$i18n.locale.startsWith('ar') ? 'rtl' : 'ltr'"
    v-model:visible="visible"
    modal
    dismissable-mask
    :style="{ width: 'min(58rem, calc(100vw - 24px))' }"
  >
    <template #header>
      <div class="drill-dialog-header">
        <span>DR</span>
        <div>
          <h2>{{ $t('Add Drill') }}</h2>
          <p>{{ $t('Create a drill for this project and assign its responsible team.') }}</p>
        </div>
      </div>
    </template>
    <DrillForm :project-id="projectId" @saved="saved" />
  </Dialog>
</template>

<style scoped lang="scss">
.add-drill-trigger {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 220px;
  padding: 12px 16px;
  border: 1px solid color-mix(in srgb, var(--hse-project-blue) 28%, var(--hse-project-line));
  border-radius: 16px;
  color: white;
  text-align: start;
  cursor: pointer;
  background: linear-gradient(135deg, var(--hse-project-blue), var(--hse-project-blue));
  box-shadow: 0 14px 28px color-mix(in srgb, var(--hse-project-blue) 22%, transparent);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.add-drill-trigger:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 34px color-mix(in srgb, var(--hse-project-blue) 28%, transparent);
}
.add-drill-trigger.compact {
  min-width: 0;
  padding: 9px 13px;
}
.add-drill-icon {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border-radius: 12px;
  background: color-mix(in srgb, white 16%, transparent);
}
.add-drill-icon svg {
  width: 24px;
  stroke: currentColor;
  stroke-width: 1.7;
}
.add-drill-trigger strong,
.add-drill-trigger small {
  display: block;
}
.add-drill-trigger small {
  margin-top: 2px;
  opacity: 0.78;
  font-size: 0.75rem;
}
.drill-dialog-header {
  display: flex;
  align-items: center;
  gap: 12px;
}
.drill-dialog-header > span {
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border-radius: 14px;
  color: white;
  background: linear-gradient(145deg, var(--hse-project-blue), var(--hse-project-blue));
  font-family: var(--hse-project-font);
  font-weight: 700;
}
.drill-dialog-header h2 {
  margin: 0;
  color: var(--hse-project-ink);
  font-size: 1.1rem;
}
.drill-dialog-header p {
  margin: 3px 0 0;
  color: var(--hse-project-muted);
  font-size: 0.75rem;
}
</style>
