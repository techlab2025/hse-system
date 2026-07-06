<script setup lang="ts">
import AddAnswer from '@/shared/icons/AddAnswer.vue'
import DeleteItemAction from '@/shared/icons/DeleteItemAction.vue'
import { computed, onMounted, ref } from 'vue'

const emit = defineEmits(['update:data'])
const maxAnswers = 5
const Answers = ref([
  {
    title: '',
    is_upload: false,
    isTextAreaRequired: false,
    textarea_type: 0,
    has_auto_observation: false,
  },
])

const canAddAnswer = computed(() => Answers.value.length < maxAnswers)

const addNewAnswer = () => {
  if (!canAddAnswer.value) return

  Answers.value.push({
    title: '',
    is_upload: false,
    isTextAreaRequired: false,
    textarea_type: 0,
    has_auto_observation: false,
  })
  UpdateData()
}

const DeleteItem = (index: number) => {
  if (Answers.value.length <= 1) return
  Answers.value.splice(index, 1)
  UpdateData()
}

const UpdateData = () => {
  emit(
    'update:data',
    Answers.value.filter((answer) => answer.title.trim() !== ''),
  )
}
const toggleTextarea = (item: any) => {
  item.textarea_type = item.isTextAreaRequired ? 1 : 0
  UpdateData()
}
onMounted(() => {
  emit(
    'update:data',
    Answers.value.filter((answer) => answer.title.trim() !== ''),
  )
})
</script>
<template>
  <div class="template-container choice-builder">
    <div class="choice-builder-header">
      <div>
        <p class="title">Add Your Answers</p>
        <p class="subtitle">You must add at least two items and a maximum of 5 choices</p>
      </div>
      <!-- <button v-if="canAddAnswer" class="choice-add-btn" type="button" @click="addNewAnswer">
        <AddAnswer />
        <span>Add choice</span>
      </button> -->
    </div>

    <div class="choice-list">
      <div
        class="choice-row"
        v-for="(item, index) in Answers"
        :key="index"
        :style="{ animationDelay: `${index * 0.08}s` }"
      >
        <span class="choice-index">{{ index + 1 }}</span>

        <div class="input-wrapper choice-text">
          <input
            type="text"
            v-model="item.title"
            class="input"
            placeholder="Enter choice text"
            @input="UpdateData"
          />
        </div>

        <div class="choice-options">
          <label class="choice-pill" :class="{ active: item.is_upload }">
            <span>Upload photo</span>
            <input type="checkbox" v-model="item.is_upload" @change="UpdateData" />
          </label>

          <label class="choice-pill" :class="{ active: item.isTextAreaRequired }">
            <span>Typing text</span>
            <input
              type="checkbox"
              v-model="item.isTextAreaRequired"
              @change="toggleTextarea(item)"
            />
          </label>

          <label class="choice-pill" :class="{ active: item.has_auto_observation }">
            <span>Auto observation</span>
            <input type="checkbox" v-model="item.has_auto_observation" @change="UpdateData" />
          </label>

          <label class="choice-pill subtle" :class="{ active: item.textarea_type }">
            <span>Text required</span>
            <input
              :disabled="!item.isTextAreaRequired"
              type="checkbox"
              value="1"
              v-model="item.textarea_type"
              @change="UpdateData"
            />
          </label>

          <button
            v-if="Answers.length > 1"
            class="choice-remove-btn"
            type="button"
            @click="DeleteItem(index)"
          >
            <DeleteItemAction />
            <span>Remove</span>
          </button>
          <button v-if="canAddAnswer" class="choice-inline-add" type="button" @click="addNewAnswer">
            <AddAnswer />
            <span>Add</span>
          </button>
        </div>
      </div>

      <!-- <button v-if="canAddAnswer" class="choice-footer-add" type="button" @click="addNewAnswer">
        <AddAnswer />
        <span>Add another choice</span>
      </button> -->
    </div>
  </div>
</template>

