<script setup lang="ts">
import DropDown from '@/assets/images/DropDown.png'
import TextAreaAction from '@/assets/images/TextAreaAction.png'
import Radio from '@/assets/images/Radio.png'
import Checkbox from '@/assets/images/Checkbox.png'
import { ref } from 'vue'
import { ActionsEnum } from '../../../Core/Enum/ActionsEnum'
const SelectedAction = ref(ActionsEnum.RADIOBUTTON)
const emit = defineEmits(['update:data'])

const UpdateData = () => {
  emit('update:data', SelectedAction.value)
}
</script>
<template>
  <div class="template-types-container">
    <div class="template-types-heading">
      <p class="template-title">{{ $t('result_type') }}</p>
      <span class="template-title-note">Choose how inspectors answer this item.</span>
    </div>

    <div class="action-box drop-down" :class="{ selected: SelectedAction == ActionsEnum.DROPDOWN }">
      <label for="drop-down">
        <span>drop-down select</span>
        <img :src="DropDown" alt="dropdown" />
      </label>
      <input
        type="radio"
        v-model="SelectedAction"
        name="action"
        id="drop-down"
        :value="ActionsEnum.DROPDOWN"
        @change="UpdateData"
      />
    </div>
    <div class="action-box text-area" :class="{ selected: SelectedAction == ActionsEnum.TEXTAREA }">
      <label for="text-area">
        <span>text area</span>
        <img :src="TextAreaAction" alt="text area" />
      </label>
      <input
        type="radio"
        v-model="SelectedAction"
        name="action"
        id="text-area"
        :value="ActionsEnum.TEXTAREA"
        @change="UpdateData"
      />
    </div>
    <div class="action-box radio" :class="{ selected: SelectedAction == ActionsEnum.RADIOBUTTON }">
      <label for="radio">
        <span>Single Choice</span>
        <img :src="Radio" alt="radio button" />
      </label>
      <input
        type="radio"
        v-model="SelectedAction"
        name="action"
        id="radio"
        :value="ActionsEnum.RADIOBUTTON"
        @change="UpdateData"
      />
    </div>
    <div class="action-box checkbox" :class="{ selected: SelectedAction == ActionsEnum.CHECKBOX }">
      <label for="checkbox">
        <span>Multiple Choice</span>
        <img :src="Checkbox" alt="checkbox" />
      </label>
      <input
        type="radio"
        v-model="SelectedAction"
        name="action"
        id="checkbox"
        :value="ActionsEnum.CHECKBOX"
        @change="UpdateData"
      />
    </div>
  </div>
</template>

<style scoped>
.template-types-container {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 0;
}

.template-types-heading {
  display: flex;
  grid-column: 1 / -1;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.template-title {
  margin: 0;
  color: #041953;
  font-size: var(--md-size);
  font-weight: 900;
}

.template-title-note {
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
}

.action-box {
  position: relative;
  min-height: 132px;
  overflow: hidden;
  border: 1px solid rgba(221, 226, 237, 0.86);
  border-radius: 16px;
  background: #fff;
  cursor: pointer;
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease,
    background-color 0.22s ease;
}

.action-box::before {
  position: absolute;
  inset-inline-start: 0;
  top: 12px;
  bottom: 12px;
  width: 4px;
  content: '';
  border-radius: 999px;
  background: transparent;
  transition: background 0.22s ease;
}

.action-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(15, 25, 39, 0.08);
}

.action-box.selected {
  border-color: rgba(29, 78, 216, 0.38);
  background: linear-gradient(135deg, rgba(29, 78, 216, 0.08), rgba(255, 255, 255, 0.96));
  box-shadow: 0 14px 28px rgba(29, 78, 216, 0.12);
}

.action-box.selected::before {
  background: linear-gradient(180deg, #1d4ed8, #4aae3a);
}

.action-box label {
  display: flex;
  height: 100%;
  min-height: 132px;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  padding: 14px;
  cursor: pointer;
}

.action-box span {
  color: #3d4c5e;
  font-size: 13px;
  font-weight: 900;
  text-transform: capitalize;
}

.action-box.selected span {
  color: #1d4ed8;
}

.action-box img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0.92;
  filter: drop-shadow(0 10px 12px rgba(15, 25, 39, 0.08));
}

.action-box input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

@media (max-width: 1100px) {
  .template-types-container {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .template-types-container {
    grid-template-columns: 1fr;
  }

  .template-types-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
