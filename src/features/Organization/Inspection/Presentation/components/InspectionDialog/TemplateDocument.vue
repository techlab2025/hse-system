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
import TemplateDocumentSelectShowResult from '../ShowResultActions/TemplateDocumentSelectShowResult.vue'
import TemplateDocumentCheckboxShowResult from '../ShowResultActions/TemplateDocumentCheckboxShowResult.vue'
import TemplateDocumentRadioShowResult from '../ShowResultActions/TemplateDocumentRadioShowResult.vue'
import TemplateDocumentTextAreaShowResult from '../ShowResultActions/TemplateDocumentTextAreaShowResult.vue'

const emit = defineEmits(['update:data'])
const props = defineProps<{
  allData: TemplateDetailsModel
  task_results: TaskResultModel
  isOverlay?: boolean
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
    itemid: number
    selected: number[]
    img: string
    notes: string
  }[]
>([])

const UpdateCheckBoxs = (data) => {
  // Find existing item index
  const existingIndex = SelectedCheckBoxs.value.findIndex(item => item.itemid === data.itemid)

  if (existingIndex !== -1) {
    // Update existing item
    SelectedCheckBoxs.value[existingIndex] = data
  } else {
    // Add new item
    SelectedCheckBoxs.value.push(data)
  }

  UpdateData()
}

const SelectedRadioButtons = ref<
  {
    itemid: number
    value: number
    img: string
    notes: string
  }[]
>([])

const UpdateRadioButtons = (data) => {
  // Find existing item index
  const existingIndex = SelectedRadioButtons.value.findIndex(item => item.itemid === data.itemid)

  if (existingIndex !== -1) {
    // Update existing item
    SelectedRadioButtons.value[existingIndex] = data
  } else {
    // Add new item
    SelectedRadioButtons.value.push(data)
  }

  UpdateData()
}

const SelectedSelects = ref<
  {
    itemId: number
    selected: any
  }[]
>([])

const UpdateSelects = (data) => {
  // Find existing item index
  const existingIndex = SelectedSelects.value.findIndex(item => item.itemId === data.itemId)

  if (existingIndex !== -1) {
    // Update existing item
    SelectedSelects.value[existingIndex] = data
  } else {
    // Add new item
    SelectedSelects.value.push(data)
  }

  UpdateData()
}

const SelectedTextAreas = ref<
  {
    itemid: number
    value: string
  }[]
>([])

