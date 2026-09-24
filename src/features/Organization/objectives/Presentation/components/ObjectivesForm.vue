<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import DatePicker from 'primevue/datepicker'
import TitleInterface from '@/base/Data/Models/title_interface'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import IndexHerikalyController from '@/features/Organization/Herikaly/Presentation/controllers/indexHerikalyController'
import IndexHerikalyParams from '@/features/Organization/Herikaly/Core/params/indexHerikalyParams'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import AddObjectivesParams from '../../Core/params/addObjectivesParams'
import EditObjectivesParams from '../../Core/params/editObjectivesParams'
import type ObjectivesDetailsModel from '../../Data/models/objectivesDetailsModel'
import {
  ObjectiveDirectionEnum,
  ObjectiveDirectionOptions,
  ObjectiveFrequencyOptions,
  ObjectiveTargetTypeEnum,
  ObjectiveTargetTypeOptions,
} from '../../Core/enums/objectivesEnums'

const emit = defineEmits<{
  (event: 'update:data', value: AddObjectivesParams | EditObjectivesParams): void
}>()
const props = defineProps<{ data?: ObjectivesDetailsModel }>()

const route = useRoute()
const { t } = useI18n()
const maxYearDate = new Date(new Date().getFullYear(), 11, 31)

const year = ref<Date | null>(new Date(new Date().getFullYear(), 0, 1))
const objective = ref('')
const project = ref<TitleInterface | null>(null)
const targetType = ref<TitleInterface>(ObjectiveTargetTypeOptions[0]!)
const direction = ref<TitleInterface | null>(ObjectiveDirectionOptions[0]!)
const department = ref<TitleInterface | null>(null)
const followUpEmployee = ref<TitleInterface | null>(null)
const target = ref<number | null>(null)
const baseline = ref<number | null>(null)
const unit = ref('')
const frequency = ref<TitleInterface | null>(ObjectiveFrequencyOptions[0]!)
const requiredFieldErrors = ref<Record<string, string>>({})

// const projectController = IndexProjectController.getInstance()
// const projectParams = new IndexProjectParams('', 1, 10, 0)
const herikalyController = IndexHerikalyController.getInstance()
const employeeController = IndexOrganizatoinEmployeeController.getInstance()

const routeProjectId = computed(() => {
  const routeValue =
    route.params.project_id ??
    route.query.project_id ??
    (route.path.includes('/project-details/') ? route.params.id : null)
  const rawValue = Array.isArray(routeValue) ? routeValue[0] : routeValue
  const parsedValue = Number(rawValue)

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : null
})

const activeProjectId = computed(() => project.value?.id ?? routeProjectId.value)

const departmentParams = computed(
  () => new IndexHerikalyParams('', 1, 10, 0, false, activeProjectId.value),
)

const employeeParams = computed(
  () =>
    new IndexOrganizatoinEmployeeParams(
      '',
      1,
      10,
      0,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      activeProjectId.value,
    ),
)

const translateOption = (option: TitleInterface): TitleInterface =>
  new TitleInterface({
    id: option.id,
    title: t(option.title ?? ''),
    subtitle: option.subtitle,
  })

const objectiveTargetTypeOptions = computed(() => ObjectiveTargetTypeOptions.map(translateOption))
const objectiveDirectionOptions = computed(() => ObjectiveDirectionOptions.map(translateOption))
const objectiveFrequencyOptions = computed(() => ObjectiveFrequencyOptions.map(translateOption))
const selectedTargetTypeOption = computed(
  () => objectiveTargetTypeOptions.value.find((option) => option.id === targetType.value?.id) ?? null,
)
const selectedDirectionOption = computed(
  () => objectiveDirectionOptions.value.find((option) => option.id === direction.value?.id) ?? null,
)
const selectedFrequencyOption = computed(
  () => objectiveFrequencyOptions.value.find((option) => option.id === frequency.value?.id) ?? null,
)
const translatedOptionTitle = (option?: TitleInterface | null): string =>
  option?.title ? t(option.title) : ''

