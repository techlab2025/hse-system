<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'

// import { HazardTypesMap } from '@/constant/HazardTypes'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import type ShowHazardTypeModel from '@/features/setting/HazardType/Data/models/hazardTypeDetailsModel'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import EditHazardTypeParams from '@/features/setting/HazardType/Core/params/editHazardTypeParams.ts'
import AddHazardTypeParams from '@/features/setting/HazardType/Core/params/addHazardTypeParams.ts'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'
import IndexIndustryParams from '@/features/setting/Industries/Core/Params/indexIndustryParams.ts'
import IndexIndustryController from '@/features/setting/Industries/Presentation/controllers/indexIndustryController.ts'
// import FileUpload from '@/shared/FormInputs/FileUpload.vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import TabsSelection from '@/shared/HelpersComponents/TabsSelection.vue'
import HazardIcon from '@/shared/icons/HazardIcon.vue'
import IndexHazardTypeParams from '@/features/setting/HazardType/Core/params/indexHazardTypeParams'
import IndexHazardTypeController from '@/features/setting/HazardType/Presentation/controllers/indexHazardTypeController'
import IndexEquipmentController from '@/features/setting/Equipment/Presentation/controllers/indexEquipmentController'
import IndexEquipmentParams from '@/features/setting/Equipment/Core/params/indexEquipmentParams'
import FileUpload from '@/shared/FormInputs/FileUpload.vue'
import ImageInput from '@/shared/FormInputs/ImageInput.vue'
import MultiImagesInput from '@/shared/FormInputs/MultiImagesInput.vue'
// import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64.ts'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: ShowHazardTypeModel
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

// default available HazardTypes
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
  const indexHazardTypeController = await IndexLangController.getInstance().getData(params)

  const response = indexHazardTypeController.value

  if (response?.data?.length) {
    // map backend HazardTypes into default structure
    langDefault.value = response.data.map((item: any) => ({
      locale: item.code,
      title: '', // empty initially
      // if you already have icons mapped, use HazardTypesMap
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

  // console.log(allIndustries.value, 'industry')
  const AllIndustry = user.user?.type == OrganizationTypeEnum?.ADMIN ? allIndustries.value : null

  const params = props.data?.id
    ? new EditHazardTypeParams(
      props.data?.id! ?? 0,
      translationsParams,
      AllIndustry,
      industry.value?.map((item) => item.id) ?? [],
    )
    : new AddHazardTypeParams(
      translationsParams,
      AllIndustry,
      industry.value?.map((item) => item.id),
      // id,
    )

  // console.log(params, 'params')
  emit('update:data', params)
}

const setIndustry = (data: TitleInterface[]) => {
  // console.log(data, 'data')
  industry.value = data
  updateData()
}

// when child emits modelValue (updated translations)
const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data

  // console.log(langs.value, 'langs')
  updateData()
}

// init HazardTypes either from backend (edit mode) or from defaults (create mode)
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

      // langs.value = newData?.code
      // hasCertificate.value = newData?.hasCertificate
      allIndustries.value = newData?.allIndustries! ?? false
      industry.value = newData?.industries!
    }
  },
  { immediate: true },
)

const text = ref<string>('')
const date = ref<Date>()

const indexHazardTypeParams = new IndexHazardTypeParams("", 1, 10, 1)
const indexHazardTypeController = IndexHazardTypeController.getInstance()
const HazardType = ref<TitleInterface[]>([])
const setHazardType = (data: TitleInterface[]) => {
  HazardType.value = data
  updateData();
}
const indexEquipmentParams = new IndexEquipmentParams("", 1, 10, 1)
const indexEquipmentController = IndexEquipmentController.getInstance()
const SelectedMachine = ref<TitleInterface[]>([])
const setMachine = (data: TitleInterface[]) => {
  SelectedMachine.value = data
  updateData();
}
const descripe = ref<string>("")
</script>

<template>
  <div class="col-span-6 md:col-span-6">
    <TabsSelection :LocationIds="[137]" @update:data="console.log($event, 'event')" />
  </div>
  <div class="hazard-form col-span-6 md:col-span-6">
    <div class="hazard-form-header">
      <HazardIcon class="icon" />
      <p class="title">Hazerd form <span>( #001 )</span></p>
    </div>
  </div>
  <div class="col-span-6 md:col-span-6 input-wrapper">
    <label for="text">Text</label>
    <input placeholder="Add your title" type="text" class="input" id="text" v-model="text">
  </div>
  <div class="col-span-6 md:col-span-2 input-wrapper">
    <label for="date">Date</label>
    <input placeholder="Add your title" type="date" class="input" id="date" v-model="date">
  </div>
  <div class="col-span-6 md:col-span-2 input-wrapper">
    <CustomSelectInput :modelValue="HazardType" class="input" :controller="indexHazardTypeController"
      :params="indexHazardTypeParams" label="HazardType" id="HazardType" placeholder="Select Hazard Type" :type="2"
      @update:modelValue="setHazardType" />
  </div>
  <div class="col-span-6 md:col-span-2 input-wrapper">
    <CustomSelectInput :modelValue="SelectedMachine" class="input" :controller="indexEquipmentController"
      :params="indexEquipmentParams" label="select machine (optional)" id="machine" placeholder="select your machine"
      :type="2" @update:modelValue="setMachine" />
  </div>
  <div class="col-span-6 md:col-span-6 input-wrapper w-full">
    <label for="">upload image</label>
    <FileUpload class="w-full" />
  </div>
  <div class="col-span-6 md:col-span-6 input-wrapper w-full">
    <label for="descripe">descripe <span class="optional">(optional)</span></label>
    <textarea v-model="descripe" id="descripe"></textarea>
  </div>

</template>
