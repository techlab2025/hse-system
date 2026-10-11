<script lang="ts" setup>
import { nextTick, reactive, ref, watch } from 'vue'
import DatePicker from 'primevue/datepicker'
import FileUpload from '@/shared/FormInputs/FileUpload.vue'
import CustomCheckbox from '@/shared/HelpersComponents/CustomCheckbox.vue'
import { filesToBase64, type FileBase64 } from '@/base/Presentation/utils/file_to_base_64'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import type OrganizationCertificateDetailsModel from '../../Data/models/OrganizationCertificateDetailsModel'
import AddOrganizationCertificateParams from '../../Core/params/addOrganizationCertificateParams'
import EditOrganizationCertificateParams from '../../Core/params/editOrganizationCertificateParams'

const props = defineProps<{ data?: OrganizationCertificateDetailsModel }>()
const emit = defineEmits<{
  'update:data': [params: AddOrganizationCertificateParams | EditOrganizationCertificateParams]
}>()

const form = reactive({
  certification_name: '',
  issuing_body: '',
  certificate_number: '',
  notes: '',
})
const issueDate = ref<Date | null>(null)
const expiryDate = ref<Date | null>(null)
const expiredate = ref(false)
const certificateFile = ref('')
const initialFile = ref('')
const requiredFieldErrors = ref<Record<string, string>>({})
const fileError = ref('')
let fileVersion = 0
let pendingFile: Promise<void> | null = null

const parseDate = (value?: string): Date | null => {
  if (!value) return null
  const date = new Date(value.slice(0, 10) + 'T00:00:00')
  return Number.isNaN(date.getTime()) ? null : date
}

watch(
  () => props.data,
  (data) => {
    fileVersion++
    pendingFile = null
    form.certification_name = data?.certification_name ?? ''
    form.issuing_body = data?.issuing_body ?? ''
    form.certificate_number = data?.certificate_number ?? ''
    form.notes = data?.notes ?? ''
    issueDate.value = parseDate(data?.issue_date)
    expiredate.value = data?.hase_expiry_date ?? false
    expiryDate.value = expiredate.value ? parseDate(data?.expire_date) : null
    certificateFile.value = data?.certificate_file ?? ''
    initialFile.value = certificateFile.value
    fileError.value = ''
    requiredFieldErrors.value = {}
  },
  { immediate: true },
)

const updateData = () => {
  const fields = {
    ...form,
    issue_date: issueDate.value ? formatJoinDate(issueDate.value) : '',
    hase_expiry_date: expiredate.value,
    expire_date:
      expiredate.value && expiryDate.value ? formatJoinDate(expiryDate.value) : undefined,
    certificate_file: certificateFile.value,
  }
  emit(
    'update:data',
    props.data?.id
      ? new EditOrganizationCertificateParams(props.data.id, fields)
      : new AddOrganizationCertificateParams(fields),
  )
}

const updateExpireDate = (checked: boolean) => {
  expiredate.value = checked
  if (!checked) expiryDate.value = null
}

const setFile = (files: File | File[] | null) => {
  const version = ++fileVersion
  const file = Array.isArray(files) ? files[0] : files
  certificateFile.value = ''
  fileError.value = ''
  pendingFile = file
    ? (async () => {
        try {
          const result = (await filesToBase64(file)) as FileBase64
          if (version === fileVersion) certificateFile.value = result.file
        } catch {
          if (version === fileVersion)
            fileError.value = 'Unable to read certificate file. Please select it again.'
        }
      })()
    : null
}

const getMissingFields = () => {
  const errors: Record<string, string> = {}
  if (!form.certification_name.trim()) errors.certification_name = 'Certification name is required'
  if (!form.issuing_body.trim()) errors.issuing_body = 'Issuing body is required'
  if (!form.certificate_number.trim()) errors.certificate_number = 'Certificate number is required'
  if (!issueDate.value) errors.issue_date = 'Issue date is required'
  if (expiredate.value && !expiryDate.value) errors.expire_date = 'Expiry date is required'
  if (!certificateFile.value)
    errors.certificate_file = fileError.value || 'Certificate file is required'
  return errors
}

