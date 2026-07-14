<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import IndexProjectProgressController from '../controllers/indexProjectProgressController'
import IndexProjectProgressParams from '../../Core/params/indexProjectProgressParams'
import { ProjectProgressEnum } from '../../Core/Enum/ProjectProgressEnum'

import ProjectProgressHeader from '../supcomponents/ProjectProgressHeader.vue'
import ProjectProgressSidebar from '../supcomponents/ProjectProgressSidebar.vue'
import ProjectProgressLoader from '../supcomponents/ProjectProgressLoader.vue'

import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import ProgressBackIcon from '@/shared/icons/ProgressBackIcon.vue'
import ProgressPageHeaderIcon from '@/shared/icons/ProgressPageHeaderIcon.vue'
import ProjectProgreesDialog from '../supcomponents/ProjectProgreesDialog.vue'
import { useProjectAppStatusStore } from '@/stores/ProjectStatus'

/* ---------------- Controller & State ---------------- */

const IndexSerial = defineAsyncComponent(
  () => import('@/features/Organization/SerialNumber/Presentation/components/indexSerial.vue'),
)
const AddCertificate = defineAsyncComponent(
  () => import('@/views/Admin/Certificate/AddCertificate.vue'),
)
const TemplateItemAdd = defineAsyncComponent(() => import('../supcomponents/TemplateItemAdd.vue'))
const AddOrganization = defineAsyncComponent(
  () => import('@/views/Organization/OrganizationEmployee/AddOrganization.vue'),
)
const AddHerikaly = defineAsyncComponent(
  () => import('@/views/Organization/Herikaly/AddHerikaly.vue'),
)
const AddCountry = defineAsyncComponent(
  () => import('@/views/Admin/Location/Country/AddCountry.vue'),
)
const AddState = defineAsyncComponent(() => import('@/views/Admin/Location/State/AddState.vue'))
const AddCity = defineAsyncComponent(() => import('@/views/Admin/Location/City/AddCity.vue'))
const AddArea = defineAsyncComponent(() => import('@/views/Admin/Location/Area/AddArea.vue'))
const AddProjectZone = defineAsyncComponent(
  () => import('@/features/Organization/ProjectZone/Presentation/components/AddProjectZone.vue'),
)
const AddObserverationType = defineAsyncComponent(
  () => import('@/views/Admin/ObserverationType/AddObserverationType.vue'),
)
const AddAccidentsType = defineAsyncComponent(
  () => import('@/views/Admin/Accidents/AddAccidentsType.vue'),
)
const AddHazardType = defineAsyncComponent(
  () => import('@/views/Admin/HazardType/AddHazardType.vue'),
)
const AddHazard = defineAsyncComponent(
  () => import('@/features/setting/SubHazard/Presentation/components/AddHazard.vue'),
)
const AddEquipmentType = defineAsyncComponent(
  () => import('@/views/Admin/EquipmentType/AddEquipmentType.vue'),
)
const AddFullEquipment = defineAsyncComponent(
  () => import('@/features/setting/Equipment/Presentation/components/AddFullEquipment.vue'),
)
const AddTeam = defineAsyncComponent(
  () => import('@/features/setting/Teams/Presentation/components/AddTeam.vue'),
)
const AddRootCauses = defineAsyncComponent(
  () => import('@/features/setting/RootCauses/Presentation/components/AddRootCauses.vue'),
)
const CertificateActionsButtons = defineAsyncComponent(
  () =>
    import('@/features/setting/Certificate/Presentation/components/CertificateActionsButtons.vue'),
)
const HerikalyActionsButtons = defineAsyncComponent(
  () =>
    import('@/features/Organization/Herikaly/Presentation/components/HerikalyActionsButtons.vue'),
)
const OrganizationEmployeeActionsButtons = defineAsyncComponent(
  () =>
    import(
      '@/features/Organization/OrganizationEmployee/Presentation/components/OrganizationEmployeeActionsButtons.vue'
    ),
)
const ObserverationTypeActionsButtons = defineAsyncComponent(
  () =>
    import(
      '@/features/setting/ObserverationType/Presentation/components/ObserverationTypeActionsButtons.vue'
    ),
)
const AccidentsTypeActionsButtons = defineAsyncComponent(
  () =>
    import(
      '@/features/setting/AccidentsTypes/Presentation/components/AccidentsTypeActionsButtons.vue'
    ),
)
const EquipmentTypeActionsButtons = defineAsyncComponent(
  () =>
    import(
      '@/features/setting/EquipmentType/Presentation/components/EquipmentTypeActionsButtons.vue'
    ),
)
const EquipmentActionsButtons = defineAsyncComponent(
  () => import('@/features/setting/Equipment/Presentation/components/EquipmentActionsButtons.vue'),
)
const HazardTypeActionsButtons = defineAsyncComponent(
  () =>
    import('@/features/setting/HazardType/Presentation/components/HazardTypeActionsButtons.vue'),
)
const RootCausesActionsButtons = defineAsyncComponent(
  () =>
    import('@/features/setting/RootCauses/Presentation/components/RootCausesActionsButtons.vue'),
)

