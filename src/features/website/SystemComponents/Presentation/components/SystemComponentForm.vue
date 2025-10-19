<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
import FileUpload from '@/shared/FormInputs/FileUpload.vue'
import IconMinus from '@/shared/icons/IconMinus.vue'
import IconAdd from '@/shared/icons/IconAdd.vue'
import IndexSystemComponentParams from '../../Core/params/indexSystemComponentParams'
import IndexSystemComponentController from '../controllers/indexSystemComponentController'
import AddSystemComponentParams from '../../Core/params/addSystemComponentParams'
import EditSystemComponentParams from '../../Core/params/editSystemComponentParams'
import type SystemComponentDetailsModel from '../../Data/models/SystemComponentDetailsModel'
import FeaturesParams from '../../Core/params/FeaturesParams'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: SystemComponentDetailsModel
}>()

// Translations
const langs = ref<{ locale: string; title: string }[]>([])
const subtitlelangs = ref<{ locale: string; subtitle: string }[]>([])
const langDefault = ref<{ locale: string; icon?: string; title: string }[]>([])

// Industries
const allIndustries = ref<boolean>(false)
const industry = ref<TitleInterface[]>([])
const industryParams = new IndexSystemComponentParams('', 0, 10, 1)
const industryController = IndexSystemComponentController.getInstance()

// const ActionsSelection = ref<TitleInterface[]>([
//   new TitleInterface({ id: ActionsEnum.CheckBox, title: 'Checkbox', subtitle: '' }),
// ])

// Image
const image = ref<string>('')

// Items (dynamic list)
interface Features {
  langs: { locale: string; title: string }[]
}
const items = ref<Features[]>([])

// helper to create new blank item
const createNewItem = (): Features => ({
  langs: langDefault.value.map((l) => ({ locale: l.locale, title: '' })),
})

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
  subtitlelangs.value.forEach((lang) => {
    translationsParams.setTranslation('subtitle', lang.locale, lang.subtitle)
  })

  const itemsParams = items.value.map((item) => {
    const itemTranslations = new TranslationsParams()
    item.langs.forEach((lang) => {
      itemTranslations.setTranslation('title', lang.locale, lang.title)
    })
    return new FeaturesParams(itemTranslations)
  })

  // console.log(itemsParams, 'itemsParams')

  const params = props.data?.id
    ? new EditSystemComponentParams(props.data?.id ?? 0, translationsParams, itemsParams)
    : new AddSystemComponentParams(translationsParams, itemsParams)

  emit('update:data', params)
}

// Setters
const setIndustry = (data: TitleInterface[]) => {
  industry.value = data
  updateData()
}
const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data
  updateData()
}
const setSubtitleLangs = (data: { locale: string; subtitle: string }[]) => {
  subtitlelangs.value = data
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

    subtitlelangs.value = newData?.subTitles?.length
      ? newDefault.map((l) => {
          const existing = newData.subTitles.find((t) => t.locale === l.locale)
          return existing ?? { locale: l.locale, subtitle: '' }
        })
      : newDefault.map((l) => ({ locale: l.locale, subtitle: '' }))

    items.value = newData?.features?.length
      ? newData.features.map((it: any) => ({
          langs: it.titles ?? newDefault.map((l: any) => ({ locale: l.locale, title: '' })),
        }))
      : [createNewItem()]
  },
  { immediate: true },
)
</script>

<template>
  <!-- Titles -->
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput :langs="langDefault" :modelValue="langs" @update:modelValue="setLangs" />
  </div>
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput
      :label="$t('sub_title')"
      :langs="langDefault"
      :modelValue="subtitlelangs"
      @update:modelValue="setSubtitleLangs"
      field-type="subtitle"
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