const isPeriodicFrequency = computed(
  () => Number(targetType.value?.id) === ObjectiveTargetTypeEnum.PeriodicFrequency,
)
const isPercentage = computed(
  () => Number(targetType.value?.id) === ObjectiveTargetTypeEnum.Percentage,
)
const isNumberTarget = computed(() => Number(targetType.value?.id) === ObjectiveTargetTypeEnum.Number)
const isReduceDirection = computed(
  () => Number(direction.value?.id) === ObjectiveDirectionEnum.Reduce,
)
const showDirection = computed(() => !isPeriodicFrequency.value)
const showTarget = computed(() => isPercentage.value || isNumberTarget.value)
const showBaseline = computed(
  () => (isPercentage.value || isNumberTarget.value) && isReduceDirection.value,
)
const showUnit = computed(
  () => isNumberTarget.value || (isPercentage.value && isReduceDirection.value),
)
const annualOccurrences = computed(() =>
  isPeriodicFrequency.value && frequency.value?.id ? Number(frequency.value.id) : null,
)
const targetLabel = computed(() => (isPercentage.value ? 'Target %' : 'Target'))
const targetHelp = computed(() => {
  if (isPercentage.value && isReduceDirection.value) {
    return 'Enter the reduction required: 20 means reduce the baseline by 20%.'
  }
  if (isPercentage.value) return 'Enter the annual target percentage, for example 80.'
  return 'Enter the annual target number, for example 200 suppliers.'
})
const selectedYearLabel = computed(() => year.value?.getFullYear().toString() ?? '-')
const scopeLabel = computed(() => {
  if (project.value?.title) return project.value.title
  if (routeProjectId.value) return t('project_number', { number: routeProjectId.value })
  return t('Company-wide')
})
const objectivePreview = computed(
  () => objective.value.trim() || t('Train 80% of company employees in HSE.'),
)
const measurementLabel = computed(() => {
  if (isPeriodicFrequency.value) return translatedOptionTitle(frequency.value) || t('Periodic frequency')
  return `${translatedOptionTitle(targetType.value)} ${translatedOptionTitle(direction.value)}`.trim()
})
const targetPreview = computed(() => {
  if (isPeriodicFrequency.value) return t('times_per_year', { count: annualOccurrences.value ?? '-' })
  if (!hasNumber(target.value)) return '-'

  const suffix = isPercentage.value ? '%' : unit.value.trim() ? ` ${unit.value.trim()}` : ''
  return `${Number(target.value).toLocaleString()}${suffix}`
})

const toSingle = (value: TitleInterface | TitleInterface[] | null): TitleInterface | null =>
  Array.isArray(value) ? (value[0] ?? null) : value

const toNullableNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null
  return Number(value)
}

const hasText = (value: unknown): boolean => String(value ?? '').trim().length > 0
const hasNumber = (value: unknown): boolean => {
  if (value === null || value === undefined || value === '') return false
  return Number.isFinite(Number(value))
}

const toYearDate = (value: string): Date | null => {
  const parsedYear = Number(String(value).slice(0, 4))
  return Number.isFinite(parsedYear) && parsedYear > 0 ? new Date(parsedYear, 0, 1) : null
}

const findOption = (options: TitleInterface[], value?: number | null): TitleInterface | null =>
  options.find((item) => item.id === Number(value)) ?? null

const syncConditionalFields = () => {
  if (isPeriodicFrequency.value) {
    direction.value = null
    target.value = null
    baseline.value = null
    unit.value = ''
    frequency.value = frequency.value ?? ObjectiveFrequencyOptions[0]!
    return
  }

  direction.value = direction.value ?? ObjectiveDirectionOptions[0]!
  frequency.value = ObjectiveFrequencyOptions[0]!

  if (!showTarget.value) target.value = null
  if (!showBaseline.value) baseline.value = null
  if (!showUnit.value) unit.value = ''
}

