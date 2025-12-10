<script lang="ts" setup>
import { ref } from 'vue';
import InvestigatingResultAnswerHedaer from './InvestegationResultAnswerUtils/InvestigatingResultAnswerHedaer.vue';
import { InvestegationStatusEnum } from '../../../Core/Enums/InvestegationStatusEnum';
import CauseOfAccidantAnswer from './InvestegationResultAnswerUtils/CauseOfAccidantAnswer.vue';

const Details = ref({
  id: 3,
  title: 'Medium observation',
  meetingsNumber: 12,
  date: '2025-03-15 09:45 AM',
  observer: { name: 'Mohab Mohamed' },
  description: 'Electrical issue near main control panel.',
  zoon: { title: 'Zone C' },
  equipment: { title: 'Crane Liebherr' },
  status: InvestegationStatusEnum.SOLVED,
  image: 'https://picsum.photos/222/150',
  link: '',
  createdAt: "20 july"
})

const Factors = ref([
  {
    mainFactor: "Lorem Ipsum is simply dummy text of the printing ",
    subFactors: [
      {
        factor: "Lorem Ipsum is simply dumm"
      },
      {
        factor: "Lorem Ipsum is simply dumm"
      },
      {
        factor: "Lorem Ipsum is simply dumm"
      },
    ]
  },
  {
    mainFactor: "Lorem Ipsum is simply dummy text of the printing ",
    subFactors: [
      {
        factor: "Lorem Ipsum is simply dumm"
      },
      {
        factor: "Lorem Ipsum is simply dumm"
      },
      {
        factor: "Lorem Ipsum is simply dumm"
      },
    ]
  },
])
</script>
<template>
  <div class="investegation-result-answer-container">
    <InvestigatingResultAnswerHedaer :title="Details?.title" :meetingsNumber="Details?.meetingsNumber"
      :victim="Details?.observer?.name" :date="Details?.date" :meetingDate="Details?.date"
      :TeamLeader="Details.observer?.name" :createdAt="Details.createdAt" :TeamNumbers="12" :solvedTasks="8"
      :ToltalTasks="18" />
    <CauseOfAccidantAnswer class="w-full" @update:data="console.log($event, 'CauseOfAccidant')" :Factors="Factors" />
  </div>

</template>
