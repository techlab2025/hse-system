<script setup lang="ts">
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue';
import TakeAction from '@/assets/images/TakeAction.png'
import { ref } from 'vue';
import InvestegaionResultTasksAnswerCard from '../InvestegationResultAnswerUtils/InvestegaionResultTasksAnswerCard.vue';
import InvestegaionResultTakeActionCard from '../InvestegationResultAnswerUtils/InvestegaionResultTakeActionCard.vue';


const Actions = ref([
  {
    id: 1,
    description: "Thickening the electrical wires and reinforcing them with an insulating material"
  },
  {
    id: 2,
    description: "Thickening the electrical wires and reinforcing them with an insulating material"
  },
  {
    id: 3,
    description: "Thickening the electrical wires and reinforcing them with an insulating material"
  },
  {
    id: 2,
    description: "Thickening the electrical wires and reinforcing them with an insulating material"
  },

])


</script>

<template>
  <div class="take-action-answer">
    <div class="header">
      <HeaderPage :title="`the taken action`"
        :subtitle="`It is the reaction that was taken at the time of the incident.`" :img="TakeAction"
        class="title-header answer-header border-top" />

    </div>

    <div class="content">
      <InvestegaionResultTakeActionCard v-for="(action, index) in Actions" :key="index" :action="action" />
    </div>
  </div>
</template>
