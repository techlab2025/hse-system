<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import wordSlice from '@/base/Presentation/utils/word_slice'

import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import ExportExcel from '@/shared/HelpersComponents/ExportExcel.vue'
import Search from '@/shared/icons/Search.vue'
import IndexIncidentCategoryParams from '../../Core/params/indexIncidentCategoryParams'
import IndexIncidentCategoryController from '../controllers/indexIncidentCategoryController'
import DeleteIncidentCategoryParams from '../../Core/params/deleteIncidentCategoryParams'
import DeleteIncidentCategoryController from '../controllers/deleteIncidentCategoryController'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import ActionsTableEdit from '@/shared/icons/ActionsTableEdit.vue'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import SystemIncidentCategories from '../supcomponents/SystemIncidentCategories.vue'
import ExceIcon from '@/shared/icons/ExceIcon.vue'
import { ActionItemsTypeEnum } from '@/base/core/params/actions_items_type_enum'
import ActionsListAddIcon from '@/shared/icons/ActionsListAddIcon.vue'
import UploadExcelIcon from '@/shared/icons/UploadExcelIcon.vue'
import ActionsList from '@/shared/HelpersComponents/ActionsList.vue'
import Dialog from 'primevue/dialog'
import UploadIncidentCategoryExeclSheet from './UploadIncidentCategoryExeclSheet.vue'
const { t } = useI18n()

const { user } = useUserStore()
const showUploadDialog = ref(false)
const pendingFile = ref<File | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const onFileSelected = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  pendingFile.value = file
  showUploadDialog.value = true
  ;(e.target as HTMLInputElement).value = ''
}
const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexIncidentCategoryController = IndexIncidentCategoryController.getInstance()
const state = ref(indexIncidentCategoryController.state.value)
const route = useRoute()
const id = route.params.parent_id

const fetchIncidentCategory = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const indexIncidentCategoryParams = new IndexIncidentCategoryParams(
    query,
    pageNumber,
    perPage,
    withPage,
    id,
  )
  await indexIncidentCategoryController.getData(indexIncidentCategoryParams)
}

onMounted(() => {
  fetchIncidentCategory()
})

const searchIncidentCategory = debounce(() => {
  fetchIncidentCategory(word.value)
})

const deleteIncidentCategory = async (id: number) => {
  const deleteIncidentCategoryParams = new DeleteIncidentCategoryParams(id)
  await DeleteIncidentCategoryController.getInstance().deleteIncidentCategory(deleteIncidentCategoryParams)
  await fetchIncidentCategory()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchIncidentCategory('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchIncidentCategory('', currentPage.value, countPerPage.value)
}

watch(
  () => indexIncidentCategoryController.state.value,
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

const actionList = (id: number, deleteIncidentCategoryItem: (id: number) => void) => [
  {
    text: t('edit'),
    icon: ActionsTableEdit,
    link: `/${
      user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
    }/incident-category/${id}`,
    permission: [
      PermissionsEnum.ACCIDENTS_TYPE_UPDATE,
      PermissionsEnum.ORG_ACCIDENTS_TYPE_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ACCIDENTS_TYPE_ALL,
      PermissionsEnum.ORG_ACCIDENTS_TYPE_ALL,
    ],
  },
  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteIncidentCategoryItem(id),
    permission: [
      PermissionsEnum.ACCIDENTS_TYPE_DELETE,
      PermissionsEnum.ORG_ACCIDENTS_TYPE_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ACCIDENTS_TYPE_ALL,
      PermissionsEnum.ORG_ACCIDENTS_TYPE_ALL,
    ],
  },
]

const exportExcel = () => {
  if (!state.value.data || state.value.data.length === 0) {
    alert('No data available to export')
    return
  }
  const worksheetData = state.value.data.map((item: Record<string, unknown>) => {
    const it = item as any
    return {
      title: it.title || 'N/A',
    }
  })
  const worksheet = XLSX.utils.json_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoices')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(data, 'incident-category.xlsx')
}

const DownloadExample = () => {
  const worksheetData = [{ title: 'Example Incident Category' }, { title: 'Example Incident Category 2' }]
  const worksheet = XLSX.utils.json_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'IncidentCategories')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(blob, 'incident_category_form.xlsx')
}

