<script lang="ts" setup>
import type { CapaTaskDetailsModel } from '../../Data/models/CapaTasksModel'
import { computed, ref } from 'vue'
import Dialog from 'primevue/dialog'
import RadioButton from 'primevue/radiobutton'
import { InvestegationTaskEnum } from '../../Core/Core/InvestegationTaskEnum'
import UpdateInvestigationTaskController from '../controllers/investigationTask/UpdateInvestigationTaskController'
import UpdateInvestigationTaskParams from '../../Core/params/InvestigationTask/UpdateInvestigationTaskParams'

defineProps<{
  correctiveTasks: CapaTaskDetailsModel[]
  preventiveTasks: CapaTaskDetailsModel[]
}>()
const emit = defineEmits(['answered', 'statusChanged'])
const statusDialogVisible = ref(false)
const selectedStatusTask = ref<CapaTaskDetailsModel | null>(null)
const selectedStatus = ref(0)
const selectedStatusReason = ref('')
const localStatuses = ref<Record<number, number>>({})
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

const taskStatus = (task: CapaTaskDetailsModel) => localStatuses.value[task.id] ?? task.status ?? 0
const statusesThatNeedReason = [
  InvestegationTaskEnum.PendingOnHold,
  InvestegationTaskEnum.Overdue,
  InvestegationTaskEnum.Cancelled,
]
const isReasonRequired = computed(() => statusesThatNeedReason.includes(selectedStatus.value))

const statusLabel = (status?: number) => {
  return taskStatusOptions.find((option) => option.value === status)?.label || 'Not Started'
}

const openStatusDialog = (task: CapaTaskDetailsModel) => {
  selectedStatusTask.value = task
  selectedStatus.value = taskStatus(task)
  selectedStatusReason.value = (task as any)?.reason || (task as any)?.statusReason || ''
  statusDialogVisible.value = true
}

const updateInvestigationTaskController = UpdateInvestigationTaskController.getInstance()

const saveTaskStatus = async () => {
  if (!selectedStatusTask.value) return
  if (isReasonRequired.value && !selectedStatusReason.value.trim()) return

  isSavingStatus.value = true
  try {
    const updateInvestigationTaskParams = new UpdateInvestigationTaskParams({
      id: selectedStatusTask.value.id,
      status: selectedStatus.value,
      reason: isReasonRequired.value ? selectedStatusReason.value.trim() : undefined,
    })
    await updateInvestigationTaskController.getData(updateInvestigationTaskParams)

    localStatuses.value[selectedStatusTask.value.id] = selectedStatus.value
    emit('statusChanged', {
      taskId: selectedStatusTask.value.id,
      status: selectedStatus.value,
    })
    emit('answered')
    statusDialogVisible.value = false
  } finally {
    isSavingStatus.value = false
  }
}
</script>

<template>
  <section class="saved-action-plan">
    <div class="section-heading">
      <span>Saved action plan</span>
      <h2>Current corrective and preventive Actions</h2>
    </div>

    <div class="saved-action-grid">
      <article class="saved-task-lane corrective">
        <div class="lane-header">
          <div>
            <span class="lane-kicker">Corrective</span>
            <h3>Corrective Actions</h3>
          </div>
          <strong>{{ correctiveTasks.length }}</strong>
        </div>

        <div v-if="correctiveTasks.length" class="task-list">
          <div v-for="task in correctiveTasks" :key="task.id" class="task-card">
            <div class="task-card-header">
              <h4>{{ task.title || 'Untitled Actions' }}</h4>
              <span class="task-status-pill" :class="`status-${taskStatus(task)}`">
                {{ statusLabel(taskStatus(task)) }}
              </span>
            </div>
            <div class="task-meta">
              <p>
                <span>Due date</span>
                <strong>{{ task.dueDate || 'N/A' }}</strong>
              </p>
              <p>
                <span>Assigned to</span>
                <strong>{{ task.assignedToName || 'N/A' }}</strong>
              </p>
              <p>
                <span>Responsible</span>
                <strong>{{ task.responsiblePersonName || 'N/A' }}</strong>
              </p>
            </div>
            <div class="task-actions">
              <button class="change-status-btn" @click="openStatusDialog(task)">
                Change status
              </button>
            </div>
          </div>
        </div>

        <p v-else class="empty-lane">No corrective Actions yet.</p>
      </article>

      <article class="saved-task-lane preventive">
        <div class="lane-header">
          <div>
            <span class="lane-kicker">Preventive</span>
            <h3>Preventive Actions</h3>
          </div>
          <strong>{{ preventiveTasks.length }}</strong>
        </div>

        <div v-if="preventiveTasks.length" class="task-list">
          <div v-for="task in preventiveTasks" :key="task.id" class="task-card">
            <div class="task-card-header">
              <h4>{{ task.title || 'Untitled task' }}</h4>
              <span class="task-status-pill" :class="`status-${taskStatus(task)}`">
                {{ statusLabel(taskStatus(task)) }}
              </span>
            </div>
            <div class="task-meta">
              <p>
                <span>Due date</span>
                <strong>{{ task.dueDate || 'N/A' }}</strong>
              </p>
              <p>
                <span>Assigned to</span>
                <strong>{{ task.assignedToName || 'N/A' }}</strong>
              </p>
              <p>
                <span>Responsible</span>
                <strong>{{ task.responsiblePersonName || 'N/A' }}</strong>
              </p>
            </div>
            <div class="task-actions">
              <button class="change-status-btn" @click="openStatusDialog(task)">
                Change status
              </button>
            </div>
          </div>
        </div>

        <p v-else class="empty-lane">No preventive Actions yet.</p>
      </article>
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
          <h3>{{ selectedStatusTask?.title || 'Change task status' }}</h3>
        </div>
      </template>

      <div class="status-dialog-body">
        <label
          v-for="option in taskStatusOptions"
          :key="option.value"
          class="status-radio-option"
          :class="{ selected: selectedStatus === option.value }"
          :for="`capa-task-status-${option.value}`"
        >
          <RadioButton
            v-model="selectedStatus"
            :inputId="`capa-task-status-${option.value}`"
            name="capa-task-status"
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
  </section>
