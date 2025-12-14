<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
// import IconRemoveInput from '@/shared/icons/IconRemoveInput.vue'
import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
// import ExportIcon from '@/shared/icons/ExportIcon.vue'
import ExportExcel from '@/shared/HelpersComponents/ExportExcel.vue'
// import SaveIcon from '@/shared/icons/SaveIcon.vue'
import Search from '@/shared/icons/Search.vue'
import { setDefaultImage } from '@/base/Presentation/utils/set_default_image.ts'
import IndexOrganizatoinEmployeeController from '../controllers/indexOrganizatoinEmployeeController'
import IndexOrganizatoinEmployeeParams from '../../Core/params/indexOrganizatoinEmployeeParams'
import DeleteOrganizatoinEmployeeParams from '../../Core/params/deleteOrganizatoinEmployeeParams'
import DeleteOrganizatoinEmployeeController from '../controllers/deleteOrganizatoinEmployeeController'

const { t } = useI18n()

// import DialogChangeStatusOrganizatoinEmployee from "@/features/setting/OrganizatoinEmployeeuages/Presentation/components/OrganizatoinEmployee/DialogChangeStatusOrganizatoinEmployee.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexOrganizatoinEmployeeController = IndexOrganizatoinEmployeeController.getInstance()
const state = ref(indexOrganizatoinEmployeeController.state.value)
const route = useRoute()
// const id = route.params.parent_id
const id = route?.query?.heirarchy_id

// const type = ref<OrganizatoinEmployeeStatusEnum>(OrganizatoinEmployeeStatusEnum[route.params.type as keyof typeof OrganizatoinEmployeeStatusEnum])

const fetchOrganizatoinEmployee = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteOrganizatoinEmployeeParams = new IndexOrganizatoinEmployeeParams(
    query,
    pageNumber,
    perPage,
    withPage,
    id,
  )
  await indexOrganizatoinEmployeeController.getData(deleteOrganizatoinEmployeeParams)
}

onMounted(() => {
  fetchOrganizatoinEmployee()
})

const searchOrganizatoinEmployee = debounce(() => {
  fetchOrganizatoinEmployee(word.value)
})

const deleteOrganizatoinEmployee = async (id: number) => {
  const deleteOrganizatoinEmployeeParams = new DeleteOrganizatoinEmployeeParams(id)
  await DeleteOrganizatoinEmployeeController.getInstance().deleteOrganizatoinEmployee(
    deleteOrganizatoinEmployeeParams,
  )
  await fetchOrganizatoinEmployee()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchOrganizatoinEmployee('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchOrganizatoinEmployee('', currentPage.value, countPerPage.value)
}

watch(
  () => indexOrganizatoinEmployeeController.state.value,
  (newState) => {
    if (newState) {
      // console.log(newState)
      state.value = newState
    }
  },
  {
    deep: true,
  },
)

const actionList = (id: number, deleteOrganizatoinEmployee: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/organization/organization-employee/${id}`,
    permission: [
      PermissionsEnum.ORG_EMPLOYEE_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORG_EMPLOYEE_ALL,
    ],
  },
  // {
  //   text: t('add_sub_PROJECT_type'),
  //   icon: IconEdit,
  //   link: `/admin/Project-type/add/${id}`,
  //   permission: [
  //     PermissionsEnum.PROJECT_TYPE_UPDATE,
  //     PermissionsEnum.ADMIN,
  //     PermissionsEnum.PROJECT_TYPE_ALL,
  //   ],
  // },
  // {
  //   text: t('sub_PROJECT_types'),
  //   icon: IconEdit,
  //   link: `/admin/Project-types/${id}`,
  //   permission: [
  //     PermissionsEnum.PROJECT_TYPE_UPDATE,
  //     PermissionsEnum.ADMIN,
  //     PermissionsEnum.PROJECT_TYPE_ALL,
  //   ],
  // },

  {
    text: t('add_permission'),
    icon: IconEdit,
    link: `/organization/permission/${id}`,
    permission: [PermissionsEnum.CREATE_PERMISSION, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteOrganizatoinEmployee(id),
    permission: [
      PermissionsEnum.ORG_EMPLOYEE_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORG_EMPLOYEE_ALL,
    ],
  },
]

watch(() => route?.params?.heirarchy_id, (newId) => {
  fetchOrganizatoinEmployee()
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchOrganizatoinEmployee())">
        <Search />
      </span>
      <input v-model="word" :placeholder="'search'" class="input" type="text" @input="searchOrganizatoinEmployee" />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel />
      <ExportPdf />
      <PermissionBuilder :code="[PermissionsEnum.ADMIN, PermissionsEnum.ORG_EMPLOYEE_CREATE]">
        <router-link to="/organization/organization-employee/add" class="btn btn-primary">
          {{ $t('Add_OrganizatoinEmployee') }}
        </router-link>
      </PermissionBuilder>
    </div>
  </div>

  <PermissionBuilder :code="[
    PermissionsEnum.ADMIN,
    PermissionsEnum.ORG_EMPLOYEE_ALL,
    PermissionsEnum.ORG_EMPLOYEE_DELETE,
    PermissionsEnum.ORG_EMPLOYEE_FETCH,
    PermissionsEnum.ORG_EMPLOYEE_UPDATE,
    PermissionsEnum.ORG_EMPLOYEE_CREATE,
  ]">
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive">
          <table class="main-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{{ $t('name') }}</th>
                <!-- <th scope="col">{{ $t('image') }}</th> -->
                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/organization/organization-employee/${item.id}`">{{ index + 1 }}
                  </router-link>
                </td>
                <td data-label="Name">{{ item.name }}</td>
                <!-- <td data-label="images">
                  <img :src="item.image || '/src/assets/images/logo.svg'" @error="setDefaultImage($event)" alt="" />
                </td> -->

                <td data-label="Actions">
                  <DropList :actionList="actionList(item.id, deleteOrganizatoinEmployee)"
                    @delete="deleteOrganizatoinEmployee(item.id)" />
                </td>
              </tr>
            </tbody>
          </table>
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
        <DataEmpty :link="`/organization/organization-employee/add`" addText="Add OrganizatoinEmployee"
          description="Sorry .. You have no OrganizatoinEmployeeuages .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No OrganizatoinEmployeeuages" />
      </template>
      <template #failed>
        <DataFailed :link="`/organization/organization-employee/add`" addText="Add OrganizatoinEmployee"
          description="Sorry .. You have no OrganizatoinEmployeeuage .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No OrganizatoinEmployeeuages" />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed addText="Have not  Permission"
        description="Sorry .. You have no OrganizatoinEmployeeuage .. All your joined customers will appear here when you add your customer data" />
    </template>
  </PermissionBuilder>
</template>

<style scoped></style>
