<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'
import { useUserStore } from '@/stores/user'
import type DocumentRefrenceDetailsModel from '../../Data/models/DocumentRefrenceDetailsModel'
import EditDocumentRefrenceParams from '../../Core/params/EditDocumentRefrenceParams'
import AddDocumentRefrenceParams from '../../Core/params/AddDocumentRefrenceParams'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: DocumentRefrenceDetailsModel
}>()

const langs = ref<
  {
    locale: string
    title?: string
  }[]
>([])

const SystemLanguages = ref<
  {
    locale: string
    icon?: any
    title: string
  }[]
>([])

const user = useUserStore()
const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  if (user?.user?.languages.length) {
    SystemLanguages.value = user?.user?.languages.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
    return
  }
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const indexLanguageController = await IndexLangController.getInstance().getData(params)
  const response = indexLanguageController.value

  if (response?.data?.length) {
    SystemLanguages.value = response.data.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
  } else {
    SystemLanguages.value = [
      { locale: 'en', icon: USA, title: '' },
      { locale: 'ar', icon: SA, title: '' },
    ]
  }
}

onMounted(async () => {
  await fetchLang()
})

const updateData = () => {
  const translationsParams = new TranslationsParams()

  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title ?? '')
  })

  const params = props.data?.id
    ? new EditDocumentRefrenceParams(props.data.id, translationsParams)
    : new AddDocumentRefrenceParams(translationsParams)

  emit('update:data', params)
}
watch(
  [() => props.data, () => SystemLanguages.value],
  ([newData, newSystemLangauges]) => {
    if (newSystemLangauges.length) {
      if (newData?.titles?.length) {
        langs.value = newSystemLangauges.map((l) => {
          const existing = newData.titles.find((t) => t.locale === l.locale)
          return existing ? existing : { locale: l.locale, title: '' }
        })
      } else {
        langs.value = newSystemLangauges.map((l) => ({ locale: l.locale, title: '' }))
      }
      updateData()
    }
  },
  { immediate: true },
)

watch(
  langs,
  () => {
    updateData()
  },
  { deep: true },
)

const GetTitle = (
  title: {
    locale: string
    title?: string
  }[],
) => {
  console.log(title, 'title')
  langs.value = title
}
</script>

<template>
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput :langs="SystemLanguages" :modelValue="langs" @update:modelValue="GetTitle" />
  </div>
</template>
