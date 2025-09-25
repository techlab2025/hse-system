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
import type ServiceDetailsModel from '../../Data/models/ServiceDetailsSectionModel'
import AddServiceSectionParams from '../../Core/params/addServiceSectionParams'
import ItemParams from '../../Core/params/ItemParams'

import IndexServiceController from '@/features/website/Service/Presentation/controllers/indexServiceController'
import IndexServiceParams from '@/features/website/Service/Core/params/indexServiceParams'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import type ServiceSectionDetailsModel from '../../Data/models/ServiceDetailsSectionModel'

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

// Items array (previously called "includes")
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

  const params = new AddServiceSectionParams(
    mainTranslations,
    imageAlt.value,
    image.value.file,
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

watch(
  [() => props.data, () => langDefault.value],
  ([newData, newDefault]) => {
    if (!newData || !newDefault.length) return

    // ---- Main Translations ----
    langsTitle.value = newDefault.map((l) => {
      const existing = newData?.title?.find(
        (t: any) => t.locale === l.locale && t.field === 'title',
      )
      return existing
        ? { locale: l.locale, title: existing.title }
        : { locale: l.locale, title: '' }
    })

    langsSubTitle.value = newDefault.map((l) => {
      const existing = newData?.subTitle?.find(
        (t: any) => t.locale === l.locale && t.field === 'subtitle',
      )
      return existing
        ? { locale: l.locale, title: existing.subtitle }
        : { locale: l.locale, title: '' }
    })

    langsDescription.value = newDefault.map((l) => {
      const existing = newData?.descriptions?.find(
        (t: any) => t.locale === l.locale && t.field === 'description',
      )
      return existing
        ? { locale: l.locale, title: existing.description }
        : { locale: l.locale, title: '' }
    })

    imageAlt.value = newData.alt ?? ''

    image.value = newData.image ?? ''

    if (newData.service) {
      SelectedService.value = {
        id: newData.service.id,
        title: newData.service.title,
      } as TitleInterface
    }
  },
  { immediate: true },
)

const SelectedService = ref<TitleInterface>()
const setServiceSelection = (data: TitleInterface) => {
  SelectedService.value = data
  updateData()
}

const imageAlt = ref('')
const UpdateAltImage = (data) => {
  imageAlt.value = data.target.value
  updateData()
}
const image = ref<string>('')

const setImage = async (data: File) => {
  image.value = await filesToBase64(data)
  console.log(image.value.file, 'data image')
  updateData()
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

  <div class="col-span-4 md:col-span-2">
    <LangTitleInput
      type="textarea"
      :langs="langDefault"
      :modelValue="langsDescription"
      :label="$t('Description')"
      @update:modelValue="setLangsDescription"
    />
  </div>
  <div class="col-span-4 md:col-span-2">
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

  <div class="col-span-4 md:col-span-2">
    <SingleFileUpload
      v-model="image"
      @update:modelValue="setImage"
      label="Image"
      id="image"
      placeholder="Select image"
    />
  </div>
</template>
