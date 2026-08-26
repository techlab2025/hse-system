<script setup lang="ts">
import { useRoute } from 'vue-router'
import ShowProjectDetailsParams from '../../../Core/params/ShowProjectDetailsParams'
import ShowProjectDetailsController from '../../controllers/ShowProjectDetailsController'
import EquipmentSection from './Equipment/EquipmentSection.vue'
// import InspectionsSections from './Inspection/InspectionsSections.vue'
import LocationsTeamsSection from './LocationsTeams/LocationsTeamsSection.vue'
import MainObjectivesSection from './Objectives/MainObjectivesSection.vue'
import ProjectSiteSection from './ProjectSite/ProjectSiteSection.vue'
import { watch } from 'vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import ProjectPageSkeleton from './Skeletons/ProjectPageSkeleton.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import ProjectHeader from './PorjectUtils/ProjectHeader.vue'
import TodayTalkSummary from '../TodayTalk/TodayTalkSummary.vue'
// import zoneInspectionTasks from '@/assets/images/InspectionTaskbg.png'
// import EmployeeInspectionTasks from '@/assets/images/employee Inspection Tasks.png'

const showProjectDetailsController = ShowProjectDetailsController.getInstance()
const state = showProjectDetailsController.state

const route = useRoute()
const GetProjectDetails = async () => {
  const projectId = Number(route.params.id)
  if (!Number.isFinite(projectId) || projectId <= 0) return

  const showProjectDetailsParams = new ShowProjectDetailsParams(projectId)
  try {
    await showProjectDetailsController.showProjectDetails(showProjectDetailsParams)
  } catch (error) {
    // The controller has already stored DataFailed; DataStatus renders it safely.
    console.error('Unable to refresh project details', error)
  }
}

// const projectOverview = computed(() => [
//   {
//     label: 'locations',
//     value: state.value.data?.locations?.length || 0,
//   },
//   {
//     label: 'zones',
//     value: state.value.data?.projectZoons?.length || 0,
//   },
//   {
//     label: 'teams',
//     value: state.value.data?.TeamLocations?.length || 0,
//   },
//   {
//     label: 'Equipment',
//     value:
//       state.value.data?.projectZoons?.reduce((total, zone) => {
//         return total + (zone?.projectZoonEquipments?.length || 0)
//       }, 0) || 0,
//   },
// ])

watch(
  () => route.params.id,
  () => {
    GetProjectDetails()
  },
  { immediate: true },
)

</script>
<template>
  <DataStatus :controller="state">
    <template #success>
      <div class="project-details-section">
        <!-- <div class="project-details-page-header">
          <div class="page-title-content">
            <span class="page-eyebrow">{{ state.data?.serialName }}</span>
            <h1 class="page-title">{{ $t('projectDetails') }}</h1>
          </div>

          <div class="project-overview-cards">
            <div class="project-overview-card" v-for="item in projectOverview" :key="item.label">
              <span class="overview-label">{{ $t(item.label) }}</span>
              <span class="overview-value">{{ item.value }}</span>
            </div>
          </div>
        </div> -->

        <ProjectHeader
          :projectName="state.data?.title"
          :SerialNumber="state.data?.SerialNumber"
          :serialName="state.data?.serialName"
          :Projectdate="state.data?.startDate"
          :Contractors="state.data?.contractors?.length"
          :endDate="state.data?.endDate"
        />

        <!-- <TodayTalkSummary :project-id="state.data?.id" :project-name="state.data?.title" /> -->

        <!-- <div class="inspections-sections">
          <InspectionsSections
            :inspectionsImage="zoneInspectionTasks"
            :inspectionHeaderTitle="'zone Inspection Tasks'"
            :inspectionHeaderSubtitle="'Track and manage all inspection assignments by zone.'"
            :showHeader="true"
            :showArrowLink="true"
            :isAssign="false"
          />
          <hr class="divider" />
          <InspectionsSections
            :inspectionsImage="EmployeeInspectionTasks"
            :inspectionHeaderTitle="'employee Inspection Tasks'"
            :inspectionHeaderSubtitle="'Track and manage all inspection assignments for employee'"
            :showHeader="false"
            :showArrowLink="false"
            :isAssign="false"
          />
        </div> -->

        <section class="project-operations-workspace">
          <MainObjectivesSection class="main-objective" :description="state.data?.description" />

          <div class="operations-intro">
            <div class="operations-title">
              <span class="operations-mark" aria-hidden="true"> <i></i><i></i><i></i> </span>
              <div>
                <!-- <span class="operations-eyebrow">{{ $t('Operational workspace') }}</span> -->
                <h2>{{ $t('Project Operational Structure & Resources') }}</h2>
                <p>
                  {{
                    $t(
                      'Manage locations, zones, workforce assignments, and equipment in one place.',
                    )
                  }}
                </p>
              </div>
            </div>

            <!-- <div class="operations-flow" aria-label="Project resource sections">
              <span><strong>01</strong>{{ $t('Sites') }}</span>
              <i aria-hidden="true"></i>
              <span><strong>02</strong>{{ $t('Teams') }}</span>
              <i aria-hidden="true"></i>
              <span><strong>03</strong>{{ $t('Equipment') }}</span>
            </div> -->
          </div>

          <div class="project-operations-stack">
            <ProjectSiteSection :locations="state.data?.locations" :projectId="state.data?.id" />

            <LocationsTeamsSection
              :teamLocations="state.data?.TeamLocations"
              :projectLocations="state.data?.project_locations"
              :hierarchy="state.data?.hierarchies"
              :orgganizationEmployeeWithHierarchy="state.data?.organization_employees"
            />
            <EquipmentSection :project_zoons="state.data?.projectZoons" />
          </div>
        </section>
      </div>
    </template>
    <template #loader>
      <ProjectPageSkeleton variant="details" />
    </template>
    <template #initial>
      <ProjectPageSkeleton variant="details" />
    </template>
    <template #empty>
      <DataEmpty
        :link="`/organization/project/add`"
        addText="Add Project"
        description="Sorry .. You have no Project .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Project"
      />
    </template>
    <template #failed>
      <DataFailed
        :link="`/organization/project/add`"
        addText="Add Project"
        description="Sorry .. You have no Project .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Project"
      />
    </template>
  </DataStatus>
