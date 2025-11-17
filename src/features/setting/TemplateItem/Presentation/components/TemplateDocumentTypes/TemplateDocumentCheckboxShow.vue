<script setup lang="ts">
import Checkbox from 'primevue/checkbox';
const props = defineProps<{
  title: string
  options: Array<{ label: string; value: string | number }>

}>()

</script>
<template>
  <div class="show-template-document-checkbox">
    <p class="title">{{ title }}</p>
    <div class="options-container">
      <div class="options-box" v-for="(option, index) in options" :key="index">
        <label :for="`checkbox-${index}-${title}`" class="label">{{ option.label }}</label>
        <Checkbox binary disabled :inputId="`checkbox-${index}-${title}`" type="checkbox" class="input"/>
      </div>
    </div>
  </div>
</template>
