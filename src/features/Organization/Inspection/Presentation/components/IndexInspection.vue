<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { useUserStore } from '@/stores/user'
import IndexInspectionController from '../controllers/indexInspectionController'
import IndexInspectionParams from '../../Core/params/indexInspectionParams'
import DeleteInspectionParams from '../../Core/params/deleteInspectionParams'
import DeleteInspectionController from '../controllers/deleteInspectionController'
import IndexFilter from './InspectionUtils/IndexFilter.vue'
import IndexInspectionHeader from './InspectionUtils/IndexInspectionHeader.vue'

import FetchMyProjectsController from '@/features/Organization/ObservationFactory/Presentation/controllers/FetchMyProjectsController'
import FetchMyProjectsParams from '@/features/Organization/ObservationFactory/Core/params/fetchMyProjectsParams'
import FetchMyZonesController from '@/features/Organization/ObservationFactory/Presentation/controllers/FetchMyZonesController'
import FetchMyZonesParams from '@/features/Organization/ObservationFactory/Core/params/FetchMyZonesParams'
import type MyZonesModel from '@/features/Organization/ObservationFactory/Data/models/MyZonesModel'
// import MyProjectsModel from '../../../ObservationFactory/Data/models/MyProjectsModel'
import IndexEquipmentMangement from '@/features/Organization/ObservationFactory/Presentation/components/indexEquipmentMangement.vue'
import InspectionFormPage from './InspectionPages/InspectionFormPage.vue'
import { InspectionTypeEnum } from '../../Core/Enum/InspectionTypeEnum'
import { InspectionPageType } from '@/features/Organization/ObservationFactory/Core/Enums/InspectionTypeEnum'
import InspectionDragPage from './InspectionPages/InspectionDragPage.vue'
import FetchAllTasksController from '../controllers/FetchAllTasksController'
import FetchAllTasksParams from '../../Core/params/FetchAllTasksParams'
import FetchInspectionsResultsController from '../controllers/FetchInspectionsResultsController'
import FetchInspectionsResultsParams from '../../Core/params/FetchInspectionsResultsParams'
import InspectionsResultsPage from './InspectionPages/InspectionsResultsPage.vue'
import { useProjectSelectStore } from '@/stores/ProjectSelect'
import CardSkelaton from './SubComponent/CardSkelaton.vue'
import { useThemeMode } from '@/composables/useThemeMode'
import IndexFilterDialog from '@/shared/HelpersComponents/IndexFilterDialog.vue'
import TitleInterface from '@/base/Data/Models/title_interface'

const { t } = useI18n()
const { isDarkMode } = useThemeMode()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexInspectionController = IndexInspectionController.getInstance()
const state = ref(indexInspectionController.state.value)

const fetchAllTasksController = FetchAllTasksController.getInstance()
const AllTasksState = ref(fetchAllTasksController.state.value)

const fetchInspectionsResultsController = FetchInspectionsResultsController.getInstance()
const InspectionsResultsState = ref(fetchInspectionsResultsController.state.value)

const route = useRoute()
const router = useRouter()
const id = route.params.parent_id
const inspectionType = computed(() => route.query.inspectionType)
const selectedProjctesFilters = ref<number>()
const SelectedZonesFilter = ref<number[]>([])
const filterDate = ref('')
const filterInspectionType = ref<number | null>(null)
const filterFields = [
  {
    key: 'inspectionType',
    label: 'Inspection Type',
    options: [
      new TitleInterface({ id: InspectionTypeEnum.DAY, title: 'Daily' }),
      new TitleInterface({ id: InspectionTypeEnum.PERIOD, title: 'Periodic' }),
    ],
  },
]

const fetchInspection = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
  employeeId?: number[],
  zoneId?: number[],
) => {
  const deleteInspectionParams = new IndexInspectionParams(
    query,
    pageNumber,
    perPage,
    withPage,
    employeeId || null,
    zoneId || null,
    null,
    selectedProjctesFilters.value || null,
    route.query.typeId ? Number(route.query.typeId) : null,
    filterInspectionType.value ?? undefined,
    filterDate.value,
  )
  const res = await indexInspectionController.getData(deleteInspectionParams)
  console.log(res, 'res')
}

