<script setup lang="ts">
import ShowTemplateParams from '@/features/setting/Template/Core/params/showTemplateParams'
import type TemplateDetailsModel from '@/features/setting/Template/Data/models/TemplateDetailsModel'
import ShowTemplateController from '@/features/setting/Template/Presentation/controllers/showTemplateController'
import Dialog from 'primevue/dialog'
import { watch, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TemplateDocument from './TemplateDocument.vue'
import { useI18n } from 'vue-i18n'
import CreateTaskAnswerController from '../../controllers/CreateTaskAnswerController'
import CreateTaskResultParams from '../../../Core/params/CreateTaskResultParams'
import ItemResultParams from '../../../Core/params/ItemResultParams'
import FetchTaskResultParams from '../../../Core/params/FetchTaskResultParams'
import FetchTaskResultController from '../../controllers/FetchTaskResultController'
import type TaskFullResponseModel from '../../../Data/models/FetchTaskResultModels/FullTaskResultModel'
import { InspectionStatus } from '../../../Core/Enum/InspectionStatusEnum'
import ArrowDetails from '@/shared/icons/ArrowDetails.vue'

const visible = ref(false)

const { templateId, taskId } = defineProps<{
  templateId: number,
  taskId: number,
  status: number
}>()

const router = useRouter()
const route = useRoute()
const AllDocument = ref<TemplateDetailsModel>()
const showTemplateController = ShowTemplateController.getInstance()
const state = ref(showTemplateController.state.value)

const FetchTemplateDocument = async () => {
  const showTemplateParams = new ShowTemplateParams(templateId)
  const Response = await showTemplateController.showTemplate(showTemplateParams)
  if (Response.value.data) {
    console.log(Response.value.data, "Response.value.data");
    AllDocument.value = Response.value.data
  }
}

// onMounted(() => FetchTemplateDocument())

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

  const addToMap = (id, text, answers, imgs, answerValue?: string) => {
    const AswerValue = ref(answerValue)

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
          const exists = entry.item_answers.find(a => a.template_item_option_id === val)
          // console.log(exists, "existsexistsexists")
          console.log(AswerValue.value, "answerValueanswerValue")
          if (!exists) {
            entry.item_answers.push({
              answer: AswerValue.value,
              template_item_option_id: val
            })
          } else {
            exists.answer = AswerValue.value
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
    // console.log(item.value, "ittttttttttttttttttemmmmmmmmmm")
    addToMap(item.itemId, null, item.selected, item.img || [], item.value)
  })

  // check
  answer.check?.forEach(group => {
    group.selected.forEach(val => {
      addToMap(group.itemid, null, val, group.img || [], group?.notes)
    })
  })

  // radio
  answer.radio?.forEach(item => {
    if (item.value && item.value !== 0) {
      console.log(item, "iteeeeeeeem")
      addToMap(item.itemid, null, item.value, item.img || [], item?.notes)
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

watch(() => showTemplateController.state.value, (newState) => {
  if (newState) {
    AllDocument.value = newState
  }
})


</script>

<template>
  <div class="inspection-start card w-full flex justify-center">
    <button class="btn btn-primary w-full" style="z-index: 999;" @click="GetData"
      v-if="status == InspectionStatus.NOT_FINISHED">Start</button>
    <!-- <button class="show-details" @click="GetData" v-if="status == InspectionStatus.FINISHED">
      <span> show inspection details </span>
      <ArrowDetails />
    </button> -->
    <Dialog v-model:visible="visible" :header="title" modal :dismissable-mask="true" :style="{ width: '60vw' }">
      <!-- <div :class="status == InspectionStatus.FINISHED ? 'overlay' : ''"> -->
      <TemplateDocument :isOverlay="status == InspectionStatus.FINISHED" :allData="AllDocument"
        @update:data="UpdateData" :task_results="TaskResults?.taskResults?.[TaskResults?.taskResults?.length - 1]" />
      <button v-if="status == InspectionStatus.NOT_FINISHED" class="btn btn-primary w-full mt-4" @click="CreateAnswer">
        {{ $t('confirm') }}
      </button>
      <!-- </div> -->
    </Dialog>
  </div>
</template>