const updateData = () => {
  const targetTypeId = Number(targetType.value?.id) as ObjectiveTargetTypeEnum
  const directionId = isPeriodicFrequency.value
    ? null
    : (Number(direction.value?.id) as ObjectiveDirectionEnum)

  const params = props.data?.id
    ? new EditObjectivesParams(
        props.data.id,
        year.value ?? '',
        objective.value,
        activeProjectId.value,
        targetTypeId,
        directionId,
        department.value?.id ?? null,
        followUpEmployee.value?.id ?? null,
        showTarget.value ? toNullableNumber(target.value) : null,
        showBaseline.value ? toNullableNumber(baseline.value) : null,
        showUnit.value ? unit.value.trim() || null : null,
        isPeriodicFrequency.value ? Number(frequency.value?.id ?? 0) : null,
        annualOccurrences.value,
      )
    : new AddObjectivesParams(
        year.value ?? '',
        objective.value,
        activeProjectId.value,
        targetTypeId,
        directionId,
        department.value?.id ?? null,
        followUpEmployee.value?.id ?? null,
        showTarget.value ? toNullableNumber(target.value) : null,
        showBaseline.value ? toNullableNumber(baseline.value) : null,
        showUnit.value ? unit.value.trim() || null : null,
        isPeriodicFrequency.value ? Number(frequency.value?.id ?? 0) : null,
        annualOccurrences.value,
      )

  emit('update:data', params)
}

// const onProjectChange = (value: TitleInterface | TitleInterface[] | null) => {
//   project.value = toSingle(value)
//   department.value = null
//   followUpEmployee.value = null
//   updateData()
// }

const onTargetTypeChange = (value: TitleInterface | TitleInterface[] | null) => {
  targetType.value = toSingle(value) ?? ObjectiveTargetTypeOptions[0]!
  syncConditionalFields()
  updateData()
}

const onDirectionChange = (value: TitleInterface | TitleInterface[] | null) => {
  direction.value = toSingle(value) ?? ObjectiveDirectionOptions[0]!
  syncConditionalFields()
  updateData()
}

const onDepartmentChange = (value: TitleInterface | TitleInterface[] | null) => {
  department.value = toSingle(value)
  updateData()
}

const onFollowUpEmployeeChange = (value: TitleInterface | TitleInterface[] | null) => {
  followUpEmployee.value = toSingle(value)
  updateData()
}

const onFrequencyChange = (value: TitleInterface | TitleInterface[] | null) => {
  frequency.value = toSingle(value) ?? ObjectiveFrequencyOptions[0]!
  updateData()
}

watch(
  () => props.data,
  (data) => {
    if (!data) {
      updateData()
      return
    }

    year.value = toYearDate(data.year)
    objective.value = data.objective
    // project.value = data.project
    targetType.value =
      findOption(ObjectiveTargetTypeOptions, data.targetType) ?? ObjectiveTargetTypeOptions[0]!
    direction.value = findOption(ObjectiveDirectionOptions, data.direction)
    department.value = data.department
    followUpEmployee.value = data.followUpEmployee
    target.value = data.target
    baseline.value = data.baseline
    unit.value = data.unit ?? ''
    frequency.value = findOption(ObjectiveFrequencyOptions, data.frequency) ?? ObjectiveFrequencyOptions[0]!
    syncConditionalFields()
    updateData()
  },
  { immediate: true },
)

const requiredFields = computed(() => [
  {
    key: 'year',
    message: t('Year Is Required'),
    isMissing: () => !year.value,
  },
  {
    key: 'objective',
    message: t('Objective Is Required'),
    isMissing: () => !hasText(objective.value),
  },
  {
    key: 'target_type',
    message: t('Target Type Is Required'),
    isMissing: () => !targetType.value?.id,
  },
  {
    key: 'direction',
    message: t('Direction Is Required'),
    isMissing: () => showDirection.value && !direction.value?.id,
  },
  {
    key: 'target',
    message: t('Target Is Required'),
    isMissing: () => showTarget.value && !hasNumber(target.value),
  },
  {
    key: 'baseline',
    message: t('Baseline Is Required'),
    isMissing: () => showBaseline.value && !hasNumber(baseline.value),
  },
  {
    key: 'unit',
    message: t('Unit Is Required'),
    isMissing: () => showUnit.value && !hasText(unit.value),
  },
  {
    key: 'frequency',
    message: t('Frequency Is Required'),
    isMissing: () => isPeriodicFrequency.value && !frequency.value?.id,
  },
  {
    key: 'department',
    message: t('Department Is Required'),
    isMissing: () => !department.value?.id,
  },
  {
    key: 'follow_up_employee',
    message: t('Follow-up Employee Is Required'),
    isMissing: () => !followUpEmployee.value?.id,
  },
])

const completedRequiredCount = computed(
  () => requiredFields.value.filter((field) => !field.isMissing()).length,
)
const completionTotal = computed(() => requiredFields.value.length)
const completionPercent = computed(() =>
  Math.round((completedRequiredCount.value / completionTotal.value) * 100),
)

