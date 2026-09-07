<script lang="ts" setup>
// import IndexSubscriptionApplicationParams from '@/features/setting/SubscriptionApplication/Core/params/indexSubscriptionApplicationParams'
// import IndexSubscriptionApplicationController from '@/features/setting/SubscriptionApplication/Presentation/controllers/indexSubscriptionApplicationController'

import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import wordSlice from '@/base/Presentation/utils/word_slice'

import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
// import IconRemoveInput from '@/shared/icons/IconRemoveInput.vue'
// import DeleteSubscriptionApplicationController from '@/features/setting/SubscriptionApplication/Presentation/controllers/deleteSubscriptionApplicationController'
// import DeleteSubscriptionApplicationParams from '@/features/setting/SubscriptionApplication/Core/params/deleteSubscriptionApplicationParams'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import { useRouter } from 'vue-router'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
// import ExportIcon from '@/shared/icons/ExportIcon.vue'
import Search from '@/shared/icons/Search.vue'

import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import IndexSubscriptionApplicationController from '../controllers/indexSubscriptionApplicationController'
import IndexSubscriptionApplicationParams from '../../Core/params/indexSubscriptionApplicationParams'
import ApproveSubscriptionApplicationParams from '../../Core/params/ApproveSubscriptionApplicationParams'
import ApproveSubscriptionApplicationController from '../controllers/ApproveSubscriptionApplicationController'
import RejectSubscriptionApplicationController from '../controllers/RejectSubscriptionApplicationController'
import RejectSubscriptionApplicationParams from '../../Core/params/RejectSubscriptionApplicationParams'
import { SubscriptionStatusEnum } from '../../Core/Enum/SubscriptionStatusEnum'

// import DialogChangeStatusSubscriptionApplication from "@/features/setting/SubscriptionApplications/Presentation/components/SubscriptionApplication/DialogChangeStatusSubscriptionApplication.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexSubscriptionApplicationController = IndexSubscriptionApplicationController.getInstance()
const state = ref(indexSubscriptionApplicationController.state.value)
// const type = ref<SubscriptionApplicationStatusEnum>(SubscriptionApplicationStatusEnum[route.params.type as keyof typeof SubscriptionApplicationStatusEnum])

const fetchSubscriptionApplication = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteSubscriptionApplicationParams = new IndexSubscriptionApplicationParams(
    query,
    pageNumber,
    perPage,
    withPage,
  )
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

const router = useRouter()
const approveSubscriptionApplicationController =
  ApproveSubscriptionApplicationController.getInstance()
const approveSubscriptionApplication = async (id: number) => {
  const approveSubscriptionApplicationParams = new ApproveSubscriptionApplicationParams({
    SubscriptionApplicationId: id,
  })
  await approveSubscriptionApplicationController.approveSubscriptionApplication(
    approveSubscriptionApplicationParams,
    router,
  )
  fetchSubscriptionApplication()
}

const rejectSubscriptionApplicationController =
  RejectSubscriptionApplicationController.getInstance()
const rejectSubscriptionApplication = async (id: number) => {
  const rejectSubscriptionApplicationParams = new RejectSubscriptionApplicationParams({
    SubscriptionApplicationId: id,
  })
  await rejectSubscriptionApplicationController.rejectSubscriptionApplication(
    rejectSubscriptionApplicationParams,
    router,
  )
  fetchSubscriptionApplication()
}

const GetProjectStatus = (status: number) => {
  return SubscriptionStatusEnum[status]
}

