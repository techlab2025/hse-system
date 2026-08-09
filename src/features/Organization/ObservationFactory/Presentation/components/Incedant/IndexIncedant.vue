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
// import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
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
import FilterDialog from '../Hazard/HazardUtils/FilterDialog.vue'
import type MyProjectsModel from '../../../Data/models/MyProjectsModel'
import FetchMyProjectsParams from '../../../Core/params/fetchMyProjectsParams'
import FetchMyProjectsController from '../../controllers/FetchMyProjectsController'
import type MyZonesModel from '../../../Data/models/MyZonesModel'
import FetchMyZonesController from '../../controllers/FetchMyZonesController'
import FetchMyZonesParams from '../../../Core/params/FetchMyZonesParams'
import IndexEquipmentMangement from '../indexEquipmentMangement.vue'
import CardSkelaton from '@/features/Organization/Inspection/Presentation/components/SubComponent/CardSkelaton.vue'
import { formatJoinDate } from '@/base/Presentation/utils/date_format.ts'
import { formatTime } from '@/base/Presentation/utils/time_format.ts'
import { useThemeMode } from '@/composables/useThemeMode'
// import FilterDialog from '../Hazard/HazardUtils/filterDialog.vue'
const { t } = useI18n()
const { isDarkMode } = useThemeMode()

// import DialogChangeStatusHazard from "@/features/setting/Hazard/Presentation/components/Hazard/DialogChangeStatusHazard.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
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
  equipmentIds?: number[],
  riskLevel?: number[],
  saveStatus?: number[],
  date?: string,
  equipmentTypeIds?: number[],
  equipmentSubTypeIds?: number[],
  rootCauseId?: number,
) => {
  const params = new IndexHazardParams(
    query,
    pageNumber,
    perPage,
    withPage,
    [Observation.AccidentsType],
    route.query.rootCause ? null : projectIds ? [projectIds] : [],
    zoonIds,
    projectLocationIds || null,
    projectZoneLozationId,
    route.query.rootCause ? route.query.rootCause : null,

    // equipmentIds,
    // riskLevel,
    // saveStatus,
    // date,
    // equipmentTypeIds,
    // equipmentSubTypeIds,
  )
  await indexHazardController.getData(params)
}

// const confirmFilters = (
//   date: string,
//   locationIds?: number[],
//   zoneIds?: number[],
//   machineIds?: number[],
//   machineTypeIds?: number[],
//   machineSubTypeIds?: number[],
//   caseIds?: number[],
//   statusIds?: number[]
// ) => {
//   fetchHazard(
//     '',
//     1,
//     10,
//     1,
//     [],
//     locationIds,
//     zoneIds,
//     machineIds,
//     statusIds,
//     caseIds,
//     date,
//     machineSubTypeIds,
//     machineTypeIds
//   )
// }

onMounted(async () => {
  // if (selectedProjctesFilters.value) {

  fetchHazard('', 1, 12, 1)
  // }
  FetchMyProjects()
})

const searchHazard = debounce(() => {
  fetchHazard(word.value)
})

