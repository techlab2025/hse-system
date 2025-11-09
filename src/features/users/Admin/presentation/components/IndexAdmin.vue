<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
// import IconRemoveInput from '@/shared/icons/IconRemoveInput.vue'
import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'
import wordSlice from '@/base/Presentation/utils/word_slice'

import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import ExportExcel from '@/shared/HelpersComponents/ExportExcel.vue'
import Search from '@/shared/icons/Search.vue'
import IndexAdminController from '../controllers/index_admin_controller'
import IndexAdminsParams from '../../Core/Params/index_admin_params'
import DeleteAdminParams from '../../Core/Params/delete_admin_params'
import DeleteAdminController from '../controllers/delete_admin_controller'

const { t } = useI18n()

// import DialogChangeStatusAdmin from "@/features/setting/Adminuages/Presentation/components/Admin/DialogChangeStatusAdmin.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexAdminController = IndexAdminController.getInstance()
const state = ref(indexAdminController.state.value)
const route = useRoute()

// const id = ref(route.params.parent_id)

// const type = ref<AdminStatusEnum>(AdminStatusEnum[route.params.type as keyof typeof AdminStatusEnum])

const fetchAdmin = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteAdminParams = new IndexAdminsParams(
    query,
    pageNumber,
    perPage,
    withPage,
    // id.value?? '',
  )
  await indexAdminController.getData(deleteAdminParams)
}

onMounted(() => {
  fetchAdmin()
}) 

const searchAdmin = debounce(() => {
  fetchAdmin(word.value)
})

const deleteAdmin = async (id: number) => {
  const deleteAdminParams = new DeleteAdminParams(id)
  await DeleteAdminController.getInstance().deleteAdmin(deleteAdminParams)
  await fetchAdmin()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchAdmin('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchAdmin('', currentPage.value, countPerPage.value)
}

watch(
  () => indexAdminController.state.value,
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

const actionList = (id: number, deleteAdmin: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/admin/admins/${id}`,
    permission: [PermissionsEnum.ADMIN_UPDATE, PermissionsEnum.ADMIN, PermissionsEnum.ADMIN_ALL],
  },
  {
    text: t('add_permission'),
    icon: IconEdit,
    link: `/admin/permission/${id}`,
    permission: [PermissionsEnum.CREATE_PERMISSION, PermissionsEnum.ADMIN],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteAdmin(id),
    permission: [PermissionsEnum.ADMIN_DELETE, PermissionsEnum.ADMIN, PermissionsEnum.ADMIN_ALL],
  },
]

watch(
  () => route?.params?.id,
  (Newvalue) => {
    // id = Newvalue
    fetchAdmin()
  },
)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchAdmin())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchAdmin"
      />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel :data="state.data" />
      <ExportPdf />
      <permission-builder :code="[PermissionsEnum.ADMIN, PermissionsEnum.ADMIN_CREATE]">
        <router-link to="/admin/admins/add" class="btn btn-primary">
          {{ $t('Add_Admin') }}
        </router-link>
      </permission-builder>
    </div>
  </div>

  <permission-builder
    :code="[
      PermissionsEnum.ADMIN,
      PermissionsEnum.ADMIN_ALL,
      PermissionsEnum.ADMIN_DELETE,
      PermissionsEnum.ADMIN_FETCH,
      PermissionsEnum.ADMIN_UPDATE,
      PermissionsEnum.ADMIN_CREATE,
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

                <th scope="col">{{ $t('email') }}</th>
                <th scope="col">{{ $t('phone') }}</th>

                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/admin/admins/${item.id}`">{{ index + 1 }} </router-link>
                </td>
                <td data-label="Name">{{ wordSlice(item.name) }}</td>

                <td data-label="email">
                  {{ item?.email }}
                </td>

                <td data-label="phone">
                  {{ item?.phone }}
                </td>

                <td data-label="Actions">
                  <!--                <DialogChangeStatusAdmin-->
                  <!--                  v-if="item.AdminStatus === AdminStatusEnum.Draft"-->
                  <!--                  :AdminId="item.id"-->
                  <!--                  @AdminChangeStatus="fetchAdmin"-->
                  <!--                />-->

                  <DropList
                    :actionList="actionList(item.id, deleteAdmin)"
                    @delete="deleteAdmin(item.id)"
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
          :link="`/admin/admins/add`"
          addText="Add Admin"
          description="Sorry .. You have no Admin .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Admin"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/admin/admins/add`"
          addText="Add Admin"
          description="Sorry .. You have no Admin .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Admin"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no Admin .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </permission-builder>
</template>

<style scoped></style>
