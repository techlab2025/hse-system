<script lang="ts" setup>
// import IndexSubscriptionTypeTypeParams from '@/features/setting/SubscriptionTypeType/Core/params/indexSubscriptionTypeTypeParams'
// import IndexSubscriptionTypeTypeController from '@/features/setting/SubscriptionTypeType/Presentation/controllers/indexSubscriptionTypeTypeController'

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
// import DeleteSubscriptionTypeTypeController from '@/features/setting/SubscriptionTypeType/Presentation/controllers/deleteSubscriptionTypeTypeController'
// import DeleteSubscriptionTypeTypeParams from '@/features/setting/SubscriptionTypeType/Core/params/deleteSubscriptionTypeTypeParams'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
// import ExportIcon from '@/shared/icons/ExportIcon.vue'
import ExportExcel from '@/shared/HelpersComponents/ExportExcel.vue'
import Search from '@/shared/icons/Search.vue'
import IndexSubscriptionTypeController from '../controllers/indexSubscriptionTypeController'
import IndexSubscriptionTypeParams from '../../Core/params/indexSubscriptionTypeParams'
import DeleteSubscriptionTypeParams from '../../Core/params/deleteSubscriptionTypeParams'
import DeleteSubscriptionTypeController from '../controllers/deleteSubscriptionTypeController'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'

const { t } = useI18n()

// import DialogChangeStatusSubscriptionTypeType from "@/features/setting/SubscriptionTypeTypes/Presentation/components/SubscriptionTypeType/DialogChangeStatusSubscriptionTypeType.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexSubscriptionTypeController = IndexSubscriptionTypeController.getInstance()
const state = ref(indexSubscriptionTypeController.state.value)
const route = useRoute()
let id = route.params.id
// const type = ref<SubscriptionTypeTypeStatusEnum>(SubscriptionTypeTypeStatusEnum[route.params.type as keyof typeof SubscriptionTypeTypeStatusEnum])

const fetchSubscriptionType = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteSubscriptionTypeTypeParams = new IndexSubscriptionTypeParams(query, pageNumber, perPage, withPage, id)
  await indexSubscriptionTypeController.getData(deleteSubscriptionTypeTypeParams)
}

onMounted(() => {
  fetchSubscriptionType()
})

const searchSubscriptionTypeType = debounce(() => {
  fetchSubscriptionType(word.value)
})

const deleteSubscriptionType = async (id: number) => {
  const deleteSubscriptionTypeParams = new DeleteSubscriptionTypeParams(id)
  await DeleteSubscriptionTypeController.getInstance().deleteSubscriptionType(deleteSubscriptionTypeParams)
  await fetchSubscriptionType()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchSubscriptionType('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchSubscriptionType('', currentPage.value, countPerPage.value)
}

watch(
  () => indexSubscriptionTypeController.state.value,
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

const actionList = (id: number, deleteSubscriptionType: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/admin/subscription-type/${id}`,
    permission: [
      PermissionsEnum.SUBSCRIPTION_TYPE_ALL,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.SUBSCRIPTION_TYPE_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteSubscriptionType(id),
    permission: [
      PermissionsEnum.SUBSCRIPTION_TYPE_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.SUBSCRIPTION_TYPE_ALL,
    ],
  },
]

watch(
  () => route?.params?.id,
  (Newvalue) => {
    id = Newvalue
    fetchSubscriptionType()
  },
)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">

    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchSubscriptionTypeType())">
        <Search />
      </span>
      <input v-model="word" :placeholder="'search'" class="input" type="text" @input="searchSubscriptionTypeType" />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <!-- <ExportExcel :data="state.data" /> -->
      <ExportPdf />
      <permission-builder :code="[
        PermissionsEnum.ADMIN,
        PermissionsEnum.ORGANIZATION_EMPLOYEE,
        PermissionsEnum.SUBSCRIPTION_TYPE_CREATE,
      ]">
        <router-link :to="`/admin/subscription-type/add`" class="btn btn-primary">
          {{ $t('Add_subscription_type') }}
        </router-link>
      </permission-builder>
    </div>
  </div>

  <permission-builder :code="[
    PermissionsEnum.ADMIN,
    PermissionsEnum.ORGANIZATION_EMPLOYEE,
    PermissionsEnum.SUBSCRIPTION_TYPE_ALL,
    PermissionsEnum.SUBSCRIPTION_TYPE_DELETE,
    PermissionsEnum.SUBSCRIPTION_TYPE_FETCH,
    PermissionsEnum.SUBSCRIPTION_TYPE_UPDATE,
    PermissionsEnum.SUBSCRIPTION_TYPE_CREATE,

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
                  <router-link :to="`/admin/subscription-type/edit/${item.id}`">{{ index + 1 }}</router-link>
                </td>
                <td data-label="Name">{{ wordSlice(item.title) }}</td>
                <td data-label="Actions">
                  <DropList :actionList="actionList(item.id, deleteSubscriptionType)"
                    @delete="deleteSubscriptionType(item.id)" />
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
          PermissionsEnum.SUBSCRIPTION_TYPE_CREATE,
        ]">
          <DataEmpty :link="`/admin/subscription-type/add`" addText="Add SubscriptionType"
            description="Sorry .. You have no SubscriptionType .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No SubscriptionType" />
        </permission-builder>
      </template>
      <template #failed>
        <permission-builder :code="[
          PermissionsEnum.ADMIN,
          PermissionsEnum.ORGANIZATION_EMPLOYEE,
          PermissionsEnum.SUBSCRIPTION_TYPE_CREATE,
        ]">
          <DataFailed :link="`/admin/subscription-type/add`" addText="Add SubscriptionType"
            description="Sorry .. You have no SubscriptionType .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No SubscriptionType" />
        </permission-builder>
      </template>
    </DataStatus>

    <template #notPermitted>
      <permission-builder :code="[
        PermissionsEnum.ADMIN,
        PermissionsEnum.ORGANIZATION_EMPLOYEE,
        PermissionsEnum.SUBSCRIPTION_TYPE_CREATE,
      ]">
        <DataFailed addText="Have not  Permission"
          description="Sorry .. You have no SubscriptionTypeType .. All your joined customers will appear here when you add your customer data" />
      </permission-builder>
    </template>
  </permission-builder>
</template>

<style scoped></style>
