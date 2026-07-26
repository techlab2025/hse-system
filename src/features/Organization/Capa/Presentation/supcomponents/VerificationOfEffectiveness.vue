<script lang="ts" setup>
import { ref, watch } from 'vue'
import Editor from 'primevue/editor'
import RadioButton from 'primevue/radiobutton'
import { VerificationEnum } from '../../Core/Core/VerificationEnum'
import SetInvestigationTaskVerificationController from '../controllers/investigationTask/SetInvestigationTaskVerificationController'
import SetInvestigationTaskVerificationParams from '../../Core/params/InvestigationTask/SetInvestigationTaskVerificationParams'
import FetchInvestigationTaskVerificationController from '../controllers/investigationTask/FetchInvestigationTaskVerificationController'
import FetchInvestigationTaskVerificationParams from '../../Core/params/InvestigationTask/FetchInvestigationTaskVerificationParams'

const emit = defineEmits(['update:data', 'saved'])
const { taskId, propsVerificationMethodology, propsVerificationStatus, propsResultFindings , capa_id } =
  defineProps<{
    taskId: number
    propsVerificationMethodology?: string
    propsVerificationStatus?: number
    propsResultFindings?: string
    capa_id?:number
  }>()

const verificationMethodology = ref(propsVerificationMethodology || '')
const resultFindings = ref(propsResultFindings || '')
const verificationStatus = ref<VerificationEnum>(
  propsVerificationStatus || VerificationEnum.Pending,
)
const isSaving = ref(false)

const statusOptions = [
  {
    label: 'Effective',
    value: VerificationEnum.Effective,
  },
  {
    label: 'Ineffective',
    value: VerificationEnum.NotEffective,
  },
  {
    label: 'Pending',
    value: VerificationEnum.Pending,
  },
] as const

const emitData = () => {
  emit('update:data', {
    verification_methodology: verificationMethodology.value,
    result_findings: resultFindings.value,
    verification_status: verificationStatus.value,
  })
}

watch([verificationMethodology, resultFindings, verificationStatus, capa_id], emitData, {
  immediate: true,
})

const verificationController = SetInvestigationTaskVerificationController.getInstance()
const fetchVerificationController = FetchInvestigationTaskVerificationController.getInstance()

const loadVerification = async () => {
  if (!taskId || !capa_id) return

  await fetchVerificationController.getData(new FetchInvestigationTaskVerificationParams(taskId, capa_id))

  if (fetchVerificationController.isDataSuccess()) {
    const data = fetchVerificationController.state.value.data
    if (data) {
      verificationMethodology.value = data.verificationMethodology || ''
      resultFindings.value = data.resultFindings || ''
      verificationStatus.value = data.verificationStatus || VerificationEnum.Pending
    }
  }
}

watch(
  () => taskId,
  () => {
    loadVerification()
  },
  { immediate: true },
)

const submitVerification = async () => {
  if (!taskId || isSaving.value) return

  isSaving.value = true
  try {
    const params = new SetInvestigationTaskVerificationParams(
      taskId,
      verificationMethodology.value,
      resultFindings.value,
      verificationStatus.value,
      capa_id!
    )
    await verificationController.getData(params)
    if (verificationController.isDataSuccess()) emit('saved')
  } finally {
    isSaving.value = false
  }
}
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

    <button
      class="btn btn-primary w-full mt-2"
      :disabled="isSaving || !taskId"
      @click="submitVerification"
    >
      {{ isSaving ? 'Saving verification...' : 'Save verification' }}
    </button>
  </section>
</template>

<style scoped lang="scss">
.verification-section {
  border: 1px solid var(--main-border);
  border-radius: 18px;
  background: var(--BgWhite);
  box-shadow: 0 8px 16px color-mix(in srgb, var(--text-strong) 10%, transparent);
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
