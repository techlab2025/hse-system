<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'
import wordSlice from '@/base/Presentation/utils/word_slice'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import ExportExcel from '@/shared/HelpersComponents/ExportExcel.vue'
import Search from '@/shared/icons/Search.vue'
import IndexRoleController from '../controllers/indexRoleController'
import IndexRoleParams from '../../Core/params/indexRoleParams'
import DeleteRoleParams from '../../Core/params/deleteRoleParams'
import DeleteRoleController from '../controllers/deleteRoleController'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'


const { t } = useI18n()
const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexRoleController = IndexRoleController.getInstance()
const state = ref(indexRoleController.state.value)
const route = useRoute()

const fetchRole = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteRoleParams = new IndexRoleParams(query, pageNumber, perPage, withPage)
  await indexRoleController.getData(deleteRoleParams)
}

onMounted(() => {
  fetchRole()
})

const searchRole = debounce(() => {
  fetchRole(word.value)
})

const deleteRole = async (id: number) => {
  const deleteRoleParams = new DeleteRoleParams(id)
  await DeleteRoleController.getInstance().deleteRole(deleteRoleParams)
  await fetchRole()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchRole('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchRole('', currentPage.value, countPerPage.value)
}

watch(
  () => indexRoleController.state.value,
  (newState) => {
    if (newState) {
      state.value = newState
    }
  },
  {
    deep: true,
  },
)
const { user } = useUserStore()

const actionList = (id: number, deleteRole: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: user?.type === OrganizationTypeEnum.ADMIN ? `/admin/Role/${id}` : `/organization/Role/${id}`,
    permission: [
      PermissionsEnum.ORG_ROLE_UPDATE,
      PermissionsEnum.ORG_ROLE_DETAILS,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ORG_ROLE_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteRole(id),
    permission: [
      PermissionsEnum.ORG_ROLE_DELETE,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ORG_ROLE_ALL,
    ],
  },
]

watch(
  () => route?.params?.id,
  (Newvalue) => {
    // id = Newvalue
    fetchRole()
  },
)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4 mt-2" v-if="state.data?.length > 0">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchRole())">
        <Search />
      </span>
      <input v-model="word" :placeholder="'search'" class="input" type="text" @input="searchRole" />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel :data="state.data" />
      <ExportPdf />
      <PermissionBuilder :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.ORG_ROLE_CREATE]">
        <router-link :to="user?.type === OrganizationTypeEnum.ADMIN ? '/admin/Role/add' : '/organization/Role/add'"
          class="btn btn-primary">
          {{ $t('Add_Role') }}
        </router-link>
      </PermissionBuilder>
    </div>
  </div>

  <PermissionBuilder :code="[
    PermissionsEnum.ORGANIZATION_EMPLOYEE,
    PermissionsEnum.ORG_ROLE_ALL,
    PermissionsEnum.ORG_ROLE_UPDATE,
    PermissionsEnum.ORG_ROLE_CREATE,
    PermissionsEnum.ORG_ROLE_DETAILS,
    PermissionsEnum.ORG_ROLE_DELETE,
  ]">
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive">
          <table class="main-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{{ $t('role') }}</th>
                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/organization/Role/${item.id}`">{{ index + 1 }}
                  </router-link>
                </td>
                <td data-label="Name">{{ wordSlice(item.title) }}</td>
                <td data-label="Actions">
                  <DropList :actionList="actionList(item.id, deleteRole)" @delete="deleteRole(item.id)" />
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
        <PermissionBuilder :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.ORG_ROLE_CREATE]">

          <DataEmpty :link="`/organization/Role/add`" addText="Add Role"
            description="Sorry .. You have no Role .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No Role" />
        </PermissionBuilder>
      </template>
      <template #failed>
        <PermissionBuilder :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.ORG_ROLE_CREATE]">

          <DataFailed :link="`/organization/Role/add`" addText="Add Role"
            description="Sorry .. You have no Role .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No Role" />
        </PermissionBuilder>
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed addText="Have not  Permission"
        description="Sorry .. You have no Role .. All your joined customers will appear here when you add your customer data"
        link="" />
    </template>
  </PermissionBuilder>
</template>

<style scoped></style>
