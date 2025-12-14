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
import Image from 'primevue/image'

import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'

import { useUserStore } from '@/stores/user'

import TitleInterface from '@/base/Data/Models/title_interface'
import HazardType from '@/assets/images/HazardType.jpg'

// import ShowMoreIcon from '@/shared/icons/ShowMoreIcon.vue'
// import ViewIcon from '@/shared/icons/ViewIcon.vue'
import IndexInspectionController from '../controllers/indexInspectionController'
import IndexInspectionParams from '../../Core/params/indexInspectionParams'
import DeleteInspectionParams from '../../Core/params/deleteInspectionParams'
import DeleteInspectionController from '../controllers/deleteInspectionController'
import IndexFilter from './InspectionUtils/IndexFilter.vue'
import IndexInspectionHeader from './InspectionUtils/IndexInspectionHeader.vue'
import ArrowDetails from '@/shared/icons/ArrowDetails.vue'
import { InspectionStatus } from '../../Core/Enum/InspectionStatusEnum'
import InspectionStartTemplate from './InspectionDialog/InspectionStartTemplate.vue'
import FetchMyProjectsController from '@/features/Organization/ObservationFactory/Presentation/controllers/FetchMyProjectsController'
import FetchMyProjectsParams from '@/features/Organization/ObservationFactory/Core/params/fetchMyProjectsParams'
import type ProjectModel from '@/features/Organization/Project/Data/models/ProjectModel'
import FetchMyZonesController from '@/features/Organization/ObservationFactory/Presentation/controllers/FetchMyZonesController'
import FetchMyZonesParams from '@/features/Organization/ObservationFactory/Core/params/FetchMyZonesParams'
import type MyZonesModel from '@/features/Organization/ObservationFactory/Data/models/MyZonesModel'
import MyProjectsModel from '../../../ObservationFactory/Data/models/MyProjectsModel'
import IndexEquipmentMangement from '@/features/Organization/ObservationFactory/Presentation/components/indexEquipmentMangement.vue'

const { t } = useI18n()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexInspectionController = IndexInspectionController.getInstance()
const state = ref(indexInspectionController.state.value)
const route = useRoute()
const router = useRouter()
const id = route.params.parent_id

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

onMounted(() => {
  fetchInspection()
  FetchMyProjects()
  // if (selectedProjctesFilters.value == null || selectedProjctesFilters.value == undefined) {
  // FetchMyZones()
  // }
})

const searchInspection = debounce(() => {
  fetchInspection(word.value)
})

const deleteInspection = async (id: number) => {
  const deleteInspectionParams = new DeleteInspectionParams(id)
  await DeleteInspectionController.getInstance().deleteInspection(deleteInspectionParams)
  await fetchInspection()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchInspection('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchInspection('', currentPage.value, countPerPage.value)
}

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

const { user } = useUserStore()

const actionList = (id: number, deleteInspection: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/organization/Inspection/${id}`,
    permission: [
      PermissionsEnum.ORG_INSPECTION_UPDATE,
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
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <IndexEquipmentMangement class="col-span-2" />
    <div :class="route?.query?.isAll ? 'col-span-12' : 'col-span-10'">
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

          <IndexFilter v-if="selectedProjctesFilters" :filters="Filters" @update:data="ApplayFilter"
            :link="'/organization/equipment-mangement/inspection/add'" :linkTitle="'Create Inspection'" />
        </div>
        <DataStatus :controller="state">
          <template #success>
            <!-- <pre>{{ state.data }}</pre> -->
            <div class="table-responsive">
              <div class="index-table-card-container-inspection">
                <div class="index-table-card" v-for="(item, index) in state.data" :key="index">
                  <div class="card-header-container" :class="ShowDetails[index] ? '' : 'show'">
                    <div class="header-container">
                      <div class="card-content">
                        <div class="card-header">
                          <p class="label-item-primary">
                            Assigned to : <span>{{ item?.morph?.title }}</span>
                          </p>
                        </div>
                        <div class="card-details">
                          <p class="title">
                            {{ item?.template?.title }}
                          </p>
                          <span>{{ item.date }}</span>
                        </div>
                      </div>
                      <!-- <div class="card-info-status" >Start</div> -->

                      <InspectionStartTemplate :templateId="item?.template?.id" :taskId="item?.id"
                        :status="item?.status" />

                      <!-- <button class="show-details" v-if="item.status == InspectionStatus.FINISHED">
                        <span> show inspection details </span>
                        <ArrowDetails />
                      </button> -->
                    </div>
                  </div>

                  <!-- <div v-if="ShowDetails[index]" class="card-description">
                    <p class="title">Description</p>
                    <p class="description">
                      {{ item.description || '__' }}
                    </p>
                  </div> -->
                </div>
              </div>
            </div>
            <Pagination :pagination="state.pagination" @changePage="handleChangePage"
              @countPerPage="handleCountPerPage" />
          </template>
          <template #loader>
            <TableLoader :cols="3" :rows="10" />
          </template>
          <template #initial>
            <TableLoader :cols="3" :rows="10" />
          </template>
          <template #empty>
            <DataEmpty :link="`/organization/equipment-mangement/inspection/add`" addText="Add Inspection"
              description="Sorry .. You have no Inspection .. All your joined customers will appear here when you add your customer data"
              title="..ops! You have No Inspection" />
          </template>
          <template #failed>
            <DataFailed :link="`/organization/equipment-mangement/inspection/add`" addText="Add Inspection"
              description="Sorry .. You have no Inspection .. All your joined customers will appear here when you add your customer data"
              title="..ops! You have No Inspection" />
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
