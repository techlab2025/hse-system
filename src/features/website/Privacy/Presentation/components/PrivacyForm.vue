<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'

import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'
import type PrivacyDetailsModel from '../../Data/models/PrivacyDetailsModel'
import AddPrivacyParams from '../../Core/params/addPrivacyParams'
import ShowPrivacyController from '../controllers/showPrivacyController'
// import ShowPrivacyParams from '../../Core/params/showPrivacyParams'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: PrivacyDetailsModel
}>()

// language sets
const langs = ref<{ locale: string; title: string }[]>([])
// const showPrivacyControllerInstance = ShowPrivacyController.getInstance()

// default available langs (for input rendering)
const langDefault = ref<{ locale: string; icon?: string; title: string }[]>([])

// --- fetching languages from backend
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

  // assign for description / subtitle / button
  langDefault.value = defaults
  // langDefaultSubTitle.value = JSON.parse(JSON.stringify(defaults))
  // langDefaultButton.value = JSON.parse(JSON.stringify(defaults))
}

onMounted(async () => {
  await fetchLang()
})

// --- updating parent
const updateData = () => {
  const translationsParams = new TranslationsParams()

  langs.value.forEach((lang) => {
    translationsParams.setTranslation('description', lang.locale, lang.title)
  })

  const params = new AddPrivacyParams(translationsParams)

  emit('update:data', params)
}

// --- when child updates translations
const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data
  updateData()
}

// --- watch props (edit mode)
watch(
  [() => props.data, () => langDefault.value],
  ([newData, newDefault]) => {
    if (newDefault.length) {
      if (newData?.descriptions?.length) {
        langs.value = newDefault.map((l) => {
          const existing = newData.descriptions.find((t) => t.locale === l.locale)
          return existing ? existing : { locale: l.locale, title: '' }
        })
      } else {
        langs.value = newDefault.map((l) => ({ locale: l.locale, title: '' }))
      }
      updateData()
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="col-span-4 md:col-span-4">
    <!-- {{ langs }} -->
    <LangTitleInput
      type="textarea"
      :langs="langDefault"
      :modelValue="langs"
      :label="$t('description')"
      @update:modelValue="setLangs"
      field-type="description"
    />
  </div>
</template>
