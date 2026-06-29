<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
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
import InvestigationCapaDialog from '../../SubComponents/InvestigationCapaDialog.vue'
import Editor from 'primevue/editor'
import InvestegationAnotherMeetingParams from '../../../Core/params/investegationResult/InvestegationAnotherMeetingParams.ts'
import FactoryAccidents from '@/features/Organization/ObservationFactory/Presentation/components/FactoryUtils/FactoryAccidents.vue'
import InjuryParams from '@/features/Organization/ObservationFactory/Core/params/InjuriesParams.ts'
import CapaActionPlan from '@/features/Organization/Capa/Presentation/components/CapaActionPlan.vue'

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
const item = ref<items[]>([
  {
    title: 'High observation',
    isDanger: true,
  },
])

const ShoeInvestegationResultDetails = () => {
  const showInvestigationResultParams = new ShowInvestigationResultParams(investigatingId)
  showInvestigationResultController.ShowInvestigatingResult(showInvestigationResultParams, router)
}
const openDialog = ref(false)
const emptyCapaActionPlan = {
  corrective: [],
  preventive: [],
}
const AddEnvestigatingResult = async () => {
  const CheckWitnessIsFullyEmpty = viewersResults.value.map((el) => {
    return (
      (el.organizationEmployeeId != null || el.employeeName != undefined) &&
      el?.witnessesStatements?.length > 1
    )
  })
  // const CheckInvestigationTasksIsFullyEmpty = investigationTasks.value?.filter((el) => {
  //   return el?.tasks?.length > 0
  // })
  // CheckWitnessIsFullyEmpty ? [] :
  const RootCausesIds = RootCauses.value.map(
    (el) => new RootCausesIdParams({ root_cause_id: el.id }),
  )

  // if (anotherMeeting?.value?.isAnother == 0) {
  //   openDialog.value = true
  //   return;
  // }

  const actionPlan = capaActionPlan.value ?? emptyCapaActionPlan

  const addInvestigationResultParams = new AddInvestigationResultParams({
    documentation: investigationAttachments.value,
    explainWhyText: rateActions.value?.notes,
    factors: CauseOfAction.value?.factors,
    investigationMeetingId: Number(id),
    isActionCorrect: rateActions.value?.actionRate,
    isInvestigationClosed: anotherMeeting?.value?.isAnother == 1 ? 0 : 1,
    observationId: Number(state.value?.data?.observation?.id),
    tasks: [...actionPlan.corrective, ...actionPlan.preventive],
    witnesses: CheckWitnessIsFullyEmpty.find((el) => el) ? viewersResults.value : [],
    meeting: new InvestegationAnotherMeetingParams(
      anotherMeeting?.value?.meetings?.date,
      anotherMeeting?.value?.meetings?.time,
      anotherMeeting?.value?.meetings?.type,
      anotherMeeting?.value?.meetings?.place,
    ),
    isAnotherMeeting: anotherMeeting?.value?.isAnother,
    corrective: CauseOfAction.value?.description,
    RootCauses: RootCausesIds,
    investegaionLevel: SelectedLevel.value?.id,
    FiveWhyQuestionsData: FiveWhyQuestionsData.value,
    IncidantDescription: IncidantDescription.value,
    recommendation: recommendation.value,
    Injury: Accidents.value?.accidentsData?.map((item: any) => {
      return new InjuryParams(
        item?.employee?.id || 0,
        item?.employee?.title || '',
        item?.text || null,
        item?.infectionTypeId?.id || 0,
        item?.isWorkStopped ? 1 : 0,
        item?.images.map((el: any) => el.file) || [],
      )
    }),
    correctiveTasks: actionPlan.corrective,
    preventiveTasks: actionPlan.preventive,
    lessonLearnt: lessonLearnt.value,
  })
  console.log(anotherMeeting.value, 'anotherMeeting')
  const addInvestigatingResultController = AddInvestigatingResultController.getInstance()
  const res = await addInvestigatingResultController.addInvestigatingResult(
    addInvestigationResultParams,
    router,
  )
  if (res.value.error == null && addInvestigationResultParams.isAnotherMeeting == 0) {
    openDialog.value = true
  } else if (addInvestigationResultParams.isAnotherMeeting == 1) {
    router.push('/organization/investigating')
  }
  // else {
  //   router.push('/organization/investigating')
  // }
  // console.log(res.value.error, 'error')
}
onMounted(() => {
  ShoeInvestegationResultDetails()
})
watch(
  () => showInvestigationResultController.state.value,
  (newState) => {
    if (newState) state.value = newState
  },
)

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
const initialViewers = computed(() => [
  ...(state.value?.data?.observation?.witness_statements ?? []),
  ...(state.value?.data?.witness_statements ?? []),
])
const FiveWhyQuestionsData = ref()
const setFiveWhyQuestions = (data) => {
  FiveWhyQuestionsData.value = data
}

