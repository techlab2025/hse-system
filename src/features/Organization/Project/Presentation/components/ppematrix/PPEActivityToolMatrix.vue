<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import Checkbox from 'primevue/checkbox'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import IndexPPEToolController from '@/features/Organization/PPETool/Presentation/controllers/indexPPEToolController'
import IndexPPEToolParams from '@/features/Organization/PPETool/Core/params/indexPPEToolParams'
import IndexPPEActivityController from '@/features/Organization/PPEActivity/Presentation/controllers/indexPPEActivityController'
import IndexPPEActivityParams from '@/features/Organization/PPEActivity/Core/params/indexPPEActivityParams'
import CreatePPEActivityToolParams from '../../../Core/params/ppematrix/CreatePPEActivityToolParams'
import FetchPPEActivityToolsParams from '../../../Core/params/ppematrix/FetchPPEActivityToolsParams'
import CreatePPEActivityToolController from '../../controllers/ppematrix/CreatePPEActivityToolController'
import FetchPPEActivityToolsController from '../../controllers/ppematrix/FetchPPEActivityToolsController'

const route = useRoute()
const projectId = computed(() => Number(route.params.id))
const activityController = IndexPPEActivityController.getInstance()
const toolController = IndexPPEToolController.getInstance()
const matrixController = FetchPPEActivityToolsController.getInstance()
const toggleController = CreatePPEActivityToolController.getInstance()
const activities = computed(() => activityController.state.value.data ?? [])
const tools = computed(() => toolController.state.value.data ?? [])
const matrix = computed(() => matrixController.state.value.data ?? [])
const pending = ref(new Set<string>())
const errorMessage = ref('')
const keyFor = (activityId: number, toolId: number) => `${activityId}:${toolId}`
const isLinked = (activityId: number, toolId: number) =>
  matrix.value.some(
    (row) => row.activityId === activityId && row.ppeTools.some((tool) => tool.id === toolId),
  )

const refreshMatrix = () =>
  matrixController.fetchPPEActivityTools(new FetchPPEActivityToolsParams())

const toggle = async (activityId: number, toolId: number) => {
  const key = keyFor(activityId, toolId)
  if (pending.value.size) return
  errorMessage.value = ''
  pending.value = new Set([...pending.value, key])
  try {
    await toggleController.createPPEActivityTool(
      new CreatePPEActivityToolParams(activityId, toolId),
    )
    if (!toggleController.isDataSuccess())
      throw new Error('Unable to update this activity and tool.')
    await refreshMatrix()
    if (!matrixController.isDataSuccess()) throw new Error('Unable to refresh the matrix.')
  } catch {
    errorMessage.value = 'Unable to update this activity and tool. Please try again.'
  } finally {
    const next = new Set(pending.value)
    next.delete(key)
    pending.value = next
  }
}

onMounted(async () => {
  await Promise.allSettled([
    activityController.getData(new IndexPPEActivityParams('', 1, 10, 0)),
    toolController.getData(new IndexPPEToolParams('', 1, 10, 0)),
    refreshMatrix(),
  ])
})
</script>

