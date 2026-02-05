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
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import CustomCheckbox from '@/shared/HelpersComponents/CustomCheckbox.vue'
import type ProjectTypeDetailsModel from '@/features/setting/ProjectType/Data/models/projectTypeDetailsModel'
import AddRootCausesParams from '../../Core/params/addTicketParams'
import EditRootCausesParams from '../../Core/params/editTicketParams'
import type TicketDetailsModel from '../../Data/models/TicketDetailsModel'
import EditTicketParams from '../../Core/params/editTicketParams'
import IndexTicketTypeController from '@/features/Organization/TicketType/Presentation/controllers/indexTicketTypeController'
import IndexTicketTypeParams from '@/features/Organization/TicketType/Core/params/indexTicketTypeParams'
import MultiImagesInput from '@/shared/FormInputs/MultiImagesInput.vue'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
import AddTicketParams from '../../Core/params/addTicketParams'
import IndexOrganizationController from '@/features/setting/Organization/Presentation/controllers/indexOrganizationController'
import IndexOrganizationParams from '@/features/setting/Organization/Core/params/indexOrganizationParams'

const emit = defineEmits(['update:data', 'close:data'])

const props = defineProps<{
  data?: TicketDetailsModel
}>()

const route = useRoute()

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

const langsDescription = ref<
  {
    locale: string
    icon?: any
    description: string
  }[]
>([])

const allIndustries = ref<number>(0)

// industry
const industry = ref<TitleInterface>()
const industryParams = new IndexIndustryParams('', 0, 10, 1)
const industryController = IndexIndustryController.getInstance()

// default available EquipmentTypes
const langDefault = ref<{ locale: string; icon?: string; title: string }[]>([])
const langDefaultDescription = ref<
  {
    locale: string
    icon?: any
    title: string
  }[]
>([])
const user = useUserStore()
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

    langDefaultDescription.value = user?.user?.languages.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
    return
  }
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const indexOrganizationLocationController =
    await IndexLangController.getInstance().getData(params)

  const response = indexOrganizationLocationController.value

  if (response?.data?.length) {
    langDefault.value = response.data.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
    langDefaultDescription.value = response.data.map((item: any) => ({
      locale: item.code,
      description: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
  } else {
    langDefault.value = [
      { locale: 'en', icon: USA, title: '' },
      { locale: 'ar', icon: SA, title: '' },
    ]
    langDefaultDescription.value = [
      { locale: 'en', icon: USA, title: '' },
      { locale: 'ar', icon: SA, title: '' },
    ]
  }
}

const title = ref<string>('')
const description = ref<string>('')
onMounted(async () => {
  await fetchLang()
})

const updateData = () => {
  const translationsParams = new TranslationsParams()

  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })

  const AllIndustry = user.user?.type == OrganizationTypeEnum?.ADMIN ? allIndustries.value : null

  const params = props.data?.id
    ? new EditTicketParams(
      props.data?.id! ?? 0,
      translationsParams,
      user.user?.type == OrganizationTypeEnum?.ADMIN ? AllIndustry : null,
      title.value,
      SelectedTicketType.value?.id,
      images.value,
    )
    : new AddTicketParams(
      images.value.map((el) => el.file),
      SelectedTicketType.value?.id,
      title.value,
      description.value,
      SelectedOrganization?.value?.id
    )
  console.log(params, 'params')
  emit('update:data', params)
}

const setIndustry = (data: TitleInterface) => {
  industry.value = data
  updateData()
}

// when child emits modelValue (updated translations)
const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data

  // console.log(langs.value, 'langs')
  updateData()
}

// init EquipmentTypes either from backend (edit mode) or from defaults (create mode)
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
    }
  },
  { immediate: true },
)

const SelectedTicketType = ref<TitleInterface>()
const indexTicketTypeController = IndexTicketTypeController.getInstance()
const ticketTypeParams = new IndexTicketTypeParams('', 0, 10, 0)

const setTicketType = (data: TitleInterface) => {
  SelectedTicketType.value = data
  // console.log(SelectedTicketType.value, 'SelectedTicketType.value')
  updateData()
}

const images = ref<string[]>([])
const setImages = async (data: File[]) => {
  images.value = await filesToBase64(data)
  updateData()
}

const indexOrganizationController = IndexOrganizationController.getInstance()
const organizationParams = new IndexOrganizationParams('', 0, 10, 0)
const SelectedOrganization = ref<TitleInterface>()

const setOrganization = (data: TitleInterface) => {
  SelectedOrganization.value = data
  updateData()
}

</script>

<template>
  <div class="col-span-4 md:col-span-4">
    <CustomSelectInput :modelValue="SelectedTicketType" :controller="indexTicketTypeController"
      :params="ticketTypeParams" label="Select Ticket Type" id="ticket" placeholder="Select ticket type"
      @update:modelValue="setTicketType" />
  </div>

  <div class="input-wrapper col-span-4 md:col-span-4">
    <label for="title">Title</label>
    <input type="text" id="title" v-model="title" @input="updateData" :placeholder="`${$t('enter_title')}`" />
  </div>

  <div class="input-wrapper col-span-4 md:col-span-4">
    <label for="description">description</label>
    <textarea id="description" v-model="description" @input="updateData" :placeholder="`${$t('enter_description')}`" />
  </div>

  <div class="input-wrapper col-span-4 md:col-span-4" v-if="user.user?.type == OrganizationTypeEnum?.ADMIN">
    <CustomSelectInput :modelValue="SelectedOrganization" :controller="indexOrganizationController"
      :params="organizationParams" label="Select Organization" id="organization" placeholder="Select organization"
      @update:modelValue="setOrganization" />
  </div>

  <div class="col-span-4 md:col-span-4">
    <MultiImagesInput :initialImages="images" @update:images="setImages" />
  </div>
</template>
