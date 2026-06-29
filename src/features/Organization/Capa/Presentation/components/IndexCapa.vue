<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import { useRoute, useRouter } from 'vue-router'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import CardSkelaton from '@/features/Organization/Inspection/Presentation/components/SubComponent/CardSkelaton.vue'
import IndexCapaParams from '../../Core/params/indexCapaParams'
import IndexCapaController from '../controllers/indexCapaController'
import FetchMyProjectsParams from '@/features/Organization/ObservationFactory/Core/params/fetchMyProjectsParams'
import FetchMyProjectsController from '@/features/Organization/ObservationFactory/Presentation/controllers/FetchMyProjectsController'
import type MyZonesModel from '@/features/Organization/ObservationFactory/Data/models/MyZonesModel'
import FetchMyZonesController from '@/features/Organization/ObservationFactory/Presentation/controllers/FetchMyZonesController'
import FetchMyZonesParams from '@/features/Organization/ObservationFactory/Core/params/FetchMyZonesParams'
import { Observation } from '@/features/Organization/ObservationFactory/Core/Enums/ObservationTypeEnum'
import IndexHazardHeader from '@/features/Organization/ObservationFactory/Presentation/components/Hazard/HazardUtils/IndexHazardHeader.vue'
import IndexFilter from '@/features/Organization/ObservationFactory/Presentation/components/Hazard/HazardUtils/IndexFilter.vue'
import PinIcons from '@/shared/icons/PinIcons.vue'
import Observdetails from '@/shared/icons/observdetails.vue'
import type CapaModel from '@/features/Organization/ObservationFactory/Data/models/CapaModel'
import CapaDialog from '../supcomponents/CapaDialog.vue'
import type ProjectModel from '@/features/Organization/Project/Data/models/ProjectModel.ts'

const currentPage = ref(1)
const countPerPage = ref(10)
const indexCapaController = IndexCapaController.getInstance()
const state = ref(indexCapaController.state.value)
const route = useRoute()
const router = useRouter()
const Projects = ref<ProjectModel[]>([])
const selectedProjctesFilters = ref<number>()
const Filters = ref<MyZonesModel[]>()
const SelectedZonesFilter = ref<number[]>([])
const fetchMyZonesController = FetchMyZonesController.getInstance()

const fetchCapa = async (
  query = '',
  pageNumber = 1,
  perPage = 10,
  withPage = 1,
  projectZoneLozationId?: number[],
  projectLocationIds?: number[],
  zoonIds?: number[],
  projectIds?: number,
) => {
  const params = new IndexCapaParams({
    word: query,
    pageNumber: pageNumber,
    perPage: perPage,
    withPage: withPage,
    type: [Observation.ObservationType, Observation.HazardType],
    projectId:
      route.query.hazard || route.query.risk_level
        ? undefined
        : projectIds !== undefined
          ? [projectIds!]
          : [],
    zoonIds: zoonIds,
    projectLocationIds: projectLocationIds?.length ? projectLocationIds : undefined,
    projectZoonIds: projectZoneLozationId,
    rootCauseId: undefined,
    hazardTypeId: route.query.hazard ? Number(route.query.hazard) : undefined,
    riskLevel: route.query.risk_level ? [Number(route.query.risk_level)] : undefined,
    capaStatus: 2,
  })
  await indexCapaController.getData(params)
}

onMounted(() => {
  fetchCapa()
  FetchMyProjects()
})

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchCapa('', currentPage.value, countPerPage.value)
}

const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchCapa('', currentPage.value, countPerPage.value)
}

const FetchMyProjects = async () => {
  const fetchMyProjectsParams = new FetchMyProjectsParams(true)
  const fetchMyProjectsController = FetchMyProjectsController.getInstance()
  const res = await fetchMyProjectsController.getData(fetchMyProjectsParams)
  if (res.value.data) {
    Projects.value = res.value.data
  }
}

