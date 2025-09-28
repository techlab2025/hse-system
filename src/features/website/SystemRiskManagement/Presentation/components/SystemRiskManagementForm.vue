<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
import SingleFileUpload from '@/shared/HelpersComponents/SingleFileUpload.vue'
import type SystemRiskManagementDetailsModel from '../../Data/models/SystemRiskManagementDetailsModel'
import EditSystemRiskManagementParams from '../../Core/params/editSystemRiskManagementParams'
import AddSystemRiskManagementParams from '../../Core/params/addSystemRiskManagementParams'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: SystemRiskManagementDetailsModel
}>()

const alt = ref<string>('')

// actual translations (values)
const langs = ref<{ locale: string; title: string }[]>([])
const langsSub = ref<{ locale: string; title: string }[]>([])
// const langsDescription = ref<{ locale: string; title: string }[]>([])

const image = ref<string>('')

// default available SystemRiskManagements
const langDefault = ref<{ locale: string; icon?: string; title: string }[]>([])

const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const indexSystemRiskManagementController =
    await IndexLangController.getInstance().getData(params)

  const response = indexSystemRiskManagementController.value

  if (response?.data?.length) {
    // map backend SystemRiskManagements into default structure
    langDefault.value = response.data.map((item: any) => ({
      locale: item.code,
      title: '', // empty initially
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

  const params = props.data?.id
    ? new EditSystemRiskManagementParams(
        props.data?.id! ?? 0,
        translationsParams,
        alt.value,
        image.value?.file,
      )
    : new AddSystemRiskManagementParams(translationsParams, alt.value, image.value?.file)

  emit('update:data', params)
}

// when child emits modelValue (updated translations)
const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data
  updateData()
}

const setLangsSub = (value: { locale: string; title: string }[]) => {
  langsSub.value = value
  updateData()
}

// init SystemRiskManagements either from backend (edit mode) or from defaults (create mode)
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
      if (newData?.subtitles?.length) {
        langsSub.value = newDefault.map((l) => {
          const existing = newData.subtitles.find((t) => t.locale === l.locale)
          return existing
            ? { locale: l.locale, title: existing.subtitle }
            : { locale: l.locale, title: '' }
        })
      } else {
        langsSub.value = newDefault.map((l) => ({ locale: l.locale, title: '' }))
      }



      alt.value = newData?.alt ?? ''
      image.value = newData?.image ?? ''
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
