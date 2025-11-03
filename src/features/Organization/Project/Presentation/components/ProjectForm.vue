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
import IndexMethodsController from '@/features/setting/Methods/Presentation/controllers/indexMethodsController'
import IndexMethodsParams from '@/features/setting/Methods/Core/params/indexMethodsParams'
import { LocationEnum } from '@/features/setting/Location/Core/Enum/LocationEnum'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: ProjectDetailsModel
}>()
const EvaluatingMethod = ref<TitleInterface[] | null>([])

const partner_id = ref<TitleInterface>(null)
const location = ref<TitleInterface[]>([])

const indexPartnerController = IndexPartnerController.getInstance()
const indexLocationController = IndexLocationController.getInstance()
const indexLocationParams = new IndexLocationParams("", 0, 0, 0,)


const indexMethodsController = IndexMethodsController.getInstance()
const indexMethodsParams = new IndexMethodsParams("", 0, 0, 0,)



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

const route = useRoute()
const id = route.params.parent_id


const langs = ref<
  {
    locale: string
    icon?: any
    title: string
  }[]
>([])

const langsDescription = ref<{
  locale: string;
  icon?: any;
  description: string
}[]>([])


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

    langDefaultDescription.value = user?.user?.languages.map((item: any) => ({
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
      { locale: 'en', icon: USA, title: '' },
      { locale: 'ar', icon: SA, title: '' },
    ]
  }
}

onMounted(async () => {
  await fetchLang()
})
const date = ref()
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


  const params = props.data?.id
    ? new EditProjectParams(
      props.data.id,
      translationsParams,
      partner_id.value?.id,
      date.value,
      location.value.map((l) => l.id),
      ZoneIds.value.map((z) => z),
      EvaluatingMethod.value?.id
    )
    : new AddProjectParams(
      translationsParams,
      partner_id.value?.id,
      date.value,
      SerialNumber.value?.SerialNumber,
      location.value.map((l) => l.id),
      ZoneIds.value.map((z) => z),
      EvaluatingMethod.value?.map((p) => p.id)
    )
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

      SerialNumber.value = newData?.SerialNumber;
      date.value = newData?.startDate;
      partner_id.value = newData?.partner;
      SelectedCountry.value = newData?.locations[0];

      updateData()
    }
  },
  { immediate: true },
)

const fields = ref([
  { key: 'SerialNumber', label: 'Serial Number', placeholder: 'You can leave it (auto-generated)', value: props.data?.SerialNumber, enabled: false },
])

const setLocations = (data: TitleInterface[]) => {
  location.value = data
  updateData()
}
const setEvaluatingMethod = (data: TitleInterface[]) => {
  EvaluatingMethod.value = data

  updateData()
}

const ZoneIds = ref<number[]>([])
const UpdateZones = (data: { locationId: number; locationName: string; zones: { id: number; title: string }[] }[]) => {
  ZoneIds.value = []
  data.forEach(item => {
    item.zones.forEach(z => ZoneIds.value.push(z.id))
  })
  updateData()
}

const SerialNumber = ref()
const UpdateSerial = (data) => {
  SerialNumber.value = data
  updateData()
}
const UpdateDate = (date) => {
  date.value = date
  updateData()
}


// Location Handel Start

const indexLocationCountriesController = IndexLocationController.getInstance()
const indexLocationCountriesParams = new IndexLocationParams('', 0, 0, 0, LocationEnum.COUNTRY)

const indexLocationStatesController = IndexLocationController.getInstance()
const indexLocationStatesParams = ref<IndexLocationParams | null>(null)

const indexLocationCityController = IndexLocationController.getInstance()
const indexLocationCityParams = ref<IndexLocationParams | null>(null)

const indexLocationAreasController = IndexLocationController.getInstance()
const indexLocationAreasParams = ref<IndexLocationParams | null>(null)



const SelectedCountry = ref<TitleInterface>()
const SetCountrySelection = (data: TitleInterface) => {
  SelectedCountry.value = data
  indexLocationStatesParams.value = new IndexLocationParams(
    '',
    0,
    0,
    0,
    LocationEnum.STATE,
    data.id,
  )
  updateData()
}

