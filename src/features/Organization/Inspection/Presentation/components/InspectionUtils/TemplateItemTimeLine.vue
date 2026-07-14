<script setup lang="ts">
import AddAnswer from '@/shared/icons/AddAnswer.vue'
import { computed, onMounted, ref } from 'vue'

const emit = defineEmits(['update:data'])
const props = defineProps<{
  itemindex: number
  isRadio?: boolean
  deletedIndex?: number
}>()

interface Answer {
  text: string
  isTextarea: boolean
  textareaType: number
  isUplaod: boolean
  isObservation: boolean
}

const createNewAnswer = (): Answer => ({
  text: '',
  isTextarea: false,
  textareaType: 0,
  isUplaod: false,
  isObservation: false,
})

const Answers = ref([createNewAnswer()])

const visibleAnswers = computed(() => (props.isRadio ? Answers.value.slice(0, 3) : Answers.value))
const canAddAnswer = computed(() => !props.isRadio || Answers.value.length < 3)

const addNewAnswer = () => {
  if (!canAddAnswer.value) return

  Answers.value.push(createNewAnswer())
  UpdateData()
}

const DeleteItem = (index: number) => {
  console.log(index)
  Answers.value.splice(index, 1)
  UpdateData()
}

const UpdateData = () => {
  emit('update:data', Answers.value)
}

const toggleTextarea = (item: Answer) => {
  if (item.isTextarea && !item.textareaType) {
    item.textareaType = 1
  }

  if (!item.isTextarea) {
    item.textareaType = 0
  }

  UpdateData()
}

onMounted(() => {
  emit('update:data', Answers.value)
})

// watch(() => props.deletedIndex, (newVal) => {
//   // console.log(newVal, "newVal");
//   DeleteItem(newVal)
// })
</script>
<template>
  <div class="template-container tempalte-item-conatainer">
    <div class="flex flex-col md:flex-row w-full items-center add-answer">
      <div class="answer-title-group">
        <p class="items-title">{{ $t('add your answers') }}</p>
        <span class="answer-count">{{ visibleAnswers.length }}</span>
      </div>
      <hr class="w-full" />
      <button v-if="canAddAnswer" class="answer-header-action" type="button" @click="addNewAnswer">
        <AddAnswer />
        <span>{{ $t('Add another result') }}</span>
      </button>
    </div>
    <div
      class="answer-row"
      v-for="(item, index) in visibleAnswers"
      :key="index"
      :class="{ active: index === 0 }"
      :style="{ animationDelay: `${index * 0.15}s` }"
    >
      <span class="answer-index">{{ index + 1 }}</span>

      <div class="input-wrapper answer-text-input">
        <input
          type="text"
          :id="`result-${index}-${itemindex}`"
          v-model="item.text"
          class="input"
          :placeholder="$t('add your Item')"
          @input="UpdateData"
        />
      </div>

      <div class="answer-options">
        <div class="text-area-type-container option-pill" :class="item.isTextarea ? 'active' : ''">
          <div class="text-required">
            <label :for="`textarea-${index}-${itemindex}`">{{ $t('typing text') }}</label>
            <input
              type="checkbox"
              :id="`textarea-${index}-${itemindex}`"
              v-model="item.isTextarea"
              class="input"
              @change="toggleTextarea(item)"
            />
          </div>

          <div v-if="item?.isTextarea" class="text-area-type">
            <div class="textarea-choice" :class="item.textareaType == 2 ? 'active' : ''">
              <label :for="`required-${index}-${itemindex}`">{{ $t('required') }}</label>
              <input
                type="radio"
                :id="`required-${index}-${itemindex}`"
                v-model="item.textareaType"
                :value="2"
                @change="UpdateData"
              />
            </div>
            <div class="textarea-choice" :class="item.textareaType == 1 ? 'active' : ''">
              <label :for="`optional-${index}-${itemindex}`">{{ $t('optional') }}</label>
              <input
                type="radio"
                :id="`optional-${index}-${itemindex}`"
                v-model="item.textareaType"
                :value="1"
                @change="UpdateData"
              />
            </div>
          </div>
        </div>

        <div class="option-pill checkbox">
          <label :for="`Uplaod-${index}-${itemindex}`">{{ $t('Upload_photo') }}</label>
          <input
            type="checkbox"
            :id="`Uplaod-${index}-${itemindex}`"
            v-model="item.isUplaod"
            class="input"
            @input="UpdateData"
          />
        </div>
        <div class="option-pill checkbox">
          <label :for="`observation-${index}-${itemindex}`">{{ $t('observation') }}</label>
          <input
            type="checkbox"
            :id="`observation-${index}-${itemindex}`"
            v-model="item.isObservation"
            class="input"
            @input="UpdateData"
          />
        </div>

        <button
          class="remove answer-remove"
          type="button"
          @click.prevent="DeleteItem(index)"
          v-if="Answers.length > 1"
        >
          {{ $t('Remove') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tempalte-item-conatainer {
  width: 100%;
  padding: 12px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 72%, transparent);
  border-radius: 16px;
  background: var(--brand-primary-50);
  grid-column: span 4;
}

.add-answer {
  gap: 10px;
  margin-bottom: 10px;
}

.answer-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-answer .items-title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--brand-primary-800);
  font-size: 13px;
  font-weight: 900;
  white-space: nowrap;
}

.add-answer .items-title::before {
  width: 8px;
  height: 8px;
  content: '';
  border-radius: 999px;
  background: var(--status-success);
  box-shadow: 0 0 0 5px color-mix(in srgb, var(--status-success) 12%, transparent);
}

