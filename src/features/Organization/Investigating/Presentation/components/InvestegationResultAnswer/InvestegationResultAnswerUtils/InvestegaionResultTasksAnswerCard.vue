<script setup lang="ts">
import { MeetingStatus } from '@/features/Organization/Investigating/Core/Enums/MeetingStatusEnum';
import { TasksStatusEnum } from '@/features/Organization/Investigating/Core/Enums/TasksStatusEnum';
import GoogleMeetIcon from '@/shared/icons/GoogleMeetIcon.vue';
import NewTaskIcon from '@/shared/icons/NewTaskIcon.vue';
import TasksComplated from '@/shared/icons/TasksComplated.vue';
import AssignedToicon from '@/shared/icons/AssignedToicon.vue';
import TasksWorking from '@/shared/icons/TasksWorking.vue';
import { ref, watch } from 'vue';
import type InvestegationTasksModel from '@/features/Organization/Investigating/Data/models/InvestegationTasksModel';
import type TasksModel from '@/features/Organization/Investigating/Data/models/Tasks/TasksModel';

const props = defineProps<{
  task: InvestegationTasksModel
}>()

const TasksStatus = ref([
  {
    title: "New",
    status: TasksStatusEnum.new,
    icon: NewTaskIcon
  },
  {
    title: "working",
    status: TasksStatusEnum.working,
    icon: TasksWorking
  },
  {
    title: "completed",
    status: TasksStatusEnum.completed,
    icon: TasksComplated
  },
])


const GetTaskStatus = (status) => {
  return TasksStatusEnum[status]
}

// const SelectedTaskStatus = ref(
//   TasksStatus.value?.filter(item => item.status == props.task?.status)[0])

const SelectedTaskStatus = ref(TasksStatus.value.filter((item => item.status === props.task.status))[0])

watch(() => props.task, (newVal) => {
  SelectedTaskStatus.value = TasksStatus.value?.filter(item => item.status == newVal.status)[0]
})

</script>
<template>

  <!-- <pre>{{ task }}</pre> -->
  <div class="investegaion-task-card" :class="GetTaskStatus(task.status)">
    <div class="card-header">
      <div class="task-status">
        <component :is="SelectedTaskStatus?.icon"></component>
        <p class="task-status-title">{{ GetTaskStatus(task.status) }}</p>
      </div>
    </div>

    <div class="card-content">
      <p class="task-description">
        {{ task?.description || task?.title }}
      </p>
      <div class="info ">
        <span class="date">due date :<span>{{ task?.due_date }}</span></span>
        <span class="responsable">Responsible: <span>{{ task?.investigation_task_employees[0]?.follow_up_employee?.name
            }}</span>
        </span>
      </div>

      <div class="assigned-to-container">
        <div class="assigned-to">
          <AssignedToicon class="icon" />
          <div class="assigned-to-info">
            <p class="assign">assigned to :</p>
            <p class="person">{{ task?.investigation_task_employees[0]?.employee?.name }}</p>
          </div>
        </div>
        <button :class="GetTaskStatus(task?.status)">
          {{ GetTaskStatus(task?.status) !== "completed" ? "Complate" : "view details" }}
        </button>
      </div>
    </div>



  </div>
</template>
