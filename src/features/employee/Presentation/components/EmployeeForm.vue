<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import TranslationsParams from '@/base/core/params/translations_params'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams'
import { LangsMap } from '@/constant/langs'
import IndexIndustryParams from '@/features/setting/Industries/Core/Params/indexIndustryParams'
import IndexIndustryController from '@/features/setting/Industries/Presentation/controllers/indexIndustryController'
import { useRoute } from 'vue-router'
// import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
import IndexEmployeeTypeController from '@/features/setting/EmployeeType/Presentation/controllers/indexEmployeeTypeController'
import IndexEmployeeTypeParams from '@/features/setting/EmployeeType/Core/params/indexEmployeeTypeParams'
import AddEmployeeParams from '../../Core/params/addEmployeeParams'
import EditEmployeeParams from '../../Core/params/editEmployeeParams'
import type EmployeeModel from '../../Data/models/equipmentModel'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'

const emit = defineEmits(['update:data'])
const props = defineProps<{ data?: EmployeeModel }>()

const route = useRoute()
const id = Number(route.params.id)

const indexEmployeeTypeController = IndexEmployeeTypeController.getInstance()
const indexEmployeeTypeParams = new IndexEmployeeTypeParams('', 1, 10, 1)
const industryController = IndexIndustryController.getInstance()
const industryParams = new IndexIndustryParams('', 0, 10, 1)

const langs = ref<{ locale: string; icon?: any; title: string }[]>([])
const langDefault = ref<{ locale: string; icon?: any; title: string }[]>([])
const industry = ref<TitleInterface[]>([])
const Employee = ref<TitleInterface | null>(null)
const allIndustries = ref(0)
const hasCertificate = ref(0)

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

  const AllIndustry = user.user?.type == OrganizationTypeEnum?.ADMIN ? allIndustries.value : null

  const params = !props.data?.id
    ? new AddEmployeeParams(
        translationsParams,
        hasCertificate.value,
        AllIndustry,
        industry.value.map((i) => i.id),
        id,
        Employee.value?.id!,
      )
    : new EditEmployeeParams(
        props.data.id ?? 0,
        translationsParams,
        hasCertificate.value,
        AllIndustry,
        industry.value.map((i) => i.id),
        props.data.id ?? 0,
        Employee.value?.id!,
      )

  emit('update:data', params)
}

const setIndustry = (data: TitleInterface[]) => {
  industry.value = data
  updateData()
}

const setLangs = (data: { locale: string; title: string }[]) => {
  langs.value = data
  updateData()
}

const setEmployeeType = (data: TitleInterface) => {
  Employee.value = data
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
      industry.value = newData?.industries ?? []
      Employee.value = newData?.equipmentTypeId
      allIndustries.value = newData?.allIndustries == 1
      
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="col-span-4 md:col-span-4">
    <LangTitleInput :langs="langDefault" :modelValue="langs" @update:modelValue="setLangs" />
  </div>
  <!-- <div class="col-span-4 md:col-span-2 input-wrapper check-box">
    <label>{{ $t('has_certificate') }}</label>
    <input type="checkbox" :value="1" v-model="hasCertificate" />
  </div> -->

  <div
    class="col-span-4 md:col-span-4 input-wrapper check-box"
    v-if="user.user?.type == OrganizationTypeEnum?.ADMIN"
  >
    <label>{{ $t('all_industries') }}</label>
    <input type="checkbox" :value="1" v-model="allIndustries" />
  </div>
  <div
    class="col-span-4 md:col-span-2"
    v-if="!allIndustries && user.user?.type == OrganizationTypeEnum?.ADMIN"
  >
    <CustomSelectInput
      :modelValue="industry"
      :controller="industryController"
      :params="industryParams"
      label="Industry"
      id="EmployeeType"
      placeholder="Select industry"
      :type="2"
      @update:modelValue="setIndustry"
    />
  </div>
  <div class="col-span-4 md:col-span-2">
    <CustomSelectInput
      :modelValue="Employee"
      :controller="indexEmployeeTypeController"
      :params="indexEmployeeTypeParams"
      label="EmployeeType"
      id="EmployeeType"
      placeholder="Select EmployeeType"
      @update:modelValue="setEmployeeType"
    />
  </div>
  <!-- <div class="col-span-4 md:col-span-4">
    <FileUpload
      :modelValue="image"
      @update:fileData="setImage"
      label="Image"
      id="image"
      placeholder="Select image"
      :type="file"
      :multiable="false"
    />
  </div> -->
</template>
