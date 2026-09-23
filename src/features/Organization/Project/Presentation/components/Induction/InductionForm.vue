<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import Checkbox from 'primevue/checkbox'
import DatePicker from 'primevue/datepicker'
import { Icon } from '@iconify/vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import MultiImagesInput from '@/shared/FormInputs/MultiImagesInput.vue'
import {
  filesToBase64,
  type FileBase64,
} from '@/base/Presentation/utils/file_to_base_64'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import type OrganizatoinEmployeeModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeModel'
import IndexTraningTopicController from '@/features/Organization/TraningTopic/Presentation/controllers/indexTraningTopicController'
import IndexTraningTopicParams from '@/features/Organization/TraningTopic/Core/params/indexTraningTopicParams'
import type TraningTopicModel from '@/features/Organization/TraningTopic/Data/models/TraningTopicModel'
import AddInductionParams from '../../../Core/params/induction/addInductionParams'
import EditInductionParams from '../../../Core/params/induction/editInductionParams'
import InductionTrainingTopicParams from '../../../Core/params/induction/addInductionTrainingTopicParams'
import InductionOrganisationEmployeeParams from '../../../Core/params/induction/InductionOrganisationEmployeeParams'
import type InductionDetailsModel from '../../../Data/models/Induction/InductionDetailsModel'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'

const emit = defineEmits<{
  (event: 'update:data', value: AddInductionParams | EditInductionParams): void
}>()
const props = defineProps<{ data?: InductionDetailsModel }>()

const employeeController = IndexOrganizatoinEmployeeController.getInstance()
const employeeParams = new IndexOrganizatoinEmployeeParams('', 1, 1000, 1)
const trainingTopicController = IndexTraningTopicController.getInstance()
const trainingTopicParams = new IndexTraningTopicParams('', 1, 1000, 1)

const employees = ref<OrganizatoinEmployeeModel[]>([])
const employeesLoading = ref(false)
const employeesFailed = ref(false)
const trainingTopics = ref<TraningTopicModel[]>([])
const trainingTopicsLoading = ref(false)
const trainingTopicsFailed = ref(false)
const instractor = ref<TitleInterface | null>(null)
const date = ref<Date | null>(null)
const image = ref<string[]>([])
const selectedTrainingTopicIds = ref<Set<number>>(new Set())
const selectedOrganisationEmployees = ref<TitleInterface[]>([])
const manualOrganisationEmployeeName = ref('')
const manualOrganisationEmployeeNames = ref<string[]>([])
const requiredFieldErrors = ref<Record<string, string>>({})

const employeeOptions = computed(() =>
  employees.value.map(
    (employee) =>
      new TitleInterface({
        id: Number(employee.id),
        title: employee.title || employee.name || `Employee #${employee.id}`,
        subtitle: employee.email,
      }),
  ),
)
const selectedTrainingTopicsCount = computed(() => selectedTrainingTopicIds.value.size)
const organisationEmployeeCount = computed(
  () => selectedOrganisationEmployees.value.length + collectManualOrganisationEmployeeNames().length,
)
const allTrainingTopicsSelected = computed(
  () =>
    Boolean(trainingTopics.value.length) &&
    selectedTrainingTopicsCount.value === trainingTopics.value.length,
)
const completionItems = computed(() => [
  {
    key: 'instractor',
    icon: 'uil:user-check',
    done: Boolean(instractor.value?.id),
  },
  {
    key: 'date',
    icon: 'uil:calendar-alt',
    done: Boolean(date.value),
  },
  {
    key: 'organisationEmployee',
    icon: 'uil:users-alt',
    done: Boolean(organisationEmployeeCount.value),
  },
  {
    key: 'trainingTopic',
    icon: 'uil:book-open',
    done: Boolean(selectedTrainingTopicIds.value.size),
  },
])
const completionCount = computed(() => completionItems.value.filter((item) => item.done).length)
const completionPercent = computed(() =>
  `${Math.round((completionCount.value / completionItems.value.length) * 100)}%`,
)

