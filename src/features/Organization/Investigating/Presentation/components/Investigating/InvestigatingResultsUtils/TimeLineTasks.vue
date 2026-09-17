<script setup lang="ts">
import TitleInterface from '@/base/Data/Models/title_interface'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import AddAnswer from '@/shared/icons/AddAnswer.vue'
import DeleteItemAction from '@/shared/icons/DeleteItemAction.vue'
import { onMounted, ref } from 'vue'
import DatePicker from 'primevue/datepicker'
import ToggleSwitch from 'primevue/toggleswitch'
import FieldHelpIcon from '@/shared/FormInputs/FieldHelpIcon.vue'

const emit = defineEmits(['update:data'])

const {
  allowOngoing,
  capaStyles,
  fieldPrefix,
  staticEmployeeOptions,
  useStaticEmployeeOptions,
  validationErrors,
} = defineProps<{
  allowOngoing?: boolean
  capaStyles?: boolean
  fieldPrefix?: string
  staticEmployeeOptions?: TitleInterface[]
  useStaticEmployeeOptions?: boolean
  validationErrors?: Record<string, string>
}>()
const fetchOriganizatioEmployeeController = IndexOrganizatoinEmployeeController.getInstance()
const fetchOrganizationEmployeeParams = new IndexOrganizatoinEmployeeParams('', 1, 10, 1)
const employeeOptions = ref<TitleInterface[]>([])
const createEmptyAnswer = () => ({
  text: ' ',
  employee: new TitleInterface({ id: 0, title: '' }),
  date: capaStyles ? null : new Date(),
  isGoing: false,
  ResponablePerson: new TitleInterface({ id: 0, title: '' }),
})

const Answers = ref([createEmptyAnswer()])
type TaskField = 'text' | 'employee' | 'date' | 'responsible'

const fieldKey = (index: number, field: TaskField) =>
  fieldPrefix ? `${fieldPrefix}.${index}.${field}` : ''
const fieldError = (index: number, field: TaskField) =>
  validationErrors?.[fieldKey(index, field)] ?? ''
const fieldId = (index: number, field: TaskField | 'ongoing') =>
  `${(fieldPrefix || 'timeline-task').replace(/[^a-zA-Z0-9_-]/g, '-')}-${field}-${index}`

const addNewAnswer = () => {
  Answers.value.push({
    ...createEmptyAnswer(),
    text: '',
  })
  UpdateData()
}

const DeleteItem = (index: number) => {
  if (Answers.value.length <= 1) return
  Answers.value.splice(index, 1)
  UpdateData()
}

const UpdateData = () => {
  emit('update:data', Answers.value)
}

const updateOngoing = (item: (typeof Answers.value)[number]) => {
  if (item.isGoing) {
    item.date = null
  }

  UpdateData()
}

const fetchEmployees = async () => {
  if (useStaticEmployeeOptions) {
    employeeOptions.value = staticEmployeeOptions ?? []
    return
  }

  employeeOptions.value = await fetchOriganizatioEmployeeController.fetch(
    fetchOrganizationEmployeeParams,
  )
}

