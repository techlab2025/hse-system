<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'

// import { IndustrysMap } from '@/constant/Industrys'
import { LangsMap } from '@/constant/langs'

import type ShowIndustryModel from '@/features/setting/Industries/Data/models/LangDetailsModel.ts'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import UpdateIndustryParams from '../../Core/Params/updateIndustryParams'
import CreateIndustryParams from '../../Core/Params/createIndustryParams'
import IndexIndustryParams from '../../Core/Params/indexIndustryParams'
import IndexIndustryController from '../controllers/indexIndustryController'
import { useRouter } from 'vue-router'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController'

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
const LangsDefault = ref<{ locale: string; icon?: any; title: string }[]>([])

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
    // map backend langs into default structure
    LangsDefault.value = response.data.map((item: any) => ({
      locale: item.code,
      title: '', // empty initially
      // if you already have icons mapped, use LangsMap
      icon: LangsMap[item.code as keyof typeof LangsMap]?.icon,
    }))
  } else {
    LangsDefault.value = [
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
const getLangTitleList = (): TitleInterface[] => {
  return Object.values(LangsMap).map((Industry, index) => {
    return new TitleInterface({
      id: index + 1,
      title: Industry.name,
      subtitle: Industry.code,
    })
  })
}
const langsList = getLangTitleList()

const updateData = () => {
  const translationsParams = new TranslationsParams()

  Industrys.value.forEach((Industry) => {
    translationsParams.setTranslation('title', Industry.locale, Industry.title)
  })

  const params = props.data?.id
    ? new UpdateIndustryParams(props.data?.id! ?? 0, translationsParams)
    : new CreateIndustryParams(translationsParams)

  // console.log(params, 'params')
  emit('update:data', params)
}

// when child emits modelValue (updated translations)
const setIndustrys = (data: { locale: string; title: string }[]) => {
  Industrys.value = data
  updateData()
}

watch(
  () => props.data,
  (newData) => {
    if (newData?.titles?.length) {
      Industrys.value = LangsDefault.value.map((l) => {
        const existing = newData.titles.find((t) => t.locale === l.locale)
        return existing ? existing : { locale: l.locale, title: '' }
      })
    } else {
      Industrys.value = LangsDefault.value.map((l) => ({
        locale: l.locale,
        title: '',
      }))
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="col-span-4 md:col-span-4">
    <LangTitleInput
      :langs="LangsDefault"
      :modelValue="Industrys"
      @update:modelValue="setIndustrys"
    />
  </div>
</template>
