<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import permitImg from '@/assets/images/SmartContract.png'
import inductionImg from '@/assets/images/books.png'
import changeImg from '@/assets/images/Geer.png'
import leadershipImg from '@/assets/images/TeamRatio.png'
import riskImg from '@/assets/images/risk-assessment-document.png'
import FetchMyProjectsController from '@/features/Organization/ObservationFactory/Presentation/controllers/FetchMyProjectsController'
import FetchMyProjectsParams from '@/features/Organization/ObservationFactory/Core/params/fetchMyProjectsParams'
import empCardImg from '@/assets/images/employee-card-img.png'
import observationImg from '@/assets/images/observation-img.png'
import incidentImg from '@/assets/images/incident-img.png'
import { empCardEnum } from '@/features/EmployeeInterface/Core/Enum/empIntEnum'
import { InspectionPageType } from '@/features/Organization/ObservationFactory/Core/Enums/InspectionTypeEnum'
import { useProjectSelectStore } from '@/stores/ProjectSelect'

interface CardAction {
  title: string
  route: string
  disabled?: boolean
}

interface EmpCard {
  type: empCardEnum
  title: string
  eyebrow: string
  subtitle: string
  img: string
  requiresProject?: boolean
  actions: CardAction[]
}
const useprojectSaddelectStore = useProjectSelectStore()

const selectedProjectId = ref<number | null>(null)
const projectId = computed(() => {
  const id = Number(selectedProjectId.value ?? useprojectSelectStore.project?.id)
  return Number.isInteger(id) && id > 0 ? id : null
})
const projectOptions = computed(() => {
  const projects = useprojectSelectStore.AllProjects.filter((project) => project.id > 0)
  const selected = useprojectSelectStore.project
  return selected && selected.id > 0 && !projects.some((project) => project.id === selected.id)
    ? [selected, ...projects]
    : projects
})
const loadingProjects = ref(false)
const projectError = ref(false)
async function loadProjects() {
  loadingProjects.value = true
  projectError.value = false
  try {
    const projects = await FetchMyProjectsController.getInstance().fetch(
      new FetchMyProjectsParams(true),
    )
    if (projects) useprojectSelectStore.setAllProjects(projects)
    else projectError.value = true
  } catch {
    projectError.value = true
  } finally {
    loadingProjects.value = false
  }
}
onMounted(() => {
  if (!useprojectSelectStore.AllProjects.length) void loadProjects()
})
const projectQuery = computed(() => (projectId.value ? `?project_id=${projectId.value}` : ''))
const projectAction = (title: string, path: string): CardAction => ({
  title,
  route: projectId.value ? path : '',
  disabled: !projectId.value,
})

