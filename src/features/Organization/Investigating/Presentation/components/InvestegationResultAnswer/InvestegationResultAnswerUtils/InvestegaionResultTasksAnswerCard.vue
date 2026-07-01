<script setup lang="ts">
import AssignedToicon from '@/shared/icons/AssignedToicon.vue'
import { computed, ref } from 'vue'
import type InvestegationTasksModel from '@/features/Organization/Investigating/Data/models/InvestegationTasksModel'
import type { CapaTaskDetailsModel } from '@/features/Organization/Capa/Data/models/CapaTasksModel'
import Dialog from 'primevue/dialog'
import RadioButton from 'primevue/radiobutton'
import { InvestegationTaskEnum } from '@/features/Organization/Capa/Core/Core/InvestegationTaskEnum'
import UpdateInvestigationTaskController from '@/features/Organization/Capa/Presentation/controllers/investigationTask/UpdateInvestigationTaskController'
import UpdateInvestigationTaskParams from '@/features/Organization/Capa/Core/params/InvestigationTask/UpdateInvestigationTaskParams'

const props = defineProps<{
  task: InvestegationTasksModel | CapaTaskDetailsModel
}>()
const emit = defineEmits(['answered'])
const taskValue = computed(() => props.task as any)
const statusDialogVisible = ref(false)
const selectedStatus = ref<number>(InvestegationTaskEnum.NotStarted)
const selectedStatusReason = ref('')
const localStatus = ref<number | null>(null)
const isSavingStatus = ref(false)

const taskStatusOptions = [
  {
    value: InvestegationTaskEnum.NotStarted,
    label: 'Not Started',
    description: 'Work has not yet begun.',
  },
  {
    value: InvestegationTaskEnum.InProgress,
    label: 'In Progress',
    description: 'Active work is underway.',
  },
  {
    value: InvestegationTaskEnum.PendingOnHold,
    label: 'Pending / On Hold',
    description: 'Work is temporarily suspended, for example awaiting resources.',
  },
  {
    value: InvestegationTaskEnum.Overdue,
    label: 'Overdue',
    description: 'Work is ongoing but past the target deadline.',
  },
  {
    value: InvestegationTaskEnum.Completed,
    label: 'Completed',
    description: 'Implementation is finished and ready for verification.',
  },
  {
    value: InvestegationTaskEnum.Cancelled,
    label: 'Cancelled',
    description: 'The action will not be implemented due to process changes or redundancy.',
  },
]

const normalizeTaskStatus = (status?: number) => {
  const hasStatus = taskStatusOptions.some((option) => option.value === status)
  return hasStatus ? Number(status) : InvestegationTaskEnum.NotStarted
}

const statusesThatNeedReason = [
  InvestegationTaskEnum.PendingOnHold,
  InvestegationTaskEnum.Overdue,
  InvestegationTaskEnum.Cancelled,
]
const isReasonRequired = computed(() => statusesThatNeedReason.includes(selectedStatus.value))
const taskStatus = computed(() => localStatus.value ?? normalizeTaskStatus(props.task?.status))
const taskStatusLabel = computed(
  () =>
    taskStatusOptions.find((option) => option.value === taskStatus.value)?.label || 'Not Started',
)
const taskTitle = computed(
  () => taskValue.value?.description || taskValue.value?.title || 'Untitled task',
)
const dueDate = computed(() => taskValue.value?.due_date || taskValue.value?.dueDate || 'N/A')
const responsiblePerson = computed(
  () =>
    taskValue.value?.investigation_task_employees?.[0]?.follow_up_employee?.name ||
    taskValue.value?.investigationTaskEmployees?.[0]?.follow_up_employee?.name ||
    taskValue.value?.responablePerson?.title ||
    taskValue.value?.ResponsablePerson?.name ||
    taskValue.value?.responsiblePersonName ||
    'N/A',
)
const assignedTo = computed(
  () =>
    taskValue.value?.investigation_task_employees?.[0]?.employee?.name ||
    taskValue.value?.investigationTaskEmployees?.[0]?.employee?.name ||
    taskValue.value?.assignedTo?.name ||
    taskValue.value?.assignedToName ||
    'N/A',
)

const openStatusDialog = () => {
  selectedStatus.value = taskStatus.value
  selectedStatusReason.value = taskValue.value?.reason || taskValue.value?.statusReason || ''
  statusDialogVisible.value = true
}

const updateInvestigationTaskController = UpdateInvestigationTaskController.getInstance()

