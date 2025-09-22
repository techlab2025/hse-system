<script Industry="ts" setup>
import { onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'

import { IndustrysMap } from '@/constant/Industrys'
import type ShowIndustryModel from '@/features/setting/Industries/Data/models/IndustryDetailsModel.ts'
import IndustryTitleInput from '@/shared/HelpersComponents/IndustryTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import EditIndustryParams from '@/features/setting/Industries/Core/params/editIndustryParams'
import AddIndustryParams from '@/features/setting/Industries/Core/params/addIndustryParams'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import IndexIndustryParams from '@/features/setting/Industries/Core/params/indexIndustryParams.ts'
import IndexIndustryController from '@/features/setting/Industries/Presentation/controllers/indexIndustryController.ts'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: ShowIndustryModel
}>()

// actual translations (values)
const Industrys = ref<{ locale: string; title: string }[]>([
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

// selected base Industryuage
const Industry = ref<TitleInterface | null>(null)

// default available Industrys
const IndustrysDefault = ref<{ locale: string; icon?: any; title: string }[]>([])

const fetchIndustry = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  const params = new IndexIndustryParams(query, pageNumber, perPage, withPage)
  const indexIndustryController = await IndexIndustryController.getInstance().getData(params)

  const response = indexIndustryController.value

  if (response?.data?.length) {
    // map backend Industrys into default structure
    IndustrysDefault.value = response.data.map((item: any) => ({
      locale: item.code,
      title: '', // empty initially
      // if you already have icons mapped, use IndustrysMap
      icon: IndustrysMap[item.code as keyof typeof IndustrysMap]?.icon,
    }))
  } else {
    IndustrysDefault.value = [
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
  await fetchIndustry()
})

const getIndustryTitleList = (): TitleInterface[] => {
  return Object.values(IndustrysMap).map((Industry, index) => {
    return new TitleInterface({
      id: index + 1,
      title: Industry.name,
      subtitle: Industry.code,
    })
  })
}
const IndustrysList = getIndustryTitleList()

const updateData = () => {
  const translationsParams = new TranslationsParams()

  Industrys.value.forEach((Industry) => {
    translationsParams.setTranslation('title', Industry.locale, Industry.title)
  })

  const params = props.data?.id
    ? new EditIndustryParams(props.data?.id! ?? 0, translationsParams, Industry.value?.subtitle! ?? 'en')
    : new AddIndustryParams(translationsParams, Industry.value?.subtitle! ?? 'en')

  // console.log(params, 'params')
  emit('update:data', params)
}

const setIndustry = (data: TitleInterface) => {

  // console.log(data, 'data')
  Industry.value = data
  updateData()
}

// when child emits modelValue (updated translations)
const setIndustrys = (data: { locale: string; title: string }[]) => {
  Industrys.value = data

  // console.log(Industrys.value, 'Industrys')
  updateData()
}

// init Industrys either from backend (edit mode) or from defaults (create mode)
watch(
  () => props.data,
  (newData) => {
    if (newData?.titles?.length) {
      Industrys.value = IndustrysDefault.value.map((l) => {
        const existing = newData.titles.find((t) => t.locale === l.locale)
        return existing ? existing : { locale: l.locale, title: '' }
      })

      // console.log(Industrys.value, 'Industrys')
    } else {
      Industrys.value = IndustrysDefault.value.map((l) => ({
        locale: l.locale,
        title: '',
      }))

      // console.log(Industrys.value, 'Industrys')
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="col-span-4 md:col-span-4">
    <IndustryTitleInput :Industrys="IndustrysDefault" :modelValue="Industrys" @update:modelValue="setIndustrys" />
  </div>

<!--  <div class="col-span-4 md:col-span-4">-->
<!--    <CustomSelectInput-->
<!--      :modelValue="Industry"-->
<!--      :staticOptions="IndustrysList"-->
<!--      label="Industryuage"-->
<!--      id="Industry"-->
<!--      placeholder="Select Industryuage"-->
<!--      @update:modelValue="setIndustry"-->
<!--    />-->
<!--  </div>-->
</template>