const employeeName = (employee: OrganizatoinEmployeeModel) =>
  employee.title || employee.name || `Employee #${employee.id}`

function normalizeEmployeeName(value?: string | null) {
  return value?.trim().toLowerCase() ?? ''
}

function collectManualOrganisationEmployeeNames() {
  const selectedNames = new Set(
    selectedOrganisationEmployees.value
      .map((employee) => normalizeEmployeeName(employee.title ?? employee.name))
      .filter(Boolean),
  )
  const names = [...manualOrganisationEmployeeNames.value, manualOrganisationEmployeeName.value]
  const uniqueNames = new Set<string>()

  return names
    .map((name) => name.trim())
    .filter((name) => {
      const normalizedName = normalizeEmployeeName(name)
      if (!normalizedName || selectedNames.has(normalizedName) || uniqueNames.has(normalizedName)) {
        return false
      }
      uniqueNames.add(normalizedName)
      return true
    })
}

const buildSelectedEmployees = () => {
  const selectedEmployees = selectedOrganisationEmployees.value
    .map((employee) => Number(employee.id))
    .filter((id) => Number.isFinite(id) && id > 0)
    .map((id) => new InductionOrganisationEmployeeParams(id))

  const manualEmployees = collectManualOrganisationEmployeeNames()
    .map((name) => new InductionOrganisationEmployeeParams(null, name))

  return [...selectedEmployees, ...manualEmployees]
}

const buildSelectedTrainingTopics = () =>
  [...selectedTrainingTopicIds.value].map((id) => new InductionTrainingTopicParams(Number(id)))

