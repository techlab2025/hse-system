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
// import FileUpload from '@/shared/FormInputs/FileUpload.vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
// import SwitchInput from '@/shared/FormInputs/SwitchInput.vue'
import type CatalogItemsDetailsModel from '../../Data/models/CatalogItemsDetailsModel'
import AddCatalogItemsDetailsParams from '../../Core/params/addCatalogItemsDetailsParams'
import editCatalogItemsDetailsParams from '../../Core/params/editCatalogItemsDetailsParams'
import IndexCatalogController from '@/features/setting/Catalog/Presentation/controllers/indexCatalogController'
import IndexCatalogParams from '@/features/setting/Catalog/Core/params/indexCatalogParams'
import { ParentTypeEnum } from '@/features/setting/CatalogItems/Core/enums/parenttypeenum'
// import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64.ts'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: CatalogItemsDetailsModel
}>()

// const route = useRoute()

// actual translations (values)
const langs = ref<{ locale: string; title: string }[]>([
  {
    locale: 'en',
    icon: USA,
    title: '',
  },
  {
    locale: 'ar',
    icon: SA,
    title: '',
  },
])

const allIndustries = ref<boolean>(false)
// const hasCertificate = ref<number>(0)
// const image = ref<string>('')

// industry
const industry = ref<TitleInterface[]>([])
const industryParams = new IndexIndustryParams('', 0, 10, 1)
const industryController = IndexIndustryController.getInstance()

// default available Teamss
const langDefault = ref<{ locale: string; icon?: string; title: string }[]>([])
const user = useUserStore()
const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  if (user?.user?.languages.length) {
    langDefault.value = user?.user?.languages.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
    return
  }
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const indexCatalogItemsDetailsController = await IndexLangController.getInstance().getData(params)

  const response = indexCatalogItemsDetailsController.value

  if (response?.data?.length) {
    // map backend Teamss into default structure
    langDefault.value = response.data.map((item: any) => ({
      locale: item.code,
      title: '', // empty initially
      // if you already have icons mapped, use TeamssMap
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
  } else {
    langDefault.value = [
      {
        locale: 'en',
        icon: USA,
        title: '',
      },
      {
        locale: 'ar',
        icon: SA,
        title: '',
      },
    ]
  }
}

onMounted(async () => {
  await fetchLang()
})

const updateData = () => {
  const translationsParams = new TranslationsParams()

  langs.value.forEach((lang) => {
    translationsParams.setTranslation('description', lang.locale, lang.title)
  })

  console.log(allIndustries.value, 'industry')
  const AllIndustry = user.user?.type == OrganizationTypeEnum?.ADMIN ? allIndustries.value : null

  const params = props.data?.id
    ? new editCatalogItemsDetailsParams(
        props.data?.id! ?? 0,
        translationsParams,
        AllIndustry,
        industry.value?.map((item) => item.id) ?? [],

        selectedCatalog.value?.id || route.params.parent_id,
      )
    : new AddCatalogItemsDetailsParams(
      {
        translation: translationsParams,
        allIndustries: AllIndustry,
        industries: industry.value?.map((item) => item.id) ?? [],
        order: 0,
        guidgate_category_id: selectedCatalog.value?.id || route.params.parent_id
      }
         
        // SerialNumber.value?.SerialNumber,
        // id,
      )

  // console.log(params, 'params')
  emit('update:data', params)
}

const setIndustry = (data: TitleInterface[]) => {
  // console.log(data, 'data')
  industry.value = data
  updateData()
}

// when child emits modelValue (updated translations)
const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data

  // console.log(langs.value, 'langs')
  updateData()
}


// init Teamss either from backend (edit mode) or from defaults (create mode)
watch(
  [() => props.data, () => langDefault.value],
  ([newData, newDefault]) => {
    if (newDefault.length) {
      if (newData?.titles?.length) {
        langs.value = newDefault.map((l) => {
          const existing = newData.titles.find((t) => t.locale === l.locale)
          return existing ? existing : { locale: l.locale, title: '' }
        })
      } else {
        langs.value = newDefault.map((l) => ({ locale: l.locale, title: '' }))
      }

      // langs.value = newData?.code
      // hasCertificate.value = newData?.hasCertificate
      allIndustries.value = newData?.allIndustries! ?? false
      industry.value = newData?.industries!
      selectedCatalog.value = newData?.guidecategory ? new TitleInterface({id: newData.guidecategory.id, title: newData.guidecategory.title}) : undefined 
    }
  },
  { immediate: true },
)

// const setImage = async (data: File) => {
//   image.value = await filesToBase64(data)
//   updateData()
// }

const UpdateSerial = (data) => {
  SerialNumber.value = data
  updateData()
}

const SerialNumber = ref()

const fields = ref([
  {
    key: 'SerialNumber',
    label: 'serial_number',
    placeholder: 'You can leave it (auto-generated)',
    value: SerialNumber.value,
    enabled: props?.data?.id ? false : true,
  },
])
const indexCatalogController = IndexCatalogController.getInstance()
  const indexCatalogParams = new IndexCatalogParams("" , 1 , 10 , 0, null, ParentTypeEnum.child)

  const selectedCatalog = ref<TitleInterface>()
  const setCatalog = (data: TitleInterface) => { 
    selectedCatalog.value = data
    updateData()
  }
  const route = useRoute()
</script>

<template>

       <div
    class="col-span-4 md:col-span-2"
    v-if="!allIndustries && user.user?.type == OrganizationTypeEnum.ADMIN && !route.params.parent_id"
  >
    <CustomSelectInput
      :modelValue="selectedCatalog"
      :controller="indexCatalogController"
      :params="indexCatalogParams"
      :label="$t('Catalog')"
      id="catalog" 
      :placeholder="$t('Select catalog')"
      @update:modelValue="setCatalog"
    />
  </div> 
  <div class="col-span-4 md:col-span-4">
    <LangTitleInput  type="textarea" :langs="langDefault" :modelValue="langs" @update:modelValue="setLangs" />
  </div>



</template>
