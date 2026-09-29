<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import defaultLogo from '@/assets/images/logo.svg'
import { useSystemIdentity } from '@/composables/useSystemIdentity'
import ShowProjectSummaryDetailsParams from '../../../Core/params/ShowProjectSummaryDetailsParams'
import ShowProjectSummaryDetailsController from '../../controllers/ShowProjectSummaryDetailsController'
import LossTimeMatrix from './LossTime/LossTimeMatrix.vue'

const route = useRoute()
const showProjectSummaryDetailsController = ShowProjectSummaryDetailsController.getInstance()
const state = showProjectSummaryDetailsController.state
const { identity: systemIdentity, defaultIdentity } = useSystemIdentity()

const projectId = computed(() => Number(route.params.id))
const project = computed(() => state.value.data)
const activeIdentity = computed(() =>
  systemIdentity.value.isActive ? systemIdentity.value : defaultIdentity.value,
)
const brandName = computed(() => activeIdentity.value.name || 'HSE.Cloud.Ai')
const brandLogo = computed(() => activeIdentity.value.logo || defaultLogo)
const summaryIdentityStyle = computed(() => ({
  '--summary-primary': activeIdentity.value.primaryColor,
  '--summary-secondary': activeIdentity.value.secondaryColor,
  '--summary-accent': activeIdentity.value.accentColor,
}))
const getProjectSummaryDetails = async () => {
  if (!Number.isFinite(projectId.value) || projectId.value <= 0) return

  const params = new ShowProjectSummaryDetailsParams(projectId.value)
  try {
    await showProjectSummaryDetailsController.showProjectSummaryDetails(params)
  } catch (error) {
    console.error('Unable to refresh project summary', error)
  }
}

const meetingStatistics = computed(() => {
  return {
    withResults: project.value?.meetingsWithResultsCount ?? 0,
    total: project.value?.meetingsCount ?? 0,
  }
})

const safetyStatistics = computed(() => [
  {
    label: 'Observations',
    value: project.value?.observationsCount ?? 0,
    note: ` `,
    tone: 'teal',
    icon: 'O',
    to: `/organization/equipment-mangement/observation?isAll=1&type=2&project_id=${projectId.value}`,
  },
  {
    label: 'Incidents',
    value: project.value?.incidentsCount ?? 0,
    note: 'Reported project incidents',
    tone: 'red',
    icon: '!',
    to: `/organization/equipment-mangement/incedant?isAll=1&project_id=${projectId.value}`,
  },
  {
    label: 'Investigations',
    value: project.value?.investigationsCount ?? 0,
    note: 'Investigation records',
    tone: 'amber',
    icon: 'I',
    to: `/organization/Investigating?project_id=${projectId.value}`,
  },
  {
    label: 'Inspections',
    value: project.value?.inspectionsCount ?? 0,
    note: 'Completed and active checks',
    tone: 'blue',
    icon: '✓',
    to: `/organization/equipment-mangement/inspection?inspectionType=1&project_id=${projectId.value}`,
  },
  {
    label: 'drills',
    value: `${project.value?.drillsCount || 0} / ${project.value?.totalDrillCount || 0} `,
    note: 'Preparedness exercises',
    tone: 'violet',
    icon: 'D',
    to: `/organization/project-summary/${projectId.value}/data/drills`,
  },
  {
    label: 'Meetings',
    value: `${meetingStatistics.value.withResults} / ${meetingStatistics.value.total}`,
    note: 'With results / total meetings',
    tone: 'navy',
    icon: 'M',
    to: `/organization/project-summary/${projectId.value}/data/meetings`,
  },
])

const operationalStatistics = computed(() => [
  {
    label: 'Employees',
    value: project.value?.assignedEmployeesCount ?? 0,
    to: `/organization/project-summary/${projectId.value}/data/employees`,
  },
  {
    label: 'Equipment',
    value: project.value?.equipmentCount ?? 0,
    to: `/organization/project-summary/${projectId.value}/data/equipment`,
  },
  {
    label: 'Locations',
    value: project.value?.assignedLocationsCount ?? 0,
    to: `/organization/project-summary/${projectId.value}/data/locations`,
  },
  {
    label: 'Zones',
    value: project.value?.assignedZonesCount ?? 0,
    to: `/organization/project-summary/${projectId.value}/data/zones`,
  },
  {
    label: 'Teams',
    value: project.value?.teamsCount ?? 0,
    to: `/organization/project-summary/${projectId.value}/data/teams`,
  },
  {
    label: 'Positions',
    value: project.value?.positionsCount ?? 0,
    to: `/organization/project-summary/${projectId.value}/data/hierarchies`,
  },
  {
    label: 'Contractors',
    value: project.value?.contractorsCount ?? 0,
    to: `/organization/project-summary/${projectId.value}/data/contractors`,
  },
])

