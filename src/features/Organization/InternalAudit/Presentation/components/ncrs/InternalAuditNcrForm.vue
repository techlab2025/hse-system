<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import HandleFIlesUpload, {
  type UploadedFile,
} from '@/features/Organization/OrganizationEmployee/Presentation/supcomponents/HandleFIlesUpload.vue'
import IndexAuditStandardParams from '@/features/Organization/AuditStandard/Core/params/indexAuditStandardParams'
import IndexAuditStandardController from '@/features/Organization/AuditStandard/Presentation/controllers/indexAuditStandardController'
import IndexRootCausesParams from '@/features/setting/RootCauses/Core/params/indexRootCausesParams'
import IndexRootCausesController from '@/features/setting/RootCauses/Presentation/controllers/indexRootCausesController'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import { NcrCategoryEnum } from '../../../Core/enums/ncrs/NcrCategoryEnum'
import CreateNcrsParams from '../../../Core/params/ncrs/createNcrsParams'
import EditNcrsParams from '../../../Core/params/ncrs/editNcrsParams'
import NcrAreaUnderReviewParams from '../../../Core/params/ncrs/ncrAreaUnderReviewParams'
import NcrCorrectiveActionParams from '../../../Core/params/ncrs/ncrCorrectiveActionParams'
import NcrInternalAuditTaskParams from '../../../Core/params/ncrs/ncrInternalAuditTaskParams'
import NcrPreventiveActionParams from '../../../Core/params/ncrs/ncrPreventiveActionParams'
import NcrRootCauseParams from '../../../Core/params/ncrs/ncrRootCauseParams'
import type InternalAuditNcrDetailsModel from '../../../Data/models/ncrs/InternalAuditNcrDetailsModel'
import CreateNcrsController from '../../controllers/ncrs/createNcrsController'
import EditNcrsController from '../../controllers/ncrs/editNcrsController'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import { useProjectAppStatusStore } from '@/stores/ProjectStatus'

type ActionForm = {
  correction: string
  assignedTo: TitleInterface | null
  targetDate: string
  actualDate: string
}

type CapaForm = {
  corrective: ActionForm
  preventive: ActionForm
}

const props = withDefaults(
  defineProps<{
    internalAuditPlanId: number
    auditSerialName: string
    areaOptions: TitleInterface[]
    details?: InternalAuditNcrDetailsModel | null
    readonly?: boolean
    embedded?: boolean
  }>(),
  { details: null, readonly: false, embedded: false },
)

const emit = defineEmits<{
  close: []
  created: []
  edited: []
}>()

const createController = CreateNcrsController.getInstance()
const editController = EditNcrsController.getInstance()
const employeeController = IndexOrganizatoinEmployeeController.getInstance()
const rootCauseController = IndexRootCausesController.getInstance()
const auditStandardController = IndexAuditStandardController.getInstance()
const employeeParams = new IndexOrganizatoinEmployeeParams('', 1, 1000, 0)
const rootCauseParams = new IndexRootCausesParams('', 1, 1000, 0)
const auditStandardParams = new IndexAuditStandardParams('', 1, 1000, 0)

const category = ref<NcrCategoryEnum>(NcrCategoryEnum.MINOR_NC)
const serialNumber = ref('')
const projectStatus = useProjectAppStatusStore()
const areaUnderReviews = ref<TitleInterface[]>([])
const auditStandard = ref<TitleInterface | null>(null)
const requirementReference = ref('')
const description = ref('')
const immediateAction = ref('')
const rootCauses = ref<TitleInterface[]>([])
const attachments = ref<string[]>([])
const attachmentFileNames = ref<string[]>([])
const capas = ref<CapaForm[]>([createCapa()])
const feedback = ref('')
const isSaving = computed(() => createController.isDataLoading() || editController.isDataLoading())
const isExisting = computed(() => Boolean(props.details?.id))
const isReadOnly = computed(() => props.readonly || Boolean(props.details?.hasResult))

function titles(value: TitleInterface[]): string {
  return value
    .map((item) => item.title)
    .filter(Boolean)
    .join(', ')
}

function emptyAction(): ActionForm {
  return {
    correction: '',
    assignedTo: null,
    targetDate: '',
    actualDate: formatJoinDate(new Date()),
  }
}

function createCapa(): CapaForm {
  return { corrective: emptyAction(), preventive: emptyAction() }
}

