<script lang="ts" setup>
import { useConfiguredValidation } from '@/composables/useConfiguredValidation'

import { computed, nextTick, onMounted, ref, watch } from 'vue'

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
import { useProjectAppStatusStore } from '@/stores/ProjectStatus'
import HandleFIlesUpload from '@/features/Organization/OrganizationEmployee/Presentation/supcomponents/HandleFIlesUpload.vue'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'

const { configureRules: configureValidationRules, localizeErrors: localizeValidationErrors } =
  useConfiguredValidation('ContractorForm')

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
        props.data.id,
        Name.value,
        phoneNumber.value,
        Scopes,
        CompanyEmail.value,
        CompanyAddress.value,
        contactPerson.value,
        contactPersonEmail.value,
        contactPersonPhone.value,
        SelectedStatus.value?.id,
        formatJoinDate(date.value),
        UploadedFiles.value[0],
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
        SelectedStatus.value?.id,
        formatJoinDate(date.value),
        SerialNumber.value,
        UploadedFiles.value[0],
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
  new TitleInterface({
    id: ContractorStatusEnum.ACTIVE,
    title: 'active',
    translationKey: 'active',
  }),
  new TitleInterface({
    id: ContractorStatusEnum.INACTIVE,
    title: 'inactive',
    translationKey: 'inactive',
  }),
])

watch(
  [() => props.data],
  ([newData]) => {
    if (newData) {
      console.log(newData.scopes, 'newData.scopes')
      Scope.value = newData?.scopes?.map(
        (item) =>
          new TitleInterface({
            id: item?.id,
            title: item?.titles?.[0]?.title,
          }),
      )

      Name.value = newData?.name
      phoneNumber.value = newData?.phone
      // Scope.value = newData.scopes
      CompanyEmail.value = newData?.companyEmail
      CompanyAddress.value = newData?.CompanyAddress
      contactPerson.value = newData?.contactPerson
      contactPersonEmail.value = newData?.contactPersonEmail
      contactPersonPhone.value = newData?.contactPersonPhone
      SelectedStatus.value = StatusList.value.find((item) => item?.id == newData?.SelectedStatus)
      date.value = newData?.date ? new Date(newData.date) : new Date()
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
const projtecStateus = useProjectAppStatusStore()
const UpdateSerial = (data) => {
  SerialNumber.value = data.target.value
  updateData()
}
const SerialNumber = ref()

const UploadedFiles = ref<string[]>([])
const handleFilesChange = (files: Array<{ base64?: string }>) => {
  UploadedFiles.value = files
    .map((file) => file.base64)
    .filter((base64): base64 is string => Boolean(base64))
  updateData()
  console.log(UploadedFiles.value)
}

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
    message: 'Contractor Name Is Required',
    isMissing: () => !hasValue(Name.value),
  },
  {
    key: 'phoneNumber',
    message: 'Contractor Phone Number Is Required',
    isMissing: () => !hasValue(phoneNumber.value),
  },
  {
    key: 'contactPersonPhone',
    message: 'Contact Person Phone Is Required',
    isMissing: () => !hasValue(contactPersonPhone.value),
  },
  // {
  //   key: 'Scope',
  //   message: 'Scope Is Required',
  //   isMissing: () => !Scope.value?.length,
  // },
  {
    key: 'date',
    message: 'Contract Expiry Date Is Required',
    isMissing: () => !date.value,
  },
])
localizeValidationErrors(requiredFieldErrors, requiredFields)

const getFieldError = (key: string) => requiredFieldErrors.value[key] ?? ''

const scrollToRequiredField = async (key: string) => {
  await nextTick()
  document.querySelector<HTMLElement>(`[data-required-field="${key}"]`)?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}

