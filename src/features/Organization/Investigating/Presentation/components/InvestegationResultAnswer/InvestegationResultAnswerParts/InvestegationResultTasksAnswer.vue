<script setup lang="ts">
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import Task from '@/assets/images/Task.png'
import { computed } from 'vue'
import InvestegaionResultTasksAnswerCard from '../InvestegationResultAnswerUtils/InvestegaionResultTasksAnswerCard.vue'
import type InvestegationTasksModel from '@/features/Organization/Investigating/Data/models/InvestegationTasksModel'
import { useRoute } from 'vue-router'
import type { CapaTaskDetailsModel } from '@/features/Organization/Capa/Data/models/CapaTasksModel'

const route = useRoute()
const props = defineProps<{
  correctiveTasks?: CapaTaskDetailsModel[]
  preventiveTasks?: CapaTaskDetailsModel[]
  tasks?: InvestegationTasksModel[]
}>()
const emit = defineEmits(['answered'])

const taskLanes = computed(() => {
  const correctiveTasks = props.correctiveTasks ?? []
  const preventiveTasks = props.preventiveTasks ?? []

  if (correctiveTasks.length || preventiveTasks.length) {
    return [
      {
        key: 'corrective',
        title: 'Corrective tasks',
        kicker: 'Corrective',
        empty: 'No corrective tasks yet.',
        tasks: correctiveTasks,
      },
      {
        key: 'preventive',
        title: 'Preventive tasks',
        kicker: 'Preventive',
        empty: 'No preventive tasks yet.',
        tasks: preventiveTasks,
      },
    ]
  }

  return [
    {
      key: 'legacy',
      title: 'Tasks',
      kicker: 'Investigation',
      empty: 'No tasks yet.',
      tasks: props.tasks ?? [],
    },
  ]
})
</script>

<template>
  <div class="tasks-answer">
    <div class="header">
      <HeaderPage
        :title="`tasks`"
        :subtitle="`change the task status here`"
        :img="Task"
        class="title-header answer-header border-top"
      />
      <router-link
        :to="`/organization/investegation-tasks/${route.params.id}`"
        class="show-all-btn"
        >{{ $t('show_all_tasks') }}</router-link
      >
    </div>
    <div class="task-lanes">
      <article v-for="lane in taskLanes" :key="lane.key" class="task-lane" :class="lane.key">
        <div class="task-lane-header">
          <div>
            <span>{{ lane.kicker }}</span>
            <h3>{{ lane.title }}</h3>
          </div>
          <strong>{{ lane.tasks.length }}</strong>
        </div>

        <div v-if="lane.tasks.length" class="content">
          <InvestegaionResultTasksAnswerCard
            v-for="task in lane.tasks"
            :key="task.id"
            :task="task"
            @answered="emit('answered')"
          />
        </div>

        <p v-else class="empty-lane">{{ lane.empty }}</p>
      </article>
    </div>
  </div>
</template>
