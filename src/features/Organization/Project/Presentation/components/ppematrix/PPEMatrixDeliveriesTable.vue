<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import FetchPPEMatrixDeliveriesParams from '../../../Core/params/ppematrix/FetchPPEMatrixDeliveriesParams'
import type PPEMatrixDeliveryModel from '../../../Data/models/ppematrix/PPEMatrixDeliveryModel'
import type PPEMatrixDeliveryToolModel from '../../../Data/models/ppematrix/PPEMatrixDeliveryToolModel'
import FetchPPEMatrixDeliveriesController from '../../controllers/ppematrix/FetchPPEMatrixDeliveriesController'
const controller = FetchPPEMatrixDeliveriesController.getInstance()
const state = computed(() => controller.state.value)
const currentPage = ref(1)
const countPerPage = ref(10)

const fetchDeliveries = async (page = currentPage.value, limit = countPerPage.value) => {
  currentPage.value = page
  countPerPage.value = limit
  await controller.fetchPPEMatrixDeliveries(
    new FetchPPEMatrixDeliveriesParams(null, page, limit),
  )
}

const changePage = (page: number) => fetchDeliveries(page, countPerPage.value)
const changePageSize = (limit: number) => fetchDeliveries(1, limit)

const tools = computed<PPEMatrixDeliveryToolModel[]>(() => {
  const toolMap = new Map<number, PPEMatrixDeliveryToolModel>()
  const deliveries = state.value.data ?? []

  deliveries.forEach((delivery) => {
    delivery.activities.forEach((activity) => {
      activity.tools.forEach((tool) => {
        if (tool.id && !toolMap.has(tool.id)) toolMap.set(tool.id, tool)
      })
    })
  })

  return [...toolMap.values()]
})

const activityTitles = computed(() =>
  [
    ...new Set(
      (state.value.data ?? [])
        .flatMap((delivery) => delivery.activities.map((activity) => activity.title))
        .filter((title) => title),
    ),
  ].join(', '),
)

const isToolDelivered = (delivery: PPEMatrixDeliveryModel, toolId: number) =>
  delivery.activities.some((activity) =>
    activity.tools.some((tool) => tool.id === toolId && tool.isDelivery),
  )

onMounted(() => fetchDeliveries())

defineExpose({ refresh: () => fetchDeliveries(1, countPerPage.value) })
</script>

