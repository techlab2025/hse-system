<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import InvestigatingResultAnswerHedaer from './InvestegationResultAnswerParts/InvestigatingResultAnswerHedaer.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
// import { InvestegationStatusEnum } from '../../../Core/Enums/InvestegationStatusEnum';
import CauseOfAccidantAnswer from './InvestegationResultAnswerParts/CauseOfAccidantAnswer.vue'
import MeetingOverviewAnswer from './InvestegationResultAnswerParts/MeetingOverviewAnswer.vue'
import InvestegationResultTasksAnswer from './InvestegationResultAnswerParts/InvestegationResultTasksAnswer.vue'
import InvestegationResultTakeActionAnswer from './InvestegationResultAnswerParts/InvestegationResultTakeActionAnswer.vue'
import InvestegationResultAttachmentAnswer from './InvestegationResultAnswerParts/InvestegationResultAttachmentAnswer.vue'
import InvestegationResultViewersAnswer from './InvestegationResultAnswerParts/InvestegationResultViewersAnswer.vue'
import ShowInvestigatingController from '../../controllers/showInvestigatingController'
import ShowInvestigatingParams from '../../../Core/params/showInvestigatingParams'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id
const showInvestigatingController = ShowInvestigatingController.getInstance()
const state = ref(showInvestigatingController.state.value)
const investigationData = computed(() => state.value?.data as any)

const correctiveTasks = computed(() =>
  investigationData.value?.correctiveTask?.length
    ? investigationData.value.correctiveTask
    : (investigationData.value?.correctiveTasks ?? []),
)
const preventiveTasks = computed(() =>
  investigationData.value?.preventiveTask?.length
    ? investigationData.value.preventiveTask
    : (investigationData.value?.preventiveTasks ?? []),
)
const legacyTasks = computed(() => investigationData.value?.investigationTasks ?? [])
const allTasks = computed(() => {
  const groupedTasks = [...correctiveTasks.value, ...preventiveTasks.value]
  return groupedTasks.length ? groupedTasks : legacyTasks.value
})
const solvedTasks = computed(() => allTasks.value.filter((task: any) => task?.status === 1).length)
const viewerResults = computed(() => {
  const investigationWitnesses = investigationData.value?.witnessStatements ?? []
  const observationWitnesses =
    investigationData.value?.observation?.witnessStatements ??
    investigationData.value?.observation?.witness_statements ??
    []
  const accidentWitnesses =
    investigationData.value?.observation?.accident_witness ??
    investigationData.value?.observation?.accidentWitness ??
    []

  return investigationWitnesses.length
    ? investigationWitnesses
    : [...observationWitnesses, ...accidentWitnesses]
})

const GetInvestegationDetails = async () => {
  const showInvestigatingParams = new ShowInvestigatingParams(Number(id))
  const response = await showInvestigatingController.showInvestigating(showInvestigatingParams)
  console.log(response.value.data, 'response')
}
onMounted(() => {
  GetInvestegationDetails()
})

watch(
  () => showInvestigatingController.state.value,
  (newVal) => {
    state.value = newVal
  },
)
</script>
<template>
  <DataStatus :controller="state">
    <template #success>
      <div class="investegation-result-answer-container">
        <InvestigatingResultAnswerHedaer
          :meetingsNumber="state.data?.investigationMeetings?.length"
          :victim="state.data?.investigationTeamLeader?.Name"
          :date="state.data?.created_at"
          :meetingDate="
            state?.data?.investigationMeetings[state?.data?.investigationMeetings?.length - 1]?.date
          "
          :TeamLeader="state.data?.investigationTeamLeader"
          :createdAt="state.data?.date"
          :TeamNumbers="state.data?.investigationEmployees?.length"
          :solvedTasks="solvedTasks"
          :ToltalTasks="allTasks.length"
          :investegationType="state.data?.observation?.type"
        />

        <CauseOfAccidantAnswer
          v-if="state.data?.investigationFactors?.length > 0"
          class="w-full"
          :Factors="state.data?.investigationFactors"
        />
        <MeetingOverviewAnswer
          v-if="state.data?.investigationMeetings?.length > 0"
          :meetings="state.data?.investigationMeetings"
        />
        <InvestegationResultTasksAnswer
          v-if="allTasks.length > 0"
          :correctiveTasks="correctiveTasks"
          :preventiveTasks="preventiveTasks"
          :tasks="legacyTasks"
          @answered="GetInvestegationDetails"
        />

        <InvestegationResultTakeActionAnswer
          v-if="state.data?.explainWhyText?.length > 0"
          :actions="state.data?.explainWhyText"
          :isCorrect="state.data?.isActionCorrect"
        />
        <InvestegationResultAttachmentAnswer
          v-if="state.data?.investigationDocumentations?.length > 0"
          :attachments="state.data?.investigationDocumentations"
        />
        <InvestegationResultViewersAnswer
          v-if="viewerResults.length > 0"
          :viewers="viewerResults"
        />
      </div>
    </template>
    <template #loader>
      <TableLoader :cols="3" :rows="10" />
    </template>
    <template #initial>
      <TableLoader :cols="3" :rows="10" />
    </template>
    <template #empty>
      <DataEmpty
        :link="`/organization/hazard/add`"
        addText="Add Hazard"
        description="Sorry .. You have no Hazard .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Hazard"
      />
    </template>
    <template #failed>
      <DataFailed
        :link="`/organization/hazard/add`"
        addText="Add Hazard"
        description="Sorry .. You have no Hazard .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Hazard"
      />
    </template>

    <template #notPermitted>
      <DataFailed
        addText="Have not Permission"
        description="Sorry .. You have no Hazard .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </DataStatus>
</template>
