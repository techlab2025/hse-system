<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import TitleInterface from '@/base/Data/Models/title_interface'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import IndexHerikalyController from '@/features/Organization/Herikaly/Presentation/controllers/indexHerikalyController'
import IndexHerikalyParams from '@/features/Organization/Herikaly/Core/params/indexHerikalyParams'
import AddNotificationPlanController from '../controllers/add_notification_plan_controller'
import AddNotificationPlanParams from '../../Core/Params/add_notification_plan_params'
import {
  notificationPlanActionOptions,
  notificationPlanSubActionOptions,
} from '../../Data/const/notification_plan_actions'
import { NotificationPlanActionEnum } from '../../Core/enums/notification_plan_action_enum'
import CustomCheckbox from '@/shared/HelpersComponents/CustomCheckbox.vue'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'

const router = useRouter()
const { t } = useI18n()

const indexEmployeesController = IndexOrganizatoinEmployeeController.getInstance()
const indexEmployeesParams = new IndexOrganizatoinEmployeeParams('', 1, 30, 0)

const indexHierarchiesController = IndexHerikalyController.getInstance()
const indexHierarchiesParams = new IndexHerikalyParams('', 1, 30, 0, true)

const title = ref('')
const isActive = ref(true)
const selectedActions = ref<TitleInterface[]>([])
const selectedSubActionByAction = ref<Record<number, number>>({})
const selectedEmployees = ref<TitleInterface[]>([])
const selectedHierarchies = ref<TitleInterface[]>([])
type AssignmentMode = 'employees' | 'hierarchies'
const assignmentMode = ref<AssignmentMode>('employees')
const assignmentError = ref('')
const actionValueError = ref('')
const titleError = ref('')

type RequiredFieldRule = {
  key: string
  message: string
  isMissing: () => boolean
}

const actionTitleKeys: Record<string, string> = {
  'Task assigned': 'task_assigned',
  'Project location hierarchy assignment': 'project_location_hierarchy_assignment',
  'Observation created': 'observation_created',
  'Investigation task created': 'investigation_task_created',
  'Investigation task status changed': 'investigation_task_status_changed',
  'Investigation team added': 'investigation_team_added',
}

const subActionTitleKeys: Record<string, string> = {
  Low: 'low',
  Medium: 'medium',
  'Medium is near miss': 'medium_is_near_miss',
  High: 'high',
}

const translateTitle = (item: TitleInterface, titleKeys: Record<string, string>) => {
  const title = item.title ?? ''
  return t(titleKeys[title] ?? title)
}

const optionTitle = (item: TitleInterface) => item.title ?? ''

const localizedActionOptions = computed(() =>
  notificationPlanActionOptions.map(
    (item) =>
      new TitleInterface({
        id: item.id,
        title: translateTitle(item, actionTitleKeys),
      }),
  ),
)
const localizedSubActionOptions = computed(() =>
  notificationPlanSubActionOptions.map(
    (item) =>
      new TitleInterface({
        id: item.id,
        title: translateTitle(item, subActionTitleKeys),
      }),
  ),
)

const supportsSubAction = (actionId: number) =>
  actionId === NotificationPlanActionEnum.OBSERVATION_CREATED

const actionValues = computed(() =>
  selectedActions.value.map((item) => ({
    action: item.id,
    sub_action: supportsSubAction(item.id)
      ? (selectedSubActionByAction.value[item.id] ?? null)
      : null,
  })),
)

const requiredFields = computed<RequiredFieldRule[]>(() => [
  {
    key: 'title',
    message: t('notification_plan_title_required'),
    isMissing: () => title.value.trim().length === 0,
  },
  {
    key: 'actions',
    message: t('select_actions'),
    isMissing: () => selectedActions.value.length === 0,
  },
  {
    key: 'assignments',
    message: t('select_employee_or_hierarchy_error'),
    isMissing: () =>
      assignmentMode.value === 'employees'
        ? selectedEmployees.value.length === 0
        : selectedHierarchies.value.length === 0,
  },
])

