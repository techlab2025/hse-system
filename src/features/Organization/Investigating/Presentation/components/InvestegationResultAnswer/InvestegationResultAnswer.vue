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
import { useRoute } from 'vue-router';



const route = useRoute()
const id = route.params.id
const showInvestigatingController = ShowInvestigatingController.getInstance()
const state = ref(showInvestigatingController.state.value)


const GetInvestegationDetails = async () => {
  const showInvestigatingParams = new ShowInvestigatingParams(Number(id))
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
          :TeamLeader="state.data?.investigationTeamLeader" :createdAt="state.data?.date"
          :TeamNumbers="state.data?.investigationEmployees?.length"
          :solvedTasks="state.data?.investigationTasks?.filter((task: any) => task.status === 1)?.length"
          :ToltalTasks="state.data?.investigationTasks?.length" :investegationType="state.data?.observation?.type" />

        <CauseOfAccidantAnswer v-if="state.data?.investigationFactors?.length > 0" class="w-full" :Factors="state.data?.investigationFactors" />
        <MeetingOverviewAnswer v-if="state.data?.investigationMeetings?.length > 0" :meetings="state.data?.investigationMeetings" />
        <InvestegationResultTasksAnswer v-if="state?.data?.investigationTasks?.length > 0" :tasks="state.data?.investigationTasks" />
        <InvestegationResultTakeActionAnswer v-if="state.data?.explainWhyText?.length > 0" :actions="state.data?.explainWhyText" />
        <InvestegationResultAttachmentAnswer v-if="state.data?.investigationDocumentations?.length > 0" :attachments="state.data?.investigationDocumentations" />
        <InvestegationResultViewersAnswer v-if="state.data?.witnessStatements?.length > 0" :viewers="state.data?.witnessStatements" />
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
