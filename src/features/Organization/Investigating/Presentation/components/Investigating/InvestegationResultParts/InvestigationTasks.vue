<script lang="ts" setup>
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import tasks from '@/assets/images/tasks.png'
import TimeLineTasks from '../InvestigatingResultsUtils/TimeLineTasks.vue'
import InvestegationTasksParams from '@/features/Organization/Investigating/Core/params/investegationResult/InvestegationTasksParams'
import { ref } from 'vue'
import InvestigationTaskEmployees from '@/features/Organization/Investigating/Core/params/investegationResult/InvestigationTaskEmployeesParams'
const emit = defineEmits(['update:data'])

const SelectedTasks = ref<InvestegationTasksParams[]>([])
const UpdateData = (data) => {
  SelectedTasks.value = []

  data.forEach((item) => {
    const itemEmployees = new InvestigationTaskEmployees(
      item.employee?.id || null, 
      null,
      null
    )

    SelectedTasks.value.push(
      new InvestegationTasksParams(
        item.text,
        item.date,
        [itemEmployees]
      )
    )
  })

  emit('update:data', SelectedTasks.value)
}

</script>
<template>
  <div class="cause-of-accidant">
    <HeaderPage :title="`tasks`"
      :subtitle="` Add the tasks is measures that will be taken to prevent a recurrence of this incident.`" :img="tasks"
      class="title-header" />

    <TimeLineTasks @update:data="UpdateData" />
  </div>
</template>
