<script setup lang="ts">
import TitleInterface from '@/base/Data/Models/title_interface'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import { ref, watch } from 'vue'
import UploadMultiImage from '@/shared/HelpersComponents/UploadMultiImage.vue'

const emit = defineEmits(['update:data', 'update:images'])

const props = defineProps<{
  title: string
  item_id: number
  options: TitleInterface[]
  require_image: boolean
}>()
const Options = ref(props.options)


const Img = ref()
const UpdateImg = (data: string) => {
  Img.value = data
  UpdateData()
}



const SelectedOption = ref<TitleInterface>()
const SetSelectedOption = (data: TitleInterface) => {
  if (data) {
    SelectedOption.value = data
    UpdateData();
  }
}


watch(() => props.options, (newValue) => {
  Options.value = newValue
})

const UpdateData = () => {

  emit('update:data', {
    itemId: props.item_id,
    selected: SelectedOption.value?.id,
    img: Img.value
  })
}
</script>

<template>
  <div class="show-template-document-select not-disabled">
    <div class="options-container">
      <div class="input-wrapper">
        <label>{{ title }}</label>
        <div class="col-span-4 md:col-span-2 input-wrapper">
          <CustomSelectInput :label="''" :static-options="Options" @update:modelValue="SetSelectedOption"
            :modelValue="SelectedOption" id="option" />
        </div>
      </div>

      <UploadMultiImage v-if="require_image" class="image-upload" @update:images="UpdateImg" />
    </div>
  </div>
</template>