const validateRequiredFields = async () => {
  const missedFields = requiredFields.value.filter((field) => field.isMissing())
  requiredFieldErrors.value = Object.fromEntries(
    missedFields.map((field) => [field.key, field.message]),
  )
  if (!missedFields.length) return true

  const firstMissedField = missedFields[0]!
  new OpenWarningDilaog(firstMissedField.message).openDialog()
  await nextTick()
  document
    .querySelector<HTMLElement>(`[data-required-field="${firstMissedField.key}"]`)
    ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  return false
}

defineExpose({ validateRequiredFields })
</script>

<template>
  <section class="objective-form-shell col-span-4">
    <header class="objective-form-header">
      <div class="objective-title-block">
        <span class="objective-mark" aria-hidden="true"></span>
        <div>
          <p class="objective-kicker">{{ $t('Objectives') }}</p>
          <h2>{{ props.data?.id ? $t('Edit Objective') : $t('Add Objective') }}</h2>
        </div>
      </div>

      <div class="objective-progress" :style="{ '--progress-value': `${completionPercent}%` }">
        <span>{{ completedRequiredCount }}/{{ completionTotal }}</span>
        <strong>{{ completionPercent }}%</strong>
      </div>
    </header>

    <div class="objective-summary">
      <div class="summary-main">
        <span>{{ $t('Objective') }}</span>
        <strong>{{ objectivePreview }}</strong>
      </div>
      <div class="summary-chip">
        <span>{{ $t('Scope') }}</span>
        <strong>{{ scopeLabel }}</strong>
      </div>
      <div class="summary-chip">
        <span>{{ $t('Measurement') }}</span>
        <strong>{{ measurementLabel }}</strong>
      </div>
      <div class="summary-chip">
        <span>{{ $t('Target') }}</span>
        <strong>{{ targetPreview }}</strong>
      </div>
    </div>

    <div class="objective-sections">
      <section class="objective-section section-details">
        <div class="section-heading">
          <span>01</span>
          <div>
            <h3>{{ $t('Objective Details') }}</h3>
            <p>{{ selectedYearLabel }} / {{ scopeLabel }}</p>
          </div>
        </div>

        <div class="section-grid">
          <div class="objective-field input-wrapper field-year" data-required-field="year">
            <label class="input-label required" for="objective-year">
              <span class="text-red-500">*</span>
              {{ $t('Year') }}
            </label> 
           
              <DatePicker
                id="objective-year"
                v-model="year"
                view="year"
                date-format="yy"
                show-icon
                fluid
                :manual-input="false"
                :max-date="maxYearDate"
                @update:model-value="updateData"
              />
           
            <p v-if="requiredFieldErrors.year" class="required-field-message">
              {{ requiredFieldErrors.year }}
            </p>
          </div>
