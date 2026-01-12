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
// import FilterDialog from '../Hazard/HazardUtils/filterDialog.vue'
const { t } = useI18n()

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
  equipmentIds?: number[],
  riskLevel?: number[],
  saveStatus?: number[],
  date?: string,
  equipmentTypeIds?: number[],
  equipmentSubTypeIds?: number[]
) => {
  const params = new IndexHazardParams(
    query,
    pageNumber,
    perPage,
    withPage,
    [Observation.AccidentsType],
    37,
    zoonIds,
    projectLocationIds || null,
    projectZoneLozationId
    // equipmentIds,
    // riskLevel,
    // saveStatus,
    // date,
    // equipmentTypeIds,
    // equipmentSubTypeIds,
  )
  await indexHazardController.getData(params)
}

const confirmFilters = (
  date: string,
  locationIds?: number[],
  zoneIds?: number[],
  machineIds?: number[],
  machineTypeIds?: number[],
  machineSubTypeIds?: number[],
  caseIds?: number[],
  statusIds?: number[]
) => {
  fetchHazard(
    '',
    1,
    10,
    1,
    [],
    locationIds,
    zoneIds,
    machineIds,
    statusIds,
    caseIds,
    date,
    machineSubTypeIds,
    machineTypeIds
  )
}

onMounted(async () => {
  fetchHazard()
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
  }
)

const { user } = useUserStore()

const actionList = (id: number, deleteHazard: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/organization/equipment-mangement/incedant/${id}`,
    permission: [
      PermissionsEnum.ORG_INCEDANT_UPDATE,
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
const FetchMyProjects = async () => {
  const fetchMyProjectsParams = new FetchMyProjectsParams()
  const fetchMyProjectsController = FetchMyProjectsController.getInstance()
  const res = await fetchMyProjectsController.getData(fetchMyProjectsParams, router, true)
  if (res.value.data) {
    Projects.value = res.value.data
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
  fetchHazard('', 1, 10, 1, null, null, SelectedZonesFilter.value)
}

const setSelectedProjectFilter = (data) => {
  selectedProjctesFilters.value = data
  if (data) {
    FetchMyZones()
  }
}

const ShowDetails = ref<number[]>([])
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <IndexEquipmentMangement class="col-span-2" />
    <div :class="route?.query?.isAll ? 'col-span-12' : 'col-span-12'">
      <PermissionBuilder :code="[
        PermissionsEnum.ORGANIZATION_EMPLOYEE,

        PermissionsEnum.ORG_INCEDANT_ALL,
        PermissionsEnum.ORG_INCEDANT_DELETE,
        PermissionsEnum.ORG_INCEDANT_FETCH,
        PermissionsEnum.ORG_INCEDANT_UPDATE,
        PermissionsEnum.ORG_INCEDANT_CREATE,
      ]">
        <div>
          <IndexHazardHeader :title="'incedant'" :length="state?.pagination?.total || 0" :projects="Projects"
            @update:data="setSelectedProjectFilter" />
          <div class="flex items-center justify-between">
            <IndexFilter :filters="Filters" @update:data="ApplayFilter"
              :link="'/organization/equipment-mangement/incedant/add'" :linkText="'Create incedant'" />

            <div class="btns-filter">
              <!-- <FilterDialog @confirmFilters="confirmFilters" /> -->

              <router-link :to="`/organization/equipment-mangement/incedant/add`">
                <button class="btn btn-primary">{{ $t('Create incedant') }}</button>
              </router-link>
            </div>
          </div>
        </div>
        <DataStatus :controller="state">
          <template #success>
            <div class="table-responsive">
              <div class="index-table-card-container">
                <div class="index-table-card" v-for="(item, index) in state.data" :key="index">
                  <div class="card-header-container" :class="ShowDetails[index] ? '' : 'show'">
                    <div class="header-container">
                      <div class="card-content">
                        <div class="card-header">
                          <p class="label-item-primary">
                            Serial : <span>{{ item.serial }}</span>
                          </p>
                          <p class="label-item-secondary">
                            Date & Time : <span>{{ item.date }}</span>
                          </p>
                        </div>
                        <div class="card-details">
                          <p class="title">{{ item.observer.name }} <span>(observer)</span></p>
                          <p class="subtitle">{{ item.description }}</p>
                          <div class="project-details">
                            <p class="label-item-primary">
                              Zone : <span>{{ item.zoon?.title }}</span>
                            </p>
                            <p class="label-item-primary">
                              Machine : <span>{{ item.equipment?.title }}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div class="card-info">
                        <!-- <img :src="item.HazardImg" alt="hazard-img"> -->
                        <Image v-if="item.media[0]?.url" :src="item.media[0]?.url" alt="Image" preview>
                          <template #previewicon>
                            <div class="perview">
                              <span>view</span>
                              <ViewIcon />
                            </div>
                          </template>
                        </Image>
                        <img v-else src="@/assets/images/logo.svg" alt="">
                      </div>
                    </div>
                    <p class="show-more" @click="ShowDetails[index] = !ShowDetails[index]">
                      <span v-if="ShowDetails[index]">Show Less</span>
                      <span v-else>Show More</span>
                      <ShowMoreIcon />
                    </p>
                  </div>

                  <div v-if="ShowDetails[index]" class="card-description">
                    <p class="title">Description</p>
                    <p class="description">
                      {{ item.description }}
                    </p>
                  </div>
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
            <DataEmpty :link="`/organization/equipment-mangement/incedant/add`" addText="Add incedant"
              description="Sorry .. You have no incedant .. All your joined customers will appear here when you add your customer data"
              title="..ops! You have No incedant" />
          </template>
          <template #failed>
            <DataFailed :link="`/organization/equipment-mangement/incedant/add`" addText="Add incedant"
              description="Sorry .. You have no incedant .. All your joined customers will appear here when you add your customer data"
              title="..ops! You have No incedant" />
          </template>
        </DataStatus>
        <template #notPermitted>
          <DataFailed addText="Have not  Permission"
            description="Sorry .. You have no incedant .. All your joined customers will appear here when you add your customer data" />
        </template>
      </PermissionBuilder>
    </div>
  </div>
</template>

<style scoped></style>
