<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import InvestigatingResultAnswerHedaer from './InvestegationResultAnswerParts/InvestigatingResultAnswerHedaer.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import CauseOfAccidantAnswer from './InvestegationResultAnswerParts/CauseOfAccidantAnswer.vue'
import MeetingOverviewAnswer from './InvestegationResultAnswerParts/MeetingOverviewAnswer.vue'
import InvestegationResultTasksAnswer from './InvestegationResultAnswerParts/InvestegationResultTasksAnswer.vue'
import InvestegationResultTakeActionAnswer from './InvestegationResultAnswerParts/InvestegationResultTakeActionAnswer.vue'
import InvestegationResultAttachmentAnswer from './InvestegationResultAnswerParts/InvestegationResultAttachmentAnswer.vue'
import InvestegationResultViewersAnswer from './InvestegationResultAnswerParts/InvestegationResultViewersAnswer.vue'
import ShowInvestigatingController from '../../controllers/showInvestigatingController'
import ShowInvestigatingParams from '../../../Core/params/showInvestigatingParams'
import { useRoute, useRouter } from 'vue-router'
import SimilarObservationController from '../../controllers/similarObservation/SimilarObservationController.ts'
import type HazardDetailsModel from '@/features/Organization/ObservationFactory/Data/models/hazardDetailsModel.ts'
import SimilarObservatioParams from '../../../Core/params/SimilarObservation/SimilarObservatioParams.ts'

const route = useRoute()
const id = route.params.id
const showInvestigatingController = ShowInvestigatingController.getInstance()
const state = ref(showInvestigatingController.state.value)
const investigationData = computed(() => state.value?.data as any)
const observation = computed(() => investigationData.value?.observation ?? {})
const teamMembers = computed(() => investigationData.value?.investigationEmployees ?? [])
const meetings = computed(() => investigationData.value?.investigationMeetings ?? [])
const rootCauses = computed(
  () =>
    investigationData.value?.rootCauses ?? investigationData.value?.observation?.root_causes ?? [],
)
const fiveWhyQuestions = computed(
  () =>
    investigationData.value?.questions ??
    investigationData.value?.fiveWhyQuestions ??
    investigationData.value?.five_why_questions ??
    [],
)
const eventTimelines = computed(
  () => investigationData.value?.eventTimelines ?? investigationData.value?.event_timelines ?? [],
)
const injuries = computed(
  () => investigationData.value?.injuries ?? investigationData.value?.observation?.injuries ?? [],
)
const deaths = computed(
  () => investigationData.value?.deaths ?? investigationData.value?.observation?.deaths ?? [],
)
const healthImpactItems = computed(() => [
  ...injuries.value.map((item: any) => ({ ...item, impactType: 'Injury' })),
  ...deaths.value.map((item: any) => ({ ...item, impactType: 'Death' })),
])

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
const hasImmediateAction = computed(
  () =>
    Boolean(investigationData.value?.explainWhyText) ||
    investigationData.value?.isActionCorrect !== undefined,
)
const hasActionPlan = computed(
  () =>
    correctiveTasks.value.length > 0 ||
    preventiveTasks.value.length > 0 ||
    legacyTasks.value.length > 0,
)
const latestMeeting = computed(() =>
  meetings.value.length ? meetings.value[meetings.value.length - 1] : null,
)
const nextMeetingDate = computed(
  () =>
    investigationData.value?.investigationNextMeetingDate ??
    investigationData.value?.investigation_next_meeting_date ??
    investigationData.value?.investigation?.next_meeting_date ??
    '',
)
const nextMeetingTime = computed(
  () =>
    investigationData.value?.investigationNextMeetingTime ??
    investigationData.value?.investigation_next_meeting_time ??
    investigationData.value?.investigation?.next_meeting_time ??
    '',
)
const lessonLearnt = computed(
  () => investigationData.value?.lessonLearnt ?? investigationData.value?.lesson_learnt ?? '',
)
const recommendation = computed(() => investigationData.value?.recommendation ?? '')
const incidentDescription = computed(
  () =>
    investigationData.value?.incidentDescription ??
    investigationData.value?.incidant_description ??
    observation.value?.description ??
    '',
)

