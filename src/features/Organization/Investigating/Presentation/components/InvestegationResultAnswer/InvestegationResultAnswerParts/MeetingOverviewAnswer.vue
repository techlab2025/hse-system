<script setup lang="ts">
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue';
import investigationImg from '@/assets/images/investigationImg.png'
import InvestegaionMeetingResultAnswerCard from '../InvestegationResultAnswerUtils/InvestegaionMeetingResultAnswerCard.vue';
import GoogleMeetIcon from '@/shared/icons/GoogleMeetIcon.vue';
import { ref } from 'vue';


const Meetings = ref([
  {
    id: 1,
    status: 1,
    date: "2025-12-23",
    time: "",
    type: 1,
    meeting_link: "",
    corrective: "asdasdasda"
  },
  {
    id: 2,
    status: 0,
    date: "2025-12-23",
    time: "17:57:50",
    type: 1,
    meeting_link: "",
    corrective: "asdasdasda"
  },
  {
    id: 3,
    status: 0,
    date: "2025-12-23",
    time: "17:57:50",
    type: 1,
    meeting_link: "",
    corrective: "asdasdasda"
  },
  {
    id: 4,
    status: 0,
    date: "2025-12-23",
    time: "17:57:50",
    type: 1,
    meeting_link: "",
    corrective: "asdasdasda"
  },
])



</script>

<template>
  <div class="meeting-overview-answer">
    <div class="header">
      <HeaderPage :title="`Meetings Overview`" :subtitle="`A complete list of your past and upcoming meetings.`"
        :img="investigationImg" class="title-header answer-header border-top" />
      <button class="show-all-btn">{{ $t('show_all_meetings') }}</button>
    </div>

    <div class="content">
      <InvestegaionMeetingResultAnswerCard v-for="(meeting, index) in Meetings" :key="index" :meeting="meeting" />
    </div>
  </div>
</template>
