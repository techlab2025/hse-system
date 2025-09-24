<script lang="ts" setup>
import IndexEquipmentTypeParams from '@/features/setting/EquipmentType/Core/params/indexEquipmentTypeParams'
import IndexEquipmentTypeController from '@/features/setting/EquipmentType/Presentation/controllers/indexEquipmentTypeController'

import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
// import IconRemoveInput from '@/shared/icons/IconRemoveInput.vue'
import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'
import DeleteEquipmentTypeController from '@/features/setting/EquipmentType/Presentation/controllers/deleteEquipmentTypeController'
import DeleteEquipmentTypeParams from '@/features/setting/EquipmentType/Core/params/deleteEquipmentTypeParams'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/employee/Core/Enum/permission_enum.ts'
import ExportIcon from '@/shared/icons/ExportIcon.vue'
import ExportExcel from '@/shared/HelpersComponents/ExportExcel.vue'
import SaveIcon from '@/shared/icons/SaveIcon.vue'
import Search from '@/shared/icons/Search.vue'
import IndexEquipmentController from '../controllers/indexEquipmentController'
import IndexEquipmentParams from '../../Core/params/indexEquipmentParams'
import DeleteEquipmentParams from '../../Core/params/deleteEquipmentParams'
import DeleteEquipmentController from '../controllers/deleteEquipmentController'

const { t } = useI18n()

// import DialogChangeStatusEquipmentType from "@/features/setting/EquipmentTypeuages/Presentation/components/EquipmentType/DialogChangeStatusEquipmentType.vue";
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
  withPage: number = 1,
) => {
  const deleteEquipmentTypeParams = new IndexEquipmentParams(
    query,
    pageNumber,
    perPage,
    withPage,
    id,
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
  },
)

const actionList = (id: number, deleteEquipment: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/admin/equipment/${id}`,
    permission: [
      PermissionsEnum.EQUIPMENT_TYPE_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.EQUIPMENT_TYPE_ALL,
    ],
  },
  {
    text: t('add_sub_equipment'),
    icon: IconEdit,
    link: `/admin/equipment/add/${id}`,
    permission: [
      PermissionsEnum.EQUIPMENT_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.EQUIPMENT_ALL,
    ],
  },
  {
    text: t('sub_equipment'),
    icon: IconEdit,
    link: `/admin/equipments/${id}`,
    permission: [
      PermissionsEnum.EQUIPMENT_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.EQUIPMENT_ALL,
    ],
  },
  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteEquipment(id),
    permission: [
      PermissionsEnum.EQUIPMENT_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.EQUIPMENT_ALL,
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
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchEquipmentType())">
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
      <div class="btn btn-secondary flex align-center justify-center">
        <ExportExcel
          :data="state.data"
          :columns="customColumns"
          filename="formatted_export"
          sheet-name="Equipment Data"
          button-text="Export Formatted"
          button-class="btn-primary"
        />
        <SaveIcon />
      </div>
      <div class="btn btn-secondary flex align-center justify-center">
        <ExportPdf />
        <ExportIcon />
      </div>
      <permission-builder :code="[PermissionsEnum.ADMIN, PermissionsEnum.EQUIPMENT_TYPE_CREATE]">
        <router-link to="/admin/equipment/add" class="btn btn-primary">
          {{ $t('Add_Equipment') }}
        </router-link>
      </permission-builder>
    </div>
  </div>

  <permission-builder
    :code="[
      PermissionsEnum.ADMIN,
      PermissionsEnum.EQUIPMENT_ALL,
      PermissionsEnum.EQUIPMENT_DELETE,
      PermissionsEnum.EQUIPMENT_FETCH,
      PermissionsEnum.EQUIPMENT_UPDATE,
      PermissionsEnum.EQUIPMENT_CREATE,
    ]"
  >
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive">
          <table class="main-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">title</th>
                <th scope="col">Code</th>

                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/users/Equipment/edit/${item.id}`">{{ item.id }} </router-link>
                </td>
                <td data-label="Name">{{ item.title }}</td>
                <td data-label="Code">{{ item.code ?? '--' }}</td>

                <td data-label="Actions">
                  <!--                <DialogChangeStatusEquipmentType-->
                  <!--                  v-if="item.EquipmentTypeStatus === EquipmentTypeStatusEnum.Draft"-->
                  <!--                  :EquipmentTypeId="item.id"-->
                  <!--                  @EquipmentTypeChangeStatus="fetchEquipmentType"-->
                  <!--                />-->

                  <DropList
                    :actionList="actionList(item.id, deleteEquipment)"
                    @delete="deleteEquipment(item.id)"
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
        <DataEmpty
          :link="`/add/EquipmentType`"
          addText="Add EquipmentType"
          description="Sorry .. You have no EquipmentTypeuages .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No EquipmentTypeuages"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/add/EquipmentType`"
          addText="Add EquipmentType"
          description="Sorry .. You have no EquipmentTypeuage .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No EquipmentTypeuages"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no EquipmentTypeuage .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </permission-builder>
</template>

<style scoped></style>