const getTitle = (item: any, fallback = '-') => {
  if (!item) return fallback
  if (typeof item === 'string' || typeof item === 'number') return String(item)
  if (item.title || item.name || item.serial_name || item.serialName) {
    return item.title ?? item.name ?? item.serial_name ?? item.serialName
  }

  const titles = item.titles ?? item.titleLocales ?? []
  return titles.find((title: any) => title.locale === 'en')?.title ?? titles[0]?.title ?? fallback
}

const getEmployeeName = (item: any) =>
  item?.organization_employee?.name ??
  item?.organizationEmployee?.name ??
  item?.employee_name ??
  item?.name ??
  '-'

const formatBoolean = (value: any) => {
  if (value === true || value === 1) return 'Yes'
  if (value === false || value === 0) return 'No'
  return '-'
}

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

const router = useRouter()
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
      pageNumber: 1,
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
      <div class="investegation-result-answer-container">
        <!-- <InvestigatingResultAnswerHedaer
          :meetingsNumber="meetings.length"
          :victim="observation?.observer?.name"
          :date="investigationData?.createdAt"
          :meetingDate="latestMeeting?.date"
          :TeamLeader="investigationData?.investigationTeamLeader"
          :createdAt="investigationData?.date"
          :TeamNumbers="teamMembers.length"
          :solvedTasks="solvedTasks"
          :ToltalTasks="allTasks.length"
          :investegationType="observation?.type"
        /> -->

        <section class="final-answer-section">
          <div class="final-section-heading">
            <span>01</span>
            <h2>General Identification</h2>
          </div>
          <div class="answer-info-grid">
            <article>
              <span>incident title</span>
              <strong>{{ observation?.title || '-' }}</strong>
            </article>
            <article>
              <span>incident Serial</span>
              <strong>{{
                observation?.serial_name ||
                observation?.serial ||
                investigationData?.serialName ||
                '-'
              }}</strong>
            </article>
            <article>
              <span>Investigation Serial</span>
              <strong>{{
                state.data?.serialName ??
                '-'
              }}</strong>
            </article>
            <article>
              <span>Incident type</span>
              <strong>{{ getTitle(observation?.type_model) }}</strong>
            </article>
            <article>
              <span>Place</span>
              <strong>{{ observation?.place || '-' }}</strong>
            </article>
            <article>
              <span>Equipment</span>
              <strong>{{ getTitle(observation?.equipment) }}</strong>
            </article>
            <article>
              <span>Shift</span>
              <strong>{{ getTitle(observation?.work_shift) }}</strong>
            </article>
          </div>
        </section>

        <section class="final-answer-section">
          <div class="final-section-heading">
            <span>02</span>
            <h2>Investigation Team Setup</h2>
          </div>
          <div class="answer-info-grid">
            <article>
              <span>Investigation team leader</span>
              <strong>{{ investigationData?.investigationTeamLeader?.name || '-' }}</strong>
            </article>
            <article>
              <span>Team members</span>
              <strong>{{ teamMembers.length }}</strong>
            </article>
            <article>
              <span>Meeting date</span>
              <strong>{{
                investigationData?.investigationMeetingDate || latestMeeting?.date || '-'
              }}</strong>
            </article>
            <article>
              <span>Meeting time</span>
              <strong>{{
                investigationData?.investigationMeetingTime || latestMeeting?.time || '-'
              }}</strong>
            </article>
          </div>
          <div v-if="teamMembers.length" class="answer-person-grid">
            <article v-for="member in teamMembers" :key="member.id">
              <img
                :src="
                  member?.organizationEmployee?.image ||
                  member?.organization_employee?.image ||
                  'https://cyber.comolho.com/static/img/avatar.png'
                "
                alt=""
              />
              <div>
                <strong>{{
                  getEmployeeName(
                    member?.organizationEmployee ?? member?.organization_employee ?? member,
                  )
                }}</strong>
                <span>{{ member?.is_leader ? 'Team leader' : 'Team member' }}</span>
              </div>
            </article>
          </div>
        </section>

        <section class="final-answer-section">
          <div class="final-section-heading">
            <span>03</span>
            <h2>Events Timeline Builder</h2>
          </div>
          <div class="answer-timeline" v-if="eventTimelines.length">
            <article v-for="(event, index) in eventTimelines" :key="index">
              <span>{{ index + 1 }}</span>
              <div>
                <strong>{{ event.time || event.event_time || '-' }}</strong>
                <p>{{ event.description || event.event_description || '-' }}</p>
              </div>
            </article>
          </div>
          <!-- <p v-else class="answer-empty">
            {{ incidentDescription || 'No timeline events were added.' }}
          </p> -->
        </section>

        <section class="final-answer-section">
          <div class="final-section-heading">
            <span>04</span>
            <h2>Health Impact Integration</h2>
          </div>
          <div v-if="healthImpactItems.length" class="answer-card-grid">
            <article v-for="item in healthImpactItems" :key="`${item.impactType}-${item.id}`">
              <span>{{ item.impactType }}</span>
              <strong>{{ getEmployeeName(item) }}</strong>
              <p>{{ item.note || '-' }}</p>
              <small>{{ getTitle(item.injury_type, '') }}</small>
            </article>
          </div>
          <p v-else class="answer-empty">No health impact records were added.</p>
        </section>

        <section class="final-answer-section">
          <div class="final-section-heading">
            <span>05</span>
            <h2>Witness Management</h2>
          </div>
          <InvestegationResultViewersAnswer
            v-if="viewerResults.length > 0"
            :viewers="viewerResults"
          />
          <p v-else class="answer-empty">No witness statements were added.</p>
        </section>

        <section class="final-answer-section">
          <div class="final-section-heading">
            <span>06</span>
            <h2>Immediate Action Evaluation</h2>
          </div>
          <div class="answer-info-grid">
            <article class="wide">
              <span>Immediate Action Retrieval</span>
              <strong>{{ observation?.action || '-' }}</strong>
            </article>
            <!-- <article>
              <span>Action correct</span>
              <strong>{{ formatBoolean(investigationData?.isActionCorrect) }}</strong>
            </article> -->
            <!-- <article class="wide">
              <span>Notes</span>
              <strong>{{ investigationData?.explainWhyText || '-' }}</strong>
            </article> -->
          </div>
          <InvestegationResultTakeActionAnswer
            v-if="hasImmediateAction"
            :actions="investigationData?.explainWhyText"
            :isCorrect="investigationData?.isActionCorrect"
          />
        </section>

        <section class="final-answer-section">
          <div class="final-section-heading">
            <span>07</span>
            <h2>Root Cause Analysis (5 Whys)</h2>
          </div>
          <div v-if="fiveWhyQuestions.length" class="answer-card-grid">
            <article v-for="question in fiveWhyQuestions" :key="question.id">
              <span>Question</span>
              <strong>{{ question.question || '-' }}</strong>
              <p>{{ question.answer || '-' }}</p>
            </article>
          </div>
          <div v-if="rootCauses.length" class="answer-tags">
            <span v-for="rootCause in rootCauses" :key="rootCause.id">{{
              getTitle(rootCause)
            }}</span>
          </div>
          <CauseOfAccidantAnswer
            v-if="state.data?.investigationFactors?.length > 0"
            class="w-full"
            :Factors="state.data?.investigationFactors"
          />
        </section>

        <section class="final-answer-section">
          <div class="final-section-heading">
            <span>08</span>
            <h2>Action Plan : Corrective and Preventive Actions</h2>
          </div>
          <InvestegationResultTasksAnswer
            v-if="hasActionPlan"
            :correctiveTasks="correctiveTasks"
            :preventiveTasks="preventiveTasks"
            :tasks="legacyTasks"
            @answered="GetInvestegationDetails"
          />
          <p v-else class="answer-empty">No CAPA actions were added.</p>
        </section>

        <section class="final-answer-section">
          <div class="final-section-heading">
            <span>09</span>
            <h2>Lessons Learned</h2>
          </div>
          <p class="answer-note">{{ lessonLearnt || 'No lesson learnt was added.' }}</p>
          <p v-if="recommendation" class="answer-note subtle">{{ recommendation }}</p>
        </section>

        <section class="final-answer-section">
          <div class="final-section-heading">
            <span>10</span>
            <h2>Similar incident Retrieval</h2>
          </div>
          <!-- <p class="answer-empty"> -->
          <section class="similar-observations-section">
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

            <p v-else class="similar-observations-empty">No similar incidents found.</p>
          </section>
          <!-- </p> -->
        </section>

        <section class="final-answer-section">
          <div class="final-section-heading">
            <span>11</span>
            <h2>Attachments</h2>
          </div>
          <InvestegationResultAttachmentAnswer
            v-if="state.data?.investigationDocumentations?.length > 0"
            :attachments="state.data?.investigationDocumentations"
          />
          <p v-else class="answer-empty">No attachments were added.</p>
        </section>

        <section class="final-answer-section">
          <div class="final-section-heading">
            <span>12</span>
            <h2>Another Meeting</h2>
          </div>
          <!-- <div class="answer-info-grid"> -->
          <!-- <article>
              <span>Next meeting date</span>
              <strong>{{ nextMeetingDate || '-' }}</strong>
            </article>
            <article>
              <span>Next meeting time</span>
              <strong>{{ nextMeetingTime || '-' }}</strong>
            </article> -->
          <!-- </div> -->
          <MeetingOverviewAnswer v-if="meetings.length > 0" :meetings="meetings" />
        </section>
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