const deleteHazard = async (id: number) => {
  const deleteHazardParams = new DeleteHazardParams(id)
  await DeleteHazardController.getInstance().deleteHazard(deleteHazardParams)
  await fetchHazard()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchHazard('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchHazard('', currentPage.value, countPerPage.value)
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
    link: `/organization/equipment-mangement/incedant/${id}`,
    permission: [
      PermissionsEnum.ORG_INCEDANT_UPDATE,
      PermissionsEnum.ORG_INCEDANT_DETAILS,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ORG_INCEDANT_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteHazard(id),
    permission: [
      PermissionsEnum.ORG_INCEDANT_DELETE,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ORG_INCEDANT_ALL,
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
const selectedProjctesFilters = ref<number>()

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

const getObserverInitials = (name?: string) => {
  if (!name) return 'IN'

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

const getEquipmentPlateNumber = (equipment: unknown) => {
  const value = equipment as
    | {
        license_plate_number?: string | number
        licensePlateNumber?: string | number
        license_number?: string | number
        licenseNumber?: string | number
      }
    | null
    | undefined

  return (
    value?.license_plate_number ??
    value?.licensePlateNumber ??
    value?.license_number ??
    value?.licenseNumber ??
    null
  )
}
</script>

<template>
  <div :class="['incident-index-page grid grid-cols-12 gap-4', { 'is-dark': isDarkMode }]">
    <IndexEquipmentMangement class="col-span-2" />
    <div :class="route?.query?.isAll ? 'col-span-12' : 'col-span-12'">
      <PermissionBuilder
        :code="[
          PermissionsEnum.ORGANIZATION_EMPLOYEE,

          PermissionsEnum.ORG_INCEDANT_ALL,
          PermissionsEnum.ORG_INCEDANT_DELETE,
          PermissionsEnum.ORG_INCEDANT_FETCH,
          PermissionsEnum.ORG_INCEDANT_UPDATE,
          PermissionsEnum.ORG_INCEDANT_CREATE,
        ]"
      >
        <div class="incident-control-center">
          <div class="incident-control-glow" aria-hidden="true"></div>

          <div class="incident-control-header">
            <IndexHazardHeader
              :title="'incedant'"
              :length="state?.pagination?.total"
              :projects="Projects"
              :isProjectsLoading="isProjectsLoading"
              subtitle="Manage, filter, and review workplace incidents"
              variant="incident"
              @update:data="setSelectedProjectFilter"
            >
              <template #actions>
                <PermissionBuilder
                  :code="[
                    PermissionsEnum?.ORGANIZATION_EMPLOYEE,
                    PermissionsEnum?.ORG_INCEDANT_CREATE,
                  ]"
                >
                  <router-link :to="`/organization/equipment-mangement/incedant/add`">
                    <button class="btn btn-primary create-incident-btn">
                      <span class="create-icon" aria-hidden="true">+</span>
                      <span class="create-copy"
                        ><small>{{ $t('New report') }}</small
                        ><strong>{{ $t('incedent Report') }}</strong></span
                      >
                    </button>
                  </router-link>
                </PermissionBuilder>
              </template>
            </IndexHazardHeader>
          </div>

          <div v-if="Filters?.length" class="incident-control-toolbar">
            <div class="incident-filter-area">
              <div v-if="Filters?.length" class="incident-filter-heading">
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
                  <span>{{ $t('Select zones to refine the incident list') }}</span>
                </div>
              </div>

              <IndexFilter
                v-if="Filters?.length"
                class="incident-zone-filter"
                :filters="Filters"
                @update:data="ApplayFilter"
                :link="'/organization/equipment-mangement/incedant/add'"
                :linkText="'Create incedant'"
              />
            </div>
          </div>
        </div>
        <DataStatus :controller="state">
          <template #success>
            <div class="table-responsive incident-table-responsive">
              <div class="index-table-card-container incident-card-list">
                <article
                  class="index-table-card incident-card"
                  v-for="(item, index) in state.data"
                  :key="item.id || index"
                >
                  <header class="incident-card-header">
                    <div class="incident-title-group">
                      <span class="incident-mark" aria-hidden="true">I</span>
                      <div>
                        <span class="incident-eyebrow">{{ $t('Incident Report') }}</span>
                        <router-link
                          :to="`/organization/equipment-mangement/incedant/show/${item?.id}`"
                        >
                          <h3>{{ item.title || '—' }}</h3>
                        </router-link>
                      </div>
                    </div>

                    <div class="incident-card-statuses">
                      <router-link
                        v-if="item.investigationId"
                        :to="getInvestigationRoute(item)"
                        class="incident-investigation-badge"
                        :title="$t('Investigation')"
                      >
                        <span class="incident-investigation-icon" aria-hidden="true">I</span>
                        <span>{{ $t('Investigation') }} #{{ item.investigationId }}</span>
                        <span class="incident-investigation-arrow" aria-hidden="true">→</span>
                      </router-link>

                      <span class="incident-status-chip">
                        <i aria-hidden="true"></i>
                        {{ $t('Reported Incident') }}
                      </span>
                    </div>
                  </header>

                  <div class="incident-card-body">
                    <div class="incident-information">
                      <div class="incident-meta-grid">
                        <div class="incident-meta-item">
                          <span class="incident-meta-icon" aria-hidden="true">#</span>
                          <div>
                            <span class="incident-meta-label">{{ $t('Serial') }}</span>
                            <strong>{{ item.serialName || '—' }}</strong>
                          </div>
                        </div>

                        <div class="incident-meta-item">
                          <span class="incident-observer-avatar" aria-hidden="true">
                            {{ getObserverInitials(item.observer?.name) }}
                          </span>
                          <div>
                            <span class="incident-meta-label">{{ $t('observer') }}</span>
                            <strong>{{ item.observer?.name || '—' }}</strong>
                          </div>
                        </div>

                        <router-link
                          :to="`/organization/project-details/${item.project?.id}`"
                          class="incident-meta-item incident-meta-item-link"
                        >
                          <span class="incident-meta-icon" aria-hidden="true">P</span>
                          <div>
                            <span class="incident-meta-label">{{ $t('project') }}</span>
                            <strong>{{ item.project?.title || '—' }}</strong>
                          </div>
                        </router-link>

                        <div class="incident-meta-item">
                          <span
                            class="incident-meta-icon incident-date-icon"
                            aria-hidden="true"
                          ></span>
                          <div>
                            <span class="incident-meta-label">{{ $t('Date & Time') }}</span>
                            <strong>
                              {{ item.updatedAt ? formatJoinDate(item.updatedAt) : '—' }} ·
                              {{ item.updatedAt ? formatTime(item.updatedAt) : '—' }}
                            </strong>
                          </div>
                        </div>

                        <div class="incident-meta-item">
                          <span
                            class="incident-meta-icon incident-zone-icon"
                            aria-hidden="true"
                          ></span>
                          <div>
                            <span class="incident-meta-label">{{ $t('Zone') }}</span>
                            <strong>{{ item.zoon?.title || '—' }}</strong>
                          </div>
                        </div>

                        <div class="incident-meta-item">
                          <span class="incident-meta-icon" aria-hidden="true">M</span>
                          <div>
                            <span class="incident-meta-label">{{ $t('Machine') }}</span>
                            <strong>{{ item.equipment?.title || '—' }}</strong>
                            <strong
                              v-if="item.equipment.license_plate_number"
                              class="incident-machine-plate"
                            >
                              {{ item.equipment.license_plate_number }}
                            </strong>
                          </div>
                        </div>
                      </div>

                      <section class="incident-description">
                        <span class="incident-description-label">{{ $t('description') }}</span>
                        <p>{{ item.description || '—' }}</p>
                      </section>
                    </div>

                    <aside class="incident-media-panel">
                      <span class="incident-media-label">{{ $t('Attachment') }}</span>
                      <div v-if="item.media?.[0]?.url" class="card-info">
                        <Image :src="item.media[0].url" :alt="item.title || $t('Incident')" preview>
                          <template #previewicon>
                            <div class="perview">
                              <ViewIcon />
                              <span>{{ $t('View') }}</span>
                            </div>
                          </template>
                        </Image>
                      </div>
                      <div v-else class="incident-no-media">
                        <ViewIcon />
                        <span>{{ $t('No attachment') }}</span>
                      </div>
                    </aside>
                  </div>

                  <footer class="incident-card-footer">
                    <span class="incident-footer-note">{{ $t('Workplace incident record') }}</span>
                    <router-link
                      :to="`/organization/equipment-mangement/incedant/show/${item?.id}`"
                      class="view-incident-action"
                    >
                      <span>{{ $t('View Details') }}</span>
                      <span class="incident-action-arrow" aria-hidden="true">→</span>
                    </router-link>
                  </footer>
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
              :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.ORG_INCEDANT_CREATE]"
            >
              <DataEmpty
                :link="`/organization/equipment-mangement/incedant/add`"
                addText="incedent Report"
                description="Sorry .. You have no incedant .. All your joined customers will appear here when you add your customer data"
                title="..ops! You have No incedant"
              />
            </PermissionBuilder>
          </template>
          <template #failed>
            <PermissionBuilder
              :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.ORG_INCEDANT_CREATE]"
            >
              <DataFailed
                :link="`/organization/equipment-mangement/incedant/add`"
                addText="incedent Report"
                description="Sorry .. You have no incedant .. All your joined customers will appear here when you add your customer data"
                title="..ops! You have No incedant"
              />
            </PermissionBuilder>
          </template>
        </DataStatus>
        <template #notPermitted>
          <DataFailed
            addText="Have not  Permission"
            description="Sorry .. You have no incedant .. All your joined customers will appear here when you add your customer data"
          />
        </template>
      </PermissionBuilder>
    </div>
  </div>
</template>
<style scoped lang="scss">
.incident-control-center {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  margin-bottom: 24px;
  padding: 20px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 16%, var(--main-border));
  border-radius: 22px;
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--PrimaryColor) 6%, transparent),
      transparent 48%
    ),
    var(--BgWhite);
  box-shadow: 0 18px 45px color-mix(in srgb, var(--text-strong) 9%, transparent);
}

