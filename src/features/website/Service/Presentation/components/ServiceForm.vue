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
import SingleFileUpload from '@/shared/HelpersComponents/SingleFileUpload.vue'
import type ServiceDetailsModel from '../../Data/models/ServiceDetailsModel'
import EditServiceParams from '../../Core/params/editServiceParams'
import AddServiceParams from '../../Core/params/addServiceParams'
import IconMinus from '@/shared/icons/IconMinus.vue'
import IconAdd from '@/shared/icons/IconAdd.vue'

const emit = defineEmits(['update:data'])
const props = defineProps<{ data?: ServiceDetailsModel }>()

// MAIN FIELDS
const name = ref('')
const rate = ref(0)
const date = ref('')
const alt = ref('')
// const image = ref<string | File>('')

const langs = ref<{ locale: string; title: string }[]>([])
const langsSubTitle = ref<{ locale: string; title: string }[]>([])
const langsButton = ref<{ locale: string; title: string }[]>([])
const langDefault = ref<{ locale: string; icon?: string; title: string }[]>([])

// INCLUDES (only multilingual title)
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

// FETCH LANGUAGES
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

  if (!includes.value.length) includes.value.push(createNewInclude())
}

onMounted(fetchLang)

// UPDATE PARENT
const updateData = () => {
  const translationsParams = new TranslationsParams()
  langs.value.forEach((lang) => translationsParams.setTranslation('title', lang.locale, lang.title))
  langsSubTitle.value.forEach((lang) =>
    translationsParams.setTranslation('subtitle', lang.locale, lang.title),
  )
  langsButton.value.forEach((lang) =>
    translationsParams.setTranslation('description', lang.locale, lang.title),
  )

  const includesParams = includes.value.map((inc) => {
    const incTranslations = new TranslationsParams()
    Object.entries(inc.translations.title).forEach(([locale, value]) => {
      incTranslations.setTranslation('title', locale, value)
    })
    return { translations: incTranslations.toMap() }
  })

  const params = props.data?.id
    ? new EditServiceParams(props.data.id!, translationsParams, includesParams)
    : new AddServiceParams(translationsParams, includesParams)

  emit('update:data', params)
}

// HELPERS
const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data
  updateData()
}
const setLangsSubTitle = (data: { locale: string; title: string }[]) => {
  langsSubTitle.value = data
  updateData()
}
const setLangsButton = (data: { locale: string; title: string }[]) => {
  langsButton.value = data
  updateData()
}

const addInclude = () => {
  includes.value.push(createNewInclude())
  updateData()
}
const removeInclude = (index: number) => {
  if (includes.value.length > 1) includes.value.splice(index, 1)
  updateData()
}
const setIncludeTitleLangs = (index: number, data: { locale: string; title: string }[]) => {
  data.forEach((d) => (includes.value[index].translations.title[d.locale] = d.title))
  updateData()
}

watch(
  [() => props.data, () => langDefault.value],
  ([newData, newDefault]) => {
    if (!newDefault.length) return

    langs.value = newDefault.map((l) => {
      const existing = newData?.title?.find((t) => t.locale === l.locale)
      return existing ?? { locale: l.locale, title: '' }
    })

    langsSubTitle.value = newDefault.map((l) => {
      const existing = newData?.subTitle?.find((t) => t.locale === l.locale)
      return existing ?? { locale: l.locale, title: '' }
    })

    langsButton.value = newDefault.map((l) => {
      const existing = newData?.descriptions?.find((t) => t.locale === l.locale)
      return existing ?? { locale: l.locale, title: '' }
    })

    // alt.value = newData?.alt ?? ''
    // image.value = newData?.image ?? ''

    includes.value = newData?.includes?.length
      ? newData.includes.map((it: any) => {
          const title: Record<string, string> = {}
          newDefault.forEach((l: any) => {
            const found = it?.title?.find((t: any) => t.locale === l.locale)
            title[l.locale] = found?.title ?? ''
          })
          return { translations: { title } }
        })
      : [createNewInclude()]

    updateData()
  },
  { immediate: true },
)

// const setImage = async (data: File | string) => {
//   image.value = typeof data === 'string' ? data : await filesToBase64(data)
//   updateData()
// }
</script>

<template>
  <!-- Title fields -->
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput
      :langs="langDefault"
      :modelValue="langs"
      :label="$t('title')"
      type="text"
      @update:modelValue="setLangs"
    />
  </div>

  <div class="col-span-4 md:col-span-2">
    <LangTitleInput
      :langs="langDefault"
      :modelValue="langsSubTitle"
      :label="$t('sub_title')"
      type="text"
      @update:modelValue="setLangsSubTitle"
    />
  </div>

  <div class="col-span-4 md:col-span-4">
    <LangTitleInput
      :langs="langDefault"
      :modelValue="langsButton"
      :label="$t('Description')"
      type="textarea"
      @update:modelValue="setLangsButton"
    />
  </div>

  <!--
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
      :isCrop="true"
      :aspectRatio="1 / 1"
    />
  </div>
  -->

  <!-- INCLUDES -->
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
          :label="$t('title') + ' ' + (index + 1)"
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
