<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'

import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
// import FileUpload from '@/shared/FormInputs/FileUpload.vue'
import IconMinus from '@/shared/icons/IconMinus.vue'
import IconAdd from '@/shared/icons/IconAdd.vue'

import SingleFileUpload from '@/shared/HelpersComponents/SingleFileUpload.vue'
import type ServiceFeatureDetailsModel from '../../Data/models/ServiceFeatureDetailsModel'
import AddServiceFeatureParams from '../../Core/params/addServiceFeatureParams'
import EditServiceFeatureParams from '../../Core/params/editServiceFeatureParams'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import IndexServiceController from '@/features/website/Service/Presentation/controllers/indexServiceController'
import IndexServiceParams from '@/features/website/Service/Core/params/indexServiceParams'
import TitleInterface from '@/base/Data/Models/title_interface'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: ServiceFeatureDetailsModel
}>()

// Translations
const langs = ref<{ locale: string; title: string }[]>([])
const langDefault = ref<{ locale: string; icon?: string; title: string }[]>([])

const alt_image = ref<string>('')

const indexServiceController = IndexServiceController.getInstance()
const ServiceParams = new IndexServiceParams('', 0, 0, 0, 0)

// Image
const image = ref<string>('')

const service_id = ref<TitleInterface | null>(null)

const setIndexService = (value: TitleInterface | null) => {
  service_id.value = value
  updateData()
}

// Items (dynamic list)
interface Item {
  langs: { locale: string; title: string }[]
  langs_sub: { locale: string; title: string }[]
  image: string
  alt_image: string
}
const items = ref<Item[]>([])

// helper to create new blank item
const createNewItem = (): Item => ({
  langs: langDefault.value.map((l) => ({ locale: l.locale, title: '' })),
  langs_sub: langDefault.value.map((l) => ({ locale: l.locale, title: '' })),
  image: '',
  alt_image: '',
})

const langsSub = ref<{ locale: string; title: string }[]>([])
const langsDescription = ref<{ locale: string; title: string }[]>([])

const setLangsSub = (value: { locale: string; title: string }[]) => {
  langsSub.value = value
  updateData()
}

const setLangsDescription = (value: { locale: string; title: string }[]) => {
  langsDescription.value = value
  updateData()
}

// --- Fetch available languages
const fetchLang = async () => {
  const params = new IndexLangParams('', 1, 10, 0)
  const response = (await IndexLangController.getInstance().getData(params)).value

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

  if (!items.value.length) {
    items.value.push(createNewItem())
  }
}

onMounted(fetchLang)

// --- Sync with parent
const updateData = () => {
  const translationsParams = new TranslationsParams()
  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })

  langsSub.value.forEach((lang) => {
    translationsParams.setTranslation('subtitle', lang.locale, lang.title)
  })

  langsDescription.value.forEach((lang) => {
    translationsParams.setTranslation('description', lang.locale, lang.title)
  })

  const itemsParams = items.value.map((item) => {
    const itemTranslations = new TranslationsParams()
    item.langs.forEach((lang) => {
      itemTranslations.setTranslation('title', lang.locale, lang.title)
    })

    item.langs_sub.forEach((lang) => {
      itemTranslations.setTranslation('subtitle', lang.locale, lang.title)
    })

    const params = new AddServiceFeatureParams(itemTranslations, item.alt_image, item.image?.file)
    return params
  })

  const params = props.data?.id
    ? new EditServiceFeatureParams(
        props.data?.id ?? 0,
        translationsParams,
        alt_image.value,
        image.value?.file,
        itemsParams,
        service_id.value?.id,
      )
    : new AddServiceFeatureParams(
        translationsParams,
        alt_image.value,
        image.value?.file,
        itemsParams,
        service_id.value?.id,
      )

  console.log(params, 'params From Form')
  emit('update:data', params)
}

// Setters
const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data
  updateData()
}
const setImage = async (file: File) => {
  image.value = file ? await filesToBase64(file) : ''
  updateData()
}

// Items handlers
const addItem = () => {
  items.value.push(createNewItem())
  updateData()
}
const removeItem = (index: number) => {
  if (items.value.length > 1) {
    items.value.splice(index, 1)
    updateData()
  }
}

const setItemLangs = (index: number, data: { locale: string; title: string }[]) => {
  items.value[index].langs = data
  updateData()
}

const setItemSubLangs = (index: number, data: { locale: string; title: string }[]) => {
  items.value[index].langs_sub = data
  updateData()
}

