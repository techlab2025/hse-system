<script lang="ts" setup>
import RegisterPage from '@/shared/Tables/RegisterPage.vue'

import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
// import * as XLSX from 'xlsx'
// import { saveAs } from 'file-saver'
import { debounce } from '@/base/Presentation/utils/debouced'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import ActionsTableEdit from '@/shared/icons/ActionsTableEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import Search from '@/shared/icons/Search.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import IndexOrganizationDocumentsController from '../controllers/indexOrganizationDocumentsController'
import IndexOrganizationDocumentsParams from '../../Core/params/indexOrganizationDocumentsParams'
import DeleteOrganizationDocumentsController from '../controllers/deleteOrganizationDocumentsController'
import DeleteOrganizationDocumentsParams from '../../Core/params/deleteOrganizationDocumentsParams'
// import ActionsList from '@/shared/HelpersComponents/ActionsList.vue'
// import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'
// import ExceIcon from '@/shared/icons/ExceIcon.vue'
import ActionsListAddIcon from '@/shared/icons/ActionsListAddIcon.vue'
// import UploadExcelIcon from '@/shared/icons/UploadExcelIcon.vue'
// import { ActionItemsTypeEnum } from '@/base/core/params/actions_items_type_enum'
import Dialog from 'primevue/dialog'
import UploadOrganizationDocumentsExeclSheet from './UploadOrganizationDocumentsExeclSheet.vue'
import IndexFilterDialog from '@/shared/HelpersComponents/IndexFilterDialog.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const baseRoute = '/organization/organization-documents'
const word = ref(String(route.query.word ?? ''))
const currentPage = ref(Number(route.query.page ?? 1))
const countPerPage = ref(10)
const filterDate = ref('')
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
  void fetchDocuments()
}
const controller = IndexOrganizationDocumentsController.getInstance()
const state = computed(() => controller.state.value)

const fetchDocuments = async () => {
  try {
    await controller.getData(
      new IndexOrganizationDocumentsParams(
        word.value,
        currentPage.value,
        countPerPage.value,
        1,
        undefined,
        filterDate.value,
      ),
    )
  } catch {
    // The controller state renders the request error.
  }
}
const updateQuery = () =>
  router.replace({
    query: { ...route.query, word: word.value || undefined, page: currentPage.value },
  })
const searchDocuments = debounce(() => {
  currentPage.value = 1
  void updateQuery()
  void fetchDocuments()
})
const changePage = (page: number) => {
  currentPage.value = page
  void updateQuery()
  void fetchDocuments()
}
const changePerPage = (count: number) => {
  countPerPage.value = count
  changePage(1)
}
const applyFilters = ({ date }: { date: string }) => {
  filterDate.value = date
  changePage(1)
}
const resetFilters = () => {
  filterDate.value = ''
  changePage(1)
}
const deleteDocument = async (id: number) => {
  const deleteController = DeleteOrganizationDocumentsController.getInstance()
  await deleteController.deleteOrganizationDocuments(new DeleteOrganizationDocumentsParams(id))
  if (deleteController.isDataSuccess()) await fetchDocuments()
}
const actionList = (id: number) => [
  {
    text: t('edit'),
    icon: ActionsTableEdit,
    link: `${baseRoute}/${id}`,
    permission: [
      PermissionsEnum.ORGANIZATION_DOCUMENTS_ALL,
      PermissionsEnum.ORGANIZATION_DOCUMENTS_UPDATE,
    ],
  },
  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteDocument(id),
    permission: [
      PermissionsEnum.ORGANIZATION_DOCUMENTS_ALL,
      PermissionsEnum.ORGANIZATION_DOCUMENTS_DELETE,
    ],
  },
]
/* Temporarily hidden index actions.
const exportExcel = () => {
  const rows =
    state.value.data?.map((item) => ({
      document_title: item.document_title,
      document_ref: item.document_ref,
      document_version: item.document_version,
      issue_date: item.issue_date,
      nex_review_date: item.nex_review_date,
      document_category_id: item.document_category_id,
      document_file: item.document_file,
      notes: item.notes,
    })) ?? []
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), 'Documents')
  saveAs(
    new Blob([XLSX.write(workbook, { type: 'array', bookType: 'xlsx' })]),
    'organization_documents.xlsx',
  )
}
const downloadTemplate = () => {
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet([
      {
        document_title: 'Safety Policy',
        document_ref: 'DOC-001',
        document_version: '1.0',
        issue_date: '2026-10-06',
        nex_review_date: '2027-10-06',
        document_category_id: 1,
        document_file: 'data:application/pdf;base64,...',
        notes: '',
      },
    ]),
    'Documents',
  )
  saveAs(
    new Blob([XLSX.write(workbook, { type: 'array', bookType: 'xlsx' })]),
    'organization_documents_template.xlsx',
  )
}

*/