.add-answer hr {
  min-width: 32px;
  border-color: color-mix(in srgb, var(--brand-primary-500) 12%, transparent);
}

.answer-count {
  display: inline-grid;
  width: 24px;
  height: 24px;
  place-items: center;
  border-radius: 8px;
  color: var(--brand-primary-500);
  font-size: 12px;
  font-weight: 900;
  background: color-mix(in srgb, var(--brand-primary-500) 8%, transparent);
}

.answer-header-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 16%, transparent);
  border-radius: 999px;
  color: var(--brand-primary-500);
  font-size: 12px;
  font-weight: 900;
  white-space: nowrap;
  background: var(--surface-1);
  box-shadow: 0 8px 18px color-mix(in srgb, var(--brand-primary-500) 8%, transparent);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.answer-header-action:hover {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--brand-primary-500) 32%, transparent);
  box-shadow: 0 12px 22px color-mix(in srgb, var(--brand-primary-500) 12%, transparent);
}

.answer-header-action :deep(svg) {
  width: 18px;
  height: 18px;
}

.answer-row {
  display: grid;
  grid-template-columns: 32px minmax(190px, 1.1fr) minmax(0, 2fr);
  gap: 10px;
  align-items: start;
  width: 100%;
  padding: 10px;
  margin-bottom: 8px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 76%, transparent);
  border-radius: 14px;
  background: var(--surface-1);
  box-shadow: 0 8px 22px color-mix(in srgb, var(--brand-primary-900) 3.5%, transparent);
  animation: fadeInUp 0.35s ease both;
}

.answer-row.active {
  border-color: color-mix(in srgb, var(--brand-primary-500) 20%, transparent);
}

.answer-index {
  display: inline-grid;
  width: 28px;
  height: 28px;
  margin-top: 8px;
  place-items: center;
  border-radius: 10px;
  color: var(--text-on-brand);
  font-size: 12px;
  font-weight: 900;
  background: linear-gradient(135deg, var(--brand-primary-500), var(--brand-primary-800));
  box-shadow: 0 8px 16px color-mix(in srgb, var(--brand-primary-500) 16%, transparent);
}

.answer-text-input {
  min-width: 0;
  padding: 0 !important;
}

.answer-text-input input {
  min-height: 42px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 96%, transparent) !important;
  background: var(--surface-1) !important;
  box-shadow: none;
}

.answer-text-input input:focus {
  border-color: color-mix(in srgb, var(--brand-primary-500) 55%, transparent) !important;
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--brand-primary-500) 10%, transparent) !important;
}

.answer-options {
  display: grid;
  grid-template-columns: repeat(3, minmax(112px, 1fr)) auto;
  gap: 8px;
  min-width: 0;
}

.option-pill {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  min-width: 0;
  padding: 7px 10px !important;
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 88%, transparent);
  border-radius: 12px !important;
  background: var(--brand-primary-50);
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.option-pill.active,
.option-pill:has(input:checked) {
  border-color: color-mix(in srgb, var(--brand-primary-500) 42%, transparent);
  background: color-mix(in srgb, var(--brand-primary-500) 8%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--brand-primary-500) 8%, transparent);
}

.option-pill label {
  margin: 0;
  color: var(--brand-primary-700) !important;
  font-size: 11px !important;
  font-weight: 800 !important;
  white-space: nowrap;
  cursor: pointer;
}

.option-pill input[type='checkbox'] {
  width: 16px;
  height: 16px;
  margin-inline-start: 7px;
  accent-color: var(--brand-primary-500);
  cursor: pointer;
}

.text-area-type-container {
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
}

.text-required,
.checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-area-type-container .text-required {
  justify-content: space-between;
  width: 100%;
}

.text-area-type {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4px;
  width: 100%;
  margin-top: 8px;
  padding: 4px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 85%, transparent);
  border-radius: 11px;
  background: color-mix(in srgb, var(--surface-1) 72%, transparent);
}

.textarea-choice {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  padding: 4px 8px;
  overflow: hidden;
  border-radius: 8px;
  color: var(--text-soft);
  background: transparent;
  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.textarea-choice label {
  width: 100%;
  color: inherit !important;
  font-size: 11px !important;
  font-weight: 900 !important;
  text-align: center;
  cursor: pointer;
}

.textarea-choice.active {
  color: var(--brand-primary-500);
  background: var(--surface-1);
  box-shadow: 0 6px 14px color-mix(in srgb, var(--brand-primary-500) 12%, transparent);
}

.text-area-type input[type='radio'] {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0 !important;
  margin: 0;
  cursor: pointer;
  opacity: 0;
}

.answer-remove {
  min-height: 42px;
  padding: 0 10px;
  border: 1px solid color-mix(in srgb, var(--status-danger) 20%, transparent);
  border-radius: 12px;
  color: var(--status-danger);
  font-size: 11px;
  font-weight: 900;
  background: color-mix(in srgb, var(--status-danger) 8%, transparent);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease;
}

.answer-remove:hover {
  transform: translateY(-1px);
  color: var(--text-on-brand);
  background: var(--status-danger);
}

@media (max-width: 768px) {
  .tempalte-item-conatainer {
    padding: 12px;
  }

  .answer-row {
    grid-template-columns: 28px 1fr;
  }

  .answer-options {
    grid-column: 1 / -1;
    grid-template-columns: 1fr;
  }

  .option-pill {
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .answer-remove {
    width: 100%;
  }

  .answer-header-action {
    width: 100%;
  }

  .add-answer hr {
    display: none;
  }
}
</style>