const setItemImage = async (index: number, file: File) => {
  items.value[index].image = file ? await filesToBase64(file) : ''
  updateData()
}

// Watch for alt_image global change
watch(alt_image, () => updateData())

const { locale } = useI18n()

// --- Init watcher
watch(
  [() => props.data, () => langDefault.value],
  ([newData, newDefault]) => {
    if (!newDefault.length) return

    langs.value = newData?.titles?.length
      ? newDefault.map((l) => {
          const existing = newData.titles.find((t) => t.locale === l.locale)
          return existing ?? { locale: l.locale, title: '' }
        })
      : newDefault.map((l) => ({ locale: l.locale, title: '' }))

    langsSub.value = newData?.subTitles?.length
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

    alt_image.value = newData?.alt ?? ''
    image.value = newData?.image ?? ''

    // console.log(newData?.service, 'wwww')

    service_id.value = newData?.service

    // console.log(newData?.ServiceFeatureItems, 'newData?.ServiceFeatureItems')

    items.value = newData?.ServiceFeatureItems?.length
      ? newData.ServiceFeatureItems.map((it: any) => ({
          langs: it?.titles ?? newDefault.map((l: any) => ({ locale: l.locale, title: '' })),
          langs_sub: it?.subTitles ?? newDefault.map((l: any) => ({ locale: l.locale, title: '' })),
          image: it.image ?? '',
          alt_image: it.alt ?? '',
        }))
      : [createNewItem()]

    updateData()
  },
  { immediate: true },
)
</script>

<template>
  <!-- Titles -->
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput
      :label="$t('title')"
      :langs="langDefault"
      type="text"
      :modelValue="langs"
      @update:modelValue="setLangs"
    />
  </div>

  <div class="col-span-4 md:col-span-2">
    <LangTitleInput
      :langs="langDefault"
      :label="$t('sub_title')"
      :modelValue="langsSub"
      type="text"
      @update:modelValue="setLangsSub"
    />
  </div>

  <div class="col-span-4 md:col-span-4">
    <CustomSelectInput
      :controller="indexServiceController"
      :modelValue="service_id"
      :params="ServiceParams"
      label="service"
      id="service"
      placeholder="Select service"
      @update:modelValue="setIndexService"
    />
  </div>
  <div class="col-span-4 md:col-span-4">
    <LangTitleInput
      :langs="langDefault"
      :label="$t('description')"
      :modelValue="langsDescription"
      type="textarea"
      @update:modelValue="setLangsDescription"
    />
  </div>

  <!-- Items Section -->
  <div class="col-span-4 border border-gray-200 !p-3 rounded">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-bold text-lg">{{ $t('items') }}</h3>
    </div>

    <div
      v-for="(item, index) in items"
      :key="index"
      class="grid grid-cols-4 gap-4 mb-4 !my-2 !p-3 border border-gray-200 rounded"
    >
      <div class="col-span-4 md:col-span-2">
        <LangTitleInput
          :langs="langDefault"
          :label="$t('itemTitle') + ' ' + (index + 1)"
          :modelValue="item.langs"
          @update:modelValue="(val) => setItemLangs(index, val)"
        />
      </div>

      <div class="col-span-4 md:col-span-2">
        <LangTitleInput
          :langs="langDefault"
          :label="$t('itemSubTitle') + ' ' + (index + 1)"
          :modelValue="item.langs_sub"
          @update:modelValue="(val) => setItemSubLangs(index, val)"
        />
      </div>

      <div class="col-span-4 md:col-span-2 input-wrapper">
        <label for="alt_image">
          {{ $t('alt_image') }}
        </label>
        <input type="text" v-model="item.alt_image" @input="updateData" />
      </div>

      <div class="col-span-4">
        <SingleFileUpload
          v-model="item.image"
          @update:modelValue="(val) => setItemImage(index, val)"
          :label="`Image-${index + 1}`"
          :id="`image-${index + 1}`"
          placeholder="Select image"
          :index="index"
        />
      </div>

      <div class="col-span-4 flex justify-end">
        <button type="button" class="btn-add flex items-center gap-2 !mx-2" @click="addItem">
          <IconAdd />
        </button>
        <button
          v-if="items.length > 1"
          type="button"
          class="btn-minus flex items-center gap-2 !bg-red-500 w-8 h-8 rounded-full justify-center"
          @click="removeItem(index)"
        >
          <IconMinus />
        </button>
      </div>
    </div>
  </div>
</template>
