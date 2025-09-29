<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'

// import { EquipmentTypesMap } from '@/constant/EquipmentTypes'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import type ShowEquipmentTypeModel from '@/features/setting/EquipmentType/Data/models/ProjectTypeDetailsModel.ts'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import EditEquipmentTypeParams from '@/features/setting/EquipmentType/Core/params/editEquipmentTypeParams'
import AddEquipmentTypeParams from '@/features/setting/EquipmentType/Core/params/addEquipmentTypeParams.ts'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'
import IndexIndustryParams from '@/features/setting/Industries/Core/Params/indexIndustryParams.ts'
import IndexIndustryController from '@/features/setting/Industries/Presentation/controllers/indexIndustryController.ts'
import FileUpload from '@/shared/FormInputs/FileUpload.vue'
import { useRoute } from 'vue-router'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64.ts'
import SingleFileUpload from '@/shared/HelpersComponents/SingleFileUpload.vue'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: ShowEquipmentTypeModel
}>()

const route = useRoute()
const id = route.params.parent_id

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
const hasCertificate = ref<number>(0)
const image = ref<string>('')

// industry
const industry = ref<TitleInterface[]>([])
const industryParams = new IndexIndustryParams('', 0, 10, 1)
const industryController = IndexIndustryController.getInstance()

// default available EquipmentTypes
const langDefault = ref<{ locale: string; icon?: string; title: string }[]>([])

const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const indexEquipmentTypeController = await IndexLangController.getInstance().getData(params)

  const response = indexEquipmentTypeController.value

  if (response?.data?.length) {
    // map backend EquipmentTypes into default structure
    langDefault.value = response.data.map((item: any) => ({
      locale: item.code,
      title: '', // empty initially
      // if you already have icons mapped, use EquipmentTypesMap
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

  const params = props.data?.id
    ? new EditEquipmentTypeParams(
        props.data?.id! ?? 0,
        translationsParams,
        hasCertificate.value,
        allIndustries.value,
        industry.value?.map((item) => item.id),
        id,
        image.value?.file,
        image.value?.id,
      )
    : new AddEquipmentTypeParams(
        translationsParams,
        hasCertificate.value,
        allIndustries.value,
        industry.value?.map((item) => item.id),
        id,
        image.value?.file,
        image.value?.id,
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

      // langs.value = newData?.code
      hasCertificate.value = newData?.hasCertificate
      allIndustries.value = newData?.allIndustries
      industry.value = newData?.industries
      image.value = newData?.image
    }
  },
  { immediate: true },
)

const setImage = async (data: File) => {
  // console.log(data, 'data image')
  image.value = await filesToBase64(data)
  console.log(image.value, 'image')
  updateData()
}
</script>

<template>
  <div class="col-span-4 md:col-span-4">
    <LangTitleInput :langs="langDefault" :modelValue="langs" @update:modelValue="setLangs" />
  </div>

  <!-- Has Certificate -->
  <div class="col-span-4 md:col-span-2 input-wrapper check-box">
    <label for="has_certificate">{{ $t('has_certificate') }}</label>
    <input
      type="checkbox"
      :value="1"
      v-model="hasCertificate"
      :checked="hasCertificate == 1"
      @change="updateData"
      id="has_certificate"
    />
  </div>

  <!-- all_industries -->
  <div class="col-span-4 md:col-span-2 input-wrapper check-box">
    <label for="all_industries">{{ $t('all_industries') }}</label>
    <input
      type="checkbox"
      :value="1"
      v-model="allIndustries"
      :checked="allIndustries == 1"
      @change="updateData"
      id="all_industries"
    />
  </div>

  <!-- image -->
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="image">Image</label>
    <SingleFileUpload
      v-model="image"
      @update:modelValue="setImage"
      label="Image"
      id="image"
      placeholder="Select image"
    />
  </div>

  <!--industry  -->
  <div class="col-span-4 md:col-span-2" v-if="!allIndustries">
    <CustomSelectInput
      :modelValue="industry"
      :controller="industryController"
      :params="industryParams"
      label="EquipmentTypeuage"
      id="EquipmentType"
      placeholder="Select industry"
      :type="2"
      @update:modelValue="setIndustry"
    />
  </div>
</template>
