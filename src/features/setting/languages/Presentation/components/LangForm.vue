<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'

import { LangsMap } from '@/constant/langs'
import type ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel.ts'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import EditLangParams from '@/features/setting/languages/Core/params/editLangParams'
import AddLangParams from '@/features/setting/languages/Core/params/addLangParams'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: ShowLangModel
}>()

// actual translations (values)
const langs = ref<{ locale: string; title: string }[]>([
  {
    locale: 'en',
    icon: USA,
    title: '',
  },
  {
    locale: 'ar',
    icon: SA,
    title: '',
  },
])

// selected base language
const lang = ref<TitleInterface | null>(null)

// default available langs
const langsDefault = ref<{ locale: string; icon?: any; title: string }[]>([])

const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const indexLangController = await IndexLangController.getInstance().getData(params)

  const response = indexLangController.value

  if (response?.data?.length) {
    // map backend langs into default structure
    langsDefault.value = response.data.map((item: any) => ({
      locale: item.code,
      title: '', // empty initially
      // if you already have icons mapped, use LangsMap
      icon: LangsMap[item.code as keyof typeof LangsMap]?.icon,
    }))
  } else {
    langsDefault.value = [
      {
        locale: 'en',
        icon: USA,
        title: '',
      },
      {
        locale: 'ar',
        icon: SA,
        title: '',
      },
    ]
  }
}

onMounted(async () => {
  await fetchLang()
})

const getLangTitleList = (): TitleInterface[] => {
  return Object.values(LangsMap).map((lang, index) => {
    return new TitleInterface({
      id: index + 1,
      title: lang.name,
      subtitle: lang.code,
    })
  })
}
const langsList = getLangTitleList()

const updateData = () => {
  const translationsParams = new TranslationsParams()

  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })

  const params = props.data?.id
    ? new EditLangParams(props.data?.id! ?? 0, translationsParams, lang.value?.subtitle! ?? 'en')
    : new AddLangParams(translationsParams, lang.value?.subtitle! ?? 'en')

  // console.log(params, 'params')
  emit('update:data', params)
}

const setLang = (data: TitleInterface) => {

  // console.log(data, 'data')
  lang.value = data
  updateData()
}

// when child emits modelValue (updated translations)
const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data

  // console.log(langs.value, 'langs')
  updateData()
}

// init langs either from backend (edit mode) or from defaults (create mode)
watch(
  [() => props.data, () => langsDefault.value],
  ([newData, newDefault]) => {
    if (newDefault.length) {
      if (newData?.titles?.length) {
        langs.value = newDefault.map((l) => {
          const existing = newData.titles.find((t) => t.locale === l.locale)
          return existing ? existing : { locale: l.locale, title: '' }
        })
      } else {
        langs.value = newDefault.map((l) => ({ locale: l.locale, title: '' }))
      }

      lang.value = newData?.code
    }
  },
  { immediate: true },
)

</script>

<template>
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput :langs="langsDefault" :modelValue="langs" @update:modelValue="setLangs" />
  </div>

  <div class="col-span-4 md:col-span-2">
    <CustomSelectInput
      :modelValue="lang"
      :staticOptions="langsList"
      label="Language"
      id="lang"
      placeholder="Select Language"
      @update:modelValue="setLang"
      :disabled="langsDefault.length === 0"
      :required="true"
    />
  </div>
</template>
