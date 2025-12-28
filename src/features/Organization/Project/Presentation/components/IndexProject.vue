<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'
import ToggleSwitch from 'primevue/toggleswitch'
import wordSlice from '@/base/Presentation/utils/word_slice'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import ExportIcon from '@/shared/icons/ExportIcon.vue'
import ExportExcel from '@/shared/HelpersComponents/ExportExcel.vue'
import SaveIcon from '@/shared/icons/SaveIcon.vue'
import Search from '@/shared/icons/Search.vue'
import { setDefaultImage } from '@/base/Presentation/utils/set_default_image.ts'
import IndexProjectController from '../controllers/indexProjectController'
import IndexProjectParams from '../../Core/params/indexProjectParams'
import DeleteProjectParams from '../../Core/params/deleteProjectParams'
import DeleteProjectController from '../controllers/deleteProjectController'
import DropIcon from '@/shared/icons/DropIcon.vue'
import Popover from 'primevue/popover'
import TablePopover from '@/shared/FormInputs/TablePopover.vue'
import IconProjectShow from '@/shared/icons/IconProjectShow.vue'
import ShowProjectIcon from '@/shared/icons/ShowProjectIcon.vue'

const op = ref()
// const members = ref([
//     { name: 'Amy Elsner', image: 'amyelsner.png', email: 'amy@email.com', role: 'Owner' },
//     { name: 'Bernardo Dominic', image: 'bernardodominic.png', email: 'bernardo@email.com', role: 'Editor' },
//     { name: 'Ioni Bowcher', image: 'ionibowcher.png', email: 'ioni@email.com', role: 'Viewer' }
// ]);

const toggle = (event) => {
  op.value.toggle(event)
}
const { t } = useI18n()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexProjectController = IndexProjectController.getInstance()
const state = ref(indexProjectController.state.value)
const route = useRoute()

const fetchProject = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1
) => {
  const deleteProjectParams = new IndexProjectParams(query, pageNumber, perPage, withPage)
  await indexProjectController.getData(deleteProjectParams)
}

onMounted(() => {
  fetchProject()
})

const searchProject = debounce(() => {
  fetchProject(word.value)
})

const deleteProject = async (id: number) => {
  const deleteProjectParams = new DeleteProjectParams(id)
  await DeleteProjectController.getInstance().deleteProject(deleteProjectParams)
  await fetchProject()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchProject('', currentPage.value, countPerPage.value)
}

const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchProject('', currentPage.value, countPerPage.value)
}

watch(
  () => indexProjectController.state.value,
  (newState) => {
    if (newState) {
      // console.log(newState)
      state.value = newState
    }
  },
  {
    deep: true,
  }
)

