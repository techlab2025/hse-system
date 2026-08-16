<script lang="ts" setup>
// import IndexEquipmentTypeParams from '@/features/setting/EquipmentType/Core/params/indexEquipmentTypeParams'
// import IndexEquipmentTypeController from '@/features/setting/EquipmentType/Presentation/controllers/indexEquipmentTypeController'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { computed, onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import wordSlice from '@/base/Presentation/utils/word_slice'

import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
// import IconRemoveInput from '@/shared/icons/IconRemoveInput.vue'
import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'
// import DeleteEquipmentTypeController from '@/features/setting/EquipmentType/Presentation/controllers/deleteEquipmentTypeController'
// import DeleteEquipmentTypeParams from '@/features/setting/EquipmentType/Core/params/deleteEquipmentTypeParams'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
// import ExportIcon from '@/shared/icons/ExportIcon.vue'
import ExportExcel from '@/shared/HelpersComponents/ExportExcel.vue'
import SaveIcon from '@/shared/icons/SaveIcon.vue'
import Search from '@/shared/icons/Search.vue'
import IndexEquipmentController from '../controllers/indexEquipmentController'
import IndexEquipmentParams from '../../Core/params/indexEquipmentParams'
import DeleteEquipmentParams from '../../Core/params/deleteEquipmentParams'
import DeleteEquipmentController from '../controllers/deleteEquipmentController'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import IconEye from '@/shared/icons/IconEye.vue'
import EquipmentCard from './EquipmentUtils/EquipmentCard.vue'
import ToolCard from '@/features/Organization/Project/Presentation/components/Details/Equipment/ToolCard.vue'
import ActionsTableEdit from '@/shared/icons/ActionsTableEdit.vue'
import ActionsTableShild from '@/shared/icons/ActionsTableShild.vue'
import ActionsTableView from '@/shared/icons/ActionsTableView.vue'
import EquipmentLoader from '../supcomponents/EquipmentLoader.vue'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
import ActionsList from '@/shared/HelpersComponents/ActionsList.vue'
import ExceIcon from '@/shared/icons/ExceIcon.vue'
import ActionsListAddIcon from '@/shared/icons/ActionsListAddIcon.vue'
import UploadExcelIcon from '@/shared/icons/UploadExcelIcon.vue'
import Dialog from 'primevue/dialog'
import UploadEquipmentExeclSheet from './UploadEquipmentExeclSheet.vue'
import { ActionItemsTypeEnum } from '@/base/core/params/actions_items_type_enum'
import { useThemeMode } from '@/composables/useThemeMode'
import IndexFilterDialog from '@/shared/HelpersComponents/IndexFilterDialog.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import IndexEquipmentTypeController from '@/features/setting/EquipmentType/Presentation/controllers/indexEquipmentTypeController'
import IndexEquipmentTypeParams from '@/features/setting/EquipmentType/Core/params/indexEquipmentTypeParams'
import { EquipmentStatus } from '../../Core/enum/equipmentStatus'
import { EquipmentTypeEnum } from '@/features/Home/core/enums/SettingEnum/EquipmentTypeEnum'

const { t } = useI18n()
const { isDarkMode } = useThemeMode()

// import DialogChangeStatusEquipmentType from "@/features/setting/EquipmentTypes/Presentation/components/EquipmentType/DialogChangeStatusEquipmentType.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const filterDate = ref('')
const filterStatus = ref<number | null>(null)
const filterEquipmentType = ref<number | null>(null)
const equipmentTypeOptions = ref<TitleInterface[]>([])
const ownershipOptions = [
  new TitleInterface({ id: EquipmentStatus.RENT, title: 'Rent' }),
  new TitleInterface({ id: EquipmentStatus.OWN, title: 'Owned' }),
]
const filterFields = computed(() => [
  { key: 'status', label: 'Rent Type', options: ownershipOptions },
  { key: 'equipmentType', label: 'Equipment Type', options: equipmentTypeOptions.value },
])
const indexEquipmentController = IndexEquipmentController.getInstance()
const state = ref(indexEquipmentController.state.value)
const route = useRoute()
let id = route.params.id
const routeEquipmentType = computed(() => {
  const queryValue = Array.isArray(route.query.equipment_type)
    ? route.query.equipment_type[0]
    : route.query.equipment_type
  const equipmentType = Number(queryValue)

  return [EquipmentTypeEnum.Tool, EquipmentTypeEnum.Device, EquipmentTypeEnum.Machine].includes(
    equipmentType,
  )
    ? equipmentType
    : undefined
})
// const type = ref<EquipmentTypeStatusEnum>(EquipmentTypeStatusEnum[route.params.type as keyof typeof EquipmentTypeStatusEnum])