<template>
  <main class="ppe-page">
    <header class="ppe-header">
      <div>
        <span class="eyebrow">Project PPE</span>
        <h1>Activity and tool matrix</h1>
        <!-- <p>Choose the PPE tools required for each activity.</p> -->
      </div>
      <nav class="header-actions" aria-label="PPE navigation">
        <!-- <RouterLink :to="`/organization/project-details/${projectId}`">Project details</RouterLink> -->
        <RouterLink
          class="primary-link"
          :to="`/organization/project-details/${projectId}/ppe-delivery`"
          >Deliver PPE →</RouterLink
        >
      </nav>
    </header>
    <p v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</p>
    <p
      v-if="activityController.isDataFailed() || toolController.isDataFailed()"
      class="error-message"
      role="alert"
    >
      Unable to load PPE activities or tools.
    </p>
    <DataStatus :controller="toolController.state.value">
      <template #success>
        <div class="matrix-scroll">
          <table class="main-table matrix-table">
            <thead>
              <tr>
                <th scope="col">PPE activity</th>

                <th v-for="tool in tools" :key="tool.id" scope="col">{{ tool.title }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="activity in activities" :key="activity.id">
                <th scope="row">{{ activity.title }}</th>
                <td v-for="tool in tools" :key="tool.id">
                  <Checkbox
                    :input-id="`ppe-${activity.id}-${tool.id}`"
                    :model-value="isLinked(activity.id, tool.id)"
                    binary
                    :disabled="pending.size > 0"
                    :aria-label="`${tool.title} required for ${activity.title}`"
                    @update:model-value="() => toggle(activity.id, tool.id)"
                  />
                </td>
              </tr>
              <tr v-if="!activities.length || !tools.length">
                <td :colspan="Math.max(tools.length + 1, 2)" class="empty-cell">
                  Add PPE activities and tools to build the matrix.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template #loader><TableLoader :cols="5" :rows="6" /></template>
      <template #initial><TableLoader :cols="5" :rows="6" /></template>
      <template #failed
        ><p class="error-message">Unable to load activity tool assignments.</p></template
      >
      <template #empty><p class="empty-cell">No activity tool assignments yet.</p></template>
    </DataStatus>
  </main>
</template>

<style scoped>
.ppe-page {
  --ppe-primary: var(--PrimaryColor);
  --ppe-border: var(--main-border);
  --ppe-surface: var(--surface-2);
  --ppe-radius-lg: 24px;
  --ppe-radius-md: 14px;

  width: 100%;
  /* padding: 32px; */
  min-height: 100%;
}

/* ========================================
   Header
======================================== */

.ppe-header {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;

  padding: 26px 28px;
  margin-bottom: 24px;

  overflow: hidden;

  border: 1px solid var(--ppe-border);
  border-radius: var(--ppe-radius-lg);

  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--ppe-primary) 8%, transparent),
      transparent 45%
    ),
    var(--ppe-surface);

  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.02),
    0 12px 35px rgba(15, 23, 42, 0.05);
}

/* decorative glow */

.ppe-header::before {
  content: '';
  position: absolute;
  width: 220px;
  height: 220px;

  top: -120px;
  right: -70px;

  border-radius: 50%;

  background: var(--ppe-primary);
  opacity: 0.07;
  filter: blur(8px);

  pointer-events: none;
}

.ppe-header::after {
  content: '';
  position: absolute;

  width: 90px;
  height: 4px;

  left: 28px;
  bottom: 0;

  border-radius: 10px 10px 0 0;

  background: var(--ppe-primary);
}

.ppe-header > div {
  position: relative;
  z-index: 1;
  max-width: 680px;
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
  letter-spacing: 0.1em;
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

  font-size: clamp(1.45rem, 2vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.2;
}

p {
  margin: 0;
  color: var(--text-soft);
  line-height: 1.65;
}

/* ========================================
   Header actions
======================================== */

.header-actions {
  position: relative;
  z-index: 2;

  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.header-actions a {
  display: inline-flex;
  align-items: center;
  justify-content: center;

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
    background 0.2s ease,
    border-color 0.2s ease;
}

.header-actions a:hover {
  transform: translateY(-2px);

  border-color: color-mix(in srgb, var(--ppe-primary) 30%, var(--ppe-border));

  background: color-mix(in srgb, var(--ppe-primary) 5%, var(--ppe-surface));

  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
}

.header-actions a:active {
  transform: translateY(0);
}

.header-actions .primary-link {
  border-color: var(--ppe-primary);

  background: var(--ppe-primary);
  color: #fff;

  box-shadow: 0 6px 16px color-mix(in srgb, var(--ppe-primary) 22%, transparent);
}

.header-actions .primary-link:hover {
  border-color: var(--ppe-primary);

  background: color-mix(in srgb, var(--ppe-primary) 88%, #000);

  box-shadow: 0 10px 24px color-mix(in srgb, var(--ppe-primary) 26%, transparent);
}

/* ========================================
   Error
======================================== */

.error-message {
  position: relative;

  display: flex;
  align-items: center;

  min-height: 52px;

  padding: 14px 18px 14px 22px;
  margin: 0 0 20px;

  overflow: hidden;

  border: 1px solid #fecaca;
  border-radius: 14px;

  background: #fff7f7;
  color: #b42318;

  font-size: 0.875rem;
  font-weight: 600;
}

.error-message::before {
  content: '';

  position: absolute;
  inset-inline-start: 0;
  top: 0;
  bottom: 0;

  width: 4px;

  background: #ef4444;
}

/* ========================================
   Matrix container
======================================== */

.matrix-scroll {
  position: relative;

  width: 100%;
  max-height: calc(100vh - 280px);

  overflow: auto;

  border: 1px solid var(--ppe-border);
  border-radius: var(--ppe-radius-lg);

  background: var(--ppe-surface);

  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.02),
    0 10px 32px rgba(15, 23, 42, 0.045);

  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--ppe-primary) 25%, transparent) transparent;
}

