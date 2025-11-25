<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { debounce } from '@/base/Presentation/utils/debouced'

import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'

import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import ShowMoreIcon from '@/shared/icons/ShowMoreIcon.vue'
import ViewIcon from '@/shared/icons/ViewIcon.vue'
import Image from 'primevue/image'

import IndexHazardHeader from './HazardUtils/IndexHazardHeader.vue'
import IndexFilter from './HazardUtils/IndexFilter.vue'

import IndexHazardController from '../../controllers/indexHazardController'
import IndexHazardParams from '../../../Core/params/indexHazardParams'
import DeleteHazardParams from '../../../Core/params/deleteHazardParams'
import DeleteHazardController from '../../controllers/deleteHazardController'

import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { useUserStore } from '@/stores/user'
import { Observation } from '../../../Core/Enums/ObservationTypeEnum'
import TitleInterface from '@/base/Data/Models/title_interface'
import FilterDialog from './HazardUtils/filterDialog.vue'

// i18n
const { t } = useI18n()

// route & user
const route = useRoute()
const { user } = useUserStore()

// reactive state
const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const ShowDetails = ref<number[]>([])

const indexHazardController = IndexHazardController.getInstance()
const state = ref(indexHazardController.state.value)

// fetch data
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
) => {
  const params = new IndexHazardParams(
    query,
    pageNumber,
    perPage,
    withPage,
    Observation.HazardType,
    37,
    projectZoneLozationId,
    projectLocationIds,
    zoonIds,
    equipmentIds,
    riskLevel,
    saveStatus,
    date,
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
  statusIds?: number[],
) => {
  fetchHazard('', 1, 10, 1, [], locationIds, zoneIds, machineIds, statusIds, caseIds, date)
}

// delete hazard
const deleteHazard = async (id: number) => {
  const params = new DeleteHazardParams(id)
  await DeleteHazardController.getInstance().deleteHazard(params)
  await fetchHazard('', currentPage.value, countPerPage.value)
}

// pagination
const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchHazard('', currentPage.value, countPerPage.value)
}

const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchHazard('', currentPage.value, countPerPage.value)
}

// search debounce
const searchHazard = debounce(() => fetchHazard(word.value))

// watch controller state
watch(
  () => indexHazardController.state.value,
  (newState) => {
    if (newState) state.value = newState
  },
  { deep: true },
)

// action list
const actionList = (id: number) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/${user?.type === OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/hazard-type/${id}`,
    permission: [
      PermissionsEnum.HAZARD_TYPE_UPDATE,
      PermissionsEnum.ORG_HAZARD_UPDATE,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.HAZARD_TYPE_ALL,
      PermissionsEnum.ORG_HAZARD_ALL,
    ],
  },
  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteHazard(id),
    permission: [
      PermissionsEnum.HAZARD_TYPE_DELETE,
      PermissionsEnum.ORG_HAZARD_DELETE,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.HAZARD_TYPE_ALL,
      PermissionsEnum.ORG_HAZARD_ALL,
    ],
  },
]

// sample categories & filters
const categories = ref([
  'Sustainability-oriented Names',
  'Eco-friendly',
  'Oriented Names',
  'Eco-friendly',
])

const Filters = ref<TitleInterface[]>([
  new TitleInterface({ id: 1, title: 'Cairo' }),
  new TitleInterface({ id: 2, title: 'Alexandria' }),
  new TitleInterface({ id: 3, title: 'Giza' }),
  new TitleInterface({ id: 4, title: 'Cairo' }),
  new TitleInterface({ id: 5, title: 'Alexandria' }),
  new TitleInterface({ id: 6, title: 'Giza' }),
  new TitleInterface({ id: 7, title: 'Cairo' }),
  new TitleInterface({ id: 8, title: 'Alexandria' }),
  new TitleInterface({ id: 9, title: 'Giza' }),
])

// on mounted
onMounted(() => fetchHazard())
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-12">
      <IndexHazardHeader :title="'Hazard'" :length="120" :categories="categories" />

      <div class="flex items-center justify-between">
        <IndexFilter
          :filters="Filters"
          @update:data="fetchHazard('', 1, 10, 1, $event)"
          :link="'/organization/hazard/add'"
          :linkText="'Create Hazard'"
        />

        <div class="btns-filter">
          <FilterDialog @confirmFilters="confirmFilters" />

          <router-link :to="`/organization/hazard/add`">
            <button class="btn btn-primary">{{ $t('Create Hazard') }}</button>
          </router-link>
        </div>
      </div>
    </div>

    <div class="col-span-12">
      <PermissionBuilder
        :code="[
          PermissionsEnum.ORGANIZATION_EMPLOYEE,
          PermissionsEnum.ORG_HAZARD_ALL,
          PermissionsEnum.ORG_HAZARD_DELETE,
          PermissionsEnum.ORG_HAZARD_FETCH,
          PermissionsEnum.ORG_HAZARD_UPDATE,
          PermissionsEnum.ORG_HAZARD_CREATE,
        ]"
      >
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
                            Serial: <span>{{ item.serial }}</span>
                          </p>
                          <p class="label-item-secondary">
                            Date & Time: <span>{{ item.date }}</span>
                          </p>
                        </div>
                        <div class="card-details">
                          <p class="title">{{ item.observer.name }} <span>(observer)</span></p>
                          <p class="subtitle">{{ item.description }}</p>
                          <div class="project-details">
                            <p class="label-item-primary">
                              Zone: <span>{{ item.zoon?.title }}</span>
                            </p>
                            <p class="label-item-primary">
                              Machine: <span>{{ item.equipment?.title }}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div class="card-info">
                        <p class="title">Hazard Type</p>
                        <Image :src="item.image" alt="Image" preview>
                          <template #previewicon>
                            <div class="perview">
                              <span>view</span>
                              <ViewIcon />
                            </div>
                          </template>
                        </Image>
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
                    <p class="description">{{ item.description }}</p>
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
            <TableLoader :cols="3" :rows="10" />
          </template>

          <template #initial>
            <TableLoader :cols="3" :rows="10" />
          </template>

          <template #empty>
            <DataEmpty
              :link="`/organization/hazard/add`"
              addText="Add Hazard"
              description="Sorry .. You have no Hazard .. All your joined customers will appear here when you add your customer data"
              title="..ops! You have No Hazard"
            />
          </template>

          <template #failed>
            <DataFailed
              :link="`/organization/hazard/add`"
              addText="Add Hazard"
              description="Sorry .. You have no Hazard .. All your joined customers will appear here when you add your customer data"
              title="..ops! You have No Hazard"
            />
          </template>
        </DataStatus>

        <template #notPermitted>
          <DataFailed
            addText="Have not Permission"
            description="Sorry .. You have no Hazard .. All your joined customers will appear here when you add your customer data"
          />
        </template>
      </PermissionBuilder>
    </div>
  </div>
</template>