const setRequiredErrors = (missedFields: RequiredFieldRule[]) => {
  titleError.value = missedFields.find((field) => field.key === 'title')?.message ?? ''
  actionValueError.value = missedFields.find((field) => field.key === 'actions')?.message ?? ''
  assignmentError.value = missedFields.find((field) => field.key === 'assignments')?.message ?? ''
}

const scrollToRequiredField = async (key: string) => {
  await nextTick()
  document.querySelector<HTMLElement>(`[data-required-field="${key}"]`)?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}

const validateRequiredFields = async () => {
  const missedFields = requiredFields.value.filter((field) => field.isMissing())
  setRequiredErrors(missedFields)

  if (!missedFields.length) return true

  new OpenWarningDilaog(missedFields[0].message).openDialog()
  await scrollToRequiredField(missedFields[0].key)
  return false
}

const eventChecked = (event: Event) => (event.target as HTMLInputElement).checked

const isActionSelected = (actionId: number) =>
  selectedActions.value.some((item) => item.id === actionId)

const isSubActionSelected = (actionId: number, subActionId: number) =>
  selectedSubActionByAction.value[actionId] === subActionId

const toggleAction = (action: TitleInterface, checked: boolean) => {
  actionValueError.value = ''

  if (checked) {
    if (!isActionSelected(action.id)) selectedActions.value = [...selectedActions.value, action]
    return
  }

  selectedActions.value = selectedActions.value.filter((item) => item.id !== action.id)
  const nextSubActions = { ...selectedSubActionByAction.value }
  delete nextSubActions[action.id]
  selectedSubActionByAction.value = nextSubActions
}

const selectSubAction = (action: TitleInterface, subAction: TitleInterface) => {
  actionValueError.value = ''

  if (!supportsSubAction(action.id)) return

  if (!isActionSelected(action.id)) {
    selectedActions.value = [...selectedActions.value, action]
  }

  selectedSubActionByAction.value = {
    ...selectedSubActionByAction.value,
    [action.id]: subAction.id,
  }
}

const clearSubAction = (actionId: number) => {
  const nextSubActions = { ...selectedSubActionByAction.value }
  delete nextSubActions[actionId]
  selectedSubActionByAction.value = nextSubActions
}

const updateEmployees = (data: TitleInterface[]) => {
  selectedEmployees.value = data
  assignmentError.value = ''
}

const updateHierarchies = (data: TitleInterface[]) => {
  selectedHierarchies.value = data
  assignmentError.value = ''
}

const updateAssignmentMode = (mode: AssignmentMode) => {
  if (assignmentMode.value === mode) return

  assignmentMode.value = mode
  assignmentError.value = ''

  if (mode === 'employees') {
    selectedHierarchies.value = []
    return
  }

  selectedEmployees.value = []
}

const addNotificationPlan = async () => {
  if (!(await validateRequiredFields())) return

  const notificationPlanParams = new AddNotificationPlanParams(
    title.value.trim(),
    actionValues.value,
    selectedEmployees.value.map((item) => item.id),
    selectedHierarchies.value.map((item) => item.id),
    isActive.value,
    assignmentMode.value === 'hierarchies' ? 1 : 0,
  )

  await AddNotificationPlanController.getInstance().addNotificationPlan(
    notificationPlanParams,
    router,
  )
}
</script>