const quickLinks = computed(() => [
  {
    title: 'Leadership',
    description: 'Engagements, visits and reports',
    to: `/organization/project-details/${projectId.value}/leadership`,
    mark: 'L',
  },
  {
    title: 'Risk assessments',
    description: 'Review project hazards and controls',
    to: `/organization/project-details/${projectId.value}/risk-assessments`,
    mark: 'R',
  },
  {
    title: 'PPE matrix',
    description: 'Activities, tools and protection',
    to: `/organization/project-details/${projectId.value}/ppe-matrix`,
    mark: 'P',
  },
  {
    title: 'Project meetings',
    description: 'Meeting schedule and outcomes',
    to: `/organization/project-meetings/${projectId.value}`,
    mark: 'M',
  },
  {
    title: 'Induction',
    description: 'All Inductions',
    to: `/organization/inductions?project_id=${projectId.value}`,
    mark: 'I',
  },
  {
    title: 'objectives',
    description: 'All Objectives',
    to: `/organization/objectives/project/${projectId.value}`,
    mark: 'O',
  },
  {
    title: 'management of change',
    description: 'all management of change',
    to: `/organization/project-details/${projectId.value}/management-of-change?project_id=${projectId.value}`,
    mark: 'M',
  },
  {
    title: 'Audits',
    description: 'all Audits',
    to: `/organization/equipment-mangement/audits/${projectId.value}?project_id=${projectId.value}&inspectionType=1`,
    mark: 'A',
  },
])

watch(
  () => route.params.id,
  () => {
    getProjectSummaryDetails()
  },
  { immediate: true },
)
</script>

<template>
  <DataStatus :controller="state">
    <template #success>
      <main class="project-summary-page" :style="summaryIdentityStyle">
        <section class="summary-hero">
          <!-- <span class="summary-hero__orb summary-hero__orb--one" aria-hidden="true"></span>
          <span class="summary-hero__orb summary-hero__orb--two" aria-hidden="true"></span> -->

          <div class="summary-hero__content">
            <div class="summary-identity">
               <!-- <span class="summary-identity__mark">
                <img :src="brandLogo" :alt="`${brandName} logo`" />
              </span> -->
              <div>
                <span class="summary-eyebrow">
                  <!-- <b>{{ brandName }}</b> -->
                  <!-- <i aria-hidden="true"></i> -->
                  <!-- Project command overview -->
                </span>
                <h1>{{ project?.title || 'Project summary' }}</h1>
                <p>
                  <span class="scope-of-work">Project Scope of Work : </span>{{ project?.description || 'A concise view of project safety and operations.' }}
                </p>
              </div>
            </div>

            <div class="summary-hero__actions">
              <span class="project-reference">{{
                project?.serialName || project?.serialNumber
              }}</span>
              <RouterLink
                class="full-details-link"
                :to="`/organization/project-details/${projectId}`"
              >
                <span>Open full project details</span>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12h14m-5-5 5 5-5 5"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </RouterLink>
            </div>
          </div>

          <div class="summary-hero__meta">
            <div>
              <span>Start date</span>
              <strong>{{ project?.startDate || 'Not set' }}</strong>
            </div>
            <div>
              <span>Target completion</span>
              <strong>{{ project?.endDate || 'Not set' }}</strong>
            </div>
            <!-- <div>
              <span>Partner</span>
              <strong>{{ project?.partner?.title || 'Not assigned' }}</strong>
            </div> -->
            <div>
              <span>Project readiness</span>
              <strong>{{ project?.projectProgress || 0 }}%</strong>
            </div>
          </div>
        </section>

        <section class="summary-section">
          <header class="section-heading">
            <div>
              <span>Live performance</span>
              <h2>Safety statistics</h2>
            </div>
            <p>Current project records returned by the project summary service.</p>
          </header>

          <div class="safety-stat-grid">
            <RouterLink
              v-for="stat in safetyStatistics"
              :key="stat.label"
              :to="stat.to"
              class="safety-stat-card"
              :class="`safety-stat-card--${stat.tone}`"
            >
              <span class="safety-stat-card__icon" aria-hidden="true">{{ stat.icon }}</span>
              <div>
                <strong
                  >{{ String(stat.value).split('/')[0] }}
                  <span class="tot-num">{{ String(stat.value).split('/')[1] ? '/' : '' }}</span>
                  <span class="tot-num">{{ String(stat.value).split('/')[1] }}</span>
                </strong>
                <h3>{{ stat.label }}</h3>
                <p>{{ stat.note }}</p>
              </div>
              <span class="stat-card-arrow" aria-hidden="true">→</span>
            </RouterLink>
          </div>
        </section>

        <section class="operations-panel">
          <div class="operations-panel__intro">
            <!-- <span>Operational footprint</span> -->
            <h2>Project Statics</h2>
            <p>People, places and assets currently connected to this project.</p>
          </div>

          <div class="operational-stat-grid">
            <RouterLink
              v-for="stat in operationalStatistics"
              :key="stat.label"
              :to="stat.to"
              class="operational-stat"
            >
              <strong>{{ stat.value }}</strong>
              <span>{{ stat.label }}</span>
              <!-- <small aria-hidden="true">→</small> -->
            </RouterLink>
          </div>
        </section>
        <!-- v-if="project?.lossTimes?.length" -->

        <LossTimeMatrix :loss-times="project?.lossTimes!" />

        <section class="summary-section">
          <header class="section-heading">
            <div>
              <span>Project workspace</span>
              <h2>Quick access</h2>
            </div>
            <p>Continue directly to the most-used safety areas.</p>
          </header>

          <div class="quick-link-grid">
            <RouterLink
              v-for="item in quickLinks"
              :key="item.title"
              :to="item.to"
              class="quick-link"
            >
              <span class="quick-link__mark" aria-hidden="true">{{ item.mark }}</span>
              <span class="quick-link__copy">
                <strong>{{ item.title }}</strong>
                <small>{{ item.description }}</small>
              </span>
              <span class="quick-link__arrow" aria-hidden="true">→</span>
            </RouterLink>
          </div>
        </section>
      </main>
    </template>

    <template #loader>
      <div class="summary-loading" aria-label="Loading project summary">
        <span v-for="index in 8" :key="index"></span>
      </div>
    </template>

    <template #initial>
      <div class="summary-loading" aria-label="Loading project summary">
        <span v-for="index in 8" :key="index"></span>
      </div>
    </template>

    <template #empty>
      <DataEmpty
        link="/organization/projects"
        add-text="Back to projects"
        title="Project details are not available"
        description="Choose another project and try again."
      />
    </template>

    <template #failed>
      <DataFailed
        link="/organization/projects"
        add-text="Back to projects"
        title="Unable to load project summary"
        description="The project overview could not be loaded. Please try again."
      />
    </template>
  </DataStatus>
