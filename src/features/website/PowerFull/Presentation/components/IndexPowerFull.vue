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
import IndexPowerFullController from '../controllers/indexPowerFullController'
import IndexPowerFullParams from '../../Core/params/indexPowerFullParams'
import DeletePowerFullParams from '../../Core/params/deletePowerFullParams'
import DeletePowerFullController from '../controllers/deletePowerFullController'
import ChangeStatusPowerFullParams from '../../Core/params/changeStatusPowerFullParams'
import ChangeStatusPowerFullController from '../controllers/changeStatusPowerFullController'

const { t } = useI18n()

// import DialogChangeStatusPowerFull from "@/features/setting/PowerFulluages/Presentation/components/PowerFull/DialogChangeStatusPowerFull.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexPowerFullController = IndexPowerFullController.getInstance()
const state = ref(indexPowerFullController.state.value)
const route = useRoute()
// const type = ref<PowerFullStatusEnum>(PowerFullStatusEnum[route.params.type as keyof typeof PowerFullStatusEnum])

const fetchPowerFull = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const PowerFullParams = new IndexPowerFullParams(query, pageNumber, perPage, withPage)
  await indexPowerFullController.getData(PowerFullParams)
}

onMounted(() => {
  fetchPowerFull()
})

const searchPowerFull = debounce(() => {
  fetchPowerFull(word.value)
})

const deletePowerFull = async (id: number) => {
  const deletePowerFullParams = new DeletePowerFullParams(id)
  await DeletePowerFullController.getInstance().deletePowerFull(deletePowerFullParams)
  await fetchPowerFull()
}

const changeStatusPowerFull = async (id: number) => {
  const changeStatusPowerFullParams = new ChangeStatusPowerFullParams(id)
  await ChangeStatusPowerFullController.getInstance().changeStatusPowerFull(
    changeStatusPowerFullParams,
  )
  await fetchPowerFull()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchPowerFull('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchPowerFull('', currentPage.value, countPerPage.value)
}

watch(
  () => indexPowerFullController.state.value,
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

const actionList = (id: number, deletePowerFull: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/admin/power-full/${id}`,
    permission: [
      PermissionsEnum.POWERFUL_FEATURE_UPDATE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.POWERFUL_FEATURE_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deletePowerFull(id),
    permission: [
      PermissionsEnum.POWERFUL_FEATURE_DELETE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.POWERFUL_FEATURE_ALL,
    ],
  },
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchPowerFull())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchPowerFull"
      />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
    <ExportExcel />
      <ExportPdf />
      <permission-builder :code="[PermissionsEnum.ADMIN, PermissionsEnum.POWERFUL_FEATURE_CREATE]">
        <router-link to="/admin/power-full/add" class="btn btn-primary">
          {{ $t('Add_PowerFull') }}
        </router-link>
      </permission-builder>
    </div>
  </div>

  <permission-builder
    :code="[
      PermissionsEnum.WEBSITE,
      PermissionsEnum.POWERFUL_FEATURE_ALL,
      PermissionsEnum.POWERFUL_FEATURE_DELETE,
      PermissionsEnum.POWERFUL_FEATURE_FETCH,
      PermissionsEnum.POWERFUL_FEATURE_UPDATE,
      PermissionsEnum.POWERFUL_FEATURE_CREATE,
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
                  <router-link :to="`/admin/power-full/${item.id}`">{{ item.id }} </router-link>
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
                      PermissionsEnum.POWERFUL_FEATURE_ALL,
                      PermissionsEnum.POWERFUL_FEATURE_CHANGE_STATUS,
                    ]"
                  >
                    <ToggleSwitch
                      :modelValue="item.is_active === 1"
                      binary
                      @update:model-value="changeStatusPowerFull(item.id)"
                    />
                  </permission-builder>
                </td>

                <td data-label="Actions">
                  <DropList
                    :actionList="actionList(item.id, deletePowerFull)"
                    @delete="deletePowerFull(item.id)"
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
          :link="`/admin/power-full/add`"
          addText="Add PowerFull"
          description="Sorry .. You have no PowerFull .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No PowerFull"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/admin/power-full/add`"
          addText="Add PowerFull"
          description="Sorry .. You have no PowerFull .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No PowerFull"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no PowerFull .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </permission-builder>
</template>

<style scoped></style>
