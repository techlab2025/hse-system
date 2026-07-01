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
import FiveWhyQuestions from './InvestegationResultParts/FiveWhyQuestions.vue'
import CloseInvestegaionDialog from './InvestegationDialogs/CloseInvestegaionDialog.vue'
import RootCausesIdParams from '@/features/Organization/ObservationFactory/Core/params/RootCausesIdParams'
import InvestigationCapaDialog from '../../SubComponents/InvestigationCapaDialog.vue'
import Editor from 'primevue/editor'
import InvestegationAnotherMeetingParams from '../../../Core/params/investegationResult/InvestegationAnotherMeetingParams.ts'
import FactoryAccidents from '@/features/Organization/ObservationFactory/Presentation/components/FactoryUtils/FactoryAccidents.vue'
import InjuryParams from '@/features/Organization/ObservationFactory/Core/params/InjuriesParams.ts'
import CapaActionPlan from '@/features/Organization/Capa/Presentation/components/CapaActionPlan.vue'
import IndexDocumentRefrenceController from '@/features/Organization/DocumentRefrence/Presentation/controllers/IndexDocumentRefrenceController.ts'
import IndexDocumentRefrenceParams from '@/features/Organization/DocumentRefrence/Core/params/IndexADocumentRefrenceParams.ts'
import AddDocumentRefrence from '@/features/Organization/DocumentRefrence/Presentation/components/AddDocumentRefrence.vue'
import AddRootCauses from '@/features/setting/RootCauses/Presentation/components/AddRootCauses.vue'
import SimilarObservationController from '../../controllers/similarObservation/SimilarObservationController.ts'
import SimilarObservatioParams from '../../../Core/params/SimilarObservation/SimilarObservatioParams.ts'
import type HazardDetailsModel from '@/features/Organization/ObservationFactory/Data/models/hazardDetailsModel.ts'

const route = useRoute()
const id = route.params.id
const investigatingId = route.query.investigating_id
const showInvestigationResultController = ShowInvestigatingResultController.getInstance()
const state = computed(() => showInvestigationResultController.state.value)
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

