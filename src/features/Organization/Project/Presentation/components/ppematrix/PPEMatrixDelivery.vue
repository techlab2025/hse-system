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
const selectedActivityId = ref<number | null>(null)
const selectedEmployees = ref<TitleInterface[]>([])
const rows = ref<DeliveryRow[]>([])
const errorMessage = ref('')
const successMessage = ref('')
const availableTools = computed(
  () =>
    toolsController.state.value.data?.find((row) => row.activityId === selectedActivityId.value)
      ?.ppeTools ?? [],
)
const setEmployees = (value: TitleInterface | TitleInterface[] | null) => {
  const employees = Array.isArray(value) ? value : value ? [value] : []
  const existingRows = new Map(rows.value.map((row) => [row.employeeId, row]))

  selectedEmployees.value = employees
  rows.value = employees.map(
    (employee) =>
      existingRows.get(employee.id) ?? {
        key: employee.id,
        employeeId: employee.id,
        ppeToolIds: [],
      },
  )
}
const removeEmployee = (employeeId: number) => {
  setEmployees(selectedEmployees.value.filter((employee) => employee.id !== employeeId))
}
const hasTool = (row: DeliveryRow, toolId: number) => row.ppeToolIds.includes(toolId)
const setTool = (row: DeliveryRow, toolId: number, checked: boolean) => {
  row.ppeToolIds = checked
    ? [...row.ppeToolIds, toolId]
    : row.ppeToolIds.filter((id) => id !== toolId)
}

watch(selectedActivityId, async (activityId) => {
  selectedEmployees.value = []
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
  // if (!rows.value.length || rows.value.some((row) => !row.employeeId || !row.ppeToolIds.length)) {
  //   errorMessage.value = 'Choose at least one employee and one PPE tool for each employee.'
  //   return
  // }
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
    selectedEmployees.value = []
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
        <!-- <p>Select one activity, then choose the tools delivered to each employee.</p> -->
      </div>
      <RouterLink :to="`/organization/project-details/${projectId}/ppe-matrix`"
        >← Activity and tool matrix</RouterLink
      >
    </header>
    <p v-if="errorMessage" class="notice notice--error" role="alert">{{ errorMessage }}</p>
    <!-- <p v-if="successMessage" class="notice notice--success" role="status">{{ successMessage }}</p> -->

    <section class="card">
      <h2>1.  Activities</h2>
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

    <section v-if="selectedActivityId && availableTools.length > 0" class="card">
      <div class="section-heading">
        <div>
          <h2>2. Assign PPE tools to employees</h2>
          <p>Only tools linked to the selected activity are listed.</p>
        </div>
      </div>
      <p v-if="toolsController.isDataLoading()" class="muted">Loading activity tools…</p>
      <p v-else-if="toolsController.isDataFailed()" class="notice notice--error">
        Unable to load this activity’s PPE tools.
      </p>
      <p v-else-if="!availableTools.length" class="muted">
        This activity has no PPE tools. Add them in the matrix first.
      </p>

      <UpdatedCustomInputSelect
        id="delivery-employees"
        label=" employees"
        placeholder="Select employees"
        type="multiselect"
        :required="true"
        :reload="false"
        :controller="employeeController"
        :params="employeeParams"
        :model-value="selectedEmployees"
        @update:model-value="setEmployees"
      />

      <div v-for="(row, index) in rows" :key="row.key" class="employee-card">
        <div class="section-heading">
          <h3>{{ selectedEmployees[index]?.title ?? `Employee ${index + 1}` }}</h3>
          <button type="button" class="remove-button" @click="removeEmployee(row.employeeId)">
            Remove
          </button>
        </div>
        <div class="tool-table-wrap">
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

    <section v-else class="card empty">
      <div class="section-heading">
        <h2>No Tools Assigned To This Activity</h2>
      </div>
    </section>
  </main>
</template>

<style scoped>
.delivery-page {
  --ppe-primary: var(--PrimaryColor);
  --ppe-border: var(--main-border);
  --ppe-surface: var(--surface-2);

  display: grid;
  gap: 24px;

  width: 100%;
  /* min-height: 100%; */

  /* padding: 32px; */
}

/* =========================================================
   Header
========================================================= */

.delivery-header {
  position: relative;

  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;

  padding: 28px 30px;

  overflow: hidden;

  border: 1px solid var(--ppe-border);
  border-radius: 24px;

  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--ppe-primary) 9%, transparent),
      transparent 48%
    ),
    var(--ppe-surface);

  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.02),
    0 12px 36px rgba(15, 23, 42, 0.05);
}

.delivery-header::before {
  content: '';

  position: absolute;
  top: -130px;
  right: -80px;

  width: 250px;
  height: 250px;

  border-radius: 50%;

  background: var(--ppe-primary);

  opacity: 0.07;
  filter: blur(10px);

  pointer-events: none;
}

