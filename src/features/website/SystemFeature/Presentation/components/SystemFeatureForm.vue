<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
import SingleFileUpload from '@/shared/HelpersComponents/SingleFileUpload.vue'
import type SystemFeatureDetailsModel from '../../Data/models/SystemFeatureDetailsModel'
import IndexServiceController from '@/features/website/Service/Presentation/controllers/indexServiceController'
import IndexServiceParams from '@/features/website/Service/Core/params/indexServiceParams'
import EditSystemFeatureParams from '../../Core/params/editSystemFeatureParams'
import AddSystemFeatureParams from '../../Core/params/addSystemFeatureParams'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: SystemFeatureDetailsModel
  serviceId: number
}>()

const indexServiceController = IndexServiceController.getInstance()
const indexServiceParams = new IndexServiceParams('', 1, 10, 1)

const langsTitle = ref<{ locale: string; feature: string }[]>([])
const langsSubTitle = ref<{ locale: string; old: string }[]>([])
const langsDescription = ref<{ locale: string; new: string }[]>([])

const langDefault = ref<{ locale: string; title: string; icon?: string }[]>([])

// Items array
// interface Item {
//   translations: {
//     title: Record<string, string>
//     subtitle: Record<string, string>
//   }
//   alt: string
//   image: string | File
// }
// const items = ref<Item[]>([])

// const createNewItem = (): Item => {
//   const title: Record<string, string> = {}
//   const subtitle: Record<string, string> = {}

//   langDefault.value.forEach((l) => {
//     title[l.locale] = ''
//     subtitle[l.locale] = ''
//   })

//   return {
//     translations: { title, subtitle },
//     alt: '',
//     image: '',
//   }
// }

const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const indexLangController = await IndexLangController.getInstance().getData(params)
  const response = indexLangController.value

  langDefault.value = response?.data?.length
    ? response.data.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
    : [
      { locale: 'en', icon: USA, title: '' },
      { locale: 'ar', icon: SA, title: '' },
    ]
  console.log(langDefault.value, "langDefault.value");

  // langDefault.value = defaults
  // if (!items.value.length) {
  //   items.value.push(createNewItem())
  // }
}

onMounted(async () => {
  await fetchLang()
})

const updateData = () => {
  const mainTranslations = new TranslationsParams()

  langsTitle.value.forEach((lang) => {
    mainTranslations.setTranslation('feature', lang.locale, lang.feature)
  })

  langsSubTitle.value.forEach((lang) => {
    mainTranslations.setTranslation('old', lang.locale, lang.old)
  })

  langsDescription.value.forEach((lang) => {
    mainTranslations.setTranslation('new', lang.locale, lang.new)
  })

  const params = props?.data?.id
    ? new EditSystemFeatureParams(props?.data?.id, mainTranslations)
    : new AddSystemFeatureParams(mainTranslations)
  emit('update:data', params)
}


// Helper functions
const setLangsTitle = (data: { locale: string; feature: string }[]) => {
  langsTitle.value = data
  updateData()
}

const setLangsSubTitle = (value: { locale: string; old: string }[]) => {
  langsSubTitle.value = value
  updateData()
}

const setLangsDescription = (value: { locale: string; new: string }[]) => {
  langsDescription.value = value
  updateData()
}

watch(
  [() => props.data, () => langDefault.value],
  ([newData, newDefault]) => {
    if (!newDefault.length) return
    console.log(newDefault, "nn");
    // Map titles
    // langsTitle.value = newDefault.map((lang) => {
    //   const translation = newData.features?.find((t: any) => t.locale === lang.locale)
    //   return {
    //     locale: lang.locale,
    //     feature: translation?.feature  || '',
    //   }
    // })

    langsTitle.value = newData?.features?.length
      ? newDefault.map((l) => {
        const existing = newData.features.find((t) => t.locale === l.locale)
        return existing ?? { locale: l.locale, feature: '' }
      })
      : newDefault.map((l) => ({ locale: l.locale, feature: '' }))

    langsSubTitle.value = newData?.olds?.length
      ? newDefault.map((l) => {
        const existing = newData.olds.find((t) => t.locale === l.locale)
        return existing ?? { locale: l.locale, old: '' }
      })
      : newDefault.map((l) => ({ locale: l.locale, old: '' }))

    langsDescription.value = newData?.news?.length
      ? newDefault.map((l) => {
        const existing = newData.news.find((t) => t.locale === l.locale)
        return existing ?? { locale: l.locale, new: '' }
      })
      : newDefault.map((l) => ({ locale: l.locale, new: '' }))


    // langsSubTitle.value = newDefault.map((lang) => {
    //   const translation = newData.olds?.find((t: any) => t.locale === lang.locale)
    //   return {
    //     locale: lang.locale,
    //     old: translation?.old || '',
    //   }
    // })

    // langsDescription.value = newDefault.map((lang) => {
    //   const translation = newData.news?.find((t: any) => t.locale === lang.locale)
    //   return {
    //     locale: lang.locale,
    //     new: translation?.new || '',
    //   }
    // })


    updateData()
  },
  { immediate: true, deep: true },
)
</script>

<template>
<!--  {{ langsTitle }}-->
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput type="text" :langs="langDefault" :modelValue="langsTitle" :label="$t('Feature')"
      @update:modelValue="setLangsTitle" :fieldType="`feature`" />
  </div>

  <div class="col-span-4 md:col-span-2">
    <LangTitleInput type="text" :langs="langDefault" :modelValue="langsSubTitle" :label="$t('Old')"
      @update:modelValue="setLangsSubTitle" fieldType="old" />
  </div>

  <div class="col-span-4 md:col-span-4">
    <LangTitleInput type="textarea" :langs="langDefault" :modelValue="langsDescription" :label="$t('New')"
      @update:modelValue="setLangsDescription" fieldType="new" />
  </div>
</template>
