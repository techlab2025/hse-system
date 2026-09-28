<script lang="ts" setup>
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import wordSlice from '@/base/Presentation/utils/word_slice'
import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import Search from '@/shared/icons/Search.vue'
import IndexOrganizationCertificateController from '../controllers/indexOrganizationCertificateController.ts'
import IndexOrganizationCertificateParams from '../../Core/params/indexOrganizationCertificateParams.ts'
import DeleteOrganizationCertificateParams from '../../Core/params/deleteOrganizationCertificateParams.ts'
import DeleteOrganizationCertificateController from '../controllers/deleteOrganizationCertificateController.ts'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { useUserStore } from '@/stores/user'
import ActionsTableEdit from '@/shared/icons/ActionsTableEdit.vue'
import Dialog from 'primevue/dialog'
import ActionsList from '@/shared/HelpersComponents/ActionsList.vue'
import ExceIcon from '@/shared/icons/ExceIcon.vue'
import { ActionItemsTypeEnum } from '@/base/core/params/actions_items_type_enum'
import ActionsListAddIcon from '@/shared/icons/ActionsListAddIcon.vue'
import UploadOrganizationCertificateExeclSheet from './UploadOrganizationCertificateExeclSheet.vue'
import IndexFilterDialog from '@/shared/HelpersComponents/IndexFilterDialog.vue'
import { OrganizationCertificateTypeEnum } from '../../Core/Enums/OrganizationCertificateTypeEnum.ts'

const { t } = useI18n()
const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const filterDate = ref('')
const indexOrganizationCertificateController = IndexOrganizationCertificateController.getInstance()
const state = ref(indexOrganizationCertificateController.state.value)
const route = useRoute()
const router = useRouter()
const id = ref(route.params.parent_id)

const fetchOrganizationCertificate = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteOrganizationCertificateParams = new IndexOrganizationCertificateParams(
    query,
    pageNumber,
    perPage,
    withPage,
    undefined,
    filterDate.value,
    // id.value?? '',
  )
  await indexOrganizationCertificateController.getData(deleteOrganizationCertificateParams)
}
onMounted(async () => {
  if (route.query.word) {
    word.value = String(route.query.word)
  }
  await fetchOrganizationCertificate(
    word.value,
    route.query.page ? Number(route.query.page) : 1,
    countPerPage.value,
  )
})

const searchOrganizationCertificate = debounce(() => {
  router.push({
    query: {
      ...route.query,
      page: Number(route.query.page ?? 1),
      word: word.value || undefined,
    },
  })
  fetchOrganizationCertificate(word.value)
})

const deleteOrganizationCertificate = async (id: number) => {
  const deleteOrganizationCertificateParams = new DeleteOrganizationCertificateParams(id)
  await DeleteOrganizationCertificateController.getInstance().deleteOrganizationCertificate(deleteOrganizationCertificateParams)
  await fetchOrganizationCertificate()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchOrganizationCertificate(word.value, currentPage.value, countPerPage.value)
  router.push({
    query: {
      ...route.query,
      page: String(page),
      word: word.value,
    },
  })
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchOrganizationCertificate(word.value, currentPage.value, countPerPage.value)
}

const applyFilters = ({ date }: { date: string }) => {
  filterDate.value = date
  currentPage.value = 1
  fetchOrganizationCertificate(word.value, 1, countPerPage.value)
}

const resetFilters = () => {
  filterDate.value = ''
  currentPage.value = 1
  fetchOrganizationCertificate(word.value, 1, countPerPage.value)
}

