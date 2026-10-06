<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
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
import OrganizationDocumentsActionsButtons from './OrganizationDocumentsActionsButtons.vue'
import IndexFilterDialog from '@/shared/HelpersComponents/IndexFilterDialog.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const baseRoute = '/organization/organization-documents'
const word = ref(String(route.query.word ?? ''))
const currentPage = ref(Number(route.query.page ?? 1))
const countPerPage = ref(10)
const filterDate = ref('')
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
onMounted(fetchDocuments)
</script>

<template>
  <div class="flex flex-wrap justify-between gap-4 mb-4">
    <div class="input-search">
      <span class="icon-remove" @click="((word = ''), searchDocuments())"><Search /></span>
      <input
        v-model="word"
        class="input"
        :placeholder="$t('search_organization_documents')"
        @input="searchDocuments"
      />
    </div>
    <div class="flex flex-wrap gap-2">
      <IndexFilterDialog
        show-date
        :initial-date="filterDate"
        @apply="applyFilters"
        @reset="resetFilters"
      />
      <PermissionBuilder
        :code="[
          PermissionsEnum.ORGANIZATION_DOCUMENTS_ALL,
          PermissionsEnum.ORGANIZATION_DOCUMENTS_FETCH,
        ]"
      >
        <button type="button" class="btn btn-secondary" @click="exportExcel">
          {{ $t('export_to_excel') }}
        </button>
      </PermissionBuilder>
      <OrganizationDocumentsActionsButtons />
    </div>
  </div>
  <PermissionBuilder
    :code="[
      PermissionsEnum.ORGANIZATION_DOCUMENTS_ALL,
      PermissionsEnum.ORGANIZATION_DOCUMENTS_FETCH,
    ]"
  >
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive mt-2">
          <table class="main-table">
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
                <td>{{ (currentPage - 1) * countPerPage + index + 1 }}</td>
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
          :title="$t('organization_documents')"
          :description="$t('organization_documents_load_failed')"
        />
      </template>
    </DataStatus>
  </PermissionBuilder>
</template>
