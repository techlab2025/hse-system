<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import TitleInterface from '@/base/Data/Models/title_interface'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IndexNotificationPlanController from '../controllers/index_notification_plan_controller'
import IndexNotificationPlanParams from '../../Core/Params/index_notification_plan_params'
import {
  notificationPlanActionOptions,
  notificationPlanSubActionOptions,
} from '../../Data/const/notification_plan_actions'
import type { NotificationPlanActionModel } from '../../Data/models/notification_plan_model'
import ActiveNotificationPlanController from '../controllers/active_notification_plan_controller'
import ActiveNotificationPlanParams from '../../Core/Params/active_notification_plan_params'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import DeleteNotificationPlanController from '../controllers/delete_notification_plan_controller'
import DeleteNotificationPlanParams from '../../Core/Params/delete_notification_plan_params'

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

const normalizeTitle = (value: string) =>
  value
    .toLowerCase()
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

const translatedOptionTitle = (title: string, titleKeys: Record<string, string>) =>
  t(titleKeys[title] ?? title)

const notificationActionName = (action: NotificationPlanActionModel) => {
  const optionTitle =
    notificationPlanActionOptions.find((option) => option.id === action.value)?.title ??
    action.label ??
    normalizeTitle(action.name)

  return translatedOptionTitle(optionTitle, actionTitleKeys)
}

const notificationSubActionName = (subAction: any) => {
  if (subAction === null || subAction === undefined) return ''

  const subActionValue =
    typeof subAction === 'object' ? (subAction.value ?? subAction.id ?? null) : subAction

  const optionTitle = notificationPlanSubActionOptions.find(
    (option) => option.id === Number(subActionValue),
  )?.title

  if (optionTitle) return translatedOptionTitle(optionTitle, subActionTitleKeys)

  const fallbackTitle =
    typeof subAction === 'object'
      ? (subAction.label ?? normalizeTitle(subAction.name ?? ''))
      : String(subActionValue)

  return translatedOptionTitle(fallbackTitle, subActionTitleKeys)
}

const notificationActionKey = (action: NotificationPlanActionModel, index: number) => {
  const subAction =
    typeof action.sub_action === 'object'
      ? (action.sub_action?.value ?? action.sub_action?.id ?? index)
      : (action.sub_action ?? 'none')

  return `${action.value}-${subAction}-${index}`
}

const emptyValue = computed(() => t('not_available'))
const activatingPlanId = ref<number | null>(null)
const deletingPlanId = ref<number | null>(null)
const currentPage = ref(1)
const countPerPage = ref(10)

const isActiveFilterValue = () => {
  if (selectedActiveId.value === -1) return undefined
  return selectedActiveId.value === 1
}

const fetchNotificationPlans = async () => {
  await indexNotificationPlanController.getData(
    new IndexNotificationPlanParams(
      '',
      countPerPage.value,
      currentPage.value,
      1,
      isActiveFilterValue(),
    ),
  )
}

