<script lang="ts" setup>
// import IndexSubscriptionApplicationParams from '@/features/setting/SubscriptionApplication/Core/params/indexSubscriptionApplicationParams'
// import IndexSubscriptionApplicationController from '@/features/setting/SubscriptionApplication/Presentation/controllers/indexSubscriptionApplicationController'

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
// import DeleteSubscriptionApplicationController from '@/features/setting/SubscriptionApplication/Presentation/controllers/deleteSubscriptionApplicationController'
// import DeleteSubscriptionApplicationParams from '@/features/setting/SubscriptionApplication/Core/params/deleteSubscriptionApplicationParams'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
// import ExportIcon from '@/shared/icons/ExportIcon.vue'
import ExportExcel from '@/shared/HelpersComponents/ExportExcel.vue'
import Search from '@/shared/icons/Search.vue'

import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import IndexSubscriptionApplicationController from '../controllers/indexSubscriptionApplicationController'
import IndexSubscriptionApplicationParams from '../../Core/params/indexSubscriptionApplicationParams'
import ApproveSubscriptionApplicationParams from '../../Core/params/ApproveSubscriptionApplicationParams'
import ApproveSubscriptionApplicationController from '../controllers/ApproveSubscriptionApplicationController'
import RejectSubscriptionApplicationController from '../controllers/RejectSubscriptionApplicationController'
import RejectSubscriptionApplicationParams from '../../Core/params/RejectSubscriptionApplicationParams'
import { SubscriptionStatusEnum } from '../../Core/Enum/SubscriptionStatusEnum'

const { t } = useI18n()

// import DialogChangeStatusSubscriptionApplication from "@/features/setting/SubscriptionApplications/Presentation/components/SubscriptionApplication/DialogChangeStatusSubscriptionApplication.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexSubscriptionApplicationController = IndexSubscriptionApplicationController.getInstance()
const state = ref(indexSubscriptionApplicationController.state.value)
const route = useRoute()
let id = route.params.id
// const type = ref<SubscriptionApplicationStatusEnum>(SubscriptionApplicationStatusEnum[route.params.type as keyof typeof SubscriptionApplicationStatusEnum])

const fetchSubscriptionApplication = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteSubscriptionApplicationParams = new IndexSubscriptionApplicationParams(query, pageNumber, perPage, withPage, id)
  await indexSubscriptionApplicationController.getData(deleteSubscriptionApplicationParams)
}

onMounted(() => {
  fetchSubscriptionApplication()
})

const searchSubscriptionApplication = debounce(() => {
  fetchSubscriptionApplication(word.value)
})

// const deleteSubscriptionApplication = async (id: number) => {
//   const deleteSubscriptionApplicationParams = new DeleteSubscriptionApplicationParams(id)
//   await DeleteSubscriptionApplicationController.getInstance().deleteSubscriptionApplication(deleteSubscriptionApplicationParams)
//   await fetchSubscriptionApplication()
// }

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchSubscriptionApplication('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchSubscriptionApplication('', currentPage.value, countPerPage.value)
}

