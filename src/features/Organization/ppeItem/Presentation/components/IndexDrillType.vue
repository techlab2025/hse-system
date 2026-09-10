<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { debounce } from '@/base/Presentation/utils/debouced'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import Search from '@/shared/icons/Search.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import ActionsTableEdit from '@/shared/icons/ActionsTableEdit.vue'
import ActionsList from '@/shared/HelpersComponents/ActionsList.vue'
import ExceIcon from '@/shared/icons/ExceIcon.vue'
import ActionsListAddIcon from '@/shared/icons/ActionsListAddIcon.vue'
import UploadExcelIcon from '@/shared/icons/UploadExcelIcon.vue'
import Dialog from 'primevue/dialog'
import * as XLSX from 'xlsx'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { ActionItemsTypeEnum } from '@/base/core/params/actions_items_type_enum'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import IndexDrillTypeController from '../controllers/indexDrillTypeController'
import IndexDrillTypeParams from '../../Core/params/indexDrillTypeParams'
import DeleteDrillTypeParams from '../../Core/params/deleteDrillTypeParams'
import DeleteDrillTypeController from '../controllers/deleteDrillTypeController'
import SystemDrillTypes from '../supcomponents/SystemDrillTypes.vue'
import UploadDrillTypeExcelSheet from './UploadDrillTypeExcelSheet.vue'

const { t } = useI18n()
const { user } = useUserStore()
const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const controller = IndexDrillTypeController.getInstance()
const state = ref(controller.state.value)
const basePath = computed(() =>
  user?.type === OrganizationTypeEnum.ADMIN ? '/admin' : '/organization',
)

const featurePermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.ORGANIZATION_EMPLOYEE,
  PermissionsEnum.DRILL_TYPE_ALL,
  PermissionsEnum.DRILL_TYPE_FETCH,
  PermissionsEnum.DRILL_TYPE_DETAILS,
  PermissionsEnum.DRILL_TYPE_CREATE,
  PermissionsEnum.DRILL_TYPE_UPDATE,
  PermissionsEnum.DRILL_TYPE_DELETE,
  PermissionsEnum.ORG_DRILL_TYPE_ALL,
  PermissionsEnum.ORG_DRILL_TYPE_FETCH,
  PermissionsEnum.ORG_DRILL_TYPE_DETAILS,
  PermissionsEnum.ORG_DRILL_TYPE_CREATE,
  PermissionsEnum.ORG_DRILL_TYPE_UPDATE,
  PermissionsEnum.ORG_DRILL_TYPE_DELETE,
]
const createPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.ORGANIZATION_EMPLOYEE,
  PermissionsEnum.DRILL_TYPE_ALL,
  PermissionsEnum.DRILL_TYPE_CREATE,
  PermissionsEnum.ORG_DRILL_TYPE_ALL,
  PermissionsEnum.ORG_DRILL_TYPE_CREATE,
]

const fetchDrillTypes = async (
  query: string = '',
  page: number = 1,
  limit: number = 10,
) => {
  await controller.getData(new IndexDrillTypeParams(query, page, limit, 1))
}

onMounted(() => fetchDrillTypes())
watch(
  () => controller.state.value,
  (value) => {
    state.value = value
  },
  { deep: true },
)

const searchDrillTypes = debounce(() => fetchDrillTypes(word.value))
const changePage = (page: number) => {
  currentPage.value = page
  fetchDrillTypes(word.value, page, countPerPage.value)
}
const changePageSize = (limit: number) => {
  countPerPage.value = limit
  fetchDrillTypes(word.value, currentPage.value, limit)
}
const deleteDrillType = async (id: number) => {
  await DeleteDrillTypeController.getInstance().deleteDrillType(new DeleteDrillTypeParams(id))
  await fetchDrillTypes(word.value, currentPage.value, countPerPage.value)
}

const rowActions = (id: number) => [
  {
    text: t('edit'),
    icon: ActionsTableEdit,
    link: `${basePath.value}/drill-type/${id}`,
    permission: [
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.DRILL_TYPE_ALL,
      PermissionsEnum.DRILL_TYPE_UPDATE,
      PermissionsEnum.ORG_DRILL_TYPE_ALL,
      PermissionsEnum.ORG_DRILL_TYPE_UPDATE,
    ],
  },
  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteDrillType(id),
    permission: [
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.DRILL_TYPE_ALL,
      PermissionsEnum.DRILL_TYPE_DELETE,
      PermissionsEnum.ORG_DRILL_TYPE_ALL,
      PermissionsEnum.ORG_DRILL_TYPE_DELETE,
    ],
  },
]

