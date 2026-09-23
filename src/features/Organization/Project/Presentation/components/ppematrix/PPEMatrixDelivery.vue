<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import Checkbox from 'primevue/checkbox'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import IndexPPEActivityController from '@/features/Organization/PPEActivity/Presentation/controllers/indexPPEActivityController'
import IndexPPEActivityParams from '@/features/Organization/PPEActivity/Core/params/indexPPEActivityParams'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import FetchPPEActivityToolsParams from '../../../Core/params/ppematrix/FetchPPEActivityToolsParams'
import CreatePPEMatrixDeliveryParams, {
  type PPEMatrixDeliveryEmployee,
} from '../../../Core/params/ppematrix/CreatePPEMatrixDeliveryParams'
import FetchPPEActivityToolsController from '../../controllers/ppematrix/FetchPPEActivityToolsController'
import CreatePPEMatrixDeliveryController from '../../controllers/ppematrix/CreatePPEMatrixDeliveryController'

interface DeliveryRow extends PPEMatrixDeliveryEmployee {
  key: number
}
const route = useRoute()
const projectId = computed(() => Number(route.params.id))
const activityController = IndexPPEActivityController.getInstance()
const employeeController = IndexOrganizatoinEmployeeController.getInstance()
const toolsController = FetchPPEActivityToolsController.getInstance()
const deliveryController = CreatePPEMatrixDeliveryController.getInstance()
const employeeParams = new IndexOrganizatoinEmployeeParams('', 0, 0, 0)
const activities = computed(() => activityController.state.value.data ?? [])
const employeeOptions = computed(() =>
  (employeeController.state.value.data ?? []).map(
    (employee) => new TitleInterface({ id: employee.id, title: employee.name }),
  ),
)
const selectedActivityId = ref<number | null>(null)
const rows = ref<DeliveryRow[]>([])
const nextKey = ref(1)
const errorMessage = ref('')
const successMessage = ref('')
const availableTools = computed(
  () =>
    toolsController.state.value.data?.find((row) => row.activityId === selectedActivityId.value)
      ?.ppeTools ?? [],
)
const selectedEmployee = (id: number) =>
  employeeOptions.value.find((option) => option.id === id) ?? null
const selectedId = (value: TitleInterface | TitleInterface[] | null) =>
  value && !Array.isArray(value) ? value.id : 0
const addEmployee = () => rows.value.push({ key: nextKey.value++, employeeId: 0, ppeToolIds: [] })
const setEmployee = (row: DeliveryRow, value: TitleInterface | TitleInterface[] | null) => {
  row.employeeId = selectedId(value)
}
const hasTool = (row: DeliveryRow, toolId: number) => row.ppeToolIds.includes(toolId)
const setTool = (row: DeliveryRow, toolId: number, checked: boolean) => {
  row.ppeToolIds = checked
    ? [...row.ppeToolIds, toolId]
    : row.ppeToolIds.filter((id) => id !== toolId)
}

watch(selectedActivityId, async (activityId) => {
  rows.value = []
  errorMessage.value = ''
  successMessage.value = ''
  if (activityId)
    await toolsController.fetchPPEActivityTools(new FetchPPEActivityToolsParams(activityId))
})

const submit = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  if (!Number.isInteger(projectId.value) || projectId.value <= 0 || !selectedActivityId.value) {
    errorMessage.value = 'Select a project activity first.'
    return
  }
  if (!rows.value.length || rows.value.some((row) => !row.employeeId || !row.ppeToolIds.length)) {
    errorMessage.value = 'Choose at least one employee and one PPE tool for each employee.'
    return
  }
  if (new Set(rows.value.map((row) => row.employeeId)).size !== rows.value.length) {
    errorMessage.value = 'Select each employee only once.'
    return
  }
  try {
    await deliveryController.createPPEMatrixDelivery(
      new CreatePPEMatrixDeliveryParams(
        projectId.value,
        selectedActivityId.value,
        rows.value.map((row) => ({ employeeId: row.employeeId, ppeToolIds: row.ppeToolIds })),
      ),
    )
    if (!deliveryController.isDataSuccess()) throw new Error('Delivery failed')
    rows.value = []
    successMessage.value = 'PPE delivery saved.'
  } catch {
    errorMessage.value = 'Unable to save PPE delivery. Please try again.'
  }
}

onMounted(async () => {
  await Promise.allSettled([
    activityController.getData(new IndexPPEActivityParams('', 1, 10, 0)),
    employeeController.getData(employeeParams),
  ])
})
</script>