const formatDate = (value: Date | null): string | null => {
  if (!value) return null

  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const parseDate = (value: string | null): Date | null => {
  if (!value) return null

  const [year, month, day] = value.split(/[-/]/).map(Number)
  if (year && month && day) return new Date(year, month - 1, day)

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const updateData = () => {
  const instructorId = Number(instractor.value?.id ?? 0)
  const selectedTrainingTopics = buildSelectedTrainingTopics()
  const selectedEmployees = buildSelectedEmployees()
  const selectedImage = image.value.length ? image.value : null

  emit(
    'update:data',
    props.data?.id
      ? new EditInductionParams(
          props.data.id,
          instructorId,
          formatDate(date.value),
          selectedImage,
          selectedTrainingTopics,
          selectedEmployees,
        )
      : new AddInductionParams(
          instructorId,
          formatDate(date.value),
          selectedImage,
          selectedTrainingTopics,
          selectedEmployees,
        ),
  )
}

const setInstructor = (value: TitleInterface | TitleInterface[] | null) => {
  instractor.value = Array.isArray(value) ? null : value
  updateData()
}

const setOrganisationEmployees = (value: TitleInterface | TitleInterface[] | null) => {
  selectedOrganisationEmployees.value = Array.isArray(value) ? value : value ? [value] : []
  const selectedNames = new Set(
    selectedOrganisationEmployees.value
      .map((employee) => normalizeEmployeeName(employee.title ?? employee.name))
      .filter(Boolean),
  )
  manualOrganisationEmployeeNames.value = manualOrganisationEmployeeNames.value.filter(
    (name) => !selectedNames.has(normalizeEmployeeName(name)),
  )
  if (selectedNames.has(normalizeEmployeeName(manualOrganisationEmployeeName.value))) {
    manualOrganisationEmployeeName.value = ''
  }
  updateData()
}

const addManualOrganisationEmployee = () => {
  const employeeName = manualOrganisationEmployeeName.value.trim()
  if (!employeeName) return

  const normalizedName = normalizeEmployeeName(employeeName)
  const isDuplicate = [
    ...manualOrganisationEmployeeNames.value,
    ...selectedOrganisationEmployees.value.map((employee) => employee.title ?? employee.name ?? ''),
  ].some((name) => normalizeEmployeeName(name) === normalizedName)

  manualOrganisationEmployeeName.value = ''
  if (isDuplicate) return

  manualOrganisationEmployeeNames.value = [...manualOrganisationEmployeeNames.value, employeeName]
  updateData()
}

const removeManualOrganisationEmployee = (index: number) => {
  manualOrganisationEmployeeNames.value = manualOrganisationEmployeeNames.value.filter(
    (_, itemIndex) => itemIndex !== index,
  )
  updateData()
}

const setDate = () => {
  updateData()
}

const setImages = async (files: File[]) => {
  if (!files.length) {
    image.value = []
    updateData()
    return
  }

  const encodedFiles = await filesToBase64(files)
  const fileList = (Array.isArray(encodedFiles) ? encodedFiles : [encodedFiles]) as FileBase64[]
  image.value = fileList.map((file) => file.file)
  updateData()
}

const toggleTrainingTopic = (id: number) => {
  const nextSelected = new Set(selectedTrainingTopicIds.value)
  if (nextSelected.has(id)) {
    nextSelected.delete(id)
  } else {
    nextSelected.add(id)
  }
  selectedTrainingTopicIds.value = nextSelected
  updateData()
}

const toggleAllTrainingTopics = () => {
  selectedTrainingTopicIds.value = allTrainingTopicsSelected.value
    ? new Set()
    : new Set(trainingTopics.value.map((topic) => Number(topic.id)))
  updateData()
}

const syncData = () => {
  const data = props.data
  if (!data) {
    updateData()
    return
  }

  date.value = parseDate(data.date)
  image.value = data.image ?? []
  selectedTrainingTopicIds.value = new Set(data.trainingTopic.map((topic) => Number(topic.id)))
  selectedOrganisationEmployees.value = data.organisationEmployee
    .filter((employee) => Number(employee.id) > 0)
    .map((employee) =>
      new TitleInterface({
        id: Number(employee.id),
        title: employeeName(employee),
        subtitle: employee.email,
      }),
    )
  manualOrganisationEmployeeNames.value = data.organisationEmployee
    .filter((employee) => !(Number(employee.id) > 0))
    .map((employee) => (employee.title || employee.name || '').trim())
    .filter((name): name is string => Boolean(name))

  const instructorOption = employeeOptions.value.find(
    (employee) => Number(employee.id) === Number(data.instractor_id),
  )
  instractor.value =
    instructorOption ??
    (data.instractor_id
      ? new TitleInterface({
          id: data.instractor_id,
          title: `Employee #${data.instractor_id}`,
        })
      : null)

  updateData()
}

const fetchEmployees = async () => {
  employeesLoading.value = true
  employeesFailed.value = false
  try {
    await employeeController.getData(employeeParams)
    employees.value = employeeController.state.value.data ?? []
    syncData()
  } catch {
    employeesFailed.value = true
  } finally {
    employeesLoading.value = false
  }
}

const fetchTrainingTopics = async () => {
  trainingTopicsLoading.value = true
  trainingTopicsFailed.value = false
  try {
    await trainingTopicController.getData(trainingTopicParams)
    trainingTopics.value = trainingTopicController.state.value.data ?? []
    syncData()
  } catch {
    trainingTopicsFailed.value = true
  } finally {
    trainingTopicsLoading.value = false
  }
}

const requiredFields = computed(() => [
  {
    key: 'instractor',
    message: 'Instructor is required',
    isMissing: () => !instractor.value?.id,
  },
  {
    key: 'date',
    message: 'Date is required',
    isMissing: () => !date.value,
  },
  {
    key: 'trainingTopic',
    message: 'Training topic is required',
    isMissing: () => !selectedTrainingTopicIds.value.size,
  },
  {
    key: 'organisationEmployee',
    message: 'At least one employee is required',
    isMissing: () => !organisationEmployeeCount.value,
  },
])

const validateRequiredFields = async () => {
  const missedFields = requiredFields.value.filter((field) => field.isMissing())
  requiredFieldErrors.value = Object.fromEntries(
    missedFields.map((field) => [field.key, field.message]),
  )
  if (!missedFields.length) return true

  new OpenWarningDilaog(missedFields[0].message).openDialog()
  await nextTick()
  document
    .querySelector<HTMLElement>(`[data-required-field="${missedFields[0].key}"]`)
    ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  return false
}

watch(
  [() => props.data, employeeOptions],
  () => {
    syncData()
  },
  { immediate: true },
)

defineExpose({ validateRequiredFields })
onMounted(() => {
  void fetchEmployees()
  void fetchTrainingTopics()
})
</script>

<template>
  <div class="induction-form-shell col-span-4">
    <section class="induction-overview" aria-label="Induction form status">
      <div class="induction-overview__main">
        <span class="induction-overview__icon" aria-hidden="true">
          <Icon icon="uil:book-open" />
        </span>
        <div>
          <p>{{ $t('Induction') }}</p>
          <strong>{{ completionCount }} / {{ completionItems.length }} {{ $t('Ready') }}</strong>
        </div>
      </div>
      <div class="induction-overview__track" aria-hidden="true">
        <span :style="{ width: completionPercent }"></span>
      </div>
      <div class="induction-overview__checks">
        <span
          v-for="item in completionItems"
          :key="item.key"
          class="induction-check"
          :class="{ done: item.done }"
        >
          <Icon :icon="item.done ? 'uil:check-circle' : item.icon" />
          {{ $t(item.key) }}
        </span>
      </div>
    </section>

    <section class="induction-section">
      <header class="induction-section__header">
        <span class="induction-section__icon" aria-hidden="true">
          <Icon icon="uil:clipboard-notes" />
        </span>
        <div>
          <h3>{{ $t('Induction') }}</h3>
          <p>{{ $t('instractor') }} · {{ $t('date') }} · {{ $t('organisationEmployee') }}</p>
        </div>
      </header>

      <div class="induction-fields">
        <div class="induction-field" data-required-field="instractor">
          <UpdatedCustomInputSelect
            :model-value="instractor"
            :static-options="employeeOptions"
            label="instractor"
            id="induction-instractor"
            placeholder="Select instructor"
            :reload="false"
            required
            @update:model-value="setInstructor"
          />
          <p v-if="requiredFieldErrors.instractor" class="required-field-message">
            {{ requiredFieldErrors.instractor }}
          </p>
        </div>

        <div class="update_data_picker input-wrapper" data-required-field="date">
          <label class="input-label required" for="induction-date">{{ $t('date') }}</label>
          <div class="induction-date-control">
            <DatePicker
              v-model="date"
              input-id="induction-date"
              input-class="induction-date-input"
              date-format="yy-mm-dd"
              show-icon
              fluid
              :pt="{
                root: { class: 'induction-date-root' },
                dropdown: { class: 'induction-date-button' },
              }"
              :placeholder="$t('select the date')"
              @update:model-value="setDate"
            />
          </div>
          <p v-if="requiredFieldErrors.date" class="required-field-message">
            {{ requiredFieldErrors.date }}
          </p>
        </div>

        <div class="induction-field induction-field--wide" data-required-field="organisationEmployee">
          <UpdatedCustomInputSelect
            :model-value="selectedOrganisationEmployees"
            :static-options="employeeOptions"
            label="organisationEmployee"
            id="induction-organisation-employee"
            placeholder="Select organisation employees"
            :type="2"
            show-select-all-option
            required
            @update:model-value="setOrganisationEmployees"
          />
          <div class="manual-employee-entry">
            <label class="input-label" for="induction-manual-organisation-employee">
              {{ $t('employee_name') }}
            </label>
            <div class="manual-employee-entry__control">
              <input
                id="induction-manual-organisation-employee"
                v-model="manualOrganisationEmployeeName"
                class="manual-employee-entry__input"
                type="text"
                :placeholder="$t('employee_name')"
                @input="updateData()"
                @keydown.enter.prevent="addManualOrganisationEmployee"
              >
              <button
                type="button"
                class="manual-employee-entry__add"
                :disabled="!manualOrganisationEmployeeName.trim()"
                @click.prevent="addManualOrganisationEmployee"
              >
                <Icon icon="uil:plus-circle" />
                {{ $t('add_name') }}
              </button>
            </div>
            <div
              v-if="manualOrganisationEmployeeNames.length"
              class="manual-employee-entry__chips"
            >
              <span
                v-for="(name, index) in manualOrganisationEmployeeNames"
                :key="`${name}-${index}`"
                class="manual-employee-chip"
              >
                {{ name }}
                <button
                  type="button"
                  :aria-label="`Remove ${name}`"
                  @click.prevent="removeManualOrganisationEmployee(index)"
                >
                  <Icon icon="uil:times" />
                </button>
              </span>
            </div>
          </div>
          <p v-if="requiredFieldErrors.organisationEmployee" class="required-field-message">
            {{ requiredFieldErrors.organisationEmployee }}
          </p>
        </div>
      </div>
    </section>

    <section class="induction-section topic-selection" data-required-field="trainingTopic">
      <div class="induction-section__header topic-selection__header">
        <span class="induction-section__icon" aria-hidden="true">
          <Icon icon="uil:book-reader" />
        </span>
        <div>
          <label class="input-label required">{{ $t('trainingTopic') }}</label>
          <p>{{ selectedTrainingTopicsCount }} / {{ trainingTopics.length }} selected</p>
        </div>
        <button
          v-if="trainingTopics.length"
          type="button"
          class="btn btn-secondary topic-selection__toggle"
          @click.prevent="toggleAllTrainingTopics"
        >
          <Icon :icon="allTrainingTopicsSelected ? 'uil:times-circle' : 'uil:check-square'" />
          {{ allTrainingTopicsSelected ? $t('clear') : $t('select_all') }}
        </button>
      </div>

      <div v-if="trainingTopicsLoading" class="topic-selection__empty">
        <Icon icon="uil:spinner-alt" />
        Loading training topics...
      </div>
      <div v-else-if="trainingTopicsFailed" class="topic-selection__empty">
        <Icon icon="uil:exclamation-triangle" />
        Training topics could not be loaded.
        <button type="button" class="retry-button" @click.prevent="fetchTrainingTopics">
          <Icon icon="uil:redo" />
          Retry
        </button>
      </div>
      <div v-else-if="trainingTopics.length" class="topic-selection__grid">
        <label
          v-for="topic in trainingTopics"
          :key="topic.id"
          class="topic-selection__item"
          :class="{ selected: selectedTrainingTopicIds.has(Number(topic.id)) }"
          :for="`induction-training-topic-${topic.id}`"
        >
          <Checkbox
            :input-id="`induction-training-topic-${topic.id}`"
            :model-value="selectedTrainingTopicIds.has(Number(topic.id))"
            binary
            @update:model-value="() => toggleTrainingTopic(Number(topic.id))"
          />
          <span>
            <strong>{{ topic.title }}</strong>
            <small>{{ `Training Topic #${topic.id}` }}</small>
          </span>
        </label>
      </div>
      <div v-else class="topic-selection__empty">
        <Icon icon="uil:file-search-alt" />
        No training topics found.
      </div>

      <p v-if="requiredFieldErrors.trainingTopic" class="required-field-message">
        {{ requiredFieldErrors.trainingTopic }}
      </p>
    </section>

    <section class="induction-section induction-section--evidence">
      <header class="induction-section__header">
        <span class="induction-section__icon" aria-hidden="true">
          <Icon icon="uil:image-upload" />
        </span>
        <div>
          <h3>{{ $t('evidence') }}</h3>
          <p>{{ image.length }} {{ $t('images') }}</p>
        </div>
      </header>
      <div class="induction-upload input-wrapper w-full">
        <MultiImagesInput :initial-images="image" @update:images="setImages" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.update_data_picker label{
justify-content: start;
}
.update_data_picker :deep(.p-datepicker-input){
background: transparent;
}
.induction-form-shell {
  display: grid;
  gap: 16px;
  width: 100%;
}

.induction-overview,
.induction-section {
  min-width: 0;
  border: 1px solid color-mix(in srgb, var(--main-border) 92%, var(--PrimaryColor));
  border-radius: 14px;
  background: var(--surface-1);
}

.induction-overview {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 13px;
  padding: 14px;
  box-shadow: 0 12px 32px color-mix(in srgb, var(--text-primary) 6%, transparent);
}

.induction-overview__main,
.induction-section__header,
.induction-check,
.topic-selection__toggle,
.topic-selection__empty,
.retry-button {
  display: flex;
  align-items: center;
}

.induction-overview__main {
  gap: 12px;
}

.induction-overview__icon,
.induction-section__icon {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 10%, var(--surface-2));
}