const createPermissions = [
  PermissionsEnum.ORGANIZATION_DOCUMENTS_ALL,
  PermissionsEnum.ORGANIZATION_DOCUMENTS_CREATE,
]
/*
const indexActionList = computed(() => [
  {
    text: t('export_to_excel'),
    icon: ExceIcon,
    action: exportExcel,
    type: ActionItemsTypeEnum.Success,
    permission: [
      PermissionsEnum.ORGANIZATION_DOCUMENTS_ALL,
      PermissionsEnum.ORGANIZATION_DOCUMENTS_FETCH,
    ],
  },
  {
    text: t('upload_complated_template'),
    icon: UploadExcelIcon,
    action: () => fileInputRef.value?.click(),
    type: ActionItemsTypeEnum.Warning,
    permission: createPermissions,
  },
  {
    text: t('download_excel_template'),
    icon: ExceIcon,
    action: downloadTemplate,
    type: ActionItemsTypeEnum.Success,
    permission: createPermissions,
  },
])
*/
onMounted(fetchDocuments)
</script>

<template>
  <RegisterPage>
    <div class="flex flex-wrap justify-between gap-4 mb-4">
      <div class="input-search">
        <span class="icon-remove" @click="((word = ''), searchDocuments())"><Search /></span>
        <input
          dir="auto"
          v-model="word"
          class="input"
          :placeholder="$t('search_organization_documents')"
          @input="searchDocuments"
        />
      </div>
      <div class="flex flex-wrap gap-2">
        <!-- <IndexFilterDialog
          show-date
          :initial-date="filterDate"
          @apply="applyFilters"
          @reset="resetFilters"
        /> -->
        <PermissionBuilder :code="createPermissions">
          <router-link :to="`${baseRoute}/add`" class="btn btn-primary">
            <ActionsListAddIcon />
            <span>{{ $t('add_organization_documents') }}</span>
          </router-link>
        </PermissionBuilder>
        <!-- Actions are temporarily hidden.
      <ActionsList
        feature-name="organization_documents"
        :show-actions="true"
        :action-list="indexActionList"
        :actions-number="4"
      >
        <template #custom>
          <ExportPdf :is-drop-list="true" />
        </template>
      </ActionsList>
      --></div>
    </div>
    <PermissionBuilder
      :code="[
        PermissionsEnum.ORGANIZATION_DOCUMENTS_ALL,
        PermissionsEnum.ORGANIZATION_DOCUMENTS_FETCH,
      ]"
    >
      <DataStatus :controller="state">
        <template #success>
          <div class="table-responsive mt-2 hse-table-scroll">
            <table v-table-identity class="main-table hse-data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{{ $t('document_title') }}</th>
                  <th>{{ $t('document_ref') }}</th>
                  <th>{{ $t('document_version') }}</th>
                  <th>{{ $t('document_category') }}</th>
                  <th>{{ $t('issue_date') }}</th>
                  <th>{{ $t('nex_review_date') }}</th>
                  <th>{{ $t('notes') }}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in state.data" :key="item.id">
                  <td><span class="hse-table-row-number">{{ (currentPage - 1) * countPerPage + index + 1 }}</span></td>
                  <td>{{ item.document_title }}</td>
                  <td>{{ item.document_ref }}</td>
                  <td>{{ item.document_version }}</td>
                  <td>{{ item.documentCategory?.title ?? '---' }}</td>
                  <td>{{ item.issue_date }}</td>
                  <td>{{ item.nex_review_date }}</td>
                  <td>{{ item.notes || '---' }}</td>
                  <td><DropList :action-list="actionList(item.id)" /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <Pagination
            :pagination="state.pagination"
            @change-page="changePage"
            @count-per-page="changePerPage"
          />
        </template>
        <template #loader><TableLoader :cols="9" :rows="10" /></template>
        <template #initial><TableLoader :cols="9" :rows="10" /></template>
        <template #empty>
          <PermissionBuilder
            :code="[
              PermissionsEnum.ORGANIZATION_DOCUMENTS_ALL,
              PermissionsEnum.ORGANIZATION_DOCUMENTS_CREATE,
            ]"
          >
            <DataEmpty
              :link="`${baseRoute}/add`"
              :add-text="$t('add_organization_documents')"
              :description="$t('organization_documents_empty_description')"
              :title="$t('organization_documents_empty_title')"
            />
          </PermissionBuilder>
        </template>
        <template #failed>
          <DataFailed
            :link="`${baseRoute}/add`"
            :add-text="$t('add_organization_documents')"
            :title="$t('organization_documents')"
            :description="$t('organization_documents_load_failed')"
          />
        </template>
      </DataStatus>
    </PermissionBuilder>
    <Dialog
      v-model:visible="showUploadDialog"
      modal
      :dismissable-mask="true"
      :header="$t('upload_excel')"
      :style="{ width: '80vw', maxWidth: '900px' }"
    >
      <UploadOrganizationDocumentsExeclSheet
        v-if="showUploadDialog"
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
  </RegisterPage>
</template>
