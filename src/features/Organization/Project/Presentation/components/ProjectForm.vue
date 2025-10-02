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
import { useRoute } from 'vue-router'

import { useUserStore } from '@/stores/user'
import type ProjectDetailsModel from '../../Data/models/ProjectDetailsModel'
import EditProjectParams from '../../Core/params/editProjectParams'
import AddProjectParams from '../../Core/params/addProjectParams'
import IndexPartnerController from '@/features/Organization/Partner/Presentation/controllers/indexPartnerController'
import IndexPartnerParams from '@/features/Organization/Partner/Core/params/indexPartnerParams'
import IndexOrganizationLocationController from '@/features/Organization/OrganizationLocation/Presentation/controllers/indexOrganizationLocationController'
import IndexOrganizationLocationParams from '@/features/Organization/OrganizationLocation/Core/params/indexOrganizationLocationParams'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: ProjectDetailsModel
}>()

const partner_id = ref<TitleInterface | null>(null)

const indexPartnerController = IndexPartnerController.getInstance()

const indexPartnerParams = new IndexPartnerParams(
  '',
  0,
  0,
  0,
  // id.value?? '',
)

const setPartnerId = (data: TitleInterface | null) => {
  partner_id.value = data
  updateData()
}

const organization_location_ids = ref<TitleInterface[]>([])

const indexOrganizationLocationController = IndexOrganizationLocationController.getInstance()

const indexOrganizationLocationParams = new IndexOrganizationLocationParams(
  '',
  0,
  0,
  0,
  // id.value?? '',
)

const setOrganizationLocationIds = (data: TitleInterface[]) => {
  organization_location_ids.value = data
  updateData()
}

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
  const indexProjectController = await IndexLangController.getInstance().getData(params)

  const response = indexProjectController.value

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
      { locale: 'en', icon: USA, description: '' },
      { locale: 'ar', icon: SA, description: '' },
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
  // langsDescription.value.forEach((lang) => {
  //   translationsParams.setTranslation('description', lang.locale, lang.title)
  // })

  const params = props.data?.id
    ? new EditProjectParams(
        props.data.id,
        translationsParams,
        partner_id.value?.id,
        organization_location_ids.value,
      )
    : new AddProjectParams(
        translationsParams,
        partner_id.value?.id,
        organization_location_ids.value,
      )

  // console.log(params, 'params')

  emit('update:data', params)
}

// ---------- Watchers ----------
// Init from props (edit mode) or defaults (create mode)
watch(
  [() => props.data, () => langDefault.value],
  ([newData, newDefault]) => {
    if (newDefault.length) {
      // titles
      if (newData?.titles?.length) {
        langs.value = newDefault.map((l) => {
          const existing = newData.titles.find((t) => t.locale === l.locale)
          return existing ? existing : { locale: l.locale, title: '' }
        })
      } else {
        langs.value = newDefault.map((l) => ({ locale: l.locale, title: '' }))
      }

      partner_id.value = newData?.partner

      organization_location_ids.value = newData?.organizationLocation

      updateData()
    }
  },
  { immediate: true },
)

// Auto-update emit whenever key data changes
watch(
  [langs, partner_id, organization_location_ids],
  () => {
    updateData()
  },
  { deep: true },
)
</script>

<template>
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput
      :langs="langDefault"
      :modelValue="langs"
      @update:modelValue="(val) => (langs = val)"
    />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <CustomSelectInput
      :modelValue="partner_id"
      @update:modelValue="setPartnerId"
      :controller="indexPartnerController"
      :params="indexPartnerParams"
      :label="$t('partner')"
      :placeholder="$t('select_partner')"
    />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <CustomSelectInput
      :modelValue="organization_location_ids"
      @update:modelValue="setOrganizationLocationIds"
      :controller="indexOrganizationLocationController"
      :params="indexOrganizationLocationParams"
      :label="$t('organization_locations')"
      :placeholder="$t('organization_locations')"
      :type="2"
    />
  </div>
</template>
