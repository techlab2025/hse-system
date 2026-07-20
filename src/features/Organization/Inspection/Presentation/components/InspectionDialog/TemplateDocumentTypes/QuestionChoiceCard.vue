<script setup lang="ts">
import type ItemModel from '@/features/setting/TemplateItem/Data/models/ItemMode'
import Checkbox from 'primevue/checkbox'
import RadioButton from 'primevue/radiobutton'

const props = defineProps<{
  option: ItemModel
  selected: boolean
  type: 'checkbox' | 'radio'
  itemId: number
}>()

const emit = defineEmits<{
  (event: 'select'): void
}>()

const inputId = `answer-${props.type}-${props.itemId}-${props.option.id}`

const selectFromKeyboard = (event: KeyboardEvent) => {
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  emit('select')
}
</script>

<template>
  <div
    class="answer-choice"
    :class="{ 'answer-choice--selected': selected }"
    :role="type"
    :aria-checked="selected"
    tabindex="0"
    @click="emit('select')"
    @keydown="selectFromKeyboard"
  >
    <span class="answer-choice__control" @click.stop>
      <Checkbox
        v-if="type === 'checkbox'"
        binary
        :model-value="selected"
        :input-id="inputId"
        @update:model-value="emit('select')"
      />
      <RadioButton
        v-else
        :model-value="selected ? option.id : null"
        :value="option.id"
        :input-id="inputId"
        :name="`radio-${itemId}`"
        @update:model-value="emit('select')"
      />
    </span>

    <label :for="inputId" class="answer-choice__label" @click.prevent>
      {{ option.title }}
    </label>

    <span v-if="option.is_upload || Number(option.kpi) > 0" class="answer-choice__features">
      <span v-if="Number(option.kpi) > 0" class="answer-choice__feature" :title="$t('Notes')">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M7 8h10M7 12h7m-7 4h4M5 3h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9l-5 3v-3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
          />
        </svg>
      </span>
      <span v-if="option.is_upload" class="answer-choice__feature" :title="$t('photo')">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M4 7h3l1.3-2h7.4L17 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Zm8 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
          />
        </svg>
      </span>
    </span>
  </div>
</template>

<style scoped>
.answer-choice {
  position: relative;
  display: flex;
  min-width: 0;
  min-height: 58px;
  align-items: center;
  gap: 11px;
  padding: 11px 12px;
  overflow: hidden;
  border: 1px solid
    color-mix(in srgb, var(--brand-primary-500, #386cfe) 13%, var(--surface-2, #e5e7eb));
  border-radius: 16px;
  outline: none;
  background: color-mix(in srgb, var(--surface-1, #fff) 96%, var(--brand-primary-50, #eff6ff));
  box-shadow: 0 4px 14px rgb(15 23 42 / 3%);
  cursor: pointer;
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease,
    background 180ms ease;
}

.answer-choice::before {
  position: absolute;
  inset-block: 9px;
  inset-inline-start: 0;
  width: 3px;
  border-radius: 999px;
  content: '';
  background: transparent;
  transition: background 180ms ease;
}

.answer-choice:hover {
  border-color: color-mix(in srgb, var(--brand-primary-500, #386cfe) 38%, transparent);
  box-shadow: 0 10px 24px rgb(29 78 216 / 8%);
  transform: translateY(-1px);
}

.answer-choice:focus-visible {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-primary-500, #386cfe) 17%, transparent);
}

.answer-choice--selected {
  border-color: color-mix(in srgb, var(--brand-primary-500, #386cfe) 60%, transparent);
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--brand-primary-500, #386cfe) 10%, #fff),
    color-mix(in srgb, var(--status-success, #22c55e) 5%, #fff)
  );
  box-shadow: 0 10px 26px rgb(29 78 216 / 10%);
}

.answer-choice--selected::before {
  background: linear-gradient(
    180deg,
    var(--brand-primary-500, #386cfe),
    var(--status-success, #22c55e)
  );
}

.answer-choice__control {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
}

.answer-choice__label {
  min-width: 0;
  flex: 1;
  color: var(--text-strong, #172033);
  font-size: 0.875rem;
  font-weight: 750;
  line-height: 1.35;
  cursor: pointer;
}

.answer-choice__features {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 5px;
}

.answer-choice__feature {
  display: grid;
  width: 27px;
  height: 27px;
  place-items: center;
  border-radius: 9px;
  color: var(--brand-primary-600, #2563eb);
  background: color-mix(in srgb, var(--brand-primary-500, #386cfe) 10%, transparent);
}

.answer-choice__feature svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.answer-choice__feature svg path:last-child:not(:first-child) {
  fill: currentColor;
  stroke: none;
}

:deep(.p-checkbox-box),
:deep(.p-radiobutton-box) {
  border-color: color-mix(in srgb, var(--brand-primary-500, #386cfe) 30%, transparent) !important;
  background: var(--surface-1, #fff) !important;
}

.answer-choice--selected :deep(.p-checkbox-box),
.answer-choice--selected :deep(.p-radiobutton-box) {
  border-color: var(--brand-primary-500, #386cfe) !important;
  background: var(--brand-primary-500, #386cfe) !important;
}
</style>