const validateRequiredFields = async () => {
  const missedFields = configureValidationRules(requiredFields.value).filter((field) =>
    field.isMissing(),
  )
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
  <div class="contractor-form-shell col-span-4">
    <header class="contractor-form-hero">
      <div class="contractor-form-hero__mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4 20h16M6 20V8l6-4 6 4v12M9 11h2m2 0h2m-6 4h2m2 0h2" />
        </svg>
      </div>
      <div class="contractor-form-hero__copy">
        <p class="contractor-form-hero__eyebrow">
          {{ data?.id ? $t('edit') : $t('add') }} {{ $t('· Contractor registry') }}
        </p>
        <h2>{{ data?.id ? $t('Update contractor profile') : $t('Create contractor profile') }}</h2>
        <p>{{ $t('Keep company, contact, service scope, and contract records together.') }}</p>
      </div>
      <span class="contractor-form-hero__status">
        <span aria-hidden="true"></span>
        {{ SelectedStatus?.title || $t('status') }}
      </span>
    </header>

    <section class="contractor-form-section" aria-labelledby="contractor-company-heading">
      <div class="contractor-section-heading">
        <span class="contractor-section-heading__index">01</span>
        <div>
          <h3 id="contractor-company-heading">{{ $t('Company identity') }}</h3>
          <p>{{ $t('Record the contractor’s primary identity and company contact details.') }}</p>
        </div>
      </div>

      <div class="contractor-field-grid">
        <div v-if="!data?.id" class="input-wrapper">
          <label for="serialNumber">{{ $t('serial_number') }}</label>
          <input
            dir="auto"
            id="serialNumber"
            v-model="SerialNumber"
            type="text"
            :disabled="projtecStateus.isSerialNumberAuto()"
            :placeholder="
              projtecStateus.isSerialNumberAuto()
                ? $t('You can leave it (auto-generated)')
                : $t('Enter Your Serial Number')
            "
            @input="UpdateSerial"
          />
          <small class="field-helper">{{
            $t('A unique reference can be generated automatically.')
          }}</small>
        </div>

        <div class="input-wrapper field-required" data-required-field="Name">
          <label for="name">{{ $t('name') }}</label>
          <input
            dir="auto"
            id="name"
            v-model="Name"
            type="text"
            class="input"
            :placeholder="$t('name')"
            @input="setName"
          />
          <p v-if="getFieldError('Name')" class="required-field-message">
            {{ getFieldError('Name') }}
          </p>
        </div>

        <div class="input-wrapper field-required" data-required-field="phoneNumber">
          <label for="company_number">{{ $t('phone_number') }}</label>
          <input
            dir="ltr"
            id="company_number"
            v-model="phoneNumber"
            type="tel"
            class="input"
            :placeholder="$t('Enter phone number')"
            @input="setPhoneNumber"
          />
          <p v-if="getFieldError('phoneNumber')" class="required-field-message">
            {{ getFieldError('phoneNumber') }}
          </p>
        </div>

        <div class="input-wrapper">
          <label for="company_email">{{ $t('email') }}</label>
          <input
            dir="ltr"
            id="company_email"
            v-model="CompanyEmail"
            type="email"
            class="input"
            :placeholder="$t('Enter company email')"
            @input="setCompanyEmail"
          />
        </div>

        <div class="input-wrapper contractor-field--wide">
          <label for="company_address">{{ $t('address') }}</label>
          <input
            dir="auto"
            id="company_address"
            v-model="CompanyAddress"
            type="text"
            class="input"
            :placeholder="$t('Enter company address')"
            @input="setCompanyAddress"
          />
        </div>

        <div class="input-wrapper" data-required-field="Scope">
          <UpdatedCustomInputSelect
            id="Scope"
            :modelValue="Scope"
            class="input"
            :controller="indexScopeController"
            :params="indexScopeParams"
            :label="$t('scope of service')"
            :placeholder="$t('Select scope of service')"
            :type="2"
            :isDialog="true"
            v-model:dialogVisible="scopeDialogRef"
            @update:modelValue="setScope"
            @close="scopeDialogRef = false"
          >
            <template #LabelHeader>
              <button class="inline-create-action" type="button" @click="scopeDialogRef = true">
                {{ $t('+ New') }}
              </button>
            </template>
            <template #Dialog>
              <AddScope @update:data="scopeDialogRef = false" />
            </template>
          </UpdatedCustomInputSelect>
          <p v-if="getFieldError('Scope')" class="required-field-message">
            {{ getFieldError('Scope') }}
          </p>
        </div>

        <div class="input-wrapper contractor-field--wide contractor-status-field">
          <CustomSelectInput
            id="Status"
            :modelValue="SelectedStatus"
            class="input"
            :static-options="StatusList"
            :label="$t('status')"
            :reload="false"
            :placeholder="$t('Select contractor status')"
            @update:modelValue="setStatus"
          />
        </div>
      </div>
    </section>

    <section class="contractor-form-section" aria-labelledby="contractor-contact-heading">
      <div class="contractor-section-heading">
        <span class="contractor-section-heading__index">02</span>
        <div>
          <h3 id="contractor-contact-heading">{{ $t('Contact and service coverage') }}</h3>
          <p>
            {{
              $t('Connect the responsible person with the contractor’s approved scopes and status.')
            }}
          </p>
        </div>
      </div>

      <div class="contractor-field-grid">
        <div class="input-wrapper">
          <label for="contact_person">{{ $t('person_name') }}</label>
          <input
            dir="auto"
            id="contact_person"
            v-model="contactPerson"
            type="text"
            class="input"
            :placeholder="$t('Enter contact person')"
            @input="setcontactPerson"
          />
        </div>

        <div class="input-wrapper">
          <label for="contact_person_email">{{ $t('person_email') }}</label>
          <input
            dir="ltr"
            id="contact_person_email"
            v-model="contactPersonEmail"
            type="email"
            class="input"
            :placeholder="$t('Enter contact email')"
            @input="setcontactPersonEmail"
          />
        </div>

        <div class="input-wrapper field-required" data-required-field="contactPersonPhone">
          <label for="contact_person_phone">{{ $t('person_phone') }}</label>
          <input
            dir="ltr"
            id="contact_person_phone"
            v-model="contactPersonPhone"
            type="tel"
            class="input"
            :placeholder="$t('Enter contact phone')"
            @input="setcontactPersonPhone"
          />
          <p v-if="getFieldError('contactPersonPhone')" class="required-field-message">
            {{ getFieldError('contactPersonPhone') }}
          </p>
        </div>
      </div>
    </section>

    <section class="contractor-form-section" aria-labelledby="contractor-contract-heading">
      <div class="contractor-section-heading">
        <span class="contractor-section-heading__index">03</span>
        <div>
          <h3 id="contractor-contract-heading">{{ $t('Contract validity and evidence') }}</h3>
          <p>{{ $t('Set the expiry date and attach the latest supporting contract document.') }}</p>
        </div>
      </div>

      <div class="contractor-document-grid">
        <div class="input-wrapper field-required" data-required-field="date">
          <label for="expiry_date">{{ $t('expiry_date') }}</label>
          <DatePicker
            id="expiry_date"
            :modelValue="date"
            class="input"
            :label="$t('Date')"
            :placeholder="$t('Select contract expiry date')"
            @update:modelValue="setExpiryDate"
          />
          <p v-if="getFieldError('date')" class="required-field-message">
            {{ getFieldError('date') }}
          </p>
        </div>

        <div class="contractor-upload-card">
          <div class="contractor-upload-card__copy">
            <span class="contractor-upload-card__icon" aria-hidden="true">↑</span>
            <div>
              <strong>{{ $t('upload contract image') }}</strong>
              <p>{{ $t('PDF, Office document, or image. One current contract file.') }}</p>
            </div>
          </div>
          <HandleFIlesUpload
            :label="$t('upload contract image')"
            :file="data?.contractFile"
            accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
            :max-files="1"
            :multiple="false"
            className="input-file"
            @change="handleFilesChange"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.contractor-form-shell {
  display: grid;
  gap: 1.25rem;
  width: 100%;
  min-width: 0;
}

.contractor-form-hero {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 1rem;
  overflow: hidden;
  padding: clamp(1.2rem, 3vw, 1.6rem);
  border: 1px solid color-mix(in srgb, var(--identity-primary) 18%, var(--hse-color-border));
  border-radius: var(--hse-radius-card, 18px);
  background:
    radial-gradient(circle at 88% 8%, rgb(17 165 197 / 20%), transparent 32%),
    linear-gradient(135deg, var(--hse-color-navy), var(--hse-color-navy-secondary));
  color: #fff;
  box-shadow: var(--hse-shadow-md);
}

.contractor-form-hero::after {
  position: absolute;
  inset-block-end: -4.5rem;
  inset-inline-end: 12%;
  width: 10rem;
  height: 10rem;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 50%;
  content: '';
  pointer-events: none;
}

.contractor-form-hero__mark {
  display: grid;
  width: 3.8rem;
  height: 3.8rem;
  place-items: center;
  border: 1px solid rgb(255 255 255 / 22%);
  border-radius: 1rem;
  background: rgb(255 255 255 / 11%);
}

.contractor-form-hero__mark svg {
  width: 1.9rem;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.contractor-form-hero__copy h2,
.contractor-form-hero__copy p {
  margin: 0;
  color: inherit;
}

.contractor-form-hero__eyebrow {
  margin-bottom: 0.2rem !important;
  color: #9fc5ff !important;
  font-size: var(--hse-text-xs);
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.contractor-form-hero__copy h2 {
  font-size: clamp(1.2rem, 2.5vw, 1.45rem);
  line-height: 1.25;
}

.contractor-form-hero__copy > p:last-child {
  margin-top: 0.3rem;
  color: #c8d8ec;
  font-size: var(--hse-text-sm);
}

.contractor-form-hero__status {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgb(255 255 255 / 18%);
  border-radius: var(--hse-radius-badge, 999px);
  background: rgb(255 255 255 / 10%);
  font-size: var(--hse-text-xs);
  font-weight: 700;
  white-space: nowrap;
}

.contractor-form-hero__status > span {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #4ce0b3;
  box-shadow: 0 0 0 4px rgb(76 224 179 / 14%);
}

.contractor-form-section {
  min-width: 0;
  padding: 1.25rem;
  border: 1px solid var(--hse-color-border);
  border-radius: var(--hse-radius-card, 18px);
  background: var(--hse-color-surface);
  box-shadow: var(--hse-shadow-sm);
}

.contractor-section-heading {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--hse-color-divider);
}

.contractor-section-heading__index {
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

.contractor-section-heading h3,
.contractor-section-heading p {
  margin: 0;
}

.contractor-section-heading h3 {
  color: var(--hse-color-text);
  font-size: var(--hse-text-md);
}

.contractor-section-heading p {
  margin-top: 0.2rem;
  color: var(--hse-color-text-muted);
  font-size: var(--hse-text-sm);
  line-height: 1.5;
}

.contractor-field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem 1.25rem;
}
.contractor-document-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem 1.25rem;
}
.contractor-field-grid > *,
.contractor-document-grid > * {
  min-width: 0;
}

.contractor-field--wide {
  grid-column: 1 / -1;
}

.contractor-status-field {
  max-width: calc(50% - 0.625rem);
}

.contractor-form-shell :deep(input),
.contractor-form-shell :deep(textarea),
.contractor-form-shell :deep(.p-select),
.contractor-form-shell :deep(.p-multiselect),
.contractor-form-shell :deep(.p-datepicker),
.contractor-form-shell :deep(.input-wrapper) {
  border-radius: var(--hse-control-radius, 9px) !important;
}

.contractor-form-shell :deep(input:focus),
.contractor-form-shell :deep(textarea:focus),
.contractor-form-shell :deep(.p-focus) {
  border-color: var(--identity-primary) !important;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--identity-primary) 14%, transparent) !important;
}

