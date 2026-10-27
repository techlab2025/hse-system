<script lang="ts" setup>
import { translate as localizeUi } from '@/localization/i18n'

import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { printInvestigationReport } from './printInvestigationReport'
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
import { Observation } from '../../../Core/Enums/ObservationTypeEnum.ts'

const { locale } = useI18n()
const reportContent = ref<HTMLElement | null>(null)
const printing = ref(false)
const printError = ref('')
const printReport = async () => {
  if (!reportContent.value || printing.value || similarObservationsLoading.value) return
  printing.value = true
  printError.value = ''
  try {
    await printInvestigationReport(
      reportContent.value,
      `Investigation report - ${investigationData.value?.serialName || id}`,
    )
  } catch {
    printError.value = localizeUi('Unable to prepare the report. Please try printing again.')
  } finally {
    printing.value = false
  }
}

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
const getObservationType = (type: number | undefined) => {
  switch (type) {
    case Observation.AccidentsType:
      return 'Incident'
    case Observation.HazardType:
      return 'Observation'
    case Observation.ObservationType:
      return 'Observation'
    default:
      return ''
  }
}
</script>
<template>
  <DataStatus :controller="state">
    <template #success>
      <div class="investigation-report-page" :dir="locale.startsWith('ar') ? 'rtl' : 'ltr'">
        <div class="report-toolbar" data-report-no-print>
          <div>
            <span class="report-eyebrow">{{ $t('HSE / INVESTIGATION') }}</span>
            <h1>{{ $t('Investigation results') }}</h1>
            <p>{{ $t('Findings, evidence and actions in one complete report.') }}</p>
          </div>
          <div class="report-print-actions">
            <button
              type="button"
              class="report-print-button"
              :disabled="printing || similarObservationsLoading"
              @click="printReport"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                aria-hidden="true"
              >
                <path d="M7 8V3h10v5M7 17H4V9h16v8h-3M7 14h10v7H7zM16 11h1" />
              </svg>
              {{
                printing
                  ? $t('Preparing report…')
                  : similarObservationsLoading
                    ? $t('Loading report…')
                    : $t('Print / Save PDF')
              }}
            </button>
            <small>{{ $t('Choose “Save as PDF” in the print dialog.') }}</small>
          </div>
        </div>
        <p v-if="printError" class="report-print-error" role="alert">{{ printError }}</p>
        <main ref="reportContent" class="investegation-result-answer-container" :lang="locale">
          <header class="investigation-report-cover">
            <div class="report-cover-intro">
              <span class="report-eyebrow">{{ $t('investigation_report') }}</span>
              <h2>{{ observation?.title || $t('Investigation findings') }}</h2>
              <p>
                {{
                  $t(
                    'A complete record of the incident, its causes and the actions to prevent recurrence.',
                  )
                }}
              </p>
              <div class="report-cover-meta">
                <div>
                  <span>{{ $t('Report reference') }}</span
                  ><strong>{{ investigationData?.serialName || `#${id}` }}</strong>
                </div>
                <div>
                  <span>{{ $t('Incident reference') }}</span
                  ><strong>{{ observation?.serial_name || observation?.serial || '—' }}</strong>
                </div>
                <div>
                  <span>{{ $t('Investigation date') }}</span
                  ><strong>{{
                    investigationData?.date || investigationData?.createdAt || '—'
                  }}</strong>
                </div>
                <div>
                  <span>{{ $t('Team Leader') }}</span
                  ><strong>{{ investigationData?.investigationTeamLeader?.name || '—' }}</strong>
                </div>
              </div>
            </div>
            <div class="report-summary">
              <div class="report-summary-item">
                <strong>{{ String(teamMembers.length).padStart(2, '0') }}</strong
                ><span>{{ $t('Team members') }}</span>
              </div>
              <div class="report-summary-item">
                <strong>{{ String(allTasks.length).padStart(2, '0') }}</strong
                ><span>{{ $t('Action items') }}</span>
              </div>
              <div class="report-summary-item">
                <strong>{{ String(meetings.length).padStart(2, '0') }}</strong
                ><span>{{ $t('meetings') }}</span>
              </div>
              <div class="report-summary-item">
                <strong>{{
                  String(investigationData?.investigationDocumentations?.length || 0).padStart(
                    2,
                    '0',
                  )
                }}</strong
                ><span>{{ $t('Evidence records') }}</span>
              </div>
            </div>
          </header>
          <section class="final-answer-section">
            <div class="final-section-heading">
              <span>01</span>
              <h2>{{ getObservationType(observation?.type) }} {{ $t('Identification') }}</h2>
            </div>
            <div class="answer-info-grid">
              <article>
                <span>{{ $t('incident Title') }}</span>
                <strong>{{ observation?.title || '-' }}</strong>
              </article>
              <article>
                <span>{{ $t('Incident reference') }}</span>
                <strong>{{
                  observation?.serial_name ||
                  observation?.serial ||
                  investigationData?.serialName ||
                  '-'
                }}</strong>
              </article>
              <article>
                <span>{{ $t('Investigation reference') }}</span>
                <strong>{{ state.data?.serialName ?? '-' }}</strong>
              </article>
              <article>
                <span>{{ $t('Incident type') }}</span>
                <strong>{{ getTitle(observation?.type_model) }}</strong>
              </article>
              <article>
                <span>{{ $t('Work Area / Facility') }}</span>
                <strong>{{ observation?.place || '-' }}</strong>
              </article>
              <article>
                <span>{{ $t('Equipment') }}</span>
                <strong>{{ getTitle(observation?.equipment) }}</strong>
              </article>
              <article>
                <span>{{ $t('Shift') }}</span>
                <strong>{{ getTitle(observation?.work_shift) }}</strong>
              </article>
            </div>
            <div v-if="incidentDescription" class="incident-description">
              <span>{{ $t('Incident description') }}</span>
              <p>{{ incidentDescription }}</p>
            </div>
          </section>

          <section class="final-answer-section">
            <div class="final-section-heading">
              <span>02</span>
              <h2>{{ $t('Investigation Team Setup') }}</h2>
            </div>
            <div class="answer-info-grid">
              <article>
                <span>{{ $t('Investigation team leader') }}</span>
                <strong>{{ investigationData?.investigationTeamLeader?.name || '-' }}</strong>
              </article>
              <article>
                <span>{{ $t('Team members') }}</span>
                <strong>{{ teamMembers.length }}</strong>
              </article>
              <!-- <article>
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
            </article> -->
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
                  <span>{{ member?.is_leader ? $t('team_leader') : $t('Team Member') }}</span>
                </div>
              </article>
            </div>
          </section>

          <section class="final-answer-section">
            <div class="final-section-heading">
              <span>03</span>
              <h2>{{ $t('Immediate Action Evaluation') }}</h2>
            </div>
            <div class="answer-info-grid">
              <article class="wide">
                <span>{{ $t('Immediate Action Retrieval') }}</span>
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
              <span>04</span>
              <h2>{{ $t('Witness statements') }}</h2>
            </div>
            <InvestegationResultViewersAnswer
              v-if="viewerResults.length > 0"
              :viewers="viewerResults"
            />
            <p v-else class="answer-empty">{{ $t('No witnesses statements were added.') }}</p>
          </section>

          <section class="final-answer-section">
            <div class="final-section-heading">
              <span>05</span>
              <h2>{{ $t('Sequence of events') }}</h2>
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
            <p v-else class="answer-empty">{{ $t('No timeline events were added.') }}</p>
          </section>

          <section class="final-answer-section">
            <div class="final-section-heading">
              <span>06</span>
              <h2>{{ $t('Health impact') }}</h2>
            </div>
            <div v-if="healthImpactItems.length" class="answer-card-grid">
              <article v-for="item in healthImpactItems" :key="`${item.impactType}-${item.id}`">
                <span> {{ item.impactType }}</span>
                <strong>{{ $t('name :') }} {{ getEmployeeName(item) }}</strong>
                <p>{{ $t('description :') }} {{ item.note || '-' }}</p>
                <small>{{ $t('injury type :') }} {{ getTitle(item.injury_type, '') }}</small>
              </article>
            </div>
            <p v-else class="answer-empty">{{ $t('No health impact records were added.') }}</p>
          </section>

          <section class="final-answer-section">
            <div class="final-section-heading">
              <span>07</span>
              <h2>{{ $t('Root Analysis (5 Whys)') }}</h2>
            </div>
            <div v-if="fiveWhyQuestions.length" class="answer-card-grid">
              <article v-for="question in fiveWhyQuestions" :key="question.id">
                <span>{{ $t('question') }}</span>
                <strong>{{ question.question || '-' }}</strong>
                <p>{{ question.answer || '-' }}</p>
              </article>
            </div>
            <p v-else class="answer-empty">{{ $t('No root analysis questions were added.') }}</p>
          </section>

          <section class="final-answer-section">
            <div class="final-section-heading">
              <span>08</span>
              <h2>{{ $t('Root Causes') }}</h2>
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
              <span>09</span>
              <h2>{{ $t('Corrective & preventive actions') }}</h2>
            </div>
            <InvestegationResultTasksAnswer
              v-if="hasActionPlan"
              :correctiveTasks="correctiveTasks"
              :preventiveTasks="preventiveTasks"
              :tasks="legacyTasks"
              @answered="GetInvestegationDetails"
            />
            <p v-else class="answer-empty">{{ $t('No CAPA actions were added.') }}</p>
          </section>

          <section class="final-answer-section">
            <div class="final-section-heading">
              <span>10</span>
              <h2>{{ $t('Lessons Learned') }}</h2>
            </div>
            <p class="answer-note">{{ lessonLearnt || $t('No lesson learnt was added.') }}</p>
            <p v-if="recommendation" class="answer-note subtle">{{ recommendation }}</p>
          </section>

          <section class="final-answer-section">
            <div class="final-section-heading">
              <span>11</span>
              <h2>{{ $t('Related incidents') }}</h2>
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
                  <strong>{{ observation.title || $t('Untitled observation') }}</strong>
                  <small>{{ observation.date || 'N/A' }}</small>
                </article>
              </div>

              <p v-else class="similar-observations-empty">
                {{ $t('No similar incidents found.') }}
              </p>
            </section>
            <!-- </p> -->
          </section>

          <section class="final-answer-section">
            <div class="final-section-heading">
              <span>12</span>
              <h2>{{ $t('Attachments') }}</h2>
            </div>
            <InvestegationResultAttachmentAnswer
              v-if="state.data?.investigationDocumentations?.length > 0"
              :attachments="state.data?.investigationDocumentations"
            />
            <p v-else class="answer-empty">{{ $t('No attachments were added.') }}</p>
          </section>

          <section class="final-answer-section">
            <div class="final-section-heading">
              <span>13</span>
              <h2>{{ $t('Investigation Meetings') }}</h2>
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
            <p v-else class="answer-empty">{{ $t('No investigation meetings were added.') }}</p>
          </section>
          <footer class="report-footer">
            <strong>{{ $t('HSE · Investigation report') }}</strong>
            <span>{{ investigationData?.serialName || `#${id}` }} {{ $t('· End of report') }}</span>
          </footer>
        </main>
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
        :addText="$t('Add Hazard')"
        :description="
          $t(
            'You have no Hazard .. All your joined customers will appear here when you add your customer data',
          )
        "
        :title="$t('You have No Hazard')"
      />
    </template>
    <template #failed>
      <DataFailed
        :link="`/organization/hazard/add`"
        :addText="$t('Add Hazard')"
        :description="
          $t(
            'You have no Hazard .. All your joined customers will appear here when you add your customer data',
          )
        "
        :title="$t('You have No Hazard')"
      />
    </template>

    <template #notPermitted>
      <DataFailed
        :addText="$t('auditUi.you_do_not_have_permission')"
        :description="
          $t(
            'You have no Hazard .. All your joined customers will appear here when you add your customer data',
          )
        "
      />
    </template>
  </DataStatus>