const UpdateTextAreas = (data) => {
  // Find existing item index
  const existingIndex = SelectedTextAreas.value.findIndex(item => item.itemid === data.itemid)

  if (existingIndex !== -1) {
    // Update existing item
    SelectedTextAreas.value[existingIndex] = data
  } else {
    // Add new item
    SelectedTextAreas.value.push(data)
  }

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
  <!-- <pre>{{ task_results }}</pre> -->
  <div class="template-document-container w-full">
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

        <!-- <div class="template-details">
          <p>
            Id : <span>{{ allData?.id }}</span>
          </p>
          <p>location :<span>example</span></p>
          <p>Zone :<span>example</span></p>
        </div> -->
      </div>
      <img :src="DocumnetHeader" alt="header" />
    </div>
    <div class="template-document-content-container w-full">
      <div v-for="(tag, index) in allData?.templateItemTags" :key="index">


        <div>
          <p class="tag-title" v-if="tag.titles?.length > 0">{{tag.titles?.filter((item) => item.locale ===
            'en').map((item) => item.title).join('')}}
          </p>
          <p class="tag-title" v-else>{{ tag.title }}</p>
        </div>

        <div class="template-document-content w-full" v-for="(item, index) in tag.templateItems" :key="index">
          <!-- <div class="overlay" v-if="isOverlay"></div> -->

          <div class="w-full" v-if="item?.action == ActionsEnum.CHECKBOX">
            <div class="w-full" v-if="task_results?.taskResultItems?.length > 0">
              <TemplateDocumentCheckboxShowResult :key="index" :title="item.name" :item_id="item.id"
                :options="item.options" :require_image="item.requiredImage" @update:data="UpdateCheckBoxs"
                :selected_data="task_results?.taskResultItems
                  ?.filter((resultItem) => resultItem.templateItemAction === ActionsEnum.CHECKBOX)
                  .find(
                    (resultItem, idx) =>
                      tag.templateItems.filter((ti) => ti.action === ActionsEnum.CHECKBOX)[idx]
                        ?.id === item.id
                  )
                  " />
            </div>
            <TemplateDocumentCheckboxShow v-else :key="index" :title="item.name" :item_id="item.id"
              :options="item.options" :require_image="item.requiredImage" @update:data="UpdateCheckBoxs" :selected_data="task_results?.taskResultItems
                ?.filter((resultItem) => resultItem.templateItemAction === ActionsEnum.CHECKBOX)
                .find(
                  (resultItem, idx) =>
                    tag.templateItems.filter((ti) => ti.action === ActionsEnum.CHECKBOX)[idx]
                      ?.id === item.id
                )
                " />
          </div>

          <div class="w-full" v-if="item?.action == ActionsEnum.RADIOBUTTON">
            <div class="w-full" v-if="task_results?.taskResultItems?.length > 0">
              <TemplateDocumentRadioShowResult :title="item.name" :item_id="item.id" :options="item.options"
                :require_image="item.requiredImage" @update:data="UpdateRadioButtons" :selected_data="task_results?.taskResultItems
                  ?.filter((resultItem) => resultItem.templateItemAction === ActionsEnum.RADIOBUTTON)
                  .find(
                    (resultItem, idx) =>
                      tag.templateItems.filter((ti) => ti.action === ActionsEnum.RADIOBUTTON)[idx]
                        ?.id === item.id
                  )
                  " />
            </div>
            <TemplateDocumentRadioButtonShow v-else :title="item.name" :item_id="item.id" :options="item.options"
              :require_image="item.requiredImage" @update:data="UpdateRadioButtons" :selected_data="task_results?.taskResultItems
                ?.filter((resultItem) => resultItem.templateItemAction === ActionsEnum.RADIOBUTTON)
                .find(
                  (resultItem, idx) =>
                    tag.templateItems.filter((ti) => ti.action === ActionsEnum.RADIOBUTTON)[idx]
                      ?.id === item.id
                )
                " />
          </div>

          <div class="w-full" v-if="item?.action == ActionsEnum.DROPDOWN">


            <div v-if="task_results?.taskResultItems?.length > 0" class="">
              <TemplateDocumentSelectShowResult :title="item.name" :key="index" :item_id="item.id"
                :options="item.options" :require_image="item.requiredImage" @update:data="UpdateSelects" :selected_data="task_results?.taskResultItems
                  ?.filter((resultItem) => resultItem.templateItemAction === ActionsEnum.DROPDOWN)
                  .find(
                    (resultItem, idx) =>
                      tag.templateItems.filter((ti) => ti.action === ActionsEnum.DROPDOWN)[idx]
                        ?.id === item.id
                  )
                  " />
            </div>
            <TemplateDocumentSelectShow v-else :title="item.name" :key="index" :item_id="item.id"
              :options="item.options" :require_image="item.requiredImage" @update:data="UpdateSelects" :selected_data="task_results?.taskResultItems
                ?.filter((resultItem) => resultItem.templateItemAction === ActionsEnum.DROPDOWN)
                .find(
                  (resultItem, idx) =>
                    tag.templateItems.filter((ti) => ti.action === ActionsEnum.DROPDOWN)[idx]
                      ?.id === item.id
                )
                " />

          </div>
          <div class="w-full" v-if="item?.action == ActionsEnum.TEXTAREA">
            <div class="w-full" v-if="task_results?.taskResultItems?.length > 0">
              <TemplateDocumentTextAreaShowResult :title="item.name" :item_id="item.id"
                :require_image="item.requiredImage" @update:data="UpdateTextAreas" :selected_data="task_results?.taskResultItems
                  ?.filter((resultItem) => resultItem.templateItemAction === ActionsEnum.TEXTAREA)
                  .find(
                    (resultItem, idx) =>
                      tag.templateItems.filter((ti) => ti.action === ActionsEnum.TEXTAREA)[idx]
                        ?.id === item.id
                  )
                  " />
            </div>
            <TemplateDocumentTextAreaShow v-else :title="item.name" :item_id="item.id"
              :require_image="item.requiredImage" @update:data="UpdateTextAreas" :selected_data="task_results?.taskResultItems
                ?.filter((resultItem) => resultItem.templateItemAction === ActionsEnum.TEXTAREA)
                .find(
                  (resultItem, idx) =>
                    tag.templateItems.filter((ti) => ti.action === ActionsEnum.TEXTAREA)[idx]
                      ?.id === item.id
                )
                " />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 9999;
  background-color: red;
}

.tag-title {
  color: #041953;
  font-size: 22px;
  font-weight: 700;
  font-family: "Regular";
}
</style>