.incident-control-glow {
  position: absolute;
  z-index: -1;
  top: -90px;
  inset-inline-end: -70px;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--PrimaryColor) 14%, transparent);
  filter: blur(45px);
  pointer-events: none;
}

.incident-control-header {
  padding-bottom: 18px;
  // border-bottom: 1px solid color-mix(in srgb, var(--status-danger) 10%, var(--main-border));
}

.incident-control-header :deep(.idnex-header) {
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.incident-control-header :deep(.idnex-header > .title) {
  font-size: clamp(1.35rem, 2vw, 1.8rem);
  letter-spacing: -0.02em;
  text-transform: capitalize;
}

.incident-control-toolbar {
  display: block;
  padding-top: 0;
}

.incident-filter-area {
  min-width: 0;
  padding: 14px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 11%, var(--main-border));
  border-radius: 16px;
  background: color-mix(in srgb, var(--surface-1) 88%, transparent);
  box-shadow: inset 0 1px 0 color-mix(in srgb, white 65%, transparent);
}

.incident-filter-heading {
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
  background: color-mix(in srgb, var(--PrimaryColor) 9%, transparent);
  color: var(--PrimaryColor);
}

.filter-symbol svg {
  width: 20px;
  height: 20px;
}

.incident-filter-heading p {
  margin: 0;
  color: var(--header-page-color);
  font-size: 0.9rem;
  font-weight: 900;
}

