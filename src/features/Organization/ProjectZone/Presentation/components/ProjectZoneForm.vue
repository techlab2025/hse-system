<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'
import { useUserStore } from '@/stores/user'
import { useRoute } from 'vue-router'
import EditProjectZoneParams from '../../Core/params/editProjectZoneParams'
import AddProjectZoneParams from '../../Core/params/addProjectZoneParams'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import type TitleInterface from '@/base/Data/Models/title_interface'
import type ProjectZoneDetailsModel from '../../Data/models/ProjectZoneDetailsModel'
import IndexLocationController from '@/features/setting/Location/Presentation/controllers/indexLocationController'
import IndexLocationParams from '@/features/setting/Location/Core/params/indexLocationParams'
import { LocationEnum } from '@/features/setting/Location/Core/Enum/LocationEnum'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: ProjectZoneDetailsModel
}>()




const SelectedLocation = ref<TitleInterface>()
const langs = ref<{ locale: string; title: string }[]>([])
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
  const indexPartnerController = await IndexLangController.getInstance().getData(params)

  const response = indexPartnerController.value

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

  const params = props.data?.id
    ? new EditProjectZoneParams(
      props?.data?.id,
      translationsParams,
      SelectedLocation.value?.id,

    )
    : new AddProjectZoneParams(
      translationsParams,
      SelectedArea.value?.id,
      // SelectedArea.value?.id,


    )

  emit('update:data', params)
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
    }
    SelectedLocation.value = newData?.location
  },
  { immediate: true },
)





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
    null,
    [data.id],
  )
  updateData()
}

const SelectedState = ref<TitleInterface>()
const SetStateSelection = (data: TitleInterface) => {
  SelectedState.value = data
  indexLocationCityParams.value = new IndexLocationParams('', 0, 0, 0, LocationEnum.CITY, null, [data.id])
  updateData()
}

const SelectedCity = ref<TitleInterface>()
const SetCitySelection = (data: TitleInterface) => {
  SelectedCity.value = data
  indexLocationAreasParams.value = new IndexLocationParams('', 0, 0, 0, LocationEnum.AREA, null, [data.id])
  updateData()
}

const SelectedArea = ref<TitleInterface>()
const SetAreaSelection = (data: TitleInterface) => {
  SelectedArea.value = data
  updateData()
}

</script>

<template>
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput type="text" :langs="langDefault" :modelValue="langs" :label="$t('title')"
      @update:modelValue="setLangs" />
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


  <div class="col-span-4 md:col-span-2">
    <CustomSelectInput :modelValue="SelectedArea" :controller="indexLocationAreasController"
      :params="indexLocationAreasParams" label="Area" id="Area" placeholder="Select City"
      @update:modelValue="SetAreaSelection" />
  </div>

  <!-- <div class="col-span-4 md:col-span-2">
    <CustomSelectInput :controller="indexLocationController" :params="indexLocationParams"
      :modelValue="SelectedLocation" label="Location" id="location" placeholder="Select Location"
      @update:modelValue="setLocation" />
  </div> -->


</template>
