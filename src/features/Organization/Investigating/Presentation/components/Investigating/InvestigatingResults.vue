<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
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
import { useRoute, useRouter } from 'vue-router'
import ShowInvestigationResultParams from '../../../Core/params/investegationResult/ShowInvestigationResultParams'
import ShowInvestigatingResultController from '../../controllers/investegationResult/ShowInvestigatingResultController'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import type InvestegationTasksParams from '../../../Core/params/investegationResult/InvestegationTasksParams'
import InvestigationAttachmentsParams from '../../../Core/params/investegationResult/InvestegationAttachmentParams'

const route = useRoute()
const id = route.params.id
const investigatingId = route.query.investigating_id
const showInvestigationResultController = ShowInvestigatingResultController.getInstance()
const state = ref(showInvestigationResultController.state.value)
const router = useRouter()
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
  status: InvestegationStatusEnum.CLOSED,
  image: 'https://picsum.photos/222/150',
  link: '',
})

const ShoeInvestegationResultDetails = () => {
  const showInvestigationResultParams = new ShowInvestigationResultParams(investigatingId)
  showInvestigationResultController.ShowInvestigatingResult(showInvestigationResultParams, router)
}

const AddEnvestigatingResult = async () => {
  const addInvestigationResultParams = new AddInvestigationResultParams({
    documentation: investigationAttachments.value,
    explainWhyText: rateActions.value?.notes,
    factors: CauseOfAction.value?.factors,
    investigationMeetingId: id,
    isActionCorrect: rateActions.value?.actionRate,
    isInvestigationClosed: anotherMeeting?.value?.isAnother == 1 ? 0 : 1,
    tasks: investigationTasks.value,
    witnesses: viewersResults.value,
    meeting: anotherMeeting?.value?.meetings,
    corrective: CauseOfAction.value?.description
  });
  const addInvestigatingResultController = AddInvestigatingResultController.getInstance()
  const res = await addInvestigatingResultController.addInvestigatingResult(addInvestigationResultParams, router)
}
onMounted(() => {
  ShoeInvestegationResultDetails()
})
watch(() => showInvestigationResultController.state.value, (newState) => {
  if (newState) state.value = newState
})

const CauseOfAction = ref()
const setCauseOfAction = (data) => {
  CauseOfAction.value = data
}

const investigationTasks = ref()
const setInvestigationTasks = (data) => {
  console.log(data, "investigationTasks");
  investigationTasks.value = data
}

const rateActions = ref()
const setRateAction = (data) => {
  rateActions.value = data
  console.log(rateActions.value, "rateActions");
}

const investigationAttachments = ref()
const setInvestigationAttachments = (data) => {
  investigationAttachments.value = data

}

const viewersResults = ref()
const setViewersResults = (data) => {
  console.log(data, "viwer");
  viewersResults.value = data
}

const anotherMeeting = ref()
const setAnotherMeeting = (data) => {
  anotherMeeting.value = data
  console.log(data);
}

</script>
<template>
  <DataStatus :controller="state">
    <template #success>
      <div class="investigation-result">
        <!-- <pre>
          {{ state.data }}
        </pre> -->

        <!-- {{ state?.data?.observation?.serial }} -->
        <InvestigatingHedaer :title="state?.data?.observation?.title" :serial="state?.data?.observation?.serial"
          :victim="state?.data?.observation?.observer?.name" :date="state?.data?.date" :meetingDate="state?.data?.date"
          :TeamLeader="state?.data?.investigationTeamLeader?.title"
          :TeamNumbers="state.data?.investigationEmployees?.length" />

        <div class="investigation-title">
          <img :src="investigationImg" alt="" />
          <p>Investigation Meeting result</p>
        </div>
        <CauseOfAccidant @update:data="setCauseOfAction" />
        <InvestigationTasks @update:data="setInvestigationTasks" />
        <RateActions @update:data="setRateAction" />
        <InvestegationAttachment @update:data="setInvestigationAttachments" />
        <div class="attachments-show">
          <p class="title">{{ investigationAttachments?.title }}</p>
          <img :src="investigationAttachments?.files?.[0]" alt="attachment" width="150">
        </div>

        <ViewersResults @update:data="setViewersResults" />
        <AnotherMeeting @update:data="setAnotherMeeting" />
        <!-- <TimeLine :items="item" /> -->
        <div class="btns">
          <router-link to="/organization/investigating" class="btn btn-cancel ">{{ $t('cancel') }}</router-link>
          <button @click="AddEnvestigatingResult" class="btn btn-primary">{{ $t('confirm') }}</button>
        </div>
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
        description="Sorry .. You have no Investegation Result .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Investegation Result" />
    </template>
    <template #failed>
      <DataFailed
        description="Sorry .. You have no Investegation Result Data .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Investegation Result Data" />
    </template>

    <template #notPermitted>
      <DataFailed addText="Have not Permission"
        description="Sorry .. You have no Hazard .. All your joined customers will appear here when you add your customer data" />
    </template>
  </DataStatus>


</template>
