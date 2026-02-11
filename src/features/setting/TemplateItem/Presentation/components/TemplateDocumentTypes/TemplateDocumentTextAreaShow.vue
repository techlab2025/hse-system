<script setup lang="ts">
import type TitleInterface from '@/base/Data/Models/title_interface';
import UploadImage from '@/shared/icons/UploadImage.vue';
const { title } = defineProps<{
  title: string
  require_image: boolean
  tag: string

}>()

</script>
<template>
  <div class="show-template-document-select">
    <div class="options-container">
      <div class="input-wrapper">
        <label for="">{{ title }}</label>
        <p>{{ tag }}</p>
        <textarea id="selec" :label="title" :disabled="true" class="input" />
      </div>
    </div>
    <!-- <UploadImage class="image-upload" v-if="require_image" /> -->

  </div>
</template>
