<script setup lang="ts">
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue';
import Task from '@/assets/images/Task.png'
import { ref } from 'vue';
import InvestegaionResultTasksAnswerCard from '../InvestegationResultAnswerUtils/InvestegaionResultTasksAnswerCard.vue';
import type InvestegationTasksModel from '@/features/Organization/Investigating/Data/models/InvestegationTasksModel';

const props = defineProps<{
  tasks: InvestegationTasksModel[]
}>()

//


</script>

<template>
  <div class="tasks-answer">
    <div class="header">
      <HeaderPage :title="`tasks`" :subtitle="`change the task status here`" :img="Task"
        class="title-header answer-header border-top" />
      <button class="show-all-btn">{{ $t('show_all_tasks') }}</button>
    </div>

    <div class="content">
      <InvestegaionResultTasksAnswerCard v-for="(task, index) in tasks" :key="index" :task="task" />
    </div>
  </div>
</template>
