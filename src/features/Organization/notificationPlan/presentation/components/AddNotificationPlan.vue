<script setup lang="ts">
import { computed, ref } from 'vue'
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

const router = useRouter()

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
        ? 'Select at least one employee or hierarchy'
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
  <form @submit.prevent="addNotificationPlan" class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="col-span-3 md:col-span-2 input-wrapper">
      <label for="title">Title</label>
      <input
        id="title"
        v-model.trim="title"
        class="input"
        type="text"
        maxlength="255"
        placeholder="Enter title"
        required
      />
    </div>

    <div class="col-span-3 md:col-span-1 input-wrapper status-field">
      <label for="is-active">Active</label>
      <input id="is-active" v-model="isActive" type="checkbox" />
    </div>

    <div class="col-span-3 input-wrapper">
      <CustomSelectInput
        id="action-values"
        :modelValue="selectedActions"
        label="Actions"
        :static-options="notificationPlanActionOptions"
        :reload="false"
        :type="2"
        required
        placeholder="Select actions"
        @update:modelValue="updateActions"
      />
    </div>

    <div class="col-span-3 md:col-span-1 input-wrapper">
      <CustomSelectInput
        id="employee-ids"
        :modelValue="selectedEmployees"
        label="Employees"
        :controller="indexEmployeesController"
        :params="indexEmployeesParams"
        :type="2"
        placeholder="Select employees"
        @update:modelValue="updateEmployees"
      />
    </div>

    <div class="col-span-3 md:col-span-1 input-wrapper">
      <CustomSelectInput
        id="hierarchy-ids"
        :modelValue="selectedHierarchies"
        label="Hierarchies"
        :controller="indexHierarchiesController"
        :params="indexHierarchiesParams"
        :type="2"
        placeholder="Select hierarchies"
        @update:modelValue="updateHierarchies"
      />
    </div>

    <p v-if="assignmentError" class="col-span-3 form-error">{{ assignmentError }}</p>

    <div class="col-span-3 button-wrapper">
      <button class="primary-button" type="submit" :disabled="!canSubmit">Save</button>
    </div>
  </form>
</template>

<style scoped>
.status-field {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-field input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.form-error {
  color: #dc2626;
  font-size: 14px;
}

.primary-button {
  padding: 10px 20px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.primary-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
