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
import type BlogDetailsModel from '../../Data/models/BlogDetailsModel'
import EditBlogParams from '../../Core/params/editBlogParams'
import AddBlogParams from '../../Core/params/addBlogParams'
import IndexHashtagController from '@/features/website/Term/Presentation/controllers/indexHashtagController.ts'
import IndexHashtagParams from '@/features/website/Term/Core/params/indexHashtagParams'
import IndexCategoryController from '@/features/website/Category/Presentation/controllers/indexCategoryController'
import IndexCategoryParams from '@/features/website/Category/Core/params/indexCategoryParams'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: BlogDetailsModel
}>()

const route = useRoute()
const id = route.params.parent_id

// ---------- Hashtags ----------
const indexHashtagParams = new IndexHashtagParams('', 1, 10, 1, id ? Number(id) : 0)
const indexHashtagController = IndexHashtagController.getInstance()
const SelectedHashtag = ref<TitleInterface[]>([])

const SetHashtagSelection = (val: TitleInterface[]) => {
  // console.log('Selected Hashtags:', val)
  SelectedHashtag.value = val
  updateData()
}

// ---------- Categories ----------
const indexCategoryParams = new IndexCategoryParams('', 1, 10, 1, id ? Number(id) : 0)
const indexCategoryController = IndexCategoryController.getInstance()
const SelectedCategory = ref<TitleInterface[]>([])

const SetCategorySelection = (val: TitleInterface[]) => {
  console.log('Selected Category:', val)
  SelectedCategory.value = val
  updateData()
}

type ImageValue = string | { file?: File; id?: number }

// ---------- State ----------
const langs = ref<{ locale: string; icon?: any; title: string }[]>([])
const langsDescription = ref<{ locale: string; icon?: any; description: string }[]>([])
const langsSubtitle = ref<{ locale: string; icon?: any; subtitle: string }[]>([])

const allIndustries = ref<number>(0)
const industry = ref<TitleInterface[]>([])
const image = ref<string>('')
const alt = ref<string>('')

// industry controller
const industryParams = new IndexIndustryParams('', 0, 10, 1)
const industryController = IndexIndustryController.getInstance()

// default available langs from backend
const langDefault = ref<{ locale: string; icon?: any; title: string }[]>([])
const langDefaultDescription = ref<{ locale: string; icon?: any; title: string }[]>([])
const langDefaultSubtitle = ref<{ locale: string; icon?: any; title: string }[]>([])

// ---------- Fetch available languages ----------
const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const indexBlogController = await IndexLangController.getInstance().getData(params)

  const response = indexBlogController.value

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

    langDefaultSubtitle.value = response.data.map((item: any) => ({
      locale: item.code,
      subtitle: '',
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
    langDefaultSubtitle.value = [
      { locale: 'en', icon: USA, subtitle: '' },
      { locale: 'ar', icon: SA, subtitle: '' },
    ]
  }
}

onMounted(async () => {
  await fetchLang()
})

// ---------- Emit update ----------
const updateData = () => {
  const translationsParams = new TranslationsParams()

  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })

  langsDescription.value.forEach((lang) => {
    translationsParams.setTranslation('description', lang.locale, lang.description)
  })

  langsSubtitle.value.forEach((lang) => {
    translationsParams.setTranslation('subtitle', lang.locale, lang.subtitle)
  })

  const hashtagsArray =
    SelectedHashtag.value && SelectedHashtag.value.length
      ? SelectedHashtag.value.map((h) => h.id)
      : []

  const categoriesArray =
    SelectedCategory.value && SelectedCategory.value.length
      ? SelectedCategory.value.map((c) => c.id)
      : []

  const params = props.data?.id
    ? new EditBlogParams(
      props.data.id,
      translationsParams,
      image.value,
      alt.value,
      hashtagsArray,
      categoriesArray,
    )
    : new AddBlogParams(translationsParams, image.value, alt.value, hashtagsArray, categoriesArray)

  emit('update:data', params)
}

// ---------- Watchers ----------
watch(
  [
    () => props.data,
    () => langDefault.value,
    () => langDefaultDescription.value,
    () => langDefaultSubtitle.value,
  ],
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

      if (newData?.subtitles?.length) {
        langsSubtitle.value = newDefault.map((l) => {
          const existing = newData.subtitles.find((t) => t.locale === l.locale)
          return existing ? existing : { locale: l.locale, subtitle: '' }
        })
      } else {
        langsSubtitle.value = newDefault.map((l) => ({
          locale: l.locale,
          subtitle: '',
        }))
      }

      image.value = newData?.image ?? ''
      alt.value = newData?.alt ?? ''

      SelectedHashtag.value = newData?.hashtags
      SelectedCategory.value = newData?.categories

      updateData()
    }
  },
  { immediate: true },
)

// Auto-update emit whenever key data changes
watch(
  [langs, langsDescription, industry, allIndustries, image, alt, langsSubtitle],
  () => {
    updateData()
  },
  { deep: true },
)

// ---------- Helpers ----------
const setImage = async (data: File | string) => {
  // image.value = await filesToBase64(data)
  image.value = typeof data === 'string' ? data : await filesToBase64(data)
  updateData()
}
</script>

<template>
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput :langs="langDefault" :modelValue="langs" @update:modelValue="(val) => (langs = val)" />
  </div>
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput :label="$t('subtitle')" :langs="langDefaultSubtitle" :modelValue="langsSubtitle"
      @update:modelValue="(val) => (langsSubtitle = val)" field-type="subtitle" />
  </div>
  <div class="col-span-4 md:col-span-4">
    <LangTitleInput :label="$t('description')" :langs="langDefaultDescription" :modelValue="langsDescription"
      @update:modelValue="(val) => (langsDescription = val)" field-type="description" type="textarea" />
  </div>

  <div class="col-span-4 md:col-span-4">
    <SingleFileUpload v-model="image" @update:modelValue="setImage" label="Image" id="image" :isCrop="true"
      :aspectRatio="872 / 433" placeholder="Select image" />
  </div>

  <div class="col-span-4 md:col-span-4 input-wrapper">
    <label> Image Alt Text </label>
    <input type="text" v-model="alt" placeholder="Enter image alt text" />
  </div>

  <div class="col-span-4 md:col-span-2">
    <CustomSelectInput :controller="indexHashtagController" :params="indexHashtagParams" label="Hashtag" id="Hashtag"
      placeholder="Selected Hashtag" :type="2" :modelValue="SelectedHashtag" @update:modelValue="SetHashtagSelection" />
  </div>

  <div class="col-span-4 md:col-span-2">
    <CustomSelectInput :controller="indexCategoryController" :params="indexCategoryParams" label="Category"
      id="Category" placeholder="Selected Category" :type="2" :modelValue="SelectedCategory"
      @update:modelValue="SetCategorySelection" />
  </div>
</template>
