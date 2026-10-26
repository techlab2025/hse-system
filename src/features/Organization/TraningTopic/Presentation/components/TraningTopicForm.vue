<script lang="ts" setup>
import { useRequiredFields } from '@/composables/useRequiredFields'
import { markRaw, onMounted, ref, watch, type Component } from 'vue'
import { useI18n } from 'vue-i18n'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'
import { useUserStore } from '@/stores/user'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import AddTraningTopicParams from '../../Core/params/addTraningTopicParams'
import EditTraningTopicParams from '../../Core/params/editTraningTopicParams'
import type TraningTopicDetailsModel from '../../Data/models/TraningTopicDetailsModel'
import TitleInterface from '@/base/Data/Models/title_interface'
import CustomCheckbox from '@/shared/HelpersComponents/CustomCheckbox.vue'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import IndexIndustryParams from '@/features/setting/Industries/Core/Params/indexIndustryParams'
import IndexIndustryController from '@/features/setting/Industries/Presentation/controllers/indexIndustryController'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'

interface LangTitleValue {
  locale: string
  icon?: Component | string
  title: string
}

const props = defineProps<{
  data?: TraningTopicDetailsModel
}>()

const emit = defineEmits<{
  'update:data': [AddTraningTopicParams | EditTraningTopicParams]
}>()

const { t } = useI18n()
const user = useUserStore()
const langs = ref<LangTitleValue[]>([])
const langDefault = ref<LangTitleValue[]>([])
const allIndustries = ref(false)
const industry = ref<TitleInterface[]>([])
const industryController = IndexIndustryController.getInstance()
const industryParams = new IndexIndustryParams('', 0, 10, 1)

const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  if (user?.user?.languages?.length) {
    langDefault.value = user.user.languages.map((item: { code: string }) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
  } else {
    const params = new IndexLangParams(query, pageNumber, perPage, withPage)
    const response = await IndexLangController.getInstance().getData(params)

    if (response.value?.data?.length) {
      langDefault.value = response.value.data.map((item: { code: string }) => ({
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

  allIndustries.value = props.data?.allIndustries ?? false
  industry.value = props.data?.industries ?? []

  updateData()
}

const updateData = () => {
  const translations = new TranslationsParams()

  langs.value.forEach((lang) => {
    translations.setTranslation('title', lang.locale, lang.title)
  })
  const adminScope = user.user?.type === OrganizationTypeEnum.ADMIN ? allIndustries.value : null
  const industryIds = industry.value.map((item) => item.id)

  const params = props.data?.id
    ? new EditTraningTopicParams(props.data.id, translations, adminScope, industryIds)
    : new AddTraningTopicParams(translations, adminScope, industryIds)

  emit('update:data', params)
}
const updateAllIndustries = (value: boolean) => {
  allIndustries.value = value
  updateData()
}
const setIndustry = (value: TitleInterface[]) => {
  industry.value = value
  updateData()
}
const setLangs = (value: { locale: string; title?: string }[]) => {
  langs.value = value.map((item) => ({ locale: item.locale, title: item.title ?? '' }))
}

const { requiredFieldErrors: requiredFields, validateRequiredFields } = useRequiredFields(
  'TraningTopicForm',
  () => [
    {
      key: 'title',
      message: '',
      isMissing: () => !langs.value.some((lang) => Boolean(lang.title?.trim())),
    },
    {
      key: 'industry',
      message: '',
      isMissing: () =>
        user.user?.type === OrganizationTypeEnum.ADMIN &&
        !allIndustries.value &&
        !industry.value.length,
    },
  ],
)

watch(
  () => langs.value,
  () => updateData(),
  { deep: true },
)

watch(
  () => props.data,
  (data) => {
    allIndustries.value = data?.allIndustries ?? false
    industry.value = data?.industries ?? []
    if (langDefault.value.length) {
      langs.value = langDefault.value.map((lang) => ({
        ...lang,
        title: data?.titles?.find((item) => item.locale === lang.locale)?.title ?? '',
      }))
    }
    updateData()
  },
)

onMounted(fetchLang)

defineExpose({ validateRequiredFields })
</script>

<template>
  <div data-required-field="title">
    <LangTitleInput
      :label="$t('traning_topic_title')"
      :langs="langDefault"
      :modelValue="langs"
      @update:modelValue="setLangs"
    />
    <small v-if="requiredFields.title" class="text-red-500">
      {{ requiredFields.title }}
    </small>
  </div>
  <div
    v-if="user.user?.type === OrganizationTypeEnum.ADMIN"
    class="input-wrapper col-span-4 md:col-span-2"
  >
    <CustomCheckbox
      :index="3"
      title="all_industries"
      :checked="allIndustries"
      @update:checked="updateAllIndustries"
    />
  </div>
  <div
    v-if="!allIndustries && user.user?.type === OrganizationTypeEnum.ADMIN"
    class="col-span-4 md:col-span-2"
  >
    <CustomSelectInput
      :model-value="industry"
      :controller="industryController"
      :params="industryParams"
      label="industry"
      id="traning-topic-industry"
      placeholder="Select industry"
      :type="2"
      @update:model-value="setIndustry"
    />
  </div>
</template>