<template>
  <section class="deliveries-card">
    <div class="deliveries-heading">
      <div>
        <!-- <span class="eyebrow">Delivery history</span> -->
        <!-- <h2>PPE deliveries</h2> -->
        <!-- <p>Employees and the PPE tools delivered for each activity.</p> -->
      </div>
    </div>

    <DataStatus :controller="state">
      <template #success>
        <article class="delivery-record">
          <dl class="delivery-meta">
            <!-- <div>
              <dt>Delivery date</dt>
              <dd>{{ firstDelivery?.deliveryDate || '—' }}</dd>
            </div> -->
            <!-- <div>
              <dt>Project</dt>
              <dd>{{ firstDelivery?.project.title || '—' }}</dd>
            </div> -->
            <div>
              <dt>Activity</dt>
              <dd>{{ activityTitles || '—' }}</dd>
            </div>
            <!-- <div>
              <dt>Prepared by</dt>
              <dd>{{ firstDelivery?.preparedBy.title || '—' }}</dd>
            </div> -->
          </dl>

          <div class="delivery-table-wrap">
            <table class="main-table delivery-table">
              <thead>
                <tr>
                  <th scope="col">Recipient</th>
                  <!-- <th scope="col">Type</th> -->
                  <th v-for="tool in tools" :key="tool.id" scope="col">
                    {{ tool.title }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(delivery, deliveryIndex) in state.data"
                  :key="delivery.employeeId || deliveryIndex"
                >
                  <th scope="row">{{ delivery.employee.name || '—' }}</th>
                  <!-- <td>{{ delivery.type || 'Employee' }}</td> -->
                  <td v-for="tool in tools" :key="tool.id">
                    <span
                      class="delivery-status"
                      :class="{
                        'delivery-status--checked': isToolDelivered(delivery, tool.id),
                      }"
                      :aria-label="
                        isToolDelivered(delivery, tool.id) ? 'Delivered' : 'Not delivered'
                      "
                    >
                      {{ isToolDelivered(delivery, tool.id) ? '✓' : '—' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <Pagination
          :pagination="state.pagination"
          @change-page="changePage"
          @count-per-page="changePageSize"
        />
      </template>
      <template #loader><TableLoader :cols="6" :rows="5" /></template>
      <template #initial><TableLoader :cols="6" :rows="5" /></template>
      <template #empty><p class="empty-state">No PPE deliveries found.</p></template>
      <template #failed>
        <p class="error-state">Unable to load PPE deliveries.</p>
      </template>
    </DataStatus>
  </section>
</template>

<style scoped>
.deliveries-card {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  padding: 26px;
  border: 1px solid var(--main-border);
  border-radius: 22px;
  background: var(--surface-2);
}

.deliveries-heading {
  margin-bottom: 22px;
}

.deliveries-heading h2,
.deliveries-heading p,
.delivery-meta dd,
.delivery-meta dt {
  margin: 0;
}

.deliveries-heading h2 {
  color: var(--text-strong);
  font-size: 1.15rem;
}

.deliveries-heading p,
.delivery-meta dt {
  color: var(--text-soft);
}

.eyebrow {
  display: block;
  margin-bottom: 6px;
  color: var(--PrimaryColor);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.delivery-record + .delivery-record {
  margin-top: 28px;
  padding-top: 28px;
  border-top: 1px solid var(--main-border);
}

.delivery-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 18px 36px;
  margin: 0 0 16px;
}

.delivery-meta div {
  min-width: 140px;
}

.delivery-meta dt {
  margin-bottom: 4px;
  font-size: 0.78rem;
}

.delivery-meta dd {
  color: var(--text-strong);
  font-size: 0.88rem;
  font-weight: 700;
}

.delivery-table-wrap {
  display: block;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-inline: contain;
  -webkit-overflow-scrolling: touch;
  border: 1px solid var(--main-border);
  border-radius: 14px;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--PrimaryColor) 42%, transparent) transparent;
}

.delivery-table-wrap::-webkit-scrollbar {
  height: 9px;
}

.delivery-table-wrap::-webkit-scrollbar-track {
  background: color-mix(in srgb, var(--surface-2) 72%, transparent);
}

.delivery-table-wrap::-webkit-scrollbar-thumb {
  border: 2px solid var(--surface-2);
  border-radius: 999px;
  background: color-mix(in srgb, var(--PrimaryColor) 42%, var(--main-border));
}

.delivery-table {
  width: max-content;
  min-width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.delivery-table th,
.delivery-table td {
  min-width: 115px;
  padding: 14px 12px;
  border-bottom: 1px solid var(--main-border);
  text-align: center;
  white-space: nowrap;
}

.delivery-table th:first-child {
  position: sticky;
  inset-inline-start: 0;
  z-index: 2;
  min-width: 200px;
  max-width: 240px;
  text-align: start;
  white-space: normal;
  background: var(--surface-1);
  box-shadow: 8px 0 14px -12px color-mix(in srgb, var(--text-strong) 48%, transparent);
}

.delivery-table thead th:first-child {
  z-index: 4;
  background: color-mix(in srgb, var(--PrimaryColor) 9%, var(--surface-1));
}

.delivery-table thead th,
.delivery-table tbody th {
  background: color-mix(in srgb, var(--PrimaryColor) 5%, var(--surface-2));
  color: var(--text-strong);
}

.delivery-table tbody tr:hover th:first-child {
  background: color-mix(in srgb, var(--PrimaryColor) 7%, var(--surface-1));
}

.delivery-table tbody tr:last-child > * {
  border-bottom: 0;
}

.delivery-status {
  color: var(--text-soft);
  font-weight: 700;
}

.delivery-status--checked {
  color: var(--PrimaryColor);
}

.empty-cell,
.empty-state,
.error-state {
  padding: 28px;
  color: var(--text-soft);
  text-align: center;
}

.error-state {
  color: #b42318;
}

@media (max-width: 720px) {
  .deliveries-card {
    padding: 18px;
  }

  .delivery-meta {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .delivery-table th:first-child {
    min-width: 160px;
    max-width: 190px;
  }
}
</style>
