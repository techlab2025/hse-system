<script setup lang="ts">
import SelectedIcon from '@/shared/icons/SelectedIcon.vue';
import { ref } from 'vue';
import Checkbox from 'primevue/checkbox';

const props = defineProps<{
  title: string
  colors: string[]
}>()

const emit = defineEmits(['update:value'])

const mainColor = ref(false);
const selectedColor = ref("");

const MainColorSelection = (data) => {
  if (data.target.checked) {
    selectedColor.value = "#1D4ED8"
  }
  else {
    selectedColor.value = ""
  }
  emit("update:value", selectedColor.value)

}

const UpdateData = () => {
  emit("update:value", selectedColor.value)
}
</script>
<template>
  <div class="chart-color-container">

    <div class="color-selection-container">
      <p class="title">{{ title }}</p>
      <div class="colors">
        <div v-for="(color, index) in colors" :key="index" class="color-selection"
          :class="{ selected: selectedColor === color, maincolor: mainColor }">
          <label :for="`${title}-color-${index}`" :style="{ backgroundColor: color }"></label>
          <input type="radio" name="color" :id="`${title}-color-${index}`" :value="color" v-model="selectedColor"
            @change="UpdateData" />
          <SelectedIcon v-if="selectedColor === color" class="selected-icon" />
        </div>
      </div>
    </div>

    <div class="main-color">
      <!-- <input id="main-color" type="checkbox" v-model="mainColor" @change="MainColorSelection"> -->
      <Checkbox :id="`${title}-main-color`" v-model="mainColor" @change="MainColorSelection" binary />
      <label :for="`${title}-main-color`" @click="mainColor = !mainColor">Main Color</label>
    </div>
  </div>

</template>
