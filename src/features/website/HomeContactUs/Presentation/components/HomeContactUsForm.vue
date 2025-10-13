<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'

import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
// import DatePicker from 'primevue/datepicker'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'
// import IndexIndustryParams from '@/features/setting/Industries/Core/Params/indexIndustryParams.ts'
// import IndexIndustryController from '@/features/setting/Industries/Presentation/controllers/indexIndustryController.ts'
// import FileUpload from '@/shared/FormInputs/FileUpload.vue'
// import { useRoute } from 'vue-router'

import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import SingleFileUpload from '@/shared/HelpersComponents/SingleFileUpload.vue'
import type HomeContactUsDetailsModel from '../../Data/models/HomeContactUsDetailsModel'
import EditHomeContactUsParams from '../../Core/params/editHomeContactUsParams'
import AddHomeContactUsParams from '../../Core/params/addHomeContactUsParams'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: HomeContactUsDetailsModel
}>()

// basic refs
const name = ref<string>('')
const rate = ref<number>(0)
const date = ref<string>('')
const alt = ref<string>('')

// language sets
const langs = ref<{ locale: string; title: string }[]>([])
const langsSubTitle = ref<{ locale: string; title: string }[]>([])
const langsButton = ref<{ locale: string; title: string }[]>([])

// default available langs (for input rendering)
const langDefault = ref<{ locale: string; icon?: string; title: string }[]>([])

// image can be File or base64 string
const image = ref<string | File>('')

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
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })

  langsSubTitle.value.forEach((lang) => {
    translationsParams.setTranslation('subtitle', lang.locale, lang.title)
  })

  langsButton.value.forEach((lang) => {
    translationsParams.setTranslation('button_title', lang.locale, lang.title)
  })

  const params = props.data?.id
    ? new EditHomeContactUsParams(props.data?.id!, translationsParams, alt.value, image.value)
    : new AddHomeContactUsParams(translationsParams, alt.value, image.value)

  emit('update:data', params)
}

// --- when child updates translations
const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data
  updateData()
}
const setLangsSubTitle = (value: { locale: string; title: string }[]) => {
  langsSubTitle.value = value
  updateData()
}
const setLangsButton = (value: { locale: string; title: string }[]) => {
  langsButton.value = value
  updateData()
}

// --- watch props (edit mode)
watch(
  [() => props.data, () => langDefault.value],
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

      langsSubTitle.value = newDefault.map((l) => {
        const existing = newData?.subtitle?.find((t: any) => t.locale === l.locale)
        return existing ? existing : { locale: l.locale, title: '' }
      })

      langsButton.value = newDefault.map((l) => {
        const existing = newData?.buttonTitles?.find((t: any) => t.locale === l.locale)
        return existing ? existing : { locale: l.locale, title: '' }
      })

      name.value = newData?.name ?? ''
      rate.value = newData?.rate ?? 0
      date.value = newData?.date ?? ''
      alt.value = newData?.alt ?? ''
      image.value = newData?.image ?? ''
    }
  },
  { immediate: true },
)

// --- image handling
const setImage = async (data: File | string) => {
  // image.value = await filesToBase64(data)
  image.value = typeof data === 'string' ? data : await filesToBase64(data)
  updateData()
}
</script>

<template>
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput
      type="text"
      :langs="langDefault"
      :modelValue="langs"
      :label="$t('title')"
      @update:modelValue="setLangs"
    />
  </div>

  <div class="col-span-4 md:col-span-2">
    <LangTitleInput
      type="text"
      :langs="langDefault"
      :modelValue="langsSubTitle"
      :label="$t('sub_title')"
      @update:modelValue="setLangsSubTitle"
      field-type="subtitle"
    />
  </div>

  <div class="col-span-4 md:col-span-2">
    <LangTitleInput
      type="text"
      :langs="langDefault"
      :modelValue="langsButton"
      :label="$t('button_title')"
      @update:modelValue="setLangsButton"
      field-type="button_title"
    />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="alt">
      {{ $t('alt_image') }}
    </label>
    <input id="alt" v-model="alt" type="text" class="input" placeholder="alt" @input="updateData" />
  </div>

  <div class="col-span-4 md:col-span-4">
    <SingleFileUpload
      v-model="image"
      @update:modelValue="setImage"
      label="Image"
      id="image"
      placeholder="Select image"
      :isCrop="true"
      :aspectRatio="280 / 278"
    />
  </div>
</template>