<template>

  <main class="delivery-page">
    <header class="delivery-header">
      <div>
        <span class="eyebrow">Project PPE</span>
        <h1>PPE delivery</h1>
        <p>Select one activity, then choose the tools delivered to each employee.</p>
      </div>
      <RouterLink :to="`/organization/project-details/${projectId}/ppe-matrix`"
        >← Activity and tool matrix</RouterLink
      >
    </header>
    <p v-if="errorMessage" class="notice notice--error" role="alert">{{ errorMessage }}</p>
    <p v-if="successMessage" class="notice notice--success" role="status">{{ successMessage }}</p>

    <section class="card">
      <h2>1. Select one PPE activity</h2>
      <div class="activity-list">
        <label v-for="activity in activities" :key="activity.id" class="activity-option">
          <Checkbox
            :input-id="`delivery-activity-${activity.id}`"
            :model-value="selectedActivityId === activity.id"
            binary
            @update:model-value="
              (checked) => {
                selectedActivityId = checked ? activity.id : null
              }
            "
          />
          <span>{{ activity.title }}</span>
        </label>
      </div>
      <p v-if="!activities.length" class="muted">No PPE activities available.</p>
    </section>

    <section v-if="selectedActivityId" class="card">
      <div class="section-heading">
        <div>
          <h2>2. Assign PPE tools to employees</h2>
          <p>Only tools linked to the selected activity are listed.</p>
        </div>
        <button
          type="button"
          class="button-secondary"
          :disabled="!availableTools.length"
          @click="addEmployee"
        >
          + Add employee
        </button>
      </div>
      <p v-if="toolsController.isDataLoading()" class="muted">Loading activity tools…</p>
      <p v-else-if="toolsController.isDataFailed()" class="notice notice--error">
        Unable to load this activity’s PPE tools.
      </p>
      <p v-else-if="!availableTools.length" class="muted">
        This activity has no PPE tools. Add them in the matrix first.
      </p>
      <div v-for="(row, index) in rows" :key="row.key" class="employee-card">
        <div class="section-heading">
          <h3>Employee {{ index + 1 }}</h3>
          <button type="button" class="remove-button" @click="rows.splice(index, 1)">Remove</button>
        </div>
        <UpdatedCustomInputSelect
          :id="`delivery-employee-${row.key}`"
          label="Organization employee"
          placeholder="Select employee"
          :required="true"
          :reload="false"
          :controller="employeeController"
          :params="employeeParams"
          :model-value="selectedEmployee(row.employeeId)"
          @update:model-value="(value) => setEmployee(row, value)"
        />
        <div v-if="row.employeeId" class="tool-table-wrap">
          <table class="main-table tool-table">
            <thead>
              <tr>
                <th scope="col">PPE tool</th>
                <th scope="col">Delivered</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tool in availableTools" :key="tool.id">
                <th scope="row">{{ tool.title }}</th>
                <td>
                  <Checkbox
                    :input-id="`delivery-tool-${row.key}-${tool.id}`"
                    :model-value="hasTool(row, tool.id)"
                    binary
                    :aria-label="`${tool.title} delivered to employee ${index + 1}`"
                    @update:model-value="(checked) => setTool(row, tool.id, Boolean(checked))"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <button
        type="button"
        class="button-primary"
        :disabled="deliveryController.isDataLoading() || !rows.length"
        @click="submit"
      >
        {{ deliveryController.isDataLoading() ? 'Saving…' : 'Save PPE delivery' }}
      </button>
    </section>
  </main>
</template>

<style scoped>
.delivery-page {
  padding: 28px;
  display: grid;
  gap: 20px;
}
.delivery-header,
.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}
.delivery-header a {
  color: var(--PrimaryColor);
  font-weight: 700;
  text-decoration: none;
}
.eyebrow {
  color: var(--PrimaryColor);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
h1 {
  margin: 5px 0;
}
h2 {
  margin: 0 0 16px;
  font-size: 1.2rem;
}
h3 {
  margin: 0;
  font-size: 1rem;
}
p {
  margin: 0;
  color: var(--text-soft);
}
.card,
.employee-card {
  padding: 24px;
  border: 1px solid var(--main-border);
  border-radius: 18px;
  background: var(--surface-2);
}
.employee-card {
  margin: 16px 0;
}
.activity-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 18px;
}
.activity-option {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: 1px solid var(--main-border);
  border-radius: 12px;
  cursor: pointer;
}
.tool-table-wrap {
  margin-top: 18px;
  overflow: auto;
  border: 1px solid var(--main-border);
  border-radius: 12px;
}
.tool-table {
  width: 100%;
  border-collapse: collapse;
}
.tool-table th,
.tool-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--main-border);
  text-align: start;
}
.tool-table td {
  width: 110px;
  text-align: center;
}
.button-primary,
.button-secondary {
  padding: 11px 17px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}
.button-primary {
  background: var(--PrimaryColor);
  color: white;
  border: 1px solid var(--PrimaryColor);
}
.button-secondary {
  background: transparent;
  color: var(--PrimaryColor);
  border: 1px solid var(--PrimaryColor);
}
button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.remove-button {
  border: 0;
  background: none;
  color: #b53b3b;
  cursor: pointer;
}
.notice {
  padding: 14px 18px;
  border-radius: 12px;
}
.notice--error {
  background: #fff0f0;
  color: #a42b2b;
}
.notice--success {
  background: #e9f8ef;
  color: #19713e;
}
.muted {
  margin-top: 14px;
}
@media (max-width: 720px) {
  .delivery-page {
    padding: 16px;
  }
  .delivery-header,
  .section-heading {
    align-items: start;
    flex-direction: column;
  }
}
</style>
