<script setup lang="ts">
import DropDown from "@/assets/images/DropDown.png";
import TextAreaAction from "@/assets/images/TextAreaAction.png";
import Radio from "@/assets/images/Radio.png";
import Checkbox from "@/assets/images/Checkbox.png";
import { ref } from "vue";
import { ActionsEnum } from "../../../Core/Enum/ActionsEnum";
const SelectedAction = ref(ActionsEnum.RADIOBUTTON);
const emit = defineEmits(['update:data'])

const UpdateData = () => {
  emit('update:data', SelectedAction.value)
}
</script>
<template>
  <div class="template-types-container">
    <p class="template-title">Type</p>
    <div class="action-box drop-down" :class="{ selected: SelectedAction == ActionsEnum.DROPDOWN }">
      <label for="drop-down">
        <span>drop-down select</span>
        <img :src="DropDown" alt="dropdown" />
      </label>
      <input type="radio" v-model="SelectedAction" name="action" id="drop-down" :value="ActionsEnum.DROPDOWN"
        @change="UpdateData" />
    </div>
    <div class="action-box text-area" :class="{ selected: SelectedAction == ActionsEnum.TEXTAREA }">
      <label for="text-area">
        <span>text area</span>
        <img :src="TextAreaAction" alt="text area" />
      </label>
      <input type="radio" v-model="SelectedAction" name="action" id="text-area" :value="ActionsEnum.TEXTAREA"
        @change="UpdateData" />
    </div>
    <div class="action-box radio" :class="{ selected: SelectedAction == ActionsEnum.RADIOBUTTON }">
      <label for="radio">
        <span>radio button</span>
        <img :src="Radio" alt="radio button" />
      </label>
      <input type="radio" v-model="SelectedAction" name="action" id="radio" :value="ActionsEnum.RADIOBUTTON"
        @change="UpdateData" />
    </div>
    <div class="action-box checkbox" :class="{ selected: SelectedAction == ActionsEnum.CHECKBOX }">
      <label for="checkbox">
        <span>check box</span>
        <img :src="Checkbox" alt="checkbox" />
      </label>
      <input type="radio" v-model="SelectedAction" name="action" id="checkbox" :value="ActionsEnum.CHECKBOX"
        @change="UpdateData" />
    </div>
  </div>
</template>
