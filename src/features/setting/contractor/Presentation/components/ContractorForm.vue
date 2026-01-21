<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'

import type ContractorDetailsModel from '../../Data/models/ContractorDetailsModel'
import editContractorParams from '../../Core/params/editContractorParams'
import AddContractorParams from '../../Core/params/addContractorParams'
import IndexScopeController from '@/features/Organization/Scope/Presentation/controllers/indexScopeController'
import IndexScopeParams from '@/features/Organization/Scope/Core/params/indexScopeParams'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import DatePicker from 'primevue/datepicker'
import { ContractorStatusEnum } from '../../Core/Enum/ContractorStatusEnum'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import ScopeIdParams from '../../Core/params/AddscopesParams'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import AddScope from '@/features/Organization/Scope/Presentation/components/AddScope.vue'
import SwitchInput from '@/shared/FormInputs/SwitchInput.vue'
const emit = defineEmits(['update:data'])

const indexScopeController = IndexScopeController.getInstance()
const indexScopeParams = new IndexScopeParams('', 1, 10, 1)
const scopeDialogRef = ref(false)

const props = defineProps<{
  data?: ContractorDetailsModel
}>()
const phoneNumber = ref<string>('')
const Name = ref<string>('')
const updateData = () => {
  const Scopes = Scope.value?.map((item) => new ScopeIdParams(item.id))
  // ScopeIdParams

  const params = props.data?.id
    ? new editContractorParams(
        props.data?.id! ?? 0,
        Name.value,
        phoneNumber.value,
        Scopes,
        CompanyEmail.value,
        CompanyAddress.value,
        contactPerson.value,
        contactPersonEmail.value,
        contactPersonPhone.value,
        SelectedStatus.value ? SelectedStatus.value?.id : null,
        formatJoinDate(date.value),
      )
    : new AddContractorParams(
        Name.value,
        phoneNumber.value,
        Scopes,
        CompanyEmail.value ? CompanyEmail.value : ' ',
        CompanyAddress.value ? CompanyAddress.value : ' ',
        contactPerson.value ? contactPerson.value : ' ',
        contactPersonEmail.value ? contactPersonEmail.value : ' ',
        contactPersonPhone.value ? contactPersonPhone.value : ' ',
        SelectedStatus.value ? SelectedStatus.value?.id : 0,
        formatJoinDate(date.value),
        SerialNumber.value?.SerialNumber,
      )

  console.log('params', params)
  emit('update:data', params)
}
const Scope = ref<TitleInterface[]>()
const date = ref(new Date())
const contactPersonPhone = ref<string>()
const contactPersonEmail = ref<string>()
const contactPerson = ref<string>()
const CompanyAddress = ref<string>('')
const CompanyEmail = ref<string>('')
const SelectedStatus = ref<TitleInterface>()
const StatusList = ref<TitleInterface[]>([
  new TitleInterface({ id: ContractorStatusEnum.ACTIVE, title: 'Valid' }),
  new TitleInterface({ id: ContractorStatusEnum.INACTIVE, title: 'InValid' }),
])

watch(
  [() => props.data],
  ([newData]) => {
    if (newData) {
      console.log(newData.scopes, 'newData.scopes')
      Scope.value = newData.scopes.map(
        (item) =>
          new TitleInterface({
            id: item.id,
            title: item.titles?.[0]?.title,
          }),
      )

      Name.value = newData.name
      phoneNumber.value = newData.phone
      // Scope.value = newData.scopes
      CompanyEmail.value = newData.companyEmail
      CompanyAddress.value = newData.CompanyAddress
      contactPerson.value = newData.contactPerson
      contactPersonEmail.value = newData.contactPersonEmail
      contactPersonPhone.value = newData.contactPersonPhone
      SelectedStatus.value = StatusList.value.find((item) => item?.id == newData.SelectedStatus)
      date.value = newData.date
    }
  },
  { immediate: true },
)

const setPhoneNumber = (data) => {
  console.log(data.target.value)
  phoneNumber.value = data.target.value
  updateData()
}

const setName = (data) => {
  Name.value = data.target.value
  updateData()
}

const setScope = (data: TitleInterface[]) => {
  Scope.value = data
  updateData()
}
const setCompanyEmail = (data: string) => {
  CompanyEmail.value = data.target.value
  updateData()
}

