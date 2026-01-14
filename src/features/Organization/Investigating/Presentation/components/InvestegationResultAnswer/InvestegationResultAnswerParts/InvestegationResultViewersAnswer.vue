<script setup lang="ts">
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue';
import AnswersViewers from '@/assets/images/AnswersViewers.png'
import { ref } from 'vue';
import InvestegaionMeetingViewersCard from '../InvestegationResultAnswerUtils/InvestegaionMeetingViewersCard.vue';
import type witnessStatementsModel from '@/features/Organization/Investigating/Data/models/InvestegationwitnessStatementsModel';

const props = defineProps<{
  viewers: witnessStatementsModel[]
}>()

// const Viewers = ref([
//   {
//     id: 1,
//     ResponsablePerson: {
//       name: "moahb",
//       img: AnswersViewers,
//       heirarchy: "manger"
//     },
//     description: "Thickening the electrical wires and reinforcing them with an insulating material"
//   },
//   {
//     id: 2,
//     ResponsablePerson: {
//       name: "moahb",
//       img: AnswersViewers,
//       heirarchy: "manger"
//     },
//     description: "Thickening the electrical wires and reinforcing them with an insulating material"
//   },
//   {
//     id: 3,
//     ResponsablePerson: {
//       name: "moahb",
//       img: AnswersViewers,
//       heirarchy: "manger"
//     },
//     description: "Thickening the electrical wires and reinforcing them with an insulating material"
//   },
//   {
//     id: 4,
//     ResponsablePerson: {
//       name: "moahb",
//       img: AnswersViewers,
//       heirarchy: "manger"
//     },
//     description: "Thickening the electrical wires and reinforcing them with an insulating material"
//   },

// ])


</script>

<template>
  <div class="vieawers-answer">
    <div class="header">
      <HeaderPage :title="`viewers result`" :subtitle="`a description of each witness to the incident.`"
        :img="AnswersViewers" class="title-header answer-header border-top" />
      <button class="show-all-btn">{{ $t('show_all_tasks') }}</button>
    </div>

    <div class="content">
      <InvestegaionMeetingViewersCard v-for="(viewer, index) in viewers" :key="index" :viewer="viewer" :index="index" />
    </div>
  </div>
</template>