const indexProjectProgressController = IndexProjectProgressController.getInstance()
const state = ref(indexProjectProgressController.state.value)

const getProjectProgress = async () => {
  const params = new IndexProjectProgressParams('', 1, 10, 0)
  await indexProjectProgressController.getData(params)
}

onMounted(async () => {
  await getProjectProgress()
  visited.value = localStorage.getItem('ProjectProgressVisited')
})

const progectStatus = useProjectAppStatusStore()
watch(
  () => indexProjectProgressController.state.value,
  (newVal) => {
    state.value = newVal
    if (newVal.data) {
      progectStatus.setProjectAppStatus(newVal.data)
    }
  },
  { deep: true },
)

/* ---------------- Active Item Logic ---------------- */

const ActiveItem = ref(0)
const GetActiveItem = (value: number) => (ActiveItem.value = value)

const AllPagesToView = [
  {
    id: ProjectProgressEnum.codingSystem,
    component: IndexSerial,
    title: 'Coding System',
    description: 'Define Coding System structure',
  },
  {
    id: ProjectProgressEnum.Certificate,
    component: AddCertificate,
    actionsComponent: CertificateActionsButtons,
    title: 'Functional Certificate',
    description: 'Define certificate structure and assign related project roles',
  },
  {
    id: ProjectProgressEnum.Tempalte,
    component: TemplateItemAdd,
    title: 'Functional Template',
    description: 'Define templates structure and assign related project roles',
  },
  {
    id: ProjectProgressEnum.Employee,
    component: AddOrganization,
    actionsComponent: OrganizationEmployeeActionsButtons,
    title: 'Functional Employee',
    description: 'Define employees structure and assign roles within the organization',
  },
  {
    id: ProjectProgressEnum.Heirarchy,
    component: AddHerikaly,
    actionsComponent: HerikalyActionsButtons,
    title: 'Positions',
    description: 'Define positions structure and assign related project roles',
  },
  {
    id: ProjectProgressEnum.Country,
    component: AddCountry,
    title: 'Functional Country',
    description: 'Define country structure and assign roles across locations',
  },
  {
    id: ProjectProgressEnum.State,
    component: AddState,
    title: 'Functional State',
    description: 'Define state structure and assign roles within each country',
  },
  {
    id: ProjectProgressEnum.City,
    component: AddCity,
    title: 'Functional City',
    description: 'Define city structure and assign roles within each state',
  },
  {
    id: ProjectProgressEnum.Locatio,
    component: AddArea,
    title: 'Functional Location',
    description: 'Define location structure and assign roles within each city',
  },
  {
    id: ProjectProgressEnum.Zone,
    component: AddProjectZone,
    title: 'Functional Zone',
    description: 'Define zone structure and assign roles within each location',
  },
  {
    id: ProjectProgressEnum.ObservationType,
    component: AddObserverationType,
    actionsComponent: ObserverationTypeActionsButtons,
    title: 'Functional Observation Type',
    description: 'Define observation types and assign related project roles',
  },
  {
    id: ProjectProgressEnum.IncidantType,
    component: AddAccidentsType,
    actionsComponent: AccidentsTypeActionsButtons,
    title: 'Functional Incident Type',
    description: 'Define incident types and assign related project roles',
  },
  {
    id: ProjectProgressEnum.HazardType,
    component: AddHazardType,
    actionsComponent: HazardTypeActionsButtons,
    title: 'Functional Hazard Type',
    description: 'Define hazard types and assign related project roles',
  },
  {
    id: ProjectProgressEnum.Hazard,
    component: AddHazard,
    title: 'Functional Hazard',
    description: 'Define hazards and assign roles for risk management',
  },
  {
    id: ProjectProgressEnum.EquipmentType,
    component: AddEquipmentType,
    actionsComponent: EquipmentTypeActionsButtons,
    title: 'Functional Equipment Type',
    description: 'Define equipment types and assign roles for asset management',
  },
  {
    id: ProjectProgressEnum.Equipment,
    component: AddFullEquipment,
    actionsComponent: EquipmentActionsButtons,
    title: 'Functional Equipment',
    description: 'Define equipment and assign roles for asset management',
  },
  {
    id: ProjectProgressEnum.Team,
    component: AddTeam,
    title: 'Functional Team',
    description: 'Define team and assign roles for asset management',
  },
  {
    id: ProjectProgressEnum.RootCause,
    component: AddRootCauses,
    actionsComponent: RootCausesActionsButtons,
    title: 'Functional Root Cause',
    description: 'Define root cause and assign roles for asset management',
  },
]

