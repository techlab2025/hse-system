<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
// import TitleInterface from '@/base/Data/Models/title_in
// terface'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params.ts'
// import DatePicker from 'primevue/datepicker'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'
// import IndexIndustryParams from '@/features/setting/Industries/Core/Params/indexIndustryParams.ts'
// import IndexIndustryController from '@/features/setting/Industries/Presentation/controllers/indexIndustryController.ts'
// import FileUpload from '@/shared/FormInputs/FileUpload.vue'
// import { useRoute } from 'vue-router'

import { useUserStore } from '@/stores/user'
import { useRoute } from 'vue-router'
import EditProjectZoneParams from '../../Core/params/editProjectZoneParams'
import AddProjectZoneParams from '../../Core/params/addProjectZoneParams'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import type TitleInterface from '@/base/Data/Models/title_interface'
import IndexProjectController from '@/features/Organization/Project/Presentation/controllers/indexProjectController'
import IndexProjectParams from '@/features/Organization/Project/Core/params/indexProjectParams'
import IndexOrganizationLocationParams from '@/features/Organization/OrganizationLocation/Core/params/indexOrganizationLocationParams'
import IndexOrganizationLocationController from '@/features/Organization/OrganizationLocation/Presentation/controllers/indexOrganizationLocationController'
import type ProjectZoneDetailsModel from '../../Data/models/ProjectZoneDetailsModel'

// import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64.ts'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: ProjectZoneDetailsModel
}>()

const OrganizationProjectController = IndexProjectController.getInstance()
const OrganizationProjectParams = new IndexProjectParams('', 0, 0, 0)

const OrganizationLocationController = IndexOrganizationLocationController.getInstance()
const OrganizationLocationParams = new IndexOrganizationLocationParams('', 0, 0, 0)

const route = useRoute()
// const route = useRoute()
const ParentId = route.params.parent_id

// actual translations (values)
const langs = ref<{ locale: string; title: string }[]>([])

const langsSub = ref<{ locale: string; title: string }[]>([])
// const langsDescription = ref<{ locale: string; title: string }[]>([])

// const allIndustries = ref<boolean>(false)
// const hasCertificate = ref<number>(0)
const image = ref<string>('')

// default available ProjectZones
const langDefault = ref<{ locale: string; icon?: string; title: string }[]>([])

const user = useUserStore()

const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  console.log(user.user, 'user')
  if (user?.user?.languages.length) {
    langDefault.value = user?.user?.languages.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
    return
  }
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const indexPartnerController = await IndexLangController.getInstance().getData(params)

  const response = indexPartnerController.value

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

const updateData = () => {
  const translationsParams = new TranslationsParams()

  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })

  const params = props.data?.id
    ? new EditProjectZoneParams(
        props?.data?.id,
        translationsParams,
        SelectedProject.value?.id,
        Lat.value,
        Long.value,
        SelectedLocation.value?.id,
      )
    : new AddProjectZoneParams(
        translationsParams,
        SelectedProject.value?.id,
        Lat.value,
        Long.value,
        SelectedLocation.value?.id,
      )

  // console.log(params, 'params')
  emit('update:data', params)
}

// when child emits modelValue (updated translations)
const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data
  updateData()
}

const Lat = ref('')
const Long = ref('')
const SelectedProject = ref<TitleInterface>()
const SelectedLocation = ref<TitleInterface>()

const setProject = (data: TitleInterface) => {
  SelectedProject.value = data
  updateData()
}

const setLocation = (data: TitleInterface) => {
  SelectedLocation.value = data
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
    }
    Lat.value = newData?.lat || ''
    Long.value = newData?.lng || ''

    SelectedLocation.value = newData?.organizationLocation
    SelectedProject.value = newData?.project
  },
  { immediate: true },
)
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
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="lat">Lat</label>
    <input type="number" id="lat" v-model="Lat" class="input" step="any" @change="updateData" />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="long">long</label>
    <input type="number" id="long" v-model="Long" class="input" step="any" @change="updateData" />
  </div>
  <div class="col-span-4 md:col-span-2">
    <!--    :controller="industryController"
      :params="industryParams" -->
    <CustomSelectInput
      :controller="OrganizationProjectController"
      :params="OrganizationProjectParams"
      :modelValue="SelectedProject"
      label="Project"
      id="project"
      placeholder="Select Project"
      @update:modelValue="setProject"
    />
  </div>
  <div class="col-span-4 md:col-span-2">
    <!--    :controller="industryController"
      :params="industryParams" -->
    <CustomSelectInput
      :controller="OrganizationLocationController"
      :params="OrganizationLocationParams"
      :modelValue="SelectedLocation"
      label="Location"
      id="Location"
      placeholder="Select Location"
      @update:modelValue="setLocation"
    />
  </div>
</template>
