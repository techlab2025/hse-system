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
import ToggleSwitch from 'primevue/toggleswitch'

import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import wordSlice from '@/base/Presentation/utils/word_slice'

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
import IndexPermissionController from '../controllers/indexPermissionController'
import IndexPermissionParams from '../../Core/params/indexPermissionParams'
import DeletePermissionParams from '../../Core/params/deletePermissionParams'
import DeletePermissionController from '../controllers/deletePermissionController'

const { t } = useI18n()

// import DialogChangeStatusPermission from "@/features/setting/Permissionuages/Presentation/components/Permission/DialogChangeStatusPermission.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexPermissionController = IndexPermissionController.getInstance()
const state = ref(indexPermissionController.state.value)
const route = useRoute()

// const id = ref(route.params.parent_id)

// const type = ref<PermissionStatusEnum>(PermissionStatusEnum[route.params.type as keyof typeof PermissionStatusEnum])

const fetchPermission = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deletePermissionParams = new IndexPermissionParams(
    query,
    pageNumber,
    perPage,
    withPage,
    // id.value?? '',
  )
  await indexPermissionController.getData(deletePermissionParams)
}

onMounted(() => {
  fetchPermission()
})

const searchPermission = debounce(() => {
  fetchPermission(word.value)
})

const deletePermission = async (id: number) => {
  const deletePermissionParams = new DeletePermissionParams(id)
  await DeletePermissionController.getInstance().deletePermission(
    deletePermissionParams,
  )
  await fetchPermission()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchPermission('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchPermission('', currentPage.value, countPerPage.value)
}

watch(
  () => indexPermissionController.state.value,
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

const actionList = (id: number, deletePermission: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/organization/permission/${id}`,
    permission: [
      PermissionsEnum.ORG_LOCATION_UPDATE,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ORG_LOCATION_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deletePermission(id),
    permission: [
      PermissionsEnum.ORG_LOCATION_DELETE,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ORG_LOCATION_ALL,
    ],
  },
]

watch(
  () => route?.params?.id,
  (Newvalue) => {
    // id = Newvalue
    fetchPermission()
  },
)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchPermission())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchPermission"
      />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel :data="state.data" />
      <ExportPdf />
      <permission-builder
        :code="[PermissionsEnum.ORGANIZATION_EMPLOYEE, PermissionsEnum.ORG_LOCATION_CREATE]"
      >
        <router-link to="/organization/organization-location/add" class="btn btn-primary">
          {{ $t('Add_organization_location') }}
        </router-link>
      </permission-builder>
    </div>
  </div>

  <permission-builder
    :code="[
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ORG_LOCATION_ALL,
      PermissionsEnum.ORG_LOCATION_DELETE,
      PermissionsEnum.ORG_LOCATION_FETCH,
      PermissionsEnum.ORG_LOCATION_UPDATE,
      PermissionsEnum.ORG_LOCATION_CREATE,
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

                <th scope="col">{{ $t('lat') }}</th>
                <th scope="col">{{ $t('lng') }}</th>
                <th scope="col">{{ $t('location') }}</th>

                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/organization/organization-location/${item.id}`"
                    >{{ index + 1 }}
                  </router-link>
                </td>
                <td data-label="Name">{{ wordSlice(item.title) }}</td>

                <td data-label="lat">
                  {{ item.lat }}
                </td>

                <td data-label="lng">
                  {{ item.lng }}
                </td>
                <td data-label="location">
                  {{ item.location?.title }}
                </td>

                <td data-label="Actions">
                  <!--                <DialogChangeStatusPermission-->
                  <!--                  v-if="item.PermissionStatus === PermissionStatusEnum.Draft"-->
                  <!--                  :PermissionId="item.id"-->
                  <!--                  @PermissionChangeStatus="fetchPermission"-->
                  <!--                />-->

                  <DropList
                    :actionList="actionList(item.id, deletePermission)"
                    @delete="deletePermission(item.id)"
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
          :link="`/organization/organization-location/add`"
          addText="Add Permission"
          description="Sorry .. You have no Permission .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Permission"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/organization/organization-location/add`"
          addText="Add Permission"
          description="Sorry .. You have no Permission .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Permission"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no Permission .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </permission-builder>
</template>

<style scoped></style>
