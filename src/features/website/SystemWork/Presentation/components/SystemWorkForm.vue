<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
// import TitleInterface from '@/base/Data/Models/title_in
// terface'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import DatePicker from 'primevue/datepicker'
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
import type SystemWorkDetailsModel from '../../Data/models/SystemWorkDetailsModel'
import EditSystemWorkParams from '../../Core/params/editSystemWorkParams'
import AddSystemWorkParams from '../../Core/params/addSystemWorkParams'

// import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64.ts'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: SystemWorkDetailsModel
}>()

// const route = useRoute()

const name = ref<string>('')
const rate = ref<number>(0)
const date = ref<string>('')
const alt = ref<string>('')

// actual translations (values)
const langs = ref<{ locale: string; title: string }[]>([])

const langsSub = ref<{ locale: string; title: string }[]>([])
const langsDescription = ref<{ locale: string; title: string }[]>([])

// const allIndustries = ref<boolean>(false)
// const hasCertificate = ref<number>(0)
const image = ref<string>('')

// default available SystemWorks
const langDefault = ref<{ locale: string; icon?: string; title: string }[]>([])

const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const indexSystemWorkController = await IndexLangController.getInstance().getData(params)

  const response = indexSystemWorkController.value

  if (response?.data?.length) {
    // map backend SystemWorks into default structure
    langDefault.value = response.data.map((item: any) => ({
      locale: item.code,
      title: '', // empty initially
      // if you already have icons mapped, use SystemWorksMap
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
  } else {
    langDefault.value = [
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

const updateData = () => {
  const translationsParams = new TranslationsParams()

  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })

  langsSub.value.forEach((lang) => {
    translationsParams.setTranslation('subtitle', lang.locale, lang.title)
  })

  langsDescription.value.forEach((lang) => {
    translationsParams.setTranslation('description', lang.locale, lang.title)
  })

  const params = props.data?.id
    ? new EditSystemWorkParams(
        props.data?.id! ?? 0,
        translationsParams,
        alt.value,
        image.value?.file,
      )
    : new AddSystemWorkParams(translationsParams, alt.value, image.value?.file)

  // console.log(params, 'params')
  emit('update:data', params)
}

// when child emits modelValue (updated translations)
const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data

  // console.log(langs.value, 'langs')
  updateData()
}

const setLangsSub = (value: { locale: string; title: string }[]) => {
  langsSub.value = value
  updateData()
}
const setLangsDescription = (value: { locale: string; title: string }[]) => {
  langsDescription.value = value
  updateData()
}

// init SystemWorks either from backend (edit mode) or from defaults (create mode)
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

      if (newData?.subtitle?.length) {
        langsSub.value = newDefault.map((l) => {
          const existing = newData.subtitle.find((t) => t.locale === l.locale)
          return existing ? existing : { locale: l.locale, title: '' }
        })
      } else {
        langsSub.value = newDefault.map((l) => ({ locale: l.locale, title: '' }))
      }

      if (newData?.descriptions?.length) {
        langsDescription.value = newDefault.map((l) => {
          const existing = newData.descriptions.find((t) => t.locale === l.locale)
          return existing ? existing : { locale: l.locale, title: '' }
        })
      } else {
        langsDescription.value = newDefault.map((l) => ({ locale: l.locale, title: '' }))
      }

      alt.value = newData?.alt ?? ''
      image.value = newData?.image ?? ''
      // hasCertificate.value = newData?.hasCertificate ?? 0
    }
  },
  { immediate: true },
)

const setImage = async (data: File) => {
  image.value = await filesToBase64(data)
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
      :modelValue="langsSub"
      :label="$t('sub_title')"
      @update:modelValue="setLangsSub"
    />
  </div>

  <div class="col-span-4 md:col-span-2">
    <LangTitleInput
      type="textarea"
      :langs="langDefault"
      :modelValue="langsDescription"
      :label="$t('description')"
      @update:modelValue="setLangsDescription"
    />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="alt">
      {{ $t('alt_image') }}
    </label>
    <input
      id="rate"
      v-model="alt"
      type="text"
      class="input"
      placeholder="alt"
      @input="updateData"
    />
  </div>

  <div class="col-span-4 md:col-span-4">
    <SingleFileUpload
      v-model="image"
      @update:modelValue="setImage"
      label="Image"
      id="image"
      placeholder="Select image"
    />
  </div>
</template>
