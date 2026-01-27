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
import IndexWhereHouseTypeController from '../controllers/indexWhereHouseTypeController'
import IndexWhereHouseTypeParams from '../../Core/params/indexWhereHouseTypeParams'
import DeleteWhereHouseTypeParams from '../../Core/params/deleteWhereHouseTypeParams'
import DeleteWhereHouseTypeController from '../controllers/deleteWhereHouseTypeController'

const { t } = useI18n()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexWhereHouseTypeController = IndexWhereHouseTypeController.getInstance()
const state = ref(indexWhereHouseTypeController.state.value)
const route = useRoute()


const fetchWhereHouseType = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteWhereHouseTypeParams = new IndexWhereHouseTypeParams(query, pageNumber, perPage, withPage)
  await indexWhereHouseTypeController.getData(deleteWhereHouseTypeParams)
}

onMounted(() => {
  fetchWhereHouseType()
})

const searchWhereHouseType = debounce(() => {
  fetchWhereHouseType(word.value)
})

const deleteWhereHouseType = async (id: number) => {
  const deleteWhereHouseTypeParams = new DeleteWhereHouseTypeParams(id)
  await DeleteWhereHouseTypeController.getInstance().deleteWhereHouseType(deleteWhereHouseTypeParams)
  await fetchWhereHouseType()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchWhereHouseType('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchWhereHouseType('', currentPage.value, countPerPage.value)
}

watch(
  () => indexWhereHouseTypeController.state.value,
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

const actionList = (id: number, deleteWhereHouseType: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/organization/where-house-type/${id}`,
    permission: [
      PermissionsEnum.WHIERE_HOUSE_TYPE_UPDATE,
      PermissionsEnum.WHIERE_HOUSE_TYPE_DETAILS,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.WHIERE_HOUSE_TYPE_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteWhereHouseType(id),
    permission: [
      PermissionsEnum.WHIERE_HOUSE_TYPE_DELETE,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.WHIERE_HOUSE_TYPE_ALL,
    ],
  },
]

watch(
  () => route?.params?.id,
  (Newvalue) => {
    // id = Newvalue
    fetchWhereHouseType()
  },
)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4 mt-2">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchWhereHouseType())">
        <Search />
      </span>
      <input v-model="word" :placeholder="'search'" class="input" type="text" @input="searchWhereHouseType" />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel :data="state.data" />
      <ExportPdf />
      <PermissionBuilder :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.WHIERE_HOUSE_TYPE_CREATE]">
        <router-link to="/organization/where-house-type/add" class="btn btn-primary">
          {{ $t('add_where_house_type') }}
        </router-link>
      </PermissionBuilder>
    </div>
  </div>

  <PermissionBuilder :code="[
    PermissionsEnum.ORGANIZATION_EMPLOYEE,
    PermissionsEnum.WHIERE_HOUSE_TYPE_ALL,
    PermissionsEnum.WHIERE_HOUSE_TYPE_DELETE,
    PermissionsEnum.WHIERE_HOUSE_TYPE_FETCH,
    PermissionsEnum.WHIERE_HOUSE_TYPE_UPDATE,
    PermissionsEnum.WHIERE_HOUSE_TYPE_CREATE,
  ]">
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive">
          <table class="main-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{{ $t('title') }}</th>
                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/organization/where-house-type/${item.id}`">{{ index + 1 }}
                  </router-link>
                </td>
                <td data-label="Name">{{ wordSlice(item.title) }}</td>
                <td data-label="Actions">
                  <DropList :actionList="actionList(item.id, deleteWhereHouseType)"
                    @delete="deleteWhereHouseType(item.id)" />
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
        <PermissionBuilder :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.WHIERE_HOUSE_TYPE_CREATE]">

          <DataEmpty :link="`/organization/where-house-type/add`" addText="Add WhereHouseType"
            description="Sorry .. You have no WhereHouseType .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No WhereHouseType" />
        </PermissionBuilder>
      </template>
      <template #failed>
        <PermissionBuilder :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.WHIERE_HOUSE_TYPE_CREATE]">

          <DataFailed :link="`/organization/where-house-type/add`" addText="Add WhereHouseType"
            description="Sorry .. You have no WhereHouseType .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No WhereHouseType" />
        </PermissionBuilder>
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed addText="Have not  Permission"
        description="Sorry .. You have no WhereHouseType .. All your joined customers will appear here when you add your customer data"
        link="" />
    </template>
  </PermissionBuilder>
</template>

<style scoped></style>
