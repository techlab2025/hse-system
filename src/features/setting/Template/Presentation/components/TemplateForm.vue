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
import IndexIndustryParams from '@/features/setting/Industries/Core/Params/indexIndustryParams.ts'
import IndexIndustryController from '@/features/setting/Industries/Presentation/controllers/indexIndustryController.ts'
import type TemplateDetailsModel from '../../Data/models/TemplateDetailsModel'
import EditTemplateParams from '../../Core/params/editTemplateParams'
import AddTemplateParams from '../../Core/params/addTemplateParams'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
import FileUpload from '@/shared/FormInputs/FileUpload.vue'
import IconMinus from '@/shared/icons/IconMinus.vue'
import IconAdd from '@/shared/icons/IconAdd.vue'
import { ActionsEnum } from '../../Core/Enum/ActionType'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: TemplateDetailsModel
}>()

// Translations
const langs = ref<{ locale: string; title: string }[]>([])
const langDefault = ref<{ locale: string; icon?: string; title: string }[]>([])

// Industries
const allIndustries = ref<boolean>(false)
const industry = ref<TitleInterface[]>([])
const industryParams = new IndexIndustryParams('', 0, 10, 1)
const industryController = IndexIndustryController.getInstance()

const ActionsSelection = ref<TitleInterface[]>([
  new TitleInterface({ id: ActionsEnum.CheckBox, title: 'Checkbox', subtitle: '' }),
])

// Image
const image = ref<string>('')

// Items (dynamic list)
interface Item {
  langs: { locale: string; title: string }[]
  allIndustries: boolean
  industry: TitleInterface[]
  requireImage: string
  action: TitleInterface | null
}
const items = ref<Item[]>([])

// helper to create new blank item
const createNewItem = (): Item => ({
  langs: langDefault.value.map((l) => ({ locale: l.locale, title: '' })),
  allIndustries: false,
  industry: [],
  requireImage: '',
  action: null,
})

const user = useUserStore()
// --- Fetch available languages
const fetchLang = async () => {
  if (user?.user?.languages.length) {
    langDefault.value = user?.user?.languages.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
    return
  }
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

  const itemsParams = items.value.map((item) => {
    const itemTranslations = new TranslationsParams()
    item.langs.forEach((lang) => {
      itemTranslations.setTranslation('title', lang.locale, lang.title)
    })
    const AllIndustry = user.user?.type == OrganizationTypeEnum?.ADMIN ? item.allIndustries : null

    const params = new AddTemplateParams(
      itemTranslations,
      AllIndustry,
      item.industry.map((i) => i.id),
      item.requireImage ? 1 : 0,
      item.action?.id,
    )
    return params
  })

  const AllIndustry = user.user?.type == OrganizationTypeEnum?.ADMIN ? allIndustries.value : null

  const params = props.data?.id
    ? new EditTemplateParams(
        props.data?.id ?? 0,
        translationsParams,
        AllIndustry,
        industry.value?.map((i) => i.id) ?? [],
        image.value,
        itemsParams,
      )
    : new AddTemplateParams(
        translationsParams,
        AllIndustry,
        industry.value?.map((i) => i.id),
        image.value,
        null,
        itemsParams,
      )

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
const setItemIndustry = (index: number, data: TitleInterface[]) => {
  items.value[index].industry = data
  updateData()
}
const setItemAction = (index: number, data: TitleInterface) => {
  // console.log(data)

  items.value[index].action = data
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

    allIndustries.value = newData?.allIndustries == 1 ? true : false

    industry.value = newData?.industries ?? []

    image.value = newData?.image ?? ''

    items.value = newData?.templateItems?.length
      ? newData.templateItems.map((it: any) => ({
          langs: it.titles ?? newDefault.map((l: any) => ({ locale: l.locale, title: '' })),
          allIndustries: it.allIndustries == 1 ? true : false,
          industry: it.industries ?? [],
          requireImage: it.requireImage ?? '',
          action: it.action ?? null,
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

  <!-- All Industries -->
  <div
    class="col-span-4 md:col-span-2 input-wrapper check-box"
    v-if="user.user?.type == OrganizationTypeEnum?.ADMIN"
  >
    <label>{{ $t('all_industries') }}</label>
    <input type="checkbox" v-model="allIndustries" @change="updateData" />
  </div>

  <!-- Industry Selection -->
  <div
    class="col-span-4 md:col-span-2"
    v-if="!allIndustries && user.user?.type == OrganizationTypeEnum?.ADMIN"
  >
    <CustomSelectInput
      :modelValue="industry"
      :controller="industryController"
      :params="industryParams"
      label="industry"
      id="Template"
      placeholder="Select industry"
      :type="2"
      @update:modelValue="setIndustry"
    />
  </div>

  <!-- Image
  <div class="col-span-4">
    <FileUpload
      :initialFileData="image"
      @update:fileData="setImage"
      label="Image"
      id="image"
      placeholder="Select image"
      :multiple="false"
    />
  </div>
  -->

  <!-- Items Section -->
  <!-- <div class="col-span-4 border border-gray-200 !p-3 rounded">
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

      <div
        class="col-span-4 md:col-span-2 input-wrapper check-box"
        v-if="user.user?.type == OrganizationTypeEnum?.ADMIN"
      >
        <label>{{ $t('all_industries') }}</label>
        <input type="checkbox" v-model="item.allIndustries" @change="updateData" />
      </div>

      <div
        class="col-span-4 md:col-span-2"
        v-if="!item.allIndustries && user.user?.type == OrganizationTypeEnum?.ADMIN"
      >
        <CustomSelectInput
          :modelValue="item.industry"
          :controller="industryController"
          :params="industryParams"
          label="industry"
          :id="'TemplateItem-' + index"
          placeholder="Select industry"
          :type="2"
          @update:modelValue="(val) => setItemIndustry(index, val)"
        />
      </div>

      <div class="col-span-4 md:col-span-2">
        <CustomSelectInput
          :modelValue="item.action"
          label="action"
          :staticOptions="ActionsSelection"
          :id="'action-' + index"
          placeholder="Select action"
          @update:modelValue="(val) => setItemAction(index, val)"
        />
      </div>

      <div class="col-span-4 md:col-span-2 input-wrapper check-box">
        <label>{{ $t('require_image') }}</label>
        <input type="checkbox" v-model="item.requireImage" @change="updateData" />
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
  </div> -->
</template>