const IndexIncidentCategoryactionList = () => [
  {
    text: t('export_to_excel'),
    icon: ExceIcon,
    action: () => exportExcel(),
    type: ActionItemsTypeEnum.Success,
    permission: [PermissionsEnum.ORGANIZATION_EMPLOYEE, PermissionsEnum.ACCIDENTS_TYPE_CREATE],
  },
  {
    text: t('add_incident_category'),
    link: `/${
      user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
    }/incident-category/add`,
    icon: ActionsListAddIcon,
    type: ActionItemsTypeEnum.Info,
    permission: [PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.ACCIDENTS_TYPE_CREATE],
  },
  {
    text: t('upload_complated_template'),
    type: ActionItemsTypeEnum.Warning,
    action: () => fileInputRef.value?.click(),
    icon: UploadExcelIcon,
    permission: [PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.ACCIDENTS_TYPE_CREATE],
  },
  {
    text: t('download_excel_template'),
    icon: ExceIcon,
    action: () => DownloadExample(),
    type: ActionItemsTypeEnum.Success,
    permission: [PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.ACCIDENTS_TYPE_CREATE],
  },
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4 mt-2">
    <div class="input-search col-span-1">
      <span class="icon-remove" @click=";((word = ''), searchIncidentCategory())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchIncidentCategory"
      />
    </div>
    <!-- <PermissionBuilder :code="[PermissionsEnum.ACCIDENTS_TYPE_CREATE, PermissionsEnum.ORG_ACCIDENTS_TYPE_CREATE]">
      <div class="col-span-2 flex justify-end gap-2">
        <ExportPdf />
        <button class="btn btn-secondary" @click="exportExcel">Export Excel</button>

        <router-link :to="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
          }/incident-category/add`" class="btn btn-primary">
          {{ $t('add_incident_category') }}
        </router-link>
        <router-link v-if="user?.type == OrganizationTypeEnum.ORGANIZATION"
          :to="`/organization/incident-category/upload-excel`" class="btn btn-primary">
          {{ $t('import_incident_category') }}
        </router-link>
        <PermissionBuilder v-if="user?.type == OrganizationTypeEnum.ORGANIZATION"
          :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.ACCIDENTS_TYPE_CREATE]">
          <SystemIncidentCategories />
        </PermissionBuilder>
      </div>
    </PermissionBuilder> -->
    <div class="col-span-2 flex justify-end gap-2">
      <ActionsList
        :show-actions="true"
        :actionList="IndexIncidentCategoryactionList()"
        :actionsNumber="5"
      >
        <template #custom>
          <!-- <SystemIncidentCategories /> -->
          <ExportPdf :isDropList="true" />
        </template>
      </ActionsList>
    </div>
    <SystemIncidentCategories v-if="user?.type != OrganizationTypeEnum.ADMIN" :isHeaderTap="true" />
  </div>

  <PermissionBuilder
    :code="[
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ORG_ACCIDENTS_TYPE_ALL,
      PermissionsEnum.ORG_ACCIDENTS_TYPE_DELETE,
      PermissionsEnum.ORG_ACCIDENTS_TYPE_FETCH,
      PermissionsEnum.ORG_ACCIDENTS_TYPE_UPDATE,
      PermissionsEnum.ORG_ACCIDENTS_TYPE_CREATE,
      PermissionsEnum.ACCIDENTS_TYPE_ALL,
      PermissionsEnum.ACCIDENTS_TYPE_DELETE,
      PermissionsEnum.ACCIDENTS_TYPE_FETCH,
      PermissionsEnum.ACCIDENTS_TYPE_UPDATE,
      PermissionsEnum.ACCIDENTS_TYPE_CREATE,
    ]"
  >
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive">
          <table class="main-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{{ $t('title') }}</th>
                <th scope="col">{{ $t('incident Type') }}</th>
                <!-- <th scope="col">{{ $t('actions') }}</th> -->
                <th class="empty"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link
                    :to="`/${
                      user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
                    }/incident-category/${item.id}`"
                    >{{ index + 1 }}
                  </router-link>
                </td>
                <td data-label="Name">{{ wordSlice(item.title) }}</td>
                <td data-label="Incident Type">{{ item.incidentType?.title ?? '---' }}</td>

                <td data-label="Actions">
                  <DropList
                    :actionList="actionList(item.id, deleteIncidentCategory)"
                    @delete="deleteIncidentCategory(item.id)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
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
        <PermissionBuilder
          :code="[PermissionsEnum.ACCIDENTS_TYPE_CREATE, PermissionsEnum.ORG_ACCIDENTS_TYPE_CREATE]"
        >
          <DataEmpty
            :link="`/${
              user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
            }/incident-category/add`"
            addText="Add Incident Category"
            description="Sorry .. You have no Incident Category .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No Incident Category"
          />
        </PermissionBuilder>
      </template>
      <template #failed>
        <PermissionBuilder
          :code="[PermissionsEnum.ACCIDENTS_TYPE_CREATE, PermissionsEnum.ORG_ACCIDENTS_TYPE_CREATE]"
        >
          <DataFailed
            :link="`/${
              user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
            }/incident-category/add`"
            addText="Add Incident Category"
            description="Sorry .. You have no Incident Category .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No Incident Category"
          />
        </PermissionBuilder>
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no Permission .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </PermissionBuilder>

  <Dialog
    v-model:visible="showUploadDialog"
    modal
    :dismissable-mask="true"
    :header="$t('import_incident_category')"
    :style="{ width: '80vw', maxWidth: '900px' }"
  >
    <UploadIncidentCategoryExeclSheet
      :initial-file="pendingFile"
      @uploaded="
        showUploadDialog = false;
        pendingFile = null;
        fetchIncidentCategory();
      "
    />
  </Dialog>

  <input
    ref="fileInputRef"
    type="file"
    accept=".xls,.xlsx"
    style="display: none"
    @change="onFileSelected"
  />
</template>

<style scoped></style>