const fetchEquipment = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteEquipmentTypeParams = new IndexEquipmentParams(
    query,
    pageNumber,
    perPage,
    withPage,
    id,
    true,
    undefined,
    filterDate.value,
    filterStatus.value ?? undefined,
    filterEquipmentType.value ?? undefined,
    routeEquipmentType.value,
  )
  await indexEquipmentController.getData(deleteEquipmentTypeParams)
}

onMounted(async () => {
  fetchEquipment()
  equipmentTypeOptions.value = await IndexEquipmentTypeController.getInstance().fetch(
    new IndexEquipmentTypeParams('', 1, 100, 0),
  )
})

const searchEquipmentType = debounce(() => {
  fetchEquipment(word.value)
})

const deleteEquipment = async (id: number) => {
  const deleteEquipmentParams = new DeleteEquipmentParams(id)
  await DeleteEquipmentController.getInstance().deleteEquipment(deleteEquipmentParams)
  await fetchEquipment()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchEquipment(word.value, currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchEquipment(word.value, currentPage.value, countPerPage.value)
}

const applyFilters = ({
  date,
  values,
}: {
  date: string
  values: Record<string, number | null>
}) => {
  filterDate.value = date
  filterStatus.value = values.status ?? null
  filterEquipmentType.value = values.equipmentType ?? null
  currentPage.value = 1
  fetchEquipment(word.value, 1, countPerPage.value)
}

const resetFilters = () => {
  filterDate.value = ''
  filterStatus.value = null
  filterEquipmentType.value = null
  currentPage.value = 1
  fetchEquipment(word.value, 1, countPerPage.value)
}

watch(
  () => indexEquipmentController.state.value,
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

const actionList = (id: number, deleteEquipment: (id: number) => void) => [
  {
    text: t('edit'),
    icon: ActionsTableEdit,
    link: `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/equipment/${id}`,
    permission: [
      PermissionsEnum.EQUIPMENT_UPDATE,
      PermissionsEnum.ORG_EQUIPMENT_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.EQUIPMENT_ALL,
      PermissionsEnum.ORG_EQUIPMENT_ALL,
    ],
  },
  {
    text: t('add_inspection'),
    icon: ActionsTableShild,
    link: `/${
      user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
    }/equipment-mangement/inspection/add/${id}`,
    permission: [
      PermissionsEnum.EQUIPMENT_UPDATE,
      PermissionsEnum.ORG_EQUIPMENT_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.EQUIPMENT_ALL,
      PermissionsEnum.ORG_EQUIPMENT_ALL,
    ],
  },
  {
    text: t('show'),
    icon: ActionsTableView,
    link: `/${
      user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
    }/equipment-show/${id}`,
    permission: [
      PermissionsEnum.EQUIPMENT_DETAILS,
      PermissionsEnum.ORG_EQUIPMENT_DETAILS,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.EQUIPMENT_ALL,
      PermissionsEnum.ORG_EQUIPMENT_ALL,
    ],
  },
  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteEquipment(id),
    permission: [
      PermissionsEnum.EQUIPMENT_DELETE,
      PermissionsEnum.ORG_EQUIPMENT_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.EQUIPMENT_ALL,
      PermissionsEnum.ORG_EQUIPMENT_ALL,
    ],
  },
]

watch(
  () => route?.params?.id,
  (Newvalue) => {
    id = Newvalue
    fetchEquipment()
  },
)

watch(
  () => route.query.equipment_type,
  () => {
    currentPage.value = 1
    fetchEquipment(word.value, 1, countPerPage.value)
  },
)

const exportExcel = () => {
  if (!state.value.data || state.value.data.length === 0) {
    alert('No data available to export')
    return
  }
  const worksheetData = state.value.data.map((item: Record<string, unknown>) => {
    const it = item as any
    return {
      name: it.title || 'N/A',
      CertificateExpireDate: it.date || '--',
      LicenceNumber: it.license_plate_number || '--',
      image: '*',
      'Certificate Image': '*',
      StartDate: formatJoinDate(it.checkin_date) || '--',
      EndData: formatJoinDate(it.checkout_date) || '--',
      RentPeriod: it.period || '--',
      RentType: it.period_type || '--',
      status: it.status || '--',
    }
  })
  const worksheet = XLSX.utils.json_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoices')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(data, 'Equipment.xlsx')
}

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
  fetchEquipment()
}

