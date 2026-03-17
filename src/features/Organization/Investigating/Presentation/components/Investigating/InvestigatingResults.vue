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
import DeleteIcon from '@/shared/icons/DeleteIcon.vue'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import IndexRootCausesController from '@/features/setting/RootCauses/Presentation/controllers/indexRootCausesController'
import IndexRootCausesParams from '@/features/setting/RootCauses/Core/params/indexRootCausesParams'
import TitleInterface from '@/base/Data/Models/title_interface'
import AddRootCauses from '@/views/Organization/RootCaueses/AddRootCauses.vue'
import FiveWhyQuestions from './InvestegationResultParts/FiveWhyQuestions.vue'
import CloseInvestegaionDialog from './InvestegationDialogs/CloseInvestegaionDialog.vue'
import RootCausesIdParams from '@/features/Organization/ObservationFactory/Core/params/RootCausesIdParams'

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

// const Details = ref({
//   id: 3,
//   title: 'Medium observation',
//   serial: 'Third card dummy text',
//   date: '2025-03-15 09:45 AM',
//   observer: { name: 'Khaled Samir' },
//   description: 'Electrical issue near main control panel.',
//   zoon: { title: 'Zone C' },
//   equipment: { title: 'Crane Liebherr' },
//   status: InvestegationStatusEnum.CLOSED,
//   image: 'https://picsum.photos/222/150',
//   link: '',
// })

const ShoeInvestegationResultDetails = () => {
  const showInvestigationResultParams = new ShowInvestigationResultParams(investigatingId)
  showInvestigationResultController.ShowInvestigatingResult(showInvestigationResultParams, router)
}

const AddEnvestigatingResult = async () => {
  const CheckWitnessIsFullyEmpty = viewersResults.value.map((el) => {
    return (el.organizationEmployeeId != null || el.employeeName != undefined) && el?.witnessesStatements?.length > 1
  })
  const CheckInvestigationTasksIsFullyEmpty = investigationTasks.value.filter((el) => {
    return el?.tasks?.length > 0
  })
  // CheckWitnessIsFullyEmpty ? [] :
  const RootCausesIds = RootCauses.value.map((el) => new RootCausesIdParams({ root_cause_id: el.id }))

  const addInvestigationResultParams = new AddInvestigationResultParams({
    documentation: investigationAttachments.value,
    explainWhyText: rateActions.value?.notes,
    factors: CauseOfAction.value?.factors,
    investigationMeetingId: id,
    isActionCorrect: rateActions.value?.actionRate,
    isInvestigationClosed: anotherMeeting?.value?.isAnother == 1 ? 0 : 1,
    tasks: investigationTasks.value,
    witnesses: CheckWitnessIsFullyEmpty.find((el) => el) ? viewersResults.value : [],
    meeting: anotherMeeting?.value?.meetings,
    corrective: CauseOfAction.value?.description,
    preventive: recommendation.value,
    RootCauses: RootCausesIds,
    investegaionLevel: SelectedLevel.value?.id,
    FiveWhyQuestionsData: FiveWhyQuestionsData.value
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
  investigationTasks.value = data
}

const rateActions = ref()
const setRateAction = (data) => {
  rateActions.value = data
}

const investigationAttachments = ref()
const setInvestigationAttachments = (data) => {
  investigationAttachments.value = data

}

const viewersResults = ref()
const setViewersResults = (data) => {
  viewersResults.value = data
}
const FiveWhyQuestionsData = ref()
const setFiveWhyQuestions = (data) => {
  FiveWhyQuestionsData.value = data
}

const anotherMeeting = ref()
const setAnotherMeeting = (data) => {
  anotherMeeting.value = data
}
const indexRootCaueseController = IndexRootCausesController.getInstance()
const indexRootCaueseParams = new IndexRootCausesParams('', 1, 10, 0)
const RootCauses = ref<TitleInterface[]>([])
const setRootCause = (data: TitleInterface[]) => {
  RootCauses.value = data
}
const RootCausesDialog = ref<boolean>(false)

const InvestigationLevel = ref<TitleInterface[]>([
  new TitleInterface({ id: 1, title: "low" }),
  new TitleInterface({ id: 2, title: "meduim" }),
  new TitleInterface({ id: 3, title: "high" }),
])
const SelectedLevel = ref<TitleInterface>()
const setSelectedLevel = (data: TitleInterface) => {
  SelectedLevel.value = data
}
const recommendation = ref<string>()
const updateRecommendation = (data) => {
  recommendation.value = data.target.value
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
          :victim="state?.data?.observation?.observer?.name" :date="state?.data?.CreatedAt"
          :meetingDate="state?.data?.date" :TeamLeader="state?.data?.TeamLeader.name"
          :TeamNumbers="state.data?.investigationEmployees?.length" />

        <div class="investigation-title">
          <img :src="investigationImg" alt="" />
          <p>Investigation Meeting result</p>
        </div>
        <div class="flex w-full gap-2 investigation-result-inputs">
          <div class="input-wrapper w-50">
            <UpdatedCustomInputSelect :modelValue="RootCauses" class="input" :controller="indexRootCaueseController"
              :params="indexRootCaueseParams" :label="$t('Immediate Apparent Cause')" id="rootCause"
              :placeholder="$t('select your Immediate Apparent Cause')" @update:modelValue="setRootCause" :type="2"
              @close="RootCausesDialog = false" :isDialog="true" :dialogVisible="RootCausesDialog">
              <template #LabelHeader>
                <span class="add-dialog" @click="RootCausesDialog = true">{{ $t('New') }}</span>
              </template>
              <template #Dialog>
                <AddRootCauses @close:data="RootCausesDialog = false" />
              </template>
            </UpdatedCustomInputSelect>

          </div>
          <div class="input-wrapper w-50">
            <UpdatedCustomInputSelect :modelValue="SelectedLevel" class="input" :staticOptions="InvestigationLevel"
              :label="$t('investigation_category')" id="investegation-level" :placeholder="$t('select your Level')"
              @update:modelValue="setSelectedLevel" />
          </div>
        </div>
        <div class="input-wrapper w-full reccomendation">
          <label for="recommendation">{{ $t('recommendation') }}</label>
          <textarea id="recommendation" class="input" placeholder="add your recommendation" v-model="recommendation"
            @input="updateRecommendation"></textarea>
        </div>
        <FiveWhyQuestions @update:data="setFiveWhyQuestions" />

        <CauseOfAccidant @update:data="setCauseOfAction" />
        <InvestigationTasks @update:data="setInvestigationTasks" />
        <RateActions @update:data="setRateAction" />
        <InvestegationAttachment @update:data="setInvestigationAttachments" />
        <div class="attachments-show" v-if="investigationAttachments?.files?.length">
          <p class="title">{{ investigationAttachments?.title }}</p>
          <div class="image-container">
            <div v-for="(image, index) in investigationAttachments?.files">
              <DeleteIcon class="cursor-pointer" @click="investigationAttachments?.files.splice(index, 1)" />
              <img :src="image" alt="attachment" width="150">
            </div>
          </div>
        </div>

        <ViewersResults @update:data="setViewersResults" />
        <AnotherMeeting @update:data="setAnotherMeeting" />
        <!-- <TimeLine :items="item" /> -->
        <div class="btns">
          <CloseInvestegaionDialog :investegationId="state.data?.id" />
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

<style scoped lang="scss">
.w-50 {
  width: 50%;
}

.reccomendation {
  /* padding-inline: 10px; */
}

.investigation-result-inputs {
  @media (max-width: 568px) {
    flex-wrap: wrap;

    .input-wrapper {
      width: 100%;
    }
  }
}
</style>
