<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import permitImg from '@/assets/images/SmartContract.png'
import inductionImg from '@/assets/images/books.png'
import changeImg from '@/assets/images/Geer.png'
import leadershipImg from '@/assets/images/TeamRatio.png'
import riskImg from '@/assets/images/risk-assessment-document.png'
import tasksImg from '@/assets/images/ToDoList.png'
import FetchMyProjectsController from '@/features/Organization/ObservationFactory/Presentation/controllers/FetchMyProjectsController'
import FetchMyProjectsParams from '@/features/Organization/ObservationFactory/Core/params/fetchMyProjectsParams'
import empCardImg from '@/assets/images/employee-card-img.png'
import observationImg from '@/assets/images/observation-img.png'
import incidentImg from '@/assets/images/incident-img.png'
import { empCardEnum } from '@/features/EmployeeInterface/Core/Enum/empIntEnum'
import { InspectionPageType } from '@/features/Organization/ObservationFactory/Core/Enums/InspectionTypeEnum'
import { useProjectSelectStore } from '@/stores/ProjectSelect'
import { useUserStore } from '@/stores/user'
import ConditionHandler from '@/base/Presentation/utils/condition_handler'
import PermissionHandler from '@/base/Presentation/utils/permission_handler'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'

interface CardAction {
  title: string
  route: string
  disabled?: boolean
  permissions: PermissionsEnum[]
}

interface EmpCard {
  type: empCardEnum
  title: string
  eyebrow: string
  subtitle: string
  img: string
  requiresProject?: boolean
  permissions: PermissionsEnum[]
  actions: CardAction[]
}
const useprojectSaddelectStore = useProjectSelectStore()
const userStore = useUserStore()
const toast = useToast()
const { t } = useI18n()
const hasPermission = (permissions: PermissionsEnum[]) =>
  PermissionHandler.Instance.handle(permissions)
const canAccessAction = (card: EmpCard, action: CardAction) =>
  hasPermission(card.permissions) && hasPermission(action.permissions)

const showPermissionDenied = () => {
  toast.add({ severity: 'warn', summary: t("You don't have permission"), life: 4000 })
}

const handleActionClick = (event: MouseEvent, card: EmpCard, action: CardAction) => {
  if (!canAccessAction(card, action)) {
    event.preventDefault()
    showPermissionDenied()
  }
}
const canShowMyTasks = computed(
  () => ConditionHandler.getInstance().shouldUseEmployeeInterface() && !!userStore.user?.id,
)

const selectedProjectId = ref<number | null>(null)
const projectId = computed(() => {
  const id = Number(selectedProjectId.value ?? useprojectSaddelectStore.project?.id)
  return Number.isInteger(id) && id > 0 ? id : null
})
const projectOptions = computed(() => {
  const projects = useprojectSaddelectStore.AllProjects.filter((project) => project.id > 0)
  const selected = useprojectSaddelectStore.project
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
    if (projects) useprojectSaddelectStore.setAllProjects(projects)
    else projectError.value = true
  } catch {
    projectError.value = true
  } finally {
    loadingProjects.value = false
  }
}
onMounted(() => {
  if (!useprojectSaddelectStore.AllProjects.length) void loadProjects()
})
const projectQuery = computed(() => (projectId.value ? `?project_id=${projectId.value}` : ''))
const projectAction = (
  title: string,
  path: string,
  permissions: PermissionsEnum[],
): CardAction => ({
  title,
  route: projectId.value ? path : '',
  disabled: !projectId.value,
  permissions,
})