const actionList = (id: number, deleteProject: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/organization/project/${id}`,
    permission: [
      PermissionsEnum.PROJECT_UPDATE,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.PROJECT_ALL,
    ],
  },
  {
    text: t('show'),
    icon: ShowProjectIcon,
    link: `/organization/project-details/${id}`,
    permission: [
      PermissionsEnum.PROJECT_DETAILS,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.PROJECT_ALL,
    ],
  },
  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteProject(id),
    permission: [
      PermissionsEnum.PROJECT_DELETE,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.PROJECT_ALL,
    ],
  },
]

watch(
  () => route?.params?.id,
  (Newvalue) => {
    fetchProject()
  }
)

// const Data = ref([
//   {
//     id: 1,
//     title: 'Smart City Project',
//     created_at: '2025-11-01',
//     contractors: [
//       { name: 'BuildCorp' },
//       { name: 'TechInfra' },
//       { name: 'GreenSpace' },
//       { name: 'SkyBuild' },
//     ],
//     locations: [
//       { name: 'Downtown' },
//       { name: 'North Zone' },
//       { name: 'Industrial Area' },
//     ],
//     supervisors: [
//       { name: 'Ali Hassan', avatar: '/avatars/ali.png' },
//       { name: 'Sara Mahmoud', avatar: '/avatars/sara.png' },
//       { name: 'Omar Khaled', avatar: '/avatars/omar.png' },
//       { name: 'Nour Ibrahim', avatar: '/avatars/nour.png' },
//     ],
//     teams: [
//       { name: 'Electrical Team' },
//       { name: 'Civil Team' },
//       { name: 'Safety Team' },
//     ],
//   },
//   {
//     id: 2,
//     title: 'Metro Line Extension',
//     created_at: '2025-10-22',
//     contractors: [
//       { name: 'MegaBuild' },
//       { name: 'CityWorks' },
//     ],
//     locations: [
//       { name: 'South District' },
//       { name: 'Tunnel Area' },
//     ],
//     supervisors: [
//       { name: 'Mohamed Salah', avatar: '/avatars/mohamed.png' },
//       { name: 'Laila Ahmed', avatar: '/avatars/laila.png' },
//     ],
//     teams: [
//       { name: 'Drilling Team' },
//       { name: 'Inspection Team' },
//     ],
//   },
//   {
//     id: 3,
//     title: 'Airport Renovation',
//     created_at: '2025-09-10',
//     contractors: [
//       { name: 'AeroBuild' },
//     ],
//     locations: [
//       { name: 'Terminal 1' },
//       { name: 'Runway Section' },
//       { name: 'Cargo Zone' },
//       { name: 'Parking Area' },
//     ],
//     supervisors: [
//       { name: 'Rana Saeed', avatar: '/avatars/rana.png' },
//       { name: 'Youssef Adel', avatar: '/avatars/youssef.png' },
//       { name: 'Tarek Hassan', avatar: '/avatars/tarek.png' },
//       { name: 'Aya Nabil', avatar: '/avatars/aya.png' },
//       { name: 'Ahmed Fathy', avatar: '/avatars/ahmed.png' },
//     ],
//     teams: [
//       { name: 'Maintenance Team' },
//       { name: 'Security Team' },
//       { name: 'Lighting Team' },
//     ],
//   },
// ])
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <span class="icon-remove" @click="; (word = ''), searchProject()">
        <Search />
      </span>
      <input v-model="word" :placeholder="'search'" class="input" type="text" @input="searchProject" />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <!-- <ExportExcel :data="state.data" />
      <ExportPdf /> -->
      <PermissionBuilder :code="[PermissionsEnum.ORGANIZATION_EMPLOYEE, PermissionsEnum.PROJECT_CREATE]">
        <router-link to="/organization/project/add" class="btn btn-primary ">
          {{ $t('Add_Project') }}
        </router-link>
      </PermissionBuilder>
    </div>
  </div>

  <PermissionBuilder :code="[
    PermissionsEnum.ORGANIZATION_EMPLOYEE,
    PermissionsEnum.PROJECT_ALL,
    PermissionsEnum.PROJECT_DELETE,
    PermissionsEnum.PROJECT_FETCH,
    PermissionsEnum.PROJECT_UPDATE,
    PermissionsEnum.PROJECT_CREATE,
  ]">
    <DataStatus :controller="state">
      <template #success>
        <div class="modern-table-responsive">
          <table class="main-table">
            <thead>
              <tr>
                <!-- <th scope="col" class="w-20">
                  <input type="checkbox" class="checkbox-input" />
                </th> -->
                <th scope="col">{{ $t('project_number') }}</th>
                <th scope="col">{{ $t('project_name') }}</th>
                <th scope="col">{{ $t('contractors') }}</th>
                <th scope="col">{{ $t('locations') }}</th>
                <!-- <th scope="col">{{ $t('supervisors') }}</th> -->
                <!-- <th scope="col">{{ $t('teams') }}</th> -->
                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <!-- <td data-label="Select">
                  <input type="checkbox" class="checkbox-input" />
                </td> -->
                <td data-label="Serial">
                  <router-link :to="`/organization/project/${item.id}`" class="serial-number">
                    #{{ item?.serial_number }}
                  </router-link>
                </td>
                <td data-label="Project Name">
                  <div class="project-info">
                    <div class="project-date">{{ item.start_date || '--' }}</div>
                    <div class="project-title">{{ wordSlice(item.title) }}</div>
                  </div>
                </td>
                <td data-label="Contractors">
                  <div class="tag-container">
                    <TablePopover :data="item.contractor" />
                  </div>
                  <!-- {{ item.partner?.title }} -->
                </td>
                <td data-label="Locations">
                  <div class="tag-container">
                    <TablePopover :data="item.locations" />
                  </div>
                </td>
                <!-- <td data-label="Supervisors"> -->
                <!-- <div class="avatar-group">
                    <TablePopover :data_img="item." />
                  </div> -->
                <!-- </td> -->
                <!-- <td data-label="Teams"> -->
                <!-- <div class="tag-container">
                    <TablePopover :data="item.teams" />
                  </div> -->
                <!-- </td> -->
                <td data-label="Actions">
                  <DropList :actionList="actionList(item.id, deleteProject)" @delete="deleteProject(item.id)" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination :pagination="state.pagination" @changePage="handleChangePage" @countPerPage="handleCountPerPage" />
      </template>
      <template #loader>
        <TableLoader :cols="8" :rows="10" />
      </template>
      <template #initial>
        <TableLoader :cols="8" :rows="10" />
      </template>
      <template #empty>
        <DataEmpty :link="`/organization/project/add`" addText="Add Project"
          description="Sorry .. You have no Project .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Project" />
      </template>
      <template #failed>
        <DataFailed :link="`/organization/project/add`" addText="Add Project"
          description="Sorry .. You have no Project .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Project" />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed addText="Have not Permission"
        description="Sorry .. You have no Project .. All your joined customers will appear here when you add your customer data" />
    </template>
  </PermissionBuilder>
</template>