const InspectionFormTasks = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
  filter?: number[],
) => {
  const fetchAllTasksParams = new FetchAllTasksParams(
    query,
    pageNumber,
    perPage,
    withPage,
    filter?.length > 0 ? filter : null,
    selectedProjctesFilters.value || null,
    filterInspectionType.value ?? undefined,
    filterDate.value,
  )
  const res = await fetchAllTasksController.getData(fetchAllTasksParams)
}
const InspectionsResultsTasks = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
  filter?: number[],
) => {
  const fetchInspectionsResultsParams = new FetchInspectionsResultsParams(
    query,
    pageNumber,
    perPage,
    withPage,
    filter?.length > 0 ? filter : null,
    selectedProjctesFilters.value || null,
    filterInspectionType.value ?? undefined,
    filterDate.value,
  )
  const res = await fetchInspectionsResultsController.getData(fetchInspectionsResultsParams)
}

const getSelectedZonesFilter = () =>
  SelectedZonesFilter.value.length > 0 ? SelectedZonesFilter.value : undefined

const fetchCurrentInspectionData = (
  query: string = '',
  pageNumber: number = currentPage.value,
  perPage: number = countPerPage.value,
  withPage: number = 1,
) => {
  if (String(route?.query?.inspectionType) == String(InspectionPageType.DragInspection)) {
    return fetchInspection(
      query,
      pageNumber,
      perPage,
      withPage,
      undefined,
      getSelectedZonesFilter(),
    )
  } else if (String(route?.query?.inspectionType) == String(InspectionPageType.InspectionForm)) {
    return InspectionFormTasks(query, pageNumber, perPage, withPage, getSelectedZonesFilter())
  } else {
    return InspectionsResultsTasks(query, pageNumber, perPage, withPage, getSelectedZonesFilter())
  }
}

watch(
  () => [route.query.typeId, route.query.inspectionType],
  () => {
    currentPage.value = 1
    fetchCurrentInspectionData('', 1, countPerPage.value)
  },
  { immediate: true },
)

onMounted(() => {
  FetchMyProjects()
})

const searchInspection = debounce(() => {
  currentPage.value = 1
  fetchCurrentInspectionData(word.value, 1, countPerPage.value)
})

const applyFilters = ({
  date,
  values,
}: {
  date: string
  values: Record<string, number | null>
}) => {
  filterDate.value = date
  filterInspectionType.value = values.inspectionType ?? null
  currentPage.value = 1
  fetchCurrentInspectionData(word.value, 1, countPerPage.value)
}

const resetFilters = () => {
  filterDate.value = ''
  filterInspectionType.value = null
  currentPage.value = 1
  fetchCurrentInspectionData(word.value, 1, countPerPage.value)
}

const deleteInspection = async (id: number) => {
  const deleteInspectionParams = new DeleteInspectionParams(id)
  await DeleteInspectionController.getInstance().deleteInspection(deleteInspectionParams)
  await fetchCurrentInspectionData()
}

// Inspection Form
const handleInspectionFormChangePage = (page: number) => {
  currentPage.value = page
  InspectionFormTasks(
    word.value,
    currentPage.value,
    countPerPage.value,
    1,
    getSelectedZonesFilter(),
  )
}
const handleInspectionFormCountPerPage = (count: number) => {
  countPerPage.value = count
  InspectionFormTasks(
    word.value,
    currentPage.value,
    countPerPage.value,
    1,
    getSelectedZonesFilter(),
  )
}

// Drag Inspection Form
const handleDragInspectionChangePage = (page: number) => {
  currentPage.value = page
  fetchInspection(
    word.value,
    currentPage.value,
    countPerPage.value,
    1,
    undefined,
    getSelectedZonesFilter(),
  )
}
const handleDragInspectionCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchInspection(
    word.value,
    currentPage.value,
    countPerPage.value,
    1,
    undefined,
    getSelectedZonesFilter(),
  )
}

