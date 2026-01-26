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
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import CustomCheckbox from '@/shared/HelpersComponents/CustomCheckbox.vue'
import type ProjectTypeDetailsModel from '@/features/setting/ProjectType/Data/models/projectTypeDetailsModel'
import AddRootCausesParams from '../../Core/params/addRootCausesParams'
import EditRootCausesParams from '../../Core/params/editRootCausesParams'
import type RootCausesDetailsModel from '../../Data/models/RootCausesDetailsModel'

const emit = defineEmits(['update:data', 'close:data'])

const props = defineProps<{
  data?: RootCausesDetailsModel
}>()

const route = useRoute()

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

const allIndustries = ref<number>(0)

// industry
const industry = ref<TitleInterface>()
const industryParams = new IndexIndustryParams('', 0, 10, 1)
const industryController = IndexIndustryController.getInstance()

// default available EquipmentTypes
const langDefault = ref<{ locale: string; icon?: string; title: string }[]>([])

const user = useUserStore()
const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  // console.log(user.user, 'user')
  if (user?.user?.languages.length) {
    langDefault.value = user?.user?.languages.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
    return
  }
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const indexOrganizationLocationController =
    await IndexLangController.getInstance().getData(params)

  const response = indexOrganizationLocationController.value

  if (response?.data?.length) {
    langDefault.value = response.data.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
  } else {
    langDefault.value = [
      { locale: 'en', icon: USA, title: '' },
      { locale: 'ar', icon: SA, title: '' },
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

  const AllIndustry = user.user?.type == OrganizationTypeEnum?.ADMIN ? allIndustries.value : null

  const params = props.data?.id
    ? new EditRootCausesParams(
        props.data?.id! ?? 0,
        translationsParams,
        user.user?.type == OrganizationTypeEnum?.ADMIN ? AllIndustry : null,
        industry.value?.map((item) => item.id),
      )
    : new AddRootCausesParams(
        translationsParams,
        user.user?.type == OrganizationTypeEnum?.ADMIN ? AllIndustry : null,
        industry.value?.map((item) => item.id),
      )
  emit('update:data', params)
}

const setIndustry = (data: TitleInterface) => {
  industry.value = data
  updateData()
}

// when child emits modelValue (updated translations)
const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data

  // console.log(langs.value, 'langs')
  updateData()
}

// init EquipmentTypes either from backend (edit mode) or from defaults (create mode)
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
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="col-span-4 md:col-span-4">
    <LangTitleInput :langs="langDefault" :modelValue="langs" @update:modelValue="setLangs" />
  </div>

  <!-- all industry -->
  <div class="input-wrapper col-span-2" v-if="user.user?.type == OrganizationTypeEnum?.ADMIN">
    <CustomCheckbox
      :title="`all_industries`"
      :checked="allIndustries"
      @update:checked="allIndustries = $event"
    />
  </div>
  <!--industry  -->
  <div
    class="col-span-4 md:col-span-2"
    v-if="!allIndustries && user.user?.type == OrganizationTypeEnum?.ADMIN"
  >
    <CustomSelectInput
      :modelValue="industry"
      :controller="industryController"
      :params="industryParams"
      label="Select Industry"
      id="EquipmentType"
      placeholder="Select industry"
      :type="2"
      @update:modelValue="setIndustry"
    />
  </div>
</template>