.delivery-header::after {
  content: '';

  position: absolute;
  bottom: 0;
  left: 30px;

  width: 92px;
  height: 4px;

  border-radius: 10px 10px 0 0;

  background: var(--ppe-primary);
}

.delivery-header > div {
  position: relative;
  z-index: 1;

  max-width: 720px;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 6px 11px;
  margin-bottom: 10px;

  border-radius: 999px;

  background: color-mix(in srgb, var(--ppe-primary) 10%, transparent);

  color: var(--ppe-primary);

  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.eyebrow::before {
  content: '';

  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: var(--ppe-primary);

  box-shadow: 0 0 0 4px color-mix(in srgb, var(--ppe-primary) 12%, transparent);
}

h1 {
  margin: 0 0 8px;

  color: var(--text-strong);

  font-size: clamp(1.55rem, 2vw, 2.05rem);
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.2;
}

h2 {
  margin: 0;

  color: var(--text-strong);

  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -0.015em;
}

h3 {
  margin: 0;

  color: var(--text-strong);

  font-size: 0.95rem;
  font-weight: 800;
}

p {
  margin: 0;

  color: var(--text-soft);

  line-height: 1.65;
}

/* =========================================================
   Back link
========================================================= */

.delivery-header > a {
  position: relative;
  z-index: 2;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  min-height: 44px;

  padding: 10px 17px;

  border: 1px solid var(--ppe-border);
  border-radius: 12px;

  background: var(--ppe-surface);

  color: var(--ppe-primary);

  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;

  box-shadow: 0 2px 5px rgba(15, 23, 42, 0.03);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.delivery-header > a:hover {
  transform: translateY(-2px);

  border-color: color-mix(in srgb, var(--ppe-primary) 30%, var(--ppe-border));

  background: color-mix(in srgb, var(--ppe-primary) 5%, var(--ppe-surface));

  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.07);
}

/* =========================================================
   Main cards
========================================================= */

.card {
  position: relative;

  padding: 26px;

  overflow: hidden;

  border: 1px solid var(--ppe-border);
  border-radius: 22px;

  background: var(--ppe-surface);

  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.02),
    0 8px 28px rgba(15, 23, 42, 0.035);
  &.empty {
    padding: 20px !important;
  }
}

.card::before {
  content: '';

  position: absolute;
  top: 0;
  left: 0;

  width: 4px;
  height: 42px;

  border-radius: 0 0 8px 0;

  background: var(--ppe-primary);
}

.card > h2 {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* =========================================================
   Section heading
========================================================= */

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  margin-bottom: 20px;
}

.section-heading > div {
  display: grid;
  gap: 5px;
}

.section-heading p {
  font-size: 0.86rem;
}

/* =========================================================
   Activity selection
========================================================= */

.activity-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  margin-top: 20px;
}

.activity-option {
  position: relative;

  display: inline-flex;
  align-items: center;
  gap: 10px;

  min-height: 46px;

  padding: 10px 16px;

  overflow: hidden;

  border: 1px solid var(--ppe-border);
  border-radius: 13px;

  background: var(--ppe-surface);

  color: var(--text-strong);

  font-size: 0.875rem;
  font-weight: 600;

  cursor: pointer;

  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease,
    color 0.18s ease,
    box-shadow 0.18s ease;
}

.activity-option::after {
  content: '';

  position: absolute;
  inset: 0;

  border-radius: inherit;

  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--ppe-primary) 8%, transparent),
    transparent 65%
  );

  opacity: 0;

  pointer-events: none;

  transition: opacity 0.18s ease;
}

.activity-option:hover {
  transform: translateY(-2px);

  border-color: color-mix(in srgb, var(--ppe-primary) 35%, var(--ppe-border));

  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
}

.activity-option:hover::after {
  opacity: 1;
}

/* selected activity */

.activity-option:has(.p-checkbox-checked),
.activity-option:has(.p-checkbox.p-highlight) {
  border-color: color-mix(in srgb, var(--ppe-primary) 50%, var(--ppe-border));

  background: color-mix(in srgb, var(--ppe-primary) 7%, var(--ppe-surface));

  color: var(--ppe-primary);

  box-shadow: 0 6px 18px color-mix(in srgb, var(--ppe-primary) 9%, transparent);
}

/* =========================================================
   PrimeVue Checkbox
========================================================= */

:deep(.p-checkbox) {
  width: 22px;
  height: 22px;

  flex-shrink: 0;

  transition:
    transform 0.18s ease,
    opacity 0.18s ease;
}

:deep(.p-checkbox:hover) {
  transform: scale(1.06);
}

