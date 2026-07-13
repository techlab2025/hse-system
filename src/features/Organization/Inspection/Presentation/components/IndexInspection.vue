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
    null,
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

const deleteInspection = async (id: number) => {
  const deleteInspectionParams = new DeleteInspectionParams(id)
  await DeleteInspectionController.getInstance().deleteInspection(deleteInspectionParams)
  await fetchCurrentInspectionData()
}

// Inspection Form
const handleInspectionFormChangePage = (page: number) => {
  currentPage.value = page
  InspectionFormTasks('', currentPage.value, countPerPage.value, 1, getSelectedZonesFilter())
}
const handleInspectionFormCountPerPage = (count: number) => {
  countPerPage.value = count
  InspectionFormTasks('', currentPage.value, countPerPage.value, 1, getSelectedZonesFilter())
}

// Drag Inspection Form
const handleDragInspectionChangePage = (page: number) => {
  currentPage.value = page
  fetchInspection('', currentPage.value, countPerPage.value, 1, undefined, getSelectedZonesFilter())
}
const handleDragInspectionCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchInspection('', currentPage.value, countPerPage.value, 1, undefined, getSelectedZonesFilter())
}

// Inspection Results Form
const handleInspectionResultsChangePage = (page: number) => {
  currentPage.value = page
  InspectionsResultsTasks('', currentPage.value, countPerPage.value, 1, getSelectedZonesFilter())
}
const handleInspectionResultsCountPerPage = (count: number) => {
  countPerPage.value = count
  InspectionsResultsTasks('', currentPage.value, countPerPage.value, 1, getSelectedZonesFilter())
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
    FetchMyZones()
    // console.log(res.value.data?.length, "res.value.data?.length");
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
  }
}

const ApplayFilter = (data: number[]) => {
  SelectedZonesFilter.value = data

  if (data) {
    currentPage.value = 1
    fetchCurrentInspectionData('', 1, countPerPage.value)
  }
}

const setSelectedProjectFilter = (data) => {
  // if(data != selectedProjctesFilters.value){
  //   SelectedZonesFilter.value = []
  //   Filters.value =
  // }
  selectedProjctesFilters.value = data

  if (data) {
    currentPage.value = 1
    fetchCurrentInspectionData('', 1, countPerPage.value)
  }

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
            @update:data="setSelectedProjectFilter"
          />

          <PermissionBuilder
            :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.ORG_INSPECTION_CREATE]"
          >
            <IndexFilter
              :SelectdProject="selectedProjctesFilters"
              :filters="Filters"
              @update:data="ApplayFilter"
              :link="
                String(route?.query?.inspectionType) == String(InspectionPageType.InspectionForm)
                  ? '/organization/equipment-mangement/inspection/add'
                  : ''
              "
              :linkTitle="'Create Inspection'"
            />
          </PermissionBuilder>
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
.table-responsive {
  padding: 0 !important;
  border: none !important;
  background-color: var(--surface-1) !important;
}
.index-table-card-container-inspection {
  background-color: var(--surface-1) !important;
}
</style>
