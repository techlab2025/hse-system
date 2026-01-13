<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
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
import IndexEmployeeCertificateController from '../controllers/indexEmployeeCertificateController'
import IndexEmployeeCertificateParams from '../../Core/params/IndexEmployeeCertificateParams'
import DeleteEmployeeCertificateParams from '../../Core/params/DeleteEmployeeCertificateParams'
import DeleteEmployeeCertificateController from '../controllers/deleteEmployeeCertificateController'

const { t } = useI18n()

// import DialogChangeStatusEmployeeCertificate from "@/features/setting/EmployeeCertificateuages/Presentation/components/EmployeeCertificate/DialogChangeStatusEmployeeCertificate.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexEmployeeCertificateController = IndexEmployeeCertificateController.getInstance()
const state = ref(indexEmployeeCertificateController.state.value)
const route = useRoute()

// const id = ref(route.params.parent_id)

// const type = ref<EmployeeCertificateStatusEnum>(EmployeeCertificateStatusEnum[route.params.type as keyof typeof EmployeeCertificateStatusEnum])

const fetchEmployeeCertificate = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteEmployeeCertificateParams = new IndexEmployeeCertificateParams(query, pageNumber, perPage, withPage)
  await indexEmployeeCertificateController.getData(deleteEmployeeCertificateParams)
}

onMounted(() => {
  fetchEmployeeCertificate()
})

const searchEmployeeCertificate = debounce(() => {
  fetchEmployeeCertificate(word.value)
})

const deleteEmployeeCertificate = async (id: number) => {
  const deleteEmployeeCertificateParams = new DeleteEmployeeCertificateParams(id)
  await DeleteEmployeeCertificateController.getInstance().deleteEmployeeCertificate(deleteEmployeeCertificateParams)
  await fetchEmployeeCertificate()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchEmployeeCertificate('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchEmployeeCertificate('', currentPage.value, countPerPage.value)
}

watch(
  () => indexEmployeeCertificateController.state.value,
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

const actionList = (id: number, deleteEmployeeCertificate: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/organization/EmployeeCertificate/${id}`,
    permission: [
      PermissionsEnum.EmployeeCertificate_UPDATE,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.EmployeeCertificate_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteEmployeeCertificate(id),
    permission: [
      PermissionsEnum.EmployeeCertificate_DELETE,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.EmployeeCertificate_ALL,
    ],
  },
]

watch(
  () => route?.params?.id,
  (Newvalue) => {
    // id = Newvalue
    fetchEmployeeCertificate()
  },
)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchEmployeeCertificate())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchEmployeeCertificate"
      />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel :data="state.data" />
      <ExportPdf />
      <PermissionBuilder
        :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.EmployeeCertificate_CREATE]"
      >
        <router-link to="/organization/EmployeeCertificate/add" class="btn btn-primary">
          {{ $t('Add_EmployeeCertificate') }}
        </router-link>
      </PermissionBuilder>
    </div>
  </div>

  <PermissionBuilder
    :code="[
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.EmployeeCertificate_ALL,
      PermissionsEnum.EmployeeCertificate_DELETE,
      PermissionsEnum.EmployeeCertificate_FETCH,
      PermissionsEnum.EmployeeCertificate_UPDATE,
      PermissionsEnum.EmployeeCertificate_CREATE,
    ]"
  >
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive">
          <table class="main-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{{ $t('title') }}</th>

                <!-- <th scope="col">{{ $t('phone') }}</th> -->
                <!-- <th scope="col">{{ $t('status') }}</th> -->

                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/organization/EmployeeCertificate/${item.id}`"
                    >{{ index + 1 }}
                  </router-link>
                </td>
                <td data-label="Name">{{ wordSlice(item.title) }}</td>

                <!-- <td data-label="phone">
                  {{ item.phone }}
                </td> -->

                <td data-label="Actions">
                  <!--                <DialogChangeStatusEmployeeCertificate-->
                  <!--                  v-if="item.EmployeeCertificateStatus === EmployeeCertificateStatusEnum.Draft"-->
                  <!--                  :EmployeeCertificateId="item.id"-->
                  <!--                  @EmployeeCertificateChangeStatus="fetchEmployeeCertificate"-->
                  <!--                />-->

                  <DropList
                    :actionList="actionList(item.id, deleteEmployeeCertificate)"
                    @delete="deleteEmployeeCertificate(item.id)"
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
          :link="`/organization/EmployeeCertificate/add`"
          addText="Add EmployeeCertificate"
          description="Sorry .. You have no EmployeeCertificate .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No EmployeeCertificate"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/organization/EmployeeCertificate/add`"
          addText="Add EmployeeCertificate"
          description="Sorry .. You have no EmployeeCertificate .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No EmployeeCertificate"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no EmployeeCertificate .. All your joined customers will appear here when you add your customer data"
        link=""
      />
    </template>
  </PermissionBuilder>
</template>

<style scoped></style>
