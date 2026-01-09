<script setup lang="ts">
import Checkbox from 'primevue/checkbox'
import type ItemModel from '@/features/setting/TemplateItem/Data/models/ItemMode'
import { TextAreaStatusEnum } from '@/features/setting/TemplateItem/Core/Enum/TextAreaStatusEnum'
import UploadMultiImage from '@/shared/HelpersComponents/UploadMultiImage.vue'
import { ref, watch, computed, nextTick } from 'vue'
import type TaskResultItemModel from '@/features/Organization/Inspection/Data/models/FetchTaskResultModels/ItemTasksResultModel'

const emit = defineEmits(['update:data', 'update:images'])

const props = defineProps<{
  title: string
  item_id: number
  options: ItemModel[]
  require_image: boolean
  selected_data?: TaskResultItemModel
}>()

/* ================= state ================= */
const Img = ref<string | null>(null)
const textArea = ref('')
const SelectedValues = ref<number[]>([])

/* ================= computed ================= */
const showTextArea = computed(() => {
  return props.options.some(option => {
    if (!SelectedValues.value.includes(option.id)) return false

    const status = option.TextAreaType || option.kpi
    return (
      String(status) === String(TextAreaStatusEnum.required) ||
      String(status) === String(TextAreaStatusEnum.optional)
    )
  })
})

const UpdateImg = (data: string) => {
  Img.value = data
  UpdateData()
}

const UpdateOptions = (value: number) => {
  let newValues: number[]

  if (SelectedValues.value.includes(value)) {
    newValues = SelectedValues.value.filter(v => v !== value)
  } else {
    newValues = [...SelectedValues.value, value]
  }

  SelectedValues.value = newValues

  // Use nextTick to ensure the ref has updated
  nextTick(() => {
    UpdateData()
  })
}

const UpdateData = () => {
  const dataToEmit = {
    itemid: props.item_id,
    selected: [...SelectedValues.value],
    img: Img.value,
    notes: showTextArea.value ? textArea.value : ''
  }

  // Debug log to verify correct data
  console.log('Emitting data:', dataToEmit)

  emit('update:data', dataToEmit)
}

watch(showTextArea, (visible) => {
  if (!visible) {
    textArea.value = ''
    UpdateData()
  }
})

watch(textArea, () => {
  if (showTextArea.value) {
    UpdateData()
  }
})

watch(
  () => props.selected_data,
  (newVal) => {
    if (!newVal) return

    // options
    SelectedValues.value =
      newVal.answers
        ?.map((a: any) => a.templateItemOption?.id)
        .filter((id: number | undefined): id is number => id !== undefined) || []

    // notes
    const note = newVal.answers?.find((a: any) => a.answer)?.answer
    textArea.value = note || ''

    // images
    Img.value = newVal.files?.length ? newVal.files[0].url : null

    UpdateData()
  },
  { immediate: true }
)
</script>

<template>
  <div class="show-template-document-checkbox flex flex-col gap-4">
    <p class="title font-bold">{{ title }}</p>

    <div class="options-container">
      <div class="options flex flex-col gap-2">
        <div class="options-box flex items-center justify-between pb-2" v-for="option in options" :key="option.id">
          <label :for="`checkbox-${item_id}-${option.id}`" class="label cursor-pointer flex-grow">
            {{ option.title }}
          </label>

          <Checkbox binary :modelValue="SelectedValues.includes(option.id)"
            @update:modelValue="UpdateOptions(option.id)" :inputId="`checkbox-${item_id}-${option.id}`" />
        </div>
      </div>

      <div v-if="require_image" class="mt-4">
        <UploadMultiImage @update:images="UpdateImg" :initialImages="selected_data?.files?.map(el => el.url) || []" />
      </div>
    </div>
  </div>

  <div v-if="showTextArea" class="input-wrapper w-full animate-fade-in mt-4">
    <label for="notes" class="block mb-1 text-sm font-medium">
      Notes
    </label>
    <textarea id="notes" class="input w-full border rounded-md p-2 min-h-[80px]" v-model="textArea"
      placeholder="Please enter details..." />
  </div>
</template>

<style scoped>
.animate-fade-in {
  margin-top: 10px;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
