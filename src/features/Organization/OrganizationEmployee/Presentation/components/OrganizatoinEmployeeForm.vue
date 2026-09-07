<script lang="ts" setup>
import { computed, markRaw, nextTick, onMounted, ref, watch } from 'vue'
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
import { EmployeeStatusEnum } from '../../Core/Enum/EmployeeStatus'
import CustomCheckbox from '@/shared/HelpersComponents/CustomCheckbox.vue'
import { useProjectAppStatusStore } from '@/stores/ProjectStatus'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import AddRole from '@/features/Organization/Role/Presentation/components/AddRole.vue'
import AddHerikaly from '@/features/Organization/Herikaly/Presentation/components/AddHerikaly.vue'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import FieldHelpIcon from '@/shared/FormInputs/FieldHelpIcon.vue'
import PhoneCountryCode from '@/shared/HelpersComponents/PhoneCountryCode.vue'
import type RoleModel from '@/features/Organization/Role/Data/models/RoleModel'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'

const toast = useToast()

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: OrganizatoinEmployeeDetailsModel
  heirarchyId?: number
}>()
const Name = ref(props.data?.name)
const Phone = ref(props.data?.phone)
const CountryCode = ref(props.data?.countryCode ?? '')
const Email = ref(props.data?.email)
const Password = ref('')
const ConfirmPassword = ref<string>()
const SerialNumber = ref()
const AllPermissions = ref<boolean | null>(false)

const indexHerikalyController = IndexHerikalyController.getInstance()
const HerikalyParams = new IndexHerikalyParams('', 1, 10, 0, false, null)

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
const dashAccessStatus = ref()
const booleanEmpStatus = ref(true)
const booleandashAccessStatus = ref(true)
const updaetAdminStatus = (status: number) => {
  booleanEmpStatus.value = status == EmployeeStatusEnum.Admin ? true : false
  if (status) {
    EmployeeStatus.value = EmployeeStatusEnum.Admin
  } else {
    EmployeeStatus.value = EmployeeStatusEnum.Employee
  }
  updateData()
}
const updaetdashAccessStatus = (status: number) => {
  booleandashAccessStatus.value = status == EmployeeStatusEnum.Admin ? true : false
  updateData()
}
const updateData = () => {
  const hierarchyId = props.heirarchyId ?? Heirarchy.value?.id
  const HeirarchyIds = new HirarachyEmployeeParams(hierarchyId as number)
  const RoleIds = role.value?.map((item) => new RolesOrganizationEmployeeParams(item.id))
  console.log(booleandashAccessStatus.value, 'booleandashAccessStatus')
  const params = props.data?.id
    ? new EditOrganizatoinEmployeeParams(
        props?.data?.id,
        Name.value,
        Phone.value,
        CountryCode.value,
        Email.value,
        Password.value,
        ConfirmPassword.value,
        [HeirarchyIds],
        RoleIds,
        booleanEmpStatus.value ? EmployeeStatusEnum.Admin : EmployeeStatusEnum.Employee,
        booleandashAccessStatus.value,
        AllPermissions.value,

        // Certificates.value.map((item) => item.id)
      )
    : new AddOrganizatoinEmployeeParams(
        Name.value,
        Phone.value,
        CountryCode.value,
        Email.value,
        Password.value,
        ConfirmPassword.value,
        [HeirarchyIds],
        RoleIds,
        booleanEmpStatus.value ? EmployeeStatusEnum.Admin : EmployeeStatusEnum.Employee,
        SerialNumber.value,
        booleandashAccessStatus.value,
        AllPermissions.value,

        // Certificates.value.map((item) => item.id)
      )
  // console.log(params, "params");
  emit('update:data', params)
}

