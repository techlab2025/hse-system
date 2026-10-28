<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useDashboardPreferences } from '@/composables/useDashboardPreferences'
const dashboardPreferences = useDashboardPreferences()
import { useI18n } from 'vue-i18n'
import { useOrganizationDashboard } from '../composables/useOrganizationDashboard'
import { useUserStore } from '@/stores/user'
import DashboardIndustrialBanner from './Dashboard/DashboardIndustrialBanner.vue'
import DashboardCorrective from './Dashboard/DashboardCorrective.vue'
import DashboardQuickActions from './Dashboard/DashboardQuickActions.vue'
import DashboardActivities from './Dashboard/DashboardActivities.vue'
import DashboardIcon from './Dashboard/DashboardIcon.vue'
import DashboardMetric from './Dashboard/DashboardMetric.vue'
import DashboardAttention from './Dashboard/DashboardAttention.vue'
import DashboardInspection from './Dashboard/DashboardInspection.vue'
import DashboardSafety from './Dashboard/DashboardSafety.vue'
import DashboardEquipment from './Dashboard/DashboardEquipment.vue'
import DashboardProjects from './Dashboard/DashboardProjects.vue'
import DashboardWorkforce from './Dashboard/DashboardWorkforce.vue'
import HomeSetupHint from './HomeUtils/HomeSetupHint.vue'
import EmployeeTasksButton from '@/shared/HelpersComponents/EmployeeTasksButton.vue'
import IndexProjectProgressController from '@/features/Organization/ProjectPrgoress/Presentation/controllers/indexProjectProgressController'
import IndexProjectProgressParams from '@/features/Organization/ProjectPrgoress/Core/params/indexProjectProgressParams'
import { useProjectAppStatusStore } from '@/stores/ProjectStatus'
import { useOrganizationOnboarding } from '@/composables/useOrganizationOnboarding'
import { DataLoading } from '@/base/core/networkStructure/Resources/dataState/data_state'
import './Dashboard/dashboard.css'

const { t, locale } = useI18n()
const userStore = useUserStore()
const welcome = computed(() =>
  userStore.user?.organizationName
    ? t('command.welcome', { name: userStore.user.organizationName })
    : t('command.title'),
)
const { state, access, projectId, projectSelection, busy, retrievedAt, refresh, retry, goToPage } =
  useOrganizationDashboard()