.incident-filter-heading div > span {
  color: var(--GrayText-1);
  font-size: 0.76rem;
  font-weight: 600;
}

.incident-zone-filter :deep(.idnex-filter) {
  margin: 0;
  padding: 0;
  background: transparent;
}

.incident-zone-filter :deep(.filter-container) {
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

.incident-zone-filter :deep(.filter) {
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

.incident-zone-filter :deep(.filter:hover) {
  transform: translateY(-1px);
  border-color: var(--brand-primary-200);
  background: var(--brand-primary-50);
  color: var(--brand-primary-500);
}

.incident-zone-filter :deep(.filter.active) {
  border-color: color-mix(in srgb, var(--status-success) 50%, transparent);
  background: var(--PrimaryColor);
  color: var(--text-on-brand);
  box-shadow: 0 10px 22px color-mix(in srgb, var(--brand-primary-500) 20%, transparent);
}

.incident-create-action {
  flex: 0 0 auto;
}

.create-incident-btn {
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

.create-incident-btn:hover {
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
  .incident-control-center {
    padding: 16px;
    border-radius: 18px;
  }

  .incident-control-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .incident-create-action,
  .incident-create-action :deep(a),
  .create-incident-btn {
    width: 100%;
  }
}

.incident-card-list {
  gap: 18px;
  padding-block: 4px 14px;
}

.incident-card {
  --incident-accent: var(--status-danger);
  --incident-accent-soft: color-mix(in srgb, var(--status-danger) 8%, transparent);
  position: relative;
  isolation: isolate;
  display: block;
  overflow: hidden;
  width: 100%;
  padding: 0;
  border: 1px solid color-mix(in srgb, var(--incident-accent) 20%, var(--main-border));
  border-radius: 24px;
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--incident-accent) 5%, transparent),
      transparent 40%
    ),
    var(--surface-1);
  box-shadow: 0 14px 38px color-mix(in srgb, var(--brand-primary-900) 8%, transparent);
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease;
}

