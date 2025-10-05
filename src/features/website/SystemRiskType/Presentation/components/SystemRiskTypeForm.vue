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
import IndexServiceController from '@/features/website/Service/Presentation/controllers/indexServiceController'
import type SystemRiskTypeDetailsModel from '../../Data/models/SystemRiskTypeDetailsModel'
import IndexServiceParams from '@/features/website/Service/Core/params/indexServiceParams'
import EditSystemRiskTypeParams from '../../Core/params/editSystemRiskTypeParams'
import AddSystemRiskTypeParams from '../../Core/params/addSystemRiskTypeParams'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: SystemRiskTypeDetailsModel
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

  const params = props?.data?.id
    ? new EditSystemRiskTypeParams(
        props?.data?.id,
        mainTranslations,
        SelectedColor.value,
        imageAlt.value,
        image.value,
      )
    : new AddSystemRiskTypeParams(
        mainTranslations,
        SelectedColor.value,
        imageAlt.value,
        image.value,
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

watch(
  [() => props.data, () => langDefault.value],
  ([newData, newDefault]) => {
    if (!newData || !newDefault.length) return

    // Map titles
    langsTitle.value = newDefault.map((lang) => {
      const translation = newData.titles?.find((t: any) => t.locale === lang.locale)
      return {
        locale: lang.locale,
        title: translation?.title || '',
      }
    })

    // Map subtitles
    langsSubTitle.value = newDefault.map((lang) => {
      const translation = newData.subtitles?.find((t: any) => t.locale === lang.locale)
      return {
        locale: lang.locale,
        title: translation?.subtitle || '',
      }
    })
    SelectedColor.value = newData.color
    imageAlt.value = newData.alt
    image.value = newData.image

    updateData()
  },
  { immediate: true, deep: true },
)
const SelectedColor = ref('')
const imageAlt = ref('')

const imageLink = ref('')
const UpdateAltImage = (data: Event) => {
  imageLink.value = (data.target as HTMLInputElement).value
  updateData()
}

const image = ref<string>('')

const setImage = async (data: File | string) => {
  // image.value = await filesToBase64(data)
  image.value = typeof data === 'string' ? data : await filesToBase64(data)
  updateData()
}
</script>

<template>
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput
      type="text"
      :langs="langDefault"
      :modelValue="langsTitle"
      :label="$t('Title')"
      @update:modelValue="setLangsTitle"
    />
  </div>

  <div class="col-span-4 md:col-span-2">
    <LangTitleInput
      type="text"
      :langs="langDefault"
      :modelValue="langsSubTitle"
      :label="$t('Subtitle')"
      @update:modelValue="setLangsSubTitle"
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="color">Color</label>
    <input
      type="text"
      class="input"
      placeholder="Select Color"
      id="color"
      v-model="SelectedColor"
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="image-alt">{{ $t('image_alt') }}</label>
    <input
      id="image-alt"
      v-model="imageAlt"
      type="text"
      class="input"
      placeholder="Link"
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
      :isCrop="true"
      :aspectRatio="1 / 1"
    />
  </div>
</template>
