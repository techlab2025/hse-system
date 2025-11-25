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
import { useRoute } from 'vue-router'
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

const { t } = useI18n()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexInspectionController = IndexInspectionController.getInstance()
const state = ref(indexInspectionController.state.value)
const route = useRoute()
const id = route.params.parent_id

const fetchInspection = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteInspectionParams = new IndexInspectionParams(query, pageNumber, perPage, withPage)
  const res = await indexInspectionController.getData(deleteInspectionParams)
  console.log(res, 'res')
}

onMounted(() => {
  fetchInspection()
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
  },
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
  // {
  //   text: t('add_sub_Inspection_type'),
  //   icon: IconEdit,
  //   link: `/admin/Inspection-type/add/${id}`,
  //   permission: [
  //     PermissionsEnum.Inspection_TYPE_UPDATE,
  //     PermissionsEnum.ADMIN,
  //     PermissionsEnum.Inspection_TYPE_ALL,
  //   ],
  // },
  // {
  //   text: t('sub_Inspection_types'),
  //   icon: IconEdit,
  //   link: `/admin/Inspection-types/${id}`,
  //   permission: [
  //     PermissionsEnum.Inspection_TYPE_UPDATE,
  //     PermissionsEnum.ADMIN,
  //     PermissionsEnum.Inspection_TYPE_ALL,
  //   ],
  // },
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

const InspectionData = ref([
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
    InspectionImg: HazardType,
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
    InspectionImg: HazardType,
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
    InspectionImg: HazardType,
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
    InspectionImg: HazardType,
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
    <DataStatus :controller="state">
      <template #success>
        <!-- <pre>{{ state.data }}</pre> -->
        <div class="table-responsive">
          <IndexInspectionHeader :title="`Inspection`" :length="state.data?.length" :categories="categories" />
          <IndexFilter :filters="Filters" @update:data="console.log($event)" :link="'/organization/inspection/add'"
            :linkTitle="'Create Inspection'" />
          <div class="index-table-card-container-inspection">
            <div class="index-table-card" v-for="(item, index) in state.data" :key="index">
              <div class="card-header-container" :class="ShowDetails[index] ? '' : 'show'">
                <div class="header-container">
                  <div class="card-content">
                    <div class="card-header">
                      <p class="label-item-primary">
                        Assigned to : <span>{{ item?.morph?.name }}</span>
                      </p>
                    </div>
                    <div class="card-details">
                      <p class="title">
                        {{ item?.morph?.name }}
                      </p>
                      <span>{{ item.date }}</span>
                    </div>
                  </div>
                  <!-- <div class="card-info-status" >Start</div> -->
                 
                  <InspectionStartTemplate v-if="item.status == InspectionStatus.NOT_FINISHED"
                    :templateId="item.template.id" :taskId="item.id" />

                  <button class="show-details" v-if="item.status == InspectionStatus.FINISHED">
                    <span> show inspection details </span>
                    <ArrowDetails />
                  </button>
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
        <Pagination :pagination="state.pagination" @changePage="handleChangePage" @countPerPage="handleCountPerPage" />
      </template>
      <template #loader>
        <TableLoader :cols="3" :rows="10" />
      </template>
      <template #initial>
        <TableLoader :cols="3" :rows="10" />
      </template>
      <template #empty>
        <DataEmpty :link="`/organization/inspection/add`" addText="Add Inspection"
          description="Sorry .. You have no Inspection .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Inspection" />
      </template>
      <template #failed>
        <DataFailed :link="`/organization/inspection/add`" addText="Add Inspection"
          description="Sorry .. You have no Inspection .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Inspection" />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed addText="Have not  Permission"
        description="Sorry .. You have no Inspection .. All your joined customers will appear here when you add your customer data" />
    </template>
  </PermissionBuilder>
</template>
