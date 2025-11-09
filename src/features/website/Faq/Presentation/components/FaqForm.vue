<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'
import IndexIndustryParams from '@/features/setting/Industries/Core/Params/indexIndustryParams.ts'
import IndexIndustryController from '@/features/setting/Industries/Presentation/controllers/indexIndustryController.ts'
import { useRoute } from 'vue-router'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64.ts'
import SingleFileUpload from '@/shared/HelpersComponents/SingleFileUpload.vue'
import type FaqDetailsModel from '../../Data/models/FaqDetailsModel'
import EditFaqParams from '../../Core/params/editFaqParams'
import AddFaqParams from '../../Core/params/addFaqParams'
import IndexHashtagController from '@/features/website/Term/Presentation/controllers/indexHashtagController.ts'
import IndexHashtagParams from '@/features/website/Term/Core/params/indexHashtagParams'
import IndexCategoryController from '@/features/website/Category/Presentation/controllers/indexCategoryController'
import IndexCategoryParams from '@/features/website/Category/Core/params/indexCategoryParams'
import { log } from 'console'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: FaqDetailsModel
}>()

const route = useRoute()
const id = route.params.parent_id

// ---------- Hashtags ----------
const indexHashtagParams = new IndexHashtagParams('', 1, 10, 1, id ? Number(id) : 0)
const indexHashtagController = IndexHashtagController.getInstance()
const SelectedHashtag = ref<TitleInterface[]>([])

const SetHashtagSelection = (val: TitleInterface[]) => {
  SelectedHashtag.value = val
  updateData()
}

// ---------- Categories ----------
const indexCategoryParams = new IndexCategoryParams('', 1, 10, 1, id ? Number(id) : 0)
const indexCategoryController = IndexCategoryController.getInstance()
const SelectedCategory = ref<TitleInterface[]>([])

const SetCategorySelection = (val: TitleInterface[]) => {
  SelectedCategory.value = val
  updateData()
}

type ImageValue = string | { file?: File; id?: number }

// ---------- State ----------
const langs = ref<{ locale: string; icon?: any; title: string }[]>([])

const langsQuestion = ref<{ locale: string; title?: any; question: string }[]>([])
const langsAnswer = ref<{ locale: string; title?: any; answer: string }[]>([])

const image = ref<ImageValue>('')
const alt = ref<string>('')

// default available langs from backend
const langDefault = ref<{ locale: string; icon?: any; title: string }[]>([])

const langDefaultQuestion = ref<{ locale: string; icon?: any; question: string }[]>([])
const langDefaultAnswer = ref<{ locale: string; icon?: any; answer: string }[]>([])

// ---------- Fetch available languages ----------
const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const indexFaqController = await IndexLangController.getInstance().getData(params)

  const response = indexFaqController.value

  if (response?.data?.length) {
    langDefault.value = response.data.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
    langDefaultQuestion.value = response.data.map((item: any) => ({
      locale: item.code,
      question: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
    langDefaultAnswer.value = response.data.map((item: any) => ({
      locale: item.code,
      answer: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
  } else {
    langDefaultQuestion.value = [
      { locale: 'en', icon: USA, question: '' },
      { locale: 'ar', icon: SA, question: '' },
    ]
    langDefaultAnswer.value = [
      { locale: 'en', icon: USA, answer: '' },
      { locale: 'ar', icon: SA, answer: '' },
    ]
  }
}

onMounted(async () => {
  await fetchLang()
})

// ---------- Emit update ----------
const updateData = () => {
  const translationsParams = new TranslationsParams()

  // langs.value.forEach((lang) => {
  //   translationsParams.setTranslation('title', lang.locale, lang.title)
  // })

  langsQuestion.value.forEach((lang) => {
    translationsParams.setTranslation('question', lang.locale, lang.question)
  })

  langsAnswer.value.forEach((lang) => {
    translationsParams.setTranslation('answer', lang.locale, lang.answer)
  })

  const params = props.data?.id
    ? new EditFaqParams(props.data.id, translationsParams)
    : new AddFaqParams(translationsParams)

  emit('update:data', params)
}

// ---------- Watchers ----------
watch(
  [() => props.data, () => langDefault.value],
  ([newData, newDefault]) => {
    if (newDefault.length) {
      // console.log('newData', newData)

      // descriptions
      if (newData?.questions?.length) {
        // console.log('newData.questions', newData.questions)

        langsQuestion.value = newDefault.map((l) => {
          const existing = newData.questions.find((t) => t.locale === l.locale)
          return existing ? existing : { locale: l.locale, title: '' }
        })
      } else {
        langsQuestion.value = newDefault.map((l) => ({
          locale: l.locale,
          title: '',
        }))
      }
      // answers
      if (newData?.answers?.length) {
        // console.log('newData.answers', newData.answers)
        langsAnswer.value = newDefault.map((l) => {
          const existing = newData.answers.find((t) => t.locale === l.locale)
          return existing ? existing : { locale: l.locale, title: '' }
        })
      } else {
        langsAnswer.value = newDefault.map((l) => ({
          locale: l.locale,
          title: '',
        }))
      }

      updateData()
    }
  },
  { immediate: true },
)
watch(
  [langsQuestion, langsAnswer, image, alt],
  () => {
    updateData()
  },
  { deep: true },
)
</script>

<template>
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput :label="$t('question')" :langs="langDefaultQuestion" :modelValue="langsQuestion"
      @update:modelValue="(val) => (langsQuestion = val)" type="textarea" field-type="question" />
  </div>

  <div class="col-span-4 md:col-span-2">
    <LangTitleInput :label="$t('answer')" :langs="langDefaultAnswer" :modelValue="langsAnswer"
      @update:modelValue="(val) => (langsAnswer = val)" type="textarea" field-type="answer" />
  </div>
</template>
