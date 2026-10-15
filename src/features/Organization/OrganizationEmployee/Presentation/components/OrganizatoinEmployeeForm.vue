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
import { adminPermissions, type PermissionItem } from '@/constant/adminPremission'
import { OrgPermissions } from '@/constant/organizationPremission'

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

const permissionLabelByCode = new Map<string, string>()

const registerPermissionLabels = (root: PermissionItem) => {
  root.permissions?.forEach((module) => {
    module.permissions?.forEach((group) => {
      group.permissions?.forEach((permission) => {
        permissionLabelByCode.set(permission.code, `${group.label} — ${permission.label}`)
      })
    })
  })
}

registerPermissionLabels(adminPermissions)
registerPermissionLabels(OrgPermissions)

const getRolePermissionsHint = (roleOption: RoleModel) => {
  if (!roleOption.permissions?.length) return 'No permissions are assigned to this role.'

  const permissionNames = roleOption.permissions.map((permission) => {
    const code = permission.displayName || permission.permission || permission.name
    return permissionLabelByCode.get(code) ?? permissionNameByCode.get(code) ?? code
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
  <div class="employee-form-shell col-span-4">
    <header class="employee-form-hero">
      <div class="employee-form-hero__mark" aria-hidden="true">
        {{ Name?.trim()?.charAt(0)?.toUpperCase() || 'E' }}
      </div>
      <div>
        <p class="employee-form-hero__eyebrow">{{ data?.id ? $t('edit') : $t('add') }}</p>
        <h2>{{ $t('employee') }}</h2>
        <p>Set up the employee profile, organization position, and workspace access.</p>
      </div>
      <span class="employee-form-hero__status">
        <span aria-hidden="true"></span>
        {{ booleandashAccessStatus ? $t('dashboard_access') : $t('employee') }}
      </span>
    </header>

    <section class="employee-form-section" aria-labelledby="employee-profile-heading">
      <div class="employee-section-heading">
        <span class="employee-section-heading__index">01</span>
        <div>
          <h3 id="employee-profile-heading">Profile information</h3>
          <p>Core information used to identify and contact this employee.</p>
        </div>
      </div>

      <div class="employee-field-grid">
        <div class="input-wrapper field-required" data-required-field="Name">
          <label for="name" class="flex items-center gap-2">
            {{ $t('employee_name') }}
            <FieldHelpIcon
              text="Enter the employee's full name as it should appear in the system."
            />
          </label>
          <input
            id="name"
            v-model="Name"
            type="text"
            :placeholder="$t('enter your name')"
            @input="UpdateName"
          />
          <p v-if="getFieldError('Name')" class="required-field-message">
            {{ getFieldError('Name') }}
          </p>
        </div>

        <div v-if="!data?.id" class="input-wrapper">
          <label for="serialNumber" class="flex items-center gap-2">
            {{ $t('serial_number') }}
            <FieldHelpIcon
              text="Enter a unique employee serial number, or leave it empty when automatic generation is enabled."
            />
          </label>
          <input
            id="serialNumber"
            v-model="SerialNumber"
            type="text"
            :disabled="projtecStateus.isSerialNumberAuto()"
            :placeholder="
              projtecStateus.isSerialNumberAuto()
                ? 'You can leave it (auto-generated)'
                : 'Enter Your Serial Number'
            "
            @input="UpdateSerial"
          />
        </div>

        <div class="input-wrapper">
          <label for="phone-country-code" class="flex items-center gap-2">
            {{ $t('phone_country_code') }}
            <FieldHelpIcon
              text="Select the international dialing code for the employee's phone number."
            />
          </label>
          <PhoneCountryCode :model-value="CountryCode" @update:model-value="updateCountryCode" />
        </div>

        <div class="input-wrapper field-required" data-required-field="Phone">
          <label for="phone" class="flex items-center gap-2">
            {{ $t('phone_number') }}
            <FieldHelpIcon text="Enter the employee's phone number for work-related contact." />
          </label>
          <input
            id="phone"
            v-model="Phone"
            type="tel"
            :placeholder="$t('enter your phone')"
            @input="UpdatePhone"
          />
          <p v-if="getFieldError('Phone')" class="required-field-message">
            {{ getFieldError('Phone') }}
          </p>
        </div>
      </div>
    </section>

    <section class="employee-form-section" aria-labelledby="employee-workspace-heading">
      <div class="employee-section-heading">
        <span class="employee-section-heading__index">02</span>
        <div>
          <h3 id="employee-workspace-heading">Organization and workspace</h3>
          <p>Connect the employee to their position and dashboard credentials.</p>
        </div>
      </div>

      <div class="employee-field-grid">
        <div class="input-wrapper field-required" data-required-field="Email">
          <label for="email" class="flex items-center gap-2">
            {{ $t('email_address') }}
            <FieldHelpIcon text="This email address is used to log in to the system." />
          </label>
          <input
            id="email"
            v-model="Email"
            type="email"
            :placeholder="$t('enter your email')"
            @input="UpdateEmail"
          />
          <p v-if="getFieldError('Email')" class="required-field-message">
            {{ getFieldError('Email') }}
          </p>
        </div>

        <div v-if="booleandashAccessStatus" class="input-wrapper" data-required-field="Password">
          <label for="password" class="flex items-center gap-2">
            {{ $t('Password') }}
            <FieldHelpIcon text="Set the password the employee will use to log in to the system." />
          </label>
          <input
            id="password"
            v-model="Password"
            type="password"
            minlength="8"
            autocomplete="new-password"
            :placeholder="$t('enter your password')"
            @input="UpdatePassword"
          />
          <p v-if="getFieldError('Password')" class="required-field-message">
            {{ getFieldError('Password') }}
          </p>
        </div>

        <div v-if="props.heirarchyId == null" class="input-wrapper" data-required-field="Heirarchy">
          <UpdatedCustomInputSelect
            :modelValue="Heirarchy"
            :controller="indexHerikalyController"
            :params="HerikalyParams"
            :label="$t('position')"
            :placeholder="$t('select_position')"
            :isDialog="true"
            v-model:dialogVisible="PositionDialog"
            @update:modelValue="setHeirarchy"
          >
            <template #LabelHeader>
              <FieldHelpIcon text="Select the employee's position in the organization hierarchy." />
              <button class="inline-create-action" type="button" @click="PositionDialog = true">
                + New
              </button>
            </template>
            <template #Dialog><AddHerikaly @update:data="PositionDialog = false" /></template>
          </UpdatedCustomInputSelect>
          <p v-if="getFieldError('Heirarchy')" class="required-field-message">
            {{ getFieldError('Heirarchy') }}
          </p>
        </div>
      </div>
    </section>

    <section
      class="employee-form-section employee-access-section"
      aria-labelledby="employee-access-heading"
    >
      <div class="employee-section-heading">
        <span class="employee-section-heading__index">03</span>
        <div>
          <h3 id="employee-access-heading">Access and permissions</h3>
          <p>Choose the access level and roles that match this employee's responsibilities.</p>
        </div>
      </div>

      <div class="employee-access-grid">
        <div class="access-toggle-card">
          <div class="flex gap-2">
            <div class="access-toggle-card__icon" aria-hidden="true">A</div>
            <div>
              <strong>{{ $t('admin_permission') }}</strong>
              <p>Allow organization administration capabilities.</p>
            </div>
          </div>
          <CustomCheckbox
            :index="3"
            :title="`admin_permission`"
            :checked="booleanEmpStatus"
            @update:checked="updaetAdminStatus"
          />
        </div>

        <div class="access-toggle-card">
          <div class="flex gap-2">
            <div class="access-toggle-card__icon" aria-hidden="true">D</div>
            <div>
              <strong>{{ $t('dashboard_access') }}</strong>
              <p>Allow the employee to sign in to the dashboard.</p>
            </div>
          </div>
          <CustomCheckbox
            :index="4"
            :title="`dashboard_access`"
            :checked="booleandashAccessStatus"
            @update:checked="updaetdashAccessStatus"
          />
        </div>

        <div class="access-toggle-card">
          <div class="flex gap-2">
            <div class="access-toggle-card__icon" aria-hidden="true">∞</div>
            <div>
              <strong>{{ $t('all_permissions') }}</strong>
              <p>Grant access to all available organization modules.</p>
            </div>
          </div>
          <CustomCheckbox
            :index="5"
            :title="`all_permissions`"
            :checked="AllPermissions"
            @update:checked="updaetAllPermissions"
          />
        </div>
      </div>

      <div
        v-if="!AllPermissions"
        class="employee-role-picker input-wrapper"
        data-required-field="role"
      >
        <UpdatedCustomInputSelect
          :modelValue="role"
          :controller="indexRoleController"
          :params="indexRoleParams"
          :label="$t('permissions')"
          :type="2"
          :placeholder="$t('Select Role')"
          :isDialog="true"
          v-model:dialogVisible="RoleDialog"
          @update:modelValue="setRole"
        >
          <template #LabelHeader>
            <FieldHelpIcon
              text="Select the roles that define what the employee can view and manage."
            />
            <button class="inline-create-action" type="button" @click="RoleDialog = true">
              + New
            </button>
          </template>
          <template #option="{ option }">
            <div class="role-option">
              <span>{{ option.title }}</span>
              <span class="role-option__help" @mousedown.stop @click.stop>
                <FieldHelpIcon :text="getRolePermissionsHint(option as RoleModel)" />
              </span>
            </div>
          </template>
          <template #Dialog><AddRole @update:data="RoleDialog = false" /></template>
        </UpdatedCustomInputSelect>
        <p v-if="getFieldError('role')" class="required-field-message">
          {{ getFieldError('role') }}
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.employee-form-shell {
  display: grid;
  gap: 1.25rem;
  width: 100%;
}

.employee-form-hero {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 1rem;
  overflow: hidden;
  padding: 1.5rem;
  border: 1px solid color-mix(in srgb, var(--identity-primary) 18%, var(--hse-color-border));
  border-radius: var(--hse-radius-card);
  background:
    radial-gradient(circle at 90% 10%, rgb(17 165 197 / 18%), transparent 32%),
    linear-gradient(135deg, var(--hse-color-navy), var(--hse-color-navy-secondary));
  color: #fff;
  box-shadow: var(--hse-shadow-md);
}

.employee-form-hero__mark {
  display: grid;
  width: 3.75rem;
  height: 3.75rem;
  place-items: center;
  border: 1px solid rgb(255 255 255 / 24%);
  border-radius: 1rem;
  background: rgb(255 255 255 / 12%);
  font-size: 1.5rem;
  font-weight: 800;
}

.employee-form-hero__eyebrow {
  margin: 0 0 0.2rem;
  color: #9fc5ff;
  font-size: var(--hse-text-xs);
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.employee-form-hero h2,
.employee-form-hero p {
  margin: 0;
  color: inherit;
}

.employee-form-hero h2 {
  font-size: 1.35rem;
}

.employee-form-hero > div > p:last-child {
  margin-top: 0.25rem;
  color: #c8d8ec;
}

.employee-form-hero__status {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.75rem;
  border: 1px solid rgb(255 255 255 / 18%);
  border-radius: var(--hse-radius-badge);
  background: rgb(255 255 255 / 10%);
  font-size: var(--hse-text-xs);
  font-weight: 700;
  white-space: nowrap;
}

.employee-form-hero__status > span {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #4ce0b3;
  box-shadow: 0 0 0 4px rgb(76 224 179 / 14%);
}

.employee-form-section {
  padding: 1.25rem;
  border: 1px solid var(--hse-color-border);
  border-radius: var(--hse-radius-card);
  background: var(--hse-color-surface);
  box-shadow: var(--hse-shadow-sm);
}

.employee-section-heading {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--hse-color-divider);
}

.employee-section-heading__index {
  display: grid;
  flex: 0 0 2.25rem;
  height: 2.25rem;
  place-items: center;
  border-radius: 0.7rem;
  background: var(--hse-color-primary-subtle);
  color: var(--identity-primary);
  font-size: var(--hse-text-xs);
  font-weight: 800;
}

.employee-section-heading h3,
.employee-section-heading p {
  margin: 0;
}

.employee-section-heading h3 {
  color: var(--hse-color-text);
  font-size: var(--hse-text-md);
}

.employee-section-heading p {
  margin-top: 0.2rem;
  color: var(--hse-color-text-muted);
  font-size: var(--hse-text-sm);
}

.employee-field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem 1.25rem;
}

.employee-field-grid > * {
  min-width: 0;
}

.employee-access-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.access-toggle-card {
  /* display: grid;
  grid-template-columns: auto minmax(0, 1fr); */
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  padding: 0.9rem;
  border: 1px solid var(--hse-color-border);
  border-radius: 0.875rem;
  background: var(--hse-color-surface-muted);
  transition:
    border-color var(--hse-transition-fast) var(--hse-ease),
    box-shadow var(--hse-transition-fast) var(--hse-ease);
}

.access-toggle-card:hover {
  border-color: color-mix(in srgb, var(--identity-primary) 38%, var(--hse-color-border));
  box-shadow: var(--hse-shadow-sm);
}

.access-toggle-card__icon {
  display: grid;
  width: 2.25rem;
  height: 2.25rem;
  place-items: center;
  border-radius: 0.65rem;
  background: var(--hse-color-primary-subtle);
  color: var(--identity-primary);
  font-weight: 800;
}

.access-toggle-card strong,
.access-toggle-card p {
  margin: 0;
}

.access-toggle-card strong {
  color: var(--hse-color-text);
  font-size: var(--hse-text-sm);
}

.access-toggle-card p {
  margin-top: 0.15rem;
  color: var(--hse-color-text-muted);
  font-size: var(--hse-text-xs);
  line-height: 1.45;
}

.access-toggle-card :deep(.custom-checkbox) {
  grid-column: 1 / -1;
}

.employee-role-picker {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px dashed color-mix(in srgb, var(--identity-primary) 30%, var(--hse-color-border));
  border-radius: 0.875rem;
  background: color-mix(in srgb, var(--hse-color-primary-subtle) 42%, var(--hse-color-surface));
}

.inline-create-action {
  width: auto;
  min-height: 1.75rem;
  margin-inline-start: auto;
  padding: 0.2rem 0.55rem;
  border: 0;
  border-radius: var(--hse-radius-badge);
  background: var(--hse-color-primary-subtle);
  color: var(--identity-primary);
  font-size: var(--hse-text-xs);
  font-weight: 800;
}

.required-field-message {
  margin-top: 0.35rem;
  color: var(--status-danger);
  font-size: 0.82rem;
  font-weight: 700;
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

@media (max-width: 900px) {
  .employee-access-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .employee-form-hero {
    grid-template-columns: auto minmax(0, 1fr);
    padding: 1.1rem;
  }

  .employee-form-hero__status {
    grid-column: 1 / -1;
    width: fit-content;
  }

  .employee-field-grid {
    grid-template-columns: 1fr;
  }

  .employee-form-section {
    padding: 1rem;
  }
}
</style>
