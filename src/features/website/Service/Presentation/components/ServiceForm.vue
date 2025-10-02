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
import type ServiceDetailsModel from '../../Data/models/ServiceDetailsModel'
import EditServiceParams from '../../Core/params/editServiceParams'
import AddServiceParams from '../../Core/params/addServiceParams'

import IconMinus from '@/shared/icons/IconMinus.vue'
import IconAdd from '@/shared/icons/IconAdd.vue'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: ServiceDetailsModel
}>()

const name = ref<string>('')
const rate = ref<number>(0)
const date = ref<string>('')
const alt = ref<string>('')

const langs = ref<{ locale: string; title: string }[]>([])
const langsSubTitle = ref<{ locale: string; title: string }[]>([])
const langsButton = ref<{ locale: string; title: string }[]>([])

const langDefault = ref<{ locale: string; icon?: string; title: string }[]>([])

const image = ref<string | File>('')

interface IncludeItem {
  translations: {
    title: Record<string, string>
  }
}
const includes = ref<IncludeItem[]>([])

const createNewInclude = (): IncludeItem => {
  const title: Record<string, string> = {}
  langDefault.value.forEach((l) => {
    title[l.locale] = ''
  })
  return { translations: { title } }
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
  if (!includes.value.length) {
    includes.value.push(createNewInclude())
  }
}

onMounted(async () => {
  await fetchLang()
})

// --- updating parent
const updateData = () => {
  const translationsParams = new TranslationsParams()

  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })

  langsSubTitle.value.forEach((lang) => {
    translationsParams.setTranslation('subtitle', lang.locale, lang.title)
  })

  langsButton.value.forEach((lang) => {
    translationsParams.setTranslation('description', lang.locale, lang.title)
  })

  const includesParams = includes.value.map((inc) => {
    const incTranslations = new TranslationsParams()
    Object.entries(inc.translations.title).forEach(([locale, value]) => {
      incTranslations.setTranslation('title', locale, value)
    })
    return {
      translations: incTranslations.toMap(),
    }
  })

  const params = props.data?.id
    ? new EditServiceParams(
        props.data?.id!,
        translationsParams,
        alt.value,
        (image.value as any)?.file,
        includesParams,
      )
    : new AddServiceParams(
        translationsParams,
        alt.value,
        (image.value as any)?.file,
        includesParams,
      )

  emit('update:data', params)
}

// helpers
const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data
  updateData()
}
const setLangsSubTitle = (value: { locale: string; title: string }[]) => {
  langsSubTitle.value = value
  updateData()
}
const setLangsButton = (value: { locale: string; title: string }[]) => {
  langsButton.value = value
  updateData()
}

const addInclude = () => {
  includes.value.push(createNewInclude())
  updateData()
}
const removeInclude = (index: number) => {
  if (includes.value.length > 1) {
    includes.value.splice(index, 1)
    updateData()
  }
}
const setIncludeTitleLangs = (index: number, data: { locale: string; title: string }[]) => {
  data.forEach((d) => {
    includes.value[index].translations.title[d.locale] = d.title
  })
  updateData()
}

watch(
  [() => props.data, () => langDefault.value],
  ([newData, newDefault]) => {
    if (newDefault.length) {
      langs.value = newDefault.map((l) => {
        const existing = newData?.descriptions?.find((t) => t.locale === l.locale)
        return existing ? existing : { locale: l.locale, title: '' }
      })

      langsSubTitle.value = newDefault.map((l) => {
        const existing = newData?.subTitle?.find((t: any) => t.locale === l.locale)
        return existing ? existing : { locale: l.locale, title: '' }
      })

      langsButton.value = newDefault.map((l) => {
        const existing = newData?.descriptions?.find((t: any) => t.locale === l.locale)
        return existing ? existing : { locale: l.locale, title: '' }
      })

      name.value = newData?.name ?? ''
      rate.value = newData?.rate ?? 0
      date.value = newData?.date ?? ''
      alt.value = newData?.alt ?? ''
      image.value = newData?.image ?? ''

      includes.value = newData?.includes?.length
        ? newData.includes.map((inc: any) => {
            const title: Record<string, string> = {}
            newDefault.forEach((l: any) => {
              const foundTitle = inc.titles?.find((t: any) => t.locale === l.locale)
              title[l.locale] = foundTitle?.title ?? ''
            })
            return { translations: { title } }
          })
        : [createNewInclude()]
    }
  },
  { immediate: true },
)

const setImage = async (file: File) => {
  image.value = await filesToBase64(file)
  updateData()
}
</script>

<template>
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput
      type="text"
      :langs="langDefault"
      :modelValue="langs"
      :label="$t('title')"
      @update:modelValue="setLangs"
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
    <LangTitleInput
      type="text"
      :langs="langDefault"
      :modelValue="langsButton"
      :label="$t('Description')"
      @update:modelValue="setLangsButton"
      :type="'textarea'"
    />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="alt">{{ $t('alt_image') }}</label>
    <input id="alt" v-model="alt" type="text" class="input" placeholder="alt" @input="updateData" />
  </div>

  <div class="col-span-4 md:col-span-4">
    <SingleFileUpload
      v-model="image"
      @update:modelValue="setImage"
      label="Image"
      id="image"
      placeholder="Select image"
    />
  </div>

  <div class="col-span-4 border border-gray-200 !p-3 rounded">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-bold text-lg">{{ $t('includes') }}</h3>
    </div>

    <div
      v-for="(include, index) in includes"
      :key="index"
      class="grid grid-cols-4 gap-4 mb-4 !my-2 !p-3 border border-gray-200 rounded"
    >
      <div class="col-span-4 md:col-span-2">
        <LangTitleInput
          :langs="langDefault"
          :modelValue="
            langDefault.map((l) => ({
              locale: l.locale,
              title: include.translations.title[l.locale],
            }))
          "
          :label="$t('title')"
          @update:modelValue="(val) => setIncludeTitleLangs(index, val)"
        />
      </div>

      <div class="col-span-4 flex justify-end">
        <button type="button" class="btn-add flex items-center gap-2 !mx-2" @click="addInclude">
          <IconAdd />
        </button>
        <button
          v-if="includes.length > 1"
          type="button"
          class="btn-minus flex items-center gap-2 !bg-red-500 w-8 h-8 rounded-full justify-center"
          @click="removeInclude(index)"
        >
          <IconMinus />
        </button>
      </div>
    </div>
  </div>
</template>