const cards = computed<EmpCard[]>(() => [
  ...(canShowMyTasks.value
    ? [
        {
          type: empCardEnum.MyTasks,
          title: 'My tasks',
          eyebrow: 'Stay on track',
          subtitle: 'Review your assigned tasks, follow up on deadlines, and update your progress.',
          img: tasksImg,
          permissions: [PermissionsEnum.MY_TASKS_ALL],
          actions: [
            {
              title: 'Show tasks',
              route: `/organization/organization-employee-tasks/${userStore.user?.id}`,
              permissions: [PermissionsEnum.MY_TASKS_ALL],
            },
          ],
        },
      ]
    : []),
  {
    type: empCardEnum.Inspection,
    title: 'Inspection',
    eyebrow: 'Stay proactive',
    subtitle: 'Complete an inspection to verify compliance with safety standards and procedures.',
    img: empCardImg,
    permissions: [
      PermissionsEnum.ORG_INSPECTION_ALL,
      PermissionsEnum.MY_TASKS_ALL,
      PermissionsEnum.INSPECTION_RESULTS_FETCH,
    ],
    actions: [
      {
        title: 'Daily Inspection',
        route: `/organization/equipment-mangement/inspection?inspectionType=${InspectionPageType.DragInspection}`,
        permissions: [PermissionsEnum.ORG_INSPECTION_ALL, PermissionsEnum.MY_TASKS_ALL],
      },
      {
        title: 'Inspection logs',
        route: `/organization/equipment-mangement/inspection?inspectionType=${InspectionPageType.Result}`,
        permissions: [PermissionsEnum.ORG_INSPECTION_ALL, PermissionsEnum.INSPECTION_RESULTS_FETCH],
      },
    ],
  },
  {
    type: empCardEnum.Observation,
    title: 'Observation',
    eyebrow: 'See it. Share it.',
    subtitle: 'Document safety observations in line with organizational standards.',
    img: observationImg,
    permissions: [
      PermissionsEnum.ORG_OBSERVATION_ALL,
      PermissionsEnum.ORG_OBSERVATION_CREATE,
      PermissionsEnum.ORG_OBSERVATION_FETCH,
    ],
    actions: [
      {
        title: 'Add Observation',
        route: '/organization/equipment-mangement/observation/add',
        permissions: [PermissionsEnum.ORG_OBSERVATION_ALL, PermissionsEnum.ORG_OBSERVATION_CREATE],
      },
      {
        title: 'View Observations',
        route: '/organization/equipment-mangement/observation?isAll=1',
        permissions: [PermissionsEnum.ORG_OBSERVATION_ALL, PermissionsEnum.ORG_OBSERVATION_FETCH],
      },
    ],
  },
  {
    type: empCardEnum.Incident,
    title: 'Incident',
    eyebrow: 'Make a difference',
    subtitle: 'Report and review incidents to ensure proper investigation and corrective actions.',
    img: incidentImg,
    permissions: [
      PermissionsEnum.ORG_INCEDANT_ALL,
      PermissionsEnum.ORG_INCEDANT_CREATE,
      PermissionsEnum.ORG_INCEDANT_FETCH,
    ],
    actions: [
      {
        title: 'Report Incident',
        route: '/organization/equipment-mangement/incedant/add',
        permissions: [PermissionsEnum.ORG_INCEDANT_ALL, PermissionsEnum.ORG_INCEDANT_CREATE],
      },
      {
        title: 'View Incident',
        route: '/organization/equipment-mangement/incedant?isAll=1',
        permissions: [PermissionsEnum.ORG_INCEDANT_ALL, PermissionsEnum.ORG_INCEDANT_FETCH],
      },
    ],
  },
  // {
  //   type: empCardEnum.PermitToWork,
  //   title: 'Permit to Work',
  //   eyebrow: 'Work safely',
  //   subtitle: 'Request a work permit and track your permits for the selected project.',
  //   img: permitImg,
  //   requiresProject: true,
  //   permissions: [PermissionsEnum.PTW_ALL, PermissionsEnum.PTW_CREATE, PermissionsEnum.PTW_FETCH],
  //   actions: [
  //     {
  //       title: 'Request Permit',
  //       route: `/organization/project-permit/create${projectQuery.value}`,
  //       permissions: [PermissionsEnum.PTW_ALL, PermissionsEnum.PTW_CREATE],
  //     },
  //     projectAction('My Permits', `/organization/project-my-permits/${projectId.value}`, [
  //       PermissionsEnum.PTW_ALL,
  //       PermissionsEnum.PTW_FETCH,
  //     ]),
  //   ],
  // },
  {
    type: empCardEnum.Induction,
    title: 'Induction',
    eyebrow: 'Start with safety',
    subtitle: 'Record inductions and review the safety information needed before work begins.',
    img: inductionImg,
    permissions: [
      PermissionsEnum.inductions_ALL,
      PermissionsEnum.inductions_CREATE,
      PermissionsEnum.inductions_FETCH,
    ],
    actions: [
      {
        title: 'Add Induction',
        route: `/organization/induction/add${projectQuery.value}`,
        permissions: [PermissionsEnum.inductions_ALL, PermissionsEnum.inductions_CREATE],
      },
      {
        title: 'View Inductions',
        route: `/organization/inductions${projectQuery.value}`,
        permissions: [PermissionsEnum.inductions_ALL, PermissionsEnum.inductions_FETCH],
      },
    ],
  },
  {
    type: empCardEnum.ManagementOfChange,
    title: 'Management of Change',
    eyebrow: 'Change with confidence',
    subtitle: 'Submit and review changes to keep people, processes, and operations safe.',
    img: changeImg,
    permissions: [PermissionsEnum.MOC_ALL, PermissionsEnum.MOC_CRAETE, PermissionsEnum.MOC_FETCH],
    actions: [
      {
        title: 'Request Change',
        route: `/organization/management-of-change/add${projectQuery.value}`,
        permissions: [PermissionsEnum.MOC_ALL, PermissionsEnum.MOC_CRAETE],
      },
      {
        title: 'View Changes',
        route: `/organization/management-of-change${projectQuery.value}`,
        permissions: [PermissionsEnum.MOC_ALL, PermissionsEnum.MOC_FETCH],
      },
    ],
  },
  {
    type: empCardEnum.Leadership,
    title: 'Leadership',
    eyebrow: 'Lead by example',
    subtitle: 'Explore safety leadership plans and follow up on project visits.',
    img: leadershipImg,
    requiresProject: true,
    permissions: [PermissionsEnum.LEADERSHIP_ALL, PermissionsEnum.LEADERSHIP_FETCH],
    actions: [
      projectAction(
        'View Leadership',
        `/organization/project-details/${projectId.value}/leadership`,
        [PermissionsEnum.LEADERSHIP_ALL, PermissionsEnum.LEADERSHIP_FETCH],
      ),
      projectAction(
        'View Visits',
        `/organization/project-details/${projectId.value}/leadership/visits`,
        [PermissionsEnum.LEADERSHIP_ALL],
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
    permissions: [
      PermissionsEnum.RISK_ASSESSMENT_ALL,
      PermissionsEnum.RISK_ASSESSMENT_CREATE,
      PermissionsEnum.RISK_ASSESSMENT_FETCH,
    ],
    actions: [
      {
        title: 'Create Assessment',
        route: `/organization/risk-assessments/create${projectQuery.value}`,
        permissions: [PermissionsEnum.RISK_ASSESSMENT_ALL, PermissionsEnum.RISK_ASSESSMENT_CREATE],
      },
      projectAction(
        'View Assessments',
        `/organization/project-details/${projectId.value}/risk-assessments`,
        [PermissionsEnum.RISK_ASSESSMENT_ALL, PermissionsEnum.RISK_ASSESSMENT_FETCH],
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
      v-for="card in cards"
      :key="card.type"
      class="employee-interface-card"
      :class="[
        card.title.replaceAll(' ', '-'),
        { 'is-permission-denied': !hasPermission(card.permissions) },
      ]"
      @click="!hasPermission(card.permissions) && showPermissionDenied()"
      :aria-labelledby="`employee-card-${card.type}`"
    >
      <div class="card-text">
        <div class="card-eyebrow">
          <span class="card-number" aria-hidden="true"></span>
          <span>{{ card.eyebrow }}</span>
        </div>
        <div class="info-wrapper">
          <h2 :id="`employee-card-${card.type}`" class="card-title">{{ card.title }}</h2>
          <p class="card-subtitle">{{ card.subtitle }}</p>
          <p
            v-if="card.requiresProject"
            :id="`employee-card-project-hint-${card.type}`"
            class="project-required-note"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v6M12 7h.01" />
            </svg>
            <span>
              <strong>Project required</strong>
              <span v-if="!projectId">
                {{ $t('employeeProjectAction.viewHint') }}
                <template v-if="card.type !== empCardEnum.Leadership">{{
                  $t('employeeProjectAction.createHint')
                }}</template>
              </span>
              <span v-else>These actions use your selected project.</span>
            </span>
          </p>
        </div>
      </div>

      <div class="card-illustration" aria-hidden="true">
        <span class="illustration-orbit"></span>
        <img :src="card.img" alt="" />
      </div>

      <div class="actions-button">
        <component
          v-for="(action, index) in card.actions"
          :key="action.title"
          :is="!canAccessAction(card, action) || action.disabled ? 'button' : RouterLink"
          :to="!canAccessAction(card, action) || action.disabled ? undefined : action.route"
          :type="!canAccessAction(card, action) || action.disabled ? 'button' : undefined"
          :disabled="(canAccessAction(card, action) && action.disabled) || undefined"
          :aria-disabled="!canAccessAction(card, action) || action.disabled || undefined"
          :title="!canAccessAction(card, action) ? $t('permission_denied') : undefined"
          @click.stop="handleActionClick($event, card, action)"
          :aria-describedby="
            card.requiresProject ? `employee-card-project-hint-${card.type}` : undefined
          "
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

<style scoped>
.employee-interface-wrapper {
  counter-reset: visible-employee-card;
}

.employee-interface-card {
  counter-increment: visible-employee-card;
}

.employee-interface-card.is-permission-denied {
  filter: grayscale(0.8);
  opacity: 0.7;
  cursor: not-allowed;
}

.employee-interface-card .actions-button [aria-disabled='true'] {
  cursor: not-allowed;
  background: var(--surface-2);
  color: var(--text-muted);
  border-color: var(--main-border);
  box-shadow: none;
}

.card-number::before {
  content: counter(visible-employee-card, decimal-leading-zero);
}
</style>