const saveTaskStatus = async () => {
  if (!props.task?.id) return
  if (isReasonRequired.value && !selectedStatusReason.value.trim()) return

  isSavingStatus.value = true
  try {
    const updateInvestigationTaskParams = new UpdateInvestigationTaskParams({
      id: props.task.id,
      status: selectedStatus.value,
      reason: isReasonRequired.value ? selectedStatusReason.value.trim() : undefined,
    })
    await updateInvestigationTaskController.getData(updateInvestigationTaskParams)
    localStatus.value = selectedStatus.value
    emit('answered')
    statusDialogVisible.value = false
  } finally {
    isSavingStatus.value = false
  }
}
</script>
<template>
  <!-- <pre>{{ task }}</pre> -->
  <div class="investegaion-task-card" :class="`status-${taskStatus}`">
    <div class="card-header">
      <div class="task-status-pill" :class="`status-${taskStatus}`">
        <p class="task-status-title">{{ taskStatusLabel }}</p>
      </div>
    </div>

    <div class="card-content">
      <p class="task-description">
        {{ taskTitle }}
      </p>

      <div class="info">
        <span class="date"
          >due date :<span>{{ task?.date || dueDate }}</span></span
        >
        <span class="responsable"
          >Responsible:
          <span>{{ responsiblePerson }}</span>
        </span>
      </div>

      <div class="assigned-to-container">
        <div class="assigned-to">
          <AssignedToicon class="icon" />
          <div class="assigned-to-info">
            <p class="assign">assigned to :</p>

            <p class="person">
              {{ assignedTo }}
            </p>
          </div>
        </div>

        <div class="task-actions">
          <button class="change-status-btn" @click="openStatusDialog">Change status</button>
        </div>
      </div>
    </div>

    <Dialog
      v-model:visible="statusDialogVisible"
      modal
      :dismissableMask="true"
      :style="{ width: '40rem', maxWidth: '92vw' }"
    >
      <template #header>
        <div class="status-dialog-header">
          <span>Task status</span>
          <h3>{{ taskTitle }}</h3>
        </div>
      </template>

      <div class="status-dialog-body">
        <label
          v-for="option in taskStatusOptions"
          :key="option.value"
          class="status-radio-option"
          :class="{ selected: selectedStatus === option.value }"
          :for="`investigation-task-status-${task.id}-${option.value}`"
        >
          <RadioButton
            v-model="selectedStatus"
            :inputId="`investigation-task-status-${task.id}-${option.value}`"
            :name="`investigation-task-status-${task.id}`"
            :value="option.value"
          />
          <span>
            <strong>{{ option.label }}</strong>
            <small>{{ option.description }}</small>
          </span>
        </label>

        <label v-if="isReasonRequired" class="status-reason-field">
          <span>Reason</span>
          <textarea
            v-model="selectedStatusReason"
            rows="4"
            placeholder="Add the reason for this status"
          ></textarea>
        </label>
      </div>

      <template #footer>
        <button
          class="status-save-btn"
          :disabled="isSavingStatus || (isReasonRequired && !selectedStatusReason.trim())"
          @click="saveTaskStatus"
        >
          {{ isSavingStatus ? 'Saving...' : 'Save status' }}
        </button>
      </template>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
.task-status-pill {
  width: fit-content;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 900;
  padding: 0.35rem 0.75rem;

  p {
    margin: 0;
  }

  &.status-1 {
    background: #f1f5f9;
    color: #475569;
  }

  &.status-2 {
    background: color-mix(in srgb, var(--PrimaryColor) 12%, white);
    color: var(--PrimaryColor);
  }

  &.status-3 {
    background: #fff7ed;
    color: #c2410c;
  }

  &.status-4 {
    background: #fef2f2;
    color: #dc2626;
  }

  &.status-5 {
    background: color-mix(in srgb, var(--green) 14%, white);
    color: var(--green);
  }

  &.status-6 {
    background: #e2e8f0;
    color: #334155;
  }
}

.change-status-btn,
.status-save-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  border: 0;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--PrimaryColor), #14b8a6);
  color: var(--BgWhite);
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 900;
  padding: 0.55rem 1rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    filter: brightness(0.96);
    box-shadow: 0 12px 22px color-mix(in srgb, var(--PrimaryColor) 22%, transparent);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
}

.status-save-btn {
  min-height: 42px;
  background: var(--PrimaryColor);
  font-size: 0.88rem;
  padding: 0.65rem 1.2rem;
}

.status-dialog-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  span {
    color: var(--PrimaryColor);
    font-size: 0.72rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h3 {
    margin: 0;
    color: var(--header-page-color);
    font-size: 1.15rem;
    font-weight: 900;
    line-height: 1.35;
  }
}

.status-dialog-body {
  display: grid;
  gap: 0.75rem;
  border-radius: 16px;
  background:
    radial-gradient(
      circle at 0% 0%,
      color-mix(in srgb, var(--PrimaryColor) 10%, transparent),
      transparent 32%
    ),
    var(--Gray-1);
  padding: 0.85rem;
}

.status-radio-option {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.75rem;
  align-items: center;
  border: 1px solid var(--main-border);
  border-radius: 14px;
  background: var(--BgWhite);
  cursor: pointer;
  padding: 0.9rem;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover,
  &.selected {
    transform: translateY(-1px);
    border-color: color-mix(in srgb, var(--PrimaryColor) 32%, var(--main-border));
    box-shadow: 0 12px 24px color-mix(in srgb, var(--Black) 7%, transparent);
  }

  &.selected {
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--PrimaryColor) 8%, white),
      var(--BgWhite)
    );
  }

  span {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
  }

  strong {
    color: var(--header-page-color);
    font-size: 0.95rem;
    font-weight: 900;
  }

  small {
    color: var(--GrayText-1);
    font-size: 0.78rem;
    font-weight: 700;
    line-height: 1.45;
  }
}

.status-reason-field {
  display: grid;
  gap: 0.45rem;
  border: 1px solid var(--main-border);
  border-radius: 14px;
  background: var(--BgWhite);
  padding: 0.9rem;

  span {
    color: var(--header-page-color);
    font-size: 0.84rem;
    font-weight: 900;
  }

  textarea {
    width: 100%;
    min-height: 96px;
    resize: vertical;
    border: 1px solid var(--main-border);
    border-radius: 10px;
    color: var(--header-page-color);
    font: inherit;
    font-size: 0.9rem;
    line-height: 1.5;
    padding: 0.75rem;
    outline: none;

    &:focus {
      border-color: var(--PrimaryColor);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--PrimaryColor) 12%, transparent);
    }
  }
}
</style>