</template>

<style scoped lang="scss">
.scope-of-work{
  font-size: 12px;
}
.tot-num {
  font-size: 14px;
}
.project-summary-page {
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 12px;
}

.summary-hero {
  --summary-primary: var(--identity-primary);
  --summary-secondary: var(--identity-secondary);
  --summary-accent: var(--identity-accent);
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: 30px;
  border-radius: 28px;
  background:
    linear-gradient(
      120deg,
      color-mix(in srgb, var(--summary-secondary) 82%, var(--summary-primary)),
      color-mix(in srgb, var(--summary-primary) 72%, var(--summary-secondary))
    ),
    var(--summary-secondary);
  box-shadow: 0 24px 60px color-mix(in srgb, var(--summary-secondary) 24%, transparent);
  color: var(--text-on-brand);
}

.summary-hero__orb {
  position: absolute;
  z-index: -1;
  border-radius: 999px;
  filter: blur(2px);
  opacity: 0.28;
}

.summary-hero__orb--one {
  width: 220px;
  height: 220px;
  inset-block-start: -115px;
  inset-inline-end: 8%;
  background: var(--summary-primary);
}

.summary-hero__orb--two {
  width: 150px;
  height: 150px;
  inset-block-end: -100px;
  inset-inline-start: 36%;
  background: var(--summary-accent);
}

.summary-hero__content,
.summary-hero__meta,
.section-heading,
.operations-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.summary-identity {
  display: flex;
  min-width: 0;
  align-items: flex-start;
  gap: 16px;
}

.summary-identity__mark {
  display: grid;
  width: 58px;
  height: 58px;
  flex: 0 0 58px;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--text-on-brand) 26%, transparent);
  border-radius: 18px;
  background: color-mix(in srgb, var(--surface-1) 94%, transparent);
  box-shadow: 0 14px 30px color-mix(in srgb, var(--summary-secondary) 28%, transparent);
}

.summary-identity__mark img {
  width: 72%;
  height: 72%;
  object-fit: contain;
}

