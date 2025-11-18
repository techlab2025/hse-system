<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'

import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Image from 'primevue/image'

import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'

import { useUserStore } from '@/stores/user'

import TitleInterface from '@/base/Data/Models/title_interface'
import HazardType from '@/assets/images/HazardType.jpg'

import ShowMoreIcon from '@/shared/icons/ShowMoreIcon.vue'
import IndexIncedantController from '../controllers/indexIncedantController'
import DeleteIncedantParams from '../../Core/params/deleteIncedantParams'
import DeleteIncedantController from '../controllers/deleteIncedantController'
import IndexIncedantParams from '../../Core/params/indexIncedantParams'
import IndexFilter from './HazardUtils/IndexFilter.vue'
import IndexIncedantHeader from './HazardUtils/IndexIncedantHeader.vue'
import ViewIcon from '@/shared/icons/ViewIcon.vue'

const { t } = useI18n()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexIncedantController = IndexIncedantController.getInstance()
const state = ref(indexIncedantController.state.value)
const route = useRoute()
const id = route.params.parent_id

const fetchIncedant = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteIncedantParams = new IndexIncedantParams(query, pageNumber, perPage, withPage, id)
  await indexIncedantController.getData(deleteIncedantParams)
}

onMounted(() => {
  fetchIncedant()
})

const searchIncedant = debounce(() => {
  fetchIncedant(word.value)
})

