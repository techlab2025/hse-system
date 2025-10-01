<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import { LangsMap } from '@/constant/langs.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController'
import type LocationDetailsModel from '../../../Data/models/LocationDetailsModel'
import EditLocationParams from '../../../Core/params/editLocationParams'
import AddLocationParams from '../../../Core/params/addLocationParams'
import { LocationEnum } from '../../../Core/Enum/LocationEnum'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import { useRoute, useRouter } from 'vue-router'

const emit = defineEmits(['update:data'])

const TypesSelection = ref([
  new TitleInterface({ id: LocationEnum.COUNTRY, title: 'Country', subtitle: '' }),
  // new TitleInterface({ id: LocationEnum.STATE, title: 'State', subtitle: '' }),
  // new TitleInterface({ id: LocationEnum.CITY, title: 'City', subtitle: '' }),
  // new TitleInterface({ id: LocationEnum.AREA, title: 'Area', subtitle: '' }),
])

const props = defineProps<{
  data?: LocationDetailsModel
}>()
const Code = ref(props.data?.code ?? '')
const id = useRoute().params.id ?? 0

// Translations (title per locale)
const langs = ref<{ locale: string; title: string }[]>([
  { locale: 'en', icon: USA, title: '' },
  { locale: 'ar', icon: SA, title: '' },
])

const allIndustries = ref<boolean>(false)
const industry = ref<TitleInterface>()
const langDefault = ref<{ locale: string; icon?: string; title: string }[]>([])

const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const indexLangController = await IndexLangController.getInstance().getData(params)

  const response = indexLangController.value
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

const lang = ref<TitleInterface[] | null>([]) // selected language

const updateData =async () => {
  const translationsParams = new TranslationsParams()
  console.log(langs.value , "langs.value")
  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })

  const params = props.data?.id
    ? new EditLocationParams(id, translationsParams, Code.value, LocationEnum.COUNTRY)
    : new AddLocationParams(translationsParams, Code.value, LocationEnum.COUNTRY)

  console.log(params, 'Locatio nparams')
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

      allIndustries.value = newData?.allIndustries!
      industry.value = newData?.industries!
    }
  },
  { immediate: true },
)

const getLangTitleList = (): TitleInterface[] => {
  return Object.values(LangsMap).map((lang, index) => {
    return new TitleInterface({
      id: index + 1,
      title: lang.name,
      subtitle: lang.code,
    })
  })
}
const langsList = getLangTitleList()
const LocationType = ref<TitleInterface>(props.data?.type ?? '')

const SetLocationType = (data: TitleInterface) => {
  LocationType.value = data
  updateData()
}

const UpdateCode = (data) => {
  Code.value = data.target.value
  updateData()
}
</script>

<template>
  <div class="col-span-4 md:col-span-4">
    <LangTitleInput :langs="langDefault" :modelValue="langs" @update:modelValue="setLangs" />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="code">Code</label>
    <input
      type="text"
      id="code"
      v-model="Code"
      class="input"
      placeholder="Enter The Code"
      @input="UpdateCode"
    />
  </div>

  <!-- <div class="col-span-4 md:col-span-2">
    <CustomSelectInput
      :modelValue="LocationType"
      :staticOptions="TypesSelection"
      label="Location Type"
      id="Location"
      placeholder="Select Type"
      @update:modelValue="SetLocationType"
    />
  </div> -->
</template>
