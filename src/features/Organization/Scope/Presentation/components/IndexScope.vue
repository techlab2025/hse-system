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
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import IndexScopeController from '../controllers/indexScopeController'
import IndexScopeParams from '../../Core/params/indexScopeParams'
import DeleteScopeParams from '../../Core/params/deleteScopeParams'
import DeleteScopeController from '../controllers/deleteScopeController'
import ActionsTableEdit from '@/shared/icons/ActionsTableEdit.vue'


const { t } = useI18n()
const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexScopeController = IndexScopeController.getInstance()
const state = ref(indexScopeController.state.value)
const route = useRoute()

const fetchScope = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteScopeParams = new IndexScopeParams(query, pageNumber, perPage, withPage)
  await indexScopeController.getData(deleteScopeParams)
}

onMounted(() => {
  fetchScope()
})

const searchScope = debounce(() => {
  fetchScope(word.value)
})

const deleteScope = async (id: number) => {
  const deleteScopeParams = new DeleteScopeParams(id)
  await DeleteScopeController.getInstance().deleteScope(deleteScopeParams)
  await fetchScope()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchScope('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchScope('', currentPage.value, countPerPage.value)
}

watch(
  () => indexScopeController.state.value,
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

const actionList = (id: number, deleteScope: (id: number) => void) => [
  {
    text: t('edit'),
    icon: ActionsTableEdit,
    link: user?.type === OrganizationTypeEnum.ADMIN ? `/admin/Scope/${id}` : `/organization/Scope/${id}`,
    permission: [
      PermissionsEnum.SCOPE_UPDATE,
      PermissionsEnum.SCOPE_DETAILS,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.SCOPE_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteScope(id),
    permission: [
      PermissionsEnum.SCOPE_DELETE,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.SCOPE_ALL,
    ],
  },
]

watch(
  () => route?.params?.id,
  (Newvalue) => {
    // id = Newvalue
    fetchScope()
  },
)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4 mt-2" >
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchScope())">
        <Search />
      </span>
      <input v-model="word" :placeholder="'search'" class="input" type="text" @input="searchScope" />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel :data="state.data" />
      <ExportPdf />
      <PermissionBuilder :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.SCOPE_CREATE]">
        <router-link :to="user?.type === OrganizationTypeEnum.ADMIN ? '/admin/scope/add' : '/organization/scope/add'"
          class="btn btn-primary">
          {{ $t('Add_Scope') }}
        </router-link>
      </PermissionBuilder>
    </div>
  </div>

  <PermissionBuilder :code="[
    PermissionsEnum.ORGANIZATION_EMPLOYEE,
    PermissionsEnum.SCOPE_ALL,
    PermissionsEnum.SCOPE_UPDATE,
    PermissionsEnum.SCOPE_CREATE,
    PermissionsEnum.SCOPE_DETAILS,
    PermissionsEnum.SCOPE_DELETE,
  ]">
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive">
          <table class="main-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{{ $t('scope') }}</th>
                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/organization/scope/${item.id}`">{{ index + 1 }}
                  </router-link>
                </td>
                <td data-label="Name">{{ wordSlice(item.title) }}</td>
                <td data-label="Actions">
                  <DropList :actionList="actionList(item.id, deleteScope)" @delete="deleteScope(item.id)" />
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

        <PermissionBuilder :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.SCOPE_CREATE]">

          <DataEmpty :link="user?.type === OrganizationTypeEnum.ADMIN ? '/admin/scope/add' : '/organization/scope/add'"
            addText="Add Scope"
            description="Sorry .. You have no Scope .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No Scope" />
        </PermissionBuilder>
      </template>
      <template #failed>

        <PermissionBuilder :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.SCOPE_CREATE]">
          <DataFailed :link="user?.type === OrganizationTypeEnum.ADMIN ? '/admin/scope/add' : '/organization/scope/add'"
            addText="Add Scope"
            description="Sorry .. You have no Scope .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No Scope" />
        </PermissionBuilder>
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed addText="Have not  Permission"
        description="Sorry .. You have no Scope .. All your joined customers will appear here when you add your customer data"
        link="" />
    </template>
  </PermissionBuilder>
</template>

<style scoped></style>