watch(
  [form, issueDate, expiryDate, expiredate, certificateFile],
  () => {
    const errors = getMissingFields()
    for (const key of Object.keys(requiredFieldErrors.value)) {
      if (!errors[key]) delete requiredFieldErrors.value[key]
    }
    updateData()
  },
  { deep: true, immediate: true },
)

const validateRequiredFields = async () => {
  await pendingFile
  requiredFieldErrors.value = getMissingFields()
  const firstField = Object.keys(requiredFieldErrors.value)[0]
  if (!firstField) {
    updateData()
    return true
  }
  new OpenWarningDilaog(requiredFieldErrors.value[firstField]).openDialog()
  await nextTick()
  document.querySelector<HTMLElement>(`[data-required-field="${firstField}"]`)?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
  return false
}

defineExpose({ validateRequiredFields })
</script>

<template>
  <div
    v-for="field in ['certification_name', 'issuing_body', 'certificate_number'] as const"
    :key="field"
    class="input-wrapper col-span-4 md:col-span-2"
    :data-required-field="field"
  >
    <label :for="field">{{ $t(field) }} <span>*</span></label>
    <input
      :id="field"
      v-model="form[field]"
      type="text"
      class="input"
      :placeholder="$t(field)"
      :aria-invalid="!!requiredFieldErrors[field]"
    />
    <p v-if="requiredFieldErrors[field]" class="required-field-message">
      {{ requiredFieldErrors[field] }}
    </p>
  </div>

  <div class="input-wrapper col-span-4 md:col-span-2" data-required-field="issue_date">
    <label for="issue_date">{{ $t('issue_date') }} <span>*</span></label>
    <DatePicker
      v-model="issueDate"
      input-id="issue_date"
      date-format="yy-mm-dd"
      show-icon
      class="input"
      :manual-input="false"
      :invalid="!!requiredFieldErrors.issue_date"
    />
    <p v-if="requiredFieldErrors.issue_date" class="required-field-message">
      {{ requiredFieldErrors.issue_date }}
    </p>
  </div>

  <div class="input-wrapper col-span-4 md:col-span-2 mt-6">
    <CustomCheckbox
      :index="1"
      :title="`has_expire_date`"
      :checked="expiredate"
      @update:checked="updateExpireDate"
    />
  </div>

  <div
    v-if="expiredate"
    class="input-wrapper col-span-4 md:col-span-2"
    data-required-field="expire_date"
  >
    <label for="expire_date">{{ $t('expire_date') }} <span>*</span></label>
    <DatePicker
      v-model="expiryDate"
      input-id="expire_date"
      date-format="yy-mm-dd"
      show-icon
      class="input"
      :manual-input="false"
      :invalid="!!requiredFieldErrors.expire_date"
    />
    <p v-if="requiredFieldErrors.expire_date" class="required-field-message">
      {{ requiredFieldErrors.expire_date }}
    </p>
  </div>

  <div class="input-wrapper col-span-4" data-required-field="certificate_file">
    <label>{{ $t('certificate_file') }} <span>*</span></label>
    <FileUpload
      :index="1"
      :initial-file-data="initialFile"
      accept="*/*"
      @update:file-data="setFile"
    />
    <p v-if="fileError || requiredFieldErrors.certificate_file" class="required-field-message">
      {{ fileError || requiredFieldErrors.certificate_file }}
    </p>
  </div>

  <div class="input-wrapper col-span-4">
    <label for="notes">{{ $t('notes') }}</label>
    <textarea id="notes" v-model="form.notes" class="input" rows="4" :placeholder="$t('notes')" />
  </div>
</template>

<style scoped>
.required-field-message {
  margin-top: 0.35rem;
  color: var(--status-danger);
  font-size: 0.82rem;
  font-weight: 700;
}
label span{
  color:red;
}
</style>