const cards = computed<EmpCard[]>(() => [
  {
    type: empCardEnum.Inspection,
    title: 'Inspection',
    eyebrow: 'Stay proactive',
    subtitle: 'Complete an inspection to verify compliance with safety standards and procedures.',
    img: empCardImg,
    actions: [
      {
        title: 'Daily Inspection',
        route: `/organization/equipment-mangement/inspection?inspectionType=${InspectionPageType.DragInspection}`,
      },
      {
        title: 'Inspection logs',
        route: `/organization/equipment-mangement/inspection?inspectionType=${InspectionPageType.Result}`,
      },
    ],
  },
  {
    type: empCardEnum.Observation,
    title: 'Observation',
    eyebrow: 'See it. Share it.',
    subtitle: 'Document safety observations in line with organizational standards.',
    img: observationImg,
    actions: [
      {
        title: 'Add Observation',
        route: '/organization/equipment-mangement/observation/add',
      },
      {
        title: 'View Observations',
        route: '/organization/equipment-mangement/observation?isAll=1',
      },
    ],
  },
  {
    type: empCardEnum.Incident,
    title: 'Incident',
    eyebrow: 'Make a difference',
    subtitle: 'Report and review incidents to ensure proper investigation and corrective actions.',
    img: incidentImg,
    actions: [
      {
        title: 'Report Incident',
        route: '/organization/equipment-mangement/incedant/add',
      },
      {
        title: 'View Incident',
        route: '/organization/equipment-mangement/incedant?isAll=1',
      },
    ],
  },
  {
    type: empCardEnum.PermitToWork,
    title: 'Permit to Work',
    eyebrow: 'Work safely',
    subtitle: 'Request a work permit and track your permits for the selected project.',
    img: permitImg,
    requiresProject: true,
    actions: [
      projectAction('Request Permit', `/organization/project-permit/project/${projectId.value}`),
      projectAction('My Permits', `/organization/project-my-permits/${projectId.value}`),
    ],
  },
  {
    type: empCardEnum.Induction,
    title: 'Induction',
    eyebrow: 'Start with safety',
    subtitle: 'Record inductions and review the safety information needed before work begins.',
    img: inductionImg,
    actions: [
      { title: 'Add Induction', route: `/organization/induction/add${projectQuery.value}` },
      { title: 'View Inductions', route: `/organization/inductions${projectQuery.value}` },
    ],
  },
  {
    type: empCardEnum.ManagementOfChange,
    title: 'Management of Change',
    eyebrow: 'Change with confidence',
    subtitle: 'Submit and review changes to keep people, processes, and operations safe.',
    img: changeImg,
    actions: [
      {
        title: 'Request Change',
        route: `/organization/management-of-change/add${projectQuery.value}`,
      },
      { title: 'View Changes', route: `/organization/management-of-change${projectQuery.value}` },
    ],
  },
  {
    type: empCardEnum.Leadership,
    title: 'Leadership',
    eyebrow: 'Lead by example',
    subtitle: 'Explore safety leadership plans and follow up on project visits.',
    img: leadershipImg,
    requiresProject: true,
    actions: [
      projectAction(
        'View Leadership',
        `/organization/project-details/${projectId.value}/leadership`,
      ),
      projectAction(
        'View Visits',
        `/organization/project-details/${projectId.value}/leadership/visits`,
      ),
    ],
  },
  {
    type: empCardEnum.RiskAssessment,
    title: 'Risk Assessment',
    eyebrow: 'Understand the risks',
    subtitle:
      'Identify hazards, assess project risks, and define the controls needed for safer work.',
    img: riskImg,
    requiresProject: true,
    actions: [
      projectAction(
        'Create Assessment',
        `/organization/project-details/${projectId.value}/risk-assessments/create`,
      ),
      projectAction(
        'View Assessments',
        `/organization/project-details/${projectId.value}/risk-assessments`,
      ),
    ],
  },
])
</script>
<template>
  <div class="employee-interface-wrapper">
    <div class="employee-project-picker">
      <div>
        <label for="employee-project">Your project</label>
        <p id="employee-project-help">
          Select a project to access permits, leadership, and risk assessments.
        </p>
      </div>
      <select
        id="employee-project"
        :value="projectId ?? ''"
        :disabled="loadingProjects"
        aria-describedby="employee-project-help"
        @change="selectedProjectId = Number(($event.target as HTMLSelectElement).value) || null"
      >
        <option value="" disabled>
          {{ loadingProjects ? 'Loading projects…' : 'Select a project' }}
        </option>
        <option v-for="project in projectOptions" :key="project.id" :value="project.id">
          {{ project.title || project.name || `Project #${project.id}` }}
        </option>
      </select>
      <p v-if="projectError" role="status">
        Unable to load projects. <button type="button" @click="loadProjects">Try again</button>
      </p>
      <p v-else-if="!loadingProjects && !projectOptions.length" role="status">
        No assigned projects are available.
      </p>
    </div>
    <article
      v-for="(card, cardIndex) in cards"
      :key="card.type"
      class="employee-interface-card"
      :class="card.title.replaceAll(' ', '-')"
      :aria-labelledby="`employee-card-${card.type}`"
    >
      <div class="card-text">
        <div class="card-eyebrow">
          <span class="card-number" aria-hidden="true">0{{ cardIndex + 1 }}</span>
          <span>{{ card.eyebrow }}</span>
        </div>
        <div class="info-wrapper">
          <h2 :id="`employee-card-${card.type}`" class="card-title">{{ card.title }}</h2>
          <p class="card-subtitle">{{ card.subtitle }}</p>
        </div>
      </div>

      <div class="card-illustration" aria-hidden="true">
        <span class="illustration-orbit"></span>
        <img :src="card.img" alt="" />
      </div>

      <div class="actions-button">
        <p v-if="card.requiresProject && !projectId" class="project-required-note">
          Select a project above to get started.
        </p>
        <component
          :is="action.disabled ? 'button' : RouterLink"
          v-for="(action, index) in card.actions"
          :key="action.title"
          :to="action.disabled ? undefined : action.route"
          :disabled="action.disabled || undefined"
          :class="index === 0 ? 'button-main' : 'button-view'"
        >
          <span>{{ action.title }}</span>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        </component>
      </div>
    </article>
  </div>
</template>
