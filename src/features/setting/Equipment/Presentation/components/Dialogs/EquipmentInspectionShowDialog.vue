<script setup lang="ts">
import type TemplateDetailsModel from '@/features/setting/Template/Data/models/TemplateDetailsModel'
import ShowTemplateController from '@/features/setting/Template/Presentation/controllers/showTemplateController'
import Dialog from 'primevue/dialog'
import { watch, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ItemResultParams from '@/features/Organization/Inspection/Core/params/ItemResultParams'
import CreateTaskResultParams from '@/features/Organization/Inspection/Core/params/CreateTaskResultParams'
import CreateTaskAnswerController from '@/features/Organization/Inspection/Presentation/controllers/CreateTaskAnswerController'
import FetchTaskResultController from '@/features/Organization/Inspection/Presentation/controllers/FetchTaskResultController'
import type TaskFullResponseModel from '@/features/Organization/Inspection/Data/models/FetchTaskResultModels/FullTaskResultModel'
import FetchTaskResultParams from '@/features/Organization/Inspection/Core/params/FetchTaskResultParams'
import { InspectionStatus } from '@/features/Organization/Inspection/Core/Enum/InspectionStatusEnum'
import ViewInspectionArrow from '@/shared/icons/ViewInspectionArrow.vue'
import TemplateDocument from '@/features/setting/TemplateItem/Presentation/components/TemplateDocument.vue'
import DocumnetHeader from '@/assets/images/DocumnetHeader.png'
import ButtonArrow from '@/shared/icons/ButtonArrow.vue'

const visible = ref(false)

const { templateId, taskId } = defineProps<{
  templateId: number,
  taskId: number,
  status: number,
  all_document: TaskFullResponseModel
  isEquipment?: boolean,
}>()

const router = useRouter()
const AllDocument = ref<TemplateDetailsModel>()
const showTemplateController = ShowTemplateController.getInstance()
const state = ref(showTemplateController.state.value)


watch(
  () => showTemplateController.state.value,
  newState => {
    if (newState) state.value = newState
  },
  { deep: true }
)

const { locale } = useI18n()
const title = ref('')
const getTitle = () => {
  title.value = state.value?.data?.titles?.find(item => item?.locale === locale?.value)?.title
}

const TaskAnswer = ref({
  check: [],
  radio: [],
  select: [],
  textarea: []
})

const UpdateData = (data) => {
  TaskAnswer.value = data
}

const formatTaskAnswer = () => {
  const answer = TaskAnswer.value

  const tempMap = new Map()

  const addToMap = (id, text, answers, imgs) => {
    if (!tempMap.has(id)) {
      tempMap.set(id, {
        template_item_id: id,
        result: null,
        item_answers: [],
        files: []
      })
    }

    const entry = tempMap.get(id)

    if (text) entry.result = text

    if (answers !== null && answers !== undefined) {
      const arr = Array.isArray(answers) ? answers : [answers]

      arr.forEach(val => {
        if (typeof val === "string") {
          const exists = entry.item_answers.some(a => a.answer === val)

          if (!exists) {
            entry.item_answers.push({
              answer: val,
              template_item_option_id: null
            })
          }
        }

        else {
          const exists = entry.item_answers.some(a => a.template_item_option_id === val)

          if (!exists) {
            entry.item_answers.push({
              answer: null,
              template_item_option_id: val
            })
          }
        }
      })
    }

    if (imgs && imgs.length) {
      imgs.forEach(img => {
        if (!entry.files.includes(img)) {
          entry.files.push(img)
        }
      })
    }
  }

  // textarea
  answer.textarea?.forEach(item => {
    addToMap(item.itemid, null, item.value, item.img || [])
  })

  // select
  answer.select?.forEach(item => {
    addToMap(item.itemId, null, item.selected, item.img || [])
  })

  // check
  answer.check?.forEach(group => {
    group.selected.forEach(val => {
      addToMap(group.itemid, null, val, group.img || [])
    })
  })

  // radio
  answer.radio?.forEach(item => {
    if (item.value && item.value !== 0) {
      addToMap(item.itemid, null, item.value, item.img || [])
    }
  })

  return Array.from(tempMap.values())
}


const CreateAnswer = async () => {
  const formatted = formatTaskAnswer()
  const UpdatedFormat = formatted.map(item => {
    return new ItemResultParams(item.result, item.template_item_id, item.files, item.item_answers)
  })
  const createTaskResultParams = new CreateTaskResultParams(
    taskId,
    templateId,
    UpdatedFormat
  )
  const createTaskAnswerController = CreateTaskAnswerController.getInstance()
  const state = await createTaskAnswerController.CreateTaskAnswer(createTaskResultParams, router, true)

  visible.value = false
}


const GetData = async () => {
  visible.value = true
  // await FetchTemplateDocument();
  await GetTaskDetails();
  getTitle()
}

const TaskResults = ref<TaskFullResponseModel>()
const fetchTaskResultController = FetchTaskResultController.getInstance()

const GetTaskDetails = async () => {
  const fetchTaskResultParams = new FetchTaskResultParams(taskId)
  const result = await fetchTaskResultController.getData(fetchTaskResultParams)
  if (result.value.data) {
    TaskResults.value = result.value.data
    AllDocument.value = result.value.data.template
  }
}

watch(() => fetchTaskResultController.state.value, (newState) => {
  if (newState) {
    TaskResults.value = newState
  }
})




</script>

<template>
  <div class="card flex justify-center w-full">
    <!-- v-if="status == InspectionStatus.NOT_FINISHED" -->
    <button v-if="!isEquipment" class="card-info-status" @click="GetData">
      <div class="view-inspection-container">
        <p class="view-inspection">view inspection details</p>
        <ViewInspectionArrow />
      </div>
    </button>
    <button v-if="isEquipment" class="flex items-center gap-2 w-full" @click="GetData">
      <div class="button-text">
        <h5>Show Inspection</h5>
      </div>
      <ButtonArrow />
    </button>

    <Dialog v-model:visible="visible" :header="title" modal :dismissable-mask="true" :style="{ width: '60vw' }">
      <div class="template-document-container">
        <div class="template-document-header">
          <div class="template-header">
            <p class="header-title" v-if="AllDocument?.titles && AllDocument?.titles?.length > 0">
              {{
                AllDocument?.titles
                  ?.filter((item) => item.locale === 'en')
                  .map((item) => item.title)
                  .join('')
              }}
            </p>

            <p class="header-title" v-else>{{ AllDocument?.title }}</p>

          </div>
          <img :src="DocumnetHeader" alt="header" />
        </div>
      </div>
      <TemplateDocument :allData="AllDocument" @update:data="UpdateData" />
    </Dialog>
  </div>
</template>