function normalizeSingle(value: TitleInterface | TitleInterface[] | null): TitleInterface | null {
  return Array.isArray(value) ? (value[0] ?? null) : value
}

function normalizeMultiple(value: TitleInterface | TitleInterface[] | null): TitleInterface[] {
  return Array.isArray(value) ? value : value ? [value] : []
}

function setCorrectiveAssignee(index: number, value: TitleInterface | TitleInterface[] | null) {
  capas.value[index]!.corrective.assignedTo = normalizeSingle(value)
}

function setPreventiveAssignee(index: number, value: TitleInterface | TitleInterface[] | null) {
  capas.value[index]!.preventive.assignedTo = normalizeSingle(value)
}

function setAttachments(files: UploadedFile[]) {
  attachments.value = files.map((file) => file.base64).filter(Boolean)
  attachmentFileNames.value = files.map((file) => file.name)
}

function initializeForm(details?: InternalAuditNcrDetailsModel | null) {
  feedback.value = ''
  category.value = details?.category ?? NcrCategoryEnum.MINOR_NC
  serialNumber.value = details?.serialNumber ?? ''
  areaUnderReviews.value = details?.areaUnderReviews ?? []
  auditStandard.value = details?.auditStandard ?? null
  requirementReference.value = details?.requirementReference ?? ''
  description.value = details?.description ?? ''
  immediateAction.value = details?.immediateAction ?? ''
  rootCauses.value = details?.rootCauses ?? []
  attachments.value = details?.attachments ?? []
  attachmentFileNames.value = details?.attachmentFileNames ?? []
  capas.value = details?.tasks.length
    ? details.tasks.map((task) => ({
        corrective: {
          correction: task.corrective.text,
          assignedTo: task.corrective.assignedTo,
          targetDate: task.corrective.targetDate,
          actualDate: task.corrective.actualDate,
        },
        preventive: {
          correction: task.preventive.text,
          assignedTo: task.preventive.assignedTo,
          targetDate: task.preventive.targetDate,
          actualDate: task.preventive.actualDate,
        },
      }))
    : [createCapa()]
}

function validate(): boolean {
  const today = new Date().toISOString().slice(0, 10)
  if (!areaUnderReviews.value.length || !auditStandard.value) {
    feedback.value = 'Area under review and audit standard are required.'
  } else if (!requirementReference.value.trim() || !description.value.trim()) {
    feedback.value = 'Requirement reference and description are required.'
  } else if (!immediateAction.value.trim()) {
    feedback.value = 'Correction / immediate action is required.'
  } else if (!rootCauses.value.length) {
    feedback.value = 'Select at least one root cause.'
  } else if (
    capas.value.some(
      (capa) =>
        !capa.corrective.correction.trim() ||
        !capa.corrective.assignedTo ||
        !capa.corrective.targetDate ||
        !capa.preventive.correction.trim() ||
        !capa.preventive.assignedTo ||
        !capa.preventive.targetDate,
    )
  ) {
    feedback.value =
      'Complete corrective and preventive actions, assigned employees, and target dates.'
  } else if (
    capas.value.some(
      (capa) =>
        (capa.corrective.actualDate && capa.corrective.actualDate > today) ||
        (capa.preventive.actualDate && capa.preventive.actualDate > today),
    )
  ) {
    feedback.value = 'Actual dates cannot be later than today.'
  } else {
    feedback.value = ''
    return true
  }
  return false
}

function buildParams(): CreateNcrsParams {
  return new CreateNcrsParams(
    category.value,
    areaUnderReviews.value.map((area) => new NcrAreaUnderReviewParams(Number(area.id))),
    Number(auditStandard.value?.id),
    requirementReference.value,
    description.value,
    immediateAction.value,
    rootCauses.value.map((rootCause) => new NcrRootCauseParams(Number(rootCause.id))),
    capas.value.map(
      (capa) =>
        new NcrInternalAuditTaskParams(
          new NcrCorrectiveActionParams(
            capa.corrective.correction,
            Number(capa.corrective.assignedTo?.id ?? 0),
            capa.corrective.targetDate,
            capa.corrective.actualDate,
          ),
          new NcrPreventiveActionParams(
            capa.preventive.correction,
            Number(capa.preventive.assignedTo?.id ?? 0),
            capa.preventive.targetDate,
            capa.preventive.actualDate,
          ),
        ),
    ),
    attachments.value,
    props.internalAuditPlanId,
    false,
    serialNumber.value.trim(),
  )
}