const scopeName = computed(() =>
  projectId.value
    ? projectSelection.getProject()?.title || t('command.selectedProject')
    : t('command.organizationScope'),
)
const retrieved = computed(() =>
  retrievedAt.value
    ? new Intl.DateTimeFormat(locale.value, { hour: '2-digit', minute: '2-digit' }).format(
        retrievedAt.value,
      )
    : '',
)
const metrics = computed(() =>
  [
    {
      key: 'incidents',
      subtitle: t('command.metricNoteIncidents'),
      label: t('command.incidents'),
      value: state.summary.data?.incidents ?? null,
      tone: 'red',
      icon: 'incident',
      link: '/organization/equipment-mangement/incedant?isAll=1',
      show: access.value.incidents,
    },
    {
      key: 'risk',
      subtitle: t('command.metricNoteRisk'),
      label: t('command.highRiskObservations'),
      value: state.summary.data?.highRiskObservations ?? null,
      tone: 'amber',
      icon: 'risk',
      link: '/organization/equipment-mangement/observation?isAll=1&type=2&risk_level=3',
      show: access.value.observations,
    },
    {
      key: 'inspections',
      subtitle: t('command.metricNoteInspections'),
      label: t('command.delayedInspections'),
      value: state.summary.data?.inspections.delayed ?? null,
      tone: 'blue',
      icon: 'inspection',
      link: '/organization/equipment-mangement/inspection?inspectionType=1',
      show: access.value.inspections,
    },
    {
      key: 'completed',
      subtitle: t('command.metricNoteCompleted'),
      label: t('command.finishedResults'),
      value: state.summary.data?.inspections.finishedResults ?? null,
      tone: 'blue',
      icon: 'inspection',
      link: '/organization/equipment-mangement/inspection?inspectionType=1',
      show: access.value.inspections,
    },
    {
      key: 'certificates',
      subtitle: t('command.metricNoteCertificates'),
      label: t('command.expiredCertificateCount'),
      value: state.summary.data?.certificates.expired ?? null,
      tone: 'amber',
      icon: 'people',
      link: '/organization/employee-certificate',
      show: access.value.certificates,
    },
    {
      key: 'corrective',
      subtitle: t('command.metricNoteCorrective'),
      label: t('command.openCorrective'),
      value: state.summary.data?.openCorrectiveActions ?? null,
      tone: 'purple',
      icon: 'corrective',
      link: '/organization/capa',
      show: access.value.corrective,
    },
  ].filter((item) => item.show),
)
const progressController = IndexProjectProgressController.getInstance()
const setup = computed(() => progressController.state.value.data)
const { setVisited } = useOrganizationOnboarding('visited')
onMounted(async () => {
  if (!access.value.projects) return
  try {
    if (!setup.value && !(progressController.state.value instanceof DataLoading))
      await progressController.getData(new IndexProjectProgressParams('', 1, 10, 0))
    if (setup.value) useProjectAppStatusStore().setProjectAppStatus(setup.value)
  } catch {
    /* Setup assistance never blocks independently loaded analytics. */
  }
})
</script>
<template>
  <main class="org-command hse-identity" data-testid="organization-command-center">
    <header class="command-heading command-hero">
      <DashboardIndustrialBanner />
      <div class="command-hero-copy">
        <h1>{{ welcome }}</h1>
        <p class="command-intro">{{ $t('command.heroSubtitle') }}</p>
        <div class="command-hero-scope">
          <!-- <span
            ><DashboardIcon name="project" /><bdi dir="auto">{{ scopeName }}</bdi></span
          >
          <span v-if="retrieved">{{ $t('command.retrievedAt', { time: retrieved }) }}</span> -->
          <!-- <button
            type="button"
            class="command-snapshot-refresh"
            :disabled="busy"
            :aria-label="$t('command.refresh')"
            :title="$t('command.refresh')"
            @click="refresh"
          >
            <DashboardIcon name="refresh" />
          </button> -->
        </div>
      </div>
    </header>
    <div
      v-if="access.projects && setup && Number.isFinite(setup.progress) && setup.progress < 100"
      class="command-setup"
    >
      <HomeSetupHint
        :items="setup.progressItems"
        :progress-value="setup.progress"
        @continue="setVisited"
      />
    </div>
    <EmployeeTasksButton />
    <section v-if="metrics.length" class="command-kpis" :aria-label="$t('command.keyMetrics')">
      <DashboardMetric
        v-for="metric in metrics"
        :key="metric.key"
        :data-testid="`metric-${metric.key}`"
        :label="metric.label"
        :subtitle="metric.subtitle"
        :value="metric.value"
        :tone="metric.tone"
        :icon="metric.icon"
        :link="metric.link"
        :status="state.summary.status"
      />
    </section>
    <p v-if="state.summary.status === 'forbidden'" class="command-access-note">
      {{ $t('command.summaryAccessNote') }}
    </p>
    <div class="command-grid" :class="{ 'is-restricted': !access.summary }">
      <template
        v-for="panel in dashboardPreferences.panels.filter((item) => item.visible)"
        :key="panel.id"
      >
        <DashboardSafety
          v-if="panel.id === 'safety' && access.safety"
          :data-dashboard-width="panel.width"
          class="command-safety"
          :resource="state.safety"
          :link="access.observations"
          :summary="access.summary ? state.summary : undefined"
          data-testid="safety-panel"
          @retry="retry('safety')"
        />
        <DashboardInspection
          v-if="panel.id === 'inspection' && access.inspections"
          :data-dashboard-width="panel.width"
          class="command-inspection"
          :resource="state.summary"
          :link="access.inspections"
          data-testid="inspection-panel"
          @retry="retry('summary')"
        />
        <DashboardEquipment
          v-if="panel.id === 'equipment' && access.equipment"
          :data-dashboard-width="panel.width"
          class="command-equipment"
          :resource="state.equipment"
          :link="access.equipment"
          data-testid="equipment-panel"
          @retry="retry('equipment')"
        />
        <DashboardCorrective
          v-if="panel.id === 'corrective' && access.corrective"
          :data-dashboard-width="panel.width"
          class="command-corrective"
          :resource="state.summary"
          :link="access.corrective"
          data-testid="corrective-panel"
          @retry="retry('summary')"
        />
        <DashboardWorkforce
          v-if="panel.id === 'workforce' && access.certificates"
          :data-dashboard-width="panel.width"
          class="command-workforce"
          :resource="state.summary"
          :link="access.certificates"
          data-testid="workforce-panel"
          @retry="retry('summary')"
        />
        <DashboardProjects
          v-if="panel.id === 'projects' && access.projects"
          :data-dashboard-width="panel.width"
          class="command-projects"
          :resource="state.projects"
          :can-open="access.projectDetails"
          :show-incidents="access.incidents"
          :show-equipment="access.equipment"
          :show-inspections="access.inspections"
          data-testid="projects-panel"
          @retry="retry('projects')"
          @page="goToPage"
        >
          <DashboardActivities
            class="command-activities"
            :access="access"
            data-testid="activities-panel"
          />
        </DashboardProjects>
        <div
          v-if="panel.id === 'actions'"
          class="command-side-stack"
          :data-dashboard-width="panel.width"
        >
          <DashboardQuickActions :access="access" data-testid="quick-actions" /><DashboardAttention
            v-if="access.summary"
            :resource="state.summary"
            :investigations="access.investigations"
            data-testid="attention-panel"
            @retry="retry('summary')"
          />
        </div>
      </template>
    </div>
    <!-- <footer class="command-dashboard-note">
      <DashboardIcon name="shield" />
      <p>{{ $t('command.coverageNote') }}</p>
      <button
        type="button"
        class="command-snapshot-refresh"
        :disabled="busy"
        :aria-label="$t('command.refresh')"
        :title="[scopeName, retrieved].filter(Boolean).join(' · ')"
        @click="refresh"
      >
        <DashboardIcon name="refresh" />
      </button>
    </footer> -->
  </main>
</template>
