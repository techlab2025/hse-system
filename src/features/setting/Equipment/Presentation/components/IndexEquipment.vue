<script lang="ts" setup>
// import IndexEquipmentTypeParams from '@/features/setting/EquipmentType/Core/params/indexEquipmentTypeParams'
// import IndexEquipmentTypeController from '@/features/setting/EquipmentType/Presentation/controllers/indexEquipmentTypeController'
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { onMounted, ref, watch } from 'vue'
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
import { formatJoinDate } from "@/base/Presentation/utils/date_format";
import { filesToBase64 } from "@/base/Presentation/utils/file_to_base_64";

const { t } = useI18n()

// import DialogChangeStatusEquipmentType from "@/features/setting/EquipmentTypes/Presentation/components/EquipmentType/DialogChangeStatusEquipmentType.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexEquipmentController = IndexEquipmentController.getInstance()
const state = ref(indexEquipmentController.state.value)
const route = useRoute()
let id = route.params.id
// const type = ref<EquipmentTypeStatusEnum>(EquipmentTypeStatusEnum[route.params.type as keyof typeof EquipmentTypeStatusEnum])

const fetchEquipment = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1
) => {
  const deleteEquipmentTypeParams = new IndexEquipmentParams(
    query,
    pageNumber,
    perPage,
    withPage,
    id,
    true
  )
  await indexEquipmentController.getData(deleteEquipmentTypeParams)
}

onMounted(() => {
  fetchEquipment()
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
  fetchEquipment('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchEquipment('', currentPage.value, countPerPage.value)
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
  }
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
    link: `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
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
    link: `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
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
  }
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
        "name": it.title || "N/A",
        "CertificateExpireDate": it.date || null,
        "LicenceNumber": it.license_plate_number || null,
        "image": "*",
        "Certificate Image": "*",
        "StartDate": formatJoinDate(it.checkin_date),
        "EndData": formatJoinDate(it.checkout_date),
        "RentPeriod": it.period,
        "RentType": it.period_type,
        "status": it.status
      };
    },
  );
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, "Equipment.xlsx");
};
</script>

<template>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="; (word = ''), searchEquipmentType()">
        <Search />
      </span>
      <input v-model="word" :placeholder="'search'" class="input" type="text" @input="searchEquipmentType" />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <!-- <ExportExcel :data="state.data" /> -->
      <button class="btn btn-secondary" @click="exportExcel">Export Excel</button>

      <ExportPdf />
      <PermissionBuilder :code="[
        PermissionsEnum.ADMIN,
        PermissionsEnum.ORGANIZATION_EMPLOYEE,
        PermissionsEnum.EQUIPMENT_CREATE,
        PermissionsEnum.ORG_EQUIPMENT_CREATE,
      ]">
        <router-link :to="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
          }/equipment/add`" class="btn btn-primary">
          {{ $t('Add_Equipment') }}
        </router-link>
      </PermissionBuilder>
      <PermissionBuilder :code="[
        PermissionsEnum.ADMIN,
        PermissionsEnum.ORGANIZATION_EMPLOYEE,
        PermissionsEnum.EQUIPMENT_CREATE,
        PermissionsEnum.ORG_EQUIPMENT_CREATE,
      ]">
        <router-link :to="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
          }/equipment/upload-excel`" class="btn btn-primary">
          {{ $t('import_equipment') }}
        </router-link>
      </PermissionBuilder>
    </div>
  </div>

  <PermissionBuilder :code="[
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
  ]">
    <DataStatus :controller="state">
      <template #success>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <EquipmentCard @delete:data="deleteEquipment" v-for="(tool, index) in state.data" :key="index" :tool="tool" />
        </div>
        <Pagination :pagination="state.pagination" @changePage="handleChangePage" @countPerPage="handleCountPerPage" />
      </template>
      <template #loader>
        <EquipmentLoader />
      </template>
      <template #initial>
        <EquipmentLoader />
      </template>
      <template #empty>
        <PermissionBuilder :code="[
          PermissionsEnum.ADMIN,
          PermissionsEnum.ORGANIZATION_EMPLOYEE,
          PermissionsEnum.EQUIPMENT_CREATE,
          PermissionsEnum.ORG_EQUIPMENT_CREATE,
        ]">
          <DataEmpty :link="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
            }/equipment/add`" addText="Add Equipment"
            description="Sorry .. You have no Equipment .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No Equipment" />
        </PermissionBuilder>
      </template>
      <template #failed>
        <PermissionBuilder :code="[
          PermissionsEnum.ADMIN,
          PermissionsEnum.ORGANIZATION_EMPLOYEE,
          PermissionsEnum.EQUIPMENT_CREATE,
          PermissionsEnum.ORG_EQUIPMENT_CREATE,
        ]">
          <DataFailed :link="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
            }/equipment/add`" addText="Add Equipment"
            description="Sorry .. You have no Equipment .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No Equipment" />
        </PermissionBuilder>
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed addText="Have not  Permission"
        description="Sorry .. You have no Equipment .. All your joined customers will appear here when you add your customer data" />
    </template>
  </PermissionBuilder>
</template>

<style scoped></style>
