<script setup lang="ts">
import AssignedToicon from '@/shared/icons/AssignedToicon.vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type InvestegationTasksModel from '@/features/Organization/Investigating/Data/models/InvestegationTasksModel'
import type { CapaTaskDetailsModel } from '@/features/Organization/Capa/Data/models/CapaTasksModel'
import Dialog from 'primevue/dialog'
import RadioButton from 'primevue/radiobutton'
import { InvestegationTaskEnum } from '@/features/Organization/Capa/Core/Core/InvestegationTaskEnum'
import UpdateInvestigationTaskController from '@/features/Organization/Capa/Presentation/controllers/investigationTask/UpdateInvestigationTaskController'
import UpdateInvestigationTaskParams from '@/features/Organization/Capa/Core/params/InvestigationTask/UpdateInvestigationTaskParams'

interface TaskCardEmployee {
  name?: string
}

interface TaskCardValue {
  description?: string
  title?: string
  due_date?: string
  dueDate?: string
  date?: string
  reason?: string
  statusReason?: string
  investigation_task_employees?: Array<{
    follow_up_employee?: TaskCardEmployee
    employee?: TaskCardEmployee
  }>
  investigationTaskEmployees?: Array<{
    follow_up_employee?: TaskCardEmployee
    employee?: TaskCardEmployee
  }>
  responablePerson?: { title?: string }
  ResponsablePerson?: TaskCardEmployee
  responsiblePersonName?: string
  assignedTo?: TaskCardEmployee
  assignedToName?: string
}

interface RelatedLink {
  label: string
  text: string
  to: string
  mark: string
  className?: string
}

const props = defineProps<{
  task: InvestegationTasksModel | CapaTaskDetailsModel
  isChangeStatus?: boolean
  relatedLinks?: RelatedLink[]
}>()
const { t } = useI18n({ useScope: 'global' })
const emit = defineEmits(['answered'])
const taskValue = computed(() => props.task as unknown as TaskCardValue)
const statusDialogVisible = ref(false)
const selectedStatus = ref<number>(InvestegationTaskEnum.NotStarted)
const selectedStatusReason = ref('')
const localStatus = ref<number | null>(null)
const isSavingStatus = ref(false)

const taskStatusOptions = [
  {
    value: InvestegationTaskEnum.NotStarted,
    label: t('task_status_not_started'),
    description: t('task_status_not_started_description'),
  },
  {
    value: InvestegationTaskEnum.InProgress,
    label: t('task_status_in_progress'),
    description: t('task_status_in_progress_description'),
  },
  {
    value: InvestegationTaskEnum.PendingOnHold,
    label: t('task_status_pending'),
    description: t('task_status_pending_description'),
  },
  {
    value: InvestegationTaskEnum.Overdue,
    label: t('task_status_overdue'),
    description: t('task_status_overdue_description'),
  },
  {
    value: InvestegationTaskEnum.Completed,
    label: t('task_status_completed'),
    description: t('task_status_completed_description'),
  },
  {
    value: InvestegationTaskEnum.Cancelled,
    label: t('task_status_cancelled'),
    description: t('task_status_cancelled_description'),
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
    taskStatusOptions.find((option) => option.value === taskStatus.value)?.label ||
    t('task_status_not_started'),
)
const taskTitle = computed(
  () => taskValue.value?.description || taskValue.value?.title || t('task_untitled'),
)
const dueDate = computed(
  () => taskValue.value?.date || taskValue.value?.due_date || taskValue.value?.dueDate || 'N/A',
)
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
          >{{ $t('task_due_date') }} :<span>{{ dueDate }}</span></span
        >
        <span class="responsable"
          >{{ $t('task_responsible') }}:
          <span>{{ responsiblePerson }}</span>
        </span>
      </div>

      <div class="assigned-to-container">
        <div class="assigned-to">
          <AssignedToicon class="icon" />
          <div class="assigned-to-info">
            <p class="assign">{{ $t('assigned_to') }} :</p>

            <p class="person">
              {{ assignedTo }}
            </p>
          </div>
        </div>

        <div class="task-actions" v-if="!isChangeStatus">
          <button class="change-status-btn" @click="openStatusDialog">
            {{ $t('task_change_status') }}
          </button>
        </div>
      </div>

      <div v-if="relatedLinks?.length" class="task-reference-grid" :aria-label="$t('lessons_related_records')">
        <RouterLink
          v-for="link in relatedLinks"
          :key="`${link.to}-${link.mark}`"
          class="task-reference-link"
          :class="link.className"
          :to="link.to"
        >
          <span class="task-reference-mark" aria-hidden="true">{{ link.mark }}</span>
          <span class="task-reference-copy">
            <small>{{ link.label }}</small>
            <strong>{{ link.text }}</strong>
          </span>
          <span class="task-reference-arrow" aria-hidden="true">→</span>
        </RouterLink>
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
          <span>{{ $t('task_status') }}</span>
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
          <span>{{ $t('task_reason') }}</span>
          <textarea
            v-model="selectedStatusReason"
            rows="4"
            :placeholder="$t('task_reason_placeholder')"
          ></textarea>
        </label>
      </div>

      <template #footer>
        <button
          class="status-save-btn"
          :disabled="isSavingStatus || (isReasonRequired && !selectedStatusReason.trim())"
          @click="saveTaskStatus"
        >
          {{ isSavingStatus ? $t('task_saving') : $t('task_save_status') }}
        </button>
      </template>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
.task-reference-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
  margin-top: 0.85rem;
}

