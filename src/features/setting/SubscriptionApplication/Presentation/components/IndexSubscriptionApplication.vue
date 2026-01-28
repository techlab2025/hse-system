<script lang="ts" setup>
// import IndexSubscriptionParams from '@/features/setting/Subscription/Core/params/indexSubscriptionParams'
// import IndexSubscriptionController from '@/features/setting/Subscription/Presentation/controllers/indexSubscriptionController'

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
// import DeleteSubscriptionController from '@/features/setting/Subscription/Presentation/controllers/deleteSubscriptionController'
// import DeleteSubscriptionParams from '@/features/setting/Subscription/Core/params/deleteSubscriptionParams'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
// import ExportIcon from '@/shared/icons/ExportIcon.vue'
import ExportExcel from '@/shared/HelpersComponents/ExportExcel.vue'
import Search from '@/shared/icons/Search.vue'
import IndexSubscriptionController from '../controllers/indexSubscriptionController'
import IndexSubscriptionParams from '../../Core/params/indexSubscriptionApplicationParams'
import DeleteSubscriptionParams from '../../Core/params/deleteSubscriptionApplicationParams'
import DeleteSubscriptionController from '../controllers/deleteSubscriptionController'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'

const { t } = useI18n()

// import DialogChangeStatusSubscription from "@/features/setting/Subscriptions/Presentation/components/Subscription/DialogChangeStatusSubscription.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexSubscriptionController = IndexSubscriptionController.getInstance()
const state = ref(indexSubscriptionController.state.value)
const route = useRoute()
let id = route.params.id
// const type = ref<SubscriptionStatusEnum>(SubscriptionStatusEnum[route.params.type as keyof typeof SubscriptionStatusEnum])

const fetchSubscription = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteSubscriptionParams = new IndexSubscriptionParams(query, pageNumber, perPage, withPage, id)
  await indexSubscriptionController.getData(deleteSubscriptionParams)
}

onMounted(() => {
  fetchSubscription()
})

const searchSubscription = debounce(() => {
  fetchSubscription(word.value)
})

const deleteSubscription = async (id: number) => {
  const deleteSubscriptionParams = new DeleteSubscriptionParams(id)
  await DeleteSubscriptionController.getInstance().deleteSubscription(deleteSubscriptionParams)
  await fetchSubscription()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchSubscription('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchSubscription('', currentPage.value, countPerPage.value)
}

watch(
  () => indexSubscriptionController.state.value,
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

const actionList = (id: number, deleteSubscription: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/admin/subscription/${id}`,
    permission: [
      PermissionsEnum.SUBSCRIPTION_ALL,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.SUBSCRIPTION_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteSubscription(id),
    permission: [
      PermissionsEnum.SUBSCRIPTION_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.SUBSCRIPTION_ALL,
    ],
  },
]

watch(
  () => route?.params?.id,
  (Newvalue) => {
    id = Newvalue
    fetchSubscription()
  },
)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">

    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchSubscription())">
        <Search />
      </span>
      <input v-model="word" :placeholder="'search'" class="input" type="text" @input="searchSubscription" />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel :data="state.data" />
      <ExportPdf />
      <permission-builder :code="[
        PermissionsEnum.ADMIN,
        PermissionsEnum.ORGANIZATION_EMPLOYEE,
        PermissionsEnum.SUBSCRIPTION_CREATE,
      ]">
        <router-link :to="`/admin/subscription/add`" class="btn btn-primary">
          {{ $t('Add_subscription') }}
        </router-link>
      </permission-builder>
    </div>
  </div>

  <permission-builder :code="[
    PermissionsEnum.ADMIN,
    PermissionsEnum.ORGANIZATION_EMPLOYEE,
    PermissionsEnum.SUBSCRIPTION_ALL,
    PermissionsEnum.SUBSCRIPTION_DELETE,
    PermissionsEnum.SUBSCRIPTION_FETCH,
    PermissionsEnum.SUBSCRIPTION_UPDATE,
    PermissionsEnum.SUBSCRIPTION_CREATE,

  ]">
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive">
          <table class="main-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{{ $t('organization_name') }}</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/admin/subscription-type/edit/${item.id}`">{{ index + 1 }}</router-link>
                </td>
                <td data-label="organization_name">{{ wordSlice(item?.organization?.name) }}</td>
                <td data-label="Actions">
                  <DropList :actionList="actionList(item.id, deleteSubscription)"
                    @delete="deleteSubscription(item.id)" />
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
          PermissionsEnum.SUBSCRIPTION_CREATE,
        ]">
          <DataEmpty :link="`/admin/subscription/add`" addText="Add Subscription"
            description="Sorry .. You have no Subscription .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No Subscription" />
        </permission-builder>
      </template>
      <template #failed>
        <permission-builder :code="[
          PermissionsEnum.ADMIN,
          PermissionsEnum.ORGANIZATION_EMPLOYEE,
          PermissionsEnum.SUBSCRIPTION_CREATE,
        ]">
          <DataFailed :link="`/admin/subscription/add`" addText="Add Subscription"
            description="Sorry .. You have no Subscription .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No Subscription" />
        </permission-builder>
      </template>
    </DataStatus>

    <template #notPermitted>
      <permission-builder :code="[
        PermissionsEnum.ADMIN,
        PermissionsEnum.ORGANIZATION_EMPLOYEE,
        PermissionsEnum.SUBSCRIPTION_CREATE,
      ]">
        <DataFailed addText="Have not  Permission"
          description="Sorry .. You have no Subscription .. All your joined customers will appear here when you add your customer data" />
      </permission-builder>
    </template>
  </permission-builder>
</template>

<style scoped></style>
