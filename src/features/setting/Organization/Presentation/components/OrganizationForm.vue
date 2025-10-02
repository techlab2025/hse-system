<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import { LangsMap } from '@/constant/langs.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController'
import EditOrganizationParams from '../../Core/params/editOrganizationParams'
import AddOrganizationParams from '../../Core/params/addOrganizationParams'
import SingleFileUpload from '@/shared/HelpersComponents/SingleFileUpload.vue'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
import type OrganizationDetailsModel from '../../Data/models/OrganizationDetailsModel'
import IndexIndustryParams from '@/features/setting/Industries/Core/Params/indexIndustryParams'
import IndexIndustryController from '@/features/setting/Industries/Presentation/controllers/indexIndustryController'
import { useRoute } from 'vue-router'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: OrganizationDetailsModel
}>()

// Translations (title per locale)
const langs = ref<{ locale: string; title: string }[]>([
  { locale: 'en', icon: USA, title: '' },
  { locale: 'ar', icon: SA, title: '' },
])

const allIndustries = ref<boolean>(false)
const industry = ref<TitleInterface>()
const industryParams = new IndexIndustryParams('', 0, 10, 1)
const industryController = IndexIndustryController.getInstance()

const indexLangParams = new IndexLangParams('', 0, 10, 1)
const indexLangController = IndexLangController.getInstance()
// Default available langs from API
const langDefault = ref<{ locale: string; icon?: string; title: string }[]>([])

const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const indexLangController = await IndexLangController.getInstance().getData(params)

  const response = indexLangController.value
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

// ----------------------------
// FORM STATE
// ----------------------------
const name = ref(props.data?.name ?? '')
const email = ref(props.data?.email ?? '')
const Url = ref(props.data?.url ?? '')
const Phone = ref(props.data?.phone ?? '')
const image = ref<string>('')
const lang = ref<TitleInterface[] | null>([]) // selected language

// ----------------------------
// HELPERS
// ----------------------------

const route = useRoute()
const updateData = () => {
  const translationsParams = new TranslationsParams()
  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })

  const params = props.data?.id
    ? new EditOrganizationParams(
        +route.params.id,
        name.value,
        Phone.value,
        email.value,
        image.value ? (image.value as any).file : '',
        Url.value,
        industry.value?.id,
        lang.value?.map((l) => l.id), // selected language id
      )
    : new AddOrganizationParams(
        name.value,
        Phone.value,
        email.value,
        image.value?.file,
        Url.value,
        industry.value?.id,
        lang.value?.map((l) => l.id),
      )

  emit('update:data', params)
}

const setIndustry = (data: TitleInterface) => {
  industry.value = data
  updateData()
}

const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data
  updateData()
}

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

      console.log(newData, 'newData')
      Url.value = newData?.website_link
      allIndustries.value = newData?.allIndustries!
      industry.value = newData?.industry
      lang.value = newData?.languages
      image.value = newData?.image
    }
  },
  { immediate: true },
)

const setImage = async (data: File) => {
  image.value = await filesToBase64(data)
  updateData()
}

const getLangTitleList = (): TitleInterface[] => {
  return Object.values(LangsMap).map((lang, index) => {
    return new TitleInterface({
      id: index + 1,
      title: lang.name,
      subtitle: lang.code,
    })
  })
}
const langsList = getLangTitleList()

const setLang = (data: TitleInterface[]) => {
  lang.value = data
  updateData()
}
</script>

<template>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="name">Name</label>
    <input
      type="text"
      @change="updateData"
      id="name"
      v-model="name"
      class="input"
      placeholder="Enter Your Name"
    />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="email">Email</label>
    <input
      type="email"
      id="email"
      @change="updateData"
      v-model="email"
      class="input"
      placeholder="Enter Your Email"
    />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="Phone">Phone</label>
    <input
      type="phone"
      id="Phone"
      @change="updateData"
      v-model="Phone"
      class="input"
      placeholder="Enter Your Phone"
    />
  </div>

  <div class="col-span-4 md:col-span-2" v-if="!allIndustries">
    <CustomSelectInput
      :modelValue="industry"
      :controller="industryController"
      :params="industryParams"
      label="Industry"
      id="Organization"
      placeholder="Select industry"
      @update:modelValue="setIndustry"
    />
  </div>

  <!-- Language select -->
  <div class="col-span-4 md:col-span-2">
    <CustomSelectInput
      :modelValue="lang"
      :controller="indexLangController"
      :params="indexLangParams"
      label="Language"
      id="lang"
      :type="2"
      placeholder="Select Language"
      @update:modelValue="setLang"
      :required="true"
    />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="Url">Url</label>
    <input
      type="url"
      id="Url"
      v-model="Url"
      @change="updateData"
      class="input"
      placeholder="Enter Your Url"
    />
  </div>

  <div class="col-span-4 md:col-span-4 input-wrapper">
    <SingleFileUpload
      v-model="image"
      @update:modelValue="setImage"
      label="Image"
      id="image"
      placeholder="Select image"
    />
  </div>
</template>
