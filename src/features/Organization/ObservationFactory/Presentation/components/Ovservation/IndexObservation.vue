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
import { RiskLevelEnum } from '../../../Core/Enums/risk_level_enum'
import PinIcons from '@/shared/icons/PinIcons.vue'
import HighLevel from '@/shared/icons/HighLevel.vue'
import { SaveStatusEnum } from '../../../Core/Enums/save_status_enum'
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
  projectIds?: number,

) => {
  const params = new IndexHazardParams(
    query,
    pageNumber,
    perPage,
    withPage,
    [Observation.ObservationType, Observation.HazardType],
    [projectIds],
    zoonIds,
    projectLocationIds || null,
    projectZoneLozationId,

    // riskLevel,
    // saveStatus,
    // date,
    // equipmentTypeIds,
    // equipmentSubTypeIds,
  )
  console.log(params, 'Params')
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
//   statusIds?: number[],
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
//     machineTypeIds,
//   )
// }

onMounted(() => {
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
  fetchHazard('', 1, 10, 1, null, null, SelectedZonesFilter.value, selectedProjctesFilters.value)
}

const setSelectedProjectFilter = (data) => {
  selectedProjctesFilters.value = data
  console.log(data, "data")
  fetchHazard("", 1, 10, 0, null, null, null, data)
  if (data) {
    FetchMyZones()
  }
}

const ShowDetails = ref<number[]>([])

const GetRiskLevel = (riskLevel: RiskLevelEnum) => {
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
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <IndexEquipmentMangement class="col-span-2" />
    <div :class="route?.query?.isAll ? 'col-span-12' : 'col-span-12'">
      <PermissionBuilder :code="[
        PermissionsEnum.ORGANIZATION_EMPLOYEE,
        PermissionsEnum.ORG_OBSERVATION_ALL,
        PermissionsEnum.ORG_OBSERVATION_DELETE,
        PermissionsEnum.ORG_OBSERVATION_FETCH,
        PermissionsEnum.ORG_OBSERVATION_UPDATE,
        PermissionsEnum.ORG_OBSERVATION_CREATE,
      ]">
        <div>
          <IndexHazardHeader :title="`observation`" :length="state?.pagination?.total || 0" :projects="Projects"
            @update:data="setSelectedProjectFilter" />

          <div class="flex items-center justify-between">
            <PermissionBuilder :code="[
              PermissionsEnum?.ORGANIZATION_EMPLOYEE,
              PermissionsEnum?.ORG_OBSERVATION_CREATE,
            ]">
              <IndexFilter :filters="Filters" @update:data="ApplayFilter"
                :link="'/organization/equipment-mangement/observation/add'" :linkText="'Create Observation'" />
            </PermissionBuilder>

            <div class="btns-filter">
              <!-- <FilterDialog @confirmFilters="confirmFilters" /> -->

              <PermissionBuilder :code="[
                PermissionsEnum?.ORGANIZATION_EMPLOYEE,
                PermissionsEnum?.ORG_OBSERVATION_CREATE,
              ]">
                <router-link :to="`/organization/equipment-mangement/observation/add`">
                  <button class="btn btn-primary">{{ $t('Create observation') }}</button>
                </router-link>
              </PermissionBuilder>
            </div>
          </div>
        </div>
        <DataStatus :controller="state">
          <template #success>
            <div class="table-responsive">
              <div class="index-table-card-container">
                <div class="index-table-card" v-for="(item, index) in state.data" :key="index">
                  <!-- :to="`observation/show/${item?.id}`" -->
                  <div class="w-full">
                    <div class="card-header-container" :class="ShowDetails[index] ? '' : 'show'">
                      <div class="header-container">

                        <router-link :to="`observation/show/${item?.id}`" class="card-content" style="flex: 1">
                          <div class="card-header">
                            <p class="label-item-primary">
                              {{ $t('Serial') }} : <span>{{ item.serialName }}</span>
                            </p>
                            <p class="label-item-secondary">
                              {{ $t('Date & Time') }} : <span>{{ item.date }}</span>
                            </p>
                          </div>
                          <div class="card-details">
                            <p class="title">{{ item.observer.name }} <span>{{ '(observer)' }}</span></p>
                            <p class="subtitle">{{ item.title }}</p>
                            <!-- <p class="subtitle">{{ item.description }}</p> -->
                            <div class="project-details">
                              <p class="label-item-primary flex items-center gap-1" v-if="item.zoon?.title">
                                <PinIcons /> {{ $t('Zone') }} : <span>{{ item.zoon?.title }}</span>
                              </p>
                              <p class="label-item-primary" v-if="item.equipment?.title">
                                {{ $t('Machine') }} : <span>{{ item.equipment?.title }}</span>
                              </p>
                              <!-- <p class="label-item-primary" v-if="item.status">
                                Status : <span>{{ item?.status }}</span>
                              </p> -->
                            </div>
                          </div>
                        </router-link>

                        <div class="card-info">
                          <span v-if="item.riskLevel && item.saveStatus == SaveStatusEnum.NotSaved"
                            class="observation-risk-level flex items-center gap-1"
                            :class="GetRiskLevel(item.riskLevel)">
                            {{ GetRiskLevel(item.riskLevel) }} {{ '(Level)' }}
                            <HighLevel v-if="GetRiskLevel(item.riskLevel) === 'High'" />
                          </span>
                          <!-- <img :src="item.HazardImg" alt="hazard-img"> -->
                          <Image v-if="item.media[0]?.url" :src="item.media[0]?.url" alt="Image" preview>
                            <template #previewicon>
                              <div class="perview">
                                <span>{{ $t('View') }}</span>
                                <ViewIcon />
                              </div>
                            </template>
                          </Image>
                          <!-- <img v-else src="@/assets/images/logo.svg" alt=""> -->
                        </div>


                      </div>
                    </div>
                  </div>

                  <div class="observation-dwspcription-more">
                    <p class="show-more" @click="ShowDetails[index] = !ShowDetails[index]">
                      <span v-if="ShowDetails[index]">{{ $t('Show Less') }}</span>
                      <span v-else>{{ $t('Show More') }}</span>
                      <ShowMoreIcon />
                    </p>

                    <div v-if="ShowDetails[index]" class="card-description">
                      <p class="title">{{ $t('description') }} :</p>
                      <p class="description">
                        {{ item.description }}
                      </p>
                    </div>
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
            <PermissionBuilder :code="[
              PermissionsEnum?.ORGANIZATION_EMPLOYEE,
              PermissionsEnum?.ORG_OBSERVATION_CREATE,
            ]">
              <DataEmpty :link="`/organization/equipment-mangement/observation/add`" addText="Add Observation"
                description="Sorry .. You have no Observation .. All your joined customers will appear here when you add your customer data"
                title="..ops! You have No Observation" />
            </PermissionBuilder>
          </template>
          <template #failed>
            <PermissionBuilder :code="[
              PermissionsEnum?.ORGANIZATION_EMPLOYEE,
              PermissionsEnum?.ORG_OBSERVATION_CREATE,
            ]">
              <DataFailed :link="`/organization/equipment-mangement/observation/add`" addText="Add Observation"
                description="Sorry .. You have no Observation .. All your joined customers will appear here when you add your customer data"
                title="..ops! You have No Observation" />
            </PermissionBuilder>
          </template>
        </DataStatus>
        <template #notPermitted>
          <DataFailed addText="Have not  Permission"
            description="Sorry .. You have no Observation .. All your joined customers will appear here when you add your customer data" />
        </template>
      </PermissionBuilder>
    </div>
  </div>
</template>

<style scoped></style>