const selectedPage = computed(() => AllPagesToView.find((item) => item.id === ActiveItem.value))

const router = useRouter()
const routerBack = () => router.back()

/* ---------------- Onboarding Logic ---------------- */

const showOverlay = ref(false)
const startNextNote = ref(false)

const setGotit = () => {
  showOverlay.value = true
  startNextNote.value = false
  localStorage.setItem('ProjectProgressVisited', 'true')
}

const goToContentNote = () => {
  startNextNote.value = true
}

const closeOnboarding = () => {
  showOverlay.value = false
  startNextNote.value = false
  localStorage.setItem('ProjectProgressVisited', 'true')
}
const visited = ref(localStorage.getItem('ProjectProgressVisited'))
watch(
  () => localStorage.getItem('ProjectProgressVisited'),
  () => {
    visited.value = localStorage.getItem('ProjectProgressVisited')
  },
)
</script>

<template>
  <div class="project-progress-container">
    <div v-if="showOverlay" class="container-overlay"></div>

    <div class="project-progress-actions">
      <div class="back" @click="routerBack">
        <ProgressBackIcon />
        <span>Back</span>
      </div>
    </div>

    <DataStatus :controller="state">
      <template #success>
        <ProjectProgressHeader :progressValue="state.data?.progress" />

        <div class="project-progress-body-container">
          <div
            class="project-progress-body-sidebar"
            :class="{ 'highlight-active': showOverlay && !startNextNote }"
          >
            <ProjectProgressSidebar
              @update:ActiveItem="GetActiveItem"
              :sidebarItems="state.data?.progressItems"
              :projectProgress="state.data?.progress"
            />

            <div v-if="showOverlay && !startNextNote" class="overlay-note sidebar-note">
              <span class="tip-kicker">Step 2 of 3</span>
              <h3>The Roadmap</h3>
              <p>
                This list contains all the forms you need to complete. Start from the top to set up
                your system correctly.
              </p>
              <div class="tip-progress" aria-hidden="true">
                <span class="done"></span>
                <span class="active"></span>
                <span></span>
              </div>
              <button @click="goToContentNote" class="ok-btn">Next Tip</button>
            </div>
          </div>

          <div class="lottie-container" v-if="state.data?.progress == 100">
            <div class="lottie-header">
              <h2 class="title">Data Completed Successfully</h2>
              <p class="text">You can now start using the system</p>
              <!-- <router-link class="btn btn-primary" to="/organization">Home</router-link> -->
            </div>
            <div class="completed-mark"></div>
          </div>

          <div
            class="project-progress-body-content"
            v-if="selectedPage"
            :class="{ 'highlight-active': showOverlay && startNextNote }"
          >
            <div v-if="showOverlay && startNextNote" class="overlay-note content-tip">
              <span class="tip-kicker">Step 3 of 3</span>
              <h3>Configuration</h3>
              <p>
                Fill in the details for each section here. Once saved, your progress will update
                automatically.
              </p>
              <div class="tip-progress" aria-hidden="true">
                <span class="done"></span>
                <span class="done"></span>
                <span class="active"></span>
              </div>
              <button @click="closeOnboarding" class="ok-btn">Let's Start!</button>
            </div>

            <div class="content-header">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <h2 class="title">{{ selectedPage.title }}</h2>
                  <ProgressPageHeaderIcon />
                </div>
                <component
                  :is="selectedPage.actionsComponent"
                  v-if="selectedPage.actionsComponent"
                />
              </div>
              <p class="description">{{ selectedPage.description }}</p>
            </div>

            <component
              :is="selectedPage.component"
              :key="selectedPage.id"
              class="full-content"
              @update:data="getProjectProgress"
              v-if="state.data?.progress != 100"
            />
            <!-- animationComplatedData2 -->
          </div>
        </div>

        <ProjectProgreesDialog
          title="Add Your Own Data To Start Using System Easily"
          :index="6"
          :visible="
            state.data?.progress == 0 &&
            !showOverlay &&
            !startNextNote &&
            !visited &&
            !state.data.progressItems.find((el) => el.progress)
          "
          @Gotit="setGotit"
        />
      </template>

      <template #loader>
        <ProjectProgressLoader />
      </template>

      <template #initial>
        <ProjectProgressLoader />
      </template>
    </DataStatus>
  </div>
