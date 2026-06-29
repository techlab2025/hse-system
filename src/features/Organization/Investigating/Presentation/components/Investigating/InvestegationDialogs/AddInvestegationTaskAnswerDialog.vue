<script setup lang="ts">
import { computed, ref } from 'vue'
import Dialog from 'primevue/dialog'
import ChatForward from '@/assets/images/ChatForward.png'
import CreateInvestigationTaskResultController from '../../../controllers/investegationResult/CreateInvestigationTaskResultController'
import CreateInvestigationTaskResultParams from '@/features/Organization/Investigating/Core/params/investegationResult/CreateInvestigationTaskResultParams'
import { useRoute, useRouter } from 'vue-router'

const visible = ref(false)
const props = defineProps<{
  task: string
  taskId: number
}>()
const answer = ref('')
const isSubmitting = ref(false)
const emit = defineEmits(['submitted'])
const router = useRouter()
const route = useRoute()
const canSubmit = computed(() => !!answer.value?.trim() && !isSubmitting.value)
const CreateInvestegationTaskResult = async () => {
  if (!canSubmit.value) return

  isSubmitting.value = true
  const createInvestigationTaskResultController =
    CreateInvestigationTaskResultController.getInstance()
  const createInvestigationTaskResultParams = new CreateInvestigationTaskResultParams(
    props.taskId,
    answer.value,
  )
  try {
    await createInvestigationTaskResultController.CreateInvestigationTaskResult(
      createInvestigationTaskResultParams,
      router,
      null,
      route,
    )
    emit('submitted', answer.value)
    visible.value = false
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <button class="answer-trigger" @click="visible = true">Answer</button>
  <Dialog v-model:visible="visible" modal :style="{ width: '40rem', maxWidth: '92vw' }">
    <template #header>
      <div class="investigation-answer-header flex justify-start items-center gap-2">
        <img :src="ChatForward" alt="chat" width="40" height="40" />
        <h3 class="title">Add your answer</h3>
      </div>
    </template>

    <div class="answer-content">
      <p class="questions-title">{{ task }}</p>
      <div class="input-wrapper">
        <label class="answer-label" for="answer">your answer</label>
        <textarea name="answer" id="answer" class="input" v-model="answer"></textarea>
      </div>
      <button @click="CreateInvestegationTaskResult" class="confirm-answer" :disabled="!canSubmit">
        {{ isSubmitting ? 'Saving...' : 'Confirm' }}
      </button>
    </div>
  </Dialog>
</template>

<style scoped lang="scss">
.investigation-answer-header {
  border-bottom: 1px solid #e6edf7;
  width: 100%;
  padding-bottom: 15px;
}

.investigation-answer-header .title {
  width: 100%;
  color: #0f172a;
  font-size: 22px;
  font-weight: 800;
}

.answer-content {
  display: flex;
  flex-direction: column;
  gap: 12px;

  width: 100%;

  .questions-title {
    border: 1px solid #d9dbe9;
    padding: 14px;
    border-radius: 12px;
    width: 100%;
    background: #f8fafc;
    color: #0f172a;
    font-weight: 700;
  }

  .answer-label {
    color: #202020;
    font-size: 16px;
    font-weight: 700;
  }
}

.answer-trigger,
.confirm-answer {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  padding: 9px 14px;
  border: 0;
  border-radius: 8px;
  background: var(--PrimaryColor);
  color: #ffffff;
  font-family: 'Bold';
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 18px rgba(29, 78, 216, 0.18);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
}

.confirm-answer {
  width: 100%;
  margin-top: 10px;
}
</style>
