<script setup lang="ts">
import Checkbox from 'primevue/checkbox';
import type ItemModel from '../../../Data/models/ItemMode';
import UploadImage from '@/shared/icons/UploadImage.vue';
import type { TitleLocale } from '@/base/core/params/translations_params';
const { title, options } = defineProps<{
  title: string
  options: ItemModel[]
  require_image: boolean
  has_textarea: number
  tag: TitleLocale
}>()

</script>
<template>
  <div class="show-template-document-checkbox">
    <p class="title">{{ title }}</p>
    <p class="tag">{{ tag?.titles?.[0]?.title }}</p>
    <div class="options-container">
      <div class="options">

        <div class="options-box" v-for="(option, index) in options" :key="index">
          <label :for="`checkbox-${index}-${title}`" class="label">{{ option.title }}</label>
          <Checkbox binary disabled :inputId="`checkbox-${index}-${title}`" type="checkbox" class="input" />
        </div>
      </div>

      <UploadImage class="image-upload" v-if="require_image" />
      <div>

      </div>
    </div>

  </div>
</template>


<style scoped>
.tag {
  font-size: 12px;
  font-weight: 500;
  color: gray;
}
</style>