<!-- 
          <div class="objective-field input-wrapper field-project">
            <UpdatedCustomInputSelect
              id="objective-project"
              :model-value="project"
              :label="$t('Project')"
              :placeholder="$t('Select project')"
              :controller="projectController"
              :params="projectParams"
              optional
              @update:model-value="onProjectChange"
            />
            <p class="field-help">
              {{ $t('Leave company-wide selected when the goal is not limited to one project.') }}
            </p>
          </div> -->

          <div class="objective-field input-wrapper field-full" data-required-field="objective">
            <label class="input-label required" for="objective-text">
              <span class="text-red-500">*</span>
              {{ $t('Objective') }}
            </label>
            <textarea
              id="objective-text"
              v-model="objective"
              class="input w-full"
              rows="4"
              :placeholder="$t('Example: Train 80% of company employees in HSE.')"
              @input="updateData"
            ></textarea>
            <p class="field-help">{{ $t('Example: Train 80% of company employees in HSE.') }}</p>
            <p v-if="requiredFieldErrors.objective" class="required-field-message">
              {{ requiredFieldErrors.objective }}
            </p>
          </div>
        </div>
      </section>

      <section class="objective-section">
        <div class="section-heading">
          <span>02</span>
          <div>
            <h3>{{ $t('Measurement') }}</h3>
            <p>{{ measurementLabel }}</p>
          </div>
        </div>

        <div class="section-grid compact-grid">
          <div class="objective-field input-wrapper" data-required-field="target_type">
            <UpdatedCustomInputSelect
              id="objective-target-type"
              :model-value="selectedTargetTypeOption"
              :label="$t('Target Type')"
              :placeholder="$t('Select target type')"
              :static-options="objectiveTargetTypeOptions"
              required
              :reload="false"
              @update:model-value="onTargetTypeChange"
            />
            <p v-if="requiredFieldErrors.target_type" class="required-field-message">
              {{ requiredFieldErrors.target_type }}
            </p>
          </div>

          <div v-if="showDirection" class="objective-field input-wrapper" data-required-field="direction">
            <UpdatedCustomInputSelect
              id="objective-direction"
              :model-value="selectedDirectionOption"
              :label="$t('Direction')"
              :placeholder="$t('Select direction')"
              :static-options="objectiveDirectionOptions"
              required
              :reload="false"
              @update:model-value="onDirectionChange"
            />
            <p v-if="requiredFieldErrors.direction" class="required-field-message">
              {{ requiredFieldErrors.direction }}
            </p>
          </div>

          <div v-if="isPeriodicFrequency" class="objective-field input-wrapper" data-required-field="frequency">
            <UpdatedCustomInputSelect
              id="objective-frequency"
              :model-value="selectedFrequencyOption"
              :label="$t('Frequency')"
              :placeholder="$t('Select frequency')"
              :static-options="objectiveFrequencyOptions"
              required
              :reload="false"
              @update:model-value="onFrequencyChange"
            />
            <p v-if="requiredFieldErrors.frequency" class="required-field-message">
              {{ requiredFieldErrors.frequency }}
            </p>
          </div>

          <div v-if="showTarget" class="objective-field input-wrapper" data-required-field="target">
            <label class="input-label required" for="objective-target">
              <span class="text-red-500">*</span>
              {{ $t(targetLabel) }}
            </label>
            <input
              id="objective-target"
              v-model.number="target"
              class="input w-full"
              type="number"
              min="0"
              @input="updateData"
            />
            <p class="field-help">{{ $t(targetHelp) }}</p>
            <p v-if="requiredFieldErrors.target" class="required-field-message">
              {{ requiredFieldErrors.target }}
            </p>
          </div>

          <div v-if="showBaseline" class="objective-field input-wrapper" data-required-field="baseline">
            <label class="input-label required" for="objective-baseline">
              <span class="text-red-500">*</span>
              {{ $t('Baseline') }}
            </label>
            <input
              id="objective-baseline"
              v-model.number="baseline"
              class="input w-full"
              type="number"
              min="0"
              @input="updateData"
            />
            <p class="field-help">
              {{ $t('The starting value before reduction. For example: consumption of 1,000 units.') }}
            </p>
            <p v-if="requiredFieldErrors.baseline" class="required-field-message">
              {{ requiredFieldErrors.baseline }}
            </p>
          </div>

          <div v-if="showUnit" class="objective-field input-wrapper" data-required-field="unit">
            <label class="input-label required" for="objective-unit">
              <span class="text-red-500">*</span>
              {{ $t('Unit') }}
            </label>
            <input id="objective-unit" v-model="unit" class="input w-full" type="text" @input="updateData" />
            <p v-if="requiredFieldErrors.unit" class="required-field-message">
              {{ requiredFieldErrors.unit }}
            </p>
          </div>

          <div v-if="isPeriodicFrequency" class="objective-field input-wrapper">
            <label class="input-label" for="objective-annual-occurrences">
              {{ $t('Annual occurrences') }}
            </label>
            <input
              id="objective-annual-occurrences"
              class="input w-full"
              type="number"
              :value="annualOccurrences"
              disabled
            />
          </div>
        </div>
      </section>

      <section class="objective-section">
        <div class="section-heading">
          <span>03</span>
          <div>
            <h3>{{ $t('Ownership') }}</h3>
            <p>{{ department?.title || $t('Departments') }}</p>
          </div>
        </div>

        <div class="section-grid ownership-grid">
          <div class="objective-field input-wrapper" data-required-field="department">
            <UpdatedCustomInputSelect
              id="objective-department"
              :model-value="department"
              :label="$t('Departments')"
              :placeholder="$t('Select department')"
              :controller="herikalyController"
              :params="departmentParams"
              required
              @update:model-value="onDepartmentChange"
            />
            <p v-if="requiredFieldErrors.department" class="required-field-message">
              {{ requiredFieldErrors.department }}
            </p>
          </div>

          <div class="objective-field input-wrapper" data-required-field="follow_up_employee">
            <UpdatedCustomInputSelect
              id="objective-follow-up-employee"
              :model-value="followUpEmployee"
              :label="$t('Follow-up Employee')"
              :placeholder="$t('Select employee')"
              :controller="employeeController"
              :params="employeeParams"
              required
              @update:model-value="onFollowUpEmployeeChange"
            />
            <p v-if="requiredFieldErrors.follow_up_employee" class="required-field-message">
              {{ requiredFieldErrors.follow_up_employee }}
            </p>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.objective-form-shell {
  display: grid;
  gap: 18px;
  width: 100%;
  padding: 18px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 13%, var(--main-border));
  border-radius: 18px;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--PrimaryColor) 5%, transparent), transparent 34%),
    var(--surface-1);
  box-shadow: 0 18px 42px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
}