const displayValue = (value: unknown) => {
  if (value === null || value === undefined || value === '') return '—'

  return wordSlice(String(value))
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <span class="icon-remove" @click="((word = ''), searchSubscriptionApplication())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchSubscriptionApplication"
      />
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

  <permission-builder
    :code="[
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.SUBSCRIPTION_APPLICATION_ALL,
      PermissionsEnum.SUBSCRIPTION_APPLICATION_DELETE,
      PermissionsEnum.SUBSCRIPTION_APPLICATION_FETCH,
      PermissionsEnum.SUBSCRIPTION_APPLICATION_UPDATE,
      PermissionsEnum.SUBSCRIPTION_APPLICATION_CREATE,
    ]"
  >
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive">
          <table class="main-table">
            <thead>
              <tr>
                <th scope="col">{{ $t('id') }}</th>
                <!-- <th scope="col">{{ $t('subscription_application_id') }}</th> -->
                <th scope="col">{{ $t('request_date') }}</th>
                <th scope="col">{{ $t('request_status') }}</th>
                <th scope="col">{{ $t('organization_name') }}</th>
                <th scope="col">{{ $t('phone') }}</th>
                <th scope="col">{{ $t('email') }}</th>
                <th scope="col">{{ $t('address') }}</th>
                <th scope="col">{{ $t('admin_name') }}</th>
                <th scope="col">{{ $t('admin_phone') }}</th>
                <th scope="col">{{ $t('admin_email') }}</th>
                <th scope="col">{{ $t('industry') }}</th>
                <th scope="col">{{ $t('status_name') }}</th>
                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in state.data" :key="item.id">
                <td :data-label="$t('id')">{{ displayValue(item?.id) }}</td>
                <!-- <td :data-label="$t('subscription_application_id')">
                  {{ displayValue(item?.subscription_application_id) }}
                </td> -->
                <td :data-label="$t('request_date')">{{ displayValue(item?.request_date) }}</td>
                <td :data-label="$t('request_status')">
                  {{ displayValue(item?.request_status) }}
                </td>
                <td :data-label="$t('organization_name')">{{ displayValue(item?.name) }}</td>
                <td :data-label="$t('phone')">{{ displayValue(item?.phone) }}</td>
                <td :data-label="$t('email')">{{ displayValue(item?.email) }}</td>
                <td :data-label="$t('address')">{{ displayValue(item?.address) }}</td>
                <td :data-label="$t('admin_name')">{{ displayValue(item?.admin_name) }}</td>
                <td :data-label="$t('admin_phone')">{{ displayValue(item?.admin_phone) }}</td>
                <td :data-label="$t('admin_email')">{{ displayValue(item?.admin_email) }}</td>
                <td :data-label="$t('industry')">
                  {{ displayValue(item?.industry?.title ?? item?.industry?.titile) }}
                </td>
                <td
                  class="status"
                  :class="GetProjectStatus(item?.request_status)"
                  :data-label="$t('status_name')"
                >
                  {{ displayValue(item?.status_name) }}
                </td>
                <td :data-label="$t('actions')">
                  <div
                    v-if="item?.request_status === SubscriptionStatusEnum.PENDING"
                    class="flex gap-2"
                  >
                    <button
                      class="btn btn-primary"
                      @click="approveSubscriptionApplication(item.id)"
                    >
                      {{ $t('approved') }}
                    </button>
                    <button
                      class="btn btn-secondary"
                      @click="rejectSubscriptionApplication(item.id)"
                    >
                      {{ $t('reject') }}
                    </button>
                  </div>
                  <span v-else>—</span>
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
        <TableLoader :cols="14" :rows="10" />
      </template>
      <template #initial>
        <TableLoader :cols="14" :rows="10" />
      </template>
      <template #empty>
        <permission-builder
          :code="[
            PermissionsEnum.ADMIN,
            PermissionsEnum.ORGANIZATION_EMPLOYEE,
            PermissionsEnum.SUBSCRIPTION_APPLICATION_CREATE,
          ]"
        >
          <DataEmpty
            :link="`/admin/subscription-application/add`"
            addText="Add SubscriptionApplication"
            description="Sorry .. You have no SubscriptionApplication .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No SubscriptionApplication"
          />
        </permission-builder>
      </template>
      <template #failed>
        <permission-builder
          :code="[
            PermissionsEnum.ADMIN,
            PermissionsEnum.ORGANIZATION_EMPLOYEE,
            PermissionsEnum.SUBSCRIPTION_APPLICATION_CREATE,
          ]"
        >
          <DataFailed
            :link="`/admin/subscription-application/add`"
            addText="Add SubscriptionApplication"
            description="Sorry .. You have no SubscriptionApplication .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No SubscriptionApplication"
          />
        </permission-builder>
      </template>
    </DataStatus>

    <template #notPermitted>
      <permission-builder
        :code="[
          PermissionsEnum.ADMIN,
          PermissionsEnum.ORGANIZATION_EMPLOYEE,
          PermissionsEnum.SUBSCRIPTION_APPLICATION_CREATE,
        ]"
      >
        <DataFailed
          addText="Have not  Permission"
          description="Sorry .. You have no SubscriptionApplication .. All your joined customers will appear here when you add your customer data"
        />
      </permission-builder>
    </template>
  </permission-builder>
</template>

<style scoped>
.status {
  &.PENDING {
    color: var(--text-strong);
  }

  &.APPROVED {
    color: var(--status-success);
  }

  &.REJECTED {
    color: var(--status-danger);
  }

  /*
  &.IN_REVIEW {
    background-color: var(--brand-primary-500);
  }

  &.MISSING_DATA {
    background-color: var(--brand-primary-500);
  }

  &.EXPIRED {
    background-color: var(--brand-primary-500);
  } */
}
</style>
