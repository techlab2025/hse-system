<script setup lang="ts">
import DocumnetHeader from '@/assets/images/DocumnetHeader.png'
import { ref, watch } from 'vue'
import type TemplateDetailsModel from '@/features/setting/Template/Data/models/TemplateDetailsModel'
import TemplateDocumentCheckboxShow from './TemplateDocumentTypes/TemplateDocumentCheckboxShow.vue'
import TemplateDocumentRadioButtonShow from './TemplateDocumentTypes/TemplateDocumentRadioButtonShow.vue'
import TemplateDocumentSelectShow from './TemplateDocumentTypes/TemplateDocumentSelectShow.vue'
import TemplateDocumentTextAreaShow from './TemplateDocumentTypes/TemplateDocumentTextAreaShow.vue'
import { ActionsEnum } from '@/features/setting/TemplateItem/Core/Enum/ActionsEnum'
import type TaskResultModel from '../../../Data/models/FetchTaskResultModels/TasksResultModel'

const emit = defineEmits(['update:data'])
const props = defineProps<{
  allData: TemplateDetailsModel
  task_results: TaskResultModel
}>()

watch(
  () => props.allData,
  (newState) => {
    if (newState) {
      console.log(newState)
    }
  },
  {
    deep: true,
  }
)

const SelectedCheckBoxs = ref<
  {
    ItemId: number
    selected: { id: number; values: number[] }[]
    img: string
  }[]
>([])
const UpdateCheckBoxs = (data) => {
  SelectedCheckBoxs.value.push(data)
  UpdateData()
}

const SelectedRadioButtons = ref<
  {
    itemid: number
    value: number
    img: string
  }[]
>([])
const UpdateRadioButtons = (data) => {
  SelectedRadioButtons.value.push(data)
  UpdateData()
}

const SelectedSelects = ref<
  {
    itemId: number
    selected: any
  }[]
>([])
const UpdateSelects = (data) => {
  SelectedSelects.value.push(data)
  UpdateData()
}

const SelectedTextAreas = ref<
  {
    itemid: number
    value: string
  }[]
>([])
const UpdateTextAreas = (data) => {
  SelectedTextAreas.value.push(data)
  UpdateData()
}

const UpdateData = () => {
  emit('update:data', {
    check: SelectedCheckBoxs.value,
    radio: SelectedRadioButtons.value,
    select: SelectedSelects.value,
    textarea: SelectedTextAreas.value,
  })
}

const TaskAnswerMap = ref<Map<number, any>>(new Map())

watch(
  () => props.task_results,
  (newState) => {
    if (newState && newState.taskResultItems) {
      // Clear the map
      TaskAnswerMap.value.clear()
      newState.taskResultItems.forEach((item) => {
        TaskAnswerMap.value.set(item.id, item)
      })
    }
  }
)

// Helper function to get the answer for a specific template item
const getAnswerForItem = (templateItemId: number) => {
  if (!props.task_results?.taskResultItems) return null
  const resultItem = props.task_results.taskResultItems.find((item) => {
    return true // Placeholder
  })

  return resultItem
}
</script>
<template>
  <div class="template-document-container">
    <div class="template-document-header">
      <div class="template-header">
        <p class="header-title" v-if="allData?.titles && allData?.titles?.length > 0">
          {{
            allData?.titles
              ?.filter((item) => item.locale === 'en')
              .map((item) => item.title)
              .join('')
          }}
        </p>

        <p class="header-title" v-else>{{ allData?.title }}</p>

        <div class="template-details">
          <p>
            Id : <span>{{ allData?.id }}</span>
          </p>
          <p>location :<span>example</span></p>
          <p>Zone :<span>example</span></p>
        </div>
      </div>
      <img :src="DocumnetHeader" alt="header" />
    </div>
    <div class="template-document-content-container">
      <div
        class="template-document-content"
        v-for="(item, index) in allData?.templateItems"
        :key="index"
      >
        <TemplateDocumentCheckboxShow
          v-if="item?.action == ActionsEnum.CHECKBOX"
          :key="index"
          :title="item.name"
          :item_id="item.id"
          :options="item.options"
          :require_image="item.requiredImage"
          @update:data="UpdateCheckBoxs"
          :selected_data="
            task_results?.taskResultItems
              ?.filter((resultItem) => resultItem.templateItemAction === ActionsEnum.CHECKBOX)
              .find(
                (resultItem, idx) =>
                  allData.templateItems.filter((ti) => ti.action === ActionsEnum.CHECKBOX)[idx]
                    ?.id === item.id
              )
          "
        />

        <TemplateDocumentRadioButtonShow
          v-if="item?.action == ActionsEnum.RADIOBUTTON"
          :title="item.name"
          :item_id="item.id"
          :options="item.options"
          :require_image="item.requiredImage"
          @update:data="UpdateRadioButtons"
          :selected_data="
            task_results?.taskResultItems
              ?.filter((resultItem) => resultItem.templateItemAction === ActionsEnum.RADIOBUTTON)
              .find(
                (resultItem, idx) =>
                  allData.templateItems.filter((ti) => ti.action === ActionsEnum.RADIOBUTTON)[idx]
                    ?.id === item.id
              )
          "
        />
        <TemplateDocumentSelectShow
          v-if="item?.action == ActionsEnum.DROPDOWN"
          :title="item.name"
          :key="index"
          :item_id="item.id"
          :options="item.options"
          :require_image="item.requiredImage"
          @update:data="UpdateSelects"
          :selected_data="
            task_results?.taskResultItems
              ?.filter((resultItem) => resultItem.templateItemAction === ActionsEnum.DROPDOWN)
              .find(
                (resultItem, idx) =>
                  allData.templateItems.filter((ti) => ti.action === ActionsEnum.DROPDOWN)[idx]
                    ?.id === item.id
              )
          "
        />
        <TemplateDocumentTextAreaShow
          v-if="item?.action == ActionsEnum.TEXTAREA"
          :title="item.name"
          :item_id="item.id"
          :require_image="item.requiredImage"
          @update:data="UpdateTextAreas"
          :selected_data="
            task_results?.taskResultItems
              ?.filter((resultItem) => resultItem.templateItemAction === ActionsEnum.TEXTAREA)
              .find(
                (resultItem, idx) =>
                  allData.templateItems.filter((ti) => ti.action === ActionsEnum.TEXTAREA)[idx]
                    ?.id === item.id
              )
          "
        />
      </div>
    </div>
  </div>
</template>
