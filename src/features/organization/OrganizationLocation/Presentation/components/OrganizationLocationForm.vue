<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import type OrganizationLocationDetailsModel from '../../Data/models/OrganizationLocationDetailsModel'
import AddOrganizationLocationParams from '../../Core/params/addOrganizationLocationParams'
import EditOrganizationLocationParams from '../../Core/params/editOrganizationLocationParams'
import TitleInterface from '@/base/Data/Models/title_interface'
import IndexLocationController from '@/features/setting/Location/Presentation/controllers/indexLocationController'
import IndexLocationParams from '@/features/setting/Location/Core/params/indexLocationParams'
import { LocationEnum } from '@/features/setting/Location/Core/Enum/LocationEnum'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: OrganizationLocationDetailsModel
}>()

const lat = ref()
const lng = ref()
const country_id = ref<TitleInterface | null>(null)
const indexCountryController = IndexLocationController.getInstance()
const indexCountryParams = new IndexLocationParams('', 0, 0, 0, LocationEnum.COUNTRY, 0)

const indexCityController = IndexLocationController.getInstance()
const indexCityParams = ref()
const city_id = ref<TitleInterface | null>(null)

const setCountry = (val: TitleInterface | null) => {
  country_id.value = val
  indexCityParams.value = new IndexLocationParams('', 0, 0, 0, LocationEnum.CITY, val?.id ?? 0)
  updateData()
}

const indexStateController = IndexLocationController.getInstance()
const indexStateParams = ref()
const state_id = ref<TitleInterface | null>(null)

const setCity = (val: TitleInterface | null) => {
  city_id.value = val
  indexStateParams.value = new IndexLocationParams('', 0, 0, 0, LocationEnum.STATE, val?.id ?? 0)
  updateData()
}

const indexAreaController = IndexLocationController.getInstance()
const indexAreaParams = ref()
const area_id = ref<TitleInterface | null>(null)

const setState = (val: TitleInterface | null) => {
  state_id.value = val
  indexAreaParams.value = new IndexLocationParams('', 0, 0, 0, LocationEnum.AREA, val?.id ?? 0)
  updateData()
}

const setArea = (val: TitleInterface | null) => {
  area_id.value = val
  updateData()
}

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

const phone = ref<string>('')

onMounted(async () => {
  await fetchLang()
})

const route = useRoute()

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
    ? new EditOrganizationLocationParams(
        +route.params.id,
        translationsParams,
        lat.value,
        lng.value,
        area_id.value?.id,
      )
    : new AddOrganizationLocationParams(translationsParams, lat.value, lng.value, area_id.value?.id)

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

      lat.value = newData?.lat ?? 0
      lng.value = newData?.lng ?? 0

      

      updateData()
    }
  },
  { immediate: true },
)

// Auto-update emit whenever key data changes
watch(
  [langs, phone],
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
    <label for="lat">
      {{ $t('lat') }}
    </label>

    <input type="text" @change="updateData" name="lat" id="lat" class="input" v-model="lat" />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="lng">
      {{ $t('lng') }}
    </label>

    <input type="text" @change="updateData" name="lng" id="lng" class="input" v-model="lng" />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <CustomSelectInput
      :controller="indexCountryController"
      :params="indexCountryParams"
      :modelValue="country_id"
      @update:modelValue="setCountry"
      :label="$t('country')"
      :placeholder="$t('select_country')"
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <CustomSelectInput
      :controller="indexCityController"
      :params="indexCityParams"
      :modelValue="city_id"
      @update:modelValue="setCity"
      :label="$t('city')"
      :placeholder="$t('select_city')"
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <CustomSelectInput
      :controller="indexStateController"
      :params="indexStateParams"
      :modelValue="state_id"
      @update:modelValue="setState"
      :label="$t('state')"
      :placeholder="$t('select_state')"
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <CustomSelectInput
      :controller="indexAreaController"
      :params="indexAreaParams"
      :modelValue="area_id"
      @update:modelValue="setArea"
      :label="$t('area')"
      :placeholder="$t('select_area')"
    />
  </div>
</template>
