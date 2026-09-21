<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Button from 'primevue/button'
import IndexOwnTaskController from '../../controllers/employeeTask/indexOwnTaskController'
import IndexOwnTaskParams from '../../../Core/params/employeeTask/indexOwnTaskParams'
import DialogChangeStatus from '../../supcomponents/employeeTask/DialogChangeStatus.vue'
import { ChangeTaskStatusEnum } from '../../../Core/Enum/ChangeTaskStatusEnum'

const statusLabels: Record<number, string> = {
  [ChangeTaskStatusEnum.NOT_STARTED]: 'task_status_not_started',
  [ChangeTaskStatusEnum.IN_PROGRESS]: 'task_status_in_progress',
  [ChangeTaskStatusEnum.PENDING_ON_HOLD]: 'task_status_pending',
  [ChangeTaskStatusEnum.OVERDUE]: 'task_status_overdue',
  [ChangeTaskStatusEnum.COMPLETED]: 'task_status_completed',
  [ChangeTaskStatusEnum.CANCELLED]: 'task_status_cancelled',
}

const statusClasses: Record<number, string> = {
  [ChangeTaskStatusEnum.NOT_STARTED]: 'is-not-started',
  [ChangeTaskStatusEnum.IN_PROGRESS]: 'is-in-progress',
  [ChangeTaskStatusEnum.PENDING_ON_HOLD]: 'is-pending',
  [ChangeTaskStatusEnum.OVERDUE]: 'is-overdue',
  [ChangeTaskStatusEnum.COMPLETED]: 'is-completed',
  [ChangeTaskStatusEnum.CANCELLED]: 'is-cancelled',
}

const route = useRoute()
const controller = IndexOwnTaskController.getInstance()
const state = ref(controller.state.value)

const dialogVisible = ref(false)
const selectedTaskId = ref<number>(0)

const openStatusDialog = (taskId: number) => {
  selectedTaskId.value = taskId
  dialogVisible.value = true
}

const fetchEmployeeOwnTasks = async (id: number) => {
  await controller.getData(new IndexOwnTaskParams(id))
}

onMounted(() => {
  const id = Number(route.params.id)
  if (id) fetchEmployeeOwnTasks(id)
})

watch(
  () => controller.state.value,
  (newState) => {
    if (newState) state.value = newState
  },
  { deep: true },
)
</script>

<template>
  <div class="tasks_wrapper">
    <article
      v-for="task in state?.data ?? []"
      :key="task.id"
      class="task_card"
      :class="statusClasses[task?.status ?? ChangeTaskStatusEnum.NOT_STARTED]"
    >
      <div class="task_card__header">
        <div class="task_codes">
          <span class="task_code">#{{ task?.id }}</span>
          <span v-if="task?.actual_task_id" class="task_sub_code">
            Actual #{{ task.actual_task_id }}
          </span>
        </div>
        <span
          class="task_status"
          :class="statusClasses[task?.status ?? ChangeTaskStatusEnum.NOT_STARTED]"
        >
          {{ $t(statusLabels[task?.status ?? ChangeTaskStatusEnum.NOT_STARTED]) }}
        </span>
      </div>

      <div class="task_card__body">
        <h6 class="task_title">{{ task?.title || $t('task_untitled') }}</h6>
        <p v-if="task?.reason" class="task_reason">
          {{ task.reason }}
        </p>
      </div>

      <div class="task_card__meta">
        <div class="meta_item">
          <span class="meta_label">{{ $t('task_due_date') }}</span>
          <span class="meta_value">{{ task?.due_date }}, {{ task?.due_time }}</span>
        </div>
        <div class="meta_item">
          <span class="meta_label">{{ $t('created_at') }}</span>
          <span class="meta_value">{{ task?.created_at || '-' }}</span>
        </div>
      </div>

      <div class="task_people">
        <div class="person_avatar">
          {{ task?.responable_person?.name?.[0] || '-' }}
        </div>
        <div class="person_content">
          <span class="meta_label">{{ $t('task_responsible') }}</span>
          <strong>{{ task?.responable_person?.name || '-' }}</strong>
          <div class="person_contacts">
            <span v-if="task?.responable_person?.email">{{ task.responable_person.email }}</span>
            <span v-if="task?.responable_person?.phone">{{ task.responable_person.phone }}</span>
          </div>
        </div>
      </div>

      <div class="task_card__meta task_card__meta--compact">
        <div class="meta_item">
          <span class="meta_label">{{ $t('assigned_to') }}</span>
          <span class="meta_value">{{ task?.assigned_to || '-' }}</span>
        </div>
      </div>

      <div class="task_card__footer">
        <Button
          class="task_change_btn"
          size="small"
          type="button"
          @click.stop.prevent="openStatusDialog(task.id)"
        >
          {{ $t('task_change_status') }}
        </Button>
      </div>
    </article>
  </div>

  <DialogChangeStatus
    v-model:visible="dialogVisible"
    :task-id="selectedTaskId"
    @update:data="fetchEmployeeOwnTasks(Number(route.params.id))"
  />
