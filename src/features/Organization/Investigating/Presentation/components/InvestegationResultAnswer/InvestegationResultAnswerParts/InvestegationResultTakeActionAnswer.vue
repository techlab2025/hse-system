<script setup lang="ts">
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import TakeAction from '@/assets/images/TakeAction.png'
import InvestegaionResultTakeActionCard from '../InvestegationResultAnswerUtils/InvestegaionResultTakeActionCard.vue'



const props = defineProps({
  actions: String,
  isCorrect: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <div class="take-action-answer">
    <div class="header">
      <HeaderPage
        :title="`Immediate Action Evaluation`"
        :subtitle="``"
        :img="TakeAction"
        class="title-header answer-header border-top"
      />
    </div>

    <div class="content">
      <!-- v-for="(action, index) in Actions" :key="index" -->
      <InvestegaionResultTakeActionCard :action="actions" :isCorrect="isCorrect"/>
    </div>
  </div>
</template>
