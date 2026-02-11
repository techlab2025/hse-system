<script lang="ts" setup>
import { markRaw, onMounted, ref, watch } from 'vue'
import USA from '@/shared/icons/USA.vue'
import SA from '@/shared/icons/SA.vue'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController.ts'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams.ts'
import { LangsMap } from '@/constant/langs.ts'
import EditOrganizatoinEmployeeParams from '../../Core/params/editOrganizatoinEmployeeParams'
import AddOrganizatoinEmployeeParams from '../../Core/params/addOrganizatoinEmployeeParams'
import type OrganizatoinEmployeeDetailsModel from '../../Data/models/OrganizatoinEmployeeDetailsModel'
import { useUserStore } from '@/stores/user'
import { useToast } from 'primevue/usetoast'
import IndexHerikalyController from '@/features/Organization/Herikaly/Presentation/controllers/indexHerikalyController'
import IndexHerikalyParams from '@/features/Organization/Herikaly/Core/params/indexHerikalyParams'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import IndexCertificateController from '@/features/setting/Certificate/Presentation/controllers/indexCertificateController'
import IndexCertificateParams from '@/features/setting/Certificate/Core/params/indexCertificateParams'
import HirarachyEmployeeParams from '../../Core/params/HirarchyParams'
import IndexRoleController from '@/features/Organization/Role/Presentation/controllers/indexRoleController'
import IndexRoleParams from '@/features/Organization/Role/Core/params/indexRoleParams'
import RolesOrganizationEmployeeParams from '../../Core/params/RolesOrganizationEmployeeParams'
import SwitchInput from '@/shared/FormInputs/SwitchInput.vue'
import { EmployeeStatusEnum } from '../../Core/Enum/EmployeeStatus'
import CustomCheckbox from '@/shared/HelpersComponents/CustomCheckbox.vue'

const toast = useToast()

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: OrganizatoinEmployeeDetailsModel
}>()
const Name = ref(props.data?.name)
const Phone = ref(props.data?.phone)
const Email = ref(props.data?.email)
const Password = ref('')
const ConfirmPassword = ref<string>()
const SerialNumber = ref()

const indexHerikalyController = IndexHerikalyController.getInstance()
const HerikalyParams = new IndexHerikalyParams('', 1, 10, 1, false)

const indexCertificateController = IndexCertificateController.getInstance()
const deleteCertificateParams = new IndexCertificateParams('', 0, 0, 0)

const indexRoleController = IndexRoleController.getInstance()
const indexRoleParams = new IndexRoleParams('', 0, 0, 0)

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
const Heirarchy = ref<TitleInterface>()
const role = ref<TitleInterface[]>()
const EmployeeStatus = ref()
const updaetAdminStatus = (status) => {
  EmployeeStatus.value = status == 0 ? EmployeeStatusEnum.Employee : EmployeeStatusEnum.Admin
  updateData()
}
const updateData = () => {
  const HeirarchyIds = new HirarachyEmployeeParams(Heirarchy?.value?.id)
  const RoleIds = role.value?.map((item) => new RolesOrganizationEmployeeParams(item.id))
  const params = props.data?.id
    ? new EditOrganizatoinEmployeeParams(
      props?.data?.id,
      Name.value,
      Phone.value,
      Email.value,
      Password.value,
      ConfirmPassword.value,
      [HeirarchyIds],
      RoleIds,
      EmployeeStatus.value || EmployeeStatusEnum.Employee


      // Certificates.value.map((item) => item.id)
    )
    : new AddOrganizatoinEmployeeParams(
      Name.value,
      Phone.value,
      Email.value,
      Password.value,
      ConfirmPassword.value,
      [HeirarchyIds],
      RoleIds,
      EmployeeStatus.value || EmployeeStatusEnum.Employee,
      SerialNumber.value?.SerialNumber,

      // Certificates.value.map((item) => item.id)
    )
  // console.log(params, "params");
  emit('update:data', params)
}

watch(
  [() => props.data],
  ([newData]) => {
    if (newData) {
      Name.value = newData.name
      Phone.value = newData.phone
      Email.value = newData.email
      Heirarchy.value = newData.hierarchy[0]
      role.value = newData.roles.map((el) => {
        return new TitleInterface({ id: el.id, title: el.title })
      })
      EmployeeStatus.value = newData.emplyeeStatus == EmployeeStatusEnum.Admin ? true : false
      updateData()
    }
  },
  { immediate: true },
)

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

const setHeirarchy = (data: TitleInterface) => {
  Heirarchy.value = data
  updateData()
}

const setRole = (data: TitleInterface[]) => {
  role.value = data
  updateData()
}

const UpdateConfirmPassword = (data) => {
  ConfirmPassword.value = data.target.value
  updateData()
}

const fields = ref([
  {
    key: 'SerialNumber',
    label: 'serial_number',
    placeholder: 'You can leave it (auto-generated)',
    value: SerialNumber.value,
    enabled: props?.data?.id ? false : true,
  },
])
const UpdateSerial = (data) => {
  SerialNumber.value = data
  updateData()
}

</script>

<template>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="name">{{ $t('name') }}</label>
    <input id="name" type="text" v-model="Name" @input="UpdateName" :placeholder="$t('enter your name')" />
  </div>
  <div class="col-span-4 md:col-span-2" v-if="!data?.id">
    <SwitchInput :fields="fields" :switch_title="$t('auto')" :isAuto="true" :switch_reverse="true"
      @update:value="UpdateSerial" />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="phone">{{ $t('Phone') }}</label>
    <input id="phone" type="tel" v-model="Phone" @input="UpdatePhone" :placeholder="$t('enter your phone')" />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="email">{{ $t('Email') }}</label>
    <input id="email" type="email" v-model="Email" @input="UpdateEmail" :placeholder="$t('enter your email')" />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="password">{{ $t('Password') }}</label>
    <input id="password" type="text" min="8" v-model="Password" @input="UpdatePassword"
      :placeholder="$t('enter your password')" />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="password_confirmation">{{ $t('confirm_password') }}</label>
    <input id="password_confirmation" type="text" min="8" v-model="ConfirmPassword" @input="UpdateConfirmPassword"
      :placeholder="$t('enter your confirm password')" />
  </div>
  <!-- :type="2" -->
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <CustomSelectInput :modelValue="Heirarchy" @update:modelValue="setHeirarchy" :controller="indexHerikalyController"
      :params="HerikalyParams" :label="$t('Job Description')" :placeholder="$t('Select Heirarchy')" />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <CustomSelectInput :modelValue="role" @update:modelValue="setRole" :controller="indexRoleController"
      :params="indexRoleParams" :label="$t('permissions')" :type="2" :placeholder="$t('Select Role')" />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <CustomCheckbox :index="2" :title="$t('isAdmin')" :label="$t('admin_status')" :checked="EmployeeStatus"
      @update:checked="updaetAdminStatus" />
  </div>
  <!-- <div class="col-span-4 md:col-span-2 input-wrapper">
    <CustomSelectInput :modelValue="Certificates" @update:modelValue="setCertificates"
      :controller="indexCertificateController" :type="2" :params="deleteCertificateParams" :label="$t('Certificates')"
      :placeholder="$t('Select Certificates')" />
  </div> -->
</template>