const anotherMeeting = ref()
const setAnotherMeeting = (data) => {
  console.log(data, 'data')
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
  new TitleInterface({ id: 1, title: 'low' }),
  new TitleInterface({ id: 2, title: 'meduim' }),
  new TitleInterface({ id: 3, title: 'high' }),
])
const SelectedLevel = ref<TitleInterface>()
const setSelectedLevel = (data: TitleInterface) => {
  SelectedLevel.value = data
}
const recommendation = ref<string>()
const updateRecommendation = (data) => {
  recommendation.value = data.target.value
}
const CloseCapa = async () => {
  openDialog.value = false
  router.push('/organization/investigating')
}
const IncidantDescription = ref<string>()

const Accidents = ref()
const UpdateAccidents = (data: any) => {
  Accidents.value = data
  console.log(Accidents.value, 'Accidents.value')
}

const capaActionPlan = ref()
const setCapaActionPlan = (data: any) => {
  capaActionPlan.value = {
    corrective: data?.corrective ?? [],
    preventive: data?.preventive ?? [],
  }
}
const lessonLearnt = ref('')
</script>
<template>
  <DataStatus :controller="state">
    <template #success>
      <div class="investigation-result">
        <InvestigatingHedaer
          :title="state?.data?.observation?.title"
          :serial="state?.data?.observation?.serial_name"
          :victim="state?.data?.observation?.observer?.name"
          :date="state?.data?.investigationMeetingDate"
          :meetingDate="state?.data?.date"
          :TeamLeader="state?.data?.TeamLeader.name"
          :TeamNumbers="state.data?.investigationEmployees?.length"
          :incidantType="state?.data?.observation?.type_model"
          :place="state?.data?.observation?.place"
          :equipment="state?.data?.observation?.equipment"
          :incidantDescription="state?.data?.observation?.description"
          :team="state.data?.investigationEmployees"
        />

        <!-- <div class="investigation-title">
          <img :src="investigationImg" alt="" />
          <p>Investigation Meeting result</p>
        </div> -->
        <div class="flex w-full gap-2 investigation-result-inputs">
          <!-- <div class="input-wrapper w-50">
            <UpdatedCustomInputSelect
              :modelValue="SelectedLevel"
              class="input"
              :staticOptions="InvestigationLevel"
              :label="$t('investigation_category')"
              id="investegation-level"
              :placeholder="$t('select your Level')"
              @update:modelValue="setSelectedLevel"
            />
          </div> -->
        </div>

        <div class="investigation-title">
          <img :src="investigationImg" alt="" />
          <p>Events Timeline Builder</p>
        </div>
        <div class="input-wrapper w-full narrative-panel">
          <label for="event_time_line">{{ $t('event_time_line') }}</label>
          <Editor
            id="event_time_line"
            v-model="IncidantDescription"
            editorStyle="height: 320px"
            :placeholder="'What happened? (in detail)'"
          />
        </div>

        <div class="investigation-title">
          <img :src="investigationImg" alt="" />
          <p>Injuries</p>
        </div>
        <div class="investigation-injury">
          <FactoryAccidents
            :injuries="state.data?.observation?.injuries"
            class="not-colored"
            @update:data="UpdateAccidents"
            :isOpen="true"
          />
        </div>

        <!-- <div class="investigation-title">
          <img :src="investigationImg" alt="" />
          <p>Health Impact Integration</p>
        </div> -->

        <div class="investigation-title">
          <img :src="investigationImg" alt="" />
          <p>Witness Management</p>
        </div>

        <ViewersResults :viwers="initialViewers" @update:data="setViewersResults" />

        <div class="investigation-title">
          <img :src="investigationImg" alt="" />
          <p>Immediate Action Evaluation</p>
        </div>

        <RateActions @update:data="setRateAction" />

        <div class="investigation-title">
          <img :src="investigationImg" alt="" />
          <p>Root Cause Analysis (5 Whys)</p>
        </div>
        <FiveWhyQuestions @update:data="setFiveWhyQuestions" />
        <!-- root causes -->
        <div class="input-wrapper w-full root-cause-panel">
          <UpdatedCustomInputSelect
            :modelValue="RootCauses"
            class="input"
            :controller="indexRootCaueseController"
            :params="indexRootCaueseParams"
            :label="$t('root_cause')"
            id="rootCause"
            :placeholder="$t('select your root_cause')"
            @update:modelValue="setRootCause"
            :type="2"
            @close="RootCausesDialog = false"
            :isDialog="true"
            v-model:dialogVisible="RootCausesDialog"
          >
            <template #LabelHeader>
              <span class="add-dialog" @click="RootCausesDialog = true">{{ $t('New') }}</span>
            </template>
            <template #Dialog>
              <AddRootCauses @close:data="RootCausesDialog = false" />
            </template>
          </UpdatedCustomInputSelect>
        </div>

        <div class="investigation-title">
          <img :src="investigationImg" alt="" />
          <p>Action Plan</p>
        </div>
        <CapaActionPlan @update:data="setCapaActionPlan" />

        <section class="lesson-section">
          <div class="section-heading">
            <span>Lesson learnt</span>
            <h2>Capture the learning before it fades</h2>
          </div>
          <Editor
            id="lesson_learnt"
            v-model="lessonLearnt"
            editorStyle="height: 280px"
            placeholder="Write the lesson learnt, what changed, and what should be shared with other teams."
          />
        </section>

        <InvestegationAttachment @update:data="setInvestigationAttachments" />
        <div class="attachments-show" v-if="investigationAttachments?.files?.length">
          <p class="title">{{ investigationAttachments?.title }}</p>
          <div class="image-container">
            <div
              class="attachment-preview"
              v-for="(image, index) in investigationAttachments?.files"
              :key="index"
            >
              <DeleteIcon
                class="cursor-pointer"
                @click="investigationAttachments?.files.splice(index, 1)"
              />
              <img :src="image" alt="attachment" width="150" />
            </div>
          </div>
        </div>

        <!-- <CauseOfAccidant @update:data="setCauseOfAction" /> -->
        <!-- <InvestigationTasks @update:data="setInvestigationTasks" /> -->
        <div class="input-wrapper w-full reccomendation recommendation-panel">
          <label for="recommendation">{{ $t('recommendation action for capa') }}</label>
          <textarea
            id="recommendation"
            class="input"
            placeholder="add your recommendation for capa"
            v-model="recommendation"
            @input="updateRecommendation"
          ></textarea>
        </div>

        <AnotherMeeting @update:data="setAnotherMeeting" />

        <!-- <TimeLine :items="item" /> -->
        <div class="btns">
          <!-- <CloseInvestegaionDialog :investegationId="state.data?.id" /> -->
          <router-link to="/organization/investigating" class="btn btn-cancel">{{
            $t('cancel')
          }}</router-link>
          <button @click="AddEnvestigatingResult" class="btn btn-primary">
            {{ $t('confirm') }}
          </button>
        </div>
      </div>
      <InvestigationCapaDialog
        v-model:visible="openDialog"
        :observationId="Number(state?.data?.observation?.id)"
        @close="CloseCapa"
      />
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
        title="..ops! You have No Investegation Result"
      />
    </template>
    <template #failed>
      <DataFailed
        description="Sorry .. You have no Investegation Result Data .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Investegation Result Data"
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

