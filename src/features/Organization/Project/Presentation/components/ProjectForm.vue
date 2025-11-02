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
import DatePicker from 'primevue/datepicker'

import { useUserStore } from '@/stores/user'
import type ProjectDetailsModel from '../../Data/models/ProjectDetailsModel'
import EditProjectParams from '../../Core/params/editProjectParams'
import AddProjectParams from '../../Core/params/addProjectParams'
import IndexPartnerController from '@/features/Organization/Partner/Presentation/controllers/indexPartnerController'
import IndexPartnerParams from '@/features/Organization/Partner/Core/params/indexPartnerParams'
import IndexOrganizationLocationController from '@/features/Organization/OrganizationLocation/Presentation/controllers/indexOrganizationLocationController'
import IndexOrganizationLocationParams from '@/features/Organization/OrganizationLocation/Core/params/indexOrganizationLocationParams'
import EmployeeHeader from './Employee/EmployeeHeader.vue'
import SwitchInput from '@/shared/FormInputs/SwitchInput.vue'
import IndexLocationController from '@/features/setting/Location/Presentation/controllers/indexLocationController'
import IndexLocationParams from '@/features/setting/Location/Core/params/indexLocationParams'
import AddZoneDialog from './Dialogs/ZoneDialog/AddZoneDialog.vue'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: ProjectDetailsModel
}>()
const EvaluatingMethod = ref<TitleInterface | null>(null)

const partner_id = ref<TitleInterface | null>(null)
const location = ref<TitleInterface[]>([])

const indexPartnerController = IndexPartnerController.getInstance()
const indexLocationController = IndexLocationController.getInstance()
const indexLocationParams = new IndexLocationParams("", 0, 0, 0,)
const langsDescription = ref<{ locale: string; icon?: any; description: string }[]>([])

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
  console.log(response.data, "da");

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

  langsDescription.value.forEach((lang) => {
    translationsParams.setTranslation('description', lang.locale, lang.description)
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
  [() => props.data, () => langDefault.value, () => langDefaultDescription.value],
  ([newData, newDefault, newDefaultDesc]) => {
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

      // descriptions
      if (newData?.descriptions?.length) {
        langsDescription.value = newDefaultDesc.map((l) => {
          const existing = newData.descriptions.find((t) => t.locale === l.locale)
          return existing ? existing : { locale: l.locale, description: '' }
        })
      } else {
        langsDescription.value = newDefaultDesc.map((l) => ({
          locale: l.locale,
          description: '',
        }))
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

const fields = ref([
  { key: 'SerialNumber', label: 'Serial Number', placeholder: 'You can leave it (auto-generated)', value: '', enabled: false },
])

const setLocations = (data: TitleInterface[]) => {
  location.value = data
}
const setEvaluatingMethod = (data: TitleInterface) => {
  EvaluatingMethod.value = data
}
</script>

<template>
  <div class="col-span-4">
    <EmployeeHeader :title="`project info`" />
  </div>
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput :langs="langDefault" :modelValue="langs" @update:modelValue="(val) => (langs = val)" />
  </div>
  <div class="col-span-4 md:col-span-2">
    <SwitchInput :fields="fields" :switch_title="'Auto'" @update:value="console.log($event)" />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="date">
      {{ $t('Start Date') }}
    </label>
    <DatePicker v-model="date" id="date" :placeholder="`select the date`" />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <CustomSelectInput :modelValue="partner_id" @update:modelValue="setPartnerId" :controller="indexPartnerController"
      :params="indexPartnerParams" :label="$t('contractor')" :placeholder="$t('contractor')" :type="2" />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <CustomSelectInput :modelValue="location" @update:modelValue="setLocations" :controller="indexLocationController"
      :params="indexLocationParams" :label="$t('location')" :placeholder="$t('location')" :type="2" />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="">Zones</label>
    <AddZoneDialog :locations="location"  />
  </div>
  <div class="col-span-4 md:col-span-4 input-wrapper">
    <CustomSelectInput :modelValue="EvaluatingMethod" @update:modelValue="setEvaluatingMethod"
      :controller="indexLocationController" :params="indexLocationParams"
      :label="$t('the method of evaluating employee performance')"
      :placeholder="$t('choose your method of evaluating employee performance')" />
  </div>
  <div class="col-span-4 md:col-span-4 input-wrapper">
    <LangTitleInput :label="$t('project objectives')" :langs="langDefault" :modelValue="langsDescription"
      @update:modelValue="(val) => (langsDescription = val)" field-type="description" type="textarea"
      :placeholder="`What are the project objectives?`" />
  </div>

</template>