.objective-form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 8px 2px 0;
}

.objective-title-block {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.objective-mark {
  position: relative;
  display: grid;
  flex: 0 0 48px;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 16px;
  background: var(--PrimaryColor);
  box-shadow: 0 14px 28px color-mix(in srgb, var(--PrimaryColor) 24%, transparent);
}

.objective-mark::before,
.objective-mark::after {
  position: absolute;
  border: 2px solid var(--text-on-brand);
  border-radius: 50%;
  content: '';
}

.objective-mark::before {
  width: 22px;
  height: 22px;
}

.objective-mark::after {
  width: 7px;
  height: 7px;
  background: var(--text-on-brand);
}

.objective-kicker {
  margin: 0 0 2px;
  color: var(--text-soft);
  font-size: 0.78rem;
  font-weight: 700;
}

.objective-form-header h2 {
  margin: 0;
  color: var(--text-strong);
  font-size: 1.25rem;
  font-weight: 800;
  line-height: 1.25;
}

.objective-progress {
  --progress-value: 0%;
  display: grid;
  gap: 4px;
  min-width: 148px;
  padding: 10px 12px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 16%, var(--main-border));
  border-radius: 14px;
  background:
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--PrimaryColor) 13%, transparent) var(--progress-value),
      transparent var(--progress-value)
    ),
    color-mix(in srgb, var(--surface-1) 86%, var(--PrimaryColor));
}

.objective-progress span {
  color: var(--text-soft);
  font-size: 0.72rem;
  font-weight: 700;
}

.objective-progress strong {
  color: var(--PrimaryColor);
  font-size: 1rem;
  font-weight: 800;
}

.objective-summary {
  display: grid;
  grid-template-columns: minmax(260px, 1.7fr) repeat(3, minmax(150px, 1fr));
  gap: 10px;
  padding: 12px;
  border: 1px solid color-mix(in srgb, var(--main-border) 86%, transparent);
  border-radius: 16px;
  background: color-mix(in srgb, var(--surface-2) 56%, var(--surface-1));
}

.summary-main,
.summary-chip {
  min-width: 0;
  padding: 12px;
  border: 1px solid color-mix(in srgb, var(--main-border) 78%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, var(--surface-1) 92%, transparent);
}

.summary-main span,
.summary-chip span {
  display: block;
  margin-bottom: 4px;
  color: var(--text-soft);
  font-size: 0.72rem;
  font-weight: 700;
}

.summary-main strong,
.summary-chip strong {
  display: block;
  overflow: hidden;
  color: var(--text-strong);
  font-size: 0.88rem;
  font-weight: 800;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.summary-main strong {
  white-space: normal;
}

.objective-sections {
  display: grid;
  gap: 14px;
}

.objective-section {
  display: grid;
  gap: 14px;
  padding: 14px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 11%, var(--main-border));
  border-radius: 16px;
  background: color-mix(in srgb, var(--surface-1) 94%, var(--PrimaryColor));
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.section-heading > span {
  display: grid;
  flex: 0 0 34px;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 12px;
  background: color-mix(in srgb, var(--PrimaryColor) 11%, transparent);
  color: var(--PrimaryColor);
  font-size: 0.8rem;
  font-weight: 800;
}

.section-heading h3 {
  margin: 0;
  color: var(--text-strong);
  font-size: 1rem;
  font-weight: 800;
}

.section-heading p {
  margin: 2px 0 0;
  color: var(--text-soft);
  font-size: 0.76rem;
  font-weight: 600;
}

.section-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 12px;
}

