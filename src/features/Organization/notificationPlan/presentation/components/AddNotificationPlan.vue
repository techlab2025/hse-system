<script setup lang="ts">
import { computed, ref } from 'vue'
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

const router = useRouter()
const { t } = useI18n()

const indexEmployeesController = IndexOrganizatoinEmployeeController.getInstance()
const indexEmployeesParams = new IndexOrganizatoinEmployeeParams('', 1, 30, 1)

const indexHierarchiesController = IndexHerikalyController.getInstance()
const indexHierarchiesParams = new IndexHerikalyParams('', 1, 30, 1, true)

const title = ref('')
const isActive = ref(true)
const selectedActions = ref<TitleInterface[]>([])
const selectedSubActionByAction = ref<Record<number, number>>({})
const selectedEmployees = ref<TitleInterface[]>([])
const selectedHierarchies = ref<TitleInterface[]>([])
const assignmentError = ref('')
const actionValueError = ref('')

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

const canSubmit = computed(() => {
  return (
    title.value.trim().length > 0 &&
    actionValues.value.length > 0 &&
    (selectedEmployees.value.length > 0 || selectedHierarchies.value.length > 0)
  )
})

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

const addNotificationPlan = async () => {
  if (!canSubmit.value) {
    assignmentError.value =
      selectedEmployees.value.length === 0 && selectedHierarchies.value.length === 0
        ? t('select_employee_or_hierarchy_error')
        : ''
    actionValueError.value = selectedActions.value.length === 0 ? t('select_actions') : ''
    return
  }

  const notificationPlanParams = new AddNotificationPlanParams(
    title.value.trim(),
    actionValues.value,
    selectedEmployees.value.map((item) => item.id),
    selectedHierarchies.value.map((item) => item.id),
    isActive.value,
  )

  await AddNotificationPlanController.getInstance().addNotificationPlan(
    notificationPlanParams,
    router,
  )
}
</script>

<template>
  <form @submit.prevent="addNotificationPlan" class="notification-plan-form">
    <div class="input-wrapper title-field">
      <label for="title">{{ $t('title') }}</label>
      <input
        id="title"
        v-model.trim="title"
        class="input"
        type="text"
        maxlength="255"
        :placeholder="$t('enter_notification_plan_title')"
        required
      />
    </div>

    <div class="input-wrapper status-field">
      <CustomCheckbox
        title="active"
        :checked="isActive"
        :index="0"
        @update:checked="isActive = $event"
      />
    </div>

    <div class="input-wrapper full-width action-tree-field">
      <label class="tree-label required">{{ $t('actions') }}</label>

      <div class="action-tree">
        <div v-for="action in localizedActionOptions" :key="action.id" class="action-tree-node">
          <label class="tree-row parent-row" :for="`notification-action-${action.id}`">
            <input
              :id="`notification-action-${action.id}`"
              type="checkbox"
              :checked="isActionSelected(action.id)"
              @change="toggleAction(action, eventChecked($event))"
            />
            <span>{{ optionTitle(action) }}</span>
          </label>

          <div
            v-if="isActionSelected(action.id) && supportsSubAction(action.id)"
            class="sub-action-tree"
          >
            <label
              v-for="subAction in localizedSubActionOptions"
              :key="subAction.id"
              class="tree-row child-row"
              :for="`notification-sub-action-${action.id}-${subAction.id}`"
            >
              <input
                :id="`notification-sub-action-${action.id}-${subAction.id}`"
                type="radio"
                :name="`notification-sub-action-${action.id}`"
                :checked="isSubActionSelected(action.id, subAction.id)"
                @change="selectSubAction(action, subAction)"
              />
              <span>{{ optionTitle(subAction) }}</span>
            </label>

            <button
              v-if="selectedSubActionByAction[action.id] !== undefined"
              type="button"
              class="clear-sub-action-button"
              @click="clearSubAction(action.id)"
            >
              {{ $t('clear') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <p v-if="actionValueError" class="full-width form-error">{{ actionValueError }}</p>

    <div class="input-wrapper">
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

    <div class="input-wrapper">
      <CustomSelectInput
        id="hierarchy-ids"
        :modelValue="selectedHierarchies"
        label="hierarchies"
        :controller="indexHierarchiesController"
        :params="indexHierarchiesParams"
        :type="2"
        :placeholder="$t('select_hierarchies')"
        @update:modelValue="updateHierarchies"
      />
    </div>

    <p v-if="assignmentError" class="full-width form-error">{{ assignmentError }}</p>

    <div class="full-width plan-button-wrapper">
      <button class="btn btn-primary" type="submit" :disabled="!canSubmit">
        {{ $t('save') }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.notification-plan-form {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
  width: 100%;
}

.input-wrapper {
  min-width: 0;
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
  gap: 8px;
}

.tree-label {
  font-weight: 600;
}

.tree-label.required::before {
  content: '*';
  color: #ef4444;
  margin-inline-end: 4px;
}

.action-tree {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
}

.action-tree-node {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tree-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 36px;
  cursor: pointer;
}

.tree-row input {
  width: 16px;
  height: 16px;
  accent-color: var(--primary-color, #2563eb);
}

.parent-row {
  font-weight: 600;
}

.sub-action-tree {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-inline-start: 26px;
  padding-inline-start: 16px;
  border-inline-start: 1px solid #d1d5db;
}

.child-row {
  color: #4b5563;
}

.clear-sub-action-button {
  align-self: flex-start;
  margin-inline-start: 26px;
  color: #2563eb;
  font-size: 13px;
  font-weight: 600;
  background: transparent;
  border: 0;
  cursor: pointer;
}

.form-error {
  color: #dc2626;
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
}
</style>
