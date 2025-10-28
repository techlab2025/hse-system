<script setup lang="ts">
import { ref } from 'vue';
import ColorSelection from '../WidgetUtils/ColorSelection.vue';
import RadioSection from '../WidgetUtils/RadioSection.vue';


const SelectedAvailable = ref();
const SelectedColor = ref();
const colors = ref([
  "#1D4ED8",
  "#EAEAEA",
  "#9760F6",
  "#FBF5B5",
  "#4CAF50"
])


</script>

<template>
  <ColorSelection :title="`chart color`" :colors="colors" @update:value="SelectedColor = $event" />
  <RadioSection :title="`Available to`" :selections="['anyone', 'only me']"
    @update:value="SelectedAvailable = $event" />
</template>
