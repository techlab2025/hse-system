<script setup lang="ts">
import type TitleInterface from '@/base/Data/Models/title_interface';
import UploadImage from '@/shared/icons/UploadImage.vue';
import type { TitleLocale } from '@/base/core/params/translations_params';
const { title } = defineProps<{
  title: string
  require_image: boolean
  tag: TitleLocale

}>()

</script>
<template>
  <div class="show-template-document-select">
    <div class="options-container">
      <div class="input-wrapper">
        <label for="">{{ title }}</label>
        <p class="tag">{{ tag?.titles?.[0]?.title }}</p>
        <textarea id="selec" :label="title" :disabled="true" class="input" />
      </div>
    </div>
    <!-- <UploadImage class="image-upload" v-if="require_image" /> -->

  </div>
</template>
<style scoped>
.tag {
  font-size: 12px;
  font-weight: 500;
  color: gray;
}
</style>
