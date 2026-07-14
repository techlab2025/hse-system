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
import { notificationPlanActionOptions } from '../../Data/const/notification_plan_actions'
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
const selectedEmployees = ref<TitleInterface[]>([])
const selectedHierarchies = ref<TitleInterface[]>([])
const assignmentError = ref('')

const actionTitleKeys: Record<string, string> = {
  'Task assigned': 'task_assigned',
  'Project location hierarchy assignment': 'project_location_hierarchy_assignment',
  'Observation created': 'observation_created',
}

const localizedActionOptions = computed(() =>
  notificationPlanActionOptions.map(
    (item) =>
      new TitleInterface({
        id: item.id,
        title: t(actionTitleKeys[item.title] ?? item.title),
      }),
  ),
)

const canSubmit = computed(() => {
  return (
    title.value.trim().length > 0 &&
    selectedActions.value.length > 0 &&
    (selectedEmployees.value.length > 0 || selectedHierarchies.value.length > 0)
  )
})

const updateActions = (data: TitleInterface[]) => {
  selectedActions.value = data
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
    return
  }

  const notificationPlanParams = new AddNotificationPlanParams(
    title.value.trim(),
    selectedActions.value.map((item) => item.id),
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

    <div class="input-wrapper full-width">
      <CustomSelectInput
        id="action-values"
        :modelValue="selectedActions"
        label="actions"
        :static-options="localizedActionOptions"
        :reload="false"
        :type="2"
        required
        :placeholder="$t('select_actions')"
        @update:modelValue="updateActions"
      />
    </div>

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