watch(
  () => props.data,
  (newData) => {
    if (newData) {
      Name.value = newData.name
      Phone.value = newData.phone
      CountryCode.value = newData.countryCode ?? ''
      Email.value = newData.email
      Heirarchy.value = new TitleInterface({
        id: newData?.hierarchy?.[0]?.id,
        title: newData?.hierarchy?.[0]?.title,
      })
      role.value = newData.roles.map((el) => {
        return new TitleInterface({ id: el.id, title: el.title })
      })
      EmployeeStatus.value = newData.emplyeeStatus == EmployeeStatusEnum.Employee ? true : false
      booleanEmpStatus.value = newData.emplyeeStatus == EmployeeStatusEnum.Admin ? true : false
      booleandashAccessStatus.value = newData.canAccessDashboard
      AllPermissions.value = newData.allPermissions
      updateData()
      console.log(Heirarchy.value, 'test')
    }
  },
  { immediate: true, deep: true },
)

const UpdateName = (data) => {
  Name.value = data.target.value
  updateData()
}
const UpdatePhone = (data) => {
  Phone.value = data.target.value
  updateData()
}
const updateCountryCode = (value: string) => {
  CountryCode.value = value
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

watch(
  () => props.heirarchyId,
  () => updateData(),
)

const setRole = (data: TitleInterface[]) => {
  role.value = data
  updateData()
}

const permissionNameByCode = Object.entries(PermissionsEnum).reduce<Map<string, string>>(
  (permissionMap, [name, code]) => {
    if (!permissionMap.has(code)) permissionMap.set(code, name)
    return permissionMap
  },
  new Map(),
)

const getRolePermissionsHint = (roleOption: RoleModel) => {
  if (!roleOption.permissions?.length) return 'No permissions are assigned to this role.'

  const permissionNames = roleOption.permissions.map((permission) => {
    const code = permission.displayName || permission.permission || permission.name
    return permissionNameByCode.get(code) ?? code
  })

  return `Permissions: ${permissionNames.join(', ')}`
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
const projtecStateus = useProjectAppStatusStore()

const UpdateSerial = (data) => {
  SerialNumber.value = data.target.value
  updateData()
}
const RoleDialog = ref(false)

const updaetAllPermissions = (status: number) => {
  AllPermissions.value = status == 1 ? true : false
  updateData()
}
const PositionDialog = ref(false)

type RequiredFieldRule = {
  key: string
  message: string
  isMissing: () => boolean
}

const requiredFieldErrors = ref<Record<string, string>>({})
const hasValue = (value: unknown) =>
  value !== null && value !== undefined && String(value).trim().length > 0

const requiredFields = computed<RequiredFieldRule[]>(() => [
  {
    key: 'Name',
    message: 'Name Is Required',
    isMissing: () => !hasValue(Name.value),
  },
  {
    key: 'Phone',
    message: 'Phone Is Required',
    isMissing: () => !hasValue(Phone.value),
  },
  {
    key: 'Email',
    message: 'Email Is Required',
    isMissing: () => !hasValue(Email.value),
  },
  // {
  //   key: 'Password',
  //   message: 'Password Is Required',
  //   isMissing: () => !props.data?.id && booleandashAccessStatus.value && !hasValue(Password.value),
  // },
  // {
  //   key: 'Heirarchy',
  //   message: 'Position Is Required',
  //   isMissing: () => !Heirarchy.value?.id,
  // },
  // {
  //   key: 'role',
  //   message: 'Permission Is Required',
  //   isMissing: () => !AllPermissions.value && !role.value?.length,
  // },
])

const getFieldError = (key: string) => requiredFieldErrors.value[key] ?? ''

const scrollToRequiredField = async (key: string) => {
  await nextTick()
  document.querySelector<HTMLElement>(`[data-required-field="${key}"]`)?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}

const validateRequiredFields = async () => {
  const missedFields = requiredFields.value.filter((field) => field.isMissing())
  requiredFieldErrors.value = missedFields.reduce<Record<string, string>>((errors, field) => {
    errors[field.key] = field.message
    return errors
  }, {})

  if (!missedFields.length) return true

  new OpenWarningDilaog(missedFields[0].message).openDialog()
  await scrollToRequiredField(missedFields[0].key)
  return false
}

defineExpose({
  validateRequiredFields,
})
</script>

<template>
  <div class="col-span-4 md:col-span-2 input-wrapper field-required" data-required-field="Name">
    <label for="name" class="flex items-center gap-2">
      {{ $t('employee_name') }}
      <FieldHelpIcon text="Enter the employee's full name as it should appear in the system." />
    </label>
    <input
      id="name"
      type="text"
      v-model="Name"
      @input="UpdateName"
      :placeholder="$t('enter your name')"
    />
    <p v-if="getFieldError('Name')" class="required-field-message">
      {{ getFieldError('Name') }}
    </p>
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper" v-if="!data?.id">
    <label for="serialNumber" class="flex items-center gap-2">
      {{ $t('serial_number') }}
      <FieldHelpIcon
        text="Enter a unique employee serial number, or leave it empty when automatic generation is enabled."
      />
    </label>
    <input
      type="text"
      v-model="SerialNumber"
      @input="UpdateSerial"
      id="serialNumber"
      :disabled="projtecStateus.isSerialNumberAuto()"
      :placeholder="
        projtecStateus.isSerialNumberAuto()
          ? 'You can leave it (auto-generated)'
          : 'Enter Your Serial Number'
      "
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="phone-country-code" class="flex items-center gap-2">
      {{ $t('phone_country_code') }}
      <FieldHelpIcon
        text="Select the international dialing code for the employee's phone number."
      />
    </label>
    <PhoneCountryCode :model-value="CountryCode" @update:model-value="updateCountryCode" />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper field-required" data-required-field="Phone">
    <label for="phone" class="flex items-center gap-2">
      {{ $t('employee_phone_number') }}
      <FieldHelpIcon text="Enter the employee's phone number for work-related contact." />
    </label>
    <input
      id="phone"
      type="tel"
      v-model="Phone"
      @input="UpdatePhone"
      :placeholder="$t('enter your phone')"
    />
    <p v-if="getFieldError('Phone')" class="required-field-message">
      {{ getFieldError('Phone') }}
    </p>
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper field-required" data-required-field="Email">
    <label for="email" class="flex items-center gap-2">
      {{ $t('employee_email_address') }}
      <FieldHelpIcon text="This email address is used to log in to the system." />
    </label>
    <input
      id="email"
      type="email"
      v-model="Email"
      @input="UpdateEmail"
      :placeholder="$t('enter your email')"
    />
    <p v-if="getFieldError('Email')" class="required-field-message">
      {{ getFieldError('Email') }}
    </p>
  </div>
  <div
    v-if="booleandashAccessStatus"
    class="col-span-4 md:col-span-2 input-wrapper"
    data-required-field="Password"
  >
    <label for="password" class="flex items-center gap-2">
      {{ $t('Password') }}
      <FieldHelpIcon text="Set the password the employee will use to log in to the system." />
    </label>
    <input
      id="password"
      type="text"
      min="8"
      v-model="Password"
      @input="UpdatePassword"
      :placeholder="$t('enter your password')"
    />
    <p v-if="getFieldError('Password')" class="required-field-message">
      {{ getFieldError('Password') }}
    </p>
  </div>
  <!--<div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="password_confirmation">{{ $t('confirm_password') }}</label>
    <input id="password_confirmation" type="text" min="8" v-model="ConfirmPassword" @input="UpdateConfirmPassword"
      :placeholder="$t('enter your confirm password')" />
  </div>-->
  <!-- :type="2" -->
  <div
    v-if="props.heirarchyId == null"
    class="col-span-4 md:col-span-2 input-wrapper"
    data-required-field="Heirarchy"
  >
    <UpdatedCustomInputSelect
      :modelValue="Heirarchy"
      @update:modelValue="setHeirarchy"
      :controller="indexHerikalyController"
      :params="HerikalyParams"
      :label="$t('position')"
      :placeholder="$t('select_position')"
      :isDialog="true"
      v-model:dialogVisible="PositionDialog"
    >
      <template #LabelHeader>
        <FieldHelpIcon text="Select the employee's position in the organization hierarchy." />
        <span class="add-dialog" @click="PositionDialog = true">New</span>
      </template>
      <template #Dialog>
        <AddHerikaly @update:data="PositionDialog = false" />
      </template>
    </UpdatedCustomInputSelect>
    <p v-if="getFieldError('Heirarchy')" class="required-field-message">
      {{ getFieldError('Heirarchy') }}
    </p>
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper checkbox-with-help">
    <CustomCheckbox
      :index="5"
      :title="`all_permissions`"
      :checked="AllPermissions"
      @update:checked="updaetAllPermissions"
    />
    <!-- <FieldHelpIcon text="Enable this option to grant the employee all available permissions." /> -->
  </div>
  <div
    v-if="!AllPermissions"
    class="col-span-4 md:col-span-2 input-wrapper"
    data-required-field="role"
  >
    <UpdatedCustomInputSelect
      :modelValue="role"
      @update:modelValue="setRole"
      :controller="indexRoleController"
      :params="indexRoleParams"
      :label="$t('permissions')"
      :type="2"
      :placeholder="$t('Select Role')"
      :isDialog="true"
      v-model:dialogVisible="RoleDialog"
    >
      <template #LabelHeader>
        <!-- <FieldHelpIcon text="Select the roles that define what the employee can view and manage." /> -->
        <span class="add-dialog" @click="RoleDialog = true">New</span>
      </template>
      <template #option="{ option }">
        <div class="role-option">
          <span>{{ option.title }}</span>
          <span class="role-option__help" @mousedown.stop @click.stop>
            <FieldHelpIcon :text="getRolePermissionsHint(option as RoleModel)" />
          </span>
        </div>
      </template>
      <template #Dialog>
        <AddRole @update:data="RoleDialog = false" />
      </template>
    </UpdatedCustomInputSelect>
    <p v-if="getFieldError('role')" class="required-field-message">
      {{ getFieldError('role') }}
    </p>
  </div>
  <!-- <div class="col-span-4 md:col-span-2 input-wrapper">
    <CustomCheckbox :index="5" :title="$t('isAdmin')" :label="$t('admin_status')" :checked="EmployeeStatus"
      @update:checked="updaetAdminStatus" />
  </div> -->

  <div class="col-span-4 md:col-span-2 input-wrapper checkbox-with-help">
    <CustomCheckbox
      :index="3"
      :title="`admin_permission`"
      :checked="booleanEmpStatus"
      @update:checked="updaetAdminStatus"
    />
    <!-- <FieldHelpIcon text="Enable this option to give the employee administrator privileges." /> -->
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper checkbox-with-help">
    <CustomCheckbox
      :index="4"
      :title="`dashboard_access`"
      :checked="booleandashAccessStatus"
      @update:checked="updaetdashAccessStatus"
    />
    <!-- <FieldHelpIcon
      text="Enable this option to allow the employee to log in and use the dashboard."
    /> -->
  </div>
  <!-- <div class="col-span-4 md:col-span-2 input-wrapper">
    <CustomSelectInput :modelValue="Certificates" @update:modelValue="setCertificates"
      :controller="indexCertificateController" :type="2" :params="deleteCertificateParams" :label="$t('Certificates')"
      :placeholder="$t('Select Certificates')" />
  </div> -->
</template>

<style scoped>
.required-field-message {
  margin-top: 0.35rem;
  color: var(--status-danger);
  font-size: 0.82rem;
  font-weight: 700;
}

.checkbox-with-help {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.role-option {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
}

.role-option__help {
  margin-inline-start: auto;
}
</style>
