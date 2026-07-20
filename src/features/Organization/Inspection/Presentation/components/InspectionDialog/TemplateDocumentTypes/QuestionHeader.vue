<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  type: 'multiple' | 'single' | 'dropdown' | 'text'
  status?: string
}>()

const typeLabel = computed(() => {
  const labels = {
    multiple: 'multiple_choice',
    single: 'single_choice',
    dropdown: 'dropdown_choice',
    text: 'written_answer',
  }

  return labels[props.type]
})
</script>

<template>
  <header class="question-heading">
    <span class="question-heading__icon">
      <svg v-if="type === 'multiple'" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <path d="m5.3 6.5 1.3 1.3 2.2-2.5M14 6h7M14 17h7" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
      </svg>
      <svg v-else-if="type === 'single'" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="7" cy="7" r="4" />
        <circle cx="7" cy="7" r="1.5" />
        <path d="M14 7h7M3 17h8M15 17h6" />
      </svg>
      <svg v-else-if="type === 'dropdown'" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <path d="m9 10 3 3 3-3" />
      </svg>
      <svg v-else viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 19.5V22l2.5-1.5H19a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 1 1.5ZM7 8h10M7 12h7"
        />
      </svg>
    </span>

    <div class="question-heading__copy">
      <span class="question-heading__eyebrow">{{ $t(typeLabel) }}</span>
      <h3 class="question-heading__title">{{ title }}</h3>
    </div>

    <span v-if="status" class="question-heading__status">{{ status }}</span>
  </header>
</template>

<style scoped>
.question-heading {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.question-heading__icon {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  place-items: center;
  border-radius: 14px;
  color: var(--brand-primary-600, #2563eb);
  background: color-mix(in srgb, var(--brand-primary-500, #386cfe) 11%, transparent);
}

.question-heading__icon svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.question-heading__copy {
  min-width: 0;
  flex: 1;
}

.question-heading__eyebrow {
  display: block;
  margin-bottom: 3px;
  color: var(--text-muted, #667085);
  font-size: 0.65rem;
  font-weight: 850;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.question-heading__title {
  margin: 0;
  color: var(--text-strong, #172033);
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.45;
}

.question-heading__status {
  max-width: 180px;
  flex: 0 0 auto;
  padding: 6px 9px;
  overflow: hidden;
  border-radius: 999px;
  color: var(--brand-primary-700, #1d4ed8);
  background: color-mix(in srgb, var(--brand-primary-500, #386cfe) 9%, transparent);
  font-size: 0.68rem;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .question-heading {
    align-items: flex-start;
  }

  .question-heading__status {
    display: none;
  }
}
</style>