watch(
  () => indexOrganizationCertificateController.state.value,
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

const { user } = useUserStore()
const organizationCertificateRoute = '/organization/organization-certificate'
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

const handleUploadComplete = () => {
  showUploadDialog.value = false
  pendingFile.value = null
  fetchOrganizationCertificate()
}

const actionList = (id: number, deleteOrganizationCertificate: (id: number) => void) => [
  {
    text: t('edit'),
    icon: ActionsTableEdit,
    link: `${organizationCertificateRoute}/${id}`,
    permission: [
      PermissionsEnum.ORG_CERTIFICATE_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ORG_CERTIFICATE_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteOrganizationCertificate(id),
    permission: [
      PermissionsEnum.ORG_CERTIFICATE_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ORG_CERTIFICATE_ALL,
    ],
  },
]

watch(
  () => route?.params?.id,
  (Newvalue) => {
    // id = Newvalue
    fetchOrganizationCertificate()
  },
)

const getOrganizationCertificateTypeLabel = (certificateType: number) => {
  const labels: Record<number, string> = {
    [OrganizationCertificateTypeEnum.SCALE]: t('organization_certificate_type_skill'),
    [OrganizationCertificateTypeEnum.AWARENESS]: t('organization_certificate_type_awareness'),
    [OrganizationCertificateTypeEnum.KNOWLEDGE]: t('organization_certificate_type_knowledge'),
  }

  return labels[Number(certificateType)] ?? '---'
}

// Export To Excel Sheet
const exportExcel = () => {
  if (!state.value.data || state.value.data.length === 0) {
    alert('No data available to export')
    return
  }
  const worksheetData = state.value.data.map((item: Record<string, unknown>) => {
    const it = item as any
    return {
      'OrganizationCertificate Title': it.title || 'N/A',
      'OrganizationCertificate Type': getOrganizationCertificateTypeLabel(it.certificateType),
      'Require Expired Date': it.requireExpiredDate ? 'Yes' : 'No',
      'OrganizationCertificate Required': it.requireCertificate ? 'Yes' : 'No',
      Image: '*',
    }
  })
  const worksheet = XLSX.utils.json_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'OrganizationCertificate')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(data, 'organization_certificate.xlsx')
}

const DownloadExample = () => {
  const worksheetData = [
    {
      'OrganizationCertificate Title': 'NEBOSH',
      'OrganizationCertificate Type': 'Skill',
      require_expired_date: 'Yes',
      'OrganizationCertificate Required': 'Yes',
    },
    {
      'OrganizationCertificate Title': 'OSHA',
      'OrganizationCertificate Type': 'Awareness',
      require_expired_date: 'Yes',
      'OrganizationCertificate Required': 'No',
    },
  ]
  const worksheet = XLSX.utils.json_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'OrganizationCertificate')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(blob, 'organization_certificate_form.xlsx')
}

