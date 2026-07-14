<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import AddItemButton from '@/shared/HelpersComponents/AddItemButton.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IndexNotificationPlanController from '../controllers/index_notification_plan_controller'
import IndexNotificationPlanParams from '../../Core/Params/index_notification_plan_params'

const indexNotificationPlanController = IndexNotificationPlanController.getInstance()
const state = ref(indexNotificationPlanController.state.value)

const activeOptions = [
  new TitleInterface({ id: -1, title: 'All statuses' }),
  new TitleInterface({ id: 1, title: 'Active' }),
  new TitleInterface({ id: 0, title: 'Inactive' }),
]

const selectedActive = ref<TitleInterface | null>(activeOptions[0])

const isActiveValue = () => {
  if (selectedActive.value === null || selectedActive.value.id === -1) return null
  return selectedActive.value.id === 1
}

const fetchNotificationPlans = async () => {
  await indexNotificationPlanController.getData(
    new IndexNotificationPlanParams(
      '',
      10,
      1,
      1,
      selectedActive.value?.id === 1 ? true : selectedActive.value?.id === 0 ? false : undefined,
    ),
  )
}

const updateActive = (data: TitleInterface | null) => {
  selectedActive.value = data
  fetchNotificationPlans()
}

watch(
  () => indexNotificationPlanController.state.value,
  (newState) => {
    if (!newState) return
    state.value = newState
  },
)

onMounted(fetchNotificationPlans)
</script>
<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
    <div class="col-span-3 md:col-span-1 input-wrapper">
      <CustomSelectInput
        id="is-active-filter"
        :modelValue="selectedActive"
        label="Status"
        :static-options="activeOptions"
        :reload="false"
        placeholder="All statuses"
        @update:modelValue="updateActive"
      />
    </div>

    <div class="col-span-3 md:col-span-2 flex justify-end">
      <AddItemButton
        addLink="/organization/notification-plan/add"
        addText="Add Notification Plan"
      />
    </div>
  </div>
  <DataStatus :controller="state">
    <template #success>
      <div class="table-responsive">
        <table class="main-table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col">Employees</th>
              <th scope="col">Hierarchies</th>
              <th scope="col">Actions</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in state.data" :key="item.notification_plan_id">
              <!-- {{ item }} -->
              <td data-label="#">
                {{ index + 1 }}
              </td>
              <td data-label="Title">{{ item.title || 'N/A' }}</td>
              <td data-label="Employees">
                {{ item.employees.map((e) => e.title).join(', ') || 'N/A' }}
              </td>
              <td data-label="Hierarchies">
                {{ item.hierarchies.map((h) => h.title).join(', ') || 'N/A' }}
              </td>
              <td data-label="Actions">
                {{ item.actions.map((a) => a.name).join(', ') || 'N/A' }}
              </td>
              <td data-label="Status">
                <span :class="['status-badge', item.is_active ? 'is-active' : 'is-inactive']">
                  {{ item.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template #failed>
      <DataFailed
        link="/notification-plan/add"
        addText="Add Notification Plan"
        description="No notification plans were found."
        title="No Notification Plans"
      />
    </template>
    <template #loader>
      <TableLoader :cols="3" :rows="10" />
    </template>
    <template #empty>
      <DataEmpty
        link="/notification-plan/add"
        addText="Add Notification Plan"
        description="No notification plans were found."
        title="No Notification Plans"
      />
    </template>
  </DataStatus>
</template>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 76px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
}

.status-badge.is-active {
  color: #15803d;
  background: #dcfce7;
}

.status-badge.is-inactive {
  color: #b91c1c;
  background: #fee2e2;
}
</style>
