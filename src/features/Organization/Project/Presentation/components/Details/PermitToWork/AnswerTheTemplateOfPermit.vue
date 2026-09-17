<script setup lang="ts">
import type TemplateModel from '@/features/setting/Template/Data/models/TemplateModel'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ShowTemplateController from '@/features/setting/Template/Presentation/controllers/showTemplateController'
import ShowTemplateParams from '@/features/setting/Template/Core/params/showTemplateParams'
import TemplateDocument from '@/features/Organization/Inspection/Presentation/components/InspectionDialog/TemplateDocument.vue'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import ItemResultParams from '@/features/Organization/Inspection/Core/params/ItemResultParams'
import PermitToWorkResultController from '../../../controllers/PermitToWork/PermitToWorkResultController'
import CreatePermitToWorkResultParams from '@/features/Organization/Project/Core/params/PermitToWork/PermitToWorkResultParams'

const emit = defineEmits(['update:data'])
const props = defineProps<{
  data: TemplateModel[]
  selectedTemplates?: number
}>()

const route = useRoute()

const SelectedTemplate = ref<number | undefined>(Number(route.query.template_id))
const permitId = ref<number | undefined>(Number(route.query.permit_id))

const TemplateDetailsCOntroller = ShowTemplateController.getInstance()
const state = computed(() => TemplateDetailsCOntroller.state.value)
const showTemplateParams = new ShowTemplateParams(SelectedTemplate.value)
const FetchTemplateDetails = async () => {
  await TemplateDetailsCOntroller.showTemplate(showTemplateParams)
}
onMounted(FetchTemplateDetails)
const templateDocumentRef = ref<{
  validateAnswers: () => Promise<{ isValid: boolean; firstMessage: string }>
} | null>(null)

const TaskAnswer = ref({
  check: [],
  radio: [],
  select: [],
  textarea: [],
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
        files: [],
      })
    }
    const entry = tempMap.get(id)

    if (text) entry.result = text

    if (answers !== null && answers !== undefined) {
      const arr = Array.isArray(answers) ? answers : [answers]

      arr.forEach((val) => {
        if (typeof val === 'string') {
          const exists = entry.item_answers.some((a) => a.answer === val)

          if (!exists) {
            entry.item_answers.push({
              answer: val,
              template_item_option_id: null,
            })
          }
        } else {
          const exists = entry.item_answers.find((a) => a.template_item_option_id === val)
          // console.log(exists, "existsexistsexists")
          console.log(AswerValue.value, 'answerValueanswerValue')
          if (!exists) {
            entry.item_answers.push({
              answer: AswerValue.value,
              template_item_option_id: val,
            })
          } else {
            exists.answer = AswerValue.value
          }
        }
      })
    }

    if (imgs && imgs.length) {
      imgs.forEach((img) => {
        if (!entry.files.includes(img)) {
          entry.files.push(img)
        }
      })
    }
  }

  // textarea
  answer.textarea?.forEach((item) => {
    addToMap(item.itemid, null, item.value, item.img || [])
  })

  // select
  answer.select?.forEach((item) => {
    // console.log(item.value, "ittttttttttttttttttemmmmmmmmmm")
    addToMap(item.itemId, null, item.selected, item.img || [], item.value)
  })

  // check
  answer.check?.forEach((group) => {
    group.selected.forEach((val) => {
      addToMap(group.itemid, null, val, group.img || [], group?.notes)
    })
  })

  // radio
  answer.radio?.forEach((item) => {
    if (item.value && item.value !== 0) {
      console.log(item, 'iteeeeeeeem')
      addToMap(item.itemid, null, item.value, item.img || [], item?.notes)
    }
  })

  return Array.from(tempMap.values())
}

const router = useRouter()
const CreateAnswer = async () => {
  const validation = await templateDocumentRef.value?.validateAnswers()
  if (validation && !validation.isValid) {
    new OpenWarningDilaog(validation.firstMessage).openDialog()
    return
  }

  const formatted = formatTaskAnswer()
  if (!formatted.length) {
    new OpenWarningDilaog(t('validation_inspection_answer_required')).openDialog()
    return
  }

  const UpdatedFormat = formatted.map((item) => {
    return new ItemResultParams(item.result, item.template_item_id, item.files, item.item_answers)
  })
  const createPermitToWorkResultParams = new CreatePermitToWorkResultParams(
    SelectedTemplate.value,
    UpdatedFormat,
    permitId.value,
  )
  const permitToWorkResultController = PermitToWorkResultController.getInstance()
  const state = await permitToWorkResultController.PermitToWorkResult(
    createPermitToWorkResultParams,
    router,
    true,
  )
}
</script>

<template>
  <TemplateDocument ref="templateDocumentRef" :allData="state.data!" @update:data="UpdateData" />
  <button class="btn btn-primary" @click="CreateAnswer">submit</button>
</template>

<style lang="scss" scoped>
.template-selector-container-AccordionPanel .active.panel-acc {
  border: 2px dashed color-mix(in srgb, var(--brand-primary-500) 60%, transparent) !important;
  background-color: color-mix(in srgb, var(--brand-primary-200) 6%, transparent);
}
.template-selector-container-AccordionPanel .panel-acc {
  background-color: color-mix(in srgb, #1d4ed8 6%, #ffffff);
  max-height: 20rem;
  overflow-y: scroll;
}
</style>
