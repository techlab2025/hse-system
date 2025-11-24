<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['update:data'])
const TextValue = ref('')
const props = defineProps<{
  title: string
  item_id: number
  require_image: boolean
}>()
const UpdateData = () => {
  emit('update:data', {
    itemid: props.item_id,
    value: TextValue.value,
  })
}


</script>
<template>
  <div class="show-template-document-select">
    <div class="options-container">
      <div class="input-wrapper">
        <label for="">{{ title }}</label>
        <textarea id="selec" v-model="TextValue" :label="title" class="input" @change="UpdateData"></textarea>
      </div>
    </div>
    <!-- <UploadImage class="image-upload" v-if="require_image" /> -->
  </div>
</template>
