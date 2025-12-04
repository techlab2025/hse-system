<script lang="ts" setup>
import { ref } from 'vue'
import InvestigatingHedaer from './InvestigatingResultsUtils/InvestigatingHedaer.vue'
import { InvestegationStatusEnum } from '../../../Core/Enums/InvestegationStatusEnum'
import investigationImg from '@/assets/images/investigationImg.png'
import CauseOfAccidant from './InvestegationResultParts/CauseOfAccidant.vue'
import InvestigationTasks from './InvestegationResultParts/InvestigationTasks.vue'
import RateActions from './InvestegationResultParts/RateActions.vue'
import InvestegationAttachment from './InvestegationResultParts/InvestegationAttachment.vue'
import ViewersResults from './InvestegationResultParts/ViewersResults.vue'
import AnotherMeeting from './InvestegationResultParts/AnotherMeeting.vue'
import TimeLine from '@/shared/HelpersComponents/TimeLine.vue'
import AddInvestigatingResultController from '../../controllers/investegationResult/addInvestigatingResultController'
import AddInvestigationResultParams from '../../../Core/params/investegationResult/addInvestigationResultParams'
import { useRouter } from 'vue-router'

interface items {
  title: string
  isDanger: boolean
}
const item = ref<items[]>([{
  title: 'High observation',
  isDanger: true
}])
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


const AddEnvestigatingResult = async () => {
  const addInvestigationResultParams = new AddInvestigationResultParams();
  const addInvestigatingResultController = AddInvestigatingResultController.getInstance()
  const res = await addInvestigatingResultController.addInvestigatingResult(addInvestigationResultParams, useRouter())
}
</script>
<template>
  <div class="investigation-result">
    <InvestigatingHedaer :title="Details?.title" :serial="Details?.serial" :victim="Details?.observer?.name"
      :date="Details?.date" :meetingDate="Details?.date" :TeamLeader="Details.observer?.name" :TeamNumbers="12" />
    <div class="investigation-title">
      <img :src="investigationImg" alt="" />
      <p>Investigation Meeting result</p>
    </div>
    <CauseOfAccidant @update:data="console.log($event, 'CauseOfAccidant');" />
    <InvestigationTasks @update:data="console.log($event, 'InvestigationTasks');" />
    <RateActions @update:data="console.log($event, 'RateActions');" />
    <InvestegationAttachment @update:data="console.log($event, 'InvestegationAttachment');" />
    <ViewersResults @update:data="console.log($event, 'ViewersResults');" />
    <AnotherMeeting @update:data="console.log($event, 'AnotherMeeting');" />



    <!-- <TimeLine :items="item" /> -->
    <div class="btns">
      <button class="btn btn-cancel">{{ $t('cancel') }}</button>
      <button @click="AddEnvestigatingResult" class="btn btn-primary">{{ $t('confirm') }}</button>
    </div>
  </div>
</template>
