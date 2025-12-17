<script setup lang="ts">
import TitleInterface from '@/base/Data/Models/title_interface'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import { ref, watch } from 'vue'
import UploadMultiImage from '@/shared/HelpersComponents/UploadMultiImage.vue'
import type TaskResultItemModel from '@/features/Organization/Inspection/Data/models/FetchTaskResultModels/ItemTasksResultModel'

const emit = defineEmits(['update:data', 'update:images'])

const props = defineProps<{
  title: string
  item_id: number
  options: TitleInterface[]
  require_image: boolean
  selected_data?: TaskResultItemModel // Changed from array to single item
}>()

const Options = ref(props.options)

const Img = ref()
const UpdateImg = (data: string) => {
  Img.value = data
  UpdateData()
}

const SelectedOption = ref<TitleInterface>(
  new TitleInterface({
    id: 0,
    title: ''
  })
)

const SetSelectedOption = (data: TitleInterface) => {
  if (data) {
    SelectedOption.value = data
    UpdateData()
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

watch(
  () => props.selected_data,
  (newValue) => {
    if (newValue?.answers?.[0]?.templateItemOption) {
      SelectedOption.value = new TitleInterface({
        id: newValue.answers[0].templateItemOption.id || 0,
        title: newValue.answers[0].templateItemOption.title || ''
      })
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="show-template-document-select not-disabled">
    <div class="options-container">
      <div class="input-wrapper">
        <label>{{ title }}</label>
        <div class="col-span-4 md:col-span-2 input-wrapper">
          <CustomSelectInput
            :label="''"
            :static-options="Options"
            @update:modelValue="SetSelectedOption"
            :modelValue="SelectedOption"
            id="option"
          />
        </div>
      </div>

      <UploadMultiImage
        v-if="require_image"
        class="image-upload"
        @update:images="UpdateImg"
        :initialImages="selected_data?.files?.map((el) => el.url) || []"
      />
    </div>
  </div>
</template>