.induction-overview__icon {
  width: 44px;
  height: 44px;
  border-radius: 13px;
  font-size: 23px;
}

.induction-overview__main p,
.induction-section__header p {
  margin: 0;
  color: var(--text-soft);
  font-size: 0.78rem;
  font-weight: 600;
}

.induction-overview__main strong {
  display: block;
  margin-top: 3px;
  color: var(--text-strong);
  font-size: 1.05rem;
  font-weight: 800;
}

.induction-overview__track {
  overflow: hidden;
  height: 7px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--main-border) 60%, transparent);
}

.induction-overview__track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    var(--PrimaryColor),
    color-mix(in srgb, var(--status-success) 75%, var(--PrimaryColor))
  );
  transition: width 0.25s ease;
}

.induction-overview__checks {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.induction-check {
  gap: 6px;
  min-height: 30px;
  padding: 6px 9px;
  border: 1px solid var(--main-border);
  border-radius: 9px;
  color: var(--text-soft);
  background: var(--surface-2);
  font-size: 0.78rem;
  font-weight: 700;
}

.induction-check.done {
  border-color: color-mix(in srgb, var(--status-success) 35%, var(--main-border));
  color: color-mix(in srgb, var(--status-success) 82%, var(--text-strong));
  background: color-mix(in srgb, var(--status-success) 8%, var(--surface-1));
}

.induction-section {
  display: grid;
  gap: 15px;
  padding: 16px;
}

.induction-section__header {
  justify-content: space-between;
  gap: 12px;
}

.induction-section__header > div {
  min-width: 0;
  flex: 1;
}

.induction-section__header h3,
.topic-selection__header label {
  margin: 0;
  color: var(--text-strong);
  font-size: 0.95rem;
  font-weight: 800;
}

.induction-section__icon {
  width: 36px;
  height: 36px;
  border-radius: 11px;
  font-size: 20px;
}

.induction-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.induction-field {
  display: grid;
  align-content: start;
  min-width: 0;
  gap: 7px;
}

.induction-field--wide {
  grid-column: 1 / -1;
}

.induction-field :deep(.input-label),
.induction-upload :deep(.input-label),
.input-label {
  color: var(--text-strong);
  font-size: 0.82rem;
  font-weight: 800;
}

.induction-date-field > .input-label {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: fit-content;
  margin: 0;
  text-align: left;
}

.induction-date-field.input-wrapper {
  display: grid !important;
  grid-template-rows: auto auto;
  align-items: stretch;
  justify-items: stretch;
  width: 100%;
  max-width: 100%;
}

.induction-date-control {
  display: block;
  width: 100%;
  min-width: 0;
}

.induction-field :deep(.p-select),
.induction-field :deep(.p-multiselect),
.induction-field :deep(.p-datepicker),
.induction-field :deep(.p-datepicker-input) {
  width: 100% !important;
  max-width: 100%;
}

.induction-date-control :deep(.p-datepicker),
.induction-date-control :deep(.induction-date-root),
.induction-date-control :deep(.p-datepicker-fluid) {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto;
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  align-self: stretch;
}

.induction-date-control :deep(.p-datepicker-input),
.induction-date-control :deep(.induction-date-input) {
  width: 100% !important;
  min-width: 0;
}

.induction-field :deep(.p-select),
.induction-field :deep(.p-multiselect),
.induction-field :deep(.p-datepicker-input) {
  min-height: 48px;
  border-color: color-mix(in srgb, var(--main-border) 88%, var(--PrimaryColor));
  border-radius: 13px;
  background: color-mix(in srgb, var(--surface-2) 45%, var(--surface-1));
  box-shadow: 0 8px 18px color-mix(in srgb, var(--text-primary) 4%, transparent);
}

.induction-field :deep(.p-datepicker-dropdown) {
  border-color: color-mix(in srgb, var(--PrimaryColor) 18%, var(--main-border));
  border-start-end-radius: 13px;
  border-end-end-radius: 13px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 7%, var(--surface-1));
}

