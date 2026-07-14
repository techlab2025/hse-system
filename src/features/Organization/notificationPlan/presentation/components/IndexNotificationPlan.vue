<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import TitleInterface from '@/base/Data/Models/title_interface'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IndexNotificationPlanController from '../controllers/index_notification_plan_controller'
import IndexNotificationPlanParams from '../../Core/Params/index_notification_plan_params'

const indexNotificationPlanController = IndexNotificationPlanController.getInstance()
const state = ref(indexNotificationPlanController.state.value)
const { t, locale } = useI18n()

const activeOptions = computed(() => [
  new TitleInterface({ id: -1, title: t('all_statuses') }),
  new TitleInterface({ id: 1, title: t('active') }),
  new TitleInterface({ id: 0, title: t('inactive') }),
])

const selectedActive = ref<TitleInterface | null>(null)

const selectedActiveId = computed(() => selectedActive.value?.id ?? -1)

const actionTitleKeys: Record<string, string> = {
  'Task assigned': 'task_assigned',
  'Project location hierarchy assignment': 'project_location_hierarchy_assignment',
  'Observation created': 'observation_created',
}

const notificationActionName = (name: string) => t(actionTitleKeys[name] ?? name)

const emptyValue = computed(() => t('not_available'))

const isActiveFilterValue = () => {
  if (selectedActiveId.value === -1) return undefined
  return selectedActiveId.value === 1
}

const fetchNotificationPlans = async () => {
  await indexNotificationPlanController.getData(
    new IndexNotificationPlanParams('', 10, 1, 1, isActiveFilterValue()),
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

watch(locale, () => {
  selectedActive.value =
    activeOptions.value.find((option) => option.id === selectedActiveId.value) ?? null
})

onMounted(fetchNotificationPlans)
</script>
<template>
  <div class="grid grid-cols-1 md:grid-cols-3 items-center gap-2" :style="{ marginBottom: '20px' }">
    <div class="col-span-1 md:col-span-1 input-wrapper">
      <CustomSelectInput
        id="is-active-filter"
        :modelValue="selectedActive ?? activeOptions[0]"
        label="status"
        :static-options="activeOptions"
        :reload="false"
        :placeholder="$t('all_statuses')"
        @update:modelValue="updateActive"
      />
    </div>

    <div class="col-span-1 md:col-span-2 flex justify-end">
      <router-link to="notification-plan/add" class="btn btn-primary">{{
        $t('add_notification_plan')
      }}</router-link>
    </div>
  </div>
  <DataStatus :controller="state">
    <template #success>
      <div class="table-responsive">
        <table class="main-table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">{{ $t('title') }}</th>
              <th scope="col">{{ $t('employees') }}</th>
              <th scope="col">{{ $t('hierarchies') }}</th>
              <th scope="col">{{ $t('actions') }}</th>
              <th scope="col">{{ $t('status') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in state.data" :key="item.notification_plan_id">
              <td data-label="#">
                {{ index + 1 }}
              </td>
              <td :data-label="$t('title')">{{ item.title || emptyValue }}</td>
              <td :data-label="$t('employees')">
                {{ item.employees.map((e) => e.title).join(', ') || emptyValue }}
              </td>
              <td :data-label="$t('hierarchies')">
                {{ item.hierarchies.map((h) => h.title).join(', ') || emptyValue }}
              </td>
              <td :data-label="$t('actions')">
                {{
                  item.actions.map((a) => notificationActionName(a.name)).join(', ') || emptyValue
                }}
              </td>
              <td :data-label="$t('status')">
                <span :class="['status-badge', item.is_active ? 'is-active' : 'is-inactive']">
                  {{ item.is_active ? $t('active') : $t('inactive') }}
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
        :addText="$t('add_notification_plan')"
        :description="$t('no_notification_plans_description')"
        :title="$t('no_notification_plans')"
      />
    </template>
    <template #loader>
      <TableLoader :cols="3" :rows="10" />
    </template>
    <template #empty>
      <DataEmpty
        link="/notification-plan/add"
        :addText="$t('add_notification_plan')"
        :description="$t('no_notification_plans_description')"
        :title="$t('no_notification_plans')"
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
