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
const matrixState = matrixController.state
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
        <p>Choose the PPE tools required for each activity.</p>
      </div>
      <nav class="header-actions" aria-label="PPE navigation">
        <RouterLink :to="`/organization/project-details/${projectId}`">Project details</RouterLink>
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
  padding: 28px;
}
.ppe-header {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 24px;
  margin-bottom: 24px;
}
.eyebrow {
  color: var(--PrimaryColor);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
h1 {
  margin: 6px 0;
  color: var(--text-strong);
}
p {
  margin: 0;
  color: var(--text-soft);
}
.header-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.header-actions a {
  padding: 10px 16px;
  border-radius: 12px;
  border: 1px solid var(--main-border);
  text-decoration: none;
  color: var(--PrimaryColor);
  font-weight: 700;
}
.header-actions .primary-link {
  background: var(--PrimaryColor);
  color: white;
  border-color: var(--PrimaryColor);
}
.matrix-scroll {
  overflow: auto;
  border: 1px solid var(--main-border);
  border-radius: 18px;
  background: var(--surface-2);
}
.matrix-table {
  min-width: 640px;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}
.matrix-table th,
.matrix-table td {
  padding: 14px 18px;
  border-bottom: 1px solid var(--main-border);
}
.matrix-table thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--surface-2);
  text-align: center;
}
.matrix-table thead th:first-child {
  left: 0;
  z-index: 2;
  text-align: start;
}
.matrix-table tbody th {
  position: sticky;
  left: 0;
  background: var(--surface-2);
  text-align: start;
  min-width: 180px;
}
.matrix-table tbody td {
  text-align: center;
}
.empty-cell {
  padding: 30px;
  text-align: center;
  color: var(--text-soft);
}
.error-message {
  padding: 14px 18px;
  margin: 0 0 18px;
  border-radius: 12px;
  background: #fff0f0;
  color: #a42b2b;
}
@media (max-width: 720px) {
  .ppe-page {
    padding: 16px;
  }
  .ppe-header {
    align-items: start;
    flex-direction: column;
  }
}
</style>