const setCompanyAddress = (data: string) => {
  CompanyAddress.value = data.target.value
  updateData()
}

const setcontactPerson = (data: string) => {
  contactPerson.value = data.target.value
  updateData()
}

const setcontactPersonEmail = (data: string) => {
  contactPersonEmail.value = data.target.value
  updateData()
}

const setcontactPersonPhone = (data: string) => {
  contactPersonPhone.value = data.target.value
  updateData()
}

const setExpiryDate = (data: Date) => {
  date.value = data
  updateData()
}

const setStatus = (data: TitleInterface) => {
  SelectedStatus.value = data
  updateData()
}

onMounted(() => {
  updateData()
})

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
</script>

<template>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="name">{{ $t('name') }}</label>
    <input
      type="text"
      id="name"
      class="input"
      v-model="Name"
      @input="setName"
      placeholder="Enter Name "
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper" v-if="!data?.id">
    <SwitchInput
      :fields="fields"
      :switch_title="$t('auto')"
      :switch_reverse="true"
      :is-auto="true"
      @update:value="UpdateSerial"
    />
  </div>
  <div class="input-wrapper col-span-4 md:col-span-2">
    <label for="company_number">{{ $t('contractor_number') }}</label>
    <input
      type="text"
      id="company_number"
      min="1"
      class="input"
      v-model="phoneNumber"
      @input="setPhoneNumber"
      placeholder="Enter contractor Number "
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="company_email">{{ $t('contractor_email') }}</label>
    <input
      type="email"
      id="company_email"
      class="input"
      v-model="CompanyEmail"
      @input="setCompanyEmail"
      placeholder="Enter contractor Email "
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="company_address">{{ $t('contractor_address') }}</label>
    <input
      type="text"
      id="company_address"
      class="input"
      v-model="CompanyAddress"
      @input="setCompanyAddress"
      placeholder="Enter contractor Adress "
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="contact_person">{{ $t('contact_person') }}</label>
    <input
      type="text"
      id="contact_person"
      class="input"
      v-model="contactPerson"
      @input="setcontactPerson"
      placeholder="Enter Contact Person "
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="contact_person_email">{{ $t('contact_person_email') }}</label>
    <input
      type="text"
      id="contact_person_email"
      class="input"
      v-model="contactPersonEmail"
      @input="setcontactPersonEmail"
      placeholder="Enter Contact Person Email"
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="contact_person_phone">{{ $t('contact_person_phone') }}</label>
    <input
      type="text"
      id="contact_person_phone"
      class="input"
      v-model="contactPersonPhone"
      @input="setcontactPersonPhone"
      placeholder="Enter Contact Person Phone"
    />
  </div>
  <div class="col-span-6 md:col-span-2 input-wrapper">
    <!-- <CustomSelectInput
    :modelValue="Scope"
        class="input"
        :controller="indexScopeController"
        :params="indexScopeParams"
        label="Scope"
        id="Scope"
        placeholder="Select Scope"
        @update:modelValue="setScope"
        :type="2"

        /> -->

    <UpdatedCustomInputSelect
      :modelValue="Scope"
      class="input"
      :controller="indexScopeController"
      :params="indexScopeParams"
      label="Scope"
      id="Scope"
      placeholder="Select Scope"
      @update:modelValue="setScope"
      :type="2"
      @close="scopeDialogRef = false"
      :isDialog="true"
      :dialogVisible="scopeDialogRef"
    >
      <template #LabelHeader>
        <span class="add-dialog" @click="scopeDialogRef = true">New</span>
      </template>
      <template #Dialog>
        <AddScope @update:data="scopeDialogRef = false" />
      </template>
    </UpdatedCustomInputSelect>
  </div>

  <div class="col-span-6 md:col-span-2 input-wrapper">
    <CustomSelectInput
      :modelValue="SelectedStatus"
      class="input"
      :static-options="StatusList"
      label="Status"
      id="Status"
      placeholder="Select Status"
      @update:modelValue="setStatus"
    />
  </div>

  <div class="col-span-6 md:col-span-2 input-wrapper">
    <label for="expiry_date">{{ $t('contract_expiry_date') }}</label>
    <DatePicker
      :modelValue="date"
      class="input"
      label="Date"
      id="expiry_date"
      placeholder="Contruct Expiry Date"
      @update:modelValue="setExpiryDate"
    />
  </div>
</template>
