<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'

import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'
import IndexIndustryParams from '@/features/setting/Industries/Core/Params/indexIndustryParams.ts'
import IndexIndustryController from '@/features/setting/Industries/Presentation/controllers/indexIndustryController.ts'
import { useRoute } from 'vue-router'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64.ts'
import SingleFileUpload from '@/shared/HelpersComponents/SingleFileUpload.vue'
import type CertificateDetailsModel from '../../Data/models/CertificateDetailsModel'
import EditCertificateParams from '../../Core/params/editCertificateParams'
import AddCertificateParams from '../../Core/params/addCertificateParams'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: CertificateDetailsModel
}>()

const route = useRoute()
const id = route.params.parent_id

type ImageValue = string | { file?: File; id?: number }

// ---------- State ----------
const langs = ref<
  {
    locale: string
    icon?: any
    title: string
  }[]
>([])

const langsDescription = ref<{ locale: string; description: string }[]>([])

const allIndustries = ref<number>(0)
const industry = ref<TitleInterface[]>([])
const image = ref<ImageValue>('')

// industry controller
const industryParams = new IndexIndustryParams('', 0, 10, 1)
const industryController = IndexIndustryController.getInstance()

// default available langs from backend 
const langDefault = ref<
  {
    locale: string
    icon?: any
    title: string
  }[]
>([])
const langDefaultDescription = ref<
  {
    locale: string
    icon?: any
    title: string
  }[]
>([])

const user = useUserStore()
// ---------- Fetch available languages ----------
const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  if (user?.user?.languages.length) {
    langDefault.value = user?.user?.languages.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
    return
  }
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const indexCertificateController = await IndexLangController.getInstance().getData(params)

  const response = indexCertificateController.value

  if (response?.data?.length) {
    langDefault.value = response.data.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))

    langDefaultDescription.value = response.data.map((item: any) => ({
      locale: item.code,
      description: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
  } else {
    langDefault.value = [
      { locale: 'en', icon: USA, title: '' },
      { locale: 'ar', icon: SA, title: '' },
    ]
    langDefaultDescription.value = [
      { locale: 'en', icon: USA, title: '' },
      { locale: 'ar', icon: SA, title: '' },
    ]
  }
}

onMounted(async () => {
  await fetchLang()
})

// ---------- Emit update ----------
const updateData = () => {
  const translationsParams = new TranslationsParams()

  // titles
  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })

  // descriptions
  langsDescription.value.forEach((lang) => {
    translationsParams.setTranslation('description', lang.locale, lang.description)
  })

  const AllIndustry = user.user?.type == OrganizationTypeEnum?.ADMIN ? allIndustries.value : null

  console.log(translationsParams, 'translationsParams')
  const params = props.data?.id
    ? new EditCertificateParams(
      props.data.id,
      translationsParams,
      AllIndustry,
      industry.value?.map((item) => item.id),
      typeof image.value === 'string' ? image.value : '',
    )
    : new AddCertificateParams(
      translationsParams,
      AllIndustry,
      industry.value?.map((item) => item.id),
      typeof image.value === 'string' ? image.value : '',

    )

  // console.log(params, 'params')

  emit('update:data', params)
}

// ---------- Watchers ----------
// Init from props (edit mode) or defaults (create mode)
watch(
  [() => props.data, () => langDefault.value, () => langDefaultDescription.value],
  ([newData, newDefault, newDefaultDesc]) => {
    // console.log(newData, 'newData');

    if (newDefault.length) {
      // titles

      langs.value = newData?.titles?.length
        ? newDefault.map((l) => {
          const existing = newData.titles.find((t) => t.locale === l.locale)
          return existing ?? { locale: l.locale, title: '' }
        })
        : newDefault.map((l) => ({ locale: l.locale, title: '' }))

      // descriptions
      langsDescription.value = newData?.descriptions?.length
        ? newDefault.map((l) => {
          const existing = newData.descriptions.find((t) => t.locale === l.locale)
          return existing ?? { locale: l.locale, title: '' }
        })
        : newDefault.map((l) => ({ locale: l.locale, title: '' }))

      allIndustries.value = newData?.allIndustries ?? 0
      industry.value = newData?.industries ?? []
      image.value = typeof newData?.image === 'string' ? newData?.image : ''
    }
  },
  { immediate: true },
)

// Auto-update emit whenever key data changes
watch(
  [langs, langsDescription, industry, allIndustries, image],
  () => {
    updateData()
  },
  { deep: true },
)

// ---------- Helpers ----------
const setImage = async (data: File | string) => {
  // image.value = await filesToBase64(data)
  image.value = typeof data === 'string' ? data : await filesToBase64(data)
  updateData()
}
</script>

<template>
  <div class="col-span-4 md:col-span-4">
    <LangTitleInput :langs="langDefault" :modelValue="langs" @update:modelValue="(val) => (langs = val)"
      :required="true" />
  </div>

  <div class="col-span-4 md:col-span-4">
    <LangTitleInput :label="$t('description')" :langs="langDefaultDescription" :modelValue="langsDescription"
      @update:modelValue="(val) => (langsDescription = val)" type="textarea" />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper check-box" v-if="user.user?.type == OrganizationTypeEnum?.ADMIN">
    <label>{{ $t('all_industries') }}</label>
    <input type="checkbox" :value="1" v-model="allIndustries" :checked="allIndustries == 1" />
  </div>

  <div class="col-span-4 md:col-span-2" v-if="!allIndustries && user.user?.type == OrganizationTypeEnum?.ADMIN">
    <CustomSelectInput :modelValue="industry" :controller="industryController" :params="industryParams"
      :label="$t('all_industries')" id="all_industries" placeholder="Select industry" :type="2"
      @update:modelValue="(val) => (industry = val)" />
  </div>

  <div class="col-span-4 md:col-span-4">
    <SingleFileUpload v-model="image" @update:modelValue="setImage" label="Image" id="image"
      placeholder="Select image" />
  </div>
</template>