const updateActive = (data: TitleInterface | null) => {
  selectedActive.value = data
  currentPage.value = 1
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

const activeNotificationPlanController = ActiveNotificationPlanController.getInstance()
const deleteNotificationPlanController = DeleteNotificationPlanController.getInstance()
const ActiveAction = async (id: number) => {
  if (activatingPlanId.value !== null) return

  activatingPlanId.value = id
  try {
    const activeNotificationPlanParams = new ActiveNotificationPlanParams(id)
    await activeNotificationPlanController.ActiveNotificationPlan(activeNotificationPlanParams)
    await fetchNotificationPlans()
  } finally {
    activatingPlanId.value = null
  }
}

const deleteNotificationPlan = async (id: number) => {
  if (deletingPlanId.value !== null) return

  deletingPlanId.value = id
  try {
    await deleteNotificationPlanController.DeleteNotificationPlan(
      new DeleteNotificationPlanParams(id),
    )

    if (state.value.data.length === 1 && currentPage.value > 1) {
      currentPage.value -= 1
    }
    await fetchNotificationPlans()
  } finally {
    deletingPlanId.value = null
  }
}

const managementActions = (id: number) => [
  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteNotificationPlan(id),
  },
]

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchNotificationPlans()
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  currentPage.value = 1
  fetchNotificationPlans()
}
</script>
<template>
  <div class="grid grid-cols-1 md:grid-cols-3 items-center gap-2" :style="{ marginBottom: '20px' }">
    <div class="col-span-1 md:col-span-1 input-wrapper">
      <UpdatedCustomInputSelect
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
              <th scope="col">{{ $t('management') }}</th>
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
                <ul v-if="item.actions.length > 0" class="action-list-tree">
                  <li
                    v-for="(action, actionIndex) in item.actions"
                    :key="notificationActionKey(action, actionIndex)"
                  >
                    <span>{{ notificationActionName(action) }}</span>
                    <ul v-if="notificationSubActionName(action.sub_action)" class="sub-action-list">
                      <li>{{ notificationSubActionName(action.sub_action) }}</li>
                    </ul>
                  </li>
                </ul>
                <span v-else>{{ emptyValue }}</span>
              </td>
              <td :data-label="$t('status')">
                <button
                  type="button"
                  role="switch"
                  :aria-checked="item.is_active"
                  :aria-busy="activatingPlanId === item.notification_plan_id"
                  :aria-label="`${item.is_active ? $t('inactive') : $t('active')} ${item.title}`"
                  :class="['status-toggle', item.is_active ? 'is-active' : 'is-inactive']"
                  :disabled="activatingPlanId !== null"
                  @click="ActiveAction(item.notification_plan_id)"
                >
                  <span class="toggle-track" aria-hidden="true">
                    <i></i>
                  </span>
                  <span class="toggle-label">
                    {{ item.is_active ? $t('active') : $t('inactive') }}
                  </span>
                  <span
                    v-if="activatingPlanId === item.notification_plan_id"
                    class="toggle-spinner"
                    aria-hidden="true"
                  ></span>
                </button>
              </td>
              <td :data-label="$t('management')">
                <DropList
                  :action-list="managementActions(item.notification_plan_id)"
                  :show-actions="deletingPlanId === null"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination
        :pagination="state.pagination"
        @changePage="handleChangePage"
        @countPerPage="handleCountPerPage"
      />
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
.status-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  min-width: 122px;
  gap: 8px;
  padding: 6px 9px;
  border: 1px solid transparent;
  border-radius: 999px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  transition:
    border-color 0.18s ease,
    background 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;
}

.status-toggle:hover:not(:disabled) {
  transform: translateY(-1px);
}

.status-toggle:focus-visible {
  outline: 2px solid var(--PrimaryColor);
  outline-offset: 2px;
}

.status-toggle:disabled {
  cursor: wait;
  opacity: 0.68;
}

.status-toggle.is-active {
  border-color: #bbf7d0;
  color: #15803d;
  background: #dcfce7;
}

.status-toggle.is-inactive {
  border-color: #fecaca;
  color: #b91c1c;
  background: #fee2e2;
}

.toggle-track {
  position: relative;
  display: inline-flex;
  width: 34px;
  height: 19px;
  flex: 0 0 34px;
  border-radius: 999px;
  background: #fca5a5;
  transition: background 0.2s ease;
}

.toggle-track i {
  position: absolute;
  top: 3px;
  inset-inline-start: 3px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.22);
  transition: transform 0.2s ease;
}

.status-toggle.is-active .toggle-track {
  background: #22c55e;
}

.status-toggle.is-active .toggle-track i {
  transform: translateX(15px);
}

:global([dir='rtl']) .status-toggle.is-active .toggle-track i {
  transform: translateX(-15px);
}

.toggle-label {
  flex: 1;
  text-align: start;
}

.toggle-spinner {
  width: 13px;
  height: 13px;
  flex: 0 0 13px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: status-spin 0.65s linear infinite;
}

@keyframes status-spin {
  to {
    transform: rotate(360deg);
  }
}

.action-list-tree,
.sub-action-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.action-list-tree {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.action-list-tree > li {
  font-weight: 600;
}

.sub-action-list {
  margin-top: 4px;
  margin-inline-start: 14px;
  padding-inline-start: 12px;
  border-inline-start: 1px solid #d1d5db;
  color: #4b5563;
  font-size: 13px;
  font-weight: 500;
}
</style>
