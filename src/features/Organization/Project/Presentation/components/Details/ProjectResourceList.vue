<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import ProjectCustomLocationParams from '../../../Core/params/ProjectCustomLocationParams'
import { ProjectCustomLocationEnum } from '../../../Core/Enums/ProjectCustomLocationEnum'
import ProjectCustomLocationController from '../../controllers/ProjectCustomLocationController'
import ShowProjectDetailsController from '../../controllers/ShowProjectDetailsController'
import ShowProjectDetailsParams from '../../../Core/params/ShowProjectDetailsParams'
import type ProjectCustomLocationModel from '../../../Data/models/CustomLocation/ProjectCustomLocationModel'
import AddDrillDialog from '../Dialogs/Drill/AddDrillDialog.vue'
import AddProjectMeetingDialog from './ProjectMeeting/AddProjectMeetingDialog.vue'
import ProjectLocationZoonDialog from './ProjectSite/ProjectLocationZoonDialog.vue'
import AddCreateTeam from '../Dialogs/CreateTeamDialog/AddCreateTeam.vue'
import AddEquipmentDialog from '../Dialogs/AddEquipmentDialog.vue'
import FetchProjectMeetingsController from '../../controllers/ProjectMeeting/FetchProjectMeetingsController'
import FetchProjectMeetingsParams from '../../../Core/params/ProjectMeeting/FetchProjectMeetingsParams'
import type DrillModel from '../../../Data/models/Drill/DrillModel'
import type DrillTimelineItemModel from '../../../Data/models/Drill/DrillTimelineItemModel'
import type ProjectMeetingModel from '../../../Data/models/ProjectMeeting/ProjectMeetingModel'
import FetchDrillPlansParams from '../../../Core/params/Drill/FetchDrillPlansParams'
import FetchDrillPlansController from '../../controllers/Drill/FetchDrillPlansController'
import DrillDetailsDialog from '../Dialogs/Drill/DrillDetailsDialog.vue'
import MeetingResultDialog from './ProjectMeeting/MeetingResultDialog.vue'

type ResourceKey =
  | 'locations'
  | 'zones'
  | 'equipment'
  | 'employees'
  | 'teams'
  | 'hierarchies'
  | 'contractors'
  | 'drills'
  | 'meetings'

type ResourceItem = {
  key: string
  title: string
  subtitle: string
  location: string
  detail?: string
  image?: string
  badge?: string
  employeeId?: number
  equipmentId?: number
  drill?: DrillModel
  meeting?: ProjectMeetingModel
}

type ResourceDialogHandle = {
  openDialog: () => void
}

const route = useRoute()
const router = useRouter()
const customLocationController = ProjectCustomLocationController.getInstance()
const detailsController = ShowProjectDetailsController.getInstance()
const meetingsController = FetchProjectMeetingsController.getInstance()
const customState = ref(customLocationController.state.value)
const detailsState = detailsController.state
const meetingsState = meetingsController.state
const isLoading = ref(false)
const errorMessage = ref('')
const showAddOptions = ref(false)
const selectedDrill = ref<DrillModel | null>(null)
const selectedDrillPlans = ref<DrillTimelineItemModel[]>([])
const selectedDrillPlansLoading = ref(false)
const selectedMeeting = ref<ProjectMeetingModel | null>(null)
const drillDialog = ref<ResourceDialogHandle | null>(null)
const meetingDialog = ref<ResourceDialogHandle | null>(null)

const projectId = computed(() => Number(route.params.id))
const resource = computed<ResourceKey>(() => {
  const value = String(route.params.resource || 'locations') as ResourceKey
  return resourceDefinitions[value] ? value : 'locations'
})

const resourceDefinitions: Record<
  ResourceKey,
  { title: string; description: string; types: ProjectCustomLocationEnum[] }
