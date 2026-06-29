<script setup lang="ts">
import { TasksStatusEnum } from '@/features/Organization/Investigating/Core/Enums/TasksStatusEnum'
import NewTaskIcon from '@/shared/icons/NewTaskIcon.vue'
import AssignedToicon from '@/shared/icons/AssignedToicon.vue'
import TasksWorking from '@/shared/icons/TasksWorking.vue'
import { computed, ref, watch } from 'vue'
import type InvestegationTasksModel from '@/features/Organization/Investigating/Data/models/InvestegationTasksModel'
import InvestigationResultDialoge from './InvestigationResultDialoge.vue'
import AddInvestegationTaskAnswerDialog from '../../Investigating/InvestegationDialogs/AddInvestegationTaskAnswerDialog.vue'
import type { CapaTaskDetailsModel } from '@/features/Organization/Capa/Data/models/CapaTasksModel'

const props = defineProps<{
  task: InvestegationTasksModel | CapaTaskDetailsModel
}>()
const emit = defineEmits(['answered'])
const taskValue = computed(() => props.task as any)
const localAnswer = ref('')

const TasksStatus = ref([
  {
    title: 'Open',
    status: TasksStatusEnum.OPEN,
    icon: NewTaskIcon,
  },
  {
    title: 'Open',
    status: 0,
    icon: NewTaskIcon,
  },
  {
    title: 'Closed',
    status: TasksStatusEnum.COLSED,
    icon: TasksWorking,
  },
])

const GetTaskStatus = (status) => {
  return status === TasksStatusEnum.COLSED ? 'CLOSED' : 'OPEN'
}

const isOpenTask = computed(() => props.task?.status === TasksStatusEnum.OPEN)
const taskStatusLabel = computed(() => (isOpenTask.value ? 'Open' : 'Closed'))
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
const taskAnswer = computed(
  () =>
    localAnswer.value ||
    taskValue.value?.answer ||
    taskValue.value?.notes ||
    taskValue.value?.task_result?.notes ||
    taskValue.value?.taskResult?.notes ||
    taskValue.value?.investigation_task_results?.[0]?.notes ||
    taskValue.value?.investigationTaskResults?.[0]?.notes ||
    taskValue.value?.investigation_task_result?.notes ||
    taskValue.value?.investigationTaskResult?.notes ||
    taskValue.value?.task_results?.[0]?.notes ||
    taskValue.value?.taskResults?.[0]?.notes ||
    '',
)
const hasAnswer = computed(() => !!String(taskAnswer.value || '').trim())
const detailsTask = computed(() => ({
  ...taskValue.value,
  notes: taskAnswer.value,
}))
const onAnswerSubmitted = (answer: string) => {
  localAnswer.value = answer
  emit('answered')
}

// const SelectedTaskStatus = ref(
//   TasksStatus.value?.filter(item => item.status == props.task?.status)[0])

const SelectedTaskStatus = ref(
  TasksStatus.value.filter((item) => item.status === props.task.status)[0],
)

watch(
  () => props.task,
  (newVal) => {
    SelectedTaskStatus.value = TasksStatus.value?.filter((item) => item.status == newVal.status)[0]
  },
)
</script>
<template>
  <!-- <pre>{{ task }}</pre> -->
  <div class="investegaion-task-card" :class="GetTaskStatus(task.status)">
    <div class="card-header">
      <div class="task-status">
        <component :is="SelectedTaskStatus?.icon"></component>
        <p class="task-status-title">{{ taskStatusLabel }}</p>
      </div>
    </div>

    <div class="card-content">
      <p class="task-description">
        {{ taskTitle }}
      </p>

      <div class="info">
        <span class="date"
          >due date :<span>{{ dueDate }}</span></span
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
          <AddInvestegationTaskAnswerDialog
            v-if="isOpenTask && !hasAnswer"
            :taskId="task?.id"
            :task="taskTitle"
            @submitted="onAnswerSubmitted"
          />
          <InvestigationResultDialoge v-if="hasAnswer" :item="detailsTask" />
        </div>
        <!-- class="btn btn-secondary" -->
        <InvestigationResultDialoge v-if="!isOpenTask && !hasAnswer" :item="task" />
      </div>
    </div>
  </div>
</template>
