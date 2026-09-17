<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string
    label: string
    required?: boolean
    error?: string
    placeholder?: string
    minHeight?: string
  }>(),
  {
    placeholder: '',
    minHeight: '112px',
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const updateValue = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}
</script>

<template>
  <section
    class="answer-text-field animate-answer-field-in"
    :class="{ 'answer-text-field--error': Boolean(error) }"
    :data-answer-validation-error="Boolean(error)"
  >
    <div class="answer-text-field__heading">
      <span class="answer-text-field__icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M7 8h10M7 12h7m-7 4h4M5 3h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9l-5 3v-3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
          />
        </svg>
      </span>
      <div>
        <span class="answer-text-field__eyebrow">{{ $t('written_response') }}</span>
        <label class="answer-text-field__label">
          {{ label }} <span v-if="required" class="required-mark">*</span>
        </label>
      </div>
    </div>

    <div class="answer-text-field__input-shell">
      <textarea
        :value="modelValue"
        class="answer-text-field__input"
        :style="{ minHeight }"
        :placeholder="placeholder || $t('Please enter details...')"
        @input="updateValue"
      />
      <span class="answer-text-field__count">{{ modelValue.length }}</span>
    </div>

    <p v-if="error" class="required-field-message">{{ error }}</p>
  </section>
</template>

<style scoped>
.answer-text-field {
  width: 100%;
  margin-top: 16px;
  padding: 16px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500, #386cfe) 13%, transparent);
  border-radius: 20px;
  background: linear-gradient(
    145deg,
    var(--surface-1, #fff),
    color-mix(in srgb, var(--brand-primary-50, #eff6ff) 55%, #fff)
  );
  box-shadow: 0 12px 32px rgb(15 23 42 / 5%);
}

.answer-text-field__heading {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 11px;
}

.answer-text-field__icon {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  place-items: center;
  border-radius: 12px;
  color: var(--brand-primary-600, #2563eb);
  background: color-mix(in srgb, var(--brand-primary-500, #386cfe) 10%, transparent);
}

.answer-text-field__icon svg {
  width: 19px;
  height: 19px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.answer-text-field__eyebrow {
  display: block;
  color: var(--brand-primary-600, #2563eb);
  font-size: 0.66rem;
  font-weight: 850;
  letter-spacing: 0.1em;
  line-height: 1;
  text-transform: uppercase;
}

.answer-text-field__label {
  display: block;
  margin-top: 4px;
  color: var(--text-strong, #172033);
  font-size: 0.9rem;
  font-weight: 750;
}

.answer-text-field__input-shell {
  position: relative;
}

.answer-text-field__input {
  display: block;
  width: 100%;
  padding: 13px 14px 28px;
  resize: vertical;
  border: 1px solid
    color-mix(in srgb, var(--brand-primary-500, #386cfe) 16%, var(--surface-2, #e5e7eb));
  border-radius: 15px;
  outline: none;
  color: var(--text-strong, #172033);
  background: color-mix(in srgb, var(--surface-1, #fff) 96%, var(--brand-primary-50, #eff6ff));
  font: inherit;
  font-size: 0.875rem;
  line-height: 1.6;
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    background 180ms ease;
}

.answer-text-field__input::placeholder {
  color: var(--text-muted, #98a2b3);
}

.answer-text-field__input:focus {
  border-color: var(--brand-primary-500, #386cfe);
  background: var(--surface-1, #fff);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--brand-primary-500, #386cfe) 12%, transparent);
}

.answer-text-field__count {
  position: absolute;
  inset-inline-end: 11px;
  bottom: 8px;
  color: var(--text-muted, #98a2b3);
  font-size: 0.68rem;
  font-weight: 700;
}

.required-mark,
.required-field-message {
  color: var(--status-danger, #dc2626);
}

.required-field-message {
  margin: 9px 2px 0;
  font-size: 0.8rem;
  font-weight: 750;
}

.answer-text-field--error {
  border-color: color-mix(in srgb, var(--status-danger, #dc2626) 70%, transparent);
  box-shadow: 0 12px 32px color-mix(in srgb, var(--status-danger, #dc2626) 9%, transparent);
}

.answer-text-field--error .answer-text-field__input {
  border-color: var(--status-danger, #dc2626);
}

.animate-answer-field-in {
  animation: answerFieldIn 220ms ease-out;
}

@keyframes answerFieldIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