> = {
  locations: {
    title: 'Project locations',
    description: 'Operational locations assigned to this project.',
    types: [ProjectCustomLocationEnum.ZOON],
  },
  zones: {
    title: 'Project zones',
    description: 'Work zones grouped by their assigned project location.',
    types: [ProjectCustomLocationEnum.ZOON],
  },
  equipment: {
    title: 'Project equipment',
    description: 'Equipment, tools and devices assigned across project zones.',
    types: [ProjectCustomLocationEnum.ZOON, ProjectCustomLocationEnum.ZOON_EQUIPMENT],
  },
  employees: {
    title: 'Project employees',
    description: 'Employees assigned directly, through teams, or through project positions.',
    types: [
      ProjectCustomLocationEnum.EMPLOYEE,
      ProjectCustomLocationEnum.TEAM,
      ProjectCustomLocationEnum.TEAM_EMPLOYEE,
      ProjectCustomLocationEnum.HIERARCHY,
      ProjectCustomLocationEnum.HIERARCHY_EMPLOYEE,
    ],
  },
  teams: {
    title: 'Project teams',
    description: 'Teams and team members grouped by project location.',
    types: [ProjectCustomLocationEnum.TEAM, ProjectCustomLocationEnum.TEAM_EMPLOYEE],
  },
  hierarchies: {
    title: 'Project positions',
    description: 'Hierarchy positions and their assigned employees.',
    types: [ProjectCustomLocationEnum.HIERARCHY, ProjectCustomLocationEnum.HIERARCHY_EMPLOYEE],
  },
  contractors: {
    title: 'Project contractors',
    description: 'Contractors currently connected to this project.',
    types: [ProjectCustomLocationEnum.CONTRUCTOR],
  },
  drills: {
    title: 'Project emergency drills',
    description: 'Emergency preparedness drills recorded for this project.',
    types: [],
  },
  meetings: {
    title: 'Project safety meetings',
    description: 'Safety meetings and engagement sessions for this project.',
    types: [],
  },
}

const definition = computed(() => resourceDefinitions[resource.value])
const locations = computed<ProjectCustomLocationModel[]>(() => customState.value.data ?? [])
const zones = computed(() => locations.value.flatMap((location) => location.locationZones ?? []))
const hasScopedAddAction = computed(() =>
  ['zones', 'equipment', 'employees', 'teams', 'hierarchies'].includes(resource.value),
)
const workflowAction = computed(() => {
  if (resource.value === 'locations') {
    return {
      label: 'Add project location',
      to: `/organization/project/flow/${projectId.value}/1?edit=1&return_to=summary`,
    }
  }
  if (resource.value === 'contractors') {
    return {
      label: 'Add contractor',
      to: `/organization/project/flow/${projectId.value}/1?edit=1&return_to=summary`,
    }
  }
  return null
})
const addActionLabel = computed(
  () =>
    ({
      zones: 'Add zone',
      equipment: 'Add equipment',
      employees: 'Add employee',
      teams: 'Add team',
      hierarchies: 'Add position',
    })[resource.value] ?? 'Add',
)

const locationId = (location: ProjectCustomLocationModel) => Number(location.id)

const projectLabel = computed(() =>
  definition.value.types.length
    ? detailsState.value.data?.title
    : `Project #${projectId.value}` || `Project #${projectId.value}`,
)

const uniqueItems = (items: ResourceItem[]) =>
  Array.from(new Map(items.map((item) => [item.key, item])).values())

