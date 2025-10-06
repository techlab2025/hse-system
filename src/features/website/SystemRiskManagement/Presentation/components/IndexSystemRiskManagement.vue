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
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import wordSlice from '@/base/Presentation/utils/word_slice'

import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import ExportIcon from '@/shared/icons/ExportIcon.vue'
import ExportExcel from '@/shared/HelpersComponents/ExportExcel.vue'
import SaveIcon from '@/shared/icons/SaveIcon.vue'
import Search from '@/shared/icons/Search.vue'
import { setDefaultImage } from '@/base/Presentation/utils/set_default_image.ts'
import IndexSystemRiskManagementController from '../controllers/indexSystemRiskManagementController'
import IndexSystemRiskManagementParams from '../../Core/params/indexSystemRiskManagementParams'
import DeleteSystemRiskManagementParams from '../../Core/params/deleteSystemRiskManagementParams'
import DeleteSystemRiskManagementController from '../controllers/deleteSystemRiskManagementController'
import ChangeStatusSystemRiskManagementParams from '../../Core/params/changeStatusSystemRiskManagementParams'
import ChangeStatusSystemRiskManagementController from '../controllers/changeStatusSystemRiskManagementController'

const { t } = useI18n()

// import DialogChangeStatusSystemRiskManagement from "@/features/setting/SystemRiskManagementuages/Presentation/components/SystemRiskManagement/DialogChangeStatusSystemRiskManagement.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexSystemRiskManagementController = IndexSystemRiskManagementController.getInstance()
const state = ref(indexSystemRiskManagementController.state.value)
const route = useRoute()
// const type = ref<SystemRiskManagementStatusEnum>(SystemRiskManagementStatusEnum[route.params.type as keyof typeof SystemRiskManagementStatusEnum])

const fetchSystemRiskManagement = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const SystemRiskManagementParams = new IndexSystemRiskManagementParams(
    query,
    pageNumber,
    perPage,
    withPage,
  )
  await indexSystemRiskManagementController.getData(SystemRiskManagementParams)
}

onMounted(() => {
  fetchSystemRiskManagement()
})

const searchSystemRiskManagement = debounce(() => {
  fetchSystemRiskManagement(word.value)
})

const deleteSystemRiskManagement = async (id: number) => {
  const deleteSystemRiskManagementParams = new DeleteSystemRiskManagementParams(id)
  await DeleteSystemRiskManagementController.getInstance().deleteSystemRiskManagement(
    deleteSystemRiskManagementParams,
  )
  await fetchSystemRiskManagement()
}

const changeStatusSystemRiskManagement = async (id: number) => {
  const changeStatusSystemRiskManagementParams = new ChangeStatusSystemRiskManagementParams(id)
  await ChangeStatusSystemRiskManagementController.getInstance().changeStatusSystemRiskManagement(
    changeStatusSystemRiskManagementParams,
  )
  await fetchSystemRiskManagement()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchSystemRiskManagement('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchSystemRiskManagement('', currentPage.value, countPerPage.value)
}

watch(
  () => indexSystemRiskManagementController.state.value,
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

const actionList = (id: number, deleteSystemRiskManagement: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/admin/system-risk-management/${id}`,
    permission: [
      PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_UPDATE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteSystemRiskManagement(id),
    permission: [
      PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_DELETE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_ALL,
    ],
  },
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchSystemRiskManagement())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchSystemRiskManagement"
      />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel :data="state.data" />
      <ExportPdf />
      <PermissionBuilder
        :code="[PermissionsEnum.WEBSITE, PermissionsEnum.ABOUT_US_FEATURE_CREATE]"
      >
        <router-link to="/admin/system-risk-management/add" class="btn btn-primary">
          {{ $t('Add_System_Risk_Management') }}
        </router-link>
      </PermissionBuilder>
    </div>
  </div>

  <PermissionBuilder
    :code="[
      PermissionsEnum.WEBSITE,
      PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_ALL,
      PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_FETCH,
      PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_DELETE,
      PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_UPDATE,
      PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_CREATE,
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
                <th scope="col">{{ $t('subtitle') }}</th>
                <th scope="col">{{ $t('image') }}</th>
                <th scope="col">{{ $t('status') }}</th>

                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/admin/about-us-features/${item.id}`"
                    >{{ index + 1 }}
                  </router-link>
                </td>
                <td data-label="title">{{ wordSlice(item.title) || '___' }}</td>
                <td data-label="subtitle">{{ wordSlice(item.subtitle) || '___' }}</td>

                <td data-label="image">
                  <img :src="item.image" @error="setDefaultImage($event)" alt="" />
                </td>
                <td data-label="status">
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.WEBSITE,
                      PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_ALL,
                      PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_CHANGE_STATUS,
                    ]"
                  >
                    <ToggleSwitch
                      :modelValue="item.is_active === 1"
                      binary
                      @update:model-value="changeStatusSystemRiskManagement(item.id)"
                    />
                  </PermissionBuilder>
                </td>

                <td data-label="Actions">
                  <DropList
                    :actionList="actionList(item.id, deleteSystemRiskManagement)"
                    @delete="deleteSystemRiskManagement(item.id)"
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
          :link="`/admin/about-us-features/add`"
          addText="Add SystemRiskManagement"
          description="Sorry .. You have no SystemRiskManagement .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No SystemRiskManagement"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/admin/about-us-features/add`"
          addText="Add SystemRiskManagement"
          description="Sorry .. You have no SystemRiskManagement .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No SystemRiskManagement"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no SystemRiskManagement .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </PermissionBuilder>
</template>

<style scoped></style>
