<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
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
import MyProjectsModel from '../../../ObservationFactory/Data/models/MyProjectsModel'
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

const { t } = useI18n()

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
const inspectionType = route.query.inspectionType

const fetchInspection = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
  employeeId?: number[],
  zoneId?: number[]
) => {
  const deleteInspectionParams = new IndexInspectionParams(
    query,
    pageNumber,
    perPage,
    withPage,
    employeeId || null,
    zoneId || null
  )
  const res = await indexInspectionController.getData(deleteInspectionParams)
  console.log(res, 'res')
}
const InspectionFormTasks = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const fetchAllTasksParams = new FetchAllTasksParams(
    query,
    pageNumber,
    perPage,
    withPage,
  )
  const res = await fetchAllTasksController.getData(fetchAllTasksParams)
}
const InspectionsResultsTasks = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const fetchInspectionsResultsParams = new FetchInspectionsResultsParams(
    query,
    pageNumber,
    perPage,
    withPage,

  )
  const res = await fetchInspectionsResultsController.getData(fetchInspectionsResultsParams)
}

onMounted(() => {
  if (String(route?.query?.inspectionType) == String(InspectionPageType.DragInspection)) {
    fetchInspection()
  }
  else if (String(route?.query?.inspectionType) == String(InspectionPageType.InspectionForm)) {
    InspectionFormTasks()
  }
  else {
    InspectionsResultsTasks()
  }
  FetchMyProjects()

})

const searchInspection = debounce(() => {
  fetchInspection(word.value)
})

const deleteInspection = async (id: number) => {
  const deleteInspectionParams = new DeleteInspectionParams(id)
  await DeleteInspectionController.getInstance().deleteInspection(deleteInspectionParams)
  await fetchInspection()
}

// Inspection Form
const handleInspectionFormChangePage = (page: number) => {
  currentPage.value = page
  InspectionFormTasks('', currentPage.value, countPerPage.value)
}
const handleInspectionFormCountPerPage = (count: number) => {
  countPerPage.value = count
  InspectionFormTasks('', currentPage.value, countPerPage.value)
}


// Drag Inspection Form
const handleDragInspectionChangePage = (page: number) => {
  currentPage.value = page
  fetchInspection('', currentPage.value, countPerPage.value)
}
const handleDragInspectionCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchInspection('', currentPage.value, countPerPage.value)
}

// Inspection Results Form
const handleInspectionResultsChangePage = (page: number) => {
  currentPage.value = page
  fetchInspection('', currentPage.value, countPerPage.value)
}
const handleInspectionResultsCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchInspection('', currentPage.value, countPerPage.value)
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

const Projects = ref<MyProjectsModel[]>([])
const FetchMyProjects = async () => {
  const fetchMyProjectsParams = new FetchMyProjectsParams()
  const fetchMyProjectsController = FetchMyProjectsController.getInstance()
  const res = await fetchMyProjectsController.getData(fetchMyProjectsParams)
  if (res.value.data) {
    Projects.value = res.value.data
  }
}

const ShowDetails = ref<number[]>([])
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
  fetchInspection('', 1, 10, 1, null, SelectedZonesFilter.value)
}

const setSelectedProjectFilter = (data) => {
  // console.log(data, 'selected project filter')
  selectedProjctesFilters.value = data
  if (data) {
    FetchMyZones()
  }
}

watch(() => fetchAllTasksController.state.value, (newState) => {
  if (newState) {
    console.log(newState)
    AllTasksState.value = newState
    // SelectedController()
  }
})


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
  }
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
  }
)