const resourceItems = computed<ResourceItem[]>(() => {
  if (resource.value === 'contractors') {
    return (locations.value[0]?.contractors ?? []).map((contractor, index) => ({
      key: `contractor-${contractor.id || index}`,
      title: contractor.name || 'Contractor',
      subtitle: 'Project contractor',
      location: `Project #${projectId.value}`,
      detail: contractor.companyEmail || contractor.phone || '',
      badge: 'Contractor',
    }))
  }

  if (resource.value === 'drills') {
    return (detailsState.value.data?.drills ?? []).map((drill, index) => ({
      key: `drill-${drill.id || index}`,
      title: drill.drillType?.title || `Emergency drill ${index + 1}`,
      subtitle: drill.serialNumber || 'Emergency preparedness drill',
      location: drill.projectTeam?.title || detailsState.value.data?.title || 'Project',
      detail: [drill.date, drill.time].filter(Boolean).join(' · '),
      badge: 'Drill',
      drill,
    }))
  }

  if (resource.value === 'meetings') {
    return (meetingsState.value.data ?? []).map((meeting, index) => ({
      key: `meeting-${meeting.id || index}`,
      title: meeting.serialName || `Safety meeting ${index + 1}`,
      subtitle: `${meeting.hierarchies?.length ?? 0} participating positions`,
      location: meeting.teamLeader?.name || `Project #${projectId.value}`,
      detail: meeting.date || '',
      badge: 'Meeting',
      meeting,
    }))
  }

  if (resource.value === 'locations') {
    return locations.value.map((location, index) => ({
      key: `location-${location.projectLocationId || location.id || index}`,
      title: location.title || `Location ${index + 1}`,
      subtitle: `${location.locationZones?.length ?? 0} zones`,
      location: 'Project location',
      detail: `${location.locationTeams?.length ?? 0} teams · ${location.locationEmplyees?.length ?? 0} employees`,
      badge: 'Location',
    }))
  }

  if (resource.value === 'zones') {
    return locations.value.flatMap((location) =>
      (location.locationZones ?? []).map((zone, index) => ({
        key: `zone-${zone.projectZoonId || zone.zoonId || index}-${location.projectLocationId}`,
        title: zone.zoonTitle || zone.title || `Zone ${index + 1}`,
        subtitle: `${zone.projectZoonEquipments?.length ?? 0} assigned equipment`,
        location: location.title || 'Project location',
        badge: 'Zone',
      })),
    )
  }

  if (resource.value === 'equipment') {
    return uniqueItems(
      locations.value.flatMap((location) =>
        (location.locationZones ?? []).flatMap((zone) =>
          (zone.projectZoonEquipments ?? []).map((equipment, index) => ({
            key: `equipment-${equipment.id || equipment.projectZoonEquipmentId || index}`,
            title: equipment.title || equipment.equipment?.title || 'Equipment',
            subtitle:
              equipment.equipmenType?.title ||
              equipment.equipment?.equipment_type?.title ||
              'Asset',
            location: `${location.title || 'Location'} · ${zone.zoonTitle || zone.title || 'Zone'}`,
            detail: equipment.equipment?.licensePlateNumber || equipment.equipmentDescription || '',
            badge: 'Equipment',
            equipmentId: Number(equipment.equipment?.id || equipment.id),
          })),
        ),
      ),
    )
  }

  if (resource.value === 'teams') {
    return uniqueItems(
      locations.value.flatMap((location) =>
        (location.locationTeams ?? []).map((team, index) => ({
          key: `team-${team.projectLocationTeamId || team.teamId || index}`,
          title: team.teamTitle || team.title || 'Team',
          subtitle: `${team.Employees?.length ?? 0} team members`,
          location: location.title || 'Project location',
          badge: 'Team',
        })),
      ),
    )
  }

  if (resource.value === 'hierarchies') {
    return uniqueItems(
      locations.value.flatMap((location) =>
        (location.locationHierarchy ?? []).map((hierarchy, index) => ({
          key: `hierarchy-${hierarchy.projectLocationHierarchyId || hierarchy.id || index}`,
          title: hierarchy.title || 'Project position',
          subtitle: `${hierarchy.Employees?.length ?? 0} assigned employees`,
          location: location.title || 'Project location',
          badge: 'Position',
        })),
      ),
    )
  }

  return uniqueItems(
    locations.value.flatMap((location) => {
      const directEmployees = location.locationEmplyees ?? []
      const teamEmployees = (location.locationTeams ?? []).flatMap((team) => team.Employees ?? [])
      const hierarchyEmployees = (location.locationHierarchy ?? []).flatMap(
        (hierarchy) => hierarchy.Employees ?? [],
      )

      return [...directEmployees, ...teamEmployees, ...hierarchyEmployees].map(
        (employee, index) => ({
          key: `employee-${employee.organization_employee_id || employee.employeeId || index}`,
          title: employee.name || 'Employee',
          subtitle:
            employee.hierarchyposition
              ?.map((position) => position.title)
              .filter(Boolean)
              .join(', ') ||
            employee.hierarchy
              ?.map((position) => position.title)
              .filter(Boolean)
              .join(', ') ||
            'Project employee',
          location: location.title || 'Project location',
          detail: employee.email || '',
          image: employee.image,
          badge: employee.is_leader ? 'Team leader' : 'Employee',
          employeeId: Number(employee.organization_employee_id || employee.employeeId),
        }),
      )
    }),
  )
})

const isActionableItem = (item: ResourceItem) =>
  Boolean(item.employeeId || item.equipmentId || item.drill || item.meeting)

const fetchSelectedDrillPlans = async () => {
  const drillId = selectedDrill.value?.id
  if (!drillId) return

  selectedDrillPlansLoading.value = true
  const controller = FetchDrillPlansController.getInstance()

  try {
    await controller.fetchPlans(new FetchDrillPlansParams(drillId))
    if (controller.isDataSuccess()) {
      selectedDrillPlans.value = controller.state.value.data ?? []
    }
  } finally {
    selectedDrillPlansLoading.value = false
  }
}

