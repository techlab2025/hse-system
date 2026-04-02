<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import Search from '@/shared/icons/Search.vue'
import IndexOrganizatoinEmployeeController from '../controllers/indexOrganizatoinEmployeeController'
import IndexOrganizatoinEmployeeParams from '../../Core/params/indexOrganizatoinEmployeeParams'
import DeleteOrganizatoinEmployeeParams from '../../Core/params/deleteOrganizatoinEmployeeParams'
import DeleteOrganizatoinEmployeeController from '../controllers/deleteOrganizatoinEmployeeController'
import ActionsTableEdit from '@/shared/icons/ActionsTableEdit.vue'
import ActionsTableView from '@/shared/icons/ActionsTableView.vue'
import ActionsTableShild from '@/shared/icons/ActionsTableShild.vue'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type TitleInterface from '@/base/Data/Models/title_interface'
import AddOrganizatoinEmployeeToHierarchyController from '../controllers/addOrganizatoinEmployeeToHierarchyController'
import AddEmployeeToHierarchyParams from '../../Core/params/AddEmployeesToHierarchyParams'
import IndexOrganizatoinEmployeeToAddToHierarchyController from '../controllers/indexOrganizatoinEmployeeToAddToHierarchyController'
import AddEmployeeIdToHierarchyParams from '../../Core/params/AddEmployeesIdToHierarchyParams'
import { EmployeeCertificateStatus } from '../../Core/Enum/EmployeeTakeCertificateStatusEnum'

import SelectButton from 'primevue/selectbutton'

import DataEmployee from '../supcomponents/DataEmployee.vue'

import ActionsListAddIcon from '@/shared/icons/ActionsListAddIcon.vue'
import { ActionItemsTypeEnum } from '@/base/core/params/actions_items_type_enum'
import ExceIcon from '@/shared/icons/ExceIcon.vue'
import UploadExcelIcon from '@/shared/icons/UploadExcelIcon.vue'
import ActionsList from '@/shared/HelpersComponents/ActionsList.vue'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'

const { t } = useI18n()

// import DialogChangeStatusOrganizatoinEmployee from "@/features/setting/OrganizatoinEmployeeuages/Presentation/components/OrganizatoinEmployee/DialogChangeStatusOrganizatoinEmployee.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexOrganizatoinEmployeeController = IndexOrganizatoinEmployeeController.getInstance()
const state = ref(indexOrganizatoinEmployeeController.state.value)
const route = useRoute()
// const id = route.params.parent_id
const id = route?.query?.heirarchy_id

// const type = ref<OrganizatoinEmployeeStatusEnum>(OrganizatoinEmployeeStatusEnum[route.params.type as keyof typeof OrganizatoinEmployeeStatusEnum])

const fetchOrganizatoinEmployee = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteOrganizatoinEmployeeParams = new IndexOrganizatoinEmployeeParams(
    query,
    pageNumber,
    perPage,
    withPage,
    id,
    null,
    false,
    route.query.certificate_id ? route.query.certificate_id : null,
    isEmployeeTakeCertificate.value
      ? isEmployeeTakeCertificate.value == EmployeeCertificateStatus.NotTake
        ? true
        : false
      : null,
  )
  await indexOrganizatoinEmployeeController.getData(deleteOrganizatoinEmployeeParams)
}

onMounted(() => {
  fetchOrganizatoinEmployee()
})

const searchOrganizatoinEmployee = debounce(() => {
  fetchOrganizatoinEmployee(word.value)
})

