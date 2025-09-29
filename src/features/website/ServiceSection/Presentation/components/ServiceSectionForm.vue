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
import type ServiceSectionDetailsModel from '../../Data/models/ServiceDetailsSectionModel'
import AddServiceSectionParams from '../../Core/params/addServiceSectionParams'
import ItemParams from '../../Core/params/ItemParams'

import IndexServiceController from '@/features/website/Service/Presentation/controllers/indexServiceController'
import IndexServiceParams from '@/features/website/Service/Core/params/indexServiceParams'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import EditServiceSectionParams from '../../Core/params/editServiceSectionParams'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: ServiceSectionDetailsModel
  serviceId: number
}>()

const indexServiceController = IndexServiceController.getInstance()
const indexServiceParams = new IndexServiceParams('', 1, 10, 1)

const langsTitle = ref<{ locale: string; title: string }[]>([])
const langsSubTitle = ref<{ locale: string; title: string }[]>([])
const langsDescription = ref<{ locale: string; title: string }[]>([])

const langDefault = ref<{ locale: string; icon?: string; title: string }[]>([])

// Items array
interface Item {
  translations: {
    title: Record<string, string>
    subtitle: Record<string, string>
  }
  alt: string
  image: string | File
}
const items = ref<Item[]>([])

const createNewItem = (): Item => {
  const title: Record<string, string> = {}
  const subtitle: Record<string, string> = {}

  langDefault.value.forEach((l) => {
    title[l.locale] = ''
    subtitle[l.locale] = ''
  })

  return {
    translations: { title, subtitle },
    alt: '',
    image: '',
  }
}

const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const indexLangController = await IndexLangController.getInstance().getData(params)
  const response = indexLangController.value

  const defaults = response?.data?.length
    ? response.data.map((item: any) => ({
        locale: item.code,
        title: '',
        icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
      }))
    : [
        { locale: 'en', icon: USA, title: '' },
        { locale: 'ar', icon: SA, title: '' },
      ]

  langDefault.value = defaults
  if (!items.value.length) {
    items.value.push(createNewItem())
  }
}

onMounted(async () => {
  await fetchLang()
})

const updateData = () => {
  const mainTranslations = new TranslationsParams()

  langsTitle.value.forEach((lang) => {
    mainTranslations.setTranslation('title', lang.locale, lang.title)
  })

  langsSubTitle.value.forEach((lang) => {
    mainTranslations.setTranslation('subtitle', lang.locale, lang.title)
  })

  langsDescription.value.forEach((lang) => {
    mainTranslations.setTranslation('description', lang.locale, lang.title)
  })

  const itemsParams = items.value.map((item) => {
    const itemTranslations = new TranslationsParams()

    Object.entries(item.translations.title).forEach(([locale, value]) => {
      itemTranslations.setTranslation('title', locale, value)
    })

    Object.entries(item.translations.subtitle).forEach(([locale, value]) => {
      itemTranslations.setTranslation('subtitle', locale, value)
    })

    return new ItemParams(
      itemTranslations,
      item.alt,
      typeof item.image === 'string' ? item.image : '',
    )
  })

  const params = props?.data?.id
    ? new EditServiceSectionParams(
        props?.data?.id,
        mainTranslations,
        imageAlt.value,
        image.value?.file,
        SelectedService.value?.id,
      )
    : new AddServiceSectionParams(
        mainTranslations,
        imageAlt.value,
        image.value?.file,
        SelectedService.value?.id,
      )

  emit('update:data', params)
}

// Helper functions
const setLangsTitle = (data: { locale: string; title: string }[]) => {
  langsTitle.value = data
  updateData()
}

const setLangsSubTitle = (value: { locale: string; title: string }[]) => {
  langsSubTitle.value = value
  updateData()
}

const setLangsDescription = (value: { locale: string; title: string }[]) => {
  langsDescription.value = value
  updateData()
}

const SelectedService = ref<TitleInterface | null>(null)

watch(
  [() => props.data, () => langDefault.value],
  ([newData, newDefault]) => {
    if (!newDefault.length) return

    langsTitle.value = newData?.titles?.length
      ? newDefault.map((l) => {
          const existing = newData.titles.find((t) => t.locale === l.locale)
          return existing ?? { locale: l.locale, title: '' }
        })
      : newDefault.map((l) => ({ locale: l.locale, title: '' }))

    langsSubTitle.value = newData?.subTitles?.length
      ? newDefault.map((l) => {
          const existing = newData.subTitles.find((t) => t.locale === l.locale)
          return existing ?? { locale: l.locale, title: '' }
        })
      : newDefault.map((l) => ({ locale: l.locale, title: '' }))

    langsDescription.value = newData?.descriptions?.length
      ? newDefault.map((l) => {
          const existing = newData.descriptions.find((t) => t.locale === l.locale)
          return existing ?? { locale: l.locale, title: '' }
        })
      : newDefault.map((l) => ({ locale: l.locale, title: '' }))

    imageAlt.value = newData?.alt ?? ''
    image.value = newData?.image ?? ''

    // console.log(newData?.service, 'wwww')

    SelectedService.value = newData?.service

    // console.log(newData?.ServiceFeatureItems, 'newData?.ServiceFeatureItems')

    updateData()
  },
  { immediate: true },
)

const setServiceSelection = (data: TitleInterface) => {
  SelectedService.value = data
  updateData()
}

const imageAlt = ref('')
const UpdateAltImage = (data: Event) => {
  imageAlt.value = (data.target as HTMLInputElement).value
  updateData()
}

const image = ref<string>('')

const setImage = async (data: File) => {
  try {
    const base64Image = await filesToBase64(data)
    image.value = base64Image as string
    updateData()
  } catch (error) {
    console.error('Error converting image to base64:', error)
    image.value = ''
  }
}
</script>

<template>
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput
      type="text"
      :langs="langDefault"
      :modelValue="langsTitle"
      :label="$t('title')"
      @update:modelValue="setLangsTitle"
    />
  </div>

  <div class="col-span-4 md:col-span-2">
    <LangTitleInput
      type="text"
      :langs="langDefault"
      :modelValue="langsSubTitle"
      :label="$t('sub_title')"
      @update:modelValue="setLangsSubTitle"
    />
  </div>


  <div class="col-span-4 md:col-span-4">
    <CustomSelectInput
    :modelValue="SelectedService"
    :controller="indexServiceController"
    :params="indexServiceParams"
    label="Service"
    id="Service"
    placeholder="Select Service"
    @update:modelValue="setServiceSelection"
    />
  </div>
  <div class="col-span-4 md:col-span-4">
    <LangTitleInput
      type="textarea"
      :langs="langDefault"
      :modelValue="langsDescription"
      :label="$t('Description')"
      @update:modelValue="setLangsDescription"
    />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="image-alt">{{ $t('alt_image') }}</label>
    <input
      id="image-alt"
      v-model="imageAlt"
      type="text"
      class="input"
      placeholder="alt"
      @input="UpdateAltImage"
    />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="image">{{ $t('image') }}</label>

    <SingleFileUpload
      :modelValue="image"
      @update:modelValue="setImage"
      label="Image"
      id="image"
      placeholder="Select image"
    />
  </div>
</template>
