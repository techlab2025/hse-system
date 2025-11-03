<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import wordSlice from '@/base/Presentation/utils/word_slice'

import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
// import IconRemoveInput from '@/shared/icons/IconRemoveInput.vue'
import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'

import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import ExportExcel from '@/shared/HelpersComponents/ExportExcel.vue'
import Search from '@/shared/icons/Search.vue'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import IndexMethodsController from '../controllers/indexMethodsController'
import IndexMethodsParams from '../../Core/params/indexMethodsParams'
import DeleteMethodsParams from '../../Core/params/deleteMethodsParams'
import DeleteMethodsController from '../controllers/deleteMethodsController'

const { t } = useI18n()

// import DialogChangeStatusMethods from "@/features/setting/Methods/Presentation/components/Methods/DialogChangeStatusMethods.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexMethodsController = IndexMethodsController.getInstance()
const state = ref(indexMethodsController.state.value)
const route = useRoute()
const id = route.params.parent_id
// const type = ref<MethodsStatusEnum>(MethodsStatusEnum[route.params.type as keyof typeof MethodsStatusEnum])

const fetchMethods = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteMethodsParams = new IndexMethodsParams(query, pageNumber, perPage, withPage, id)
  await indexMethodsController.getData(deleteMethodsParams)
}

onMounted(() => {
  fetchMethods()
})

const searchMethods = debounce(() => {
  fetchMethods(word.value)
})

const deleteMethods = async (id: number) => {
  const deleteMethodsParams = new DeleteMethodsParams(id)
  await DeleteMethodsController.getInstance().deleteMethods(deleteMethodsParams)
  await fetchMethods()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchMethods('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchMethods('', currentPage.value, countPerPage.value)
}

watch(
  () => indexMethodsController.state.value,
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

const actionList = (id: number, deleteMethods: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/methods/${id}`,
    permission: [
      PermissionsEnum.METHOD_UPDATE,
      PermissionsEnum.ORG_METHOD_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.METHOD_ALL,
      PermissionsEnum.ORG_METHOD_ALL,
    ],
  },
  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteMethods(id),
    permission: [
      PermissionsEnum.METHOD_DELETE,
      PermissionsEnum.ORG_METHOD_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.METHOD_ALL,
      PermissionsEnum.ORG_METHOD_ALL,
    ],
  },
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchMethods())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchMethods"
      />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel :data="state.data" />
      <ExportPdf />
      <PermissionBuilder
        :code="[
          PermissionsEnum.ADMIN,
          PermissionsEnum.ORGANIZATION_EMPLOYEE,
          PermissionsEnum.METHOD_CREATE,
          PermissionsEnum.ORG_METHOD_CREATE,
        ]"
      >
        <router-link
          :to="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/methods/add`"
          class="btn btn-primary"
        >
          {{ $t('Add_Methods') }}
        </router-link>
      </PermissionBuilder>
    </div>
  </div>

  <PermissionBuilder
    :code="[
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.METHOD_ALL,
      PermissionsEnum.METHOD_DELETE,
      PermissionsEnum.METHOD_FETCH,
      PermissionsEnum.METHOD_UPDATE,
      PermissionsEnum.METHOD_CREATE,

      PermissionsEnum.ORG_METHOD_ALL,
      PermissionsEnum.ORG_METHOD_DELETE,
      PermissionsEnum.ORG_METHOD_FETCH,
      PermissionsEnum.ORG_METHOD_UPDATE,
      PermissionsEnum.ORG_METHOD_CREATE,
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

                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link
                    :to="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/methods/${item.id}`"
                    >{{ index + 1 }}
                  </router-link>
                </td>
                <td data-label="Name">{{ wordSlice(item.title) }}</td>

                <td data-label="Actions">
                  <!--                <DialogChangeStatusMethods-->
                  <!--                  v-if="item.MethodsStatus === MethodsStatusEnum.Draft"-->
                  <!--                  :MethodsId="item.id"-->
                  <!--                  @MethodsChangeStatus="fetchMethods"-->
                  <!--                />-->

                  <DropList
                    :actionList="actionList(item.id, deleteMethods)"
                    @delete="deleteMethods(item.id)"
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
          :link="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/add/methods`"
          addText="Add Methods"
          description="Sorry .. You have no Methods .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Methods"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/add/methods`"
          addText="Add Methods"
          description="Sorry .. You have no Methods .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Methods"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no Methods .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </PermissionBuilder>
</template>

<style scoped></style>
