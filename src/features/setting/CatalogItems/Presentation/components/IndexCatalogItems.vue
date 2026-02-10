<script lang="ts" setup>
// import IndexTeamTypeParams from '@/features/setting/TeamType/Core/params/indexTeamTypeParams'
// import IndexTeamTypeController from '@/features/setting/TeamType/Presentation/controllers/indexTeamTypeController'

import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import wordSlice from '@/base/Presentation/utils/word_slice'

import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
// import IconRemoveInput from '@/shared/icons/IconRemoveInput.vue'
import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'
// import DeleteTeamTypeController from '@/features/setting/TeamType/Presentation/controllers/deleteTeamTypeController'
// import DeleteTeamTypeParams from '@/features/setting/TeamType/Core/params/deleteTeamTypeParams'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
// import ExportIcon from '@/shared/icons/ExportIcon.vue'
import ExportExcel from '@/shared/HelpersComponents/ExportExcel.vue'
import Search from '@/shared/icons/Search.vue'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import ActionsTableEdit from '@/shared/icons/ActionsTableEdit.vue'
//
import DeleteCatalogItemsController from '../controllers/deleteCatalogItemsController'
import IndexCatalogItemsController from '../controllers/indexCatalogItemsController'
import IndexCatalogItemsParams from '../../Core/params/indexCatalogItemsParams'
import DeleteCatalogItemsParams from '../../Core/params/deleteCatalogItemsParams'
import { ParentTypeEnum } from '../../Core/enums/parenttypeenum'

const { t } = useI18n()

// import DialogChangeStatusTeamType from "@/features/setting/TeamTypes/Presentation/components/TeamType/DialogChangeStatusTeamType.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexCatalogItemsController = IndexCatalogItemsController.getInstance()
const state = ref(indexCatalogItemsController.state.value)
const route = useRoute()
let id = route.params.id
// const type = ref<TeamTypeStatusEnum>(TeamTypeStatusEnum[route.params.type as keyof typeof TeamTypeStatusEnum])

const fetchCatalog = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const indexCatalogItemsParams = new IndexCatalogItemsParams(query, pageNumber, perPage, withPage, id , ParentTypeEnum.child)
  await indexCatalogItemsController.getData(indexCatalogItemsParams)
}

onMounted(() => {
  fetchCatalog()
})

const searchCatalogItemsType = debounce(() => {
  fetchCatalog(word.value)
})

const deleteCatalog = async (id: number) => {
  const deleteCatalogItemsParams = new DeleteCatalogItemsParams(id)
  await DeleteCatalogItemsController.getInstance().deleteCatalogItems(deleteCatalogItemsParams)
  await fetchCatalog()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchCatalog('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchCatalog('', currentPage.value, countPerPage.value)
}

watch(
  () => indexCatalogItemsController.state.value,
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

const { user } = useUserStore()

const actionList = (id: number, deleteCatalog: (id: number) => void) => [
  {
    text: t('edit'),
    icon: ActionsTableEdit,
    link: `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/catalog-items/${id}`,
    permission: [
      PermissionsEnum.CATALOG_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.CATALOG_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteCatalog(id),
    permission: [
      PermissionsEnum.CATALOG_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.CATALOG_ALL,
    ],
  },
]
const actionListWithItem = (id: number, deleteCatalog: (id: number) => void) => [
  {
    text: t('edit'),
    icon: ActionsTableEdit,
    link: `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/catalog-items/${id}`,
    permission: [
      PermissionsEnum.CATALOG_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.CATALOG_ALL,
    ],
  },
{
    text: t('add_item_details'),
    icon: ActionsTableEdit,
    link: `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/catalog-items-details/add/${id}`,
    permission: [
      PermissionsEnum.CATALOG_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.CATALOG_ALL,
    ],
  },
  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteCatalog(id),
    permission: [
      PermissionsEnum.CATALOG_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.CATALOG_ALL,
    ],
  },
]

watch(
  () => route?.params?.id,
  (Newvalue) => {
    id = Newvalue
    fetchCatalog()
  },
)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">

    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchCatalogItemsType())">
        <Search />
      </span>
      <input v-model="word" :placeholder="$t('search')" class="input" type="text" @input="searchCatalogItemsType" />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <!-- <ExportExcel :data="state.data" /> -->
      <ExportPdf />
      <permission-builder :code="[
        PermissionsEnum.ADMIN,
        PermissionsEnum.ORGANIZATION_EMPLOYEE,
        PermissionsEnum.CATALOG_CREATE,
      ]">
        <router-link :to="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/catalog-items/add`"
          class="btn btn-primary">
          {{ $t('Add_Catalog_Item') }}
        </router-link>
      </permission-builder>
    </div>
  </div>

  <permission-builder :code="[
    PermissionsEnum.ADMIN,
    PermissionsEnum.ORGANIZATION_EMPLOYEE,
    PermissionsEnum.CATALOG_ALL,
    PermissionsEnum.CATALOG_DELETE,
    PermissionsEnum.CATALOG_FETCH,
    PermissionsEnum.CATALOG_UPDATE,
    PermissionsEnum.CATALOG_CREATE,
  ]">
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive">
          <table class="main-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{{ $t('title') }}</th>

                <th scope="col">{{ $t('Actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link
                    :to="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/catalog-items/edit/${item.id}`">{{
                    index + 1 }}
                  </router-link>
                </td>
                <td data-label="Name">{{ wordSlice(item.title) }}</td>

                <td data-label="Actions">
                  <!--                <DialogChangeStatusTeamType-->
                  <!--                  v-if="item.TeamTypeStatus === TeamTypeStatusEnum.Draft"-->
                  <!--                  :TeamTypeId="item.id"-->
                  <!--                  @TeamTypeChangeStatus="fetchTeamType"-->
                  <!--                />-->

                  <DropList :actionList="actionList(item.id, deleteCatalog)" @delete="deleteCatalog(item.id)" v-if="item?.guideCategoryItem?.id" />
                  <DropList :actionList="actionListWithItem(item.id, deleteCatalog)" @delete="deleteCatalog(item.id)" v-else />
                
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
        <permission-builder :code="[
          PermissionsEnum.ADMIN,
          PermissionsEnum.ORGANIZATION_EMPLOYEE,
          PermissionsEnum.CATALOG_CREATE,
        ]">
          <DataEmpty :link="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/catalog/add`"
            addText="Add Catalog"
            description="Sorry .. You have no Catalog .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No Catalog" />
        </permission-builder>
      </template>
      <template #failed>
        <permission-builder :code="[
          PermissionsEnum.ADMIN,
          PermissionsEnum.ORGANIZATION_EMPLOYEE,
          PermissionsEnum.CATALOG_CREATE,
        ]">
          <DataFailed :link="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/catalog/add`"
            addText="Add Catalog"
            description="Sorry .. You have no Catalog .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No Catalog" />
        </permission-builder>
      </template>
    </DataStatus>

    <template #notPermitted>
      <permission-builder :code="[
        PermissionsEnum.ADMIN,
        PermissionsEnum.ORGANIZATION_EMPLOYEE,
        PermissionsEnum.CATALOG_CREATE,
      ]">
        <DataFailed addText="Have not  Permission"
          description="Sorry .. You have no Catalog .. All your joined customers will appear here when you add your customer data" />
      </permission-builder>
    </template>
  </permission-builder>
</template>

<style scoped></style>
