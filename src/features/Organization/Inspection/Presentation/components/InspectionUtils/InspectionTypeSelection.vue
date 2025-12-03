<script setup lang="ts">
import ImportantIcon from '@/shared/icons/ImportantIcon.vue';
import AssignTo from "@/assets/images/AssignTo.png";
import type TitleInterface from '@/base/Data/Models/title_interface';
import { ref } from 'vue';
import type { InspectionTypeEnum } from '../../../Core/Enum/InspectionTypeEnum';
const emit = defineEmits(['update:data'])
const props = defineProps<{
  title: string
  options: TitleInterface[]
  selectedtype: InspectionTypeEnum
}>()

const SelectedOption = ref<InspectionTypeEnum>(props.selectedtype)
const UpdatData = (data) => {
  emit('update:data', SelectedOption.value)
}
</script>
<template>
  <div class="inspection-type-container">
    <div class="inspection-header">
      <div class="title-container">
        <p class="title">{{ title }}</p>
        <ImportantIcon />
      </div>
    </div>
    <div class="inspection-type-contect">
      <div class="option" v-for="(option, index) in options" :key="index"
        :class="SelectedOption == option?.id ? 'active' : ''">
        <label :for="`${option.title}-${option.id}`">{{ option.title }}</label>
        <input type="radio" v-model="SelectedOption" :value="option.id" :id="`${option.title}-${option.id}`"
          @change="UpdatData">
      </div>
    </div>
  </div>
</template>
