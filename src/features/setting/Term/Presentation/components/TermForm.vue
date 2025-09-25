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
import type TermDetailsModel from '../../Data/models/TermDetailsModel'
// import EditTermParams from '../../Core/params/editTermParams'
import AddTermParams from '../../Core/params/addTermParams'
import ShowTermController from '../controllers/showTermController'
import ShowTermParams from '../../Core/params/showTermParams'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: TermDetailsModel
}>()

const route = useRoute()
const id = route.params.id as string | undefined

type ImageValue = string | { file?: File; id?: number }

// ---------- State ----------
const langs = ref<
  {
    locale: string
    icon?: any
    title: string
  }[]
>([])

const langsDescription = ref<
  {
    locale: string
    icon?: any
    description: string
  }[]
>([])

const allIndustries = ref<number>(0)
const industry = ref<TitleInterface[]>([])
const image = ref<ImageValue>('')
const alt = ref<string>('')

// industry controller
const industryParams = new IndexIndustryParams('', 0, 10, 1)
const industryController = IndexIndustryController.getInstance()

// default available langs from backend
const langDefault = ref<
  {
    locale: string
    icon?: any
    title: string
  }[]
>([])


// ---------- Fetch available languages ----------
const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const indexTermController = await IndexLangController.getInstance().getData(params)

  const response = indexTermController.value

  if (response?.data?.length) {
    langDefault.value = response.data.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))

    langDefaultDescription.value = response.data.map((item: any) => ({
      locale: item.code,
      description: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
  } else {
    langDefault.value = [
      { locale: 'en', icon: USA, title: '' },
      { locale: 'ar', icon: SA, title: '' },
    ]
    langDefaultDescription.value = [
      { locale: 'en', icon: USA, description: '' },
      { locale: 'ar', icon: SA, description: '' },
    ]
  }
}

onMounted(async () => {
  await fetchLang()
})

// ---------- Emit update ----------
const updateData = () => {
  const translationsParams = new TranslationsParams()



  // descriptions
  langsDescription.value.forEach((lang) => {
    translationsParams.setTranslation('description', lang.locale, lang.description)
  })

  const params = props.data?.id
    ? new EditTermParams(
        props.data.id,
        translationsParams,
        typeof image.value === 'object' ? image.value.file : undefined,
        // typeof image.value === 'object' ? image.value.id : undefined,
        alt.value,
      )
    : new AddTermParams(translationsParams)

  // console.log(params, 'params')

  emit('update:data', params)
}

// ---------- Watchers ----------
// Init from props (edit mode) or defaults (create mode)
watch(
  [() => props.data, () => langDefault.value, () => langDefaultDescription.value],
  ([newData, newDefault, newDefaultDesc]) => {
    if (newDefault.length && newDefaultDesc.length) {
      // titles
      if (newData?.titles?.length) {
        langs.value = newDefault.map((l) => {
          const existing = newData.titles.find((t) => t.locale === l.locale)
          return existing ? existing : { locale: l.locale, title: '' }
        })
      } else {
        langs.value = newDefault.map((l) => ({ locale: l.locale, title: '' }))
      }

      // descriptions
      if (newData?.descriptions?.length) {
        langsDescription.value = newDefaultDesc.map((l) => {
          const existing = newData.descriptions.find((t) => t.locale === l.locale)
          return existing ? existing : { locale: l.locale, description: '' }
        })
      } else {
        langsDescription.value = newDefaultDesc.map((l) => ({
          locale: l.locale,
          description: '',
        }))
      }

      image.value = newData?.image ?? ''
      alt.value = newData?.alt ?? ''
    }
  },
  { immediate: true },
)

// Auto-update emit whenever key data changes
watch(
  [langs, langsDescription, industry, allIndustries, image],
  () => {
    updateData()
  },
  { deep: true },
)

// ---------- Helpers ----------
const setImage = async (data: File) => {
  image.value = await filesToBase64(data)
}
const fetchTerm = async (id: string | number) => {
  const showTermController = ShowTermController.getInstance()
  const params = new ShowTermParams(id)

  const response = await showTermController.showTerm(params)

  if (response?.data) {
    const term = response.data as TermDetailsModel

    // titles
    if (term.titles?.length) {
      langs.value = langDefault.value.map((l) => {
        const existing = term.titles.find((t) => t.locale === l.locale)
        return existing ? existing : { locale: l.locale, title: '' }
      })
    }

    // descriptions
    if (term.descriptions?.length) {
      langsDescription.value = langDefaultDescription.value.map((l) => {
        const existing = term.descriptions.find((t) => t.locale === l.locale)
        return existing ? existing : { locale: l.locale, description: '' }
      })
    }

  }
}

onMounted(() => {
fetchTerm()
})
</script>

<template>
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput
      :label="$t('description')"
      :langs="langDefaultDescription"
      :modelValue="langsDescription"
      @update:modelValue="(val) => (langsDescription = val)"
      type="textarea"
    />
  </div>
</template>
