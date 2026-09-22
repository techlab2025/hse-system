<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'
import { useUserStore } from '@/stores/user'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import AddTraningTopicParams from '../../Core/params/addTraningTopicParams'
import EditTraningTopicParams from '../../Core/params/editTraningTopicParams'
import type TraningTopicDetailsModel from '../../Data/models/TraningTopicDetailsModel'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'

interface LangTitleValue {
  locale: string
  icon?: unknown
  title: string
}

const props = defineProps<{
  data?: TraningTopicDetailsModel
}>()

const emit = defineEmits<{
  'update:data': [AddTraningTopicParams | EditTraningTopicParams]
}>()

const user = useUserStore()
const langs = ref<LangTitleValue[]>([])
const langDefault = ref<LangTitleValue[]>([])
const requiredFields = ref<Record<string, string>>({})

const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  if (user?.user?.languages?.length) {
    langDefault.value = user.user.languages.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
  } else {
    const params = new IndexLangParams(query, pageNumber, perPage, withPage)
    const response = await IndexLangController.getInstance().getData(params)

    if (response.value?.data?.length) {
      langDefault.value = response.value.data.map((item: any) => ({
        locale: item.code,
        title: '',
        icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
      }))
    }
  }

  if (props.data?.titles?.length) {
    langs.value = langDefault.value.map((lang) => ({
      ...lang,
      title: props.data?.titles.find((item) => item.locale === lang.locale)?.title ?? '',
    }))
  } else {
    langs.value = langDefault.value.map((lang) => ({ ...lang }))
  }

  updateData()
}

const updateData = () => {
  const translations = new TranslationsParams()

  langs.value.forEach((lang) => {
    translations.setTranslation('title', lang.locale, lang.title)
  })

  const params = props.data?.id
    ? new EditTraningTopicParams(props.data.id, translations)
    : new AddTraningTopicParams(translations)

  emit('update:data', params)
}

const validateRequiredFields = () => {
  requiredFields.value = {}

  const firstMissing = langs.value.find((lang) => !lang.title?.trim())
  if (firstMissing) {
    requiredFields.value.title = 'Title is required for all selected languages'
    new OpenWarningDilaog('Title Is Required').openDialog()

    requestAnimationFrame(() => {
      document.querySelector('[data-field="traning-topic-title"]')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    })

    return false
  }

  return true
}

watch(
  () => langs.value,
  () => updateData(),
  { deep: true },
)

onMounted(fetchLang)

defineExpose({ validateRequiredFields })
</script>

<template>
  <div data-field="traning-topic-title">
    <LangTitleInput
      :label="$t('traning_topic_title')"
      :langs="langDefault"
      :modelValue="langs"
      @update:modelValue="(val) => (langs = val)"
    />
    <small v-if="requiredFields.title" class="text-red-500">
      {{ requiredFields.title }}
    </small>
  </div>
</template>