const FetchMyZones = async () => {
  const fetchMyZonesParams = new FetchMyZonesParams(selectedProjctesFilters.value)
  const response = await fetchMyZonesController.FetchMyZones(fetchMyZonesParams, router)
  if (response.value.data) {
    Filters.value = response.value.data
  }
}

const ApplayFilter = (data: number[]) => {
  SelectedZonesFilter.value = data
  fetchCapa('', 1, 10, 1, [], [], SelectedZonesFilter.value, selectedProjctesFilters.value)
}

const setSelectedProjectFilter = (data: any) => {
  selectedProjctesFilters.value = data
  if (data) {
    fetchCapa('', 1, 10, 1, [], [], [], data)
    FetchMyZones()
  }
}

const ShowDetails = ref<number[]>([])

const GetObservationType = (type: number) => {
  switch (type) {
    case Observation.ObservationType:
      return 'Observation'
    case Observation.HazardType:
      return 'Hazard'
  }
}

const GetCapaStataus = (capa: CapaModel) => {
  if (String(capa?.corrective)?.length > 0 && String(capa?.preventive)?.length > 0) {
    return 'Preventive And Corrective'
  }
  if (String(capa?.corrective)?.length > 0 && String(capa?.preventive)?.length == 0) {
    return 'Corrective'
  }
  if (String(capa?.corrective)?.length == 0 && String(capa?.preventive)?.length > 0) {
    return 'Preventive'
  }
}
watch(
  () => indexCapaController.state.value,
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
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
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
        <div>
          <IndexHazardHeader
            :title="`CAPA`"
            :length="state?.data?.length || 0"
            :projects="Projects"
            @update:data="setSelectedProjectFilter"
          />

          <div class="flex items-center justify-between" v-if="Filters && Filters?.length > 0">
            <PermissionBuilder
              :code="[
                PermissionsEnum?.ORGANIZATION_EMPLOYEE,
                PermissionsEnum?.ORG_OBSERVATION_CREATE,
              ]"
            >
              <IndexFilter :filters="Filters!" @update:data="ApplayFilter" />
            </PermissionBuilder>
          </div>
        </div>
        <DataStatus :controller="state">
          <template #success>
            <div class="table-responsive">
              <div class="index-table-card-container">
                <div
                  class="index-table-card"
                  style="box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1)"
                  v-for="(item, index) in state.data"
                  :key="index"
                >
                  <div class="w-full">
                    <div class="card-header-container" :class="ShowDetails[index] ? '' : 'show'">
                      <div class="header-container">
                        <div class="card-content" style="flex: 1">
                          <div class="card-header">
                            <p class="label-item-primary">
                              {{ $t('Serial') }} :
                              <span>{{ item?.capa?.serial_name || 'N/A' }}</span>
                            </p>
                            <p class="label-item-secondary">
                              {{ $t('capa date') }} :
                              <span
                                >{{ item.capa?.date }} &
                                {{ item.capa?.time }}
                              </span>
                            </p>
                          </div>
                          <div class="sup-title">{{ item.description || 'N/A' }}</div>

                          <div class="card-details">
                            <div class="name">
                              <p class="title">
                                {{ item?.observer?.name }} <span>{{ '(observer)' }}</span>
                              </p>
                            </div>

                            <div class="location-observation">
                              <div class="location">
                                <p
                                  class="label-item-primary flex items-center gap-1"
                                  v-if="item.zoon?.title"
                                >
                                  <PinIcons /> {{ $t('Zone') }} :
                                  <span>{{ item.zoon?.title }}</span>
                                </p>
                                <p class="label-item-primary" v-if="item.equipment?.title">
                                  {{ $t('Machine') }} : <span>{{ item.equipment?.title }}</span>
                                </p>
                                <p class="label-item-secondary">
                                  {{ $t('observation Date & Time') }} :
                                  <span>{{ item.date }} & {{ item.time }}</span>
                                </p>
                                <p class="label-item-secondary flex items-center gap-1">
                                  {{ $t('operation type') }} :
                                  <span>{{ GetObservationType(item.type) }}</span>
                                </p>
                                <div class="label-item-secondary">
                                  <p>
                                    capa status
                                    <span>{{ GetCapaStataus(item.capa!) }}</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div class="btn-investegation-observation">
                              <CapaDialog :capa="item?.capa" />
                              <router-link :to="`/organization/capa/${item?.capa?.capaId}`">
                                <div class="observation-details">
                                  <p>
                                    {{ GetObservationType(item.type) }} details
                                    <Observdetails />
                                  </p>
                                </div>
                              </router-link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
          </template>
          <template #initial>
            <CardSkelaton />
          </template>
          <template #empty>
            <PermissionBuilder
              :code="[
                PermissionsEnum?.ORGANIZATION_EMPLOYEE,
                PermissionsEnum?.ORG_OBSERVATION_CREATE,
              ]"
            >
              <DataEmpty
                description="Sorry .. You have no CAPA .. All your joined customers will appear here when you add your customer data"
                :link="`/organization`"
                title="..ops! You have No CAPA"
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
                description="Sorry .. You have no CAPA .. All your joined customers will appear here when you add your customer data"
                :link="`/organization`"
                title="..ops! You have No CAPA"
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
.btn-investegation-observation {
  width: 100%;
  display: flex;
  // align-items: left;
  justify-content: right;
  gap: 10px;
}