<style scoped>
.choice-builder {
  width: 100%;
  min-width: 0;
  margin-top: 14px;
  padding: 14px;
  overflow: hidden;
  border: 1px solid rgba(221, 226, 237, 0.8);
  border-radius: 18px;
  background: #fbfcff;
}

.choice-builder-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.title {
  margin: 0;
  color: #041953;
  font-size: var(--md-size);
  font-weight: 900;
}

.subtitle {
  margin-top: 3px;
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
}

.choice-add-btn,
.choice-footer-add,
.choice-inline-add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 38px;
  padding: 0 13px;
  border: 1px solid rgba(29, 78, 216, 0.18);
  border-radius: 999px;
  color: #fff;
  font-size: 12px;
  font-weight: 900;
  background: linear-gradient(135deg, #1d4ed8, #041953);
  box-shadow: 0 12px 22px rgba(29, 78, 216, 0.16);
  cursor: pointer;
}

.choice-inline-add {
  color: #1d4ed8;
  background: rgba(29, 78, 216, 0.08);
  box-shadow: none;
}

.choice-add-btn :deep(svg),
.choice-footer-add :deep(svg),
.choice-inline-add :deep(svg) {
  width: 18px;
  height: 18px;
}

.choice-add-btn :deep(svg path),
.choice-footer-add :deep(svg path) {
  fill: #fff;
}

.choice-inline-add :deep(svg path) {
  fill: #1d4ed8;
}

.choice-list {
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  gap: 9px;
}

.choice-row {
  display: grid;
  width: 100%;
  min-width: 0;
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
  padding: 10px;
  border: 1px solid rgba(221, 226, 237, 0.76);
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 8px 22px rgba(15, 25, 39, 0.035);
}

.choice-index {
  display: inline-grid;
  width: 28px;
  height: 28px;
  margin-top: 8px;
  place-items: center;
  border-radius: 10px;
  color: #fff;
  font-size: 12px;
  font-weight: 900;
  background: linear-gradient(135deg, #1d4ed8, #041953);
}

.choice-text {
  width: 100%;
  min-width: 0;
  padding: 0 !important;
}

.choice-text input {
  width: 100%;
  min-height: 42px;
  border: 1px solid rgba(221, 226, 237, 0.95) !important;
  background: #fff !important;
}

.choice-options {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: repeat(auto-fit, minmax(132px, 1fr));
  gap: 8px;
  width: 100%;
  min-width: 0;
}

.choice-pill {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 7px;
  min-width: 0;
  min-height: 42px;
  padding: 7px 10px;
  border: 1px solid rgba(221, 226, 237, 0.86);
  border-radius: 12px;
  color: #3d4c5e;
  font-size: 11px;
  font-weight: 900;
  background: #f8fafc;
  cursor: pointer;
}

.choice-pill span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.choice-pill.active {
  border-color: rgba(29, 78, 216, 0.4);
  color: #1d4ed8;
  background: rgba(29, 78, 216, 0.08);
}

.choice-pill.subtle:not(.active) {
  opacity: 0.58;
}

.choice-pill input {
  width: 16px;
  height: 16px;
  accent-color: #1d4ed8;
}

.choice-remove-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 42px;
  min-width: 0;
  padding: 0 10px;
  border: 1px solid rgba(226, 53, 53, 0.2);
  border-radius: 12px;
  color: #e23535;
  font-size: 11px;
  font-weight: 900;
  background: rgba(226, 53, 53, 0.08);
  cursor: pointer;
}

.choice-remove-btn:hover {
  color: #fff;
  background: #e23535;
}

.choice-remove-btn:hover :deep(svg path) {
  stroke: #fff;
}

.choice-footer-add {
  align-self: flex-start;
  margin-top: 3px;
}

@media (max-width: 1100px) {
  .choice-options {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .choice-builder-header {
    align-items: stretch;
    flex-direction: column;
  }

  .choice-row,
  .choice-options {
    grid-template-columns: 1fr;
  }

  .choice-add-btn,
  .choice-footer-add {
    width: 100%;
  }
}
</style>