</template>

<style scoped lang="scss">
.saved-action-plan {
  border: 1px solid var(--main-border);
  border-radius: 18px;
  background: var(--BgWhite);
  box-shadow: 0 8px 16px color-mix(in srgb, var(--Black) 10%, transparent);
  padding: 1.25rem;
}

.section-heading {
  margin-bottom: 1rem;

  span {
    color: var(--PrimaryColor);
    font-size: 0.76rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h2 {
    margin: 0.25rem 0 0;
    color: var(--header-page-color);
    font-size: 1.35rem;
    font-weight: 900;
  }
}

.saved-action-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.saved-task-lane {
  border: 1px solid var(--main-border);
  border-radius: 16px;
  background: var(--Gray-1);
  padding: 1rem;
}

.saved-task-lane.corrective {
  border-top: 4px solid var(--danger-color);
}

.saved-task-lane.preventive {
  border-top: 4px solid var(--green);
}

.lane-header,
.task-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.lane-kicker {
  color: var(--GrayText-1);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.lane-header h3,
.task-card h4 {
  margin: 0.25rem 0 0;
  color: var(--header-page-color);
  font-weight: 900;
}

.lane-header h3 {
  font-size: 1.05rem;
}

.lane-header > strong {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  border: 1px solid var(--main-border);
  border-radius: 999px;
  background: var(--BgWhite);
  color: var(--PrimaryColor);
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-top: 1rem;
}

.task-card {
  border: 1px solid var(--main-border);
  border-radius: 14px;
  background: var(--BgWhite);
  padding: 1rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: color-mix(in srgb, var(--PrimaryColor) 22%, var(--main-border));
    box-shadow: 0 14px 28px color-mix(in srgb, var(--Black) 8%, transparent);
  }
}

.task-card h4 {
  font-size: 0.98rem;
  line-height: 1.5;
}

.task-status-pill {
  flex-shrink: 0;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.35rem 0.7rem;

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

.task-meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 0.9rem;
}

.task-meta p,
.empty-lane {
  margin: 0;
}

.task-meta p {
  border-radius: 12px;
  background: var(--Gray-1);
  padding: 0.75rem;

  span {
    display: block;
    color: var(--GrayText-1);
    font-size: 0.75rem;
    font-weight: 800;
  }

  strong {
    display: block;
    margin-top: 0.25rem;
    color: var(--header-page-color);
    font-size: 0.88rem;
    line-height: 1.4;
    word-break: break-word;
  }
}

.task-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 1rem;
  padding-top: 0.9rem;
  border-top: 1px dashed var(--main-border);
}

.change-status-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  border: 0;
  border-radius: 10px;
  // background: linear-gradient(135deg, var(--PrimaryColor), #14b8a6);
  background: var(--PrimaryColor);

  color: var(--BgWhite);
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 900;
  padding: 0.55rem 1rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(0.95);
    box-shadow: 0 12px 22px color-mix(in srgb, var(--PrimaryColor) 22%, transparent);
  }
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

.status-save-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  border: 0;
  border-radius: 10px;
  background: var(--PrimaryColor);
  color: var(--BgWhite);
  cursor: pointer;
  font-size: 0.88rem;
  font-weight: 900;
  padding: 0.65rem 1.2rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(0.96);
    box-shadow: 0 14px 26px color-mix(in srgb, var(--PrimaryColor) 22%, transparent);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
}

.empty-lane {
  margin-top: 1rem;
  border-radius: 14px;
  background: var(--BgWhite);
  color: var(--GrayText-1);
  font-weight: 700;
  padding: 1rem;
}

@media (max-width: 1100px) {
  .saved-action-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .task-card-header {
    flex-direction: column;
  }

  .task-meta {
    grid-template-columns: 1fr;
  }
}
</style>
