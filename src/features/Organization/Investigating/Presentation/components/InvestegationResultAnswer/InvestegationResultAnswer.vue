<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import InvestigatingResultAnswerHedaer from './InvestegationResultAnswerParts/InvestigatingResultAnswerHedaer.vue';
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
// import { InvestegationStatusEnum } from '../../../Core/Enums/InvestegationStatusEnum';
import CauseOfAccidantAnswer from './InvestegationResultAnswerParts/CauseOfAccidantAnswer.vue';
import MeetingOverviewAnswer from './InvestegationResultAnswerParts/MeetingOverviewAnswer.vue';
import InvestegationResultTasksAnswer from './InvestegationResultAnswerParts/InvestegationResultTasksAnswer.vue';
import InvestegationResultTakeActionAnswer from './InvestegationResultAnswerParts/InvestegationResultTakeActionAnswer.vue';
import InvestegationResultAttachmentAnswer from './InvestegationResultAnswerParts/InvestegationResultAttachmentAnswer.vue';
import InvestegationResultViewersAnswer from "./InvestegationResultAnswerParts/InvestegationResultViewersAnswer.vue"
import ShowInvestigatingController from '../../controllers/showInvestigatingController';
import ShowInvestigatingParams from '../../../Core/params/showInvestigatingParams';


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
    ],
    correctiveAnswer: "Lorem Ipsum is simply dummy text of the printing Lorem Ipsum is simply dummy text of the printing Lorem Ipsum is simply dummy text of the printing "
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
    ],
    correctiveAnswer: "Lorem Ipsum is simply dummy text of the printing Lorem Ipsum is simply dummy text of the printing Lorem Ipsum is simply dummy text of the printing "
  },
])

const showInvestigatingController = ShowInvestigatingController.getInstance()
const state = ref(showInvestigatingController.state.value)


const GetInvestegationDetails = async () => {
  const showInvestigatingParams = new ShowInvestigatingParams(23)
  const response = await showInvestigatingController.showInvestigating(showInvestigatingParams)
  console.log(response.value.data, 'response')
}
onMounted(() => {
  GetInvestegationDetails()
})

watch(() => showInvestigatingController.state.value, (newVal) => {
  state.value = newVal
}
)

</script>
<template>
  <DataStatus :controller="state">
    <template #success>
      <div class="investegation-result-answer-container">
        <InvestigatingResultAnswerHedaer :meetingsNumber="state.data?.investigationMeetings?.length"
          :victim="state.data?.investigationTeamLeader?.Name" :date="state.data?.date"
          :meetingDate="state?.data?.investigationMeetings[state?.data?.investigationMeetings?.length - 1].date"
          :TeamLeader="state.data?.investigationTeamLeader?.Name" :createdAt="state.data?.date"
          :TeamNumbers="state.data?.investigationEmployees?.length"
          :solvedTasks="state.data?.investigationTasks?.filter((task: any) => task.status === 1)?.length"
          :ToltalTasks="state.data?.investigationTasks?.length" :investegationType="state.data?.observation?.type" />

        <CauseOfAccidantAnswer class="w-full" :Factors="state.data?.investigationFactors" />
        <MeetingOverviewAnswer :meetings="state.data?.investigationMeetings" />
        <InvestegationResultTasksAnswer :tasks="state.data?.investigationTasks" />
        <InvestegationResultTakeActionAnswer :actions="state.data" />
        <InvestegationResultAttachmentAnswer :attachments="state.data?.investigationDocumentations" />
        <InvestegationResultViewersAnswer  />
      </div>
    </template>
    <template #loader>
      <TableLoader :cols="3" :rows="10" />
    </template>
    <template #initial>
      <TableLoader :cols="3" :rows="10" />
    </template>
    <template #empty>
      <DataEmpty :link="`/organization/hazard/add`" addText="Add Hazard"
        description="Sorry .. You have no Hazard .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Hazard" />
    </template>
    <template #failed>
      <DataFailed :link="`/organization/hazard/add`" addText="Add Hazard"
        description="Sorry .. You have no Hazard .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Hazard" />
    </template>

    <template #notPermitted>
      <DataFailed addText="Have not Permission"
        description="Sorry .. You have no Hazard .. All your joined customers will appear here when you add your customer data" />
    </template>
  </DataStatus>

</template>
