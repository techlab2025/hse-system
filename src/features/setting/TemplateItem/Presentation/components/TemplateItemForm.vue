<script lang="ts" setup>
import { markRaw, onMounted, ref, TransitionGroup, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params'
// import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams'
import { LangsMap } from '@/constant/langs'
import IndexIndustryParams from '@/features/setting/Industries/Core/Params/indexIndustryParams'
import IndexIndustryController from '@/features/setting/Industries/Presentation/controllers/indexIndustryController'
import { useRoute } from 'vue-router'
// import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
import IndexTemplateItemTypeController from '@/features/setting/TemplateItem/Presentation/controllers/indexTemplateItemController'
import IndexTemplateItemTypeParams from '@/features/setting/TemplateItem/Core/params/indexTemplateItemParams'
import AddTemplateItemParams from '../../Core/params/addTemplateItemParams'
import EditTemplateItemParams from '../../Core/params/editTemplateItemParams'
// import type TemplateItemModel from '../../Data/models/TemplateItemModel'
import { useUserStore } from '@/stores/user'
// import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
// import ActionsButtons from '@/shared/Actions/ActionsButtons.vue'
// import CheckBoxButton from '@/shared/Checkbox/CheckBoxButton.vue'
// import FormHeaderSection from '@/shared/FormHeader/FormHeaderSection.vue'
import TemplateItemDetailsModel from '../../Data/models/TemplateItemDetailsModel'
import PagesHeader from '@/shared/HelpersComponents/PagesHeader.vue'
// import Setting from '@/assets/images/Setting.png'
import SmartContract from '@/assets/images/SmartContract.png'
// import Select from 'primevue/select'
import TemplateTypesSection from './TemplateTypes/TemplateTypesSection.vue'
import type { ActionsEnum } from '../../Core/Enum/ActionsEnum'
import DropDownType from './TemplateTypes/DropDownType.vue'

const emit = defineEmits(['update:data'])
const props = defineProps<{ data?: TemplateItemDetailsModel }>()
// const { user } = useUserStore()
const ImageChecked = ref()
const ActionChecked = ref()
const route = useRoute()
const id = Number(route.params.parent_id)

const indexTemplateItemTypeController = IndexTemplateItemTypeController.getInstance()
const indexTemplateItemTypeParams = new IndexTemplateItemTypeParams('', 1, 10, 1)
const industryController = IndexIndustryController.getInstance()
const industryParams = new IndexIndustryParams('', 0, 10, 1)

const langs = ref<{ locale: string; icon?: any; title: string }[]>([])
const langDefault = ref<{ locale: string; icon?: any; title: string }[]>([])
const TemplateItem = ref<TitleInterface | null>(null)

const user = useUserStore()
// Fetch available languages and set defaults
const fetchLang = async (query = '', pageNumber = 1, perPage = 10, withPage = 0) => {
  if (user?.user?.languages.length) {
    langDefault.value = user?.user?.languages.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
    return
  }
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const controller = await IndexLangController.getInstance().getData(params)
  const response = controller.value

  if (response?.data?.length) {
    langDefault.value = response.data.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
  } else {
    langDefault.value = [
      { locale: 'en', icon: USA, title: '' },
      { locale: 'ar', icon: SA, title: '' },
    ]
  }
}

onMounted(fetchLang)

const updateData = () => {
  const translationsParams = new TranslationsParams()
  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })
  const params = !props.data?.id
    ? new AddTemplateItemParams(
        translationsParams,
        ImageChecked.value ? 1 : 0,
        ActionChecked.value ? 1 : 0,
        id,
        null,
      )
    : new EditTemplateItemParams(
        props.data.id ?? 0,
        translationsParams,
        ImageChecked.value ? 1 : 0,
        ActionChecked.value ? 1 : 0,
        props.data.id ?? 0,
      )

  emit('update:data', params)
}

const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data
  updateData()
}

// Watch for changes in props.data or langDefault to initialize form values
watch(
  [() => props.data, () => langDefault.value],
  ([newData, newDefault]) => {
    if (newDefault.length) {
      langs.value = newDefault.map((l) => {
        const existing = newData?.titles?.find((t) => t.locale === l.locale)
        return existing ? { ...l, title: existing.title } : { ...l }
      })
    }
    if (newData) {
      ImageChecked.value = newData.requiredImage ? true : false
      ActionChecked.value = newData.action == 1 ? true : false
    }
  },
  { immediate: true },
)

const ActionCheckbox = (data: number) => {
  // console.log(data , "data");
  ActionChecked.value = data
  updateData()
}
const ImageRequiredCheckbox = (data: number) => {
  // console.log(data , "data");
  ImageChecked.value = data
  updateData()
}
const IndustrySelctOption = ref<number>()

const selectedCity = ref()
const cities = ref([
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' },
])

const GetTemplateType = (data: ActionsEnum) => {
  console.log(data)
}
</script>

<template>
  <div class="w-full col-span-4">
    <PagesHeader
      :img="SmartContract"
      title="smart create for your inspection templet"
      subtitle="add your items one by one to the templet and you can see them"
    />
  </div>

  <div class="col-span-4 md:col-span-2">
    <div class="col-span-4 md:col-span-2">
      <LangTitleInput
        :label="$t('item_title')"
        :langs="langDefault"
        :modelValue="langs"
        @update:modelValue="setLangs"
        :placeholder="`add your title here..`"
      />
    </div>
    <div class="col-span-4 md:col-span-2 mt-[15px]">
      <TemplateTypesSection @update:data="GetTemplateType" />
      <component :is="DropDownType" />
    </div>
  </div>
  <div class="col-span-4 md:col-span-2">
    <div>View Container</div>
  </div>
</template>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
