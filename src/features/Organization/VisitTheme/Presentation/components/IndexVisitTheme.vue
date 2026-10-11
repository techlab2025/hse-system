<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import * as XLSX from 'xlsx'
import Dialog from 'primevue/dialog'
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
import ActionsListAddIcon from '@/shared/icons/ActionsListAddIcon.vue'
import ExceIcon from '@/shared/icons/ExceIcon.vue'
import UploadExcelIcon from '@/shared/icons/UploadExcelIcon.vue'
import { ActionItemsTypeEnum } from '@/base/core/params/actions_items_type_enum'
import TitleExcelImport from '@/shared/HelpersComponents/TitleExcelImport.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { useUserStore } from '@/stores/user'
import IndexVisitThemeController from '../controllers/indexVisitThemeController'
import IndexVisitThemeParams from '../../Core/params/indexVisitThemeParams'
import DeleteVisitThemeController from '../controllers/deleteVisitThemeController'
import DeleteVisitThemeParams from '../../Core/params/deleteVisitThemeParams'
import AddVisitThemeController from '../controllers/addVisitThemeController'
import SystemVisitThemes from '../supcomponents/SystemVisitThemes.vue'
const { t } = useI18n()
const router = useRouter()
const { user } = useUserStore()
const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const controller = IndexVisitThemeController.getInstance()
const state = ref(controller.state.value)
const basePath = computed(() =>
  user?.type === OrganizationTypeEnum.ADMIN ? '/admin' : '/organization',
)
const permissions = [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE]
const showUploadDialog = ref(false)
const pendingFile = ref<File | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const fetchVisitThemes = async (query = '', page = 1, limit = 10) => {
  await controller.getData(new IndexVisitThemeParams(query, page, limit, 1))
}
onMounted(() => fetchVisitThemes())
watch(
  () => controller.state.value,
  (value) => {
    state.value = value
  },
  { deep: true },
)
const searchVisitThemes = debounce(() => fetchVisitThemes(word.value))
const changePage = (page: number) => {
  currentPage.value = page
  fetchVisitThemes(word.value, page, countPerPage.value)
}
const changePageSize = (limit: number) => {
  countPerPage.value = limit
  fetchVisitThemes(word.value, currentPage.value, limit)
}
const deleteVisitTheme = async (id: number) => {
  await DeleteVisitThemeController.getInstance().deleteVisitTheme(new DeleteVisitThemeParams(id))
  await fetchVisitThemes(word.value, currentPage.value, countPerPage.value)
}
const saveWorkbook = (rows: Record<string, unknown>[], filename: string) => {
  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Visit Themes')
  XLSX.writeFile(workbook, filename)
}
const exportExcel = () =>
  saveWorkbook(
    (state.value.data ?? []).map((item: any) => ({ title: item.title ?? '' })),
    'visit_themes.xlsx',
  )
const downloadExample = () => saveWorkbook([{ title: 'Visit Theme 1' }], 'visit_theme_template.xlsx')
const onFileSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  pendingFile.value = file
  showUploadDialog.value = true
  input.value = ''
}
const onImported = async (titles: string[]) => {
  const controller = AddVisitThemeController.getInstance()
  await controller.importVisitThemes(titles, router)
  if (controller.isDataSuccess()) {
    showUploadDialog.value = false
    pendingFile.value = null
    await fetchVisitThemes(word.value, currentPage.value, countPerPage.value)
  }
}
const rowActions = (id: number) => [
  {
    text: t('edit'),
    icon: ActionsTableEdit,
    link: `${basePath.value}/visit-theme/${id}`,
    permission: permissions,
  },
  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteVisitTheme(id),
    permission: permissions,
  },
]
const headerActions = () => [
  {
    text: t('export_to_excel'),
    icon: ExceIcon,
    action: exportExcel,
    type: ActionItemsTypeEnum.Success,
    permission: permissions,
  },
  {
    text: t('add_visit_theme'),
    link: `${basePath.value}/visit-theme/add`,
    icon: ActionsListAddIcon,
    primary: true,
    permission: permissions,
  },
  {
    text: t('upload_complated_template'),
    action: () => fileInputRef.value?.click(),
    icon: UploadExcelIcon,
    type: ActionItemsTypeEnum.Warning,
    permission: permissions,
  },
  {
    text: t('download_excel_template'),
    action: downloadExample,
    icon: ExceIcon,
    type: ActionItemsTypeEnum.Success,
    permission: permissions,
  },
]
</script>
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <span class="icon-remove" @click="((word = ''), searchVisitThemes())"><Search /></span
      ><input v-model="word" :placeholder="$t('search')" class="input" @input="searchVisitThemes" />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ActionsList
        :feature-name="$t('action_feature_visit_themes')"
        :show-actions="true"
        :action-list="headerActions()"
        :actions-number="5"
      >
        <template #custom><ExportPdf :is-drop-list="true" /></template>
      </ActionsList>
    </div>
    <SystemVisitThemes
      v-if="user?.type !== OrganizationTypeEnum.ADMIN"
      :is-header-tap="true"
      @added="fetchVisitThemes(word, currentPage, countPerPage)"
    />
  </div>
  <PermissionBuilder :code="permissions">
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive">
          <table class="main-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{{ $t('title') }}</th>
                <th class="empty"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td>{{ (currentPage - 1) * countPerPage + index + 1 }}</td>
                <td>{{ item.title }}</td>
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
      <template #loader><TableLoader :cols="3" :rows="10" /></template
      ><template #initial><TableLoader :cols="3" :rows="10" /></template>
      <template #empty
        ><DataEmpty
          :link="`${basePath}/visit-theme/add`"
          :add-text="$t('add_visit_theme')"
          :description="$t('no_visit_themes_description')"
          :title="$t('no_visit_themes')"
      /></template>
      <template #failed
        ><DataFailed
          :link="`${basePath}/visit-theme/add`"
          :add-text="$t('add_visit_theme')"
          :description="$t('no_visit_themes_description')"
          :title="$t('no_visit_themes')"
      /></template>
    </DataStatus>
    <template #notPermitted
      ><DataFailed add-text="Have not Permission" description="" link=""
    /></template>
  </PermissionBuilder>

  <Dialog
    v-model:visible="showUploadDialog"
    modal
    :dismissable-mask="true"
    :header="$t('import_visit_themes')"
    :style="{ width: '80vw', maxWidth: '900px' }"
  >
    <TitleExcelImport :initial-file="pendingFile" @imported="onImported" />
  </Dialog>
  <input
    ref="fileInputRef"
    type="file"
    accept=".xls,.xlsx"
    style="display: none"
    @change="onFileSelected"
  />
</template>
