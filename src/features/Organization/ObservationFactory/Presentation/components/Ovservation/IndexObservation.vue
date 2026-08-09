<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import Image from 'primevue/image'
// import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import TitleInterface from '@/base/Data/Models/title_interface'
import ViewIcon from '@/shared/icons/ViewIcon.vue'

import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import IndexHazardController from '../../controllers/indexHazardController'
import IndexHazardParams from '../../../Core/params/indexHazardParams'
import { Observation } from '../../../Core/Enums/ObservationTypeEnum'
import DeleteHazardParams from '../../../Core/params/deleteHazardParams'
import DeleteHazardController from '../../controllers/deleteHazardController'
import IndexHazardHeader from '../Hazard/HazardUtils/IndexHazardHeader.vue'
import IndexFilter from '../Hazard/HazardUtils/IndexFilter.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import type MyProjectsModel from '../../../Data/models/MyProjectsModel'
import FetchMyProjectsParams from '../../../Core/params/fetchMyProjectsParams'
import FetchMyProjectsController from '../../controllers/FetchMyProjectsController'
import type MyZonesModel from '../../../Data/models/MyZonesModel'
import FetchMyZonesController from '../../controllers/FetchMyZonesController'
import FetchMyZonesParams from '../../../Core/params/FetchMyZonesParams'
import IndexEquipmentMangement from '../indexEquipmentMangement.vue'
import { RiskLevelEnum } from '../../../Core/Enums/risk_level_enum'
import PinIcons from '@/shared/icons/PinIcons.vue'
import HighLevel from '@/shared/icons/highlevel.vue'
import { SaveStatusEnum } from '../../../Core/Enums/save_status_enum'
import { ActionStatusEnum } from '../../../Core/Enums/ActionStatusEnum'
import ToggleObservationActionStatusParams from '../../../Core/params/ToggleObservationActionStatusParams'
import ToggleObservationActionStatusController from '../../controllers/ToggleObservationActionStatusController'
import ToggleObservationWorkStoppedController from '../../controllers/ToggleObservationWorkStoppedController'
import ToggleObservationWorkStoppedParams from '../../../Core/params/ToggleObservationWorkStoppedParams'
import CustomCheckbox from '@/shared/HelpersComponents/CustomCheckbox.vue'
import CustomCheckboxToggle from '../../SubComponent/CustomCheckboxToggle.vue'
import CardSkelaton from '@/features/Organization/Inspection/Presentation/components/SubComponent/CardSkelaton.vue'
import { useThemeMode } from '@/composables/useThemeMode'
import IndexFilterDialog from '@/shared/HelpersComponents/IndexFilterDialog.vue'
import { useProjectSelectStore } from '@/stores/ProjectSelect'
// import FilterDialog from '../Hazard/HazardUtils/filterDialog.vue'
const { t } = useI18n()
const { isDarkMode } = useThemeMode()
const ProjectSelect = useProjectSelectStore()

// import DialogChangeStatusHazard from "@/features/setting/Hazard/Presentation/components/Hazard/DialogChangeStatusHazard.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const filterDate = ref('')
const filterSaveStatus = ref<number | null>(null)
const filterRiskLevel = ref<number | null>(null)
const filterFields = [
  {
    key: 'saveStatus',
    label: 'Observation Type',
    options: [
      new TitleInterface({ id: SaveStatusEnum.Saved, title: t('Positive') }),
      new TitleInterface({ id: SaveStatusEnum.NotSaved, title: t('Negative') }),
    ],
  },
  {
    key: 'riskLevel',
    label: 'Risk Level',
    options: [
      new TitleInterface({ id: RiskLevelEnum.High, title: t('High') }),
      new TitleInterface({ id: RiskLevelEnum.Medium, title: t('Medium') }),
      new TitleInterface({ id: RiskLevelEnum.Low, title: t('Low') }),
    ],
  },
]
const indexHazardController = IndexHazardController.getInstance()
const state = ref(indexHazardController.state.value)
const route = useRoute()
const id = route.params.parent_id
// const type = ref<HazardStatusEnum>(HazardStatusEnum[route.params.type as keyof typeof HazardStatusEnum])

const fetchHazard = async (
  query = '',
  pageNumber = 1,
  perPage = 10,
  withPage = 1,
  projectZoneLozationId?: number[],
  projectLocationIds?: number[],
  zoonIds?: number[],
  projectIds?: number,
) => {
  const params = new IndexHazardParams(
    query,
    pageNumber,
    perPage,
    withPage,
    [Observation.ObservationType, Observation.HazardType],
    route.query.hazard || route.query.risk_level ? null : projectIds ? [projectIds] : [],
    zoonIds,
    projectLocationIds || null,
    projectZoneLozationId,
    null,
    route.query.hazard ? route.query.hazard : null,
    filterRiskLevel.value != null
      ? [filterRiskLevel.value]
      : route.query.risk_level
        ? [Number(route.query.risk_level)]
        : null,
    null,
    filterSaveStatus.value != null ? [filterSaveStatus.value] : null,
    filterDate.value,
  )
  console.log(params, 'Params')
  await indexHazardController.getData(params)
}

onMounted(() => {
  if (selectedProjctesFilters.value) {
    fetchHazard('', 1, 10, 1, null, null, null, selectedProjctesFilters.value)
    FetchMyZones()
  } else {
    fetchHazard()
  }

  FetchMyProjects()
})

const searchHazard = debounce(() => {
  fetchHazard(
    word.value,
    1,
    countPerPage.value,
    1,
    null,
    null,
    SelectedZonesFilter.value,
    selectedProjctesFilters.value,
  )
})

const deleteHazard = async (id: number) => {
  const deleteHazardParams = new DeleteHazardParams(id)
  await DeleteHazardController.getInstance().deleteHazard(deleteHazardParams)
  await fetchHazard()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchHazard(
    word.value,
    currentPage.value,
    countPerPage.value,
    1,
    null,
    null,
    SelectedZonesFilter.value,
    selectedProjctesFilters.value,
  )
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchHazard(
    word.value,
    currentPage.value,
    countPerPage.value,
    1,
    null,
    null,
    SelectedZonesFilter.value,
    selectedProjctesFilters.value,
  )
}

