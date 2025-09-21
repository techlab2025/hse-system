<script lang="ts" setup>
import { ref } from 'vue'

// import DatePicker from 'primevue/datepicker'
import TitleInterface from '@/base/Data/Models/title_interface'

import { LangsMap } from '@/constant/langs'
// import { LangEnum } from '@/features/setting/languages/Core/enums/langEnum.ts'
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

const langs = ref<{ title: string; lang: string }[]>([])
const lang = ref<TitleInterface | null>(null)

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

console.log(langsList)

const updateData = () => {
  const translationsParams = new TranslationsParams()

  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.lang, lang.title)
  })

  const params = props.data?.id
    ? new EditLangParams(props.data?.id! ?? 0, translationsParams, lang.value?.subtitle! ?? 'en')
    : new AddLangParams(translationsParams, lang.value?.subtitle! ?? 'en')

  // console.log(params)
  emit('update:data', params)
}

const setLang = (data: TitleInterface) => {
  lang.value = data
}

const langsDefault = [
  // { code: "eg", icon: Egy },
  { code: 'en', icon: USA },
  { code: 'ar', icon: SA },
]

const setLangs = (data: { title: string; lang: string }[]) => {
  langs.value = data
  updateData()
}
</script>

<template>
  <div class="col-span-4 md:col-span-4">
    <LangTitleInput @update:modelValue="setLangs" :langs="langsDefault" />
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

<style scoped></style>