async function submit() {
  if (isReadOnly.value || isSaving.value || !validate()) return
  const params = buildParams()
  if (isExisting.value) {
    await editController.edit(
      new EditNcrsParams(
        props.details!.id,
        params.ncrsCategory,
        params.areaUnderReviews,
        params.auditStandardId,
        params.requirementReference,
        params.description,
        params.immediateAction,
        params.rootCauses,
        params.internalAuditTasks,
        params.attachments,
        params.internalAuditId,
        params.isDraft,
        params.serialNumber,
      ),
    )
    if (editController.isDataSuccess()) {
      emit('edited')
      return
    }
    feedback.value = editController.state.value.error?.title ?? 'Unable to update NCR.'
    return
  }
  await createController.create(params)
  if (createController.isDataSuccess()) {
    emit('created')
    return
  }
  feedback.value = createController.state.value.error?.title ?? 'Unable to create NCR.'
}

watch(() => props.details, initializeForm, { immediate: true })
</script>

<template>
  <component :is="embedded ? 'div' : 'form'" class="ncr-form" @submit.prevent="submit">
    <p v-if="feedback" class="message error" role="alert">{{ feedback }}</p>

    <section class="form-section">
      <div class="section-heading">
        <span>01</span>
        <div>
          <h3>NCR details</h3>
          <p>Record the finding and applicable requirement.</p>
        </div>
      </div>
      <div class="form-grid">
        <label class="field">
          <span>Audit No.</span>
          <input :value="auditSerialName" type="text" disabled placeholder="Audit serial name" />
        </label>
        <label v-if="isExisting" class="field">
          <span>NCR</span>
          <input :value="details?.ncr || `NCR-${details?.id}`" type="text" disabled />
        </label>
        <label class="field">
          <span>Serial Number</span>
          <input
            v-model="serialNumber"
            type="text"
            :disabled="isReadOnly || projectStatus.isSerialNumberAuto()"
            :placeholder="
              projectStatus.isSerialNumberAuto()
                ? 'You can leave it (auto-generated)'
                : 'Enter Your Serial Number'
            "
          />
        </label>
        <label class="field">
          <span>Category <b>*</b></span>
          <select v-model="category" :disabled="isReadOnly">
            <option :value="NcrCategoryEnum.MINOR_NC">Minor NC</option>
            <option :value="NcrCategoryEnum.MAJOR_NC">Major NC</option>
          </select>
        </label>
        <label v-if="isReadOnly" class="field">
          <span>Area under review</span>
          <input :value="titles(areaUnderReviews)" type="text" disabled />
        </label>
        <UpdatedCustomInputSelect
          v-else
          class="field"
          :model-value="areaUnderReviews"
          :static-options="areaOptions"
          type="multiselect"
          label="Area under review"
          placeholder="Select departments"
          required
          @update:model-value="areaUnderReviews = normalizeMultiple($event)"
        />
        <label v-if="isReadOnly" class="field">
          <span>Audit standard</span>
          <select disabled>
            <option>{{ auditStandard?.title || '—' }}</option>
          </select>
        </label>
        <UpdatedCustomInputSelect
          v-else
          class="field"
          :model-value="auditStandard"
          :controller="auditStandardController"
          :params="auditStandardParams"
          label="Audit standard"
          placeholder="Select audit standard"
          required
          @update:model-value="auditStandard = normalizeSingle($event)"
        />
        <label class="field field-wide">
          <span>Requirement reference <strong>(optional)</strong></span>
          <input
            v-model="requirementReference"
            type="text"
            :disabled="isReadOnly"
            placeholder="Enter requirement reference"
          />
        </label>
        <label class="field field-wide">
          <span>Description <b>*</b></span>
          <textarea
            v-model="description"
            rows="4"
            :disabled="isReadOnly"
            placeholder="Describe the non-conformance"
          ></textarea>
        </label>
        <label class="field field-wide">
          <span>Correction / Immediate action <b>*</b></span>
          <textarea
            v-model="immediateAction"
            rows="3"
            :disabled="isReadOnly"
            placeholder="Describe the immediate action taken"
          ></textarea>
        </label>
        <label v-if="isReadOnly" class="field field-wide">
          <span>Root causes</span>
          <input :value="titles(rootCauses)" type="text" disabled />
        </label>
        <UpdatedCustomInputSelect
          v-else
          class="field field-wide"
          :model-value="rootCauses"
          :controller="rootCauseController"
          :params="rootCauseParams"
          type="multiselect"
          label="Root causes"
          placeholder="Select root causes"
          @update:model-value="rootCauses = normalizeMultiple($event)"
        />
      </div>
    </section>

    <section class="form-section">
      <div class="section-heading">
        <span>02</span>
        <div><h3>Add corrective and preventive actions.</h3></div>
      </div>
      <article v-for="(capa, index) in capas" :key="index" class="capa-card">
        <header>
          <strong>{{ index + 1 }}</strong>
          <button
            v-if="!isReadOnly && capas.length > 1"
            type="button"
            class="remove-button"
            @click="capas.splice(index, 1)"
          >
            Remove
          </button>
        </header>
        <div class="action-block">
          <h4>Corrective action</h4>
          <div class="form-grid">
            <label class="field field-wide">
              <span>Corrective action <b>*</b></span>
              <textarea
                v-model="capa.corrective.correction"
                rows="3"
                :disabled="isReadOnly"
                placeholder="Describe the corrective action"
              ></textarea>
            </label>
            <label v-if="isReadOnly" class="field">
              <span>Assigned to</span>
              <select disabled>
                <option>{{ capa.corrective.assignedTo?.title || '—' }}</option>
              </select>
            </label>
            <UpdatedCustomInputSelect
              v-else
              class="field"
              :model-value="capa.corrective.assignedTo"
              :controller="employeeController"
              :params="employeeParams"
              label="Assigned to"
              placeholder="Select employee"
              required
              @update:model-value="setCorrectiveAssignee(index, $event)"
            />
            <label class="field">
              <span>Target date <b>*</b></span>
              <input v-model="capa.corrective.targetDate" type="date" :disabled="isReadOnly" />
            </label>
            <label class="field disabled">
              <span>Actual date</span>
              <input
                v-model="capa.corrective.actualDate"
                type="date"
                :max="new Date().toISOString().slice(0, 10)"
                :disabled="isReadOnly"
              />
            </label>
          </div>
        </div>
        <div class="action-block preventive">
          <h4>Preventive action</h4>
          <div class="form-grid">
            <label class="field field-wide">
              <span>Preventive action <b>*</b></span>
              <textarea
                v-model="capa.preventive.correction"
                rows="3"
                :disabled="isReadOnly"
                placeholder="Describe the preventive action"
              ></textarea>
            </label>
            <label v-if="isReadOnly" class="field">
              <span>Assigned to</span>
              <select disabled>
                <option>{{ capa.preventive.assignedTo?.title || '—' }}</option>
              </select>
            </label>
            <UpdatedCustomInputSelect
              v-else
              class="field"
              :model-value="capa.preventive.assignedTo"
              :controller="employeeController"
              :params="employeeParams"
              label="Assigned to"
              placeholder="Select employee"
              required
              @update:model-value="setPreventiveAssignee(index, $event)"
            />
            <label class="field">
              <span>Target date <b>*</b></span>
              <input v-model="capa.preventive.targetDate" type="date" :disabled="isReadOnly" />
            </label>
            <label class="field disabled">
              <span>Actual date</span>
              <input
                v-model="capa.preventive.actualDate"
                type="date"
                :max="new Date().toISOString().slice(0, 10)"
                :disabled="isReadOnly"
              />
            </label>
          </div>
        </div>
      </article>
    </section>

    <section class="form-section">
      <div class="section-heading">
        <span>03</span>
        <div>
          <h3>Attachments</h3>
          <p>Add supporting evidence files.</p>
        </div>
      </div>
      <ul v-if="isReadOnly && details?.media.length" class="attachment-list">
        <li v-for="media in details.media" :key="media.id || media.url">
          <img width="120" :src="media.url" :alt="media.fileName" />
          <!-- <a :href="media.url" target="_blank" rel="noopener noreferrer">
            {{ media.fileName }}
          </a> -->
        </li>
      </ul>
      <p v-else-if="isReadOnly" class="empty-attachments">No attachments.</p>
      <HandleFIlesUpload
        v-else
        label="NCR attachments"
        accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
        :multiple="true"
        :max-files="10"
        :file="attachments"
        :file-names="attachmentFileNames"
        @change="setAttachments"
      />
    </section>

    <footer v-if="!embedded" class="form-actions">
      <button class="secondary-button" type="button" :disabled="isSaving" @click="emit('close')">
        {{ isExisting ? 'Close' : 'Cancel' }}
      </button>
      <button v-if="!isReadOnly" class="primary-button" type="submit" :disabled="isSaving">
        {{
          isSaving ? (isExisting ? 'Saving…' : 'Creating…') : isExisting ? 'Edit NCR' : 'Submit NCR'
        }}
      </button>
    </footer>
  </component>
