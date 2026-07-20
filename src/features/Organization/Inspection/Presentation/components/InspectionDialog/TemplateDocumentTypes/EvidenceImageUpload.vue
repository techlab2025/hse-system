<script setup lang="ts">
import UploadMultiImage from '@/shared/HelpersComponents/UploadMultiImage.vue'

defineProps<{
  label: string
  required?: boolean
  error?: string
  initialImages?: string[]
}>()

const emit = defineEmits<{
  (event: 'update:images', images: string[]): void
}>()
</script>

<template>
  <section
    class="evidence-upload-card animate-evidence-in"
    :class="{ 'evidence-upload-card--error': Boolean(error) }"
    :data-answer-validation-error="Boolean(error)"
  >
    <div class="evidence-upload-card__heading">
      <div>
        <span class="evidence-upload-card__eyebrow">{{ $t('evidence') }}</span>
        <h4 class="evidence-upload-card__title">
          {{ label }} <span v-if="required" class="required-mark">*</span>
        </h4>
      </div>
      <span class="evidence-upload-card__badge">{{ $t('photo') }}</span>
    </div>

    <UploadMultiImage
      variant="evidence"
      :initial-images="initialImages"
      @update:images="emit('update:images', $event)"
    />

    <p v-if="error" class="required-field-message">{{ error }}</p>
  </section>
</template>

<style scoped>
.evidence-upload-card {
  position: relative;
  width: 100%;
  margin-top: 16px;
  overflow: hidden;
  padding: 16px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-600, #1d4ed8) 16%, transparent);
  border-radius: 20px;
  background:
    radial-gradient(circle at 100% 0%, rgb(29 78 216 / 10%), transparent 34%),
    var(--surface-card, #fff);
  box-shadow: 0 12px 35px rgb(15 23 42 / 6%);
}

.evidence-upload-card::before {
  position: absolute;
  top: 0;
  bottom: 0;
  inset-inline-start: 0;
  width: 4px;
  content: '';
  background: linear-gradient(180deg, #386cfe, #8aa9ff);
}

.evidence-upload-card__heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.evidence-upload-card__eyebrow {
  color: var(--brand-primary-700, #1d4ed8);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.evidence-upload-card__title {
  margin: 3px 0 0;
  color: var(--text-color, #172033);
  font-size: 0.95rem;
  font-weight: 750;
}

.evidence-upload-card__badge {
  padding: 5px 9px;
  border-radius: 999px;
  color: var(--brand-primary-700, #1d4ed8);
  background: color-mix(in srgb, var(--brand-primary-600, #1d4ed8) 10%, transparent);
  font-size: 0.7rem;
  font-weight: 700;
}

.required-mark,
.required-field-message {
  color: var(--status-danger);
}

.required-field-message {
  margin: 9px 2px 0;
  font-size: 0.8rem;
  font-weight: 700;
}

.evidence-upload-card--error {
  border-color: color-mix(in srgb, var(--status-danger) 72%, transparent);
  box-shadow: 0 12px 35px color-mix(in srgb, var(--status-danger) 10%, transparent);
}

.evidence-upload-card--error::before {
  background: var(--status-danger);
}

.animate-evidence-in {
  animation: evidenceIn 220ms ease-out;
}

@keyframes evidenceIn {
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
