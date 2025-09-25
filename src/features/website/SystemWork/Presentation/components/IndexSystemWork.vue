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
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/employee/Core/Enum/permission_enum.ts'
import ExportIcon from '@/shared/icons/ExportIcon.vue'
import ExportExcel from '@/shared/HelpersComponents/ExportExcel.vue'
import SaveIcon from '@/shared/icons/SaveIcon.vue'
import Search from '@/shared/icons/Search.vue'
import { setDefaultImage } from '@/base/Presentation/utils/set_default_image.ts'
import IndexSystemWorkController from '../controllers/indexSystemWorkController'
import IndexSystemWorkParams from '../../Core/params/indexSystemWorkParams'
import DeleteSystemWorkParams from '../../Core/params/deleteSystemWorkParams'
import DeleteSystemWorkController from '../controllers/deleteSystemWorkController'
import ChangeStatusSystemWorkParams from '../../Core/params/changeStatusSystemWorkParams'
import ChangeStatusSystemWorkController from '../controllers/changeStatusSystemWorkController'

const { t } = useI18n()

// import DialogChangeStatusSystemWork from "@/features/setting/SystemWorkuages/Presentation/components/SystemWork/DialogChangeStatusSystemWork.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexSystemWorkController = IndexSystemWorkController.getInstance()
const state = ref(indexSystemWorkController.state.value)
const route = useRoute()
// const type = ref<SystemWorkStatusEnum>(SystemWorkStatusEnum[route.params.type as keyof typeof SystemWorkStatusEnum])

const fetchSystemWork = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const SystemWorkParams = new IndexSystemWorkParams(query, pageNumber, perPage, withPage)
  await indexSystemWorkController.getData(SystemWorkParams)
}

onMounted(() => {
  fetchSystemWork()
})

const searchSystemWork = debounce(() => {
  fetchSystemWork(word.value)
})

const deleteSystemWork = async (id: number) => {
  const deleteSystemWorkParams = new DeleteSystemWorkParams(id)
  await DeleteSystemWorkController.getInstance().deleteSystemWork(deleteSystemWorkParams)
  await fetchSystemWork()
}

const changeStatusSystemWork = async (id: number) => {
  const changeStatusSystemWorkParams = new ChangeStatusSystemWorkParams(id)
  await ChangeStatusSystemWorkController.getInstance().changeStatusSystemWork(
    changeStatusSystemWorkParams,
  )
  await fetchSystemWork()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchSystemWork('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchSystemWork('', currentPage.value, countPerPage.value)
}

watch(
  () => indexSystemWorkController.state.value,
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

const actionList = (id: number, deleteSystemWork: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/admin/system-work/${id}`,
    permission: [
      PermissionsEnum.SYSTEM_WORK_UPDATE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.SYSTEM_WORK_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteSystemWork(id),
    permission: [
      PermissionsEnum.SYSTEM_WORK_DELETE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.SYSTEM_WORK_ALL,
    ],
  },
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchSystemWork())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchSystemWork"
      />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <div class="btn btn-secondary flex align-center justify-center">
        <ExportExcel
          :data="state.data!"
          :columns="customColumns"
          filename="formatted_export"
          sheet-name="Equipment Type Data"
          button-text="Export Formatted"
          button-class="btn-primary"
        />
        <SaveIcon />
      </div>
      <div class="btn btn-secondary flex align-center justify-center">
        <ExportPdf />
        <ExportIcon />
      </div>
      <permission-builder :code="[PermissionsEnum.ADMIN, PermissionsEnum.SYSTEM_WORK_CREATE]">
        <router-link to="/admin/system-work/add" class="btn btn-primary">
          {{ $t('Add_SystemWork') }}
        </router-link>
      </permission-builder>
    </div>
  </div>

  <permission-builder
    :code="[
      PermissionsEnum.WEBSITE,
      PermissionsEnum.SYSTEM_WORK_ALL,
      PermissionsEnum.SYSTEM_WORK_DELETE,
      PermissionsEnum.SYSTEM_WORK_FETCH,
      PermissionsEnum.SYSTEM_WORK_UPDATE,
      PermissionsEnum.SYSTEM_WORK_CREATE,
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
              <tr v-for="item in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/admin/system-work/${item.id}`">{{ item.id }} </router-link>
                </td>
                <td data-label="title">{{ item.title }}</td>
                <td data-label="subtitle">{{ item.subtitle }}</td>

                <td data-label="image">
                  <img :src="item.image" @error="setDefaultImage($event)" alt="" />
                </td>
                <td data-label="status">
                  <permission-builder
                    :code="[
                      PermissionsEnum.WEBSITE,
                      PermissionsEnum.SYSTEM_WORK_ALL,
                      PermissionsEnum.SYSTEM_WORK_CHANGE_STATUS,
                    ]"
                  >
                    <ToggleSwitch
                      :modelValue="item.is_active === 1"
                      binary
                      @update:model-value="changeStatusSystemWork(item.id)"
                    />
                  </permission-builder>
                </td>

                <td data-label="Actions">
                  <DropList
                    :actionList="actionList(item.id, deleteSystemWork)"
                    @delete="deleteSystemWork(item.id)"
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
          :link="`/admin/system-work/add`"
          addText="Add SystemWork"
          description="Sorry .. You have no SystemWork .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No SystemWork"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/admin/system-work/add`"
          addText="Add SystemWork"
          description="Sorry .. You have no SystemWork .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No SystemWork"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no SystemWork .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </permission-builder>
</template>

<style scoped></style>
