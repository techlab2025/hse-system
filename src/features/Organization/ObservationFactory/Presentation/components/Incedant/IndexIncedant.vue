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
import ShowMoreIcon from '@/shared/icons/ShowMoreIcon.vue'
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

const ShowDetails = ref<number[]>([])
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
                      <span>{{ $t('incedent Report') }}</span>
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
                <div class="index-table-card" v-for="(item, index) in state.data" :key="index">
                  <div class="card-header-container" :class="ShowDetails[index] ? '' : 'show'">
                    <div class="header-container">
                      <router-link
                        class="w-full"
                        :to="`/organization/equipment-mangement/incedant/show/${item?.id}`"
                      >
                        <div class="card-content">
                          <div class="card-header">
                            <p class="label-item-primary">
                              {{ $t('Serial') }} : <span>{{ item.serialName }}</span>
                            </p>
                            <p class="label-item-secondary">
                              {{ $t('Date & Time') }} :
                              <span
                                >{{ item.updatedAt ? formatJoinDate(item.updatedAt) : '--' }} &
                                {{ item.updatedAt ? formatTime(item.updatedAt) : '--' }}</span
                              >
                            </p>
                          </div>
                          <div class="card-details">
                            <p class="title">
                              {{ item.observer.name }} <span>{{ $t('(observer)') }}</span>
                            </p>
                            <p class="subtitle">{{ item.title }}</p>
                            <p class="subtitle">{{ item.description }}</p>
                            <div class="project-details">
                              <p class="label-item-primary">
                                {{ $t('Zone') }} : <span>{{ item.zoon?.title }}</span>
                              </p>
                              <p class="label-item-primary">
                                {{ $t('Machine') }} : <span>{{ item.equipment?.title }}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </router-link>
                      <div class="card-info">
                        <!-- <img :src="item.HazardImg" alt="hazard-img"> -->
                        <Image
                          v-if="item.media[0]?.url"
                          :src="item.media[0]?.url"
                          alt="Image"
                          preview
                        >
                          <template #previewicon>
                            <div class="perview">
                              <span>{{ $t('view') }}</span>
                              <ViewIcon />
                            </div>
                          </template>
                        </Image>
                        <img v-else src="@/assets/images/logo.svg" alt="" />
                      </div>
                    </div>
                    <!-- <p class="show-more" @click="ShowDetails[index] = !ShowDetails[index]">
                        <span v-if="ShowDetails[index]">Show Less</span>
                        <span v-else>Show More</span>
                        <ShowMoreIcon />
                      </p> -->
                  </div>

                  <!-- <div v-if="ShowDetails[index]" class="card-description">
                      <p class="title">Description</p>
                      <p class="description">
                        {{ item.description }}
                      </p>
                    </div> -->
                </div>
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
                addText="Add incedant"
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
                addText="Add incedant"
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
  border: 1px solid color-mix(in srgb, var(--status-danger) 16%, var(--main-border));
  border-radius: 22px;
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--status-danger) 6%, transparent),
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
  background: color-mix(in srgb, var(--status-danger) 14%, transparent);
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
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  padding-top: 18px;
}

.incident-filter-area {
  min-width: 0;
  flex: 1;
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
  background: color-mix(in srgb, var(--status-danger) 9%, transparent);
  color: var(--status-danger);
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
  flex-wrap: wrap;
  gap: 9px;
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.incident-zone-filter :deep(.filter) {
  margin: 0;
  padding: 9px 14px;
  border: 1px solid var(--main-border);
  border-radius: 999px;
  background: var(--surface-1);
  color: var(--GrayText-1);
  font-size: 0.8rem;
  font-weight: 800;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease,
    color 0.18s ease,
    box-shadow 0.18s ease;
}

.incident-zone-filter :deep(.filter:hover) {
  border-color: color-mix(in srgb, var(--status-danger) 28%, var(--main-border));
  color: var(--status-danger);
  transform: translateY(-1px);
}

.incident-zone-filter :deep(.filter.active) {
  border-color: var(--status-danger);
  background: var(--status-danger);
  color: white;
  box-shadow: 0 8px 20px color-mix(in srgb, var(--status-danger) 22%, transparent);
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
}
.table-responsive.is-dark {
  background-color: var(--surface-1) !important;
}
</style>