.objective-field {
  grid-column: span 6;
  min-width: 0;
}

.field-year {
  grid-column: span 4;
}

.field-project {
  grid-column: span 8;
}

.field-full {
  grid-column: 1 / -1;
}

.compact-grid .objective-field {
  grid-column: span 4;
}

.ownership-grid .objective-field {
  grid-column: span 6;
}

.objective-field.input-wrapper {
  position: relative;
  min-height: 100%;
  padding: 12px;
  border: 1px solid color-mix(in srgb, var(--main-border) 88%, transparent);
  border-radius: 14px !important;
  background: color-mix(in srgb, var(--surface-1) 92%, transparent);
  box-shadow: 0 8px 18px color-mix(in srgb, var(--brand-primary-900) 4%, transparent);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.objective-field.input-wrapper:focus-within {
  border-color: color-mix(in srgb, var(--PrimaryColor) 46%, var(--main-border));
  box-shadow:
    0 0 0 4px color-mix(in srgb, var(--PrimaryColor) 8%, transparent),
    0 12px 24px color-mix(in srgb, var(--brand-primary-900) 6%, transparent);
  transform: translateY(-1px);
}

.input-label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 0.5rem;
  color: var(--text-strong);
  font-size: 0.9rem;
  font-weight: 700;
}

.objective-field :deep(.input-label) {
  margin-bottom: 0.5rem;
  color: var(--text-strong);
  font-size: 0.9rem;
  font-weight: 700;
}

.objective-field :deep(.input-select),
.objective-field :deep(.p-inputwrapper),
.objective-field :deep(.p-datepicker),
.objective-field :deep(.p-select) {
  width: 100%;
}

.objective-field input:not([type='checkbox']),
.objective-field textarea,
.objective-field :deep(.p-inputtext),
.objective-field :deep(.p-select),
.objective-field :deep(.input-select) {
  min-height: 46px;
  border-color: color-mix(in srgb, var(--PrimaryColor) 14%, var(--main-border)) !important;
  border-radius: 14px !important;
  background: color-mix(in srgb, var(--surface-1) 96%, var(--PrimaryColor)) !important;
  box-shadow: none !important;
}

.objective-field textarea {
  min-height: 112px;
  resize: vertical;
}

.objective-field input:focus,
.objective-field textarea:focus,
.objective-field :deep(.p-inputtext:focus),
.objective-field :deep(.p-select.p-focus),
.objective-field :deep(.input-select:focus) {
  border-color: var(--PrimaryColor) !important;
  background: var(--surface-1) !important;
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--PrimaryColor) 8%, transparent) !important;
}

.objective-field input:disabled {
  color: var(--text-strong);
  opacity: 1;
}

.field-help {
  margin-top: 0.4rem;
  color: var(--text-soft);
  font-size: 0.78rem;
  line-height: 1.5;
}

.required-field-message {
  margin-top: 0.35rem;
  color: var(--status-danger);
  font-size: 0.82rem;
  font-weight: 700;
}

@media (max-width: 1200px) {
  .objective-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .summary-main {
    grid-column: 1 / -1;
  }

  .compact-grid .objective-field {
    grid-column: span 6;
  }
}

@media (max-width: 768px) {
  .objective-form-shell {
    padding: 12px;
    border-radius: 14px;
  }

  .objective-form-header {
    align-items: stretch;
    flex-direction: column;
  }

  .objective-progress {
    min-width: 0;
  }

  .objective-summary,
  .section-grid {
    grid-template-columns: 1fr;
  }

  .summary-main,
  .summary-chip,
  .objective-field,
  .field-year,
  .field-project,
  .field-full,
  .compact-grid .objective-field,
  .ownership-grid .objective-field {
    grid-column: 1 / -1;
  }
}
 /* .p-datepicker-dropdown,  .induction-date-button {
  display: none !important;
}
.p-datepicker-fluid{
   display: none !important;
} */
</style>