const applyDialogFilters = ({
  date,
  values,
}: {
  date: string
  values: Record<string, number | null>
}) => {
  filterDate.value = date
  filterSaveStatus.value = values.saveStatus ?? null
  filterRiskLevel.value = values.riskLevel ?? null
  currentPage.value = 1
  fetchHazard(
    word.value,
    1,
    countPerPage.value,
    1,
    null,
    null,
    SelectedZonesFilter.value,
    selectedProjctesFilters.value,
  )
}

const resetDialogFilters = () => {
  filterDate.value = ''
  filterSaveStatus.value = null
  filterRiskLevel.value = null
  currentPage.value = 1
  fetchHazard(
    word.value,
    1,
    countPerPage.value,
    1,
    null,
    null,
    SelectedZonesFilter.value,
    selectedProjctesFilters.value,
  )
}

watch(
  () => indexHazardController.state.value,
  (newState) => {
    if (newState) {
      console.log(newState)
      state.value = newState
    }
  },
  {
    deep: true,
  },
)

const { user } = useUserStore()

const actionList = (id: number, deleteHazard: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/organization/equipment-mangement/observation/${id}`,
    permission: [
      PermissionsEnum.ORG_OBSERVATION_UPDATE,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ORG_OBSERVATION_ALL,
      PermissionsEnum.ORG_OBSERVATION_DETAILS,
    ],
  },
  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteHazard(id),
    permission: [
      PermissionsEnum.ORG_OBSERVATION_DELETE,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ORG_OBSERVATION_ALL,
    ],
  },
]
const router = useRouter()
const Projects = ref<MyProjectsModel[]>([])
const isProjectsLoading = ref(true)
const FetchMyProjects = async () => {
  isProjectsLoading.value = true
  try {
    const fetchMyProjectsParams = new FetchMyProjectsParams()
    const fetchMyProjectsController = FetchMyProjectsController.getInstance()
    const res = await fetchMyProjectsController.getData(fetchMyProjectsParams, router, true)
    if (res.value.data) {
      Projects.value = res.value.data
    }
  } finally {
    isProjectsLoading.value = false
  }
}
const selectedProjctesFilters = ref<number | undefined>(ProjectSelect.project?.id)

const Filters = ref<MyZonesModel[]>()
const fetchMyZonesController = FetchMyZonesController.getInstance()
const FetchMyZones = async () => {
  const fetchMyZonesParams = new FetchMyZonesParams(selectedProjctesFilters.value)
  const response = await fetchMyZonesController.FetchMyZones(fetchMyZonesParams, router)
  if (response.value.data) {
    Filters.value = response.value.data
  }
}

const SelectedZonesFilter = ref<number[]>([])
const ApplayFilter = (data: number[]) => {
  SelectedZonesFilter.value = data
  fetchHazard('', 1, 10, 1, null, null, SelectedZonesFilter.value, selectedProjctesFilters.value)
}

const setSelectedProjectFilter = (data?: number) => {
  selectedProjctesFilters.value = data
  SelectedZonesFilter.value = []

  if (!data) {
    Filters.value = []
    fetchHazard('', 1, 10, 1)
    return
  }

  fetchHazard('', 1, 10, 1, null, null, null, data)
  FetchMyZones()
}

watch(
  () => ProjectSelect.project?.id,
  (projectId) => {
    if (projectId !== selectedProjctesFilters.value) {
      setSelectedProjectFilter(projectId)
    }
  },
)

const GetRiskLevel = (riskLevel?: RiskLevelEnum) => {
  switch (riskLevel) {
    case RiskLevelEnum.Low:
      return 'Low'
    case RiskLevelEnum.Medium:
      return 'Medium'
    case RiskLevelEnum.High:
      return 'High'
    default:
      return 'Unknown'
  }
}

const GetAcionStatus = (actionStatus: ActionStatusEnum) => {
  switch (actionStatus) {
    case ActionStatusEnum.OPEN:
      return 'Open'
    case ActionStatusEnum.CLOSED:
      return 'Closed'
  }
}

const GetSaveStatus = (saveStatus: SaveStatusEnum) => {
  switch (saveStatus) {
    case SaveStatusEnum.Saved:
      return 'Positive'
    case SaveStatusEnum.NotSaved:
      return 'Negative'
  }
}

const getObserverInitials = (name?: string) => {
  if (!name) return 'OB'

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
}

const getInvestigationRoute = (item: {
  investigationId?: number
  investigationMeetingId?: number
}) => {
  if (item.investigationId && item.investigationMeetingId) {
    return {
      path: `/organization/Investigating-result/${item.investigationMeetingId}`,
      query: { investigating_id: item.investigationId },
    }
  }

  return {
    path: '/organization/investigating/add',
    query: { id: item.investigationId },
  }
}

const toggleObservationWorkStopped = async (id: number) => {
  const toggleObservationWorkStoppedParams = new ToggleObservationWorkStoppedParams(id)
  await ToggleObservationWorkStoppedController.getInstance().toggleObservationWorkStopped(
    toggleObservationWorkStoppedParams,
    router,
  )
  await fetchHazard(
    '',
    1,
    10,
    1,
    null,
    null,
    SelectedZonesFilter.value,
    selectedProjctesFilters.value,
  )
}

const GetObservationType = (type: number) => {
  switch (type) {
    case Observation.ObservationType:
      return 'Observation'
    case Observation.HazardType:
      return 'Hazard'
  }
}
</script>

<template>
  <div class="grid grid-cols-12 gap-4 observation-index-page" :class="{ 'is-dark': isDarkMode }">
    <IndexEquipmentMangement class="col-span-2" />
    <div :class="route?.query?.isAll ? 'col-span-12' : 'col-span-12'">
      <PermissionBuilder
        :code="[
          PermissionsEnum.ORGANIZATION_EMPLOYEE,
          PermissionsEnum.ORG_OBSERVATION_ALL,
          PermissionsEnum.ORG_OBSERVATION_DELETE,
          PermissionsEnum.ORG_OBSERVATION_FETCH,
          PermissionsEnum.ORG_OBSERVATION_UPDATE,
          PermissionsEnum.ORG_OBSERVATION_CREATE,
        ]"
      >
        <div class="observation-control-center">
          <div class="observation-control-glow" aria-hidden="true"></div>

          <div class="observation-control-header">
            <IndexHazardHeader
              :title="`observation`"
              :length="state?.pagination?.total || 0"
              :projects="Projects"
              :isProjectsLoading="isProjectsLoading"
              subtitle="Manage, filter, and review workplace observations"
              variant="observation"
              @update:data="setSelectedProjectFilter"
            >
              <template #actions>
                <IndexFilterDialog
                  show-date
                  :fields="filterFields"
                  :initial-date="filterDate"
                  :initial-values="{ saveStatus: filterSaveStatus, riskLevel: filterRiskLevel }"
                  @apply="applyDialogFilters"
                  @reset="resetDialogFilters"
                />
                <PermissionBuilder
                  :code="[
                    PermissionsEnum?.ORGANIZATION_EMPLOYEE,
                    PermissionsEnum?.ORG_OBSERVATION_CREATE,
                  ]"
                >
                  <router-link :to="`/organization/equipment-mangement/observation/add`">
                    <button class="btn btn-primary create-observation-btn">
                      <span class="create-icon" aria-hidden="true">+</span>
                      <span class="create-copy"
                        ><small>{{ $t('New report') }}</small
                        ><strong>{{ $t('create_observation') }}</strong></span
                      >
                    </button>
                  </router-link>
                </PermissionBuilder>
              </template>
            </IndexHazardHeader>
          </div>

          <div v-if="Filters?.length" class="observation-control-toolbar">
            <div class="observation-filter-area">
              <div v-if="Filters?.length" class="observation-filter-heading">
                <span class="filter-symbol" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 6h16M7 12h10M10 18h4"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                </span>
                <div>
                  <p>{{ $t('Zone') }}</p>
                  <span>{{ $t('Select zones to refine the observation list') }}</span>
                </div>
              </div>

              <PermissionBuilder
                v-if="Filters?.length"
                :code="[
                  PermissionsEnum?.ORGANIZATION_EMPLOYEE,
                  PermissionsEnum?.ORG_OBSERVATION_CREATE,
                ]"
              >
                <IndexFilter
                  :key="selectedProjctesFilters"
                  class="observation-zone-filter"
                  :filters="Filters"
                  @update:data="ApplayFilter"
                  :link="'/organization/equipment-mangement/observation/add'"
                  :linkText="'Create Observation'"
                />
              </PermissionBuilder>
            </div>
          </div>
        </div>
        <DataStatus :controller="state">
          <template #success>
            <div class="table-responsive">
              <div class="index-table-card-container">
                <article
                  class="index-table-card observation-card"
                  :class="[
                    `risk-${GetRiskLevel(item.riskLevel).toLowerCase()}`,
                    { 'is-work-stopped': item.isWorkStopped == 1 },
                  ]"
                  v-for="(item, index) in state.data"
                  :key="item.id || index"
                >
                  <header class="observation-card-header">
                    <div class="observation-title-group">
                      <span class="observation-mark" aria-hidden="true">O</span>
                      <div>
                        <span class="observation-eyebrow">{{ $t('Observation') }}</span>
                        <router-link :to="`observation/show/${item?.id}`">
                          <h3>{{ item.title || '—' }}</h3>
                        </router-link>
                      </div>
                    </div>

                    <div class="observation-card-statuses">
                      <router-link
                        v-if="item.investigationId"
                        :to="getInvestigationRoute(item)"
                        class="observation-investigation-badge"
                        :title="$t('Investigation')"
                      >
                        <span class="investigation-badge-icon" aria-hidden="true">I</span>
                        <span>{{ $t('Investigation') }} #{{ item.investigationId }}</span>
                        <span class="investigation-badge-arrow" aria-hidden="true">→</span>
                      </router-link>
                      <span
                        class="observation-type-chip"
                        :class="GetSaveStatus(item.saveStatus)?.toLowerCase()"
                      >
                        <i aria-hidden="true"></i>
                        {{ GetSaveStatus(item.saveStatus) || 'N/A' }}
                      </span>
                      <span
                        v-if="item.riskLevel && item.saveStatus == SaveStatusEnum.NotSaved"
                        class="observation-risk-level"
                        :class="GetRiskLevel(item.riskLevel)"
                      >
                        <HighLevel v-if="GetRiskLevel(item.riskLevel) === 'High'" />
                        {{ GetRiskLevel(item.riskLevel) }} {{ $t('Level') }}
                      </span>
                    </div>
                  </header>

                  <div class="observation-card-body">
                    <div class="observation-information">
                      <div class="observation-meta-grid">
                        <!-- <div class="meta-item serial-meta">
                          <span class="meta-icon serial-icon" aria-hidden="true">#</span>
                          <div>
                            <span class="meta-label">{{ $t('Serial') }}</span>
                            <strong>{{ item.serialName || '—' }}</strong>
                          </div>
                        </div> -->

                        <div class="meta-item">
                          <span class="observer-avatar" aria-hidden="true">
                            {{ getObserverInitials(item.observer?.name) }}
                          </span>
                          <div>
                            <span class="meta-label">{{ $t('observer') }}</span>
                            <strong>{{ item.observer?.name || '—' }}</strong>
                          </div>
                        </div>

                        <router-link
                          :to="`/organization/project-details/${item.project?.id}`"
                          class="meta-item"
                        >
                          <span class="observer-avatar" aria-hidden="true"> p </span>
                          <div>
                            <span class="meta-label">{{ $t('project') }}</span>
                            <strong>{{ item.project?.title || '—' }}</strong>
                          </div>
                        </router-link>

                        <div class="meta-item">
                          <span class="meta-icon date-icon" aria-hidden="true"></span>
                          <div>
                            <span class="meta-label">{{ $t('Date & Time') }}</span>
                            <strong>{{ item.date || '—' }} · {{ item.time || '—' }}</strong>
                          </div>
                        </div>

                        <div class="meta-item">
                          <span class="meta-icon"><PinIcons /></span>
                          <div>
                            <span class="meta-label">{{ $t('Zone') }}</span>
                            <strong>{{ item.zoon?.title || '—' }}</strong>
                          </div>
                        </div>

                        <div class="meta-item">
                          <span class="meta-icon machine-symbol" aria-hidden="true">M</span>
                          <div>
                            <span class="meta-label">{{ $t('Machine') }}</span>
                            <strong>{{ item.equipment?.title || '—' }}</strong>
                            <strong
                              v-if="item.equipment?.license_plate_number"
                              class="small-text"
                              >{{ item.equipment?.license_plate_number || '—' }}</strong
                          >
                          </div>
                        </div>

                        <div class="meta-item">
                          <span class="meta-icon type-icon" aria-hidden="true"></span>
                          <div>
                            <span class="meta-label">{{ $t('observation_type') }}</span>
                            <strong>{{ GetSaveStatus(item.saveStatus) || 'N/A' }}</strong>
                          </div>
                        </div>
                      </div>

                      <section class="observation-description">
                        <span class="description-label">{{ $t('description') }}</span>
                        <p>{{ item.description || '—' }}</p>
                      </section>
                    </div>

                    <aside class="observation-media-panel">
                      <span class="media-label">{{ $t('Attachment') }}</span>
                      <div v-if="item.media?.[0]?.url" class="card-info">
                        <Image
                          :src="item.media[0].url"
                          :alt="item.title || $t('Observation')"
                          preview
                        >
                          <template #previewicon>
                            <div class="perview">
                              <ViewIcon />
                              <span>{{ $t('View') }}</span>
                            </div>
                          </template>
                        </Image>
                      </div>
                      <div v-else class="no-media">
                        <ViewIcon />
                        <span>{{ $t('No attachment') }}</span>
                      </div>
                    </aside>
                  </div>

                  <div class="observation-card-footer">
                    <div v-if="item.isWorkStopped == 1" class="work-stopped-control">
                      <span class="stop-indicator" aria-hidden="true">!</span>
                      <span>{{ $t('Work Stopped') }}</span>
                      <CustomCheckboxToggle
                        class="text-black"
                        :index="item.id + 100"
                        title=""
                        :checked="item.isWorkStopped == 1"
                        @update:checked="toggleObservationWorkStopped(item?.id)"
                      />
                    </div>

                    <router-link
                      :to="`observation/show/${item?.id}`"
                      class="view-observation-action"
                    >
                      <span>{{ $t('View Details') }}</span>
                      <span class="action-arrow" aria-hidden="true">→</span>
                    </router-link>
                  </div>
                </article>
              </div>
            </div>
            <Pagination
              :pagination="state.pagination"
              @changePage="handleChangePage"
              @countPerPage="handleCountPerPage"
            />
          </template>
          <template #loader>
            <CardSkelaton />
            <!-- <TableLoader :cols="3" :rows="10" /> -->
          </template>
          <template #initial>
            <CardSkelaton />
            <!-- <TableLoader :cols="3" :rows="10" /> -->
          </template>
          <template #empty>
            <PermissionBuilder
              :code="[
                PermissionsEnum?.ORGANIZATION_EMPLOYEE,
                PermissionsEnum?.ORG_OBSERVATION_CREATE,
              ]"
            >
              <DataEmpty
                :link="`/organization/equipment-mangement/observation/add`"
                addText="Create Observation"
                description="Sorry .. You have no Observation .. All your joined customers will appear here when you add your customer data"
                title="..ops! You have No Observation"
              />
            </PermissionBuilder>
          </template>
          <template #failed>
            <PermissionBuilder
              :code="[
                PermissionsEnum?.ORGANIZATION_EMPLOYEE,
                PermissionsEnum?.ORG_OBSERVATION_CREATE,
              ]"
            >
              <DataFailed
                :link="`/organization/equipment-mangement/observation/add`"
                addText="Create Observation"
                description="Sorry .. You have no Observation .. All your joined customers will appear here when you add your customer data"
                title="..ops! You have No Observation"
              />
            </PermissionBuilder>
          </template>
        </DataStatus>
        <template #notPermitted>
          <DataFailed
            addText="Have not  Permission"
            description="Sorry .. You have no Observation .. All your joined customers will appear here when you add your customer data"
          />
        </template>
      </PermissionBuilder>
    </div>
  </div>
</template>

<style scoped lang="scss">
.small-text {
  font-size: 12px !important;
  color: #475569 !important;
}
.observation-control-center {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  margin-bottom: 24px;
  padding: 20px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 18%, var(--main-border));
  border-radius: 22px;
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--PrimaryColor) 7%, transparent),
      transparent 48%
    ),
    var(--BgWhite);
  box-shadow: 0 18px 45px color-mix(in srgb, var(--text-strong) 9%, transparent);
}

.observation-control-glow {
  position: absolute;
  z-index: -1;
  top: -90px;
  inset-inline-end: -70px;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--PrimaryColor) 16%, transparent);
  filter: blur(45px);
  pointer-events: none;
}

.observation-control-header {
  padding-bottom: 18px;
  // border-bottom: 1px solid color-mix(in srgb, var(--PrimaryColor) 12%, var(--main-border));
}

.observation-control-header :deep(.idnex-header) {
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.observation-control-header :deep(.idnex-header > .title) {
  font-size: clamp(1.35rem, 2vw, 1.8rem);
  letter-spacing: -0.02em;
  text-transform: capitalize;
}

.observation-control-toolbar {
  display: block;
  padding-top: 0;
}

.observation-filter-area {
  min-width: 0;
  padding: 14px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 11%, var(--main-border));
  border-radius: 16px;
  background: color-mix(in srgb, var(--surface-1) 88%, transparent);
  box-shadow: inset 0 1px 0 color-mix(in srgb, white 65%, transparent);
}

.observation-filter-heading {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.filter-symbol {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--PrimaryColor) 11%, transparent);
  color: var(--PrimaryColor);
}

.filter-symbol svg {
  width: 20px;
  height: 20px;
}

.observation-filter-heading p {
  margin: 0;
  color: var(--header-page-color);
  font-size: 0.9rem;
  font-weight: 900;
}

.observation-filter-heading div > span {
  color: var(--GrayText-1);
  font-size: 0.76rem;
  font-weight: 600;
}

.observation-zone-filter :deep(.idnex-filter) {
  margin: 0;
  padding: 0;
  background: transparent;
}

.observation-zone-filter :deep(.filter-container) {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 100%;
  padding: 2px 2px 8px;
  border: 0;
  background: transparent;
  box-shadow: none;
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x proximity;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--brand-primary-400) 50%, transparent) transparent;
}

.observation-zone-filter :deep(.filter) {
  flex: 0 0 auto;
  margin: 0;
  min-height: 36px;
  padding: 8px 14px;
  border: 1px solid var(--brand-primary-100);
  border-radius: 999px;
  background: color-mix(in srgb, var(--surface-1) 86%, transparent);
  color: var(--brand-primary-600);
  font-family: 'Bold';
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0;
  white-space: nowrap;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease,
    color 0.18s ease,
    box-shadow 0.18s ease;
}

.observation-zone-filter :deep(.filter:hover) {
  transform: translateY(-1px);
  border-color: var(--brand-primary-200);
  background: var(--brand-primary-50);
  color: var(--brand-primary-500);
}

.observation-zone-filter :deep(.filter.active) {
  border-color: color-mix(in srgb, var(--status-success) 50%, transparent);
  background: var(--PrimaryColor);
  color: var(--text-on-brand);
  box-shadow: 0 10px 22px color-mix(in srgb, var(--brand-primary-500) 20%, transparent);
}

.observation-create-action {
  flex: 0 0 auto;
}

.create-observation-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 48px;
  padding-inline: 18px;
  border-radius: 14px;
  box-shadow: 0 10px 24px color-mix(in srgb, var(--PrimaryColor) 24%, transparent);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.create-observation-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px color-mix(in srgb, var(--PrimaryColor) 30%, transparent);
}

.create-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: color-mix(in srgb, white 18%, transparent);
  font-size: 1.2rem;
  line-height: 1;
}

.create-copy {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 2px;
  text-align: start;
}

.create-copy small {
  color: color-mix(in srgb, white 72%, transparent);
  font-size: 0.64rem;
  font-weight: 700;
  line-height: 1;
}

.create-copy strong {
  color: white;
  font-size: 0.8rem;
  font-weight: 900;
  line-height: 1.15;
}

@media (max-width: 860px) {
  .observation-control-center {
    padding: 16px;
    border-radius: 18px;
  }

  .observation-control-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .observation-create-action,
  .observation-create-action :deep(a),
  .create-observation-btn {
    width: 100%;
  }
}

.index-table-card-container {
  gap: 18px;
  padding-block: 4px 14px;
}

.observation-card {
  --card-accent: var(--brand-primary-500);
  --card-accent-soft: color-mix(in srgb, var(--brand-primary-500) 9%, transparent);
  position: relative;
  isolation: isolate;
  display: block;
  overflow: hidden;
  padding: 0;
  border: 1px solid color-mix(in srgb, var(--card-accent) 20%, var(--main-border));
  border-radius: 20px;
  background:
    radial-gradient(circle at 100% 0%, var(--card-accent-soft), transparent 34%), var(--surface-1);
  box-shadow: 0 14px 38px color-mix(in srgb, var(--brand-primary-900) 8%, transparent);
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease;
}

.observation-card::before {
  content: '';
  position: absolute;
  z-index: 2;
  inset-block: 0;
  inset-inline-start: 0;
  width: 5px;
  background: linear-gradient(180deg, var(--card-accent), var(--brand-accent-500));
}

.observation-card::after {
  content: '';
  position: absolute;
  z-index: -1;
  top: -74px;
  inset-inline-end: -54px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: var(--card-accent-soft);
  filter: blur(12px);
  pointer-events: none;
}

.observation-card:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--card-accent) 38%, var(--main-border));
  box-shadow: 0 20px 46px color-mix(in srgb, var(--brand-primary-900) 13%, transparent);
}

.observation-card.risk-low {
  --card-accent: var(--status-success);
}

.observation-card.risk-medium {
  --card-accent: var(--brand-accent-500);
}

.observation-card.risk-high,
.observation-card.is-work-stopped {
  --card-accent: var(--status-danger);
}

.observation-card-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  min-height: 58px;
  padding: 12px 18px 12px 22px;
  border-bottom: 1px solid color-mix(in srgb, var(--card-accent) 13%, var(--main-border));
  background: color-mix(in srgb, var(--surface-2) 74%, transparent);
}

.observation-card-reference,
.observation-card-statuses,
.observer-row,
.project-details,
.observation-card-footer,
.work-stopped-control,
.show-more {
  display: flex;
  align-items: center;
}

.observation-card-reference {
  gap: 9px;
  min-width: 0;
}

.reference-label {
  color: var(--text-soft);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.observation-card-reference strong {
  overflow: hidden;
  padding: 6px 10px;
  border: 1px solid color-mix(in srgb, var(--card-accent) 20%, transparent);
  border-radius: 9px;
  background: var(--card-accent-soft);
  color: var(--card-accent);
  font-family: 'Bold';
  font-size: 0.76rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.observation-card-statuses {
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 7px;
}

.observation-type-chip,
.observation-risk-level,
.observation-investigation-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 30px;
  padding: 5px 10px;
  border: 1px solid color-mix(in srgb, var(--card-accent) 22%, transparent);
  border-radius: 999px;
  background: var(--card-accent-soft);
  color: var(--card-accent);
  font-size: 0.72rem;
  font-weight: 900;
  white-space: nowrap;
}

.observation-investigation-badge {
  border-color: color-mix(in srgb, var(--brand-primary-500) 30%, transparent);
  background: color-mix(in srgb, var(--brand-primary-500) 10%, var(--surface-1));
  color: var(--brand-primary-600);
  text-decoration: none;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease;
}

.observation-investigation-badge:hover,
.observation-investigation-badge:focus-visible {
  transform: translateY(-1px);
  border-color: var(--brand-primary-500);
  background: color-mix(in srgb, var(--brand-primary-500) 16%, var(--surface-1));
  outline: none;
}

.investigation-badge-icon {
  display: inline-grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--brand-primary-500);
  color: var(--text-on-brand);
  font-size: 0.65rem;
  font-weight: 900;
}

.investigation-badge-arrow {
  font-size: 0.86rem;
  transition: transform 0.18s ease;
}

.observation-investigation-badge:hover .investigation-badge-arrow {
  transform: translateX(2px);
}

[dir='rtl'] .observation-investigation-badge:hover .investigation-badge-arrow {
  transform: translateX(-2px) rotate(180deg);
}

[dir='rtl'] .investigation-badge-arrow {
  transform: rotate(180deg);
}

.observation-type-chip i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 0 4px color-mix(in srgb, currentColor 13%, transparent);
}

.observation-type-chip.positive {
  border-color: color-mix(in srgb, var(--status-success) 24%, transparent);
  background: color-mix(in srgb, var(--status-success) 9%, transparent);
  color: var(--status-success);
}

.observation-type-chip.negative {
  border-color: color-mix(in srgb, var(--status-danger) 22%, transparent);
  background: color-mix(in srgb, var(--status-danger) 8%, transparent);
  color: var(--status-danger);
}

.observation-card-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 20px;
  padding: 20px 18px 18px 22px;
}

.observation-card .card-details {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 16px;
  color: inherit;
  text-decoration: none;
}

.observer-row {
  gap: 11px;
  min-width: 0;
}

.observer-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  border: 1px solid color-mix(in srgb, var(--card-accent) 22%, transparent);
  border-radius: 13px;
  background: linear-gradient(145deg, var(--card-accent-soft), var(--surface-2));
  color: var(--card-accent);
  font-family: 'Bold';
  font-size: 0.76rem;
  font-weight: 900;
}

.observer-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
}

.observer-copy span,
.observation-card-heading > span,
.detail-chip small {
  color: var(--text-soft);
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.observer-copy strong {
  overflow: hidden;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.88rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.observation-date {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-inline-start: auto;
  color: var(--text-soft);
  font-size: 0.73rem;
  font-weight: 750;
  white-space: nowrap;
}

.observation-date small {
  padding: 4px 7px;
  border-radius: 7px;
  background: var(--surface-2);
  color: var(--text-strong);
  font-size: 0.68rem;
}

.observation-card-heading {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.observation-card-heading h3 {
  margin: 0;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: clamp(1rem, 1.6vw, 1.2rem);
  font-weight: 900;
  line-height: 1.4;
}

.project-details {
  flex-wrap: wrap;
  gap: 9px;
}

.detail-chip {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  min-width: 150px;
  min-height: 42px;
  padding: 7px 11px;
  border: 1px solid var(--main-border);
  border-radius: 12px;
  background: color-mix(in srgb, var(--surface-2) 76%, transparent);
  color: var(--text-strong);
  font-size: 0.76rem;
  font-weight: 800;
}

.detail-chip > span:last-child {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.detail-chip svg,
.machine-symbol {
  width: 26px;
  height: 26px;
  flex: 0 0 26px;
  padding: 5px;
  border-radius: 8px;
  background: var(--card-accent-soft);
  color: var(--card-accent);
}

.machine-symbol {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'Bold';
  font-size: 0.65rem;
}

.observation-card .card-info {
  width: 168px;
  min-width: 168px;
}

.observation-card .card-info :deep(.p-image) {
  display: block;
  width: 168px;
  height: 132px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--card-accent) 17%, var(--main-border));
  border-radius: 15px;
  background: var(--surface-2);
  box-shadow: 0 8px 20px color-mix(in srgb, var(--brand-primary-900) 10%, transparent);
}

.observation-card .card-info :deep(.p-image img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.observation-card:hover .card-info :deep(.p-image img) {
  transform: scale(1.035);
}

.observation-card .card-info :deep(.p-image-preview-mask) {
  border-radius: 15px;
  background: color-mix(in srgb, var(--brand-primary-900) 55%, transparent);
}

.perview {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 10px;
  border: 1px solid color-mix(in srgb, white 28%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--brand-primary-900) 55%, transparent);
  color: white;
  font-size: 0.72rem;
  font-weight: 850;
  backdrop-filter: blur(5px);
}

.observation-card-footer {
  justify-content: space-between;
  gap: 12px;
  min-height: 54px;
  padding: 10px 18px 10px 22px;
  border-top: 1px solid var(--main-border);
  background: color-mix(in srgb, var(--surface-2) 70%, transparent);
}

.work-stopped-control {
  gap: 8px;
  color: var(--status-danger);
  font-size: 0.74rem;
  font-weight: 900;
}

.stop-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--status-danger) 10%, transparent);
  font-family: 'Bold';
}

.show-more {
  justify-content: center;
  gap: 8px;
  min-height: 34px;
  margin-inline-start: auto;
  padding: 6px 11px;
  border: 1px solid color-mix(in srgb, var(--card-accent) 18%, var(--main-border));
  border-radius: 10px;
  background: var(--surface-1);
  color: var(--card-accent);
  font: inherit;
  font-size: 0.73rem;
  font-weight: 850;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    background 0.18s ease;
}

.show-more:hover {
  transform: translateY(-1px);
  background: var(--card-accent-soft);
}

.show-more svg {
  width: 15px;
  height: 15px;
  transition: transform 0.2s ease;
}

.observation-card.is-expanded .show-more svg {
  transform: rotate(180deg);
}

.observation-card .card-description {
  margin: 0 18px 18px 22px;
  padding: 14px 16px;
  border: 1px solid color-mix(in srgb, var(--card-accent) 15%, var(--main-border));
  border-radius: 13px;
  background: var(--card-accent-soft);
}

.observation-card .card-description .title {
  margin: 0 0 5px;
  color: var(--card-accent);
  font-family: 'Bold';
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.observation-card .card-description .description {
  margin: 0;
  color: var(--text-soft);
  font-size: 0.82rem;
  line-height: 1.7;
}

.description-reveal-enter-active,
.description-reveal-leave-active {
  transition: 0.2s ease;
}

.description-reveal-enter-from,
.description-reveal-leave-to {
  transform: translateY(-5px);
  opacity: 0;
}

@media (max-width: 720px) {
  .observation-card-topline,
  .observation-card-body,
  .observation-card-footer {
    padding-inline: 18px 14px;
  }

  .observation-card-topline {
    align-items: flex-start;
    flex-direction: column;
  }

  .observation-card-statuses {
    justify-content: flex-start;
  }

  .observation-card-body {
    grid-template-columns: 1fr;
  }

  .observation-card .card-info,
  .observation-card .card-info :deep(.p-image) {
    width: 100%;
  }

  .observation-card .card-info :deep(.p-image) {
    height: auto;
    aspect-ratio: 16 / 7;
  }

  .observation-card .card-description {
    margin-inline: 18px 14px;
  }
}

@media (max-width: 480px) {
  .observer-row {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .observer-copy {
    max-width: calc(100% - 56px);
  }

  .observation-date {
    width: 100%;
    margin-inline-start: 53px;
  }

  .detail-chip {
    width: 100%;
  }

  .observation-card-footer {
    align-items: stretch;
    flex-direction: column;
  }

  .show-more {
    width: 100%;
    margin-inline-start: 0;
  }
}

/* Clear, information-first observation card */
.observation-card {
  border-radius: 24px;
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--card-accent) 5%, transparent),
      transparent 40%
    ),
    var(--surface-1);
}

.observation-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 22px 22px 18px 26px;
  border-bottom: 1px solid var(--main-border);
  background: color-mix(in srgb, var(--surface-2) 68%, transparent);
}

.observation-title-group {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 14px;
}

.observation-title-group > div {
  min-width: 0;
}

.observation-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  border: 1px solid color-mix(in srgb, var(--card-accent) 25%, transparent);
  border-radius: 15px;
  background: linear-gradient(145deg, var(--card-accent), var(--brand-primary-700));
  box-shadow: 0 10px 22px color-mix(in srgb, var(--card-accent) 24%, transparent);
  color: white;
  font-family: 'Bold';
  font-size: 1rem;
  font-weight: 900;
}

.observation-eyebrow {
  display: block;
  margin-bottom: 4px;
  color: var(--card-accent);
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.observation-title-group a {
  text-decoration: none;
}

.observation-title-group h3 {
  overflow: hidden;
  margin: 0;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: clamp(1.12rem, 1.8vw, 1.38rem);
  font-weight: 900;
  line-height: 1.35;
  text-overflow: ellipsis;
}

.observation-title-group a:hover h3 {
  color: var(--card-accent);
}

.observation-card-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  align-items: stretch;
  gap: 20px;
  padding: 22px 22px 22px 26px;
}

.observation-information {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 16px;
}

.observation-meta-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.meta-item {
  display: flex;
  align-items: center;
  justify-content: start;
  min-width: 0;
  min-height: 72px;
  gap: 11px;
  padding: 12px;
  border: 1px solid var(--main-border);
  border-radius: 14px;
  background: color-mix(in srgb, var(--surface-2) 76%, transparent);
  transition:
    border-color 0.18s ease,
    background 0.18s ease;
}

.meta-item:hover {
  border-color: color-mix(in srgb, var(--card-accent) 25%, var(--main-border));
  background: var(--card-accent-soft);
}

.meta-item > div {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
}

.meta-label,
.description-label,
.media-label {
  color: var(--text-soft);
  font-size: 0.66rem;
  font-weight: 850;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.meta-item strong {
  overflow: hidden;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.82rem;
  font-weight: 850;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.meta-icon,
.meta-item .observer-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  padding: 0;
  border: 1px solid color-mix(in srgb, var(--card-accent) 18%, transparent);
  border-radius: 12px;
  background: var(--card-accent-soft);
  color: var(--card-accent);
  font-family: 'Bold';
  font-size: 0.73rem;
  font-weight: 900;
}

.meta-icon svg {
  width: 18px;
  height: 18px;
}

.date-icon,
.type-icon {
  position: relative;
}

.date-icon::before {
  content: '';
  width: 17px;
  height: 15px;
  border: 2px solid currentColor;
  border-radius: 4px;
}

.date-icon::after {
  content: '';
  position: absolute;
  top: 12px;
  width: 11px;
  border-top: 2px solid currentColor;
}

.type-icon::before {
  content: '';
  width: 15px;
  height: 15px;
  border: 2px solid currentColor;
  border-radius: 50%;
  box-shadow: inset 0 0 0 3px var(--surface-2);
  background: currentColor;
}

.observation-description {
  position: relative;
  min-height: 90px;
  padding: 15px 16px 15px 20px;
  border: 1px solid color-mix(in srgb, var(--card-accent) 14%, var(--main-border));
  border-radius: 15px;
  background: var(--card-accent-soft);
}

.observation-description::before {
  content: '';
  position: absolute;
  inset-block: 15px;
  inset-inline-start: 0;
  width: 3px;
  border-radius: 999px;
  background: var(--card-accent);
}

.observation-description p {
  display: -webkit-box;
  overflow: hidden;
  margin: 7px 0 0;
  color: var(--text-strong);
  font-size: 0.84rem;
  font-weight: 650;
  line-height: 1.65;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.observation-media-panel {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  border: 1px solid var(--main-border);
  border-radius: 17px;
  background: color-mix(in srgb, var(--surface-2) 78%, transparent);
}

.media-label {
  padding-inline: 3px;
}

.observation-card .card-info,
.observation-card .card-info :deep(.p-image) {
  width: 100%;
  height: 100%;
  min-height: 184px;
}

.observation-card .card-info :deep(.p-image) {
  border-radius: 12px;
}

.observation-card .card-info :deep(.p-image img) {
  border-radius: 12px;
}

.no-media {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 184px;
  flex: 1;
  flex-direction: column;
  gap: 9px;
  border: 1px dashed color-mix(in srgb, var(--card-accent) 22%, var(--main-border));
  border-radius: 12px;
  background: var(--surface-1);
  color: var(--text-soft);
  font-size: 0.72rem;
  font-weight: 750;
}

.no-media svg {
  width: 24px;
  height: 24px;
  color: var(--card-accent);
  opacity: 0.7;
}

.observation-card-footer {
  min-height: 62px;
  padding: 11px 22px 11px 26px;
  background: color-mix(in srgb, var(--surface-2) 72%, transparent);
}

.view-observation-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  gap: 10px;
  margin-inline-start: auto;
  padding: 8px 9px 8px 15px;
  border-radius: 12px;
  background: var(--card-accent);
  box-shadow: 0 8px 18px color-mix(in srgb, var(--card-accent) 22%, transparent);
  color: white;
  font-size: 0.76rem;
  font-weight: 900;
  text-decoration: none;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.view-observation-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 11px 22px color-mix(in srgb, var(--card-accent) 28%, transparent);
}

.action-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: color-mix(in srgb, white 18%, transparent);
  font-size: 1rem;
  line-height: 1;
}

[dir='rtl'] .action-arrow {
  transform: rotate(180deg);
}

@media (max-width: 1050px) {
  .observation-meta-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .observation-card-header,
  .observation-card-body,
  .observation-card-footer {
    padding-inline: 20px 16px;
  }

  .observation-card-header {
    flex-direction: column;
  }

  .observation-card-statuses {
    justify-content: flex-start;
  }

  .observation-card-body {
    grid-template-columns: 1fr;
  }

  .observation-card .card-info,
  .observation-card .card-info :deep(.p-image),
  .no-media {
    min-height: 190px;
  }

  .observation-card .card-info :deep(.p-image) {
    height: 190px;
    aspect-ratio: auto;
  }
}

@media (max-width: 540px) {
  .observation-card {
    border-radius: 18px;
  }

  .observation-title-group {
    align-items: flex-start;
  }

  .observation-mark {
    width: 42px;
    height: 42px;
    flex-basis: 42px;
    border-radius: 13px;
  }

  .observation-meta-grid {
    grid-template-columns: 1fr;
  }

  .meta-item {
    min-height: 66px;
  }

  .observation-card-footer {
    align-items: stretch;
    flex-direction: column;
  }

  .view-observation-action {
    width: 100%;
    margin-inline-start: 0;
  }
}

.observation-index-page.is-dark {
  :deep(.index-table-card),
  :deep(.card-header-container),
  :deep(.observation-dwspcription-more),
  :deep(.card-description) {
    border-color: var(--main-border) !important;
    background:
      radial-gradient(
        circle at 100% 0%,
        color-mix(in srgb, var(--PrimaryColor) 8%, transparent),
        transparent 38%
      ),
      linear-gradient(180deg, var(--surface-1), var(--surface-2)) !important;
    color: var(--text-strong) !important;
    box-shadow: 0 14px 34px color-mix(in srgb, var(--text-strong) 22%, transparent) !important;
  }

  :deep(.card-content),
  :deep(.card-details),
  :deep(.project-details),
  :deep(.card-info) {
    background: transparent !important;
  }

  :deep(.project-details .label-item-primary),
  :deep(.label-item-primary),
  :deep(.label-item-secondary),
  :deep(.observation-dwspcription-more .show-more) {
    border-color: var(--main-border) !important;
    background: var(--surface-2) !important;
    color: var(--text-soft) !important;
  }

  :deep(.title),
  :deep(.card-details .title),
  :deep(.label-item-primary span),
  :deep(.label-item-secondary span) {
    color: var(--text-strong) !important;
  }

  :deep(.subtitle),
  :deep(.description),
  :deep(.card-description .description) {
    color: var(--text-soft) !important;
  }

  :deep(.p-image img) {
    border: 1px solid var(--main-border) !important;
    background: var(--surface-3) !important;
  }

  :deep(.observation-risk-level) {
    border-color: color-mix(in srgb, var(--card-accent) 34%, var(--main-border)) !important;
    background: color-mix(in srgb, var(--card-accent) 13%, var(--surface-2)) !important;
    color: var(--card-accent) !important;
  }

  .observation-card-header,
  .observation-card-footer,
  .meta-item,
  .observation-media-panel {
    border-color: var(--main-border);
    background: color-mix(in srgb, var(--surface-2) 82%, transparent);
  }

  .observation-description,
  .no-media {
    border-color: color-mix(in srgb, var(--card-accent) 24%, var(--main-border));
    background: color-mix(in srgb, var(--card-accent) 8%, var(--surface-2));
  }
}
</style>