.summary-eyebrow,
.section-heading span,
.operations-panel__intro > span {
  display: block;
  margin-bottom: 5px;
  color: color-mix(in srgb, var(--summary-primary) 52%, var(--text-on-brand));
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.summary-eyebrow {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px;
}

.summary-eyebrow b {
  color: var(--text-on-brand);
  font: inherit;
}

.summary-eyebrow i {
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: var(--summary-accent);
}

.summary-identity h1 {
  margin: 0;
  font-size: clamp(1.65rem, 3vw, 2.45rem);
  line-height: 1.08;
}

.summary-identity p {
  max-width: 690px;
  margin: 10px 0 0;
  color: color-mix(in srgb, var(--text-on-brand) 78%, transparent);
  line-height: 1.65;
}

.summary-hero__actions {
  display: flex;
  flex: 0 0 auto;
  align-items: flex-end;
  flex-direction: column;
  gap: 10px;
}

.project-reference {
  color: color-mix(in srgb, var(--summary-primary) 42%, var(--text-on-brand));
  font-size: 0.76rem;
  font-weight: 850;
  letter-spacing: 0.08em;
}

.full-details-link {
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  gap: 11px;
  padding: 0 17px;
  border: 1px solid color-mix(in srgb, var(--text-on-brand) 26%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, var(--text-on-brand) 12%, transparent);
  color: var(--text-on-brand);
  font-size: 0.82rem;
  font-weight: 850;
  backdrop-filter: blur(8px);
  transition: 170ms ease;
}

.full-details-link:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--summary-primary) 56%, var(--text-on-brand));
  background: color-mix(in srgb, var(--text-on-brand) 18%, transparent);
}

.full-details-link svg {
  width: 18px;
  height: 18px;
}

[dir='rtl'] .full-details-link svg {
  transform: rotate(180deg);
}

.summary-hero__meta {
  margin-top: 26px;
  padding-top: 20px;
  border-top: 1px solid color-mix(in srgb, var(--text-on-brand) 15%, transparent);
}

.summary-hero__meta > div {
  min-width: 0;
  flex: 1;
}

.summary-hero__meta span {
  display: block;
  margin-bottom: 5px;
  color: color-mix(in srgb, var(--text-on-brand) 64%, transparent);
  font-size: 0.68rem;
  text-transform: uppercase;
}

.summary-hero__meta strong {
  display: block;
  overflow: hidden;
  font-size: 0.88rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.summary-section,
.operations-panel {
  padding: 22px;
  border: 1px solid var(--main-border);
  border-radius: 24px;
  background: var(--BgWhite);
}

.section-heading {
  align-items: flex-end;
  margin-bottom: 18px;
}

.section-heading span,
.operations-panel__intro > span {
  color: var(--summary-primary);
}

.section-heading h2,
.operations-panel h2 {
  margin: 0;
  color: var(--text-strong);
  font-size: 1.3rem;
}

.section-heading p,
.operations-panel p {
  margin: 0;
  color: var(--text-soft);
  font-size: 0.82rem;
}

.safety-stat-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 13px;
}

.safety-stat-card {
  --stat-color: var(--summary-primary);
  position: relative;
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 14px;
  padding: 17px;
  border: 1px solid color-mix(in srgb, var(--stat-color) 18%, var(--main-border));
  border-radius: 18px;
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--stat-color) 7%, transparent),
    transparent 64%
  );
  color: inherit;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    border-color 160ms ease;
}

.safety-stat-card:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--stat-color) 42%, var(--main-border));
  box-shadow: 0 14px 30px color-mix(in srgb, var(--stat-color) 14%, transparent);
}

.stat-card-arrow {
  margin-inline-start: auto;
  color: var(--stat-color);
  font-size: 1.1rem;
  font-weight: 900;
}

[dir='rtl'] .stat-card-arrow {
  transform: rotate(180deg);
}

.safety-stat-card--red {
  --stat-color: var(--summary-accent);
}
.safety-stat-card--amber {
  --stat-color: color-mix(in srgb, var(--summary-accent) 68%, var(--summary-primary));
}
.safety-stat-card--blue {
  --stat-color: var(--summary-primary);
}
.safety-stat-card--violet {
  --stat-color: color-mix(in srgb, var(--summary-primary) 42%, var(--summary-accent));
}
.safety-stat-card--navy {
  --stat-color: var(--summary-secondary);
}

.safety-stat-card__icon {
  display: grid;
  width: 43px;
  height: 43px;
  flex: 0 0 43px;
  place-items: center;
  border-radius: 14px;
  background: var(--stat-color);
  box-shadow: 0 10px 20px color-mix(in srgb, var(--stat-color) 25%, transparent);
  color: var(--text-on-brand);
  font-size: 1rem;
  font-weight: 900;
}