const saveWorkbook = (rows: Record<string, unknown>[], filename: string) => {
  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Drill Types')
  XLSX.writeFile(workbook, filename)
}
const exportExcel = () =>
  saveWorkbook(
    (state.value.data ?? []).map((item: any) => ({
      title: item.title ?? '',
      description: item.description ?? '',
    })),
    'drill_types.xlsx',
  )
const downloadExample = () =>
  saveWorkbook(
    [{ title: 'Fire drill', description: 'Fire response and assembly drill' }],
    'drill_type_template.xlsx',
  )

const showUploadDialog = ref(false)
const pendingFile = ref<File | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const onFileSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  pendingFile.value = file
  showUploadDialog.value = true
  input.value = ''
}
const onUploaded = () => {
  showUploadDialog.value = false
  pendingFile.value = null
  fetchDrillTypes()
}

const headerActions = () => [
  {
    text: t('export_to_excel'),
    icon: ExceIcon,
    action: exportExcel,
    type: ActionItemsTypeEnum.Success,
    permission: featurePermissions,
  },
  {
    text: t('add_drill_type'),
    link: `${basePath.value}/drill-type/add`,
    icon: ActionsListAddIcon,
    primary: true,
    type: ActionItemsTypeEnum.Info,
    permission: createPermissions,
  },
  {
    text: t('upload_complated_template'),
    action: () => fileInputRef.value?.click(),
    icon: UploadExcelIcon,
    type: ActionItemsTypeEnum.Warning,
    permission: createPermissions,
  },
  {
    text: t('download_excel_template'),
    icon: ExceIcon,
    action: downloadExample,
    type: ActionItemsTypeEnum.Success,
    permission: createPermissions,
  },
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <span class="icon-remove" @click="((word = ''), searchDrillTypes())"><Search /></span>
      <input v-model="word" :placeholder="$t('search')" class="input" @input="searchDrillTypes" />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ActionsList
        feature-name="action_feature_drill_types"
        :show-actions="true"
        :action-list="headerActions()"
        :actions-number="5"
      >
        <template #custom><ExportPdf :is-drop-list="true" /></template>
      </ActionsList>
    </div>
    <SystemDrillTypes
      v-if="user?.type !== OrganizationTypeEnum.ADMIN"
      :is-header-tap="true"
    />
  </div>

  <PermissionBuilder :code="featurePermissions">
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive">
          <table class="main-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{{ $t('title') }}</th>
                <th scope="col">{{ $t('description') }}</th>
                <th class="empty"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td>{{ (currentPage - 1) * countPerPage + index + 1 }}</td>
                <td>{{ item.title }}</td>
                <td>{{ item.description }}</td>
                <td><DropList :action-list="rowActions(item.id)" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination
          :pagination="state.pagination"
          @change-page="changePage"
          @count-per-page="changePageSize"
        />
      </template>
      <template #loader><TableLoader :cols="4" :rows="10" /></template>
      <template #initial><TableLoader :cols="4" :rows="10" /></template>
      <template #empty>
        <DataEmpty
          :link="`${basePath}/drill-type/add`"
          :add-text="$t('add_drill_type')"
          :description="$t('no_drill_types_description')"
          :title="$t('no_drill_types')"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`${basePath}/drill-type/add`"
          :add-text="$t('add_drill_type')"
          :description="$t('no_drill_types_description')"
          :title="$t('no_drill_types')"
        />
      </template>
    </DataStatus>
    <template #notPermitted>
      <DataFailed add-text="Have not Permission" description="" link="" />
    </template>
  </PermissionBuilder>

  <Dialog
    v-model:visible="showUploadDialog"
    modal
    :dismissable-mask="true"
    :header="$t('import_drill_types')"
    :style="{ width: '80vw', maxWidth: '900px' }"
  >
    <UploadDrillTypeExcelSheet
      :initial-file="pendingFile"
      @uploaded="onUploaded"
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
