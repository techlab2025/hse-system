<script setup lang="ts">
import DocumnetHeader from '@/assets/images/DocumnetHeader.png'
// import TitleInterface from '@/base/Data/Models/title_interface'
import { onMounted, ref, watch } from 'vue'
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

// const TemplateFormDetails = ref<TemplateDetailsModel>()

watch(
  () => props.allData,
  (newState) => {
    if (newState) {
      console.log(newState)
    }
  },
  {
    deep: true,
  },
)

const SelectedCheckBoxs = ref<{
  ItemId: number,
  selected: { id: number; values: number[] }[],
  img: string
}[]>([])
const UpdateCheckBoxs = (data) => {
  SelectedCheckBoxs.value.push(data)
  UpdateData()
}

const SelectedRadioButtons = ref<{
  itemid: number,
  value: number,
  img: string
}[]>([])
const UpdateRadioButtons = (data) => {
  SelectedRadioButtons.value.push(data)
  UpdateData()
}

const SelectedSelects = ref<{
  itemId: number,
  selected: any
}[]>([])
const UpdateSelects = (data) => {
  SelectedSelects.value.push(data)
  UpdateData()
}

const SelectedTextAreas = ref<{
  itemid: number,
  value: string,
}[]>([])
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

const TaskAnswer = ref({
  check: [],
  radio: [],
  select: [],
  textarea: []
})

watch(() => props.task_results, (newState) => {
  if (newState) {
    // console.log(newState, "newStatenewState")
    TaskAnswer.value = {
      check: newState.taskResultItems.filter((item) => item.templateItemAction === ActionsEnum.CHECKBOX),
      radio: newState.taskResultItems.filter((item) => item.templateItemAction === ActionsEnum.RADIOBUTTON),
      select: newState.taskResultItems.filter((item) => item.templateItemAction === ActionsEnum.DROPDOWN),
      textarea: newState.taskResultItems.filter((item) => item.templateItemAction === ActionsEnum.TEXTAREA),
    }
  }
})

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
      <div class="template-document-content" v-for="(item, index) in allData?.templateItems" :key="index">
        <TemplateDocumentCheckboxShow v-if="item?.action == ActionsEnum.CHECKBOX" :key="index" :title="item.name"
          :item_id="item.id" :options="item.options" :require_image="item.requiredImage" @update:data="UpdateCheckBoxs"
          :selected_data="TaskAnswer.check" />
        <TemplateDocumentRadioButtonShow v-if="item?.action == ActionsEnum.RADIOBUTTON" :title="item.name"
          :item_id="item.id" :options="item.options" :require_image="item.requiredImage"
          @update:data="UpdateRadioButtons" :selected_data="TaskAnswer.radio" />
        <TemplateDocumentSelectShow v-if="item?.action == ActionsEnum.DROPDOWN" :title="item.name" :key="index"
          :item_id="item.id" :options="item.options" :require_image="item.requiredImage" @update:data="UpdateSelects"
          :selected_data="TaskAnswer.select" />
        <TemplateDocumentTextAreaShow v-if="item?.action == ActionsEnum.TEXTAREA" :title="item.name" :item_id="item.id"
          :require_image="item.requiredImage" @update:data="UpdateTextAreas" :selected_data="TaskAnswer.textarea" />
      </div>
    </div>
  </div>
</template>
