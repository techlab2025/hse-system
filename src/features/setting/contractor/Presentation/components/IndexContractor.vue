<script lang="ts" setup>
// import IndexContractorTypeParams from '@/features/setting/ContractorType/Core/params/indexContractorTypeParams'
// import IndexContractorTypeController from '@/features/setting/ContractorType/Presentation/controllers/indexContractorTypeController'

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
// import DeleteContractorTypeController from '@/features/setting/ContractorType/Presentation/controllers/deleteContractorTypeController'
// import DeleteContractorTypeParams from '@/features/setting/ContractorType/Core/params/deleteContractorTypeParams'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
// import ExportIcon from '@/shared/icons/ExportIcon.vue'
import ExportExcel from '@/shared/HelpersComponents/ExportExcel.vue'
import Search from '@/shared/icons/Search.vue'
import IndexContractorController from '../controllers/indexContractorController'
import IndexContractorParams from '../../Core/params/indexContractorParams'
import DeleteContractorParams from '../../Core/params/deleteContractorParams'
import DeleteContractorController from '../controllers/deleteContractorController'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'

const { t } = useI18n()

// import DialogChangeStatusContractorType from "@/features/setting/ContractorTypes/Presentation/components/ContractorType/DialogChangeStatusContractorType.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexContractorController = IndexContractorController.getInstance()
const state = ref(indexContractorController.state.value)
const route = useRoute()
let id = route.params.id
// const type = ref<ContractorTypeStatusEnum>(ContractorTypeStatusEnum[route.params.type as keyof typeof ContractorTypeStatusEnum])

const fetchContractor = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteContractorTypeParams = new IndexContractorParams(
    query,
    pageNumber,
    perPage,
    withPage,
    id,
  )
  await indexContractorController.getData(deleteContractorTypeParams)
}

onMounted(() => {
  fetchContractor()
})

const searchContractorType = debounce(() => {
  fetchContractor(word.value)
})

const deleteContractor = async (id: number) => {
  const deleteContractorParams = new DeleteContractorParams(id)
  await DeleteContractorController.getInstance().deleteContractor(deleteContractorParams)
  await fetchContractor()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchContractor('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchContractor('', currentPage.value, countPerPage.value)
}

watch(
  () => indexContractorController.state.value,
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

const actionList = (id: number, deleteContractor: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/contractor/${id}`,
    permission: [
      PermissionsEnum.CONTRACTOR_UPDATE,
      PermissionsEnum.CONTRACTOR_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.CONTRACTOR_All,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteContractor(id),
    permission: [
      PermissionsEnum.CONTRACTOR_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.CONTRACTOR_All,
    ],
  },
]

watch(
  () => route?.params?.id,
  (Newvalue) => {
    id = Newvalue
    fetchContractor()
  },
)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchContractorType())">
        <Search />
      </span>
      <input v-model="word" :placeholder="'search'" class="input" type="text" @input="searchContractorType" />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel :data="state.data" />
      <ExportPdf />
      <permission-builder :code="[
        PermissionsEnum.ADMIN,
        PermissionsEnum.ORGANIZATION_EMPLOYEE,
        PermissionsEnum.CONTRACTOR_CREATE,
        PermissionsEnum.CONTRACTOR_CREATE,
      ]">
        <router-link :to="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/contractor/add`"
          class="btn btn-primary">
          {{ $t('Add_Contractor') }}
        </router-link>
      </permission-builder>
    </div>
  </div>

  <permission-builder :code="[
    PermissionsEnum.ADMIN,
    PermissionsEnum.ORGANIZATION_EMPLOYEE,
    PermissionsEnum.CONTRACTOR_All,
    PermissionsEnum.CONTRACTOR_DELETE,
    PermissionsEnum.CONTRACTOR_FETCH,
    PermissionsEnum.CONTRACTOR_UPDATE,
    PermissionsEnum.CONTRACTOR_CREATE,
  ]">
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive">
          <table class="main-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{{ $t('title') }}</th>

                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link
                    :to="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/contractor/edit/${item.id}`">{{
                    index + 1 }}
                  </router-link>
                </td>
                <td data-label="Name">{{ wordSlice(item?.title) }}</td>

                <td data-label="Actions">
                  <!--                <DialogChangeStatusContractorType-->
                  <!--                  v-if="item.ContractorTypeStatus === ContractorTypeStatusEnum.Draft"-->
                  <!--                  :ContractorTypeId="item.id"-->
                  <!--                  @ContractorTypeChangeStatus="fetchContractorType"-->
                  <!--                />-->

                  <DropList :actionList="actionList(item.id, deleteContractor)" @delete="deleteContractor(item.id)" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination :pagination="state.pagination" @changePage="handleChangePage" @countPerPage="handleCountPerPage" />
      </template>
      <template #loader>
        <TableLoader :cols="3" :rows="10" />
      </template>
      <template #initial>
        <TableLoader :cols="3" :rows="10" />
      </template>
      <template #empty>
        <DataEmpty :link="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/contractor/add`"
          addText="Add ContractorType"
          description="Sorry .. You have no ContractorTypes .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No ContractorTypes" />
      </template>
      <template #failed>
        <DataFailed :link="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/contractor/add`"
          addText="Add ContractorType"
          description="Sorry .. You have no ContractorType .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No ContractorTypes" />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed addText="Have not  Permission"
        description="Sorry .. You have no ContractorType .. All your joined customers will appear here when you add your customer data" />
    </template>
  </permission-builder>
</template>

<style scoped></style>