.card-content {
  .sup-title {
    margin-bottom: 1rem;

    p {
      font-family: 'Regular';
      font-weight: 600;
      font-size: 15px;
      color: #6a717d;

      &.description {
        font-family: 'Light';
        font-weight: 400;
        font-size: 14px;
      }
    }
  }

  .card-details {
    background-color: #1f41bb0a;
    padding: 0.7rem;
    border-radius: 20px;
    width: 100%;

    .location-observation {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
    }

    .location {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
      margin: 0.5rem 0;

      p {
        color: #9ca3af;
        font-weight: 600;
        font-size: 14px;

        span {
          color: #505050;
        }
      }
    }
  }

  .observation-details {
    background-color: rgba(72, 110, 246, 0.1);
    padding: 0.6rem 0.8rem;
    border-radius: 20px;

    border-bottom: 2px solid #1f41bb;

    &:hover {
      cursor: pointer;
    }

    p {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;
      font-family: 'bold';
      font-weight: 700;
      font-size: 16px;
      color: #1f41bb;
    }
  }

  // .observation-details {
  //   p {
  //     display: flex;
  //     flex-direction: row;
  //     align-items: center;
  //     gap: .5rem;
  //     font-family: 'bold';
  //     font-weight: 700;
  //     font-size: 16px;
  //     color: #1F41BB;

  //     span {
  //       display: flex;
  //       flex-direction: row;
  //       align-items: center;
  //       gap: .5rem;
  //     }
  //   }
  // }
}

.label-item-secondary {
  font-family: 'regular';

  span {
    font-family: 'bold';
  }
}

.label-item-primary {
  font-family: 'regular';

  span {
    font-family: 'bold';
  }
}

.export-fillter {
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 15px;
  width: 100%;
  margin: 1rem 0;

  input[type='radio'] {
    display: none;
  }
}

.fillter-radio-btn {
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: #f5f5f5;
  padding: 0.4rem 1rem;
  border-radius: 40px;

  .active {
    background-color: #f4f6ff;
    border: 1px solid #1f41bb33;
    padding: 0.5rem 1rem;
    color: #1f41bb;
    font-weight: 700;
    border-radius: 40px;
    font-family: 'bold';
    font-size: 15px;
  }

  .radio-btn {
    display: flex;
    align-items: center;
    gap: 5px;

    label {
      margin-bottom: 0;
      cursor: pointer;
    }

    input[type='radio'] {
      cursor: pointer;
      width: 16px;
      height: 16px;
    }
  }
}
</style>