</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <IndexEquipmentMangement class="col-span-2" />
    <div :class="route?.query?.isAll ? 'col-span-12' : 'col-span-12'">
      <PermissionBuilder :code="[
        PermissionsEnum.ORGANIZATION_EMPLOYEE,
        PermissionsEnum?.ORGANIZATION_EMPLOYEE,
        PermissionsEnum?.ORG_INSPECTION_ALL,
        PermissionsEnum?.ORG_INSPECTION_CREATE,
        PermissionsEnum?.ORG_INSPECTION_UPDATE,
        PermissionsEnum?.ORG_INSPECTION_DETAILS,
        PermissionsEnum?.ORG_INSPECTION_DELETE,
        PermissionsEnum?.ORG_INSPECTION_FETCH,
      ]">
        <div>
          <IndexInspectionHeader :title="`Inspection`" :length="state?.pagination?.total || 0" :projects="Projects"
            @update:data="setSelectedProjectFilter" />

          <PermissionBuilder :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.ORG_INSPECTION_CREATE]">

            <IndexFilter :filters="Filters" @update:data="ApplayFilter"
              :link="String(route?.query?.inspectionType) == String(InspectionPageType.InspectionForm) ? '/organization/equipment-mangement/inspection/add' : ''"
              :linkTitle="'Create Inspection'" />
          </PermissionBuilder>
        </div>
        <DataStatus v-if="String(route?.query?.inspectionType) == String(InspectionPageType.InspectionForm)"
          :controller="AllTasksState">
          <template #success>
            <div class="table-responsive">
              <div class="index-table-card-container-inspection">
                <div class="header-container w-full">
                  <InspectionFormPage v-if="String(inspectionType) == String(InspectionPageType.InspectionForm)"
                    class="w-full" :data="AllTasksState?.data" />
                </div>
              </div>
            </div>
            <Pagination :pagination="AllTasksState.pagination" @changePage="handleInspectionFormChangePage"
              @countPerPage="handleInspectionFormCountPerPage" />
          </template>
          <template #loader>
            <TableLoader :cols="3" :rows="10" />
          </template>
          <template #initial>
            <TableLoader :cols="3" :rows="10" />
          </template>
          <template #empty>
            <PermissionBuilder :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.ORG_INSPECTION_CREATE]">
              <DataEmpty :link="`/organization/equipment-mangement/inspection/add`" addText="Add Inspection"
                description="Sorry .. You have no Inspection .. All your joined customers will appear here when you add your customer data"
                title="..ops! You have No Inspection" />
            </PermissionBuilder>
          </template>
          <template #failed>
            <PermissionBuilder :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.ORG_INSPECTION_CREATE]">
              <DataFailed :link="`/organization/equipment-mangement/inspection/add`" addText="Add Inspection"
                description="Sorry .. You have no Inspection .. All your joined customers will appear here when you add your customer data"
                title="..ops! You have No Inspection" />
            </PermissionBuilder>
          </template>
        </DataStatus>
        <DataStatus v-if="String(route?.query?.inspectionType) == String(InspectionPageType.DragInspection)"
          :controller="state">
          <template #success>

            <div class="table-responsive">
              <div class="index-table-card-container-inspection">
                <div class="header-container w-full">
                  <InspectionDragPage v-if="String(inspectionType) == String(InspectionPageType.DragInspection)"
                    class="w-full" :data="state?.data" />
                </div>

              </div>
            </div>
            <Pagination :pagination="state.pagination" @changePage="handleDragInspectionChangePage"
              @countPerPage="handleDragInspectionCountPerPage" />
          </template>
          <template #loader>
            <TableLoader :cols="3" :rows="10" />
          </template>
          <template #initial>
            <TableLoader :cols="3" :rows="10" />
          </template>
          <template #empty>
            <PermissionBuilder :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.ORG_INSPECTION_CREATE]">

              <DataEmpty :link="`/organization/equipment-mangement/inspection/add`" addText="Add Inspection"
                description="Sorry .. You have no Inspection .. All your joined customers will appear here when you add your customer data"
                title="..ops! You have No Inspection" />
            </PermissionBuilder>
          </template>
          <template #failed>
            <PermissionBuilder :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.ORG_INSPECTION_CREATE]">

              <DataFailed :link="`/organization/equipment-mangement/inspection/add`" addText="Add Inspection"
                description="Sorry .. You have no Inspection .. All your joined customers will appear here when you add your customer data"
                title="..ops! You have No Inspection" />
            </PermissionBuilder>
          </template>
        </DataStatus>
        <DataStatus v-if="String(route?.query?.inspectionType) == String(InspectionPageType.Result)"
          :controller="InspectionsResultsState">
          <template #success>
            <div class="table-responsive">
              <div class="index-table-card-container-inspection">
                <div class="header-container w-full">
                  <InspectionsResultsPage v-if="String(inspectionType) == String(InspectionPageType.Result)"
                    class="w-full" :data="InspectionsResultsState?.data" />
                </div>

              </div>
            </div>
            <Pagination :pagination="InspectionsResultsState?.pagination"
              @changePage="handleInspectionResultsChangePage" @countPerPage="handleInspectionResultsCountPerPage" />
          </template>
          <template #loader>
            <TableLoader :cols="3" :rows="10" />
          </template>
          <template #initial>
            <TableLoader :cols="3" :rows="10" />
          </template>
          <template #empty>
            <PermissionBuilder :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.ORG_INSPECTION_CREATE]">

              <DataEmpty :link="`/organization/equipment-mangement/inspection/add`" addText="Add Inspection"
                description="Sorry .. You have no Inspection .. All your joined customers will appear here when you add your customer data"
                title="..ops! You have No Inspection" />
            </PermissionBuilder>
          </template>
          <template #failed>
            <PermissionBuilder :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.ORG_INSPECTION_CREATE]">

              <DataFailed :link="`/organization/equipment-mangement/inspection/add`" addText="Add Inspection"
                description="Sorry .. You have no Inspection .. All your joined customers will appear here when you add your customer data"
                title="..ops! You have No Inspection" />
            </PermissionBuilder>
          </template>
        </DataStatus>

        <template #notPermitted>
          <DataFailed addText="Have not  Permission"
            description="Sorry .. You have no Inspection .. All your joined customers will appear here when you add your customer data" />
        </template>
      </PermissionBuilder>
    </div>
  </div>
</template>
