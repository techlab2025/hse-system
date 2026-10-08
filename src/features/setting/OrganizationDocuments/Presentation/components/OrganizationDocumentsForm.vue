<script lang="ts" setup>
import { nextTick, reactive, ref, watch } from 'vue'
import DatePicker from 'primevue/datepicker'
import FileUpload from '@/shared/FormInputs/FileUpload.vue'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import IndexDocumentCategoryController from '@/features/Organization/DocumentCategory/Presentation/controllers/indexDocumentCategoryController'
import IndexDocumentCategoryParams from '@/features/Organization/DocumentCategory/Core/params/indexDocumentCategoryParams'
import { filesToBase64, type FileBase64 } from '@/base/Presentation/utils/file_to_base_64'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import type OrganizationDocumentsDetailsModel from '../../Data/models/OrganizationDocumentsDetailsModel'
import AddOrganizationDocumentsParams from '../../Core/params/addOrganizationDocumentsParams'
import EditOrganizationDocumentsParams from '../../Core/params/editOrganizationDocumentsParams'

const props = defineProps<{ data?: OrganizationDocumentsDetailsModel }>()
const emit = defineEmits<{
  'update:data': [params: AddOrganizationDocumentsParams | EditOrganizationDocumentsParams]
}>()

const form = reactive({
  document_title: '',
  document_ref: '',
  document_version: '',
  notes: '',
})
const issueDate = ref<Date | null>(null)
const reviewDate = ref<Date | null>(null)
const documentCategory = ref<TitleInterface | null>(null)
const indexDocumentCategoryController = IndexDocumentCategoryController.getInstance()
const indexDocumentCategoryParams = new IndexDocumentCategoryParams('', 1, 100, 0)
const documentFile = ref('')
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
    form.document_title = data?.document_title ?? ''
    form.document_ref = data?.document_ref ?? ''
    form.document_version = data?.document_version ?? ''
    form.notes = data?.notes ?? ''
    issueDate.value = parseDate(data?.issue_date)
    reviewDate.value = parseDate(data?.nex_review_date)
    documentCategory.value = data?.documentCategory ?? null
    documentFile.value = data?.document_file ?? ''
    initialFile.value = documentFile.value
    fileError.value = ''
    requiredFieldErrors.value = {}
  },
  { immediate: true },
)

const updateData = () => {
  const fields = {
    ...form,
    issue_date: issueDate.value ? formatJoinDate(issueDate.value) : '',
    nex_review_date: reviewDate.value ? formatJoinDate(reviewDate.value) : '',
    document_category_id: documentCategory.value?.id ?? 0,
    document_file: documentFile.value,
  }
  emit(
    'update:data',
    props.data?.id
      ? new EditOrganizationDocumentsParams(props.data.id, fields)
      : new AddOrganizationDocumentsParams(fields),
  )
}

const updateDocumentCategory = (value: TitleInterface | TitleInterface[] | null) => {
  documentCategory.value = Array.isArray(value) ? (value[0] ?? null) : value
}

const setFile = (files: File | File[] | null) => {
  const version = ++fileVersion
  const file = Array.isArray(files) ? files[0] : files
  documentFile.value = ''
  fileError.value = ''
  pendingFile = file
    ? (async () => {
        try {
          const result = (await filesToBase64(file)) as FileBase64
          if (version === fileVersion) documentFile.value = result.file
        } catch {
          if (version === fileVersion)
            fileError.value = 'Unable to read document file. Please select it again.'
        }
      })()
    : null
}

const getMissingFields = () => {
  const errors: Record<string, string> = {}
  if (!form.document_title.trim()) errors.document_title = 'Document title is required'
  if (!form.document_ref.trim()) errors.document_ref = 'Document reference is required'
  if (!form.document_version.trim()) errors.document_version = 'Document version is required'
  if (!issueDate.value) errors.issue_date = 'Issue date is required'
  if (!reviewDate.value) errors.nex_review_date = 'Next review date is required'
  if (!documentCategory.value?.id) errors.document_category_id = 'Document category is required'
  if (!documentFile.value) errors.document_file = fileError.value || 'Document file is required'
  return errors
}

watch(
  [form, issueDate, reviewDate, documentCategory, documentFile],
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
    v-for="field in ['document_title', 'document_ref', 'document_version'] as const"
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

  <div class="input-wrapper col-span-4 md:col-span-2" data-required-field="nex_review_date">
    <label for="nex_review_date">{{ $t('nex_review_date') }} <span>*</span></label>
    <DatePicker
      v-model="reviewDate"
      input-id="nex_review_date"
      date-format="yy-mm-dd"
      show-icon
      class="input"
      :manual-input="false"
      :invalid="!!requiredFieldErrors.nex_review_date"
    />
    <p v-if="requiredFieldErrors.nex_review_date" class="required-field-message">
      {{ requiredFieldErrors.nex_review_date }}
    </p>
  </div>

  <div class="input-wrapper col-span-4 md:col-span-2" data-required-field="document_category_id">
    <UpdatedCustomInputSelect
      id="document_category_id"
      label="document_category"
      :required="true"
      :model-value="documentCategory"
      :controller="indexDocumentCategoryController"
      :params="indexDocumentCategoryParams"
      :placeholder="$t('select_document_category')"
      @update:model-value="updateDocumentCategory"
    />
    <p v-if="requiredFieldErrors.document_category_id" class="required-field-message">
      {{ requiredFieldErrors.document_category_id }}
    </p>
  </div>

  <div class="input-wrapper col-span-4" data-required-field="document_file">
    <label>{{ $t('document_file') }} <span>*</span></label>
    <FileUpload
      :index="1"
      :initial-file-data="initialFile"
      accept="*/*"
      @update:file-data="setFile"
    />
    <p v-if="fileError || requiredFieldErrors.document_file" class="required-field-message">
      {{ fileError || requiredFieldErrors.document_file }}
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
label span {
  color: red;
}
</style>