<style scoped lang="scss">
.lesson-section {
  width: 100%;
}
.w-50 {
  width: 50%;
}
.btn-cancel {
  width: 20%;
}
.mt-12 {
  margin-top: 3rem !important;
}

.reccomendation {
  /* padding-inline: 10px; */
}

.lesson-section {
  border: 1px solid var(--main-border);
  border-radius: 18px;
  background: var(--BgWhite);
  box-shadow: 0 8px 16px color-mix(in srgb, var(--Black) 10%, transparent);
  padding: 1.25rem;
}

.section-heading {
  margin-bottom: 1rem;

  span {
    color: var(--PrimaryColor);
    font-size: 0.76rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h2 {
    margin: 0.25rem 0 0;
    color: var(--header-page-color);
    font-size: 1.35rem;
    font-weight: 900;
  }
}

:deep(.p-editor-container) {
  border-radius: 16px;
  overflow: hidden;
}

:deep(.p-editor-toolbar) {
  border-color: var(--main-border);
  background: var(--Gray-1);
}

:deep(.p-editor-content) {
  border-color: var(--main-border);
}

.investigation-result-inputs {
  @media (max-width: 568px) {
    flex-wrap: wrap;

    .input-wrapper {
      width: 100%;
    }
  }
}
.btns {
  display: flex;
  gap: 1rem;
  justify-content: space-between !important;
  button,
  a {
    width: 50% !important;
  }
}
</style>