const DownloadExample = () => {
  const worksheetData = [
    {
      'Equipment name': 'Example Equipment',
      'Certificate Expiry date': '2026-12-31',
      'License plate number': '1234 ABC',
      'Equipment image': '*',
      'Certificate image': '*',
      'Rent Start date': '2026-06-01',
      'Rent End date': '2026-06-30',
      'Rent Period type': '3',
      'Rent Period': '1',
      Status: '1',
    },
  ]
  const worksheet = XLSX.utils.json_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Equipment')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(blob, 'EquipmentForm.xlsx')
}

const IndexEquipmentactionList = () => [
  {
    text: t('export_excel'),
    icon: ExceIcon,
    action: () => exportExcel(),
    type: ActionItemsTypeEnum.Success,
    permission: [
      PermissionsEnum.EQUIPMENT_ALL,
      PermissionsEnum.ORG_EQUIPMENT_ALL,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ADMIN,
    ],
  },
  {
    text: t('Add_Equipment'),
    link: `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/equipment/add`,
    icon: ActionsListAddIcon,
    type: ActionItemsTypeEnum.Info,
    permission: [
      PermissionsEnum.EQUIPMENT_CREATE,
      PermissionsEnum.ORG_EQUIPMENT_CREATE,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ADMIN,
    ],
  },
  {
    text: t('import_equipment'),
    type: ActionItemsTypeEnum.Warning,
    action: () => fileInputRef.value?.click(),
    icon: UploadExcelIcon,
    permission: [
      PermissionsEnum.EQUIPMENT_CREATE,
      PermissionsEnum.ORG_EQUIPMENT_CREATE,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ADMIN,
    ],
  },
  {
    text: t('download_form_example'),
    icon: ExceIcon,
    action: () => DownloadExample(),
    type: ActionItemsTypeEnum.Success,
    permission: [
      PermissionsEnum.EQUIPMENT_CREATE,
      PermissionsEnum.ORG_EQUIPMENT_CREATE,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ADMIN,
    ],
  },
]
</script>