const deleteOrganizatoinEmployee = async (id: number) => {
  const deleteOrganizatoinEmployeeParams = new DeleteOrganizatoinEmployeeParams(id)
  await DeleteOrganizatoinEmployeeController.getInstance().deleteOrganizatoinEmployee(
    deleteOrganizatoinEmployeeParams,
  )
  await fetchOrganizatoinEmployee()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchOrganizatoinEmployee('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchOrganizatoinEmployee('', currentPage.value, countPerPage.value)
}

watch(
  () => indexOrganizatoinEmployeeController.state.value,
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

const actionList = (id: number, deleteOrganizatoinEmployee: (id: number) => void) => [
  {
    text: t('edit'),
    icon: ActionsTableEdit,
    link: `/organization/organization-employee/${id}`,
    permission: [
      PermissionsEnum.ORG_EMPLOYEE_UPDATE,
      PermissionsEnum.ORG_EMPLOYEE_DETAILS,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORG_EMPLOYEE_ALL,
    ],
  },
  // {
  //   text: t('add_sub_PROJECT_type'),
  //   icon: IconEdit,
  //   link: `/admin/Project-type/add/${id}`,
  //   permission: [
  //     PermissionsEnum.PROJECT_TYPE_UPDATE,
  //     PermissionsEnum.ADMIN,
  //     PermissionsEnum.PROJECT_TYPE_ALL,
  //   ],
  // },
  // {
  //   text: t('sub_PROJECT_types'),
  //   icon: IconEdit,
  //   link: `/admin/Project-types/${id}`,
  //   permission: [
  //     PermissionsEnum.PROJECT_TYPE_UPDATE,
  //     PermissionsEnum.ADMIN,
  //     PermissionsEnum.PROJECT_TYPE_ALL,
  //   ],
  // },

  {
    text: t('show'),
    icon: ActionsTableView,
    link: `/organization/organization-employee/show/${id}`,
    permission: [PermissionsEnum.CREATE_PERMISSION, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },
  {
    text: t('add_permission'),
    icon: ActionsTableShild,
    link: `/organization/permission/${id}`,
    permission: [PermissionsEnum.CREATE_PERMISSION, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteOrganizatoinEmployee(id),
    permission: [
      PermissionsEnum.ORG_EMPLOYEE_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORG_EMPLOYEE_ALL,
    ],
  },
]

watch(
  () => route?.params?.heirarchy_id,
  (newId) => {
    fetchOrganizatoinEmployee()
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
      name: it.name || 'N/A',
      email: it.email || null,
      phone: it.phone || null,
      password: '',
    }
  })
  const worksheet = XLSX.utils.json_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoices')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(data, 'Employees.xlsx')
}

const exportPDF = async () => {
  const tableElement = document.querySelector('.table-responsive')

  if (!tableElement) {
    console.error('Table element not found.')
    return
  }

  try {
    // Capture the table as an image
    const canvas = await html2canvas(tableElement, {
      scale: 2, // Higher scale for better resolution
    })

    const imgData = canvas.toDataURL('image/png')

    // Initialize jsPDF
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    })

    // Calculate dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width

    // Add image to PDF
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)

    // Save the PDF
    pdf.save('table.pdf')
  } catch (error) {
    console.error('Error generating PDF:', error)
  }
}

const SelectedEmployees = ref<TitleInterface[]>()
const indexEmployeeController = IndexOrganizatoinEmployeeToAddToHierarchyController.getInstance()
const indexEmployeeParams = new IndexOrganizatoinEmployeeParams(
  '',
  1,
  10,
  0,
  null,
  null,
  null,
  null,
  null,
  false,
)
const setSelectedEmployees = (data: TitleInterface[]) => {
  SelectedEmployees.value = data
}
const router = useRouter()
const AddEmployees = async () => {
  if (SelectedEmployees.value?.length > 0) {
    const addOrganizatoinEmployeeToHierarchyController =
      AddOrganizatoinEmployeeToHierarchyController.getInstance()
    const addEmployeeToHierarchyParams = new AddEmployeeToHierarchyParams(
      route.query.heirarchy_id,
      SelectedEmployees.value?.map((el) => new AddEmployeeIdToHierarchyParams(el.id)),
    )
    const state =
      await addOrganizatoinEmployeeToHierarchyController.addOrganizatoinEmployeeToHiearcrhy(
        addEmployeeToHierarchyParams,
        router,
      )
    await fetchOrganizatoinEmployee()
  }
  SelectedEmployees.value = []
}
const isEmployeeTakeCertificate = ref<EmployeeCertificateStatus>()
watch(
  () => isEmployeeTakeCertificate.value,
  () => {
    fetchOrganizatoinEmployee()
  },
)