.manual-employee-entry {
  display: grid;
  gap: 9px;
  margin-top: 4px;
  padding: 12px;
  border: 1px dashed color-mix(in srgb, var(--PrimaryColor) 18%, var(--main-border));
  border-radius: 13px;
  background: color-mix(in srgb, var(--PrimaryColor) 3%, var(--surface-1));
}

.manual-employee-entry__control {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
}

.manual-employee-entry__input {
  width: 100%;
  min-width: 0;
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid color-mix(in srgb, var(--main-border) 88%, var(--PrimaryColor));
  border-radius: 12px;
  color: var(--text-strong);
  background: color-mix(in srgb, var(--surface-2) 50%, var(--surface-1));
  font-size: 0.86rem;
  font-weight: 700;
  box-shadow: 0 8px 18px color-mix(in srgb, var(--text-primary) 4%, transparent);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.manual-employee-entry__input::placeholder {
  color: var(--text-soft);
  font-weight: 600;
}

.manual-employee-entry__input:focus {
  outline: none;
  border-color: color-mix(in srgb, var(--PrimaryColor) 55%, var(--main-border));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--PrimaryColor) 12%, transparent);
}

.manual-employee-entry__add,
.manual-employee-chip,
.manual-employee-chip button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.manual-employee-entry__add {
  gap: 7px;
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 24%, var(--main-border));
  border-radius: 12px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 7%, var(--surface-1));
  font-size: 0.78rem;
  font-weight: 800;
  white-space: nowrap;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease,
    opacity 0.2s ease;
}

