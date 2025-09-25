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
import type ServiceDetailsModel from '../../Data/models/ServiceDetailsFeatureModel'
import AddServiceFeatureParams from '../../Core/params/addServiceFeatureParams'
import ItemParams from '../../Core/params/ItemParams'

import IconMinus from '@/shared/icons/IconMinus.vue'
import IconAdd from '@/shared/icons/IconAdd.vue'
import IndexServiceController from '@/features/website/Service/Presentation/controllers/indexServiceController'
import IndexServiceParams from '@/features/website/Service/Core/params/indexServiceParams'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: ServiceDetailsModel
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

  const params = new AddServiceFeatureParams(
    SelectedService.value?.id,
    mainTranslations,
    itemsParams,
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

const setItemTitleLangs = (index: number, data: { locale: string; title: string }[]) => {
  data.forEach((d) => {
    items.value[index].translations.title[d.locale] = d.title
  })
  updateData()
}

const setItemSubtitleLangs = (index: number, data: { locale: string; title: string }[]) => {
  data.forEach((d) => {
    items.value[index].translations.subtitle[d.locale] = d.title
  })
  updateData()
}

const setItemAlt = (index: number, alt: string) => {
  items.value[index].alt = alt
  updateData()
}

const setItemImage = async (index: number, file: File) => {
  items.value[index].image = await filesToBase64(file)
  updateData()
}

watch(
  [() => props.data, () => langDefault.value],
  ([newData, newDefault]) => {
    if (newDefault.length) {
      // Main translations
      langsTitle.value = newDefault.map((l) => {
        const existing = newData?.translations?.find(
          (t: any) => t.locale === l.locale && t.field === 'title',
        )
        return existing
          ? { locale: l.locale, title: existing.title }
          : { locale: l.locale, title: '' }
      })

      langsSubTitle.value = newDefault.map((l) => {
        const existing = newData?.translations?.find(
          (t: any) => t.locale === l.locale && t.field === 'subtitle',
        )
        return existing
          ? { locale: l.locale, title: existing.title }
          : { locale: l.locale, title: '' }
      })

      langsDescription.value = newDefault.map((l) => {
        const existing = newData?.translations?.find(
          (t: any) => t.locale === l.locale && t.field === 'description',
        )
        return existing
          ? { locale: l.locale, title: existing.title }
          : { locale: l.locale, title: '' }
      })

      // Items data
      items.value = newData?.items?.length
        ? newData.items.map((item: any) => {
            const title: Record<string, string> = {}
            const subtitle: Record<string, string> = {}

            newDefault.forEach((l: any) => {
              const foundTitle = item.translations?.find(
                (t: any) => t.locale === l.locale && t.field === 'title',
              )
              const foundSubtitle = item.translations?.find(
                (t: any) => t.locale === l.locale && t.field === 'subtitle',
              )

              title[l.locale] = foundTitle?.title ?? ''
              subtitle[l.locale] = foundSubtitle?.title ?? ''
            })

            return {
              translations: { title, subtitle },
              alt: item.alt ?? '',
              image: item.image ?? '',
            }
          })
        : [createNewItem()]
    }
  },
  { immediate: true },
)

const SelectedService = ref<TitleInterface>()
const setServiceSelection = (data: TitleInterface) => {
  SelectedService.value = data
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
      type="text"
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
          :modelValue="
            langDefault.map((l) => ({
              locale: l.locale,
              title: item.translations.title[l.locale],
            }))
          "
          :label="$t('title')"
          @update:modelValue="(val) => setItemTitleLangs(index, val)"
        />
      </div>

      <div class="col-span-4 md:col-span-2">
        <LangTitleInput
          :langs="langDefault"
          :modelValue="
            langDefault.map((l) => ({
              locale: l.locale,
              title: item.translations.subtitle[l.locale],
            }))
          "
          :label="$t('sub_title')"
          @update:modelValue="(val) => setItemSubtitleLangs(index, val)"
        />
      </div>

      <div class="col-span-4 md:col-span-2 input-wrapper">
        <label :for="`alt-${index}`">{{ $t('alt_image') }}</label>
        <input
          :id="`alt-${index}`"
          :value="item.alt"
          type="text"
          class="input"
          placeholder="alt"
          @input="setItemAlt(index, ($event.target as HTMLInputElement).value)"
        />
      </div>

      <div class="col-span-4 md:col-span-2">
        <SingleFileUpload
          :modelValue="item.image"
          @update:modelValue="(file) => setItemImage(index, file)"
          :label="`Image ${index + 1}`"
          :id="`image-${index}`"
          placeholder="Select image"
        />
      </div>

      <div class="col-span-4 flex justify-end">
        <button type="button" class="btn-add flex items-center gap-2 !mx-2" @click="addItem">
          <IconAdd />
        </button>
        <button
          v-if="items.length > 1"
          type="button"
          class="btn-minus flex items-center gap-2 !bg-red-500 w-10 h-10 rounded-full justify-center"
          @click="removeItem(index)"
        >
          <IconMinus />
        </button>
      </div>
    </div>
  </div>
</template>
