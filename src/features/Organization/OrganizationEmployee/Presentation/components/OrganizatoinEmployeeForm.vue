<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'

// import { OrganizatoinEmployeesMap } from '@/constant/OrganizatoinEmployees'
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
import EditOrganizatoinEmployeeParams from '../../Core/params/editOrganizatoinEmployeeParams'
import AddOrganizatoinEmployeeParams from '../../Core/params/addOrganizatoinEmployeeParams'
import type OrganizatoinEmployeeDetailsModel from '../../Data/models/OrganizatoinEmployeeDetailsModel'
// import FileUpload from '@/shared/FormInputs/FileUpload.vue'
// import { useRoute } from 'vue-router'
// import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64.ts'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: OrganizatoinEmployeeDetailsModel
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

const langDefault = ref<{ locale: string; icon?: string; title: string }[]>([])

const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const indexOrganizatoinEmployeeController =
    await IndexLangController.getInstance().getData(params)

  const response = indexOrganizatoinEmployeeController.value

  if (response?.data?.length) {
    // map backend OrganizatoinEmployees into default structure
    langDefault.value = response.data.map((item: any) => ({
      locale: item.code,
      title: '', // empty initially
      // if you already have icons mapped, use OrganizatoinEmployeesMap
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
  const params = props.data?.id
    ? new EditOrganizatoinEmployeeParams(
        props?.data?.id,
        Name.value,
        Phone.value,
        Email.value,
        Password.value,
      )
    : new AddOrganizatoinEmployeeParams(Name.value, Phone.value, Email.value, Password.value)

  emit('update:data', params)
}

watch(
  [() => props.data],
  ([newData]) => {
    if (newData) {
      Name.value = newData.name
      Phone.value = newData.phone
      Email.value = newData.email
      // Password.value = newData.
    }
  },
  { immediate: true },
)

const Name = ref('')
const Phone = ref('')
const Email = ref('')
const Password = ref('')

const UpdateName = (data) => {
  Name.value = data.target.value
  updateData()
}
const UpdatePhone = (data) => {
  Phone.value = data.target.value
  updateData()
}
const UpdateEmail = (data) => {
  Email.value = data.target.value
  updateData()
}
const UpdatePassword = (data) => {
  Password.value = data.target.value
  updateData()
}
</script>

<template>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="name">{{ $t('name') }}</label>
    <input id="name" type="text" v-model="Name" @change="UpdateName" />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="phone">{{ $t('Phone') }}</label>
    <input id="phone" type="tel" v-model="Phone" @change="UpdatePhone" />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="email">{{ $t('Email') }}</label>
    <input id="email" type="email" v-model="Email" @change="UpdateEmail" />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="password">{{ $t('Password') }}</label>
    <input id="password" type="text" v-model="Password" @change="UpdatePassword" />
  </div>
</template>