onMounted(async () => {
  await fetchEmployees()
  emit('update:data', Answers.value)
})
</script>
<template>
  <div class="template-container">
    <div class="heirarchy-info">
      <div class="timeline-container">
        <div class="timeline-wrapper">
          <div class="timeline-line"></div>

          <div
            class="timeline-item"
            v-for="(item, index) in Answers"
            :key="index"
            :class="{ active: index === 0 }"
            :style="{ animationDelay: `${index * 0.15}s` }"
          >
            <div class="timeline-marker">
              <div class="timeline-dot">
                <div class="timeline-dot-inner"></div>
                <div class="timeline-pulse"></div>
              </div>

              <div class="timeline-icon">
                <DeleteItemAction
                  class="cursor-pointer"
                  v-if="Answers.length > 1"
                  @click="DeleteItem(index)"
                />
                <AddAnswer
                  v-if="index === Answers.length - 1"
                  @click="addNewAnswer"
                  class="cursor-pointer"
                />
              </div>
            </div>

            <div class="timeline-content" :class="{ 'capa-timeline-content': capaStyles }">
              <div
                class="timeline-content-text input-wrapper"
                :class="{ 'field-has-error': fieldError(index, 'text') }"
                :data-required-field="fieldKey(index, 'text') || undefined"
              >
                <div class="flex items-center gap-2">
                  <label :for="fieldId(index, 'text')">Action</label
                  ><FieldHelpIcon
                    text="Describe the specific corrective or preventive action to be completed."
                  />
                </div>
                <input
                  type="text"
                  :id="fieldId(index, 'text')"
                  v-model="item.text"
                  class="input"
                  placeholder="add your title"
                  :aria-invalid="Boolean(fieldError(index, 'text'))"
                  @input="UpdateData"
                />
                <p v-if="fieldError(index, 'text')" class="required-field-message">
                  {{ fieldError(index, 'text') }}
                </p>
              </div>
              <div class="timeline-contect-select" :class="{ 'capa-timeline-select': capaStyles }">
                <div
                  class="input-wrapper"
                  :class="{ 'field-has-error': fieldError(index, 'employee') }"
                  :data-required-field="fieldKey(index, 'employee') || undefined"
                >
                  <CustomSelectInput
                    :staticOptions="employeeOptions"
                    v-model="item.employee"
                    placeholder="Select Employee"
                    class="mt-4 mr-2 input"
                    label="Implementation Responsibility "
                    help-text="Select the person responsible for carrying out this action."
                    :reload="false"
                    @update:model-value="UpdateData"
                  />
                  <p v-if="fieldError(index, 'employee')" class="required-field-message">
                    {{ fieldError(index, 'employee') }}
                  </p>
                </div>
                <div
                  class="flex flex-col gap-2 input-wrapper"
                  :class="{ 'field-has-error': fieldError(index, 'date') }"
                  :data-required-field="fieldKey(index, 'date') || undefined"
                >
                  <div v-if="allowOngoing" class="ongoing-switch-row">
                    <div>
                      <label :for="fieldId(index, 'ongoing')">{{ $t('Ongoing') }}</label>
                      <small>{{ $t('No completion date required') }}</small>
                    </div>
                    <ToggleSwitch
                      v-model="item.isGoing"
                      :input-id="fieldId(index, 'ongoing')"
                      @update:model-value="updateOngoing(item)"
                    />
                  </div>
                  <div v-if="!item.isGoing" class="flex items-center gap-2">
                    <label :for="fieldId(index, 'date')"
                      >Expected Time for Implementation</label
                    ><FieldHelpIcon
                      text="Select the target date by which this action should be completed."
                    />
                  </div>
                  <DatePicker
                    v-if="!item.isGoing"
                    v-model="item.date"
                    class="mt-4 mr-2 input date-picker"
                    placeholder="Select Date"
                    @update:model-value="UpdateData"
                    :input-id="fieldId(index, 'date')"
                  />
                  <p v-if="fieldError(index, 'date')" class="required-field-message">
                    {{ fieldError(index, 'date') }}
                  </p>
                </div>
                <div
                  class="input-wrapper"
                  :class="{ 'field-has-error': fieldError(index, 'responsible') }"
                  :data-required-field="fieldKey(index, 'responsible') || undefined"
                >
                  <CustomSelectInput
                    :staticOptions="employeeOptions"
                    v-model="item.ResponablePerson"
                    placeholder="Select Responable Person"
                    class="mt-4 mr-2 input"
                    label="Monitoring Responsibility "
                    help-text="Select the person responsible for verifying progress and confirming completion."
                    :reload="false"
                    @update:model-value="UpdateData"
                  />
                  <p v-if="fieldError(index, 'responsible')" class="required-field-message">
                    {{ fieldError(index, 'responsible') }}
                  </p>
                </div>
              </div>
              <!-- </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.template-container,
.heirarchy-info,
.timeline-container,
.timeline-wrapper,
.timeline-item,
.timeline-content {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
}

.timeline-content .input-wrapper,
.timeline-content input {
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.capa-timeline-content {
  gap: 12px;
}

.capa-timeline-content .timeline-content-text,
.capa-timeline-select .input-wrapper {
  width: 100%;
}

.capa-timeline-select {
  display: grid !important;
  grid-template-columns: 1fr !important;
  gap: 12px !important;
  width: 100%;
}

.ongoing-switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid var(--brand-primary-100);
  border-radius: 10px;
  background: var(--brand-primary-50);
}

.ongoing-switch-row > div {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
}

.ongoing-switch-row label {
  color: var(--text-strong);
  font-weight: 700;
}

.ongoing-switch-row small {
  color: var(--text-soft);
  font-size: 0.72rem;
}

.required-field-message {
  margin: 0.35rem 0 0;
  color: var(--status-danger);
  font-size: 0.82rem;
  font-weight: 700;
}

.field-has-error > input,
.field-has-error :deep(.p-inputtext),
.field-has-error :deep(.p-select),
.field-has-error :deep(.input-select) {
  border-color: var(--status-danger) !important;
}

@media (max-width: 768px) {
  .timeline-wrapper {
    padding-left: 0;
    padding-inline-start: 0;
  }

  .timeline-line,
  .timeline-dot {
    display: none;
  }

  .timeline-item {
    position: relative;
    padding-top: 44px;
    margin-bottom: 14px;
    border: 1px solid var(--brand-primary-100);
    border-radius: 8px;
    background: var(--surface-1);
    grid-template-columns: 1fr;
  }

  .timeline-marker {
    position: absolute;
    inset-inline-start: auto;
    inset-inline-end: 10px;
    top: 8px;
    width: auto;
    z-index: 3;
    padding-top: 0;
  }

  .timeline-icon {
    display: flex;
    flex-direction: row;
    gap: 8px;
    width: auto;
    height: auto;
    border: 0;
    background: transparent;
    box-shadow: none;
  }

  .timeline-icon > svg,
  .timeline-icon > :deep(svg) {
    width: 32px;
    height: 32px;
    padding: 6px;
    border-radius: 50%;
    background: var(--brand-primary-50);
    border: 1px solid color-mix(in srgb, var(--brand-primary-500) 20%, transparent);
    cursor: pointer;
  }

  .timeline-content {
    padding: 10px 12px 12px;
    border: 0;
    box-shadow: none;
    background: transparent;
  }
}
</style>