<template>
  <form @submit.prevent="addNotificationPlan" class="notification-plan-form">
    <div class="input-wrapper title-field" data-required-field="title">
      <label for="title">{{ $t('title') }}</label>
      <input
        id="title"
        v-model.trim="title"
        class="input"
        type="text"
        maxlength="255"
        :placeholder="$t('enter_notification_plan_title')"
        :class="{ 'input--error': titleError }"
        @input="titleError = ''"
      />
      <p v-if="titleError" class="form-error">{{ titleError }}</p>
    </div>

    <div class="input-wrapper status-field">
      <CustomCheckbox
        title="active"
        :checked="isActive"
        :index="0"
        @update:checked="isActive = $event"
      />
    </div>

    <div class="input-wrapper full-width action-tree-field" data-required-field="actions">
      <label class="tree-label required">{{ $t('actions') }}</label>

      <div class="action-tree">
        <div
          v-for="action in localizedActionOptions"
          :key="action.id"
          class="action-card"
          :class="{ 'action-card--active': isActionSelected(action.id) }"
        >
          <label class="action-card__header" :for="`notification-action-${action.id}`">
            <input
              :id="`notification-action-${action.id}`"
              type="checkbox"
              class="action-card__native-input"
              :checked="isActionSelected(action.id)"
              @change="toggleAction(action, eventChecked($event))"
            />
            <span class="action-card__toggle">
              <span class="action-card__toggle-knob"></span>
            </span>
            <span class="action-card__label">{{ optionTitle(action) }}</span>
            <span v-if="isActionSelected(action.id)" class="action-card__badge">{{
              $t('active') || 'Active'
            }}</span>
          </label>

          <Transition name="sub-expand">
            <div
              v-if="isActionSelected(action.id) && supportsSubAction(action.id)"
              class="sub-action-panel"
            >
              <div class="sub-action-panel__divider"></div>
              <div class="sub-action-panel__pills">
                <label
                  v-for="subAction in localizedSubActionOptions"
                  :key="subAction.id"
                  class="sub-action-pill"
                  :class="{
                    'sub-action-pill--selected': isSubActionSelected(action.id, subAction.id),
                  }"
                  :for="`notification-sub-action-${action.id}-${subAction.id}`"
                >
                  <input
                    :id="`notification-sub-action-${action.id}-${subAction.id}`"
                    type="radio"
                    class="sub-action-pill__native-input"
                    :name="`notification-sub-action-${action.id}`"
                    :checked="isSubActionSelected(action.id, subAction.id)"
                    @change="selectSubAction(action, subAction)"
                  />
                  <span class="sub-action-pill__dot"></span>
                  <span class="sub-action-pill__text">{{ optionTitle(subAction) }}</span>
                </label>
              </div>

              <button
                v-if="selectedSubActionByAction[action.id] !== undefined"
                type="button"
                class="sub-action-clear"
                @click="clearSubAction(action.id)"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                {{ $t('clear') }}
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <p v-if="actionValueError" class="full-width form-error">{{ actionValueError }}</p>

    <section class="assignment-field full-width" data-required-field="assignments">
      <div class="assignment-heading">
        <div>
          <label class="tree-label required">{{ $t('Choose recipients') }}</label>
          <p>{{ $t('Select how this notification plan should assign recipients.') }}</p>
        </div>
        <span class="assignment-step">{{ $t('Assignment type') }}</span>
      </div>

      <div class="assignment-mode-options" role="radiogroup" :aria-label="$t('Assignment type')">
        <label
          class="assignment-mode-card"
          :class="{ 'assignment-mode-card--active': assignmentMode === 'hierarchies' }"
          for="assignment-mode-hierarchies"
        >
          <input
            id="assignment-mode-hierarchies"
            type="radio"
            name="assignment-mode"
            value="hierarchies"
            :checked="assignmentMode === 'hierarchies'"
            @change="updateAssignmentMode('hierarchies')"
          />
          <span class="assignment-mode-icon hierarchy-mode-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <rect x="9" y="3" width="6" height="5" rx="1" />
              <rect x="3" y="16" width="6" height="5" rx="1" />
              <rect x="15" y="16" width="6" height="5" rx="1" />
              <path d="M12 8v4M6 16v-4h12v4" />
            </svg>
          </span>
          <span class="assignment-mode-copy">
            <strong>{{ $t('Positions') }}</strong>
            <small>{{ $t('Assign an entire Position') }}</small>
          </span>
          <span class="assignment-radio" aria-hidden="true"><i></i></span>
        </label>
        <label
          class="assignment-mode-card"
          :class="{ 'assignment-mode-card--active': assignmentMode === 'employees' }"
          for="assignment-mode-employees"
        >
          <input
            id="assignment-mode-employees"
            type="radio"
            name="assignment-mode"
            value="employees"
            :checked="assignmentMode === 'employees'"
            @change="updateAssignmentMode('employees')"
          />
          <span class="assignment-mode-icon employee-mode-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle cx="9" cy="8" r="3" />
              <path
                d="M3.5 20v-2a5.5 5.5 0 0 1 11 0v2M16 5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 3.5 4.8V20"
              />
            </svg>
          </span>
          <span class="assignment-mode-copy">
            <strong>{{ $t('employees') }}</strong>
            <small>{{ $t('Assign individual employees') }}</small>
          </span>
          <span class="assignment-radio" aria-hidden="true"><i></i></span>
        </label>
      </div>

      <Transition name="assignment-swap" mode="out-in">
        <div v-if="assignmentMode === 'employees'" key="employees" class="assignment-select">
          <CustomSelectInput
            id="employee-ids"
            :modelValue="selectedEmployees"
            label="employees"
            :controller="indexEmployeesController"
            :params="indexEmployeesParams"
            :type="2"
            :placeholder="$t('select_employees')"
            @update:modelValue="updateEmployees"
          />
        </div>
        <div v-else key="hierarchies" class="assignment-select">
          <CustomSelectInput
            id="hierarchy-ids"
            :modelValue="selectedHierarchies"
            label="positions"
            :controller="indexHierarchiesController"
            :params="indexHierarchiesParams"
            :type="2"
            :placeholder="$t('select_hierarchies')"
            @update:modelValue="updateHierarchies"
          />
        </div>
      </Transition>

      <p v-if="assignmentError" class="form-error">{{ assignmentError }}</p>
    </section>

    <div class="full-width plan-button-wrapper">
      <button class="btn btn-primary" type="submit">
        {{ $t('save') }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.w-full {
  width: 100%;
}
.notification-plan-form {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
  width: 100%;
}

.input-wrapper {
  min-width: 0;
}

.input--error {
  border-color: var(--status-danger, #e23535);
}

.title-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-field {
  display: flex;
  align-items: center;
  min-height: 100%;
}

.action-tree-field {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tree-label {
  font-weight: 700;
  font-size: var(--sm-size, 14px);
  color: var(--text-strong);
  letter-spacing: 0.02em;
}

.tree-label.required::before {
  content: '*';
  color: var(--status-danger, #e23535);
  margin-inline-end: 4px;
}

/* ── Action Tree Container ── */
.action-tree {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  border: 1px solid var(--brand-primary-100, #e0e7ff);
  border-radius: 16px;
  background: linear-gradient(145deg, var(--surface-1, #fff), var(--surface-2, #f8fafc));
  box-shadow: 0 4px 20px
    color-mix(in srgb, var(--shadow-color, rgba(15, 23, 42, 0.14)) 40%, transparent);
}

/* ── Action Card ── */
.action-card {
  position: relative;
  border: 1px solid var(--brand-primary-100, #e0e7ff);
  border-radius: 12px;
  background: var(--surface-1, #fff);
  overflow: hidden;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease,
    transform 0.2s ease;
}

.action-card:hover {
  border-color: var(--brand-primary-200, #c7d2fe);
  box-shadow: 0 2px 12px color-mix(in srgb, var(--brand-primary-500, #1d4ed8) 8%, transparent);
  transform: translateY(-1px);
}

.action-card--active {
  border-color: var(--brand-primary-300, #818cf8);
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--brand-primary-500) 4%, var(--surface-1)),
    var(--surface-1)
  );
  box-shadow: 0 4px 18px color-mix(in srgb, var(--brand-primary-500, #1d4ed8) 12%, transparent);
}

.action-card--active:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 24px color-mix(in srgb, var(--brand-primary-500, #1d4ed8) 16%, transparent);
}

/* ── Card Header ── */
.action-card__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s ease;
}

.action-card__header:hover {
  background: color-mix(in srgb, var(--brand-primary-500) 3%, transparent);
}

/* Hide native checkbox */
.action-card__native-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

/* ── Custom Toggle Switch ── */
.action-card__toggle {
  position: relative;
  flex-shrink: 0;
  width: 42px;
  height: 24px;
  border-radius: 12px;
  background: var(--Gray-4, #d9dbe9);
  transition:
    background 0.3s ease,
    box-shadow 0.3s ease;
}

.action-card__native-input:checked + .action-card__toggle {
  background: linear-gradient(
    135deg,
    var(--brand-primary-500, #1d4ed8),
    var(--brand-primary-400, #3b82f6)
  );
  box-shadow: 0 2px 8px color-mix(in srgb, var(--brand-primary-500) 30%, transparent);
}

.action-card__toggle-knob {
  position: absolute;
  top: 3px;
  inset-inline-start: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--surface-1, #fff);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
  transition:
    inset-inline-start 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    transform 0.2s ease;
}

.action-card__native-input:checked + .action-card__toggle .action-card__toggle-knob {
  inset-inline-start: 21px;
}

.action-card__header:active .action-card__toggle-knob {
  transform: scaleX(1.15);
}

/* ── Label & Badge ── */
.action-card__label {
  flex: 1;
  font-weight: 600;
  font-size: var(--sm-size, 14px);
  color: var(--text-strong, #0f172a);
  line-height: 1.4;
}

.action-card__badge {
  flex-shrink: 0;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--brand-primary-50, #eef2ff);
  color: var(--brand-primary-500, #1d4ed8);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  animation: badge-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes badge-pop {
  0% {
    opacity: 0;
    transform: scale(0.7);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* ── Sub-Action Panel ── */
.sub-action-panel {
  padding: 0 16px 14px;
}

.sub-action-panel__divider {
  height: 1px;
  margin-bottom: 12px;
  background: linear-gradient(90deg, transparent, var(--brand-primary-200, #c7d2fe), transparent);
}

.sub-action-panel__pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* ── Sub-Action Pill ── */
.sub-action-pill {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid var(--brand-primary-100, #e0e7ff);
  background: var(--surface-1, #fff);
  color: var(--text-soft, #475569);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  transition: all 0.25s ease;
}

.sub-action-pill:hover {
  border-color: var(--brand-primary-300, #818cf8);
  background: var(--brand-primary-50, #eef2ff);
  color: var(--brand-primary-600, #4338ca);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px color-mix(in srgb, var(--brand-primary-500) 10%, transparent);
}

.sub-action-pill--selected {
  border-color: transparent;
  background: linear-gradient(
    135deg,
    var(--brand-primary-500, #1d4ed8),
    var(--brand-primary-400, #3b82f6)
  );
  color: var(--text-on-brand, #fff);
  box-shadow: 0 4px 14px color-mix(in srgb, var(--brand-primary-500) 28%, transparent);
  transform: translateY(-1px);
}

.sub-action-pill--selected:hover {
  filter: brightness(1.06);
  box-shadow: 0 6px 18px color-mix(in srgb, var(--brand-primary-500) 34%, transparent);
}

/* Hide native radio */
.sub-action-pill__native-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

/* Pill dot indicator */
.sub-action-pill__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid var(--brand-primary-200, #c7d2fe);
  background: transparent;
  transition: all 0.25s ease;
  flex-shrink: 0;
}

.sub-action-pill--selected .sub-action-pill__dot {
  border-color: var(--text-on-brand, #fff);
  background: var(--text-on-brand, #fff);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--text-on-brand) 30%, transparent);
}

.sub-action-pill__text {
  line-height: 1;
}

/* ── Clear Sub-Action Button ── */
.sub-action-clear {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 8px;
  padding: 5px 12px;
  border: 0;
  border-radius: 8px;
  background: var(--status-danger-soft, #fef2f2);
  color: var(--status-danger, #e23535);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sub-action-clear:hover {
  background: var(--status-danger, #e23535);
  color: var(--text-on-brand, #fff);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px color-mix(in srgb, var(--status-danger) 25%, transparent);
}

/* ── Transition: Sub-Action Expand/Collapse ── */
.sub-expand-enter-active,
.sub-expand-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.sub-expand-enter-from,
.sub-expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.sub-expand-enter-to,
.sub-expand-leave-from {
  opacity: 1;
  max-height: 200px;
}

/* ── Recipient Assignment ── */
.assignment-field {
  display: flex;
  flex-direction: column;
  gap: 13px;
  padding: 16px;
  border: 1px solid var(--brand-primary-100, #e0e7ff);
  border-radius: 16px;
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--brand-primary-500) 4%, transparent),
      transparent 34%
    ),
    var(--surface-1, #fff);
}

.assignment-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.assignment-heading > div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.assignment-heading p {
  margin: 0;
  color: var(--text-soft, #64748b);
  font-size: 12px;
}

.assignment-step {
  flex: 0 0 auto;
  padding: 5px 9px;
  border-radius: 999px;
  color: var(--brand-primary-500, #1d4ed8);
  background: var(--brand-primary-50, #eef2ff);
  font-size: 11px;
  font-weight: 700;
}

.assignment-mode-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.assignment-mode-card {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 0;
  min-height: 82px;
  gap: 11px;
  padding: 13px;
  border: 1px solid var(--main-border, #e2e8f0);
  border-radius: 14px;
  background: var(--surface-1, #fff);
  cursor: pointer;
  user-select: none;
  transition:
    border-color 0.22s ease,
    background 0.22s ease,
    box-shadow 0.22s ease,
    transform 0.18s ease;
}

.assignment-mode-card:hover {
  transform: translateY(-1px);
  border-color: var(--brand-primary-200, #c7d2fe);
  box-shadow: 0 5px 16px color-mix(in srgb, var(--brand-primary-500) 8%, transparent);
}

.assignment-mode-card--active {
  border-color: var(--brand-primary-400, #6366f1);
  background: color-mix(in srgb, var(--brand-primary-500) 5%, var(--surface-1));
  box-shadow: 0 6px 18px color-mix(in srgb, var(--brand-primary-500) 12%, transparent);
}

.assignment-mode-card > input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.assignment-mode-card:has(input:focus-visible) {
  outline: 2px solid var(--PrimaryColor);
  outline-offset: 2px;
}

.assignment-mode-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  border-radius: 13px;
  color: var(--brand-primary-500, #1d4ed8);
  background: var(--brand-primary-50, #eef2ff);
}

.hierarchy-mode-icon {
  color: var(--brand-accent-500, #d97706);
  background: color-mix(in srgb, var(--brand-accent-500) 9%, transparent);
}

.assignment-mode-icon svg {
  width: 23px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}

.assignment-mode-copy {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 2px;
}

.assignment-mode-copy strong {
  color: var(--text-strong, #0f172a);
  font-size: 14px;
}

.assignment-mode-copy small {
  color: var(--text-soft, #64748b);
  font-size: 11px;
  line-height: 1.4;
}

.assignment-radio {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex: 0 0 20px;
  border: 2px solid var(--main-border, #cbd5e1);
  border-radius: 50%;
  transition: 0.2s ease;
}

.assignment-radio i {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: transparent;
  transition: 0.2s ease;
}

.assignment-mode-card--active .assignment-radio {
  border-color: var(--brand-primary-500, #1d4ed8);
}

.assignment-mode-card--active .assignment-radio i {
  background: var(--brand-primary-500, #1d4ed8);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-primary-500) 12%, transparent);
}

.assignment-select {
  padding: 13px;
  border: 1px solid var(--main-border, #e2e8f0);
  border-radius: 13px;
  background: color-mix(in srgb, var(--surface-2, #f8fafc) 68%, var(--surface-1, #fff));
}

.assignment-swap-enter-active,
.assignment-swap-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.assignment-swap-enter-from,
.assignment-swap-leave-to {
  opacity: 0;
  transform: translateY(5px);
}

/* ── Error & Button ── */
.form-error {
  color: var(--status-danger, #dc2626);
  font-size: 14px;
}

.plan-button-wrapper button {
  width: 100%;
}

.full-width {
  grid-column: 1 / -1;
}

@media (min-width: 768px) {
  .notification-plan-form {
    grid-template-columns: minmax(0, 2fr) minmax(240px, 1fr);
    align-items: end;
  }

  .status-field {
    align-items: flex-end;
  }
}

@media (max-width: 767px) {
  .status-field {
    align-items: flex-start;
  }

  .sub-action-panel__pills {
    flex-direction: column;
  }

  .sub-action-pill {
    justify-content: center;
  }

  .assignment-mode-options {
    grid-template-columns: 1fr;
  }

  .assignment-heading {
    flex-direction: column;
  }
}
</style>