.manual-employee-entry__add:not(:disabled):hover {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--PrimaryColor) 44%, var(--main-border));
  background: color-mix(in srgb, var(--PrimaryColor) 11%, var(--surface-1));
}

.manual-employee-entry__add:disabled {
  cursor: not-allowed;
  opacity: 0.48;
}

.manual-employee-entry__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.manual-employee-chip {
  gap: 7px;
  max-width: 100%;
  min-height: 30px;
  padding: 5px 7px 5px 10px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 20%, var(--main-border));
  border-radius: 999px;
  color: color-mix(in srgb, var(--PrimaryColor) 82%, var(--text-strong));
  background: color-mix(in srgb, var(--PrimaryColor) 8%, var(--surface-1));
  font-size: 0.78rem;
  font-weight: 800;
}

.manual-employee-chip button {
  width: 22px;
  height: 22px;
  border: 0;
  border-radius: 50%;
  color: inherit;
  background: color-mix(in srgb, var(--PrimaryColor) 10%, transparent);
}

.required-field-message {
  margin-top: 0.35rem;
  color: var(--status-danger);
  font-size: 0.82rem;
  font-weight: 700;
}

.topic-selection {
  background:
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--PrimaryColor) 3%, var(--surface-1)),
      var(--surface-1)
    );
}