<template>
  <div :class="['equipment-index-page', { 'is-dark': isDarkMode }]">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
      <div class="input-search col-span-1">
        <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
        <span class="icon-remove" @click=";((word = ''), searchEquipmentType())">
          <Search />
        </span>
        <input
          v-model="word"
          :placeholder="'search'"
          class="input"
          type="text"
          @input="searchEquipmentType"
        />
      </div>
      <div class="col-span-2 flex justify-end gap-2">
        <IndexFilterDialog
          show-date
          :fields="filterFields"
          :initial-date="filterDate"
          :initial-values="{ status: filterStatus, equipmentType: filterEquipmentType }"
          @apply="applyFilters"
          @reset="resetFilters"
        />
        <ActionsList
          :show-actions="true"
          :actionList="IndexEquipmentactionList()"
          :actionsNumber="5"<
        >
          <template #custom>
            <ExportPdf
              :isDropList="true"
              target-selector=".equipment-index-page .equipment-cards-grid"
              filename="equipment.pdf"
            />
          </template>>
        </ActionsList>
      </div>
    </div>

    <PermissionBuilder
      :code="[
        PermissionsEnum.ADMIN,
        PermissionsEnum.ORGANIZATION_EMPLOYEE,
        PermissionsEnum.EQUIPMENT_ALL,
        PermissionsEnum.EQUIPMENT_DELETE,
        PermissionsEnum.EQUIPMENT_FETCH,
        PermissionsEnum.EQUIPMENT_UPDATE,
        PermissionsEnum.EQUIPMENT_CREATE,
        PermissionsEnum.ORG_EQUIPMENT_ALL,
        PermissionsEnum.ORG_EQUIPMENT_DELETE,
        PermissionsEnum.ORG_EQUIPMENT_FETCH,
        PermissionsEnum.ORG_EQUIPMENT_UPDATE,
        PermissionsEnum.ORG_EQUIPMENT_CREATE,
      ]"
    >
      <DataStatus :controller="state">
        <template #success>
          <div class="equipment-cards-grid grid grid-cols-1 xl:grid-cols-2 gap-4">
            <EquipmentCard
              @delete:data="deleteEquipment"
              v-for="(tool, index) in state.data"
              :key="index"
              :tool="tool"
            />
          </div>
          <Pagination
            :pagination="state.pagination"
            @changePage="handleChangePage"
            @countPerPage="handleCountPerPage"
          />
        </template>
        <template #loader>
          <EquipmentLoader />
        </template>
        <template #initial>
          <EquipmentLoader />
        </template>
        <template #empty>
          <PermissionBuilder
            :code="[
              PermissionsEnum.ADMIN,
              PermissionsEnum.ORGANIZATION_EMPLOYEE,
              PermissionsEnum.EQUIPMENT_CREATE,
              PermissionsEnum.ORG_EQUIPMENT_CREATE,
            ]"
          >
            <DataEmpty
              :link="`/${
                user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
              }/equipment/add`"
              addText="Add Equipment"
              description="Sorry .. You have no Equipment .. All your joined customers will appear here when you add your customer data"
              title="..ops! You have No Equipment"
            />
          </PermissionBuilder>
        </template>
        <template #failed>
          <PermissionBuilder
            :code="[
              PermissionsEnum.ADMIN,
              PermissionsEnum.ORGANIZATION_EMPLOYEE,
              PermissionsEnum.EQUIPMENT_CREATE,
              PermissionsEnum.ORG_EQUIPMENT_CREATE,
            ]"
          >
            <DataFailed
              :link="`/${
                user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
              }/equipment/add`"
              addText="Add Equipment"
              description="Sorry .. You have no Equipment .. All your joined customers will appear here when you add your customer data"
              title="..ops! You have No Equipment"
            />
          </PermissionBuilder>
        </template>
      </DataStatus>

      <template #notPermitted>
        <DataFailed
          addText="Have not  Permission"
          description="Sorry .. You have no Equipment .. All your joined customers will appear here when you add your customer data"
        />
      </template>
    </PermissionBuilder>

    <Dialog
      v-model:visible="showUploadDialog"
      modal
      :dismissable-mask="true"
      :header="$t('import_equipment')"
      :style="{ width: '80vw', maxWidth: '900px' }"
    >
      <UploadEquipmentExeclSheet :initial-file="pendingFile" @uploaded="handleUploadComplete" />
    </Dialog>

    <input
      ref="fileInputRef"
      type="file"
      accept=".xls,.xlsx"
      style="display: none"
      @change="onFileSelected"
    />
  </div>
</template>

<style scoped lang="scss">
.equipment-index-page.is-dark {
  color: var(--text-strong);
}

.equipment-index-page.is-dark :deep(.input-search) {
  background-color: transparent !important;
}

.equipment-index-page.is-dark :deep(.input-search input) {
  background-color: var(--surface-2) !important;
  border-color: var(--main-border) !important;
  color: var(--text-strong) !important;
}

.equipment-index-page.is-dark :deep(.input-search input::placeholder) {
  color: var(--text-muted) !important;
}

.equipment-index-page.is-dark :deep(.equipment-cards-grid) {
  background-color: transparent !important;
}
</style>