</template>

<style scoped>
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
.attachment-list {
  display: flex !important;

  li {
    display: flex !important;
    img {
      border-radius: 12px;
    }
  }
}
:deep(.upload-area) {
  border: 1px solid lightgray !important;
}
label:has(textarea) {
  grid-column: span 3 !important;
}
.ncr-form {
  display: grid;
  gap: 18px;
}
.form-section {
  padding: 22px;
  border: 1px solid var(--main-border, #d9e1df);
  border-radius: 18px;
  background: var(--card-bg, #fff);
}
.section-heading {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
}
.section-heading > span {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 10px;
  background: color-mix(in srgb, var(--PrimaryColor, #087d80) 12%, transparent);
  color: var(--PrimaryColor, #087d80);
  font-weight: 700;
}
.section-heading h3 {
  margin: 0 0 4px;
  color: var(--text-primary, #172334);
  font-size: 1rem;
}
.section-heading p {
  margin: 0;
  color: var(--text-soft, #687777);
  font-size: 0.86rem;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
.field {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 7px;
}
.field-wide {
  grid-column: span 2;
}
.field > span {
  font-size: 0.82rem;
  font-weight: 650;
}
.field b {
  color: #b42318;
}
.field strong {
  font-size: 9px;
}
.field input,
.field select,
.field textarea {
  width: 100%;
  border: 1px solid var(--main-border, #cbd8d6);
  border-radius: 10px;
  background: transparent;
  padding: 10px 12px;
  color: var(--text-primary, #172334);
  outline: none;
}
.field input:disabled,
.field select:disabled,
.field textarea:disabled {
  cursor: default;
  opacity: 1;
  background: var(--surface-ground, #f4f7f6);
  color: var(--text-soft, #687777);
}
.attachment-list {
  display: grid;
  gap: 8px;
  margin: 0;
  padding-inline-start: 20px;
}
.attachment-list a {
  color: var(--PrimaryColor, #087d80);
  overflow-wrap: anywhere;
}
.empty-attachments {
  margin: 0;
  color: var(--text-soft, #687777);
}
.field input:focus,
.field select:focus,
.field textarea:focus {
  border-color: var(--PrimaryColor, #087d80);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--PrimaryColor, #087d80) 10%, transparent);
}
.capa-card {
  overflow: hidden;
  margin-bottom: 16px;
  border: 1px solid var(--main-border, #d9e1df);
  border-radius: 14px;
}
.capa-card > header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: color-mix(in srgb, var(--PrimaryColor, #087d80) 7%, transparent);
}
.remove-button {
  border: 0;
  border-radius: 9px;
  background: transparent;
  padding: 10px 15px;
  color: #b42318;
  font-weight: 650;
}
.action-block {
  padding: 18px;
}
.action-block.preventive {
  border-top: 1px solid var(--main-border, #d9e1df);
  background: color-mix(in srgb, var(--PrimaryColor, #087d80) 2%, transparent);
}
.action-block h4 {
  margin: 0 0 14px;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.primary-button,
.secondary-button {
  border-radius: 9px;
  padding: 10px 15px;
  font-weight: 650;
}
.primary-button {
  border: 1px solid var(--PrimaryColor, #087d80);
  background: var(--PrimaryColor, #087d80);
  color: #fff;
}
.secondary-button {
  border: 1px solid var(--PrimaryColor, #087d80);
  background: transparent;
  color: var(--PrimaryColor, #087d80);
}
button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
.message {
  margin: 0;
  border-radius: 10px;
  padding: 12px 16px;
}
.message.error {
  background: #fff0f0;
  color: #b42318;
}
@media (max-width: 900px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }
  .field-wide {
    grid-column: span 2;
  }
}
@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .field-wide {
    grid-column: span 1;
  }
  .form-section {
    padding: 16px;
  }
}
</style>
