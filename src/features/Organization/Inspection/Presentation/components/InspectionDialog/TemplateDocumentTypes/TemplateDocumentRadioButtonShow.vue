<script setup lang="ts">
import type TaskResultItemModel from '@/features/Organization/Inspection/Data/models/FetchTaskResultModels/ItemTasksResultModel';
import type ItemModel from '@/features/setting/TemplateItem/Data/models/ItemMode'
import UploadMultiImage from '@/shared/HelpersComponents/UploadMultiImage.vue'
import UploadImage from '@/shared/icons/UploadImage.vue'
import RadioButton from 'primevue/radiobutton'
import { ref, watch } from 'vue';

const emit = defineEmits(['update:data'])
const props = defineProps<{
  title: string
  item_id: number
  options: ItemModel[]
  require_image: boolean
  selected_data?: TaskResultItemModel[]
}>()

const Img = ref()
const UpdateImg = (data: string) => {
  Img.value = data
  UpdateData()
}

const SelectedOptions = ref<{ id: number; value: number }>({
  id: props.item_id,
  value: props.selected_data?.[0]?.answers[0]?.templateItemOption?.id
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
  emit('update:data', {
    itemid: props.item_id,
    value: SelectedOptions.value.value,
    img: Img.value
  })

}


watch(
  () => props.selected_data,
  (newVal) => {
    if (newVal && newVal.length) {
      const optId = newVal[0]?.answers?.[0]?.templateItemOption?.id || 0
      SelectedOptions.value.value = optId
    }
  },
  { immediate: true }
)

</script>

<template>
  <pre>
  </pre>
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
      <UploadMultiImage v-if="require_image" @update:images="UpdateImg" class="image-upload"
        :initialImages="selected_data?.[0]?.files.map((el) => el.url)" />
    </div>
  </div>
</template>