const organizationCertificateActionList = () => [
  {
    text: t('export_to_excel'),
    icon: ExceIcon,
    action: () => exportExcel(),
    type: ActionItemsTypeEnum.Success,
  },
  {
    text: t('add_organization_certificate'),
    icon: ActionsListAddIcon,
    link: `${organizationCertificateRoute}/add`,
    primary: true,
    type: ActionItemsTypeEnum.Info,
    permission: [PermissionsEnum.ORG_CERTIFICATE_CREATE],
  },
  {
    text: t('download_excel_template'),
    icon: ExceIcon,
    action: () => DownloadExample(),
    type: ActionItemsTypeEnum.Success,
    permission: [PermissionsEnum.ORG_CERTIFICATE_FETCH, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },
  {
    text: t('upload_complated_template'),
    icon: ActionsListAddIcon,
    action: () => fileInputRef.value?.click(),
    type: ActionItemsTypeEnum.Info,
    permission: [PermissionsEnum?.ORG_EMPLOYEE_CREATE, PermissionsEnum?.ADMIN],
  },
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <span class="icon-remove" @click="((word = ''), searchOrganizationCertificate())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="$t('search_organization_certificate')"
        class="input"
        type="text"
        @input="searchOrganizationCertificate"
      />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <IndexFilterDialog
        show-date
        :initial-date="filterDate"
        @apply="applyFilters"
        @reset="resetFilters"
      />

      <!-- <PermissionBuilder :code="[PermissionsEnum.ORG_CERTIFICATE_CREATE]">
        <router-link
          :to="`/${
            user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
          }/organization-certificate/import-excel`"
          class="btn btn-primary"
        >
          {{ $t('import_certificate') }}
        </router-link>
      </PermissionBuilder> -->
      <!-- <a href="/ExcelForm.xlsx" class="btn btn-secondary" download>
        <ExcelSheetIcon class="icon" />
        <span class="download-title">Excel Sheet</span>
      </a> -->
      <ActionsList
        feature-name="action_feature_organization_certificate"
        :show-actions="true"
        :actionList="organizationCertificateActionList()"
        :actionsNumber="5"
      >
        <template #custom>
          <ExportPdf :isDropList="true" />
        </template>
      </ActionsList>
      <!-- <DropList :actionList="actionList"  /> -->
    </div>
  </div>

  <PermissionBuilder
    :code="[
      PermissionsEnum.ORG_CERTIFICATE_ALL,
      PermissionsEnum.ORG_CERTIFICATE_DELETE,
      PermissionsEnum.ORG_CERTIFICATE_FETCH,
      PermissionsEnum.ORG_CERTIFICATE_UPDATE,
      PermissionsEnum.ORG_CERTIFICATE_CREATE,
    ]"
  >
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive mt-2">
          <table class="main-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{{ $t('organization_certificate_title') }}</th>
                <th scope="col" v-if="user?.type === OrganizationTypeEnum?.ADMIN">
                  {{ $t('all_industries') }}
                </th>
                <th scope="col" v-if="user?.type === OrganizationTypeEnum?.ADMIN">
                  {{ $t('industries') }}
                </th>
                <th scope="col">{{ $t('organization_certificate_type') }}</th>
                <th scope="col">{{ $t('expiry_date_required') }}</th>
                <th scope="col">{{ $t('require_organization_certificate') }}</th>
                <!-- <th scope="col">{{ $t('image') }}</th> -->

                <!-- <th scope="col">{{ $t('actions') }}</th> -->
                <th class="empty"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link
                    :to="`${organizationCertificateRoute}/${item.id}`"
                    >{{ index + 1 }}
                  </router-link>
                </td>
                <td data-label="Name">{{ wordSlice(item?.title ?? '') }}</td>
                <td data-label="all_industries" v-if="user?.type === OrganizationTypeEnum?.ADMIN">
                  {{ item.allIndustries ? $t('yes') : $t('no') }}
                </td>
                <td data-label="all_industries" v-if="user?.type === OrganizationTypeEnum?.ADMIN">
                  {{
                    item.industries.length > 0
                      ? item.industries.map((industry) => industry.title).join(', ')
                      : $t('no')
                  }}
                </td>
                <td :data-label="$t('organization_certificate_type')">
                  {{ getOrganizationCertificateTypeLabel(item.certificateType) }}
                </td>
                <td :data-label="$t('require_expired_date')">
                  {{ item.requireExpiredDate ? $t('yes') : $t('no') }}
                </td>
                <td :data-label="$t('require_organization_certificate')">
                  {{ item.requireCertificate ? $t('yes') : $t('no') }}
                </td>
                <!-- <td data-label="image">
                  <div class="image_certificate_container">
                    <Image v-if="item.image" :src="item.image" alt="Image" preview />
                    <span v-else>---</span>
                  </div>
                </td> -->

                <td data-label="Actions">
                  <DropList
                    :actionList="actionList(item.id, deleteOrganizationCertificate)"
                    @delete="deleteOrganizationCertificate(item.id)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- <div class="index-certificate-container">
          <OrganizationCertificateCard v-for="(certificate, index) in state.data" :key="index" :cerificate="certificate" />
        </div> -->
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
        <PermissionBuilder :code="[PermissionsEnum.ORG_CERTIFICATE_CREATE]">
          <DataEmpty
            :link="`${organizationCertificateRoute}/add`"
            :addText="$t('add_organization_certificate')"
            :description="$t('organization_certificate_empty_description')"
            :title="$t('organization_certificate_empty_title')"
          />
        </PermissionBuilder>
      </template>
      <template #failed>
        <PermissionBuilder :code="[PermissionsEnum.ORG_CERTIFICATE_CREATE]">
          <DataFailed
            :link="`${organizationCertificateRoute}/add`"
            :addText="$t('add_organization_certificate')"
            :description="$t('organization_certificate_empty_description')"
            :title="$t('organization_certificate_empty_title')"
          />
        </PermissionBuilder>
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="You have no AccidentTypeuage .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </PermissionBuilder>

  <Dialog
    v-model:visible="showUploadDialog"
    modal
    :dismissable-mask="true"
    :header="$t('upload_organization_certificate_sheet')"
    :style="{ width: '80vw', maxWidth: '900px' }"
  >
    <UploadOrganizationCertificateExeclSheet :initial-file="pendingFile" @uploaded="handleUploadComplete" />
  </Dialog>

  <input
    ref="fileInputRef"
    type="file"
    accept=".xls,.xlsx"
    style="display: none"
    @change="onFileSelected"
  />
</template>