</template>

<style scoped>
.lottie-container {
  height: 50vh;
  display: flex;
  justify-content: center;
  flex-direction: column-reverse;
  align-items: center;
  grid-column: span 9;
  width: 100%;
  margin-top: 30px;

  .lottie-header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;

    .title {
      font-size: 24px;
      font-weight: 700;
      color: var(--brand-primary-500);
    }

    .text {
      font-size: 16px;
      font-weight: 400;

      color: var(--text-soft);
    }

    .btn-primary {
      width: 50%;
    }
  }

  .completed-mark {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background: var(--status-success);
    position: relative;
    box-shadow: 0 18px 36px color-mix(in srgb, var(--status-success) 22%, transparent);
    margin-block: 30px;
    &::after {
      content: '';
      position: absolute;
      left: 31px;
      top: 24px;
      width: 28px;
      height: 44px;
      border: solid var(--surface-1);
      border-width: 0 8px 8px 0;
      transform: rotate(45deg);
    }
  }
}

.project-progress-container {
  position: relative;
  min-height: 100vh;
}

.container-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background:
    radial-gradient(circle at 50% 20%, color-mix(in srgb, var(--brand-primary-500) 22%, transparent), transparent 32%),
    color-mix(in srgb, var(--brand-primary-900) 64%, transparent);
  backdrop-filter: blur(7px);
  z-index: 998;
  pointer-events: all;
}

.highlight-active {
  position: relative !important;
  z-index: 99999 !important;
  background: var(--surface-1);
  border-radius: 16px;
  outline: 2px solid color-mix(in srgb, var(--brand-primary-500) 42%, transparent);
  outline-offset: 6px;
  box-shadow:
    0 0 0 10px color-mix(in srgb, var(--brand-primary-500) 8%, transparent),
    0 24px 70px color-mix(in srgb, var(--shadow-color) 24%, transparent);
  pointer-events: all;
}

