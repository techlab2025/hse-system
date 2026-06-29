<script lang="ts" setup>
import { ref, watch } from 'vue'
import Editor from 'primevue/editor'
import RadioButton from 'primevue/radiobutton'

const emit = defineEmits(['update:data'])

const verificationMethodology = ref('')
const resultFindings = ref('')
const verificationStatus = ref<'effective' | 'ineffective' | 'pending'>('pending')

const statusOptions = [
  {
    label: 'Effective',
    value: 'effective',
  },
  {
    label: 'Ineffective',
    value: 'ineffective',
  },
  {
    label: 'Pending',
    value: 'pending',
  },
] as const

const emitData = () => {
  emit('update:data', {
    verification_methodology: verificationMethodology.value,
    result_findings: resultFindings.value,
    verification_status: verificationStatus.value,
  })
}

watch([verificationMethodology, resultFindings, verificationStatus], emitData, {
  immediate: true,
})
</script>

<template>
  <section class="verification-section">
    <div class="section-heading">
      <span>Verification of effectiveness</span>
      <h2>Make sure actions actually changed the risk</h2>
    </div>

    <div class="verification-form">
      <div class="editor-field">
        <label for="verification_methodology">Verification methodology</label>
        <Editor
          id="verification_methodology"
          v-model="verificationMethodology"
          editorStyle="height: 220px"
          placeholder="Describe how the verification will be performed, what evidence will be reviewed, and who will validate it."
        />
      </div>

      <div class="editor-field">
        <label for="result_findings">Result & findings</label>
        <Editor
          id="result_findings"
          v-model="resultFindings"
          editorStyle="height: 220px"
          placeholder="Record the verification result, field notes, evidence summary, and remaining gaps."
        />
      </div>

      <div class="status-field">
        <label>Verification status</label>
        <div class="status-options">
          <label
            v-for="option in statusOptions"
            :key="option.value"
            class="status-option"
            :class="{ selected: verificationStatus === option.value }"
            :for="`verification-status-${option.value}`"
          >
            <RadioButton
              v-model="verificationStatus"
              :inputId="`verification-status-${option.value}`"
              name="verification-status"
              :value="option.value"
            />
            <span>{{ option.label }}</span>
          </label>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.verification-section {
  border: 1px solid var(--main-border);
  border-radius: 18px;
  background: var(--BgWhite);
  box-shadow: 0 8px 16px color-mix(in srgb, var(--Black) 10%, transparent);
  padding: 1.25rem;
}

.section-heading {
  margin-bottom: 1rem;

  span {
    color: var(--PrimaryColor);
    font-size: 0.76rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h2 {
    margin: 0.25rem 0 0;
    color: var(--header-page-color);
    font-size: 1.35rem;
    font-weight: 900;
  }
}

.verification-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.editor-field,
.status-field {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.editor-field label,
.status-field > label {
  color: var(--header-page-color);
  font-size: var(--sm-size);
  font-weight: 800;
}

.status-field {
  grid-column: 1 / -1;
}

.status-options {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.status-option {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-height: 56px;
  border: 1px solid var(--main-border);
  border-radius: 14px;
  background: var(--Gray-1);
  color: var(--GrayText-1);
  cursor: pointer;
  padding: 0.85rem 1rem;
  transition: all 0.2s ease-in-out;

  span {
    font-size: var(--sm-size);
    font-weight: 800;
  }
}

.status-option.selected {
  border-color: var(--PrimaryColor);
  // background: var(--primary-dark);
  color: var(--PrimaryColor);
}

:deep(.p-editor-container) {
  border-radius: 16px;
  overflow: hidden;
}

:deep(.p-editor-toolbar) {
  border-color: var(--main-border);
  background: var(--Gray-1);
}

:deep(.p-editor-content) {
  border-color: var(--main-border);
}
:deep(.p-radiobutton-checked .p-radiobutton-box) {
  background-color: var(--PrimaryColor);
}

@media (max-width: 900px) {
  .verification-form,
  .status-options {
    grid-template-columns: 1fr;
  }
}
</style>