:deep(.p-checkbox .p-checkbox-box) {
  width: 22px;
  height: 22px;

  border: 2px solid color-mix(in srgb, var(--text-soft) 32%, var(--ppe-border));

  border-radius: 7px;

  background: var(--ppe-surface);

  box-shadow: none;

  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

:deep(.p-checkbox:not(.p-disabled):hover .p-checkbox-box) {
  border-color: var(--ppe-primary);

  box-shadow: 0 0 0 4px color-mix(in srgb, var(--ppe-primary) 9%, transparent);
}

:deep(.p-checkbox.p-highlight .p-checkbox-box),
:deep(.p-checkbox-checked .p-checkbox-box) {
  border-color: var(--ppe-primary);

  background: var(--ppe-primary);

  box-shadow: 0 5px 13px color-mix(in srgb, var(--ppe-primary) 23%, transparent);
}

:deep(.p-checkbox .p-checkbox-icon) {
  color: #fff;

  font-size: 0.7rem;
  font-weight: 900;
}

/* =========================================================
   Employee card
========================================================= */

.employee-card {
  position: relative;

  margin: 16px 0;
  padding: 22px;

  overflow: hidden;

  border: 1px solid var(--ppe-border);
  border-radius: 18px;

  background:
    linear-gradient(
      145deg,
      color-mix(in srgb, var(--ppe-primary) 2.8%, transparent),
      transparent 40%
    ),
    color-mix(in srgb, var(--ppe-surface) 97%, var(--ppe-primary));

  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.employee-card::before {
  content: '';

  position: absolute;
  left: 0;
  top: 20px;

  width: 3px;
  height: 35px;

  border-radius: 0 6px 6px 0;

  background: var(--ppe-primary);
}

.employee-card:hover {
  transform: translateY(-2px);

  border-color: color-mix(in srgb, var(--ppe-primary) 20%, var(--ppe-border));

  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.05);
}

.employee-card .section-heading {
  margin-bottom: 18px;

  padding-bottom: 14px;

  border-bottom: 1px solid color-mix(in srgb, var(--ppe-border) 80%, transparent);
}

/* =========================================================
   Remove button
========================================================= */

.remove-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-height: 36px;

  padding: 7px 12px;

  border: 1px solid #fecaca;
  border-radius: 10px;

  background: #fff8f8;

  color: #c03737;

  font-size: 0.8rem;
  font-weight: 700;

  cursor: pointer;

  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease,
    box-shadow 0.18s ease;
}

.remove-button:hover {
  transform: translateY(-1px);

  border-color: #fca5a5;

  background: #fff0f0;

  box-shadow: 0 5px 12px rgba(220, 38, 38, 0.08);
}

/* =========================================================
   Employee select
========================================================= */

.employee-card :deep(.input-holder),
.employee-card :deep(.input-container),
.employee-card :deep(.form-group) {
  width: 100%;
}

/* =========================================================
   PPE tool table
========================================================= */

.tool-table-wrap {
  margin-top: 20px;

  overflow: hidden;

  border: 1px solid var(--ppe-border);
  border-radius: 15px;

  background: var(--ppe-surface);

  box-shadow: 0 3px 12px rgba(15, 23, 42, 0.025);
}

.tool-table {
  width: 100%;

  border-collapse: separate;
  border-spacing: 0;
}

.tool-table th,
.tool-table td {
  height: 56px;

  padding: 12px 18px;

  border-bottom: 1px solid var(--ppe-border);

  vertical-align: middle;
}

.tool-table thead th {
  background: color-mix(in srgb, var(--ppe-primary) 4.5%, var(--ppe-surface));

  color: var(--text-strong);

  font-size: 0.77rem;
  font-weight: 800;
  letter-spacing: 0.035em;
  text-transform: uppercase;
}

.tool-table thead th:first-child {
  text-align: start;
}

.tool-table thead th:last-child {
  width: 130px;

  text-align: center;
}

.tool-table tbody th {
  color: var(--text-strong);

  font-size: 0.875rem;
  font-weight: 650;

  text-align: start;
}

.tool-table tbody td {
  width: 130px;

  text-align: center;
}

.tool-table tbody tr:last-child th,
.tool-table tbody tr:last-child td {
  border-bottom: 0;
}

.tool-table tbody tr {
  transition: background 0.18s ease;
}

.tool-table tbody tr:hover {
  background: color-mix(in srgb, var(--ppe-primary) 3.5%, transparent);
}

/* =========================================================
   Buttons
========================================================= */

.button-primary,
.button-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  min-height: 44px;

  padding: 10px 17px;

  border-radius: 12px;

  font-size: 0.875rem;
  font-weight: 750;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}

