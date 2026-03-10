<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import EditWhereHouseTypeParams from '../../Core/params/editWhereHouseTypeParams'
import AddWhereHouseTypeParams from '../../Core/params/addWhereHouseTypeParams'
import type WhereHouseTypeDetailsModel from '../../Data/models/WhereHouseTypeDetailsModel'
import SwitchInput from '@/shared/FormInputs/SwitchInput.vue'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import CustomCheckbox from '@/shared/HelpersComponents/CustomCheckbox.vue'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import IndexIndustryParams from '@/features/setting/Industries/Core/Params/indexIndustryParams'
import type TitleInterface from '@/base/Data/Models/title_interface'
import IndexIndustryController from '@/features/setting/Industries/Presentation/controllers/indexIndustryController'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: WhereHouseTypeDetailsModel
}>()

const route = useRoute()
const id = route.params.parent_id

// ---------- State ----------
const langs = ref<
  {
    locale: string
    icon?: any
    title: string
  }[]
>([])

// default available langs from backend
const langDefault = ref<
  {
    locale: string
    icon?: any
    title: string
  }[]
>([])

const user = useUserStore()

// ---------- Fetch available languages ----------
const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  // console.log(user.user, 'user')
  if (user?.user?.languages.length) {
    langDefault.value = user?.user?.languages.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
    return
  }
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const indexWhereHouseTypeController = await IndexLangController.getInstance().getData(params)

  const response = indexWhereHouseTypeController.value

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

onMounted(async () => {
  await fetchLang()
})
const allIndustries = ref<boolean>(false)

// ---------- Emit update ----------
const updateData = () => {
  const translationsParams = new TranslationsParams()

  // titles
  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })
  const AllIndustry = user.user?.type == OrganizationTypeEnum?.ADMIN ? allIndustries.value : null
  console.log(translationsParams, 'langs')
  const params = props.data?.id
    ? new EditWhereHouseTypeParams(props.data.id, translationsParams, AllIndustry,
      industry.value?.map((item) => item.id) ?? [],)
    : new AddWhereHouseTypeParams(translationsParams,
      null, AllIndustry,
      industry.value?.map((item) => item.id) ?? [],)

  // console.log(params, 'params')


  emit('update:data', params)
}

// ---------- Watchers ----------
// Init from props (edit mode) or defaults (create mode)
watch(
  [() => props.data, () => langDefault.value],
  ([newData, newDefault]) => {
    if (newDefault.length) {
      // titles
      console.log(newData, 'newData')
      if (newData?.titles?.length) {
        langs.value = newDefault.map((l) => {
          const existing = newData.titles.find((t) => t.locale === l.locale)
          return existing ? existing : { locale: l.locale, title: '' }
        })
      } else {
        langs.value = newDefault.map((l) => ({ locale: l.locale, title: '' }))
      }
      allIndustries.value = newData?.allIndustries == 1 ? true : false
      industry.value = newData?.industries!
      updateData()
    }
  },
  { immediate: true },
)
watch(
  langs,
  () => {
    updateData()
  },
  { deep: true },
)

// const UpdateSerial = (data) => {
//   SerialNumber.value = data
//   updateData()
// }

// const SerialNumber = ref()

// const fields = ref([
//   {
//     key: 'SerialNumber',
//     label: 'serial_number',
//     placeholder: 'You can leave it (auto-generated)',
//     value: SerialNumber.value,
//     enabled: props?.data?.id ? false : true,
//   },
// ])

const industry = ref<TitleInterface[]>([])
const industryParams = new IndexIndustryParams('', 0, 10, 1)
const industryController = IndexIndustryController.getInstance()


const setIndustry = (data: TitleInterface[]) => {
  industry.value = data
  updateData()
}

const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data
  updateData()
}
const updateAllIndustries = (data) => {
  allIndustries.value = data
  updateData()
}
</script>

<template>
  <div class="col-span-4 md:col-span-2">
    <LangTitleInput :langs="langDefault" :modelValue="langs" @update:modelValue="(val) => (langs = val)" />
  </div>
  <div class="input-wrapper col-span-4 md:col-span-2" v-if="user.user?.type == OrganizationTypeEnum?.ADMIN">
    <CustomCheckbox :index="3" :title="`all_industries`" :checked="allIndustries"
      @update:checked="updateAllIndustries" />
  </div>
  <div class="col-span-4 md:col-span-2" v-if="!allIndustries && user.user?.type == OrganizationTypeEnum.ADMIN">
    <CustomSelectInput :modelValue="industry" :controller="industryController" :params="industryParams" label="industry"
      id="AccidentsType" placeholder="Select industry" :type="2" @update:modelValue="setIndustry" />
  </div>
  <!-- <div class="col-span-4 md:col-span-2" v-if="!data?.id">
    <SwitchInput
      :fields="fields"
      :switch_title="$t('auto')"
      :switch_reverse="true"
      :is-auto="true"
      @update:value="UpdateSerial"
    />
  </div> -->
</template>