.field-helper {
  display: block;
  margin-top: 0.35rem;
  color: var(--hse-color-text-muted);
  font-size: var(--hse-text-xs);
}

.inline-create-action {
  width: auto;
  min-height: 1.75rem;
  margin-inline-start: auto;
  padding: 0.2rem 0.65rem;
  border: 0;
  border-radius: var(--hse-radius-badge, 999px) !important;
  background: var(--hse-color-primary-subtle);
  color: var(--identity-primary);
  cursor: pointer;
  font-size: var(--hse-text-xs);
  font-weight: 800;
}

.contractor-upload-card {
  padding: 1rem;
  border: 1px dashed color-mix(in srgb, var(--identity-primary) 34%, var(--hse-color-border));
  border-radius: var(--hse-radius-card, 18px);
  background: color-mix(in srgb, var(--hse-color-primary-subtle) 38%, var(--hse-color-surface));
}

.contractor-upload-card__copy {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.contractor-upload-card__icon {
  display: grid;
  flex: 0 0 2.4rem;
  height: 2.4rem;
  place-items: center;
  border-radius: 0.75rem;
  background: var(--identity-primary);
  color: var(--hse-color-text-on-primary, #fff);
  font-size: 1.2rem;
  font-weight: 800;
}

.contractor-upload-card strong,
.contractor-upload-card p {
  margin: 0;
}

.contractor-upload-card strong {
  color: var(--hse-color-text);
  font-size: var(--hse-text-sm);
}

.contractor-upload-card p {
  margin-top: 0.15rem;
  color: var(--hse-color-text-muted);
  font-size: var(--hse-text-xs);
  line-height: 1.45;
}

:deep(.input-file) {
  padding: 0.75rem !important;
  border: 1px solid var(--hse-color-border) !important;
  border-radius: var(--hse-control-radius, 9px) !important;
  background: var(--hse-color-surface) !important;
  color: var(--hse-color-text);
  cursor: pointer;
}

:deep(.upload-label) {
  display: none;
}

:deep(.file-upload-wrapper) {
  gap: 0.4rem !important;
}

.required-field-message {
  margin-top: 0.35rem;
  color: var(--status-danger);
  font-size: 0.82rem;
  font-weight: 700;
}

@media (max-width: 720px) {
  .contractor-form-hero {
    grid-template-columns: auto minmax(0, 1fr);
    padding: 1.1rem;
  }

  .contractor-form-hero__status {
    grid-column: 1 / -1;
    width: fit-content;
  }

  .contractor-field-grid,
  .contractor-document-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .contractor-field--wide {
    grid-column: auto;
  }

  .contractor-status-field {
    max-width: none;
  }

  .contractor-form-section {
    padding: 1rem;
  }
}

@media (max-width: 420px) {
  .contractor-form-hero {
    grid-template-columns: 1fr;
  }

  .contractor-form-hero__mark {
    width: 3.25rem;
    height: 3.25rem;
  }
}
</style>