.matrix-scroll::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.matrix-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.matrix-scroll::-webkit-scrollbar-thumb {
  border-radius: 10px;

  background: color-mix(in srgb, var(--ppe-primary) 24%, transparent);
}

.matrix-scroll::-webkit-scrollbar-thumb:hover {
  background: color-mix(in srgb, var(--ppe-primary) 38%, transparent);
}

/* ========================================
   Matrix table
======================================== */

.matrix-table {
  min-width: 760px;
  width: 100%;

  border-collapse: separate;
  border-spacing: 0;

  table-layout: auto;
}

.matrix-table th,
.matrix-table td {
  height: 64px;
  padding: 13px 18px;

  border-bottom: 1px solid var(--ppe-border);

  vertical-align: middle;
}

.matrix-table tr:last-child th,
.matrix-table tr:last-child td {
  border-bottom: 0;
}

/* ========================================
   Table header
======================================== */

.matrix-table thead th {
  position: sticky;
  top: 0;
  z-index: 5;

  min-width: 145px;

  background:
    linear-gradient(180deg, color-mix(in srgb, var(--ppe-primary) 5%, transparent), transparent),
    var(--ppe-surface);

  color: var(--text-strong);

  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.02em;

  text-align: center;
  white-space: nowrap;

  box-shadow: inset 0 -1px 0 var(--ppe-border);
}

.matrix-table thead th:first-child {
  left: 0;
  z-index: 8;

  min-width: 230px;

  padding-inline-start: 22px;

  text-align: start;

  background:
    linear-gradient(135deg, color-mix(in srgb, var(--ppe-primary) 10%, transparent), transparent),
    var(--ppe-surface);
}

/* ========================================
   Activity column
======================================== */

.matrix-table tbody th {
  position: sticky;
  left: 0;
  z-index: 4;

  min-width: 230px;

  padding-inline-start: 22px;

  background: var(--ppe-surface);

  color: var(--text-strong);

  font-size: 0.875rem;
  font-weight: 700;

  text-align: start;

  box-shadow:
    1px 0 0 var(--ppe-border),
    6px 0 14px rgba(15, 23, 42, 0.015);

  transition:
    background 0.2s ease,
    color 0.2s ease;
}

/* subtle indicator */

.matrix-table tbody th::before {
  content: '';

  position: absolute;

  inset-inline-start: 0;
  top: 50%;

  width: 3px;
  height: 0;

  border-radius: 0 10px 10px 0;

  background: var(--ppe-primary);

  transform: translateY(-50%);

  transition: height 0.2s ease;
}

/* ========================================
   Matrix cells
======================================== */

.matrix-table tbody td {
  position: relative;

  min-width: 130px;

  text-align: center;

  transition: background 0.18s ease;
}