const ShoeInvestegationResultDetails = async () => {
  const showInvestigationResultParams = new ShowInvestigationResultParams(investigatingId)
  await showInvestigationResultController.ShowInvestigatingResult(
    showInvestigationResultParams,
    router,
  )
}
const openDialog = ref(false)
const emptyCapaActionPlan = {
  corrective: [],
  preventive: [],
}
const AddEnvestigatingResult = async () => {
  const CheckWitnessIsFullyEmpty = (viewersResults.value ?? []).map((el) => {
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
  const DocumentReferenceIds = DocumentRefrences.value.map((el) => el.id)

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
      const employeeId = item?.employee?.id || 0
      return new InjuryParams(
        employeeId,
        employeeId ? '' : item?.employee?.title || '',
        item?.text || null,
        item?.infectionTypeId?.id || 0,
        item?.isWorkStopped ? 1 : 0,
        item?.images?.map((el: any) => el.file) || [],
      )
    }),
    correctiveTasks: actionPlan.corrective,
    preventiveTasks: actionPlan.preventive,
    lessonLearnt: lessonLearnt.value,
    documentReferenceIds: DocumentReferenceIds,
  })
  console.log(anotherMeeting.value, 'anotherMeeting')
  const addInvestigatingResultController = AddInvestigatingResultController.getInstance()
  const res = await addInvestigatingResultController.addInvestigatingResult(
    addInvestigationResultParams,
    router,
  )
  // if (res.value.error == null && addInvestigationResultParams.isAnotherMeeting == 0) {
  //   openDialog.value = true
  // } else if (res.value.error == null && addInvestigationResultParams.isAnotherMeeting == 1) {
  router.push('/organization/investigating')
  // }
  // else {
  //   router.push('/organization/investigating')
  // }
  // console.log(res.value.error, 'error')
}
onMounted(async () => {
  await ShoeInvestegationResultDetails()
  fetchSimilarObservations()
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
  console.log(data, 'data')
}

const investigationAttachments = ref()
const setInvestigationAttachments = (data) => {
  investigationAttachments.value = data
}

const viewersResults = ref()
const setViewersResults = (data) => {
  viewersResults.value = data
}
const uniqueByIdOrName = (items: any[]) => {
  const seen = new Set<string>()

  return items.filter((item) => {
    const key = String(
      item?.id ||
        item?.organization_employee?.organization_employee_id ||
        item?.organization_employee?.id ||
        item?.employee_name ||
        JSON.stringify(item),
    )

    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const initialViewers = computed(() =>
  uniqueByIdOrName([
    ...(state.value?.data?.observation?.witness_statements ?? []),
    ...(state.value?.data?.observation?.accident_witness ?? []),
    ...(state.value?.data?.witness_statements ?? []),
  ]),
)
const initialInjuries = computed(() =>
  uniqueByIdOrName([
    ...(state.value?.data?.observation?.injuries ?? []),
    ...(state.value?.data?.observation?.accident_victim ?? []),
    ...(state.value?.data?.injuries ?? []),
  ]),
)
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
const DocumentRefrences = ref<TitleInterface[]>([])
const setDocumentRefrences = (data: TitleInterface[]) => {
  DocumentRefrences.value = data
}
const SimilarObservations = ref<HazardDetailsModel[]>()
const similarObservationsLoading = ref(false)
const fetchedSimilarObservationId = ref<number | null>(null)
const fetchSimilarObservations = async () => {
  const observationId = state.value.data?.observation?.id
  if (!observationId || fetchedSimilarObservationId.value === observationId) return

  similarObservationsLoading.value = true
  try {
    const similarObservationController = SimilarObservationController.getInstance()
    const similarObservationParams = new SimilarObservatioParams({
      observationId: observationId,
      word: '',
      withPage: 1,
      perPage: 5,
      pageNumber: 10,
    })
    const result = await similarObservationController.fetchSimilarObservations(
      similarObservationParams,
      router,
      true,
    )
    console.log(result.value?.data, 'result.value?.data ')
    SimilarObservations.value = result.value?.data ?? []
    fetchedSimilarObservationId.value = observationId
  } finally {
    similarObservationsLoading.value = false
  }
}

watch(
  () => state.value.data?.observation?.id,
  () => {
    fetchSimilarObservations()
  },
)
</script>
<template>
  <DataStatus :controller="state">
    <template #success>
      <div class="investigation-result">
        <div class="investigation-title">
          <img :src="investigationImg" alt="" />
          <p>General Identification</p>
        </div>
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
          :time="state.data?.investigationMeetingTime"
          :shift="state.data?.observation.work_shift"
          @update:documentRefrences="setDocumentRefrences"
        />

        <div class="investigation-title">
          <img :src="investigationImg" alt="" />
          <p>Investigation Team Setup</p>
        </div>
        <div class="investigating-header-container">
          <div class="meeting-info-container">
            <!-- <div class="metting-info-header-container">
        <p class="metting-info-header">{{ $t('investigation_meeting') }}</p>
        <hr class="meeting-hr" />
      </div> -->
            <div class="meeting-info">
              <p>
                Investigation team leader :
                <span class="team-leader">{{ state?.data?.TeamLeader?.name }}</span>
              </p>
              <p>
                Num of team :
                <span class="team-number">{{ state?.data?.investigationEmployees?.length }}</span>
              </p>
            </div>
          </div>
          <div class="team-container">
            <p class="title">{{ $t('team') }}</p>
            <div class="team">
              <div
                class="team-member"
                v-for="member in state.data?.investigationEmployees"
                :key="member.id"
              >
                <img
                  :src="
                    member?.organizationEmployee?.image ||
                    'https://cyber.comolho.com/static/img/avatar.png'
                  "
                  alt=""
                  class="equipemtn-card-image"
                />
                <div class="employee-text">
                  <p class="name">{{ member.organizationEmployee?.name }}</p>
                  <p class="serial">{{ member.organizationEmployee?.serialName }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="investigating-header-container">
          <div class="incidant-description">
            <p class="title">{{ $t('incidant_description') }}</p>
            <p class="description">{{ state?.data?.observation?.description }}</p>
          </div>
        </div> -->

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

        <div class="input-wrapper w-full">
          <div class="investigating-header-container">
            <div class="incidant-description col-span-2">
              <p class="title">{{ $t('incidant_description') }}</p>
              <p class="description">{{ state?.data?.observation?.description }}</p>
            </div>
            <div class="incidant-description col-span-2">
              <label for="event_time_line">{{ $t('event_time_line') }}</label>

              <textarea
                id="event_time_line"
                v-model="IncidantDescription"
                :placeholder="'What happened? (in detail)'"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="investigation-title">
          <img :src="investigationImg" alt="" />
          <p>Health Impact Integration</p>
        </div>
        <div class="investigation-injury">
          <FactoryAccidents
            :injuries="initialInjuries"
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

        <ViewersResults
          :isInvestigation="true"
          :viwers="initialViewers"
          @update:data="setViewersResults"
        />

        <div class="investigation-title">
          <img :src="investigationImg" alt="" />
          <p>Immediate Action Evaluation</p>
        </div>

        <div class="investigating-header-container">
          <div class="incidant-description col-span-2">
            <p class="title">{{ $t('immediate action') }}</p>
            <p class="description">{{ state?.data?.observation?.action }}</p>
          </div>
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
        <CauseOfAccidant @update:data="setCauseOfAction" />
        <!-- Regulatory/Legal Compliance Reference -->

        <!-- <div class="input-wrapper w-full root-cause-panel">
          <UpdatedCustomInputSelect
            :modelValue="DocumentRefrences"
            class="input"
            :controller="indexDocumentRefrencesController"
            :params="indexDocumentRefrencesParams"
            :label="$t('Document_refrence')"
            id="DocumentRefrence"
            :placeholder="$t('select your Document_refrence')"
            @update:modelValue="setDocumentRefrences"
            :type="2"
            @close="DocumentRefrenceDialog = false"
            :isDialog="true"
            v-model:dialogVisible="DocumentRefrenceDialog"
          >
            <template #LabelHeader>
              <span class="add-dialog" @click="DocumentRefrenceDialog = true">{{ $t('New') }}</span>
            </template>
            <template #Dialog>
              <AddDocumentRefrence @close:data="DocumentRefrenceDialog = false" />
            </template>
          </UpdatedCustomInputSelect>
        </div> -->

        <div class="investigation-title">
          <img :src="investigationImg" alt="" />
          <p>Corrective and Preventive Actions</p>
        </div>
        <CapaActionPlan @update:data="setCapaActionPlan" />

        <div class="investigation-title">
          <img :src="investigationImg" alt="" />
          <p>Lessons Learned</p>
        </div>
        <section class="lesson-section">
          <div class="section-heading">
            <span>Lesson learnt</span>
            <h2>Capture the learning before it fades</h2>
          </div>
          <div class="input-wrapper">
            <textarea
              id="lesson_learnt"
              v-model="lessonLearnt"
              placeholder="Write the lesson learnt, what changed, and what should be shared with other teams."
            ></textarea>
          </div>
        </section>
        <!-- Similat Observatio -->
        <!-- title date serial only  -->
        <section class="similar-observations-section">
          <div class="section-heading">
            <span>Similar Incidents</span>
            <h2>Related from the same pattern</h2>
          </div>

          <div v-if="similarObservationsLoading" class="similar-observations-grid">
            <div v-for="item in 3" :key="item" class="similar-observation-card loading">
              <span></span>
              <strong></strong>
              <small></small>
            </div>
          </div>

          <div v-else-if="SimilarObservations?.length" class="similar-observations-grid">
            <article
              v-for="observation in SimilarObservations"
              :key="observation.id"
              class="similar-observation-card"
            >
              <span>#{{ observation.serialName || observation.serial || 'N/A' }}</span>
              <strong>{{ observation.title || 'Untitled observation' }}</strong>
              <small>{{ observation.date || 'N/A' }}</small>
            </article>
          </div>

          <p v-else class="similar-observations-empty">No similar observations found.</p>
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
        <!-- <div class="input-wrapper w-full reccomendation recommendation-panel">
          <label for="recommendation">{{ $t('recommendation action for capa') }}</label>
          <textarea
            id="recommendation"
            class="input"
            placeholder="add your recommendation for capa"
            v-model="recommendation"
            @input="updateRecommendation"
          ></textarea>
        </div> -->

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

.similar-observations-section {
  width: 100%;
  margin-top: 1rem;
  border: 1px solid var(--main-border);
  border-radius: 18px;
  background:
    radial-gradient(
      circle at 0% 0%,
      color-mix(in srgb, var(--PrimaryColor) 9%, transparent),
      transparent 34%
    ),
    var(--BgWhite);
  box-shadow: 0 8px 16px color-mix(in srgb, var(--Black) 10%, transparent);
  padding: 1.25rem;
}

.similar-observations-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.85rem;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.similar-observation-card {
  display: flex;
  min-height: 122px;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.6rem;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 12%, var(--main-border));
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    var(--BgWhite),
    color-mix(in srgb, var(--PrimaryColor) 5%, white)
  );
  padding: 1rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: color-mix(in srgb, var(--PrimaryColor) 30%, var(--main-border));
    box-shadow: 0 16px 30px color-mix(in srgb, var(--Black) 8%, transparent);
  }

  span {
    width: fit-content;
    border-radius: 999px;
    background: color-mix(in srgb, var(--PrimaryColor) 12%, white);
    color: var(--PrimaryColor);
    font-size: 0.75rem;
    font-weight: 900;
    padding: 0.35rem 0.7rem;
  }

  strong {
    color: var(--header-page-color);
    font-size: 1rem;
    font-weight: 900;
    line-height: 1.45;
  }

  small {
    color: var(--GrayText-1);
    font-size: 0.8rem;
    font-weight: 800;
  }

  &.loading {
    overflow: hidden;
    pointer-events: none;

    span,
    strong,
    small {
      display: block;
      border-radius: 999px;
      background: linear-gradient(90deg, #eef2f7, #f8fafc, #eef2f7);
      background-size: 220% 100%;
      color: transparent;
      animation: similarLoading 1.2s ease-in-out infinite;
    }

    span {
      width: 72px;
      height: 28px;
    }

    strong {
      width: 80%;
      height: 18px;
    }

    small {
      width: 44%;
      height: 14px;
    }
  }
}

.similar-observations-empty {
  margin: 0;
  border-radius: 14px;
  background: var(--Gray-1);
  color: var(--GrayText-1);
  font-weight: 800;
  padding: 1rem;
}

@keyframes similarLoading {
  0% {
    background-position: 120% 0;
  }

  100% {
    background-position: -120% 0;
  }
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
