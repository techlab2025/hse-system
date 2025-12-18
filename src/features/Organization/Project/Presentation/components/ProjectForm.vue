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
import PagesHeader from '../../../../../shared/HelpersComponents/PagesHeader.vue'
import SwitchInput from '@/shared/FormInputs/SwitchInput.vue'
import IndexLocationController from '@/features/setting/Location/Presentation/controllers/indexLocationController'
import IndexLocationParams from '@/features/setting/Location/Core/params/indexLocationParams'
import AddZoneDialog from './Dialogs/ZoneDialog/AddZoneDialog.vue'
import { LocationEnum } from '@/features/setting/Location/Core/Enum/LocationEnum'
import type SohwProjectZoonModel from '../../Data/models/ShowProjectZone'
import IndexContractorController from '@/features/setting/contractor/Presentation/controllers/indexContractorController'
import IndexContractorParams from '@/features/setting/contractor/Core/params/indexContractorParams'
import ContructorSelectDialog from './SelectDialogs/ContructorSelectDialog.vue'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import LocationSelectDialog from './SelectDialogs/LocationSelectDialog.vue'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: ProjectDetailsModel
}>()
const EvaluatingMethod = ref<TitleInterface[] | null>([])

const ContractorIds = ref<TitleInterface[]>([])
const location = ref<TitleInterface[]>([])
const setContractorIds = (data: TitleInterface[]) => {
  ContractorIds.value = data
  updateData()
}

const indexContractorController = IndexContractorController.getInstance()
const indexContractorTypeParams = new IndexContractorParams("", 0, 0, 0)

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
const date = ref(new Date())

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
      ContractorIds.value?.map(p => p.id),
      date.value,
      SerialNumber.value?.SerialNumber,
      location.value.map((l) => l.id),
      ZoneIds.value.map((z) => z),
      EvaluatingMethod.value?.map((p) => p.id)
    )
    : new AddProjectParams(
      translationsParams,
      ContractorIds.value?.map(p => p.id),
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
      date.value = newData?.startDate || new Date();
      // ContractorIds.value = newData?.partner;
      fields.value[0].value = SerialNumber.value
      fields.value[0].enabled = props?.data?.id ? false : true
      SelectedCountry.value = newData?.country ?? [];
      indexLocationStatesParams.value = new IndexLocationParams(
        '',
        0,
        0,
        0,
        LocationEnum.STATE,
        null,
        SelectedCountry.value?.map((c) => c?.id),
      )
      SelectedState.value = newData?.state ?? [];
      indexLocationCityParams.value = new IndexLocationParams(
        '',
        0,
        0,
        0,
        LocationEnum.CITY,
        null,
        SelectedState.value?.map((c) => c?.id),
      )
      SelectedCity.value = newData?.city ?? [];
      indexLocationAreasParams.value = new IndexLocationParams(
        '',
        0,
        0,
        0,
        LocationEnum.AREA,
        null,
        null
        // SelectedCity.value.map((c) => c.id),
      )
      location.value = newData?.area ?? [];
      EvaluatingMethod.value = newData?.methods ?? [];
      ContractorIds.value = newData?.contractors ?? [];
      SelectedZones.value = newData?.Zones ?? [];
      updateData()
    }
  },
  { immediate: true },
)
const SerialNumber = ref()

const fields = ref([
  { key: 'SerialNumber', label: 'serial_number', placeholder: 'You can leave it (auto-generated)', value: SerialNumber.value, enabled: props?.data?.id ? false : true },
])



const ZoneIds = ref<number[]>([])
const SelectedZones = ref<SohwProjectZoonModel[]>([])
const UpdateZones = (data) => {
  ZoneIds.value = []
  ZoneIds.value = data.flatMap(item => item.ZoneIds || item)
  updateData()
}


const UpdateSerial = (data) => {
  SerialNumber.value = data
  updateData()
}
const UpdateDate = (date) => {
  date.value = date || new Date()
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



const SelectedCountry = ref<TitleInterface[]>()
const SetCountrySelection = (data: TitleInterface[]) => {
  SelectedCountry.value = data
  indexLocationStatesParams.value = new IndexLocationParams(
    '',
    0,
    0,
    0,
    LocationEnum.STATE,
    null,
    data.map((c) => c.id),
  )
  updateData()
}

const SelectedState = ref<TitleInterface[]>()
const SetStateSelection = (data: TitleInterface[]) => {
  SelectedState.value = data
  indexLocationCityParams.value = new IndexLocationParams('', 0, 0, 0, LocationEnum.CITY, null, data.map((c) => c.id))
  updateData()
}

const SelectedCity = ref<TitleInterface[]>()
const SetCitySelection = (data: TitleInterface[]) => {
  SelectedCity.value = data
  indexLocationAreasParams.value = new IndexLocationParams('', 0, 0, 0, LocationEnum.AREA, null, null)
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

const ContructorVisible = ref(false)

const ShowContructorDialog = () => {
  ContructorVisible.value = true
}
const LocationVisible = ref(false)
const ShowLocationDialog = () => {
  LocationVisible.value = true
}

</script>

<template>
  <div class="col-span-4">
    <PagesHeader :title="$t(`project_info`)" />
  </div>
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput :langs="langDefault" :modelValue="langs" @update:modelValue="(val) => (langs = val)" />
  </div>
  <div class="col-span-4 md:col-span-2">
    <SwitchInput :fields="fields" :switch_title="$t('auto')" :switch_reverse="true" @update:value="UpdateSerial" />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="date">
      {{ $t('start_date') }}
    </label>
    <DatePicker v-model="date" @date-select="UpdateDate" id="date" :placeholder="`select the date`" />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <CustomSelectInput :modelValue="ContractorIds" @update:modelValue="setContractorIds" :type="2"
      :controller="indexContractorController" :params="indexContractorTypeParams" label="contractors"
      placeholder="contractors" :onclick="ShowContructorDialog" />
    <!-- <UpdatedCustomInputSelect :modelValue="ContractorIds" @update:modelValue="setContractorIds" :type="2"
      :controller="indexContractorController" :params="indexContractorTypeParams" label="contractors"
      placeholder="contractors" :onclick="ShowContructorDialog" :hascontent="true" :hasHeader="false">
      <template #LabelHeader>
        {{ $t('new') }}
      </template>
<template #reloadHeader>
        {{ $t('new') }}
      </template>
<template #Header>
        aaaaaaaa
      </template>

<template #content>
        asdasd
      </template>

</UpdatedCustomInputSelect> -->

  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <CustomSelectInput :modelValue="location" @update:modelValue="SetAreaSelection"
      :controller="indexLocationAreasController" :params="indexLocationAreasParams" label="location"
      placeholder="location" :type="2" :onclick="ShowLocationDialog" />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="zone">{{ $t("zones") }}</label>
    <AddZoneDialog id="zone" class="input" :locations="location" @update:data="UpdateZones"
      :selectedZones="SelectedZones" />
  </div>
  <div class="col-span-4 md:col-span-4 input-wrapper">
    <LangTitleInput label="project_objectives" :langs="langDefault" :modelValue="langsDescription"
      @update:modelValue="(val) => (langsDescription = val)" field-type="description" type="textarea"
      :placeholder="`What are the project objectives?`" :required="false" />
  </div>
  <ContructorSelectDialog v-model:visible="ContructorVisible" />
  <LocationSelectDialog v-model:visible="LocationVisible" />

</template>