const openResourceItem = async (item: ResourceItem) => {
  if (item.employeeId) {
    await router.push(`/organization/organization-employee/show/${item.employeeId}`)
    return
  }

  if (item.equipmentId) {
    await router.push(`/organization/equipment-show/${item.equipmentId}`)
    return
  }

  if (item.drill) {
    selectedDrill.value = item.drill
    selectedDrillPlans.value = item.drill.planning ?? []
    await nextTick()
    drillDialog.value?.openDialog()
    return
  }

  if (item.meeting) {
    selectedMeeting.value = item.meeting
    await nextTick()
    meetingDialog.value?.openDialog()
  }
}

const fetchResource = async () => {
  if (!Number.isFinite(projectId.value) || projectId.value <= 0) return

  isLoading.value = true
  errorMessage.value = ''
  try {
    if (definition.value.types.length) {
      await customLocationController.getData(
        new ProjectCustomLocationParams(projectId.value, definition.value.types, []),
      )
      customState.value = customLocationController.state.value
    } else if (resource.value === 'meetings') {
      await meetingsController.fetchMeetings(
        new FetchProjectMeetingsParams(projectId.value, 1, 100, 0),
      )
    } else {
      await detailsController.showProjectDetails(new ShowProjectDetailsParams(projectId.value))
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to load project data.'
  } finally {
    isLoading.value = false
  }
}

watch(
  () => [route.params.id, route.params.resource],
  () => fetchResource(),
  { immediate: true },
)

watch(
  () => customLocationController.state.value,
  (newState) => {
    customState.value = newState
  },
)

watch(resource, () => {
  showAddOptions.value = false
  selectedDrill.value = null
  selectedMeeting.value = null
})
</script>

<template>
  <main class="resource-page">
    <header class="resource-hero">
      <div>
        <RouterLink :to="`/organization/project-summary/${projectId}`" class="back-link">
          <span aria-hidden="true">←</span> Project summary
        </RouterLink>
        <span class="resource-eyebrow">{{ projectLabel }}</span>
        <h1>{{ definition.title }}</h1>
        <p>{{ definition.description }}</p>
      </div>
      <div class="resource-hero__actions">
        <div class="resource-total">
          <strong>{{ resourceItems.length }}</strong>
          <span>{{ resource }}</span>
        </div>

        <AddDrillDialog
          v-if="resource === 'drills'"
          :project-id="projectId"
          compact
          @saved="fetchResource"
        />
        <AddProjectMeetingDialog
          v-else-if="resource === 'meetings'"
          :project-id="projectId"
          compact
          @saved="fetchResource"
        />
        <RouterLink v-else-if="workflowAction" :to="workflowAction.to" class="resource-add-button">
          <span aria-hidden="true">+</span>{{ workflowAction.label }}
        </RouterLink>
        <button
          v-else-if="hasScopedAddAction"
          type="button"
          class="resource-add-button"
          :aria-expanded="showAddOptions"
          aria-controls="resource-add-options"
          @click="showAddOptions = !showAddOptions"
        >
          <span aria-hidden="true">+</span>{{ addActionLabel }}
        </button>
      </div>
    </header>

    <section
      v-if="showAddOptions && hasScopedAddAction"
      id="resource-add-options"
      class="resource-add-panel"
    >
      <header>
        <div>
          <span>Choose assignment scope</span>
          <h2>{{ addActionLabel }}</h2>
          <p>Select the location or zone where the new assignment belongs.</p>
        </div>
        <button type="button" aria-label="Close add options" @click="showAddOptions = false">
          ×
        </button>
      </header>

      <div v-if="resource === 'equipment' && zones.length" class="resource-add-panel__single">
        <div>
          <strong>Project equipment</strong>
          <small>{{ zones.length }} zones available</small>
        </div>
        <AddEquipmentDialog :project_zoons="zones" />
      </div>

      <div v-else-if="locations.length" class="resource-add-scopes">
        <article v-for="location in locations" :key="location.projectLocationId || location.id">
          <span class="resource-add-scopes__icon">{{ location.title?.charAt(0) || 'L' }}</span>
          <div>
            <strong>{{ location.title || 'Project location' }}</strong>
            <small>{{ location.locationZones?.length ?? 0 }} zones</small>
          </div>

          <RouterLink
            v-if="resource === 'employees'"
            :to="`/organization/project-employee/project/${projectId}?locationId=${locationId(location)}&return_to=summary`"
            class="scope-action"
          >
            Add employee <span aria-hidden="true">→</span>
          </RouterLink>
          <RouterLink
            v-else-if="resource === 'hierarchies'"
            :to="`/organization/project-hierarchy/project/${projectId}?locationId=${locationId(location)}&return_to=summary`"
            class="scope-action"
          >
            Add position <span aria-hidden="true">→</span>
          </RouterLink>
          <ProjectLocationZoonDialog
            v-else-if="resource === 'zones'"
            :LocationId="locationId(location)"
            :projectId="projectId"
            @update:data="fetchResource"
          />
          <AddCreateTeam
            v-else-if="resource === 'teams'"
            :ProjectLocationId="location.projectLocationId"
            :LocationId="locationId(location)"
            @update:data="fetchResource"
          />
        </article>
      </div>

      <div v-else class="resource-add-panel__empty">
        <p>Add a project location before assigning {{ resource }}.</p>
        <RouterLink :to="`/organization/project/flow/${projectId}/1?edit=1&return_to=summary`">
          Add project location
        </RouterLink>
      </div>
    </section>

    <section v-if="isLoading" class="resource-grid" aria-label="Loading project data">
      <span v-for="index in 6" :key="index" class="resource-skeleton"></span>
    </section>

    <DataFailed
      v-else-if="errorMessage"
      :title="`Unable to load ${resource}`"
      :description="errorMessage"
      :link="`/organization/project-summary/${projectId}`"
      add-text="Back to project summary"
    />

    <section v-else-if="resourceItems.length" class="resource-grid" :data-resource="resource">
      <article
        v-for="(item, index) in resourceItems"
        :key="item.key"
        class="resource-card"
        :class="{ 'resource-card--actionable': isActionableItem(item) }"
        :role="
          isActionableItem(item)
            ? item.employeeId || item.equipmentId
              ? 'link'
              : 'button'
            : undefined
        "
        :tabindex="isActionableItem(item) ? 0 : undefined"
        @click="openResourceItem(item)"
        @keydown.enter="openResourceItem(item)"
        @keydown.space.prevent="openResourceItem(item)"
      >
        <span class="resource-card__glow" aria-hidden="true"></span>
        <header class="resource-card__header">
          <span class="resource-card__avatar" :class="{ 'has-image': item.image }">
            <img v-if="item.image" :src="item.image" :alt="item.title" />
            <b v-else>{{ item.title.charAt(0).toUpperCase() }}</b>
            <i aria-hidden="true"></i>
          </span>

          <div class="resource-card__heading">
            <div class="resource-card__meta">
              <span class="resource-card__badge"><i></i>{{ item.badge }}</span>
              <span class="resource-card__number">{{ String(index + 1).padStart(2, '0') }}</span>
            </div>
            <h2 :title="item.title">{{ item.title }}</h2>
          </div>
        </header>

        <p class="resource-card__description">{{ item.subtitle }}</p>

        <footer class="resource-card__footer">
          <span class="resource-card__info" :title="item.location">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 21s6-5.15 6-11a6 6 0 1 0-12 0c0 5.85 6 11 6 11Z" />
              <circle cx="12" cy="10" r="2.2" />
            </svg>
            <small>{{ item.location }}</small>
          </span>
          <span v-if="item.detail" class="resource-card__info" :title="item.detail">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5M12 8h.01" />
            </svg>
            <small>{{ item.detail }}</small>
          </span>
        </footer>
      </article>
    </section>

    <section v-else class="resource-empty">
      <span aria-hidden="true">0</span>
      <h2>No {{ resource }} found</h2>
      <p>This project does not currently have matching {{ resource }} assignments.</p>
      <RouterLink :to="`/organization/project-details/${projectId}`">Open full details</RouterLink>
    </section>

    <DrillDetailsDialog
      v-if="selectedDrill"
      ref="drillDialog"
      triggerless
      :key="selectedDrill.id"
      :drill="selectedDrill"
      :project-id="projectId"
      :plans="selectedDrillPlans"
      :plans-loading="selectedDrillPlansLoading"
      @opened="fetchSelectedDrillPlans"
      @saved="fetchSelectedDrillPlans"
    />

    <MeetingResultDialog
      v-if="selectedMeeting"
      ref="meetingDialog"
      triggerless
      :key="selectedMeeting.id"
      :meeting="selectedMeeting"
      :project-id="projectId"
      @saved="fetchResource"
    />
  </main>
</template>

<style scoped lang="scss">
.resource-page {
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 12px;
}
.resource-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  overflow: hidden;
  padding: 28px;
  border-radius: 26px;
  background: linear-gradient(130deg, var(--brand-secondary-900), var(--brand-primary-700));
  color: var(--text-on-brand);
  box-shadow: 0 22px 52px color-mix(in srgb, var(--identity-secondary) 20%, transparent);
}
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 22px;
  color: color-mix(in srgb, var(--identity-primary) 42%, var(--text-on-brand));
  font-size: 0.78rem;
  font-weight: 850;
}
[dir='rtl'] .back-link span {
  transform: rotate(180deg);
}
.resource-eyebrow {
  display: block;
  margin-bottom: 6px;
  color: color-mix(in srgb, var(--identity-accent) 35%, var(--text-on-brand));
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.resource-hero h1 {
  margin: 0;
  font-size: clamp(1.7rem, 3vw, 2.45rem);
}
.resource-hero p {
  max-width: 680px;
  margin: 9px 0 0;
  color: color-mix(in srgb, var(--text-on-brand) 72%, transparent);
}
.resource-total {
  display: flex;
  min-width: 120px;
  align-items: center;
  flex-direction: column;
  padding: 16px 22px;
  border: 1px solid color-mix(in srgb, var(--text-on-brand) 20%, transparent);
  border-radius: 18px;
  background: color-mix(in srgb, var(--text-on-brand) 10%, transparent);
  backdrop-filter: blur(8px);
}
.resource-total strong {
  font-size: 2rem;
  line-height: 1;
}
.resource-total span {
  margin-top: 6px;
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.resource-hero__actions {
  display: flex;
  flex: 0 0 auto;
  align-items: stretch;
  gap: 10px;
}
.resource-add-button {
  display: inline-flex;
  min-height: 58px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 18px;
  border: 1px solid color-mix(in srgb, var(--text-on-brand) 24%, transparent);
  border-radius: 18px;
  background: color-mix(in srgb, var(--text-on-brand) 14%, transparent);
  color: var(--text-on-brand);
  font: 0.76rem 'Bold';
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition:
    transform 0.2s ease,
    background 0.2s ease;
}
.resource-add-button:hover {
  transform: translateY(-2px);
  background: color-mix(in srgb, var(--text-on-brand) 22%, transparent);
}
.resource-add-button > span {
  font-size: 1.2rem;
  line-height: 1;
}
.resource-add-panel {
  padding: 18px;
  border: 1px solid color-mix(in srgb, var(--identity-primary) 20%, var(--main-border));
  border-radius: 22px;
  background: var(--surface-1);
  box-shadow: 0 18px 38px color-mix(in srgb, var(--text-strong) 7%, transparent);
}
.resource-add-panel > header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}
.resource-add-panel > header span {
  color: var(--identity-primary);
  font-size: 0.62rem;
  font-weight: 900;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}
.resource-add-panel > header h2 {
  margin: 3px 0;
  color: var(--text-strong);
  font-size: 1.1rem;
}
.resource-add-panel > header p {
  margin: 0;
  color: var(--text-soft);
  font-size: 0.72rem;
}
.resource-add-panel > header > button {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 1px solid var(--main-border);
  border-radius: 11px;
  background: var(--surface-2);
  color: var(--text-soft);
  font-size: 1.15rem;
  cursor: pointer;
}
.resource-add-scopes {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.resource-add-scopes article,
.resource-add-panel__single {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 11px;
  padding: 12px;
  border: 1px solid var(--main-border);
  border-radius: 15px;
  background: var(--surface-2);
}
.resource-add-scopes__icon {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  place-items: center;
  border-radius: 12px;
  background: color-mix(in srgb, var(--identity-primary) 12%, var(--surface-1));
  color: var(--identity-primary);
  font-weight: 900;
}
.resource-add-scopes article > div,
.resource-add-panel__single > div {
  min-width: 0;
  margin-inline-end: auto;
}
.resource-add-scopes strong,
.resource-add-scopes small,
.resource-add-panel__single strong,
.resource-add-panel__single small {
  display: block;
}
.resource-add-scopes strong,
.resource-add-panel__single strong {
  overflow: hidden;
  color: var(--text-strong);
  font-size: 0.77rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.resource-add-scopes small,
.resource-add-panel__single small {
  margin-top: 2px;
  color: var(--text-muted);
  font-size: 0.65rem;
}
.scope-action,
.resource-add-panel__empty a {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 10px;
  background: var(--identity-primary);
  color: var(--text-on-brand);
  font-size: 0.67rem;
  font-weight: 850;
}
.resource-add-panel__empty {
  padding: 20px;
  border: 1px dashed var(--main-border);
  border-radius: 15px;
  text-align: center;
}
.resource-add-panel__empty p {
  margin: 0 0 10px;
  color: var(--text-soft);
}
.resource-add-panel :deep(.add-zone),
.resource-add-panel :deep(.create-team-trigger),
.resource-add-panel :deep(.add-equipment-icon) {
  flex: 0 0 auto;
  margin: 0;
}
.resource-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  --resource-card-accent: var(--identity-primary);
  --resource-card-accent-soft: var(--identity-accent);
  --resource-card-status: var(--identity-accent);
}
.resource-grid[data-resource='employees'],
.resource-grid[data-resource='teams'] {
  --resource-card-accent: var(--identity-primary);
  --resource-card-accent-soft: var(--identity-accent);
  --resource-card-status: var(--identity-secondary);
}
.resource-grid[data-resource='equipment'],
.resource-grid[data-resource='zones'] {
  --resource-card-accent: var(--identity-secondary);
  --resource-card-accent-soft: var(--identity-primary);
  --resource-card-status: var(--identity-accent);
}
.resource-grid[data-resource='meetings'],
.resource-grid[data-resource='drills'] {
  --resource-card-accent: var(--identity-accent);
  --resource-card-accent-soft: var(--identity-primary);
  --resource-card-status: var(--identity-secondary);
}
.resource-grid[data-resource='contractors'],
.resource-grid[data-resource='locations'] {
  --resource-card-accent: var(--identity-secondary);
  --resource-card-accent-soft: var(--identity-accent);
  --resource-card-status: var(--identity-primary);
}
.resource-card {
  position: relative;
  isolation: isolate;
  display: flex;
  min-width: 0;
  min-height: 218px;
  overflow: hidden;
  flex-direction: column;
  padding: 20px;
  border: 1px solid color-mix(in srgb, var(--resource-card-accent) 15%, var(--main-border));
  border-radius: 24px;
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--resource-card-accent) 4%, var(--surface-1)),
    var(--surface-1) 58%
  );
  box-shadow:
    0 18px 44px color-mix(in srgb, var(--text-strong) 7%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--surface-1) 72%, transparent);
  transition:
    transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1),
    border-color 0.28s ease,
    box-shadow 0.28s ease;
}
.resource-card::before {
  position: absolute;
  z-index: 2;
  top: 0;
  inset-inline: 22px;
  height: 3px;
  border-radius: 0 0 8px 8px;
  background: linear-gradient(90deg, var(--resource-card-accent), var(--resource-card-accent-soft));
  content: '';
  opacity: 0.78;
  transform: scaleX(0.45);
  transform-origin: center;
  transition:
    transform 0.28s ease,
    opacity 0.28s ease;
}
.resource-card:hover {
  transform: translateY(-6px);
  border-color: color-mix(in srgb, var(--resource-card-accent) 38%, var(--main-border));
  box-shadow:
    0 24px 54px color-mix(in srgb, var(--resource-card-accent) 14%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--surface-1) 78%, transparent);
}
.resource-card--actionable {
  cursor: pointer;
}
.resource-card--actionable:focus-visible {
  border-color: var(--resource-card-accent);
  outline: 3px solid color-mix(in srgb, var(--resource-card-accent) 24%, transparent);
  outline-offset: 3px;
}
.resource-card:hover::before {
  opacity: 1;
  transform: scaleX(1);
}
.resource-card__glow {
  position: absolute;
  z-index: -1;
  top: -78px;
  inset-inline-end: -62px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--resource-card-accent) 11%, transparent);
  filter: blur(2px);
  transition:
    transform 0.35s ease,
    background 0.35s ease;
}
.resource-card:hover .resource-card__glow {
  background: color-mix(in srgb, var(--resource-card-accent) 17%, transparent);
  transform: scale(1.14);
}
.resource-card__header {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 13px;
}
.resource-card__avatar {
  position: relative;
  display: grid;
  width: 58px;
  height: 58px;
  flex: 0 0 58px;
  overflow: hidden;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--resource-card-accent) 26%, transparent);
  border-radius: 19px;
  background: linear-gradient(
    145deg,
    var(--resource-card-accent),
    var(--resource-card-accent-soft)
  );
  color: var(--text-on-brand);
  box-shadow: 0 11px 24px color-mix(in srgb, var(--resource-card-accent) 22%, transparent);
  font-size: 1.12rem;
  transition: transform 0.28s ease;
}
.resource-card:hover .resource-card__avatar {
  transform: rotate(-3deg) scale(1.04);
}
.resource-card__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.resource-card__avatar i {
  position: absolute;
  right: 5px;
  bottom: 5px;
  width: 7px;
  height: 7px;
  border: 2px solid var(--surface-1);
  border-radius: 50%;
  background: var(--resource-card-status);
  box-sizing: content-box;
}
.resource-card__heading {
  flex: 1;
  min-width: 0;
}
.resource-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 6px;
}
.resource-card__badge {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  border: 1px solid color-mix(in srgb, var(--resource-card-accent) 16%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--resource-card-accent) 8%, var(--surface-1));
  color: var(--resource-card-accent);
  font-size: 0.58rem;
  font-weight: 900;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}