</template>

<style scoped lang="scss">
.main-objective {
  margin-block: 12px;
}
.project-details-section {
  gap: 20px;
  padding: 12px;
}

.project-operations-workspace {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: 18px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 16%, var(--main-border));
  border-radius: 27px;
  background:
    radial-gradient(
      circle at 100% 0%,
      color-mix(in srgb, var(--PrimaryColor) 10%, transparent),
      transparent 27%
    ),
    linear-gradient(
      145deg,
      color-mix(in srgb, var(--PrimaryColor) 4%, transparent),
      transparent 45%
    ),
    var(--surface-2);
  box-shadow: 0 22px 55px color-mix(in srgb, var(--brand-primary-900) 10%, transparent);
}

.operations-intro {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 17px;
  padding: 17px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 13%, var(--main-border));
  border-radius: 19px;
  background: color-mix(in srgb, var(--surface-1) 88%, transparent);
}

.operations-title {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 13px;
}

.operations-mark {
  display: grid;
  width: 50px;
  height: 50px;
  flex: 0 0 50px;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  padding: 11px;
  border-radius: 16px;
  background: linear-gradient(145deg, var(--PrimaryColor), var(--brand-primary-700));
  box-shadow: 0 10px 22px color-mix(in srgb, var(--PrimaryColor) 24%, transparent);
}

.operations-mark i {
  border-radius: 3px;
  background: color-mix(in srgb, white 82%, transparent);
}

.operations-mark i:last-child {
  grid-column: 1 / -1;
}

.operations-eyebrow {
  display: block;
  margin-bottom: 3px;
  color: var(--PrimaryColor);
  font-size: 0.62rem;
  font-weight: 900;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.operations-title h2 {
  margin: 0;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: clamp(1.05rem, 1.8vw, 1.3rem);
  font-weight: 900;
}

.operations-title p {
  max-width: 600px;
  margin: 3px 0 0;
  color: var(--text-soft);
  font-size: 0.7rem;
  line-height: 1.5;
}

.operations-flow {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px;
  border: 1px solid var(--main-border);
  border-radius: 13px;
  background: var(--surface-2);
}

.operations-flow span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 8px;
  border-radius: 9px;
  color: var(--text-soft);
  font-size: 0.62rem;
  font-weight: 750;
  white-space: nowrap;
}

.operations-flow strong {
  color: var(--PrimaryColor);
  font-family: 'Bold';
}

.operations-flow > i {
  width: 15px;
  height: 1px;
  background: var(--main-border);
}

.project-operations-stack {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

@media (max-width: 920px) {
  .operations-intro {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 620px) {
  .project-details-section {
    padding: 0;
  }

  .project-operations-workspace {
    padding: 10px;
    border-radius: 20px;
  }

  .operations-intro {
    padding: 14px;
    border-radius: 16px;
  }

  .operations-title {
    align-items: flex-start;
  }

  .operations-mark {
    width: 43px;
    height: 43px;
    flex-basis: 43px;
    padding: 9px;
    border-radius: 13px;
  }

  .operations-flow {
    width: 100%;
    overflow-x: auto;
  }
}
</style>