// Inspection Results Form
const handleInspectionResultsChangePage = (page: number) => {
  currentPage.value = page
  InspectionsResultsTasks(
    word.value,
    currentPage.value,
    countPerPage.value,
    1,
    getSelectedZonesFilter(),
  )
}
const handleInspectionResultsCountPerPage = (count: number) => {
  countPerPage.value = count
  InspectionsResultsTasks(
    word.value,
    currentPage.value,
    countPerPage.value,
    1,
    getSelectedZonesFilter(),
  )
}

const { user } = useUserStore()

const actionList = (id: number, deleteInspection: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/organization/Inspection/${id}`,
    permission: [
      PermissionsEnum.ORG_INSPECTION_UPDATE,
      PermissionsEnum.ORG_INSPECTION_DETAILS,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ORG_INSPECTION_ALL,
    ],
  },
  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteInspection(id),
    permission: [
      PermissionsEnum.ORG_INSPECTION_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ORG_INSPECTION_ALL,
    ],
  },
]

const Projects = ref<any[]>([])
const FetchMyProjects = async () => {
  const fetchMyProjectsParams = new FetchMyProjectsParams()
  const fetchMyProjectsController = FetchMyProjectsController.getInstance()
  const res = await fetchMyProjectsController.getData(fetchMyProjectsParams)
  if (res.value.data) {
    Projects.value = res.value.data
  }
}

const ShowDetails = ref<number[]>([])

const Filters = ref<MyZonesModel[]>()
const fetchMyZonesController = FetchMyZonesController.getInstance()
const FetchMyZones = async () => {
  const fetchMyZonesParams = new FetchMyZonesParams(selectedProjctesFilters.value)
  if (selectedProjctesFilters.value) {
    const response = await fetchMyZonesController.FetchMyZones(fetchMyZonesParams, router)
    if (response.value.data) {
      Filters.value = response.value.data
    }
  } else {
    Filters.value = []
  }
}

const ApplayFilter = (data: number[]) => {
  SelectedZonesFilter.value = data

  if (data) {
    currentPage.value = 1
    fetchCurrentInspectionData('', 1, countPerPage.value)
  }
}

const setSelectedProjectFilter = (data?: number) => {
  selectedProjctesFilters.value = data
  SelectedZonesFilter.value = []
  Filters.value = []
  currentPage.value = 1

  fetchCurrentInspectionData('', 1, countPerPage.value)

  if (data) {
    FetchMyZones()
  }
}

watch(
  () => fetchAllTasksController.state.value,
  (newState) => {
    if (newState) {
      console.log(newState)
      AllTasksState.value = newState
      // SelectedController()
    }
  },
)

watch(
  () => indexInspectionController.state.value,
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

watch(
  () => fetchInspectionsResultsController.state.value,
  (newState) => {
    if (newState) {
      console.log(newState)
      InspectionsResultsState.value = newState
    }
  },
  {
    deep: true,
  },
)
const selectedProject = useProjectSelectStore()
</script>

<template>
  <!-- {{ selectedProjctesFilters }} -->
  <div :class="['inspection-index-page grid grid-cols-12 gap-4', { 'is-dark': isDarkMode }]">
    <IndexEquipmentMangement class="col-span-2" />
    <div :class="route?.query?.isAll ? 'col-span-12' : 'col-span-12'">
      <PermissionBuilder
        :code="[
          PermissionsEnum.ORGANIZATION_EMPLOYEE,
          PermissionsEnum?.ORGANIZATION_EMPLOYEE,
          PermissionsEnum?.ORG_INSPECTION_ALL,
          PermissionsEnum?.ORG_INSPECTION_CREATE,
          PermissionsEnum?.ORG_INSPECTION_UPDATE,
          PermissionsEnum?.ORG_INSPECTION_DETAILS,
          PermissionsEnum?.ORG_INSPECTION_DELETE,
          PermissionsEnum?.ORG_INSPECTION_FETCH,
        ]"
      >
        <div class="inspection-controls-panel">
          <IndexInspectionHeader
            :title="`Inspection`"
            :length="
              state?.pagination?.total ||
              AllTasksState?.pagination?.total ||
              InspectionsResultsState?.pagination?.total ||
              0
            "
            :projects="Projects"
            :isProject="selectedProject.project?.id"
            @update:data="setSelectedProjectFilter"
          >
            <template #actions>
              <IndexFilterDialog
                show-date
                :fields="filterFields"
                :initial-date="filterDate"
                :initial-values="{ inspectionType: filterInspectionType }"
                @apply="applyFilters"
                @reset="resetFilters"
              />
              <PermissionBuilder
                :code="[
                  PermissionsEnum?.ORGANIZATION_EMPLOYEE,
                  PermissionsEnum?.ORG_INSPECTION_CREATE,
                ]"
              >
                <router-link
                  v-if="
                    String(route?.query?.inspectionType) ==
                    String(InspectionPageType.InspectionForm)
                  "
                  to="/organization/equipment-mangement/inspection/add"
                >
                  <button class="btn btn-primary create-inspection-btn">
                    <span class="create-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 5v14M5 12h14"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                        />
                      </svg>
                    </span>
                    <span class="create-copy">
                      <small>{{ $t('New inspection') }}</small>
                      <strong>{{ $t('Create Inspection') }}</strong>
                    </span>
                    <span class="create-arrow" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="m9 18 6-6-6-6"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                </router-link>
              </PermissionBuilder>
            </template>
          </IndexInspectionHeader>

          <div v-if="Filters?.length" class="inspection-zone-section">
            <div class="inspection-filter-heading">
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
                <span>{{ $t('Select zones to refine the inspection list') }}</span>
              </div>
            </div>

            <PermissionBuilder
              :code="[
                PermissionsEnum?.ORGANIZATION_EMPLOYEE,
                PermissionsEnum?.ORG_INSPECTION_CREATE,
              ]"
            >
              <IndexFilter
                class="inspection-zone-filter"
                :SelectdProject="selectedProjctesFilters"
                :filters="Filters"
                @update:data="ApplayFilter"
                link=""
                :linkTitle="'Create Inspection'"
              />
            </PermissionBuilder>
          </div>
        </div>
        <DataStatus
          v-if="String(route?.query?.inspectionType) == String(InspectionPageType.InspectionForm)"
          :controller="AllTasksState"
        >
          <template #success>
            <div class="table-responsive inspection-table-responsive">
              <div class="index-table-card-container-inspection inspection-list-panel">
                <div class="header-container w-full">
                  <InspectionFormPage
                    v-if="String(inspectionType) == String(InspectionPageType.InspectionForm)"
                    class="w-full"
                    :data="AllTasksState?.data"
                  />
                </div>
              </div>
            </div>
            <Pagination
              :pagination="AllTasksState.pagination"
              @changePage="handleInspectionFormChangePage"
              @countPerPage="handleInspectionFormCountPerPage"
            />
          </template>
          <template #loader>
            <CardSkelaton />
          </template>
          <template #initial>
            <CardSkelaton />
          </template>
          <template #empty>
            <PermissionBuilder
              :code="[
                PermissionsEnum?.ORGANIZATION_EMPLOYEE,
                PermissionsEnum?.ORG_INSPECTION_CREATE,
              ]"
            >
              <DataFailed
                :link="`/organization/equipment-mangement/inspection/add`"
                addText="Add Inspection"
                description="Sorry .. You have no Inspection .. All your joined customers will appear here when you add your customer data"
                title="..ops! You have No Inspection"
              />
            </PermissionBuilder>
          </template>
          <template #failed>
            <PermissionBuilder
              :code="[
                PermissionsEnum?.ORGANIZATION_EMPLOYEE,
                PermissionsEnum?.ORG_INSPECTION_CREATE,
              ]"
            >
              <DataFailed
                :link="`/organization/equipment-mangement/inspection/add`"
                addText="Add Inspection"
                description="Sorry .. You have no Inspection .. All your joined customers will appear here when you add your customer data"
                title="..ops! You have No Inspection"
              />
            </PermissionBuilder>
          </template>
        </DataStatus>
        <DataStatus
          v-if="String(route?.query?.inspectionType) == String(InspectionPageType.DragInspection)"
          :controller="state"
        >
          <template #success>
            <div class="table-responsive inspection-table-responsive">
              <div class="index-table-card-container-inspection inspection-list-panel">
                <div class="header-container w-full">
                  <InspectionDragPage
                    v-if="String(inspectionType) == String(InspectionPageType.DragInspection)"
                    class="w-full"
                    :data="state?.data"
                  />
                </div>
              </div>
            </div>
            <Pagination
              :pagination="state.pagination"
              @changePage="handleDragInspectionChangePage"
              @countPerPage="handleDragInspectionCountPerPage"
            />
          </template>
          <template #loader>
            <CardSkelaton />
          </template>
          <template #initial>
            <CardSkelaton />
          </template>
          <template #empty>
            <PermissionBuilder
              :code="[
                PermissionsEnum?.ORGANIZATION_EMPLOYEE,
                PermissionsEnum?.ORG_INSPECTION_CREATE,
              ]"
            >
              <DataEmpty
                description="Sorry .. You have no Inspection .. All your joined customers will appear here when you add your customer data"
                title="..ops! You have No Inspection"
                :link="`/organization`"
              />
            </PermissionBuilder>
          </template>
          <template #failed>
            <PermissionBuilder
              :code="[
                PermissionsEnum?.ORGANIZATION_EMPLOYEE,
                PermissionsEnum?.ORG_INSPECTION_CREATE,
              ]"
            >
              <DataFailed
                description="Sorry .. You have no Inspection .. All your joined customers will appear here when you add your customer data"
                title="..ops! You have No Inspection"
                :link="`/organization`"
              />
            </PermissionBuilder>
          </template>
        </DataStatus>
        <DataStatus
          v-if="String(route?.query?.inspectionType) == String(InspectionPageType.Result)"
          :controller="InspectionsResultsState"
        >
          <template #success>
            <div class="table-responsive inspection-table-responsive">
              <div class="index-table-card-container-inspection inspection-list-panel">
                <div class="header-container w-full">
                  <InspectionsResultsPage
                    v-if="String(inspectionType) == String(InspectionPageType.Result)"
                    class="w-full"
                    :data="InspectionsResultsState?.data"
                  />
                </div>
              </div>
            </div>
            <Pagination
              :pagination="InspectionsResultsState?.pagination"
              @changePage="handleInspectionResultsChangePage"
              @countPerPage="handleInspectionResultsCountPerPage"
            />
          </template>
          <template #loader>
            <CardSkelaton />
          </template>
          <template #initial>
            <CardSkelaton />
          </template>
          <template #empty>
            <PermissionBuilder
              :code="[
                PermissionsEnum?.ORGANIZATION_EMPLOYEE,
                PermissionsEnum?.ORG_INSPECTION_CREATE,
              ]"
            >
              <DataEmpty
                :link="`/organization/equipment-mangement/inspection/add`"
                addText="Add Inspection"
                description="Sorry .. You have no Inspection .. All your joined customers will appear here when you add your customer data"
                title="..ops! You have No Inspection"
              />
            </PermissionBuilder>
          </template>
          <template #failed>
            <PermissionBuilder
              :code="[
                PermissionsEnum?.ORGANIZATION_EMPLOYEE,
                PermissionsEnum?.ORG_INSPECTION_CREATE,
              ]"
            >
              <DataFailed
                :link="`/organization/equipment-mangement/inspection/add`"
                addText="Add Inspection"
                description="Sorry .. You have no Inspection .. All your joined customers will appear here when you add your customer data"
                title="..ops! You have No Inspection"
              />
            </PermissionBuilder>
          </template>
        </DataStatus>

        <template #notPermitted>
          <DataFailed
            addText="Have not  Permission"
            description="Sorry .. You have no Inspection .. All your joined customers will appear here when you add your customer data"
          />
        </template>
      </PermissionBuilder>
    </div>
  </div>
</template>

<style scoped>
.inspection-controls-panel {
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

.inspection-controls-panel :deep(.idnex-header) {
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.inspection-controls-panel :deep(.idnex-header > .title),
.inspection-controls-panel :deep(.index-title-row > .title) {
  font-size: clamp(1.35rem, 2vw, 1.8rem);
  letter-spacing: -0.02em;
  text-transform: capitalize;
}

.inspection-zone-section {
  margin-top: 18px;
  padding: 14px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 11%, var(--main-border));
  border-radius: 16px;
  background: color-mix(in srgb, var(--surface-1) 88%, transparent);
  box-shadow: inset 0 1px 0 color-mix(in srgb, white 65%, transparent);
}

.inspection-filter-heading {
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

.inspection-filter-heading p {
  margin: 0;
  color: var(--header-page-color);
  font-size: 0.9rem;
  font-weight: 900;
}

.inspection-filter-heading div > span {
  color: var(--GrayText-1);
  font-size: 0.76rem;
  font-weight: 600;
}

.inspection-zone-filter :deep(.idnex-filter) {
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.inspection-zone-filter :deep(.filter-container) {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 100%;
  padding: 2px 2px 8px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x proximity;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--brand-primary-400) 50%, transparent) transparent;
}

.inspection-zone-filter :deep(.filter) {
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

.inspection-zone-filter :deep(.filter:hover) {
  transform: translateY(-1px);
  border-color: var(--brand-primary-200);
  background: var(--brand-primary-50);
  color: var(--brand-primary-500);
}

.inspection-zone-filter :deep(.filter.active) {
  border-color: color-mix(in srgb, var(--status-success) 50%, transparent);
  background: var(--PrimaryColor);
  color: var(--text-on-brand);
  box-shadow: 0 10px 22px color-mix(in srgb, var(--brand-primary-500) 20%, transparent);
}

.create-inspection-btn {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: auto;
  min-width: max-content;
  min-height: 52px;
  padding: 7px 9px 7px 10px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 24%, transparent);
  border-radius: 15px;
  background: linear-gradient(
    135deg,
    var(--PrimaryColor),
    color-mix(in srgb, var(--PrimaryColor) 78%, var(--status-success))
  );
  color: white;
  white-space: nowrap;
  box-shadow:
    0 10px 22px color-mix(in srgb, var(--PrimaryColor) 22%, transparent),
    inset 0 1px 0 color-mix(in srgb, white 24%, transparent);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    filter 0.18s ease;
}

.create-inspection-btn::before {
  content: '';
  position: absolute;
  top: -36px;
  inset-inline-end: -22px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: color-mix(in srgb, white 12%, transparent);
  pointer-events: none;
}

.create-inspection-btn:hover {
  color: white;
  filter: saturate(1.08);
  transform: translateY(-2px);
  box-shadow:
    0 15px 28px color-mix(in srgb, var(--PrimaryColor) 28%, transparent),
    inset 0 1px 0 color-mix(in srgb, white 28%, transparent);
}

.create-icon {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  border: 1px solid color-mix(in srgb, white 18%, transparent);
  border-radius: 11px;
  background: color-mix(in srgb, white 14%, transparent);
}

.create-icon svg {
  width: 18px;
  height: 18px;
}

.create-copy {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
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

.create-arrow {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 34px;
  border-radius: 10px;
  background: color-mix(in srgb, white 10%, transparent);
  transition: transform 0.18s ease;
}

.create-arrow svg {
  width: 16px;
  height: 16px;
}

.create-inspection-btn:hover .create-arrow {
  transform: translateX(2px);
}

[dir='rtl'] .create-arrow svg {
  transform: rotate(180deg);
}

[dir='rtl'] .create-inspection-btn:hover .create-arrow {
  transform: translateX(-2px);
}

@media (max-width: 768px) {
  .inspection-controls-panel {
    padding: 16px;
    border-radius: 18px;
  }

  .create-inspection-btn {
    width: 100%;
  }
}

.table-responsive {
  padding: 0 !important;
  border: none !important;
  background-color: var(--surface-1) !important;
}
.index-table-card-container-inspection {
  width: 100% !important;
  max-width: none !important;
  background-color: var(--surface-1) !important;
}

.inspection-list-panel,
.inspection-list-panel .header-container,
.inspection-table-responsive {
  width: 100% !important;
  max-width: none !important;
}
</style>