const SelectedState = ref<TitleInterface>()
const SetStateSelection = (data: TitleInterface) => {
  SelectedState.value = data
  indexLocationCityParams.value = new IndexLocationParams('', 0, 0, 0, LocationEnum.CITY, data.id)
  updateData()
}

const SelectedCity = ref<TitleInterface>()
const SetCitySelection = (data: TitleInterface) => {
  SelectedCity.value = data
  indexLocationAreasParams.value = new IndexLocationParams('', 0, 0, 0, LocationEnum.AREA, data.id)
  updateData()
}

const SelectedArea = ref<TitleInterface[]>()
const SetAreaSelection = (data: TitleInterface[]) => {
  SelectedArea.value = data
  location.value = data
  updateData()
}


// Location Handel End




watch(() => langs.value,
  () => {
    updateData()
  })
watch(() => langsDescription.value,
  () => {
    updateData()
  })
</script>

<template>
  <div class="col-span-4">
    <EmployeeHeader :title="`project info`" />
  </div>
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput :langs="langDefault" :modelValue="langs" @update:modelValue="(val) => (langs = val)" />
  </div>
  <div class="col-span-4 md:col-span-2">
    <SwitchInput :fields="fields" :switch_title="'Auto'" :switch_reverse="true" @update:value="UpdateSerial" />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="date">
      {{ $t('Start Date') }}
    </label>
    <DatePicker v-model="date" @date-select="UpdateDate" id="date" :placeholder="`select the date`" />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <CustomSelectInput :modelValue="partner_id" @update:modelValue="setPartnerId" :controller="indexPartnerController"
      :params="indexPartnerParams" :label="$t('contractor')" :placeholder="$t('contractor')" />
  </div>
  <div class="col-span-4 md:col-span-2">
    <CustomSelectInput :modelValue="SelectedCountry" :controller="indexLocationCountriesController"
      :params="indexLocationCountriesParams" label="Country " id="Location" placeholder="Select  Country"
      @update:modelValue="SetCountrySelection" />
  </div>
  <div class="col-span-4 md:col-span-2">
    <CustomSelectInput :modelValue="SelectedState" :controller="indexLocationStatesController"
      :params="indexLocationStatesParams" label="State" id="Location" placeholder="Select State"
      @update:modelValue="SetStateSelection" />
  </div>

  <div class="col-span-4 md:col-span-2">
    <CustomSelectInput :modelValue="SelectedCity" :controller="indexLocationCityController"
      :params="indexLocationCityParams" label="City" id="City" placeholder="Select City"
      @update:modelValue="SetCitySelection" />
  </div>


  <!-- <div class="col-span-4 md:col-span-2">
    <CustomSelectInput :modelValue="SelectedArea" :controller="indexLocationAreasController"
      :params="indexLocationAreasParams" label="Area" id="Area" placeholder="Select City"
      @update:modelValue="SetAreaSelection" />
  </div> -->
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <CustomSelectInput :modelValue="location" @update:modelValue="SetAreaSelection"
      :controller="indexLocationAreasController" :params="indexLocationAreasParams" :label="$t('location')"
      :placeholder="$t('location')" :type="2" />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="">Zones</label>
    <AddZoneDialog :locations="location" @update:data="UpdateZones" />
  </div>
  <div class="col-span-4 md:col-span-4 input-wrapper">
    <CustomSelectInput :modelValue="EvaluatingMethod" @update:modelValue="setEvaluatingMethod"
      :controller="indexMethodsController" :params="indexMethodsParams"
      :label="$t('the method of evaluating employee performance')" :type="2"
      :placeholder="$t('choose your method of evaluating employee performance')" />
  </div>
  <div class="col-span-4 md:col-span-4 input-wrapper">
    <LangTitleInput :label="$t('project objectives')" :langs="langDefault" :modelValue="langsDescription"
      @update:modelValue="(val) => (langsDescription = val)" field-type="description" type="textarea"
      :placeholder="`What are the project objectives?`" />
  </div>

</template>