.topic-selection__header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  justify-content: initial;
  margin-bottom: 0;
}

.topic-selection__header > div {
  justify-self: start;
  text-align: left;
}

.topic-selection__header p {
  margin: 4px 0 0;
  color: var(--text-soft);
  font-size: 0.82rem;
  text-align: left;
}

.topic-selection__toggle {
  gap: 7px;
  justify-content: center;
  min-width: 112px;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 24%, var(--main-border));
  border-radius: 999px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 6%, var(--surface-1));
  font-size: 0.78rem;
  font-weight: 800;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.topic-selection__toggle:hover {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--PrimaryColor) 45%, var(--main-border));
  background: color-mix(in srgb, var(--PrimaryColor) 10%, var(--surface-1));
}

.topic-selection__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 10px;
}

.topic-selection__item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  min-width: 0;
  min-height: 66px;
  padding: 12px 14px;
  border: 1px solid color-mix(in srgb, var(--main-border) 90%, var(--PrimaryColor));
  border-radius: 12px;
  background: color-mix(in srgb, var(--surface-2) 50%, var(--surface-1));
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.topic-selection__item:hover {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--PrimaryColor) 26%, var(--main-border));
  box-shadow: 0 10px 22px color-mix(in srgb, var(--text-primary) 7%, transparent);
}