const setCertificateStatus = () => {
  if (value.value === 'Taken Certificates') {
    isEmployeeTakeCertificate.value = EmployeeCertificateStatus.Take
  } else {
    isEmployeeTakeCertificate.value = EmployeeCertificateStatus.NotTake
  }
}

const value = ref('Not Taken Certificates')
const options = ref(['Taken Certificates', 'Not Taken Certificates'])
const IndexOrganizationEmployeectionList = () => [
  {
    text: t('export_excel'),
    icon: ExceIcon,
    action: () => exportExcel(),
    type: ActionItemsTypeEnum.Success,
    permission: [PermissionsEnum.ORG_EMPLOYEE_FETCH, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },
  {
    text: t('add_employee'),
    link: '/organization/organization-employee/add',
    icon: ActionsListAddIcon,
    type: ActionItemsTypeEnum.Info,
    permission: [PermissionsEnum?.ORG_EMPLOYEE_CREATE, PermissionsEnum?.ADMIN],
  },
  {
    text: t('upload_excel'),
    type: ActionItemsTypeEnum.Warning,
    link: '/organization/organization-employee/upload',
    icon: UploadExcelIcon,
    permission: [PermissionsEnum?.ORG_EMPLOYEE_CREATE, PermissionsEnum?.ADMIN],
  },
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <!-- ... -->
    <DataEmployee v-if="route.query.heirarchy_id" />
    <div
      v-if="route.query.certificate_id"
      class="col-span-4 w-full md:col-span-4 mt-5 input-wrapper flex"
    >
      <!-- <button class="btn btn-primary" @click="isEmployeeTakeCertificate = EmployeeCertificateStatus.NotTake">Not Take
        Certificate</button>
      <button class="btn btn-secondary" @click="isEmployeeTakeCertificate = EmployeeCertificateStatus.Take">Take
        Certificate</button> -->
      <SelectButton v-model="value" :options="options" @change="setCertificateStatus" />
    </div>

    <div
      v-if="route.query.heirarchy_id"
      class="w-full col-span-3 md:col-span-3 mt-5 gap-2 add-emplyee-hierarchy"
    >
      <div class="flex gap-2 input-wrapper" style="width: 80%; margin-block: 8px">
        <CustomSelectInput
          :modelValue="SelectedEmployees"
          @update:modelValue="setSelectedEmployees"
          :controller="indexEmployeeController"
          :params="indexEmployeeParams"
          :label="$t('employees')"
          :type="2"
          :placeholder="$t('select_employees')"
        />
      </div>
      <button
        class="btn btn-primary"
        style="width: 20%; height: fit-content; padding: 12px; margin-top: 35px"
        @click="AddEmployees"
      >
        Add Employees
      </button>
    </div>
    <div
      class="input-search col-span-1"
      v-if="!route.query.heirarchy_id && !route.query.certificate_id"
    >
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchOrganizatoinEmployee())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchOrganizatoinEmployee"
      />
    </div>
    <div
      class="col-span-2 flex justify-end gap-2"
      v-if="!route.query.heirarchy_id && !route.query.certificate_id"
    >
      <!-- <IndexActions @export:pdf="exportPDF" @export:excel="exportExcel"
        :permissions="[PermissionsEnum.ADMIN, PermissionsEnum.ORG_EMPLOYEE_CREATE]" ,
        :addLink="`/organization/organization-employee/add`"
        :ImportexcelLink="`/organization/organization-employee/upload`" :addText="`add_organizatoin_employee`"
        :addDescription="`add_employee`" :numberOfActions="4" /> -->

      <!-- <ExportPdf />
      <button class="btn btn-secondary" @click="exportExcel">Export Excel</button>

      <PermissionBuilder v-if="!route.query.heirarchy_id && !route.query.certificate_id"
        :code="[PermissionsEnum.ADMIN, PermissionsEnum.ORG_EMPLOYEE_CREATE]">
        <router-link to="/organization/organization-employee/add" class="btn btn-primary">
          {{ $t('add_organizatoin_employee') }}
        </router-link>


      </PermissionBuilder>
      <router-link v-if="!route.query.heirarchy_id && !route.query.certificate_id"
        to="/organization/organization-employee/upload" class="btn btn-primary">
        {{ $t('upload_excel') }}
      </router-link> -->
      <ActionsList
        :show-actions="true"
        :actionList="IndexOrganizationEmployeectionList()"
        :actionsNumber="4"
      >
        <template #custom>
          <!-- <SystemWarehouseTypes :isHeaderTap="false" /> -->
          <ExportPdf :isDropList="true" />
        </template>
      </ActionsList>
    </div>
  </div>

  <PermissionBuilder
    :code="[
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORG_EMPLOYEE_ALL,
      PermissionsEnum.ORG_EMPLOYEE_DELETE,
      PermissionsEnum.ORG_EMPLOYEE_FETCH,
      PermissionsEnum.ORG_EMPLOYEE_UPDATE,
      PermissionsEnum.ORG_EMPLOYEE_CREATE,
    ]"
  >
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive">
          <table class="main-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{{ $t('name') }}</th>
                <th scope="col">{{ $t('hierarchy') }}</th>
                <th scope="col">{{ $t('email') }}</th>
                <th scope="col">{{ $t('phone') }}</th>
                <!-- <th scope="col">{{ $t('actions') }}</th> -->
                <th class="empty"></th>
                <!-- <th scope="col">{{ $t('image') }}</th> -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/organization/organization-employee/${item.id}`"
                    >{{ index + 1 }}
                  </router-link>
                </td>
                <td data-label="Name">{{ item.name }}</td>
                <td data-label="Hierarchy" class="table-Hierarchy">
                  {{ item.hierarchy.map((el) => el.title).join(' - ') || 'N/A' }}
                </td>
                <td data-label="Email">{{ item.email }}</td>
                <td data-label="Phone">{{ item.phone }}</td>
                <!-- <td data-label="images">
                  <img :src="item.image || '/src/assets/images/logo.svg'" @error="setDefaultImage($event)" alt="" />
                </td> -->

                <td data-label="Actions">
                  <DropList
                    :actionList="actionList(item.id, deleteOrganizatoinEmployee)"
                    @delete="deleteOrganizatoinEmployee(item.id)"
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
        <PermissionBuilder :code="[PermissionsEnum.ADMIN, PermissionsEnum.ORG_EMPLOYEE_CREATE]">
          <DataEmpty
            :link="`/organization/organization-employee/add`"
            addText="Add OrganizatoinEmployee"
            description="Sorry .. You have no OrganizatoinEmployee .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No OrganizatoinEmployee"
          />
        </PermissionBuilder>
      </template>
      <template #failed>
        <PermissionBuilder :code="[PermissionsEnum.ADMIN, PermissionsEnum.ORG_EMPLOYEE_CREATE]">
          <DataFailed
            :link="`/organization/organization-employee/add`"
            addText="Add OrganizatoinEmployee"
            description="Sorry .. You have no OrganizatoinEmployee .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No OrganizatoinEmployee"
          />
        </PermissionBuilder>
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        link="/organization"
        addText="Have not  Permission"
        description="Sorry .. You have no OrganizatoinEmployee .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </PermissionBuilder>
</template>

<style scoped>
.upload {
  width: 100px;
  height: 40px;
}

.add-emplyee-hierarchy {
  display: flex !important;
  justify-content: space-between;
  width: 100% !important;
  align-items: center;
}
.table-Hierarchy {
  color: #1f41bb !important;
}
</style>
