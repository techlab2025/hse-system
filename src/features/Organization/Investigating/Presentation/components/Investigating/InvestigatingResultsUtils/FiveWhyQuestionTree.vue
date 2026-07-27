<script setup lang="ts">
import TitleInterface from '@/base/Data/Models/title_interface'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import AddAnswer from '@/shared/icons/AddAnswer.vue'
import DeleteItemAction from '@/shared/icons/DeleteItemAction.vue'
import { onMounted, ref } from 'vue'
import DatePicker from 'primevue/datepicker'
import FieldHelpIcon from '@/shared/FormInputs/FieldHelpIcon.vue'

const emit = defineEmits(['update:data'])
const MAX_ANSWERS = 5

const Answers = ref([
  {
    answer: ' ',
    question: '',
  },
])

const addNewAnswer = () => {
  if (Answers.value.length >= MAX_ANSWERS) return

  Answers.value.push({
    answer: '',
    question: '',
  })
  UpdateData()
}

const DeleteItem = (index: number) => {
  if (Answers.value.length <= 1) return

  Answers.value.splice(index, 1)
  UpdateData()
}

const UpdateData = () => {
  emit('update:data', Answers.value)
}
onMounted(() => {
  emit('update:data', Answers.value)
})
</script>
<template>
  <div class="template-container">
    <div class="heirarchy-info">
      <div class="timeline-container">
        <div class="timeline-wrapper">
          <div class="timeline-line"></div>

          <div
            class="timeline-item"
            v-for="(item, index) in Answers"
            :key="index"
            :class="{ active: index === 0 }"
            :style="{ animationDelay: `${index * 0.15}s` }"
          >
            <div class="timeline-marker">
              <div class="timeline-dot">
                <div class="timeline-dot-inner"></div>
                <div class="timeline-pulse"></div>
              </div>

              <div class="timeline-icon">
                <DeleteItemAction
                  class="cursor-pointer"
                  v-if="Answers.length > 1"
                  @click="DeleteItem(index)"
                />
                <AddAnswer
                  v-if="index === Answers.length - 1 && Answers.length < MAX_ANSWERS"
                  @click="addNewAnswer"
                  class="cursor-pointer"
                />
              </div>
            </div>

            <div class="timeline-content">
              <div class="timeline-contect-select w-full flex flex-col">
                <div class="input-wrapper w-full">
                  <div class="flex items-center gap-2">
                    <label :for="`why-question-${index}`">{{ $t('question') }}</label
                    ><FieldHelpIcon
                      text="Ask why the previous event or condition occurred to move closer to the root cause."
                    />
                  </div>
                  <input
                    type="text"
                    :id="`why-question-${index}`"
                    v-model="item.question"
                    class="input"
                    placeholder="add your question"
                    @input="UpdateData"
                  />
                </div>
                <div class="input-wrapper w-full">
                  <div class="flex items-center gap-2">
                    <label :for="`why-answer-${index}`">{{ $t('answer') }}</label
                    ><FieldHelpIcon
                      text="Provide an evidence-based answer that explains the cause, not just the symptom."
                    />
                  </div>
                  <textarea
                    :id="`why-answer-${index}`"
                    v-model="item.answer"
                    class="input"
                    placeholder="add your answer"
                    @input="UpdateData"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.template-container,
.heirarchy-info,
.timeline-container,
.timeline-wrapper,
.timeline-item,
.timeline-content {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
}

.timeline-content .input-wrapper,
.timeline-content input,
.timeline-content textarea {
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.timeline-icon {
  display: flex;
  align-items: center;
  gap: 8px;
}

.timeline-contect-select {
  display: flex;
  flex-direction: column !important;
  gap: 12px;
}

@media (max-width: 768px) {
  .timeline-wrapper {
    padding-left: 0;
    padding-inline-start: 0;
  }

  .timeline-line,
  .timeline-dot {
    display: none;
  }

  .timeline-item {
    position: relative;
    padding-top: 44px;
    margin-bottom: 14px;
    border: 1px solid var(--brand-primary-100);
    border-radius: 8px;
    background: var(--surface-1);
    grid-template-columns: 1fr;
  }

  .timeline-marker {
    position: absolute;
    inset-inline-start: auto;
    inset-inline-end: 10px;
    top: 8px;
    width: auto;
    z-index: 3;
    padding-top: 0;
  }

  .timeline-icon {
    display: flex;
    flex-direction: row;
    gap: 8px;
    width: auto;
    height: auto;
    border: 0;
    background: transparent;
    box-shadow: none;
  }

  .timeline-icon > svg,
  .timeline-icon > :deep(svg) {
    width: 32px;
    height: 32px;
    padding: 6px;
    border-radius: 50%;
    background: var(--brand-primary-50);
    border: 1px solid color-mix(in srgb, var(--brand-primary-500) 20%, transparent);
    cursor: pointer;
  }

  .timeline-content {
    padding: 10px 12px 12px;
    border: 0;
    box-shadow: none;
    background: transparent;
  }
}
</style>
