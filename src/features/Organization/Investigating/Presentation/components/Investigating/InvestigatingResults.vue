<script lang="ts" setup>
import { ref } from 'vue'
import InvestigatingHedaer from './InvestigatingResultsUtils/InvestigatingHedaer.vue'
import { InvestegationStatusEnum } from '../../../Core/Enums/InvestegationStatusEnum'
import investigationImg from '@/assets/images/investigationImg.png'
import CauseOfAccidant from './InvestigatingResultsUtils/CauseOfAccidant.vue'
import InvestigationTasks from './InvestigatingResultsUtils/InvestigationTasks.vue'

const Details = ref({
  id: 3,
  title: 'Medium observation',
  serial: 'Third card dummy text',
  date: '2025-03-15 09:45 AM',
  observer: { name: 'Khaled Samir' },
  description: 'Electrical issue near main control panel.',
  zoon: { title: 'Zone C' },
  equipment: { title: 'Crane Liebherr' },
  status: InvestegationStatusEnum.SOLVED,
  image: 'https://picsum.photos/222/150',
  link: '',
})
</script>
<template>
  <div class="investigation-result">
    <InvestigatingHedaer
      :title="Details?.title"
      :serial="Details?.serial"
      :victim="Details?.observer?.name"
      :date="Details?.date"
      :meetingDate="Details?.date"
      :TeamLeader="Details.observer?.name"
      :TeamNumbers="12"
    />

    <div class="investigation-title">
      <img :src="investigationImg" alt="">
      <p>Investigation Meeting result</p>
    </div>

    <CauseOfAccidant />
    <InvestigationTasks />

  </div>
</template>
