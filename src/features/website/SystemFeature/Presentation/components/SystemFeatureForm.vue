<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
import SingleFileUpload from '@/shared/HelpersComponents/SingleFileUpload.vue'
import type SystemFeatureDetailsModel from '../../Data/models/SystemFeatureDetailsModel'
import IndexServiceController from '@/features/website/Service/Presentation/controllers/indexServiceController'
import IndexServiceParams from '@/features/website/Service/Core/params/indexServiceParams'
import EditSystemFeatureParams from '../../Core/params/editSystemFeatureParams'
import AddSystemFeatureParams from '../../Core/params/addSystemFeatureParams'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: SystemFeatureDetailsModel
  serviceId: number
}>()

const indexServiceController = IndexServiceController.getInstance()
const indexServiceParams = new IndexServiceParams('', 1, 10, 1)

const langsTitle = ref<{ locale: string; title: string }[]>([])
const langsSubTitle = ref<{ locale: string; title: string }[]>([])
const langsDescription = ref<{ locale: string; title: string }[]>([])

const langDefault = ref<{ locale: string; icon?: string; title: string }[]>([])

// Items array
interface Item {
  translations: {
    title: Record<string, string>
    subtitle: Record<string, string>
  }
  alt: string
  image: string | File
}
const items = ref<Item[]>([])

const createNewItem = (): Item => {
  const title: Record<string, string> = {}
  const subtitle: Record<string, string> = {}

  langDefault.value.forEach((l) => {
    title[l.locale] = ''
    subtitle[l.locale] = ''
  })

  return {
    translations: { title, subtitle },
    alt: '',
    image: '',
  }
}

const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const indexLangController = await IndexLangController.getInstance().getData(params)
  const response = indexLangController.value

  const defaults = response?.data?.length
    ? response.data.map((item: any) => ({
        locale: item.code,
        title: '',
        icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
      }))
    : [
        { locale: 'en', icon: USA, title: '' },
        { locale: 'ar', icon: SA, title: '' },
      ]

  langDefault.value = defaults
  if (!items.value.length) {
    items.value.push(createNewItem())
  }
}

onMounted(async () => {
  await fetchLang()
})

const updateData = () => {
  const mainTranslations = new TranslationsParams()

  langsTitle.value.forEach((lang) => {
    mainTranslations.setTranslation('feature', lang.locale, lang.title)
  })

  langsSubTitle.value.forEach((lang) => {
    mainTranslations.setTranslation('old', lang.locale, lang.title)
  })

  langsDescription.value.forEach((lang) => {
    mainTranslations.setTranslation('new', lang.locale, lang.title)
  })

  const params = props?.data?.id
    ? new EditSystemFeatureParams(props?.data?.id, mainTranslations)
    : new AddSystemFeatureParams(mainTranslations)
  emit('update:data', params)
}

// Helper functions
const setLangsTitle = (data: { locale: string; title: string }[]) => {
  langsTitle.value = data
  updateData()
}

const setLangsSubTitle = (value: { locale: string; title: string }[]) => {
  langsSubTitle.value = value
  updateData()
}

const setLangsDescription = (value: { locale: string; title: string }[]) => {
  langsDescription.value = value
  updateData()
}

watch(
  [() => props.data, () => langDefault.value],
  ([newData, newDefault]) => {
    if (!newData || !newDefault.length) return

    // Map titles
    langsTitle.value = newDefault.map((lang) => {
      const translation = newData.features?.find((t: any) => t.locale === lang.locale)
      return {
        locale: lang.locale,
        title: translation?.feature || '',
      }
    })

    // Map subtitles
    langsSubTitle.value = newDefault.map((lang) => {
      const translation = newData.olds?.find((t: any) => t.locale === lang.locale)
      return {
        locale: lang.locale,
        title: translation?.old || '',
      }
    })

    // Map descriptions
    langsDescription.value = newDefault.map((lang) => {
      const translation = newData.news?.find((t: any) => t.locale === lang.locale)
      return {
        locale: lang.locale,
        title: translation?.new || '',
      }
    })

    updateData()
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput
      type="text"
      :langs="langDefault"
      :modelValue="langsTitle"
      :label="$t('Feature')"
      @update:modelValue="setLangsTitle"
    />
  </div>

  <div class="col-span-4 md:col-span-2">
    <LangTitleInput
      type="text"
      :langs="langDefault"
      :modelValue="langsSubTitle"
      :label="$t('Old')"
      @update:modelValue="setLangsSubTitle"
      field-type="subtitle"
    />
  </div>

  <div class="col-span-4 md:col-span-4">
    <LangTitleInput
      type="textarea"
      :langs="langDefault"
      :modelValue="langsDescription"
      :label="$t('New')"
      @update:modelValue="setLangsDescription"
      field-type="description"
    />
  </div>
</template>
