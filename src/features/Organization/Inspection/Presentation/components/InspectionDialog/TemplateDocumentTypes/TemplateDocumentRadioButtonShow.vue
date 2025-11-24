<script setup lang="ts">
import type ItemModel from '@/features/setting/TemplateItem/Data/models/ItemMode'
import UploadMultiImage from '@/shared/HelpersComponents/UploadMultiImage.vue'
import UploadImage from '@/shared/icons/UploadImage.vue'
import RadioButton from 'primevue/radiobutton'
import { ref } from 'vue';

const emit = defineEmits(['update:data'])
const props = defineProps<{
  title: string
  item_id: number
  options: ItemModel[]
  require_image: boolean
}>()

const Img = ref()
const UpdateImg = (data: string) => {
  Img.value = data
  UpdateData()
}

const SelectedOptions = ref<{ id: number; value: number }>({
  id: props.item_id,
  value: 0
})

const UpdateOptions = (value: number) => {

  if (SelectedOptions.value.value === value) {
    SelectedOptions.value.value = 0
  } else {
    SelectedOptions.value.value = value
  }

  UpdateData()
}

const UpdateData = () => {
  // emit('update:data', {
  //   itemid: props.item_id,
  //   value: SelectedOptions.value.value,
  //   img: Img.value
  // })
  emit('update:data', {
    itemid: props.item_id,
    value: SelectedOptions.value.value,
    img: Img.value
  })

}


</script>

<template>
  <div class="show-template-document-radio">
    <p class="title">{{ title }}</p>

    <div class="options-container">
      <div class="options">
        <div class="options-box" v-for="(option, index) in options" :key="index">

          <label :for="`radio-${index}-${title}-${option.id}`" class="label">
            {{ option.title }}
          </label>

          <RadioButton class="input" :value="option.id" :modelValue="SelectedOptions.value"
            @update:modelValue="UpdateOptions" :inputId="`radio-${index}-${title}-${option.id}`"
            :name="`radio-${props.item_id}`" />
        </div>
      </div>

      <UploadMultiImage v-if="require_image" @update:images="UpdateImg" class="image-upload" />
    </div>
  </div>
</template>
