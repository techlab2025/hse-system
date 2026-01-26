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

const { t } = useI18n()

// import DialogChangeStatusRootCauses from "@/features/setting/RootCausess/Presentation/components/RootCauses/DialogChangeStatusRootCauses.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexRootCausesController = IndexRootCausesController.getInstance()
const state = ref(indexRootCausesController.state.value)
const route = useRoute()

const id = ref(route.params.parent_id)

// const type = ref<RootCausesStatusEnum>(RootCausesStatusEnum[route.params.type as keyof typeof RootCausesStatusEnum])

const fetchRootCauses = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteRootCausesParams = new IndexRootCausesParams(
    query,
    pageNumber,
    perPage,
    withPage,
    id.value ?? '',
  )
  await indexRootCausesController.getData(deleteRootCausesParams)
}

onMounted(() => {
  fetchRootCauses()
})

const searchRootCauses = debounce(() => {
  fetchRootCauses(word.value)
})

const deleteRootCauses = async (id: number) => {
  const deleteRootCausesParams = new DeleteRootCausesParams(id)
  await DeleteRootCausesController.getInstance().deleteRootCauses(deleteRootCausesParams)
  await fetchRootCauses()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchRootCauses('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchRootCauses('', currentPage.value, countPerPage.value)
}

watch(
  () => indexRootCausesController.state.value,
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

const actionList = (id: number, deleteRootCauses: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/${
      user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
    }/root-causes/${id}`,
    permission: [
      PermissionsEnum.EQUIPMENT_TYPE_UPDATE,
      PermissionsEnum.ORG_EQUIPMENT_TYPE_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.EQUIPMENT_TYPE_ALL,
      PermissionsEnum.ORG_EQUIPMENT_TYPE_ALL,
    ],
  },
  // {
  //   text: t('add_sub_equipment_type'),
  //   icon: IconEdit,
  //   link: `/${
  //     user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
  //   }/equipment-type/add/${id}`,
  //   permission: [
  //     PermissionsEnum.EQUIPMENT_TYPE_UPDATE,
  //     PermissionsEnum.ORG_EQUIPMENT_TYPE_UPDATE,
  //     PermissionsEnum.ADMIN,
  //     PermissionsEnum.ORGANIZATION_EMPLOYEE,
  //     PermissionsEnum.EQUIPMENT_TYPE_ALL,
  //     PermissionsEnum.ORG_EQUIPMENT_TYPE_ALL,
  //   ],
  // },
  // {
  //   text: t('sub_equipment_types'),
  //   icon: IconEdit,
  //   link: `/${
  //     user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
  //   }/equipment-types/${id}`,
  //   permission: [
  //     PermissionsEnum.EQUIPMENT_TYPE_UPDATE,
  //     PermissionsEnum.ORG_EQUIPMENT_TYPE_UPDATE,
  //     PermissionsEnum.ADMIN,
  //     PermissionsEnum.ORGANIZATION_EMPLOYEE,
  //     PermissionsEnum.EQUIPMENT_TYPE_ALL,
  //     PermissionsEnum.ORG_EQUIPMENT_TYPE_ALL,
  //   ],
  // },
  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteRootCauses(id),
    permission: [
      PermissionsEnum.EQUIPMENT_TYPE_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.EQUIPMENT_TYPE_ALL,
      PermissionsEnum.ORG_EQUIPMENT_TYPE_ALL,
      PermissionsEnum.ORG_EQUIPMENT_TYPE_DELETE,
    ],
  },
]

watch(
  () => route?.params?.id,
  (Newvalue) => {
    // id = Newvalue
    fetchRootCauses()
  },
)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click=";((word = ''), searchRootCauses())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchRootCauses"
      />
    </div>

    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel :data="state.data" />
      <ExportPdf />
      <PermissionBuilder
        :code="[
          PermissionsEnum.ADMIN,
          PermissionsEnum.ORGANIZATION_EMPLOYEE,
          PermissionsEnum.EQUIPMENT_TYPE_CREATE,
          PermissionsEnum.ORG_EQUIPMENT_TYPE_CREATE,
        ]"
      >
        <router-link
          :to="`/${
            user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
          }/root-causes/add`"
          class="btn btn-primary"
        >
          {{ $t('Add_RootCauses') }}
        </router-link>
      </PermissionBuilder>
    </div>
  </div>

  <PermissionBuilder
    :code="[
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.EQUIPMENT_TYPE_ALL,
      PermissionsEnum.EQUIPMENT_TYPE_DELETE,
      PermissionsEnum.EQUIPMENT_TYPE_FETCH,
      PermissionsEnum.EQUIPMENT_TYPE_UPDATE,
      PermissionsEnum.EQUIPMENT_TYPE_CREATE,
      PermissionsEnum.ORG_EQUIPMENT_TYPE_ALL,
      PermissionsEnum.ORG_EQUIPMENT_TYPE_DELETE,
      PermissionsEnum.ORG_EQUIPMENT_TYPE_FETCH,
      PermissionsEnum.ORG_EQUIPMENT_TYPE_UPDATE,
      PermissionsEnum.ORG_EQUIPMENT_TYPE_CREATE,
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

                <th scope="col" v-if="user?.type === OrganizationTypeEnum?.ADMIN">
                  {{ $t('all_industries') }}
                </th>
                <th scope="col" v-if="user?.type === OrganizationTypeEnum?.ADMIN">
                  {{ $t('industries') }}
                </th>

                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  {{ index + 1 }}
                </td>
                <td data-label="Name">{{ wordSlice(item.title) }}</td>
                <td data-label="all_industries" v-if="user?.type === OrganizationTypeEnum?.ADMIN">
                  {{ item.allIndustries ? $t('yes') : $t('no') }}
                </td>
                <td data-label="all_industries" v-if="user?.type === OrganizationTypeEnum?.ADMIN">
                  {{
                    item.industries.length > 0
                      ? item.industries.map((industry) => industry.title).join(', ')
                      : $t('no')
                  }}
                </td>

                <td data-label="Actions">
                  <!--                <DialogChangeStatusRootCauses-->
                  <!--                  v-if="item.RootCausesStatus === RootCausesStatusEnum.Draft"-->
                  <!--                  :RootCausesId="item.id"-->
                  <!--                  @RootCausesChangeStatus="fetchRootCauses"-->
                  <!--                />-->

                  <DropList
                    :actionList="actionList(item.id, deleteRootCauses)"
                    @delete="deleteRootCauses(item.id)"
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
            PermissionsEnum.EQUIPMENT_TYPE_CREATE,
            PermissionsEnum.ORG_EQUIPMENT_TYPE_CREATE,
          ]"
        >
          <DataEmpty
            :link="`/${
              user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
            }/equipment-type/add`"
            addText="Add RootCauses"
            description="Sorry .. You have no RootCausess .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No RootCausess"
          />
        </PermissionBuilder>
      </template>
      <template #failed>
        <PermissionBuilder
          :code="[
            PermissionsEnum.ADMIN,
            PermissionsEnum.ORGANIZATION_EMPLOYEE,
            PermissionsEnum.EQUIPMENT_TYPE_CREATE,
            PermissionsEnum.ORG_EQUIPMENT_TYPE_CREATE,
          ]"
        >
          <DataFailed
            :link="`/${
              user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
            }/add/RootCauses`"
            addText="Add RootCauses"
            description="Sorry .. You have no RootCauses .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No RootCausess"
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