.safety-stat-card strong {
  color: var(--text-strong);
  font-size: 1.55rem;
  line-height: 1;
}

.safety-stat-card h3 {
  margin: 4px 0 2px;
  color: var(--text-strong);
  font-size: 0.84rem;
}

.safety-stat-card p {
  margin: 0;
  color: var(--text-soft);
  font-size: 0.69rem;
}

.operations-panel {
  background:
    radial-gradient(
      circle at 100% 0,
      color-mix(in srgb, var(--summary-primary) 10%, transparent),
      transparent 34%
    ),
    var(--surface-2);
}

.operations-panel__intro {
  max-width: 310px;
}

.operations-panel__intro p {
  margin-top: 7px;
  line-height: 1.5;
}

.operational-stat-grid {
  display: grid;
  min-width: min(100%, 620px);
  grid-template-columns: repeat(auto-fit, minmax(82px, 1fr));
  gap: 8px;
}

.operational-stat {
  position: relative;
  padding: 13px 8px;
  border: 1px solid var(--main-border);
  border-radius: 15px;
  background: var(--BgWhite);
  text-align: center;
  transition:
    transform 150ms ease,
    border-color 150ms ease;
}

.operational-stat:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--summary-primary) 42%, var(--main-border));
}

.operational-stat strong,
.operational-stat span {
  display: block;
}

.operational-stat small {
  position: absolute;
  inset-block-start: 7px;
  inset-inline-end: 8px;
  color: var(--summary-primary);
  font-size: 0.72rem;
}

[dir='rtl'] .operational-stat small {
  transform: rotate(180deg);
}

.operational-stat strong {
  color: var(--summary-primary);
  font-size: 1.25rem;
}

.operational-stat span {
  margin-top: 3px;
  color: var(--text-soft);
  font-size: 0.66rem;
  font-weight: 750;
}

.quick-link-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 11px;
}

.quick-link {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--main-border);
  border-radius: 17px;
  background: var(--surface-2);
  color: var(--text-strong);
  transition: 160ms ease;
}

.quick-link:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--summary-primary) 45%, var(--main-border));
  box-shadow: 0 12px 24px color-mix(in srgb, var(--summary-primary) 9%, transparent);
}

.quick-link__mark {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  place-items: center;
  border-radius: 12px;
  background: color-mix(in srgb, var(--summary-primary) 12%, transparent);
  color: var(--summary-primary);
  font-weight: 900;
}

.quick-link__copy {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
}

.quick-link__copy strong {
  font-size: 0.84rem;
}

.quick-link__copy small {
  margin-top: 3px;
  overflow: hidden;
  color: var(--text-soft);
  font-size: 0.69rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quick-link__arrow {
  color: var(--summary-primary);
  font-size: 1.2rem;
}

[dir='rtl'] .quick-link__arrow {
  transform: rotate(180deg);
}

.summary-loading {
  display: grid;
  padding: 12px;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.summary-loading span {
  min-height: 130px;
  border-radius: 20px;
  background: linear-gradient(90deg, var(--surface-2), var(--main-border), var(--surface-2));
  background-size: 220% 100%;
  animation: summary-pulse 1.4s ease-in-out infinite;
}

.summary-loading span:first-child {
  min-height: 230px;
  grid-column: 1 / -1;
}

@keyframes summary-pulse {
  to {
    background-position: -120% 0;
  }
}

@media (max-width: 1024px) {
  .safety-stat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .operations-panel {
    align-items: flex-start;
    flex-direction: column;
  }
  .operational-stat-grid {
    width: 100%;
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 720px) {
  .project-summary-page {
    padding: 4px;
  }
  .summary-hero {
    padding: 22px 18px;
    border-radius: 22px;
  }
  .summary-hero__content,
  .summary-hero__meta,
  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }
  .summary-hero__actions {
    width: 100%;
    align-items: stretch;
  }
  .project-reference {
    align-self: flex-start;
  }
  .full-details-link {
    justify-content: center;
  }
  .summary-hero__meta {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  .safety-stat-grid,
  .quick-link-grid {
    grid-template-columns: 1fr;
  }
  .summary-section,
  .operations-panel {
    padding: 17px;
    border-radius: 20px;
  }
}

@media (max-width: 430px) {
  .summary-identity {
    flex-direction: column;
  }
  .summary-hero__meta,
  .operational-stat-grid,
  .summary-loading {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
