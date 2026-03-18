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
import ActionsTableEdit from '@/shared/icons/ActionsTableEdit.vue'
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ActionsList from '@/shared/HelpersComponents/ActionsList.vue'
import ExceIcon from '@/shared/icons/ExceIcon.vue'
import ActionsListAddIcon from '@/shared/icons/ActionsListAddIcon.vue'
import UploadExcelIcon from '@/shared/icons/UploadExcelIcon.vue'
import { ActionItemsTypeEnum } from '@/base/core/params/actions_items_type_enum'
import IndexCheckListController from '../controllers/indexCheckListController'
import IndexCheckListParams from '../../Core/params/indexCheckListParams'
import DeleteCheckListParams from '../../Core/params/deleteCheckListParams'
import DeleteCheckListController from '../controllers/deleteCheckListController'

const { t } = useI18n()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexCheckListController = IndexCheckListController.getInstance()
const state = ref(indexCheckListController.state.value)
const route = useRoute()


const fetchCheckList = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteCheckListParams = new IndexCheckListParams(query, pageNumber, perPage, withPage)
  await indexCheckListController.getData(deleteCheckListParams)
}

onMounted(() => {
  fetchCheckList()
})

const searchCheckList = debounce(() => {
  fetchCheckList(word.value)
})

const deleteCheckList = async (id: number) => {
  const deleteCheckListParams = new DeleteCheckListParams(id)
  await DeleteCheckListController.getInstance().deleteCheckList(deleteCheckListParams)
  await fetchCheckList()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchCheckList('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchCheckList('', currentPage.value, countPerPage.value)
}

watch(
  () => indexCheckListController.state.value,
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

const actionList = (id: number, deleteCheckList: (id: number) => void) => [
  {
    text: t('edit'),
    icon: ActionsTableEdit,
    link: `/organization/check-list/${id}`,
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
    action: () => deleteCheckList(id),
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
    fetchCheckList()
  },
)

const exportExcel = () => {
  if (!state.value.data || state.value.data.length === 0) {
    alert("No data available to export");
    return;
  }
  const worksheetData = state.value.data.map(
    (item: Record<string, unknown>) => {
      const it = item as any;
      return {
        "title": it.title || "N/A",
      };
    },
  );
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, "WarehouseType.xlsx");
};



const IndexActionList = () => [
  {
    text: t('export_excel'),
    icon: ExceIcon,
    action: () => exportExcel(),
    type: ActionItemsTypeEnum.Success,
    permission: [
      PermissionsEnum.WHIERE_HOUSE_TYPE_DETAILS,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.WHIERE_HOUSE_TYPE_ALL,
    ],
  },
  {
    text: t('add_check_list'),
    link: '/organization/check-list/add',
    icon: ActionsListAddIcon,
    type: ActionItemsTypeEnum.Info,
    permission: [
      PermissionsEnum?.ORGANIZATION_EMPLOYEE,
      PermissionsEnum?.WHIERE_HOUSE_TYPE_CREATE
    ],
  },
  //{
    // text: t('import_check_list'),
    // type: ActionItemsTypeEnum.Warning,
    // link: '/organization/check-list/upload',
    // icon: UploadExcelIcon,
    // permission: [
    //   PermissionsEnum?.ORGANIZATION_EMPLOYEE,
    //   PermissionsEnum?.WHIERE_HOUSE_TYPE_CREATE
    // ],
  // },
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">

    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchCheckList())">
        <Search />
      </span>
      <input v-model="word" :placeholder="'search'" class="input" type="text" @input="searchCheckList" />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <!-- <ExportExcel :data="state.data" /> -->
      <!-- <ExportPdf />
      <button class="btn btn-secondary" @click="exportExcel">Export Excel</button>

      <PermissionBuilder :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.WHIERE_HOUSE_TYPE_CREATE]">
        <router-link to="/organization/where-house-type/add" class="btn btn-primary">
          {{ $t('add_warehouse_type') }}
        </router-link>
      </PermissionBuilder>

      <PermissionBuilder v-if="user?.type == OrganizationTypeEnum.ORGANIZATION"
        :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.WHIERE_HOUSE_TYPE_CREATE]">
        <router-link :to="`/organization/where-house-type/upload`" class="btn btn-primary">
          {{ $t('import_warehouse') }}
        </router-link>
      </PermissionBuilder>

      <PermissionBuilder v-if="user?.type == OrganizationTypeEnum.ORGANIZATION"
        :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.WHIERE_HOUSE_TYPE_CREATE]">
        <SystemWarehouseTypes />
      </PermissionBuilder> -->
      <ActionsList :show-actions="true" :actionList="IndexActionList()" :actionsNumber="3">
        <template #custom>
          <!-- <SystemWarehouseTypes :isHeaderTap="false" /> -->
          <ExportPdf :isDropList="true" />
        </template>
      </ActionsList>


    </div>
    <SystemWarehouseTypes :isHeaderTap="true" />
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
                  <router-link :to="`/organization/check-list/${item.id}`">{{ index + 1 }}
                  </router-link>
                </td>
                <td data-label="Name">{{ wordSlice(item.title) }}</td>
                <td data-label="Actions">
                  <DropList :actionList="actionList(item.id, deleteCheckList)"
                    @delete="deleteCheckList(item.id)" />
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

          <DataEmpty :link="`/organization/check-list/add`" addText="Add CheckList"
            description="Sorry .. You have no CheckList .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No CheckList" />
        </PermissionBuilder>
      </template>
      <template #failed>
        <PermissionBuilder :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.WHIERE_HOUSE_TYPE_CREATE]">

          <DataFailed :link="`/organization/check-list/add`" addText="Add CheckList"
            description="Sorry .. You have no CheckList .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No CheckList" />
        </PermissionBuilder>
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed addText="Have not  Permission"
        description="Sorry .. You have no CheckList .. All your joined customers will appear here when you add your customer data"
        link="" />
    </template>
  </PermissionBuilder>
</template>

<style scoped></style>
