<script setup lang="ts">
import HeaderSection from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderSection.vue'
import ImportantIcon from '@/shared/icons/ImportantIcon.vue'
import Dialog from 'primevue/dialog'
import InspectionTemplateImage from '@/assets/images/check-list.png'

import { markRaw, onMounted, ref, watch } from 'vue'

import AddNewTemplateIcon from '@/shared/icons/AddNewTemplateIcon.vue'
import NewTemplateArrowIcon from '@/shared/icons/NewTemplateArrowIcon.vue'
import { TemplateType } from '@/features/setting/Template/Core/Enum/TemplateTypeEnum'
import TitleInterface from '@/base/Data/Models/title_interface'
import AddTemplateParams from '@/features/setting/Template/Core/params/addTemplateParams'
import EditTemplateParams from '@/features/setting/Template/Core/params/editTemplateParams'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import TranslationsParams from '@/base/core/params/translations_params'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController'
import { LangsMap } from '@/constant/langs'
import { useUserStore } from '@/stores/user'
import { ActionsEnum } from '@/features/setting/Template/Core/Enum/ActionType'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import TemplateTimeLine from '../InspectionUtils/TemplateTimeLine.vue'
import AddTemplateItemParams from '@/features/setting/TemplateItem/Core/params/addTemplateItemParams'
import AddTemplateController from '@/features/setting/Template/Presentation/controllers/addTemplateController'
import { useRouter } from 'vue-router'
import TemplateImage from '@/features/setting/TemplateItem/Presentation/components/TemplateTypes/TemplateImage.vue'
// import TemplateTimeLine from '../../InspectionUtils/TemplateTimeLine.vue



const visible = ref(false)
const emit = defineEmits(['update:data', 'update:templateId'])

// Translations
const langs = ref<{ locale: string; title: string }[]>([])
const langDefault = ref<{ locale: string; icon?: string; title: string }[]>([])


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

onMounted(
  () => {
    fetchLang();

  }
)
interface items {
  title: string
  isDanger: boolean
  isTextAreaRequired: boolean
  textarea_type: number
  has_auto_observation: boolean
}

const buildOptions = (templateItems: any[]): items[] => {
  return templateItems.map((item) => ({
    title: item.text,
    isDanger: item.isUplaod,
    isTextAreaRequired: item.isTextarea,
    textarea_type: item.textareaType ?? 0,
    has_auto_observation: item.isObservation,
    normal_textarea: true
  }))
}
const updateData = () => {
  const translationsParams = new TranslationsParams()
  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })


  console.log(TemplateData.value, "TemplateData.value")
  const items = TemplateData.value.map((item) => {
    return new AddTemplateItemParams(
      null,
      item.itemTitle,
      item.SelectedActionType?.id,
      buildOptions(item.TemplateItems),
      item.isUpdloadImage || 0,
      item.ImageStatus || 0,
    )
  })

  const params = new AddTemplateParams(
    translationsParams,
    null,
    null ?? [],
    image.value || null,
    null,
    items,
    SelectedTemplateType?.value?.id
  )
  emit('update:data', params)
}

const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data
  updateData()
}


const SelectedTemplateType = ref<TitleInterface | null>(null)
const TemplateTypes = ref<TitleInterface[]>([
  new TitleInterface({ id: TemplateType.Equipment, title: 'Equipment', subtitle: '' }),
  new TitleInterface({ id: TemplateType.Tool, title: 'Tool', subtitle: '' }),
  new TitleInterface({ id: TemplateType.Location, title: 'Location', subtitle: '' }),
])

const setTemplateType = (data: TitleInterface) => {
  SelectedTemplateType.value = data
  updateData()
}

const TemplateData = ref()
const GetTemplateData = (data) => {
  TemplateData.value = data
  console.log(TemplateData.value, "TemplateData.value")
}


const addTemplateController = AddTemplateController.getInstance()

const router = useRouter()

const addTemplate = async () => {

  const translationsParams = new TranslationsParams()
  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })



  const items = TemplateData.value.map((item) => {
    return new AddTemplateItemParams(
      null,
      item.itemTitle,
      item.SelectedActionType?.id,
      buildOptions(item.TemplateItems),
      item.isUpdloadImage || 0,
      item.ImageStatus || 0,
    )
  })
  const params = new AddTemplateParams(
    translationsParams,
    null,
    null ?? [],
    image.value || null,
    null,
    items,
    SelectedTemplateType?.value?.id
  )
  const state = await addTemplateController.addTemplate(params as AddTemplateParams, router)
  if (state?.value.data) {
    emit('update:templateId', state?.value.data.id)
  }
  visible.value = false
}

</script>

<template>


  <div class="add-new-template-btn flex gap-2" @click="visible = true">
    <AddNewTemplateIcon />
    <div class="add-new-template-header">
      <div class="flex items-center">
        <span class="title">{{ $t('new_template') }}</span>
        <NewTemplateArrowIcon />
      </div>
      <p class="descripetion">you can customize a new templet from here and you can use it once or save it to your
        collection</p>
    </div>
  </div>

  <Dialog v-model:visible="visible" modal :dissmissible-mask="true" :style="{ width: '60vw', height: '80vh' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" class="add-new-template-dialog-container">
    <template #header>
      <div class="add-new-template-dialog-header">
        <p class="title">create new templet</p>
        <p>follow the steps to add your templet now</p>
      </div>
    </template>
    <div class="inspection-template-dialog-data grid grid-cols-4 gap-4">
      <hr class="inspection-template-dialog-divider col-span-4" />

      <div class="col-span-4 md:col-span-2">
        <LangTitleInput :langs="langDefault" :modelValue="langs" @update:modelValue="setLangs" />
      </div>
      <div class="col-span-4 md:col-span-2">
        <CustomSelectInput :modelValue="SelectedTemplateType" :staticOptions="TemplateTypes" :required="true"
          label="Template Type " id="TemplateType" placeholder="Select Template Type"
          @update:modelValue="setTemplateType" />
      </div>

      <TemplateTimeLine @update:data="GetTemplateData" />

      <div class="flex w-full col-span-4 gap-2">
        <button style="width: 50%;" class="btn btn-primary " @click="addTemplate">use & save to library</button>
        <button style="width: 50%;" class="btn btn-secondary " @click="addTemplate">use only this time</button>
      </div>
    </div>
  </Dialog>
</template>
