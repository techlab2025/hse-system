<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'

// import { AccidentsTypesMap } from '@/constant/AccidentsTypes'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
// import type ShowAccidentsTypeModel from '@/features/setting/AccidentsType/Data/models/AccidentsTypeDetailsModel'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
// import EditAccidentsTypeParams from '@/features/setting/AccidentsType/Core/params/editAccidentsTypeParams.ts'
// import AddAccidentsTypeParams from '@/features/setting/AccidentsType/Core/params/addAccidentsTypeParams.ts'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
// import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
// import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'
// import IndexIndustryParams from '@/features/setting/Industries/Core/Params/indexIndustryParams.ts'
// import IndexIndustryController from '@/features/setting/Industries/Presentation/controllers/indexIndustryController.ts'
// import FileUpload from '@/shared/FormInputs/FileUpload.vue'
import { useRoute } from 'vue-router'
import type AccidentsTypeDetailsModel from '../../Data/models/AccidentsTypeDetailsModel'
import IndexIndustryParams from '@/features/setting/Industries/Core/Params/indexIndustryParams'
import IndexIndustryController from '@/features/setting/Industries/Presentation/controllers/indexIndustryController'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController'
import EditAccidentsTypeParams from '../../Core/params/editAccidentsTypeParams'
import AddAccidentsTypeParams from '../../Core/params/addAccidentsTypeParams'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
// import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64.ts'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: AccidentsTypeDetailsModel
}>()

// const route = useRoute()

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

const allIndustries = ref<boolean>(false)
// const hasCertificate = ref<number>(0)
// const image = ref<string>('')

// industry
const industry = ref<TitleInterface[]>([])
const industryParams = new IndexIndustryParams('', 0, 10, 1)
const industryController = IndexIndustryController.getInstance()

// default available AccidentsTypes
const langDefault = ref<{ locale: string; icon?: string; title: string }[]>([])

const user = useUserStore()
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
  const indexAccidentsTypeController = await IndexLangController.getInstance().getData(params)

  const response = indexAccidentsTypeController.value

  if (response?.data?.length) {
    // map backend AccidentsTypes into default structure
    langDefault.value = response.data.map((item: any) => ({
      locale: item.code,
      title: '', // empty initially
      // if you already have icons mapped, use AccidentsTypesMap
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

  console.log(allIndustries.value, 'industry')

  const AllIndustry = user.user?.type == OrganizationTypeEnum?.ADMIN ? allIndustries.value : null
  const params = props.data?.id
    ? new EditAccidentsTypeParams(
      props.data?.id! ?? 0,
      translationsParams,
      AllIndustry,
      industry.value?.map((item) => item.id) ?? [],
    )
    : new AddAccidentsTypeParams(
      translationsParams,
      AllIndustry,
      industry.value?.map((item) => item.id),
      // id,
    )

  console.log(params, 'params')
  emit('update:data', params)
}

const setIndustry = (data: TitleInterface[]) => {
  // console.log(data, 'data')
  industry.value = data
  updateData()
}

const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data

  updateData()
}

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

      allIndustries.value = newData?.allIndustries! ?? false
      industry.value = newData?.industries!
    }
  },
  { immediate: true },
)

</script>

<template>
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput :langs="langDefault" :modelValue="langs" @update:modelValue="setLangs" />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper check-box" v-if="user.user?.type == OrganizationTypeEnum.ADMIN">
    <label>{{ $t('all_industries') }}</label>
    <input type="checkbox" :value="true" v-model="allIndustries" @change="updateData" />
  </div>
  <div class="col-span-4 md:col-span-2" v-if="!allIndustries && user.user?.type == OrganizationTypeEnum.ADMIN">
    <CustomSelectInput :modelValue="industry" :controller="industryController" :params="industryParams" label="industry"
      id="AccidentsType" placeholder="Select industry" :type="2" @update:modelValue="setIndustry" />
  </div>

</template>