<style scoped>
.investegation-result-answer-container {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.final-answer-section {
  width: 100% !important;
  position: relative;
  overflow: hidden;
  padding: 18px;
  border: 1px solid rgba(221, 226, 237, 0.9);
  border-radius: 18px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(249, 251, 255, 0.94)),
    linear-gradient(90deg, rgba(29, 78, 216, 0.05), rgba(74, 174, 58, 0.05));
  box-shadow: 0 18px 38px rgba(15, 25, 39, 0.06);
}

.final-answer-section::before {
  position: absolute;
  inset-inline-start: 0;
  top: 0;
  bottom: 0;
  width: 5px;
  content: '';
  background: linear-gradient(180deg, #1d4ed8, #4aae3a);
}

.final-section-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.final-section-heading span {
  display: inline-grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 10px;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 900;
  background: rgba(29, 78, 216, 0.1);
}

.final-section-heading h2 {
  margin: 0;
  color: #0f1927;
  font-size: 18px;
  font-weight: 900;
}

.answer-info-grid,
.answer-card-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.answer-info-grid article,
.answer-card-grid article,
.answer-person-grid article,
.answer-timeline article {
  border: 1px solid rgba(221, 226, 237, 0.86);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 10px 20px rgba(15, 25, 39, 0.04);
}

.answer-info-grid article,
.answer-card-grid article {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 6px;
  padding: 14px;
}

.answer-info-grid article.wide {
  grid-column: 1 / -1;
}

.answer-info-grid span,
.answer-card-grid span {
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
}

.answer-info-grid strong,
.answer-card-grid strong {
  color: #0f1927;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.answer-card-grid p,
.answer-timeline p,
.answer-note,
.answer-empty {
  margin: 0;
  color: #4b5563;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.7;
}

.answer-card-grid small {
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 800;
}

.answer-person-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  margin-top: 12px;
}

.answer-person-grid article {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
}

.answer-person-grid img {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
}

.answer-person-grid strong {
  display: block;
  color: #0f1927;
  font-size: 14px;
  font-weight: 900;
}

.answer-person-grid span {
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
}

.answer-timeline {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.answer-timeline article {
  display: grid;
  grid-template-columns: 36px 1fr;
  gap: 12px;
  padding: 12px;
}

.answer-timeline article > span {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  font-weight: 900;
  background: #1d4ed8;
}

.answer-timeline strong {
  color: #0f1927;
  font-weight: 900;
}

.answer-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
}

.answer-tags span {
  padding: 8px 12px;
  border-radius: 999px;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 900;
  background: rgba(29, 78, 216, 0.1);
}

.answer-note {
  padding: 14px;
  border-radius: 14px;
  background: rgba(29, 78, 216, 0.06);
}

.answer-note.subtle {
  margin-top: 10px;
  background: rgba(74, 174, 58, 0.08);
}

.answer-empty {
  padding: 14px;
  border: 1px dashed rgba(29, 78, 216, 0.22);
  border-radius: 14px;
  background: rgba(29, 78, 216, 0.04);
}

.similar-observations-section {
  position: relative;
  min-height: 120px;
}

.similar-observations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.similar-observation-card {
  position: relative;
  display: flex;
  min-height: 128px;
  min-width: 0;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  overflow: hidden;
  padding: 16px;
  border: 1px solid rgba(221, 226, 237, 0.88);
  border-radius: 16px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(247, 250, 255, 0.92)),
    linear-gradient(180deg, rgba(29, 78, 216, 0.07), rgba(74, 174, 58, 0.05));
  box-shadow: 0 14px 28px rgba(15, 25, 39, 0.06);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.similar-observation-card::before {
  position: absolute;
  inset-inline-start: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  content: '';
  background: linear-gradient(180deg, #1d4ed8, #4aae3a);
}

.similar-observation-card::after {
  position: absolute;
  inset-inline-end: -28px;
  top: -28px;
  width: 86px;
  height: 86px;
  border-radius: 50%;
  content: '';
  background: rgba(29, 78, 216, 0.06);
}

.similar-observation-card:hover {
  transform: translateY(-2px);
  border-color: rgba(29, 78, 216, 0.24);
  box-shadow: 0 18px 34px rgba(15, 25, 39, 0.09);
}

.similar-observation-card span {
  position: relative;
  z-index: 1;
  width: fit-content;
  max-width: 100%;
  padding: 7px 10px;
  border-radius: 999px;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 900;
  background: rgba(29, 78, 216, 0.1);
  overflow-wrap: anywhere;
}

.similar-observation-card strong {
  position: relative;
  z-index: 1;
  color: #0f1927;
  font-size: 15px;
  font-weight: 900;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.similar-observation-card small {
  position: relative;
  z-index: 1;
  color: #6b7280;
  font-size: 12px;
  font-weight: 800;
}

.similar-observation-card.loading {
  pointer-events: none;
}

.similar-observation-card.loading span,
.similar-observation-card.loading strong,
.similar-observation-card.loading small {
  position: relative;
  overflow: hidden;
  color: transparent;
  background: rgba(229, 235, 246, 0.9);
}

.similar-observation-card.loading span {
  width: 82px;
  height: 28px;
}

.similar-observation-card.loading strong {
  width: 100%;
  height: 22px;
  border-radius: 8px;
}

.similar-observation-card.loading small {
  width: 46%;
  height: 16px;
  border-radius: 8px;
}

.similar-observation-card.loading span::after,
.similar-observation-card.loading strong::after,
.similar-observation-card.loading small::after {
  position: absolute;
  inset: 0;
  content: '';
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.72),
    rgba(255, 255, 255, 0)
  );
  animation: similarCardLoading 1.25s ease-in-out infinite;
}

.similar-observations-empty {
  display: flex;
  min-height: 104px;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 18px;
  border: 1px dashed rgba(29, 78, 216, 0.24);
  border-radius: 16px;
  color: #64748b;
  font-size: 14px;
  font-weight: 800;
  text-align: center;
  background:
    linear-gradient(135deg, rgba(29, 78, 216, 0.045), rgba(74, 174, 58, 0.045)),
    rgba(255, 255, 255, 0.78);
}

@keyframes similarCardLoading {
  100% {
    transform: translateX(100%);
  }
}

.final-answer-section :deep(.header) {
  margin-top: 0;
}

.final-answer-section :deep(.section-header-page-container) {
  display: none;
}

@media (max-width: 768px) {
  .final-answer-section {
    padding: 14px;
    border-radius: 16px;
  }

  .answer-info-grid,
  .answer-card-grid {
    grid-template-columns: 1fr;
  }

  .final-section-heading h2 {
    font-size: 15px;
  }

  .similar-observations-grid {
    grid-template-columns: 1fr;
  }

  .similar-observation-card {
    min-height: 116px;
    padding: 14px;
  }
}
</style>