.button-primary {
  border: 1px solid var(--ppe-primary);

  background: var(--ppe-primary);

  color: #fff;

  box-shadow: 0 6px 16px color-mix(in srgb, var(--ppe-primary) 20%, transparent);
}

.button-primary:hover:not(:disabled) {
  transform: translateY(-2px);

  background: color-mix(in srgb, var(--ppe-primary) 88%, #000);

  box-shadow: 0 10px 24px color-mix(in srgb, var(--ppe-primary) 27%, transparent);
}

.button-secondary {
  border: 1px solid color-mix(in srgb, var(--ppe-primary) 45%, var(--ppe-border));

  background: color-mix(in srgb, var(--ppe-primary) 5%, var(--ppe-surface));

  color: var(--ppe-primary);
}

.button-secondary:hover:not(:disabled) {
  transform: translateY(-2px);

  border-color: var(--ppe-primary);

  background: color-mix(in srgb, var(--ppe-primary) 10%, var(--ppe-surface));

  box-shadow: 0 7px 18px color-mix(in srgb, var(--ppe-primary) 10%, transparent);
}

button:disabled {
  opacity: 0.5;

  cursor: not-allowed;

  transform: none !important;
  box-shadow: none !important;
}

/* save button */

.card > .button-primary:last-child {
  min-width: 170px;

  margin-top: 8px;
}

/* =========================================================
   Notices
========================================================= */

.notice {
  position: relative;

  display: flex;
  align-items: center;

  min-height: 52px;

  padding: 14px 18px 14px 22px;

  overflow: hidden;

  border-radius: 14px;

  font-size: 0.875rem;
  font-weight: 600;

  animation: notice-enter 0.25s ease;
}

.notice::before {
  content: '';

  position: absolute;
  inset-inline-start: 0;
  top: 0;
  bottom: 0;

  width: 4px;
}

.notice--error {
  border: 1px solid #fecaca;

  background: #fff7f7;

  color: #b42318;
}

.notice--error::before {
  background: #ef4444;
}

.notice--success {
  border: 1px solid #bbf7d0;

  background: #f0fdf4;

  color: #15803d;
}

.notice--success::before {
  background: #22c55e;
}

@keyframes notice-enter {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* =========================================================
   Muted / empty states
========================================================= */

.muted {
  margin-top: 16px;

  padding: 18px;

  border: 1px dashed color-mix(in srgb, var(--ppe-border) 90%, transparent);

  border-radius: 12px;

  background: color-mix(in srgb, var(--ppe-primary) 2.5%, transparent);

  color: var(--text-soft);

  font-size: 0.86rem;

  text-align: center;
}

/* =========================================================
   Accessibility
========================================================= */

.delivery-header > a:focus-visible,
.button-primary:focus-visible,
.button-secondary:focus-visible,
.remove-button:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--ppe-primary) 22%, transparent);

  outline-offset: 3px;
}

:deep(.p-checkbox-input:focus-visible + .p-checkbox-box) {
  outline: none;

  box-shadow: 0 0 0 4px color-mix(in srgb, var(--ppe-primary) 15%, transparent);
}

/* =========================================================
   Responsive
========================================================= */

@media (max-width: 900px) {
  .delivery-page {
    padding: 22px;
  }

  .delivery-header {
    align-items: flex-start;
    flex-direction: column;

    padding: 24px;
  }

  .delivery-header > a {
    align-self: flex-start;
  }

  .card {
    padding: 22px;
  }
}

@media (max-width: 720px) {
  .delivery-page {
    gap: 18px;

    padding: 16px;
  }

  .delivery-header {
    gap: 20px;

    padding: 20px;

    border-radius: 18px;
  }

  .delivery-header::after {
    left: 20px;
  }

  h1 {
    font-size: 1.4rem;
  }

  .delivery-header > a {
    width: 100%;
  }

  .card {
    padding: 20px;

    border-radius: 18px;
  }

  .section-heading {
    align-items: stretch;
    flex-direction: column;

    gap: 14px;
  }

  .section-heading .button-secondary {
    width: 100%;
  }

  .activity-list {
    display: grid;
    grid-template-columns: 1fr;
  }

  .activity-option {
    width: 100%;
  }

  .employee-card {
    padding: 18px;
  }

  .employee-card .section-heading {
    flex-direction: row;
    align-items: center;
  }

  .tool-table-wrap {
    overflow-x: auto;
  }

  .tool-table {
    min-width: 480px;
  }

  .card > .button-primary:last-child {
    width: 100%;

    margin-top: 12px;
  }
}

@media (max-width: 480px) {
  .delivery-page {
    padding: 12px;
  }

  .delivery-header {
    padding: 18px;
  }

  .card {
    padding: 16px;
  }

  .employee-card {
    padding: 16px;
  }

  .employee-card .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .remove-button {
    width: 100%;
  }
}
</style>