</template>

<style scoped>
.tasks_wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
  width: 100%;
}

.task_card {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 260px;
  padding: 14px;
  border: 1px solid var(--brand-primary-100);
  border-radius: 8px;
  background: var(--surface-1);
  box-shadow: 0 12px 30px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.task_card::before {
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  width: 4px;
  background: var(--brand-primary-500);
  content: '';
}

.task_card:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--brand-primary-500) 24%, transparent);
  box-shadow: 0 18px 38px color-mix(in srgb, var(--brand-primary-900) 10%, transparent);
}

.task_card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: -14px -14px 0;
  padding: 13px 14px;
  border-bottom: 1px solid var(--brand-primary-100);
  background:
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--brand-primary-50) 86%, transparent),
      transparent
    ),
    var(--surface-2);
}

.task_codes {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 0;
}

.task_code {
  color: var(--brand-primary-600);
  font-family: 'Bold';
  font-size: 0.92rem;
  font-weight: 800;
}

.task_sub_code {
  padding: 4px 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--brand-primary-500) 7%, transparent);
  color: var(--text-muted);
  font-size: 0.72rem;
  font-weight: 700;
}

.task_status {
  flex-shrink: 0;
  padding: 7px 11px;
  border-radius: 999px;
  background: var(--brand-primary-50);
  color: var(--brand-primary-600);
  font-size: 0.75rem;
  font-weight: 900;
  line-height: 1;
}

.task_status.is-in-progress {
  background: var(--status-info-soft);
  color: var(--status-info);
}

.task_status.is-pending,
.task_status.is-overdue {
  background: var(--status-warning-soft);
  color: var(--status-warning);
}

.task_status.is-completed {
  background: var(--status-success-soft);
  color: var(--status-success);
}

.task_status.is-cancelled {
  background: var(--status-danger-soft);
  color: var(--status-danger);
}

.task_card.is-completed::before {
  background: var(--status-success);
}

.task_card.is-overdue::before,
.task_card.is-cancelled::before {
  background: var(--status-danger);
}

.task_card.is-pending::before {
  background: var(--status-warning);
}

.task_card__body {
  display: grid;
  gap: 8px;
}

.task_title {
  margin: 0;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 1.08rem;
  font-weight: 800;
  line-height: 1.35;
}

.task_reason {
  margin: 0;
  padding: 10px 12px;
  border: 1px solid var(--brand-primary-100);
  border-radius: 8px;
  background: color-mix(in srgb, var(--brand-primary-50) 70%, transparent);
  color: var(--text-soft);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.55;
}

.task_card__meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
}

.task_card__meta--compact {
  padding-top: 12px;
  border-top: 1px dashed var(--brand-primary-100);
}

.meta_item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  padding: 11px;
  border: 1px solid var(--brand-primary-100);
  border-radius: 8px;
  background: color-mix(in srgb, var(--brand-primary-50) 36%, var(--surface-1));
}

.meta_label {
  color: var(--text-muted);
  font-size: 0.72rem;
  font-weight: 700;
}

.meta_value {
  overflow: hidden;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.86rem;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task_people {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  padding: 12px 13px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 12%, transparent);
  border-radius: 8px;
  background: var(--surface-1);
}

.person_avatar {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--brand-primary-500), var(--status-info));
  color: var(--text-on-brand);
  font-family: 'Bold';
  font-size: 0.78rem;
  font-weight: 900;
}

.person_content {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
}

.person_content strong {
  overflow: hidden;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.94rem;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.person_contacts {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  color: var(--text-muted);
  font-size: 0.76rem;
  font-weight: 600;
}

.person_contacts span {
  max-width: 100%;
  overflow: hidden;
  padding: 3px 7px;
  border-radius: 999px;
  background: var(--surface-2);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task_card__footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 2px;
  padding-top: 2px;
}

.task_change_btn {
  min-height: 38px;
  border: 0;
  border-radius: 8px;
  background: var(--brand-primary-500);
  color: var(--text-on-brand);
  font-family: 'Bold';
  font-size: 0.82rem;
  font-weight: 800;
  padding-inline: 14px;
  box-shadow: 0 10px 20px color-mix(in srgb, var(--brand-primary-500) 20%, transparent);
}

.task_change_btn:hover {
  background: var(--brand-primary-600);
}

@media (max-width: 520px) {
  .tasks_wrapper,
  .task_card__meta {
    grid-template-columns: 1fr;
  }

  .task_card__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .task_status {
    width: fit-content;
  }
}
</style>
