<script setup lang="ts">
import type TitleInterface from '@/base/Data/Models/title_interface';
const props = defineProps<{
  title: string

}>()

</script>
<template>
  <div class="show-template-document-select">
    <div class="options-container">
      <div class="input-wrapper">
        <label for="">{{ title }}</label>
        <textarea id="selec" :label="title" :disabled="true" class="input" />
      </div>
    </div>
  </div>
</template>