.incident-card::before {
  content: '';
  position: absolute;
  z-index: 2;
  inset-block: 0;
  inset-inline-start: 0;
  width: 5px;
  background: linear-gradient(180deg, var(--incident-accent), var(--brand-accent-500));
}

.incident-card::after {
  content: '';
  position: absolute;
  z-index: -1;
  top: -70px;
  inset-inline-end: -50px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: var(--incident-accent-soft);
  filter: blur(14px);
  pointer-events: none;
}

.incident-card:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--incident-accent) 38%, var(--main-border));
  box-shadow: 0 20px 46px color-mix(in srgb, var(--brand-primary-900) 13%, transparent);
}

.incident-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 22px 22px 18px 26px;
  border-bottom: 1px solid var(--main-border);
  background: color-mix(in srgb, var(--surface-2) 68%, transparent);
}

.incident-title-group {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 14px;
}

.incident-title-group > div {
  min-width: 0;
}

.incident-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  border: 1px solid color-mix(in srgb, var(--incident-accent) 25%, transparent);
  border-radius: 15px;
  background: linear-gradient(145deg, var(--incident-accent), var(--brand-primary-700));
  box-shadow: 0 10px 22px color-mix(in srgb, var(--incident-accent) 24%, transparent);
  color: white;
  font-family: 'Bold';
  font-size: 1rem;
  font-weight: 900;
}

.incident-eyebrow {
  display: block;
  margin-bottom: 4px;
  color: var(--incident-accent);
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.incident-title-group a {
  text-decoration: none;
}

.incident-title-group h3 {
  overflow: hidden;
  margin: 0;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: clamp(1.12rem, 1.8vw, 1.38rem);
  font-weight: 900;
  line-height: 1.35;
  text-overflow: ellipsis;
}

.incident-title-group a:hover h3 {
  color: var(--incident-accent);
}

.incident-status-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 32px;
  padding: 6px 11px;
  border: 1px solid color-mix(in srgb, var(--incident-accent) 24%, transparent);
  border-radius: 999px;
  background: var(--incident-accent-soft);
  color: var(--incident-accent);
  font-size: 0.72rem;
  font-weight: 900;
  white-space: nowrap;
}

.incident-card-statuses {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 7px;
}

.incident-investigation-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 32px;
  padding: 6px 11px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 30%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--brand-primary-500) 10%, var(--surface-1));
  color: var(--brand-primary-600);
  font-size: 0.72rem;
  font-weight: 900;
  text-decoration: none;
  white-space: nowrap;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease;
}

.incident-investigation-badge:hover,
.incident-investigation-badge:focus-visible {
  transform: translateY(-1px);
  border-color: var(--brand-primary-500);
  background: color-mix(in srgb, var(--brand-primary-500) 16%, var(--surface-1));
  outline: none;
}

