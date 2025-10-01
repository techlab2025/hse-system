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
import type HashtagDetailsModel from '../../Data/models/HashtagDetailsModel'
import EditHashtagParams from '../../Core/params/editHashtagParams'
import AddHashtagParams from '../../Core/params/addHashtagParams'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: HashtagDetailsModel
}>()

const route = useRoute()
const id = route.params.parent_id

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
const langDefaultDescription = ref<
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
  const indexHashtagController = await IndexLangController.getInstance().getData(params)

  const response = indexHashtagController.value

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

  // titles
  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })

  // descriptions
  langsDescription.value.forEach((lang) => {
    translationsParams.setTranslation('description', lang.locale, lang.title)
  })

  const params = props.data?.id
    ? new EditHashtagParams(
        props.data.id,
        translationsParams,
        typeof image.value === 'object' ? image.value.file : undefined,
        // typeof image.value === 'object' ? image.value.id : undefined,
        alt.value,
      )
    : new AddHashtagParams(
        translationsParams,
        typeof image.value === 'object' ? image.value.file : undefined,
        alt.value,
      )

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
  [langs, langsDescription, industry, allIndustries, image, alt],
  () => {
    updateData()
  },
  { deep: true },
)

// ---------- Helpers ----------
const setImage = async (data: File) => {
  image.value = await filesToBase64(data)
}
</script>

<template>
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput
      :langs="langDefault"
      :modelValue="langs"
      @update:modelValue="(val) => (langs = val)"
    />
  </div>

  <!-- <div class="col-span-4 md:col-span-2">
    <LangTitleInput
      :label="$t('description')"
      :langs="langDefaultDescription"
      :modelValue="langsDescription"
      @update:modelValue="(val) => (langsDescription = val)"
      type="textarea"
    />
  </div> -->

  <div class="col-span-4 md:col-span-4">
    <SingleFileUpload
      v-model="image"
      @update:modelValue="setImage"
      label="Image"
      id="image"
      placeholder="Select image"
    />
  </div>

  <div class="col-span-4 md:col-span-4 input-wrapper">
    <label> Image Alt Text </label>
    <input type="text" v-model="alt" placeholder="Enter image alt text" />
  </div>
</template>