.task-reference-link {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.45rem;
  min-width: 0;
  min-height: 60px;
  padding: 0.6rem;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 18%, var(--main-border));
  border-radius: 13px;
  background: color-mix(in srgb, var(--PrimaryColor) 5%, var(--surface-1));
  color: var(--text-strong);
  text-decoration: none;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.task-reference-link:hover,
.task-reference-link:focus-visible {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--PrimaryColor) 42%, var(--main-border));
  box-shadow: 0 10px 22px color-mix(in srgb, var(--PrimaryColor) 12%, transparent);
  outline: none;
}

.task-reference-mark {
  display: grid;
  place-items: center;
  width: 29px;
  height: 29px;
  border-radius: 9px;
  background: color-mix(in srgb, var(--PrimaryColor) 12%, var(--surface-1));
  color: var(--PrimaryColor);
  font-size: 0.7rem;
  font-weight: 900;
}

.observation-link .task-reference-mark {
  background: var(--status-warning-soft);
  color: var(--status-warning);
}

.investigation-link .task-reference-mark {
  background: var(--status-success-soft);
  color: var(--status-success);
}

.task-reference-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.15rem;
}

.task-reference-copy small {
  color: var(--text-muted);
  font-size: 0.6rem;
  font-weight: 800;
  text-transform: uppercase;
}

.task-reference-copy strong {
  overflow: hidden;
  font-size: 0.7rem;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-reference-arrow {
  color: var(--PrimaryColor);
  font-size: 0.85rem;
  transition: transform 0.2s ease;
}

.task-reference-link:hover .task-reference-arrow,
.task-reference-link:focus-visible .task-reference-arrow {
  transform: translateX(2px);
}

[dir='rtl'] .task-reference-link:hover .task-reference-arrow,
[dir='rtl'] .task-reference-link:focus-visible .task-reference-arrow {
  transform: translateX(-2px);
}

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
    background: var(--brand-primary-50);
    color: var(--brand-primary-600);
  }

  &.status-2 {
    background: color-mix(in srgb, var(--PrimaryColor) 12%, var(--surface-1));
    color: var(--PrimaryColor);
  }

  &.status-3 {
    background: var(--brand-accent-50);
    color: var(--status-danger);
  }

  &.status-4 {
    background: var(--status-danger-soft);
    color: var(--status-danger);
  }

  &.status-5 {
    background: color-mix(in srgb, var(--green) 14%, var(--surface-1));
    color: var(--green);
  }

  &.status-6 {
    background: var(--brand-primary-100);
    color: var(--brand-primary-700);
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
  background: linear-gradient(135deg, var(--PrimaryColor), var(--status-success));
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
    box-shadow: 0 12px 24px color-mix(in srgb, var(--text-strong) 7%, transparent);
  }

  &.selected {
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--PrimaryColor) 8%, var(--surface-1)),
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