.matrix-table tbody tr {
  transition:
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.matrix-table tbody tr:hover td {
  background: color-mix(in srgb, var(--ppe-primary) 3.5%, transparent);
}

.matrix-table tbody tr:hover th {
  background: color-mix(in srgb, var(--ppe-primary) 5%, var(--ppe-surface));

  color: var(--ppe-primary);
}

.matrix-table tbody tr:hover th::before {
  height: 28px;
}

/* vertical column separation */

.matrix-table td:not(:last-child),
.matrix-table thead th:not(:last-child) {
  border-inline-end: 1px solid color-mix(in srgb, var(--ppe-border) 75%, transparent);
}

/* ========================================
   PrimeVue Checkbox
======================================== */

.matrix-table :deep(.p-checkbox) {
  width: 22px;
  height: 22px;

  transition:
    transform 0.18s ease,
    opacity 0.18s ease;
}

.matrix-table :deep(.p-checkbox:hover) {
  transform: scale(1.08);
}

.matrix-table :deep(.p-checkbox .p-checkbox-box) {
  width: 22px;
  height: 22px;

  border: 2px solid color-mix(in srgb, var(--text-soft) 35%, var(--ppe-border));

  border-radius: 7px;

  background: var(--ppe-surface);

  box-shadow: none;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.matrix-table :deep(.p-checkbox:not(.p-disabled):hover .p-checkbox-box) {
  border-color: var(--ppe-primary);

  box-shadow: 0 0 0 4px color-mix(in srgb, var(--ppe-primary) 9%, transparent);
}

.matrix-table :deep(.p-checkbox.p-highlight .p-checkbox-box),
.matrix-table :deep(.p-checkbox-checked .p-checkbox-box) {
  border-color: var(--ppe-primary);

  background: var(--ppe-primary);

  box-shadow: 0 5px 12px color-mix(in srgb, var(--ppe-primary) 22%, transparent);
}

.matrix-table :deep(.p-checkbox .p-checkbox-icon) {
  color: #fff;
  font-size: 0.7rem;
  font-weight: 900;
}

.matrix-table :deep(.p-checkbox.p-disabled) {
  opacity: 0.55;
}

/* ========================================
   Empty state
======================================== */

.empty-cell {
  padding: 48px 24px !important;

  color: var(--text-soft);

  font-size: 0.9rem;
  font-weight: 500;

  text-align: center !important;
}

/* ========================================
   Focus accessibility
======================================== */

.header-actions a:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--ppe-primary) 25%, transparent);

  outline-offset: 3px;
}

.matrix-table :deep(.p-checkbox-input:focus-visible + .p-checkbox-box) {
  outline: none;

  box-shadow: 0 0 0 4px color-mix(in srgb, var(--ppe-primary) 15%, transparent);
}

/* ========================================
   Responsive
======================================== */

@media (max-width: 900px) {
  .ppe-page {
    padding: 22px;
  }

  .ppe-header {
    align-items: flex-start;
    flex-direction: column;

    padding: 22px;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions a {
    flex: 1;
  }

  .matrix-scroll {
    max-height: calc(100vh - 320px);
  }
}

@media (max-width: 600px) {
  .ppe-page {
    padding: 14px;
  }

  .ppe-header {
    gap: 20px;

    padding: 20px;

    border-radius: 18px;
  }

  .ppe-header::after {
    left: 20px;
  }

  h1 {
    font-size: 1.35rem;
  }

  .header-actions {
    flex-direction: column;
  }

  .header-actions a {
    width: 100%;
  }

  .matrix-scroll {
    border-radius: 16px;
  }

  .matrix-table th,
  .matrix-table td {
    height: 58px;
    padding: 12px 14px;
  }

  .matrix-table thead th:first-child,
  .matrix-table tbody th {
    min-width: 190px;
  }

  .matrix-table thead th {
    min-width: 120px;
  }
}
</style>
