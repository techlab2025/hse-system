<script lang="ts" setup>
import IndexRootCausesParams from '@/features/setting/RootCauses/Core/params/indexRootCausesParams'
import IndexRootCausesController from '@/features/setting/RootCauses/Presentation/controllers/indexRootCausesController'

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
import DeleteRootCausesController from '@/features/setting/RootCauses/Presentation/controllers/deleteRootCausesController'
import DeleteRootCausesParams from '@/features/setting/RootCauses/Core/params/deleteRootCausesParams'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import ExportIcon from '@/shared/icons/ExportIcon.vue'
import ExportExcel from '@/shared/HelpersComponents/ExportExcel.vue'
import SaveIcon from '@/shared/icons/SaveIcon.vue'
import Search from '@/shared/icons/Search.vue'
import { setDefaultImage } from '@/base/Presentation/utils/set_default_image.ts'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import IndexTicketTypeController from '../controllers/indexTicketTypeController'
import IndexTicketTypeParams from '../../Core/params/indexTicketTypeParams'
import DeleteTicketTypeParams from '../../Core/params/deleteTicketTypeParams'
import DeleteTicketTypeController from '../controllers/deleteTicketTypeController'

const { t } = useI18n()

// import DialogChangeStatusRootCauses from "@/features/setting/RootCausess/Presentation/components/RootCauses/DialogChangeStatusRootCauses.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexTicketTypeController = IndexTicketTypeController.getInstance()
const state = ref(indexTicketTypeController.state.value)
const route = useRoute()

const id = ref(route.params.parent_id)

// const type = ref<RootCausesStatusEnum>(RootCausesStatusEnum[route.params.type as keyof typeof RootCausesStatusEnum])

const fetchTicketTypes = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteTicketTypeParams = new IndexTicketTypeParams(
    query,
    pageNumber,
    perPage,
    withPage,
    id.value ?? '',
  )
  await indexTicketTypeController.getData(deleteTicketTypeParams)
}

onMounted(() => {
  fetchTicketTypes()
})

const searchTicketTypes = debounce(() => {
  fetchTicketTypes(word.value)
})

const deleteTicketType = async (id: number) => {
  const deleteTicketTypeParams = new DeleteTicketTypeParams(id)
  await DeleteTicketTypeController.getInstance().deleteTicketType(deleteTicketTypeParams)
  await fetchTicketTypes()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchTicketTypes('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchTicketTypes('', currentPage.value, countPerPage.value)
}

watch(
  () => indexTicketTypeController.state.value,
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

const { user } = useUserStore()

const actionList = (id: number, deleteTicketType: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/${
      user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
    }/root-causes/${id}`,
    permission: [
      PermissionsEnum.TICKET_TYPE_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.TICKET_TYPE_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteTicketType(id),
    permission: [
      PermissionsEnum.TICKET_TYPE_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.TICKET_TYPE_ALL,
    ],
  },
]

watch(
  () => route?.params?.id,
  (Newvalue) => {
    // id = Newvalue
    fetchTicketTypes()
  },
)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click=";((word = ''), searchTicketTypes())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchTicketTypes"
      />
    </div>

    <div class="col-span-2 flex justify-end gap-2">
      <ExportPdf />
      <PermissionBuilder
        :code="[
          PermissionsEnum.ADMIN,
          PermissionsEnum.ORGANIZATION_EMPLOYEE,
          PermissionsEnum.TICKET_TYPE_CREATE,
        ]"
      >
        <router-link
          :to="`/${
            user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
          }/ticket-type/add`"
          class="btn btn-primary"
        >
          {{ $t('Add_TicketType') }}
        </router-link>
      </PermissionBuilder>
    </div>
  </div>

  <PermissionBuilder
    :code="[
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.TICKET_TYPE_ALL,
      PermissionsEnum.TICKET_TYPE_DELETE,
      PermissionsEnum.TICKET_TYPE_FETCH,
      PermissionsEnum.TICKET_TYPE_UPDATE,
      PermissionsEnum.TICKET_TYPE_CREATE,
      // PermissionsEnum.Ticket_Type,
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
                  <router-link :to="`/organization/ticket-type/${item.id}`"
                    >{{ index + 1 }}
                  </router-link>
                </td>
                <td data-label="Name">{{ wordSlice(item.title) }}</td>
                <td data-label="Actions">
                  <DropList
                    :actionList="actionList(item.id, deleteTicketType)"
                    @delete="deleteTicketType(item.id)"
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
        <PermissionBuilder
          :code="[
            PermissionsEnum.ADMIN,
            PermissionsEnum.ORGANIZATION_EMPLOYEE,
            PermissionsEnum.TICKET_TYPE_CREATE,
          ]"
        >
          <DataEmpty
            :link="`/${
              user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
            }/ticket-type/add`"
            addText="Add TicketType"
            description="Sorry .. You have no TicketTypes .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No TicketTypes"
          />
        </PermissionBuilder>
      </template>
      <template #failed>
        <PermissionBuilder
          :code="[
            PermissionsEnum.ADMIN,
            PermissionsEnum.ORGANIZATION_EMPLOYEE,
            PermissionsEnum.TICKET_TYPE_CREATE,
          ]"
        >
          <DataFailed
            :link="`/${
              user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
            }/ticket-type/add`"
            addText="Add TicketType"
            description="Sorry .. You have no TicketTypes .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No TicketTypes"
          />
        </PermissionBuilder>
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no RootCauses .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </PermissionBuilder>
</template>

<style scoped></style>
