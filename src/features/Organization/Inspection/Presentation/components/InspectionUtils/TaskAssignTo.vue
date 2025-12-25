<script setup lang="ts">
import ImportantIcon from '@/shared/icons/ImportantIcon.vue';
import AssignTo from "@/assets/images/AssignTo.png";
import type TitleInterface from '@/base/Data/Models/title_interface';
import { ref } from 'vue';
import { AssignToTypeEnum } from '../../../Core/Enum/AssignToTypesEnum';
const emit = defineEmits(['update:data'])
const props = defineProps<{
  title: string
  options: TitleInterface[]
  showHeader: boolean
}>()

const SelectedOption = ref(AssignToTypeEnum.MACHINE)
const UpdatData = (data) => {
  emit('update:data', SelectedOption.value)
}
</script>
<template>
  <div class="assign-to-container">
    <div class="assign-to-header" v-if="showHeader">
      <img :src="AssignTo" alt="assign to" class="img">
      <div class="title-container">
        <p class="title">{{ title }}</p>
        <ImportantIcon />
      </div>
    </div>
    <div class="assign-to-contect">
      <div class="option" v-for="(option, index) in options" :key="option.id"
        :class="SelectedOption == option?.id ? 'active' : ''">
        <label :for="`${option.title}-${option.id}`">{{ option.title }}</label>
        <input type="radio" v-model="SelectedOption" :value="option.id" :id="`${option.title}-${option.id}`"
          @change="UpdatData">
      </div>
    </div>
  </div>
</template>
