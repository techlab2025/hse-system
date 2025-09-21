<script lang="ts" setup>
import { ref, watch } from 'vue'
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

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: ShowLangModel
}>()

// actual translations (values)
const langs = ref<{ locale: string; title: string }[]>([])

// selected base language
const lang = ref<TitleInterface | null>(null)

// default available langs
const langsDefault = [
  { locale: 'en', icon: USA, title: '' },
  { locale: 'ar', icon: SA, title: '' },
]

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
    ? new EditLangParams(
      props.data?.id! ?? 0,
      translationsParams,
      lang.value?.subtitle! ?? 'en',
    )
    : new AddLangParams(translationsParams, lang.value?.subtitle! ?? 'en')


  console.log(params, 'params')
  emit('update:data', params)
}

const setLang = (data: TitleInterface) => {
  lang.value = data
  updateData()
}

// when child emits modelValue (updated translations)
const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data

  console.log(langs.value, 'langs')
  updateData()
}

// init langs either from backend (edit mode) or from defaults (create mode)
watch(
  () => props.data,
  (newData) => {
    if (newData?.titles?.length) {
      langs.value = newData.titles // edit mode
    } else {
      langs.value = langsDefault.map((l) => ({
        locale: l.locale,
        title: '',
      })) // create mode
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="col-span-4 md:col-span-4">
    <LangTitleInput
      :langs="langsDefault"
      :modelValue="langs"
      @update:modelValue="setLangs"
    />
  </div>

  <div class="col-span-4 md:col-span-4">
    <CustomSelectInput
      :modelValue="lang"
      :staticOptions="langsList"
      label="Language"
      id="lang"
      placeholder="Select Language"
      @update:modelValue="setLang"
    />
  </div>
</template>