</template>

<style scoped>
.investigation-report-page {
  max-width: 1120px;
  margin: 0 auto;
  padding: 8px 0 28px;
  --brand-primary-900: var(--text-strong, #18324a);
}
.report-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 10px 0 26px;
}
.report-eyebrow {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.16em;
  color: var(--brand-primary-500, #245d88);
}
.report-toolbar h1 {
  margin: 8px 0 6px;
  font-size: clamp(23px, 3vw, 30px);
  letter-spacing: -0.035em;
  color: var(--text-strong, #18324a);
  font-weight: 750;
}
.report-toolbar p {
  margin: 0;
  color: var(--text-soft, #61758a);
  font-size: 13px;
  line-height: 1.6;
}
.report-print-actions {
  display: grid;
  gap: 8px;
  flex-shrink: 0;
}
.report-print-actions small {
  color: var(--text-soft, #61758a);
  font-size: 10px;
  text-align: center;
}
.report-print-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 0;
  border-radius: 11px;
  background: var(--brand-primary-500, #245d88);
  color: #fff;
  padding: 13px 20px;
  font: inherit;
  font-size: 13px;
  font-weight: 750;
  cursor: pointer;
}
.report-print-button svg {
  width: 20px;
  height: 20px;
}
.report-print-button:hover:not(:disabled) {
  filter: brightness(0.94);
}
.report-print-button:focus-visible {
  outline: 3px solid var(--brand-primary-400, #56768f);
  outline-offset: 3px;
}
.report-print-button:disabled {
  cursor: wait;
  opacity: 0.6;
}
.report-print-error {
  padding: 14px;
  border-radius: 10px;
  color: var(--status-danger, #ad3744);
  background: var(--status-danger-soft, #fff0f1);
}
.investigation-report-cover {
  overflow: hidden;
  border-radius: 20px;
  border: 1px solid var(--brand-primary-100, #dce6ef);
}
.report-cover-intro {
  padding: clamp(24px, 4vw, 40px);
  background: linear-gradient(120deg, #142e46, #245d76);
  border-inline-start: 5px solid #58c5b0;
  color: #fff;
}
.report-cover-intro .report-eyebrow {
  color: #b6e8df;
}
.report-cover-intro h2 {
  margin: 14px 0 10px;
  color: #fff;
  font-size: clamp(24px, 3vw, 34px);
  font-weight: 750;
  line-height: 1.25;
  letter-spacing: -0.025em;
  overflow-wrap: anywhere;
}
.report-cover-intro > p {
  max-width: 580px;
  margin: 0;
  color: #d6e6ef;
  font-size: 13px;
  line-height: 1.7;
}
.report-cover-meta {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  margin-top: 28px;
  padding-top: 22px;
  border-top: 1px solid #ffffff30;
}
.report-cover-meta div {
  display: grid;
  align-content: start;
  gap: 6px;
  min-width: 0;
}
.report-cover-meta span {
  color: #bed3df;
  font-size: 11px;
}
.report-cover-meta strong {
  color: white;
  font-size: 13px;
  font-weight: 650;
  overflow-wrap: anywhere;
}
.report-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  background: var(--surface-1, #fff);
  padding: 22px 12px;
}
.report-summary-item {
  display: grid;
  gap: 5px;
  text-align: center;
  padding: 0 12px;
}
.report-summary-item + .report-summary-item {
  border-inline-start: 1px solid var(--brand-primary-100, #dce6ef);
}
.report-summary-item strong {
  color: var(--brand-primary-900, #18324a);
  font-size: 25px;
  font-weight: 750;
}
.report-summary-item span {
  color: var(--text-soft, #61758a);
  font-size: 11px;
}
.incident-description {
  margin-top: 14px;
  padding: 16px;
  border-inline-start: 3px solid var(--brand-primary-500, #245d88);
  background: var(--brand-primary-50, #f1f6fb);
  border-radius: 8px;
}
.incident-description > span {
  color: var(--text-soft, #61758a);
  font-size: 11px;
  font-weight: 750;
}
.incident-description p {
  margin: 8px 0 0;
  color: var(--brand-primary-900, #18324a);
  font-size: 13px;
  line-height: 1.8;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.answer-note,
.answer-timeline p,
.answer-card-grid p,
.answer-info-grid strong {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.report-footer {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 4px 0;
  border-top: 1px solid var(--brand-primary-100, #dce6ef);
  font-size: 11px;
  color: var(--text-soft, #61758a);
}
@media (max-width: 640px) {
  .report-toolbar {
    align-items: stretch;
    flex-direction: column;
    gap: 18px;
  }
  .report-cover-meta {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }
  .report-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px 0;
  }
  .report-summary-item:nth-child(3) {
    border-inline-start: 0;
  }
  .report-footer {
    flex-direction: column;
    gap: 6px;
  }
}

.investegation-result-answer-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 18px;
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.investigation-report-page :deep(*) {
  text-transform: none;
}

.investegation-result-answer-container :deep(.attachments-answer .content) {
  grid-template-columns: 1fr;
}

.investegation-result-answer-container :deep(.investegaion-attachment-card-media),
.investegation-result-answer-container :deep(.meeting-overview-answer .content) {
  grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr));
}

.investegation-result-answer-container :deep(.investegaion-attachment-card .evidence-item img) {
  aspect-ratio: auto;
  object-fit: contain;
}

.investegation-result-answer-container :deep(.meeting-note) {
  display: block;
  -webkit-line-clamp: unset;
  white-space: pre-wrap;
}

.investegation-result-answer-container :deep(.investegaion-meeting-card) {
  align-items: stretch;
}

.final-answer-section {
  width: 100%;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  padding: 18px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 90%, transparent);
  border-radius: 18px;
  background: var(--surface-1, #fff);
  box-shadow: 0 4px 18px color-mix(in srgb, var(--brand-primary-900) 3%, transparent);
}

.final-answer-section::before {
  position: absolute;
  inset-inline-start: 0;
  top: 0;
  bottom: 0;
  width: 5px;
  content: '';
  background: linear-gradient(180deg, var(--brand-primary-500), var(--status-success));
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
  color: var(--brand-primary-500);
  font-size: 12px;
  font-weight: 900;
  background: color-mix(in srgb, var(--brand-primary-500) 10%, transparent);
}

.final-section-heading h2 {
  margin: 0;
  color: var(--brand-primary-900);
  font-size: 18px;
  font-weight: 750;
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
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 86%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, var(--surface-1) 88%, transparent);
  box-shadow: 0 10px 20px color-mix(in srgb, var(--brand-primary-900) 4%, transparent);
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
  color: var(--text-soft);
  font-size: 12px;
  font-weight: 700;
}

.answer-info-grid strong,
.answer-card-grid strong {
  color: var(--brand-primary-900);
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
  color: var(--brand-primary-600);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.7;
}

.answer-card-grid small {
  color: var(--brand-primary-500);
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
  color: var(--brand-primary-900);
  font-size: 14px;
  font-weight: 900;
}

.answer-person-grid span {
  color: var(--text-soft);
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
  color: var(--text-on-brand);
  font-weight: 900;
  background: var(--brand-primary-500);
}

.answer-timeline strong {
  color: var(--brand-primary-900);
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
  color: var(--brand-primary-500);
  font-size: 12px;
  font-weight: 900;
  background: color-mix(in srgb, var(--brand-primary-500) 10%, transparent);
}

.answer-note {
  padding: 14px;
  border-radius: 14px;
  background: color-mix(in srgb, var(--brand-primary-500) 6%, transparent);
}

.answer-note.subtle {
  margin-top: 10px;
  background: color-mix(in srgb, var(--status-success) 8%, transparent);
}

.answer-empty {
  padding: 14px;
  border: 1px dashed color-mix(in srgb, var(--brand-primary-500) 22%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, var(--brand-primary-500) 4%, transparent);
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
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 88%, transparent);
  border-radius: 16px;
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--surface-1) 96%, transparent),
      color-mix(in srgb, var(--brand-primary-50) 92%, transparent)
    ),
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--brand-primary-500) 7%, transparent),
      color-mix(in srgb, var(--status-success) 5%, transparent)
    );
  box-shadow: 0 14px 28px color-mix(in srgb, var(--brand-primary-900) 6%, transparent);
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
  background: linear-gradient(180deg, var(--brand-primary-500), var(--status-success));
}

.similar-observation-card::after {
  position: absolute;
  inset-inline-end: -28px;
  top: -28px;
  width: 86px;
  height: 86px;
  border-radius: 50%;
  content: '';
  background: color-mix(in srgb, var(--brand-primary-500) 6%, transparent);
}

.similar-observation-card:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--brand-primary-500) 24%, transparent);
  box-shadow: 0 18px 34px color-mix(in srgb, var(--brand-primary-900) 9%, transparent);
}

.similar-observation-card span {
  position: relative;
  z-index: 1;
  width: fit-content;
  max-width: 100%;
  padding: 7px 10px;
  border-radius: 999px;
  color: var(--brand-primary-500);
  font-size: 12px;
  font-weight: 900;
  background: color-mix(in srgb, var(--brand-primary-500) 10%, transparent);
  overflow-wrap: anywhere;
}

.similar-observation-card strong {
  position: relative;
  z-index: 1;
  color: var(--brand-primary-900);
  font-size: 15px;
  font-weight: 900;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.similar-observation-card small {
  position: relative;
  z-index: 1;
  color: var(--text-soft);
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
  background: color-mix(in srgb, var(--brand-primary-100) 90%, transparent);
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
    transparent,
    color-mix(in srgb, var(--surface-1) 72%, transparent),
    transparent
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
  border: 1px dashed color-mix(in srgb, var(--brand-primary-500) 24%, transparent);
  border-radius: 16px;
  color: var(--brand-primary-500);
  font-size: 14px;
  font-weight: 800;
  text-align: center;
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--brand-primary-500) 4.5%, transparent),
      color-mix(in srgb, var(--status-success) 4.5%, transparent)
    ),
    color-mix(in srgb, var(--surface-1) 78%, transparent);
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