const deleteIncedant = async (id: number) => {
  const deleteIncedantParams = new DeleteIncedantParams(id)
  await DeleteIncedantController.getInstance().deleteIncedant(deleteIncedantParams)
  await fetchIncedant()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchIncedant('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchIncedant('', currentPage.value, countPerPage.value)
}

watch(
  () => indexIncedantController.state.value,
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

const actionList = (id: number, deleteIncedant: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/organization/incedant/${id}`,
    permission: [
      PermissionsEnum.ORG_INCEDANT_UPDATE,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ORG_INCEDANT_ALL,
    ],
  },
  // {
  //   text: t('add_sub_Incedant_type'),
  //   icon: IconEdit,
  //   link: `/admin/Incedant-type/add/${id}`,
  //   permission: [
  //     PermissionsEnum.Incedant_TYPE_UPDATE,
  //     PermissionsEnum.ADMIN,
  //     PermissionsEnum.Incedant_TYPE_ALL,
  //   ],
  // },
  // {
  //   text: t('sub_Incedant_types'),
  //   icon: IconEdit,
  //   link: `/admin/Incedant-types/${id}`,
  //   permission: [
  //     PermissionsEnum.Incedant_TYPE_UPDATE,
  //     PermissionsEnum.ADMIN,
  //     PermissionsEnum.Incedant_TYPE_ALL,
  //   ],
  // },
  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteIncedant(id),
    permission: [
      PermissionsEnum.ORG_INCEDANT_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ORG_INCEDANT_ALL,
    ],
  },
]

const IncedantData = ref([
  {
    serial: 'OBS-2025-0112',
    DateTime: '2025-11-05, 10:45 AM',
    employee: 'Ahmed Hassan',
    employeeType: '( observer )',
    subtitle:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry printing and',
    zone: 'Nasr City',
    machine: 'Shale Shaker Area',
    description:
      'The worker operating the shale shaker was not wearing safety goggles while cleaning the mud screen. Mud splashes could potentially cause eye injury.',
    IncedantImg: HazardType,
  },
  {
    serial: 'OBS-2025-0112',
    DateTime: '2025-11-05, 10:45 AM',
    employee: 'Ahmed Hassan',
    employeeType: '( observer )',
    subtitle:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry printing and',
    zone: 'Nasr City',
    machine: 'Shale Shaker Area',
    description:
      'The worker operating the shale shaker was not wearing safety goggles while cleaning the mud screen. Mud splashes could potentially cause eye injury.',
    IncedantImg: HazardType,
  },
  {
    serial: 'OBS-2025-0112',
    DateTime: '2025-11-05, 10:45 AM',
    employee: 'Ahmed Hassan',
    employeeType: '( observer )',
    subtitle:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry printing and',
    zone: 'Nasr City',
    machine: 'Shale Shaker Area',
    description:
      'The worker operating the shale shaker was not wearing safety goggles while cleaning the mud screen. Mud splashes could potentially cause eye injury.',
    IncedantImg: HazardType,
  },
  {
    serial: 'OBS-2025-0112',
    DateTime: '2025-11-05, 10:45 AM',
    employee: 'Ahmed Hassan',
    employeeType: '( observer )',
    subtitle:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry printing and',
    zone: 'Nasr City',
    machine: 'Shale Shaker Area',
    description:
      'The worker operating the shale shaker was not wearing safety goggles while cleaning the mud screen. Mud splashes could potentially cause eye injury.',
    IncedantImg: HazardType,
  },
])

const categories = ref([
  'Sustainability-oriented Names',
  'Eco-friendly',
  'oriented Names',
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
const ShowDetails = ref<number[]>([])
</script>

<template>
  <!-- <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <span class="icon-remove" @click="((word = ''), searchIncedant())">
        <Search />
      </span>
      <input v-model="word" :placeholder="'search'" class="input" type="text" @input="searchIncedant" />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel :data="state.data" />
      <ExportPdf />
      <PermissionBuilder :code="[
        PermissionsEnum.ADMIN,
        PermissionsEnum.ORGANIZATION_EMPLOYEE,
        PermissionsEnum.Incedant_TYPE_CREATE,
        PermissionsEnum.ORG_Incedant_TYPE_CREATE,
      ]">
        <router-link :to="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/Incedant-type/add`"
          class="btn btn-primary">
          {{ $t('Add_Incedant') }}
        </router-link>
      </PermissionBuilder>
    </div>
  </div> -->
  <PermissionBuilder
    :code="[
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum?.ORGANIZATION_EMPLOYEE,
      PermissionsEnum?.ORG_INCEDANT_ALL,
      PermissionsEnum?.ORG_INCEDANT_CREATE,
      PermissionsEnum?.ORG_INCEDANT_UPDATE,
      PermissionsEnum?.ORG_INCEDANT_DETAILS,
      PermissionsEnum?.ORG_INCEDANT_DELETE,
      PermissionsEnum?.ORG_INCEDANT_FETCH,
    ]"
  >
    <!-- <DataStatus :controller="state">
      <template #success> -->
    <div class="table-responsive">
      <IndexIncedantHeader :title="`Incedant`" :length="120" :categories="categories" />
      <IndexFilter :filters="Filters" @update:data="console.log($event)" />
      <div class="index-table-card-container">
        <div class="index-table-card" v-for="(item, index) in IncedantData" :key="index">
          <div class="card-header-container" :class="ShowDetails[index] ? '' : 'show'">
            <div class="header-container">
              <div class="card-content">
                <div class="card-header">
                  <p class="label-item-primary">
                    Serial : <span>{{ item.serial }}</span>
                  </p>
                  <p class="label-item-secondary">
                    Date & Time : <span>{{ item.DateTime }}</span>
                  </p>
                </div>
                <div class="card-details">
                  <p class="title">
                    {{ item.employee }} <span>{{ item.employeeType }}</span>
                  </p>
                  <p class="subtitle">{{ item.subtitle }}</p>
                  <div class="project-details">
                    <p class="label-item-primary">
                      Zone : <span>{{ item.zone }}</span>
                    </p>
                    <p class="label-item-primary">
                      Machine : <span>{{ item.machine }}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="card-info">
                <p class="title">Incedant</p>
                <!-- <img :src="item.HazardImg" alt="hazard-img"> -->
                <Image :src="item.IncedantImg" alt="Image" preview>
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
            <p class="description">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <Pagination
      :pagination="state.pagination"
      @changePage="handleChangePage"
      @countPerPage="handleCountPerPage"
    />
    <!-- </template> -->
    <template #loader>
      <TableLoader :cols="3" :rows="10" />
    </template>
    <template #initial>
      <TableLoader :cols="3" :rows="10" />
    </template>
    <template #empty>
      <DataEmpty
        :link="`/organization/incedant/add`"
        addText="Add Incedant"
        description="Sorry .. You have no Incedant .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Incedant"
      />
    </template>
    <template #failed>
      <DataFailed
        :link="`/organization/incedant/add`"
        addText="Add Incedant"
        description="Sorry .. You have no Incedant .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Incedant"
      />
    </template>
    <!-- </DataStatus> -->

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no Incedant .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </PermissionBuilder>
</template>

<style scoped></style>
