<script setup lang="ts">
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue';
import Task from '@/assets/images/Task.png'
import { ref } from 'vue';
import InvestegaionResultTasksAnswerCard from '../InvestegationResultAnswerUtils/InvestegaionResultTasksAnswerCard.vue';


const Tasks = ref([
  {
    id: 1,
    title: "asdasdasd",
    status: 1,
    due_date: "2025-12-23",
    ResponsablePerson: "Mohab",
    assignedTo: "Mohab",
    investigation_meeting_id: 12,
    description: "Thickening the electrical wires and reinforcing them with an insulating material"
  },
  {
    id: 2,
    title: "asdasdasd",
    status: 2,
    due_date: "2025-12-23",
    ResponsablePerson: "Mohab",
    assignedTo: "Mohab",
    investigation_meeting_id: 12,
    description: "Thickening the electrical wires and reinforcing them with an insulating material"
  },
  {
    id: 3,
    title: "asdasdasd",
    status: 3,
    due_date: "2025-12-23",
    ResponsablePerson: "Mohab",
    assignedTo: "Mohab",
    investigation_meeting_id: 12,
    description: "Thickening the electrical wires and reinforcing them with an insulating material"
  },
  {
    id: 2,
    title: "asdasdasd",
    status: 2,
    due_date: "2025-12-23",
    ResponsablePerson: "Mohab",
    assignedTo: "Mohab",
    investigation_meeting_id: 12,
    description: "Thickening the electrical wires and reinforcing them with an insulating material"
  },

])


</script>

<template>
  <div class="tasks-answer">
    <div class="header">
      <HeaderPage :title="`tasks`" :subtitle="`change the task status here`" :img="Task"
        class="title-header answer-header border-top" />
      <button class="show-all-btn">{{ $t('show_all_tasks') }}</button>
    </div>

    <div class="content">
      <InvestegaionResultTasksAnswerCard v-for="(task, index) in Tasks" :key="index" :task="task" />
    </div>
  </div>
</template>
