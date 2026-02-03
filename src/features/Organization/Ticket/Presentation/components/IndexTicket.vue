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
import IndexTicketController from '../controllers/indexTicketController'
import IndexTicketParams from '../../Core/params/indexTicketParams'
import DeleteTicketController from '../controllers/deleteTicketController'
import DeleteTicketParams from '../../Core/params/deleteTicketParams'
import { StatusEnum } from '../../Core/Enums/statusEnum'
import MultiImagesDialog from '@/shared/HelpersComponents/dialog/MultiImagesDialog.vue'
import CloseTicketDialog from './Dialog/CloseTicketDialog.vue'

const { t } = useI18n()

// import DialogChangeStatusRootCauses from "@/features/setting/RootCausess/Presentation/components/RootCauses/DialogChangeStatusRootCauses.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexTicketController = IndexTicketController.getInstance()
const state = ref(indexTicketController.state.value)
const route = useRoute()

const id = ref(route.params.parent_id)

// const type = ref<RootCausesStatusEnum>(RootCausesStatusEnum[route.params.type as keyof typeof RootCausesStatusEnum])

const fetchTickets = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteTicketParams = new IndexTicketParams(
    query,
    pageNumber,
    perPage,
    withPage,
    id.value ?? '',
  )
  await indexTicketController.getData(deleteTicketParams)
}

onMounted(() => {
  fetchTickets()
})

const searchTickets = debounce(() => {
  fetchTickets(word.value)
})

const deleteTicket = async (id: number) => {
  const deleteTicketParams = new DeleteTicketParams(id)
  await DeleteTicketController.getInstance().deleteTicket(deleteTicketParams)
  await fetchTickets()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchTickets('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchTickets('', currentPage.value, countPerPage.value)
}

watch(
  () => indexTicketController.state.value,
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

const actionList = (id: number, deleteTicket: (id: number) => void) => [
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
    action: () => deleteTicket(id),
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
    fetchTickets()
  },
)

const getStatusLabel = (status: StatusEnum | undefined) => {
  switch (status) {
    case StatusEnum.PENDING:
      return 'pending'
    case StatusEnum.OPEN:
      return 'open'
    case StatusEnum.SOLVED:
      return 'solved'
    case StatusEnum.RESOLVED:
      return 'solved'
    case StatusEnum.CLOSED:
      return 'solved'
    default:
      return 'unknown'
  }
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click=";((word = ''), searchTickets())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchTickets"
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
          :to="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/ticket/add`"
          class="btn btn-primary"
        >
          {{ $t('Add_Ticket') }}
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
        <div class="tickets-cards-grid-system">
          <div class="tickets-card" v-for="ticket in state.data" :key="ticket.id">
            <div class="card-header" :data-status="getStatusLabel(ticket?.status)">
              <div class="flex items-center gap-3">
                <h6 :class="getStatusLabel(ticket?.status)">
                  {{ getStatusLabel(ticket?.status) }}
                </h6>
              </div>
            </div>
            <RouterLink
              :to="`${ticket.status == StatusEnum.SOLVED || ticket.status == StatusEnum.RESOLVED || ticket.status == StatusEnum.CLOSED ? `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/ticket/${ticket?.id}` : ''}`"
              class="card-info"
            >
              <div class="card-info-txt">
                <p v-for="type in ticket?.type" :key="type?.id">
                  {{ type?.title}}
                </p>
                <h2>
                  {{ ticket?.title }}
                </h2>
              </div>

              <MultiImagesDialog :images="ticket?.media || []">
                <div class="imgs">
                  <img
                    v-for="(img, i) in ticket?.media.slice(0, 2)"
                    :key="i"
                    :src="img.url"
                    :class="'img-' + (i + 1)"
                    alt="static"
                  />
                </div>
              </MultiImagesDialog>
            </RouterLink>

            <div class="card-footer">
              <RouterLink
                :to="`${ticket.status == StatusEnum.SOLVED || ticket.status == StatusEnum.RESOLVED || ticket.status == StatusEnum.CLOSED ? `/ticket/${ticket?.id}` : ''}`"
              >
                <div class="description">
                  <p>{{ ticket?.description }}</p>
                </div>
              </RouterLink>
            </div>
          </div>
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
            addText="Add Ticket"
            description="Sorry .. You have no Tickets .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No Tickets"
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
            addText="Add Ticket"
            description="Sorry .. You have no Tickets .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No Tickets"
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