.topic-selection__item.selected {
  border-color: color-mix(in srgb, var(--PrimaryColor) 58%, var(--main-border));
  background: color-mix(in srgb, var(--PrimaryColor) 9%, var(--surface-1));
  box-shadow: inset 3px 0 0 var(--PrimaryColor);
}

.topic-selection__item span {
  display: grid;
  min-width: 0;
}

.topic-selection__item strong,
.topic-selection__item small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.topic-selection__item strong {
  color: var(--text-strong);
  font-size: 0.9rem;
}

.topic-selection__item small,
.topic-selection__empty {
  color: var(--text-soft);
  font-size: 0.78rem;
}

.topic-selection__empty {
  justify-content: center;
  gap: 8px;
  min-height: 74px;
  border: 1px dashed var(--main-border);
  border-radius: 12px;
  background: var(--surface-2);
  font-weight: 700;
}

.retry-button {
  gap: 5px;
  margin-inline-start: 8px;
  color: var(--PrimaryColor);
  font-weight: 800;
}

.induction-section--evidence {
  gap: 12px;
}

.induction-upload {
  display: block;
  width: 100%;
  min-width: 0;
}

.induction-upload :deep(.multi-image-uploader) {
  display: flex;
  grid-column: auto !important;
  width: 100% !important;
  max-width: none !important;
  gap: 12px;
}

.induction-upload :deep(.input-image) {
  width: 100% !important;
  max-width: none !important;
  border: 1px dashed color-mix(in srgb, var(--PrimaryColor) 22%, var(--main-border));
  border-radius: 13px;
  background: color-mix(in srgb, var(--PrimaryColor) 4%, var(--surface-1));
}

.induction-upload :deep(.input-label-images) {
  display: flex;
  justify-content: center;
  width: 100% !important;
  max-width: none !important;
  min-height: 78px;
}

.induction-upload :deep(.input-label-images > img) {
  flex: 0 0 auto;
}

.induction-upload :deep(.input-label-images > span) {
  color: var(--text-soft);
  font-weight: 700;
  text-align: start;
}

.induction-upload :deep(.image-gallery) {
  padding: 8px;
  border: 1px solid var(--main-border);
  border-radius: 13px;
  background: var(--surface-2);
}

@media (max-width: 720px) {
  .induction-section,
  .induction-overview {
    padding: 13px;
  }

  .induction-fields,
  .topic-selection__grid {
    grid-template-columns: 1fr;
  }

  .topic-selection__header {
    grid-template-columns: auto minmax(0, 1fr);
    align-items: flex-start;
  }

  .topic-selection__toggle {
    grid-column: 1 / -1;
    width: 100%;
  }

  .manual-employee-entry__control {
    grid-template-columns: 1fr;
  }

  .manual-employee-entry__add {
    width: 100%;
  }
}
</style>

<style>
.induction-date-control,
.induction-date-control .p-datepicker,
.induction-date-control .induction-date-root {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
}

.induction-date-control .p-datepicker,
.induction-date-control .induction-date-root {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto !important;
}

.induction-date-control .p-datepicker-input,
.induction-date-control .induction-date-input {
  width: 100% !important;
  min-width: 0 !important;
}

.induction-date-control .p-datepicker-dropdown,
.induction-date-control .induction-date-button {
  flex: 0 0 42px !important;
  width: 42px !important;
  display: none !important;
}
</style>