.overlay-note {
  position: absolute;
  width: min(360px, calc(100vw - 32px));
  overflow: visible;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--surface-1) 98%, transparent), color-mix(in srgb, var(--brand-primary-50) 98%, transparent)),
    var(--surface-1);
  padding: 18px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 90%, transparent);
  border-radius: 18px;
  box-shadow:
    0 24px 60px color-mix(in srgb, var(--shadow-color) 34%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--shadow-color) 95%, transparent);
  z-index: 99999 !important;
  animation: tipPop 0.32s ease-out;
}

.overlay-note::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  background: var(--surface-1);
  border-top: 1px solid color-mix(in srgb, var(--brand-primary-100) 90%, transparent);
  border-left: 1px solid color-mix(in srgb, var(--brand-primary-100) 90%, transparent);
  transform: rotate(45deg);
}

.sidebar-note {
  top: calc(100% + 22px);
  left: clamp(16px, 4vw, 56px);
  z-index: 99999 !important;
}

.sidebar-note::before {
  top: -10px;
  left: 56px;
}

.content-tip {
  top: 18px;
  right: 18px;
}

.content-tip::before {
  top: 42px;
  right: -10px;
  border-right: 1px solid color-mix(in srgb, var(--brand-primary-100) 90%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--brand-primary-100) 90%, transparent);
  border-top: 0;
  border-left: 0;
}

.overlay-note h3 {
  color: var(--brand-primary-900);
  font-weight: 900;
  font-size: 20px;
  margin: 8px 0 8px;
}

.overlay-note p {
  color: var(--brand-primary-600);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
  margin-bottom: 14px;
}

.tip-kicker {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 26px;
  padding: 5px 10px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 16%, transparent);
  border-radius: 999px;
  background: var(--brand-primary-50);
  color: var(--brand-primary-500);
  font-size: 12px;
  font-weight: 900;
}

.tip-kicker::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--brand-primary-500);
  box-shadow: 0 0 0 5px color-mix(in srgb, var(--brand-primary-500) 12%, transparent);
}

.tip-progress {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 14px;
}

.tip-progress span {
  width: 22px;
  height: 5px;
  border-radius: 999px;
  background: var(--brand-primary-100);
}

.tip-progress .done {
  background: var(--brand-primary-200);
}

.tip-progress .active {
  width: 34px;
  background: var(--brand-primary-500);
}

.ok-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 42px;
  background: linear-gradient(135deg, var(--brand-primary-500), var(--brand-primary-600));
  color: var(--text-on-brand);
  border: none;
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 12px 22px color-mix(in srgb, var(--brand-primary-500) 24%, transparent);
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.ok-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 28px color-mix(in srgb, var(--brand-primary-500) 30%, transparent);
}

.project-progress-body-content {
  width: 100%;
  margin-left: 0;
  margin-right: 0;
  padding: clamp(16px, 2vw, 28px);
  transition: all 0.3s ease;
}

.project-progress-body-container {
  align-items: stretch;
}

.project-progress-body-sidebar,
.project-progress-body-content {
  min-width: 0;
}

.project-progress-body-sidebar.highlight-active,
.project-progress-body-content.highlight-active {
  overflow: visible;
}

:deep(.timeline-content-header) {
  min-width: 0;
}

:deep(.timeline-content-header p) {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .project-progress-body-content {
    padding: 10px;
  }

  .overlay-note {
    width: min(320px, calc(100vw - 32px));
  }

  .sidebar-note,
  .content-tip {
    top: calc(100% + 12px);
    left: 50%;
    right: auto;
    transform: translateX(-50%);
  }

  .sidebar-note::before,
  .content-tip::before {
    top: -10px;
    left: 50%;
    right: auto;
    border-top: 1px solid color-mix(in srgb, var(--brand-primary-100) 90%, transparent);
    border-left: 1px solid color-mix(in srgb, var(--brand-primary-100) 90%, transparent);
    border-right: 0;
    border-bottom: 0;
  }
}

@keyframes tipPop {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