.incident-investigation-icon {
  display: inline-grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--brand-primary-500);
  color: var(--text-on-brand);
  font-size: 0.65rem;
}

.incident-investigation-arrow {
  font-size: 0.86rem;
  transition: transform 0.18s ease;
}

.incident-investigation-badge:hover .incident-investigation-arrow {
  transform: translateX(2px);
}

.incident-status-chip i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 0 4px color-mix(in srgb, currentColor 13%, transparent);
}

.incident-card-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  align-items: stretch;
  gap: 20px;
  padding: 22px 22px 22px 26px;
}

.incident-information {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 16px;
}

.incident-meta-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.incident-meta-item {
  display: flex;
  align-items: center;
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

.incident-meta-item:hover {
  border-color: color-mix(in srgb, var(--incident-accent) 25%, var(--main-border));
  background: var(--incident-accent-soft);
}

.incident-meta-item-link {
  color: inherit;
  text-decoration: none;
}

.incident-meta-item > div {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
}

.incident-meta-label,
.incident-description-label,
.incident-media-label {
  color: var(--text-soft);
  font-size: 0.66rem;
  font-weight: 850;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.incident-meta-item strong {
  overflow: hidden;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.82rem;
  font-weight: 850;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.incident-meta-item .incident-machine-plate {
  color: var(--text-soft);
  font-family: inherit;
  font-size: 0.72rem;
  font-weight: 750;
}

.incident-meta-icon,
.incident-observer-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  border: 1px solid color-mix(in srgb, var(--incident-accent) 18%, transparent);
  border-radius: 12px;
  background: var(--incident-accent-soft);
  color: var(--incident-accent);
  font-family: 'Bold';
  font-size: 0.73rem;
  font-weight: 900;
}

.incident-date-icon,
.incident-zone-icon {
  position: relative;
}

.incident-date-icon::before {
  content: '';
  width: 17px;
  height: 15px;
  border: 2px solid currentColor;
  border-radius: 4px;
}

.incident-date-icon::after {
  content: '';
  position: absolute;
  top: 12px;
  width: 11px;
  border-top: 2px solid currentColor;
}

.incident-zone-icon::before {
  content: '';
  width: 13px;
  height: 13px;
  border: 2px solid currentColor;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
}

.incident-zone-icon::after {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
}

.incident-description {
  position: relative;
  min-height: 90px;
  padding: 15px 16px 15px 20px;
  border: 1px solid color-mix(in srgb, var(--incident-accent) 14%, var(--main-border));
  border-radius: 15px;
  background: var(--incident-accent-soft);
}

.incident-description::before {
  content: '';
  position: absolute;
  inset-block: 15px;
  inset-inline-start: 0;
  width: 3px;
  border-radius: 999px;
  background: var(--incident-accent);
}

.incident-description p {
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

.incident-media-panel {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  border: 1px solid var(--main-border);
  border-radius: 17px;
  background: color-mix(in srgb, var(--surface-2) 78%, transparent);
}

.incident-media-label {
  padding-inline: 3px;
}

.incident-card .card-info,
.incident-card .card-info :deep(.p-image) {
  width: 100%;
  height: 100%;
  min-height: 184px;
}

.incident-card .card-info :deep(.p-image) {
  display: block;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--incident-accent) 17%, var(--main-border));
  border-radius: 12px;
  background: var(--surface-2);
}

.incident-card .card-info :deep(.p-image img) {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.incident-card:hover .card-info :deep(.p-image img) {
  transform: scale(1.035);
}

.incident-card .card-info :deep(.p-image-preview-mask) {
  border-radius: 12px;
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

.incident-no-media {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 184px;
  flex: 1;
  flex-direction: column;
  gap: 9px;
  border: 1px dashed color-mix(in srgb, var(--incident-accent) 22%, var(--main-border));
  border-radius: 12px;
  background: var(--surface-1);
  color: var(--text-soft);
  font-size: 0.72rem;
  font-weight: 750;
}

.incident-no-media svg {
  width: 24px;
  height: 24px;
  color: var(--incident-accent);
  opacity: 0.7;
}

.incident-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 62px;
  padding: 11px 22px 11px 26px;
  border-top: 1px solid var(--main-border);
  background: color-mix(in srgb, var(--surface-2) 72%, transparent);
}

.incident-footer-note {
  color: var(--text-soft);
  font-size: 0.72rem;
  font-weight: 750;
}

.view-incident-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  gap: 10px;
  margin-inline-start: auto;
  padding: 8px 9px 8px 15px;
  border-radius: 12px;
  background: var(--incident-accent);
  box-shadow: 0 8px 18px color-mix(in srgb, var(--incident-accent) 22%, transparent);
  color: white;
  font-size: 0.76rem;
  font-weight: 900;
  text-decoration: none;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.view-incident-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 11px 22px color-mix(in srgb, var(--incident-accent) 28%, transparent);
}

.incident-action-arrow {
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

[dir='rtl'] .incident-action-arrow {
  transform: rotate(180deg);
}

[dir='rtl'] .incident-investigation-arrow {
  transform: rotate(180deg);
}

[dir='rtl'] .incident-investigation-badge:hover .incident-investigation-arrow {
  transform: translateX(-2px) rotate(180deg);
}

@media (max-width: 1050px) {
  .incident-meta-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .incident-card-header,
  .incident-card-body,
  .incident-card-footer {
    padding-inline: 20px 16px;
  }

  .incident-card-header {
    flex-direction: column;
  }

  .incident-card-statuses {
    justify-content: flex-start;
  }

  .incident-card-body {
    grid-template-columns: 1fr;
  }

  .incident-card .card-info,
  .incident-card .card-info :deep(.p-image),
  .incident-no-media {
    min-height: 190px;
  }

  .incident-card .card-info :deep(.p-image) {
    height: 190px;
  }
}

@media (max-width: 540px) {
  .incident-card {
    border-radius: 18px;
  }

  .incident-title-group {
    align-items: flex-start;
  }

  .incident-mark {
    width: 42px;
    height: 42px;
    flex-basis: 42px;
    border-radius: 13px;
  }

  .incident-meta-grid {
    grid-template-columns: 1fr;
  }

  .incident-meta-item {
    min-height: 66px;
  }

  .incident-card-footer {
    align-items: stretch;
    flex-direction: column;
  }

  .view-incident-action {
    width: 100%;
    margin-inline-start: 0;
  }
}

.incident-index-page.is-dark {
  .incident-table-responsive,
  .incident-card-list {
    background-color: transparent !important;
  }

  .index-table-card {
    background: var(--surface-1) !important;
    border-color: var(--main-border) !important;
    box-shadow: 0 14px 34px color-mix(in srgb, var(--text-strong) 22%, transparent) !important;
  }

  .card-header-container {
    border-color: var(--main-border) !important;
  }

  .title {
    color: var(--text-strong) !important;
  }

  .subtitle,
  .label-item-primary,
  .label-item-secondary {
    color: var(--text-soft) !important;
  }

  .label-item-primary span,
  .label-item-secondary span {
    color: var(--PrimaryColor) !important;
  }

  .incident-card-header,
  .incident-card-footer,
  .incident-meta-item,
  .incident-media-panel {
    border-color: var(--main-border);
    background: color-mix(in srgb, var(--surface-2) 82%, transparent);
  }

  .incident-description,
  .incident-no-media {
    border-color: color-mix(in srgb, var(--incident-accent) 24%, var(--main-border));
    background: color-mix(in srgb, var(--incident-accent) 8%, var(--surface-2));
  }
}
.table-responsive.is-dark {
  background-color: var(--surface-1) !important;
}
</style>