.resource-card__badge i {
  width: 5px;
  height: 5px;
  flex: 0 0 5px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 0 3px color-mix(in srgb, currentColor 13%, transparent);
}
.resource-card__number {
  color: color-mix(in srgb, var(--text-muted) 60%, transparent);
  font: 0.68rem 'Bold';
  letter-spacing: 0.08em;
}
.resource-card h2 {
  margin: 0;
  overflow: hidden;
  color: var(--text-strong);
  font: 1rem 'Bold';
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.resource-card__description {
  display: -webkit-box;
  min-height: 42px;
  overflow: hidden;
  margin: 18px 0;
  color: var(--text-soft);
  font-size: 0.73rem;
  line-height: 1.6;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.resource-card__footer {
  display: grid;
  gap: 8px;
  margin-top: auto;
  padding-top: 13px;
  border-top: 1px solid color-mix(in srgb, var(--main-border) 78%, transparent);
}
.resource-card__info {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 7px;
}
.resource-card__info svg {
  width: 15px;
  height: 15px;
  flex: 0 0 15px;
  color: var(--resource-card-accent);
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.resource-card__info small {
  overflow: hidden;
  color: var(--text-muted);
  font-size: 0.66rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.resource-skeleton {
  min-height: 132px;
  border-radius: 20px;
  background: linear-gradient(90deg, var(--surface-2), var(--main-border), var(--surface-2));
  background-size: 220% 100%;
  animation: resource-pulse 1.3s ease infinite;
}
.resource-empty {
  padding: 56px 24px;
  border: 1px dashed color-mix(in srgb, var(--identity-primary) 35%, var(--main-border));
  border-radius: 24px;
  background: var(--surface-2);
  text-align: center;
}
.resource-empty > span {
  display: grid;
  width: 58px;
  height: 58px;
  margin: 0 auto 14px;
  place-items: center;
  border-radius: 18px;
  background: var(--brand-primary-100);
  color: var(--identity-primary);
  font-size: 1.3rem;
  font-weight: 900;
}
.resource-empty h2 {
  margin: 0;
  color: var(--text-strong);
}
.resource-empty p {
  color: var(--text-soft);
}
.resource-empty a {
  display: inline-flex;
  margin-top: 7px;
  padding: 10px 15px;
  border-radius: 12px;
  background: var(--identity-primary);
  color: var(--text-on-brand);
  font-weight: 800;
}
@keyframes resource-pulse {
  to {
    background-position: -120% 0;
  }
}
@media (max-width: 980px) {
  .resource-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 620px) {
  .resource-page {
    padding: 4px;
  }
  .resource-hero {
    align-items: flex-start;
    flex-direction: column;
    padding: 22px 18px;
  }
  .resource-hero__actions {
    width: 100%;
  }
  .resource-total {
    min-width: 0;
    flex: 1;
  }
  .resource-add-button {
    flex: 1;
  }
  .resource-add-scopes {
    grid-template-columns: 1fr;
  }
  .resource-grid {
    grid-template-columns: 1fr;
  }
}
</style>