watch(
  () => indexSubscriptionApplicationController.state.value,
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

const actionList = (id: number, deleteSubscriptionApplication: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/admin/subscription-application/${id}`,
    permission: [
      PermissionsEnum.SUBSCRIPTION_APPLICATION_ALL,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.SUBSCRIPTION_APPLICATION_UPDATE,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteSubscriptionApplication(id),
    permission: [
      PermissionsEnum.SUBSCRIPTION_APPLICATION_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.SUBSCRIPTION_APPLICATION_ALL,
    ],
  },
]

watch(
  () => route?.params?.id,
  (Newvalue) => {
    id = Newvalue
    fetchSubscriptionApplication()
  },
)
const router = useRouter()
const approveSubscriptionApplicationController = ApproveSubscriptionApplicationController.getInstance()
const approveSubscriptionApplication = async (id: number) => {
  const approveSubscriptionApplicationParams = new ApproveSubscriptionApplicationParams({ SubscriptionApplicationId: id })
  await approveSubscriptionApplicationController.approveSubscriptionApplication(approveSubscriptionApplicationParams, router)
  fetchSubscriptionApplication()

}

const rejectSubscriptionApplicationController = RejectSubscriptionApplicationController.getInstance()
const rejectSubscriptionApplication = async (id: number) => {
  const rejectSubscriptionApplicationParams = new RejectSubscriptionApplicationParams({ SubscriptionApplicationId: id })
  await rejectSubscriptionApplicationController.rejectSubscriptionApplication(rejectSubscriptionApplicationParams, router)
  fetchSubscriptionApplication()
}

const GetProjectStatus = (status: number) => {
  return SubscriptionStatusEnum[status]
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">

    <div class="input-search col-span-1">
      <span class="icon-remove" @click="((word = ''), searchSubscriptionApplication())">
        <Search />
      </span>
      <input v-model="word" :placeholder="'search'" class="input" type="text" @input="searchSubscriptionApplication" />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <!-- <ExportExcel :data="state.data" /> 
      <ExportPdf />
      <permission-builder :code="[
        PermissionsEnum.ADMIN,
        PermissionsEnum.ORGANIZATION_EMPLOYEE,
        PermissionsEnum.SUBSCRIPTION_APPLICATION_CREATE,
      ]">
        <router-link :to="`/admin/subscription-application/add`" class="btn btn-primary">
          {{ $t('Add_SubscriptionApplication') }}
        </router-link>
      </permission-builder> -->
    </div>
  </div>

  <permission-builder :code="[
    PermissionsEnum.ADMIN,
    PermissionsEnum.ORGANIZATION_EMPLOYEE,
    PermissionsEnum.SUBSCRIPTION_APPLICATION_ALL,
    PermissionsEnum.SUBSCRIPTION_APPLICATION_DELETE,
    PermissionsEnum.SUBSCRIPTION_APPLICATION_FETCH,
    PermissionsEnum.SUBSCRIPTION_APPLICATION_UPDATE,
    PermissionsEnum.SUBSCRIPTION_APPLICATION_CREATE,

  ]">
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive">
          <table class="main-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{{ $t('admin_name') }}</th>
                <th scope="col">{{ $t('organization_name') }}</th>
                <th scope="col">{{ $t('status_name') }}</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/admin/subscription-application/edit/${item.id}`">{{ index + 1 }}</router-link>
                </td>
                <td data-label="organization_name">{{ wordSlice(item?.admin_email) }}</td>
                <td data-label="organization_name">{{ wordSlice(item?.name) }}</td>
                <td class="status" :class="GetProjectStatus(item?.request_status)" data-label="status_name">{{
                  wordSlice(item?.status_name) }}</td>
                <td class="flex gap-2 " v-if="item?.request_status === SubscriptionStatusEnum.PENDING">
                  <button class="btn btn-primary" @click="approveSubscriptionApplication(item.id)">{{ $t('approved')
                  }}</button>
                  <button class="btn btn-secondary" @click="rejectSubscriptionApplication(item.id)">{{ $t('reject')
                  }}</button>
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
        <permission-builder :code="[
          PermissionsEnum.ADMIN,
          PermissionsEnum.ORGANIZATION_EMPLOYEE,
          PermissionsEnum.SUBSCRIPTION_APPLICATION_CREATE,
        ]">
          <DataEmpty :link="`/admin/subscription-application/add`" addText="Add SubscriptionApplication"
            description="Sorry .. You have no SubscriptionApplication .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No SubscriptionApplication" />
        </permission-builder>
      </template>
      <template #failed>
        <permission-builder :code="[
          PermissionsEnum.ADMIN,
          PermissionsEnum.ORGANIZATION_EMPLOYEE,
          PermissionsEnum.SUBSCRIPTION_APPLICATION_CREATE,
        ]">
          <DataFailed :link="`/admin/subscription-application/add`" addText="Add SubscriptionApplication"
            description="Sorry .. You have no SubscriptionApplication .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No SubscriptionApplication" />
        </permission-builder>
      </template>
    </DataStatus>

    <template #notPermitted>
      <permission-builder :code="[
        PermissionsEnum.ADMIN,
        PermissionsEnum.ORGANIZATION_EMPLOYEE,
        PermissionsEnum.SUBSCRIPTION_APPLICATION_CREATE,
      ]">
        <DataFailed addText="Have not  Permission"
          description="Sorry .. You have no SubscriptionApplication .. All your joined customers will appear here when you add your customer data" />
      </permission-builder>
    </template>
  </permission-builder>
</template>

<style scoped>
.status {

  &.PENDING {
    color: black;
  }

  &.APPROVED {
    color: #00ff00;
  }

  &.REJECTED {
    color: #ff0000;
  }

  /*
  &.IN_REVIEW {
    background-color: #0000ff;
  }

  &.MISSING_DATA {
    background-color: #0000ff;
  }

  &.EXPIRED {
    background-color: #0000ff;
  } */
}
</style>
