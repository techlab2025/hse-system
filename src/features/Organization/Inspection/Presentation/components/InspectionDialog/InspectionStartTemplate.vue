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

const visible = ref(false)

const { templateId, taskId } = defineProps<{
  templateId: number,
  taskId: number
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
    AllDocument.value = Response.value.data
  }
}

onMounted(() => FetchTemplateDocument())

watch(
  () => showTemplateController.state.value,
  newState => {
    if (newState) state.value = newState
  },
  { deep: true }
)

const { locale } = useI18n()
const getTitle = () => {
  return state.value.data?.titles?.find(item => item.locale === locale.value)?.title
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

  const tempMap = new Map() // key: template_item_id

  // Helper function to add item
  const addToMap = (id, text, answers, imgs) => {
    if (!tempMap.has(id)) {
      tempMap.set(id, {
        template_item_id: id,
        result: null,
        item_answers: [], // [{id: X}]
        image_key: []     // ['img1', 'img2']
      })
    }

    const entry = tempMap.get(id)

    // result (textarea only)
    if (text) entry.result = text

    // answers → convert to { id: number }
    if (answers !== null && answers !== undefined) {
      const arr = Array.isArray(answers) ? answers : [answers]

      arr.forEach(val => {
        // check duplicate
        if (!entry.item_answers.some(a => a.id === val)) {
          entry.item_answers.push({ id: val })
        }
      })
    }

    // images → prevent duplicates
    if (imgs && imgs.length) {
      imgs.forEach(img => {
        if (!entry.image_key.includes(img)) {
          entry.image_key.push(img)
        }
      })
    }
  }


  // textarea
  answer.textarea?.forEach(item => {
    addToMap(item.itemid, item.value, null, item.img || [])
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
    return new ItemResultParams(item.result, item.template_item_id, item.image_key, item.item_answers)
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
</script>

<template>
  <div class="card flex justify-center">
    <button class="card-info-status" @click="visible = true">Start</button>

    <Dialog v-model:visible="visible" modal :header="getTitle()" :style="{ width: '60vw' }">
      <TemplateDocument :allData="state.data" @update:data="UpdateData" />

      <button class="btn btn-primary w-full mt-4" @click="CreateAnswer">
        {{ $t('confirm') }}
      </button>
    </Dialog>
  </div>
</template>
