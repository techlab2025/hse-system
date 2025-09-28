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
import IndexSystemFeatureController from '../controllers/indexSystemFeatureController'
import IndexSystemFeatureParams from '../../Core/params/indexSystemFeatureParams'
import DeleteSystemFeatureParams from '../../Core/params/deleteSystemFeatureParams'
import DeleteSystemFeatureController from '../controllers/deleteSystemFeatureController'
import ChangeSystemFeatureStatusParams from '../../Core/params/changeStatusSystemFeatureParams'
import disActiveSystemFeatureController from '../controllers/disActiveSystemFeatureController'

const { t } = useI18n()

// import DialogChangeStatusService from "@/features/setting/Serviceuages/Presentation/components/Service/DialogChangeStatusService.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexSystemFeatureController = IndexSystemFeatureController.getInstance()
const state = ref(indexSystemFeatureController.state.value)
const route = useRoute()
const id = route.params.parent_id
// const type = ref<ServiceStatusEnum>(ServiceStatusEnum[route.params.type as keyof typeof ServiceStatusEnum])

const fetchSystemFeature = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const indexSystemFeatureParams = new IndexSystemFeatureParams(
    query,
    pageNumber,
    perPage,
    withPage,
    id,
  )
  await indexSystemFeatureController.getData(indexSystemFeatureParams)
}

onMounted(() => {
  fetchSystemFeature()
})

const searchService = debounce(() => {
  fetchSystemFeature(word.value)
})

const deleteService = async (id: number) => {
  const deleteSystemFeatureParams = new DeleteSystemFeatureParams(id)
  await DeleteSystemFeatureController.getInstance().deleteSystemFeature(
    deleteSystemFeatureParams,
  )
  await fetchSystemFeature()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchSystemFeature('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchSystemFeature('', currentPage.value, countPerPage.value)
}

watch(
  () => indexSystemFeatureController.state.value,
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

const actionList = (id: number, deleteService: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/admin/system_feature/${id}`,
    permission: [
      PermissionsEnum.SERVICE_FEATURE_UPDATE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.SERVICE_FEATURE_ALL,
    ],
  },
  // {
  //   text: t('add_sub_HAZARD_type'),
  //   icon: IconEdit,
  //   link: `/admin/Hazard-type/add/${id}`,
  //   permission: [
  //     PermissionsEnum.HAZARD_TYPE_UPDATE,
  //     PermissionsEnum.ADMIN,
  //     PermissionsEnum.HAZARD_TYPE_ALL,
  //   ],
  // },
  // {
  //   text: t('sub_HAZARD_types'),
  //   icon: IconEdit,
  //   link: `/admin/Hazard-types/${id}`,
  //   permission: [
  //     PermissionsEnum.HAZARD_TYPE_UPDATE,
  //     PermissionsEnum.ADMIN,
  //     PermissionsEnum.HAZARD_TYPE_ALL,
  //   ],
  // },
  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteService(id),
    permission: [
      PermissionsEnum.SERVICE_SECTION_DELETE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.SERVICE_SECTION_ALL,
    ],
  },
]

const changeStatusSystemFeature = async (id: number) => {
  const changeSystemFeatureStatusParams = new ChangeSystemFeatureStatusParams(id)
  await disActiveSystemFeatureController
    .getInstance()
    .disActiveSystemFeature(changeSystemFeatureStatusParams)
  await fetchSystemFeature()
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchService())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchService"
      />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
    <ExportExcel />
      <ExportPdf />
      <permission-builder :code="[PermissionsEnum.ADMIN, PermissionsEnum.OUR_SYSTEM_BANNER_CREATE]">
        <router-link to="/admin/system_feature/add" class="btn btn-primary">
          {{ $t('Add_System_feature') }}
        </router-link>
      </permission-builder>
    </div>
  </div>

  <permission-builder
    :code="[
      PermissionsEnum.WEBSITE,
      PermissionsEnum.OUR_SYSTEM_FEATURE_ALL,
      PermissionsEnum.OUR_SYSTEM_FEATURE_DELETE,
      PermissionsEnum.OUR_SYSTEM_FEATURE_FETCH,
      PermissionsEnum.OUR_SYSTEM_FEATURE_UPDATE,
      PermissionsEnum.OUR_SYSTEM_FEATURE_CREATE,
    ]"
  >
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive">
          <table class="main-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{{ $t('feature') }}</th>
                <th scope="col">{{ $t('old') }}</th>
                <th scope="col">{{ $t('new') }}</th>
                <th scope="col">{{ $t('status') }}</th>
                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in state.data" :key="item.id">
                {{
                  console.log(item, 'item')
                }}
                <td data-label="#">
                  <router-link :to="`/admin/system_banner/${item.id}`">{{ item.id }} </router-link>
                </td>

                <td data-label="feature">{{ item.feature }}</td>
                <td data-label="old">{{ item.old }}</td>
                <td data-label="new">{{ item.New }}</td>
                <td data-label="status">
                  <permission-builder
                    :code="[
                      PermissionsEnum.WEBSITE,
                      PermissionsEnum.OUR_SYSTEM_BANNER_ALL,
                      PermissionsEnum.OUR_SYSTEM_BANNER_CHANGE_STATUS,
                    ]"
                  >
                    <ToggleSwitch
                      :modelValue="item.isActive === 1"
                      binary
                      @update:model-value="changeStatusSystemFeature(item.id)"
                    />
                  </permission-builder>
                </td>

                <td data-label="Actions">
                  <!--                <DialogChangeStatusService-->
                  <!--                  v-if="item.ServiceStatus === ServiceStatusEnum.Draft"-->
                  <!--                  :ServiceId="item.id"-->
                  <!--                  @ServiceChangeStatus="fetchService"-->
                  <!--                />-->

                  <DropList
                    :actionList="actionList(item.id, deleteService)"
                    @delete="deleteService(item.id)"
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
          :link="`/admin/home-contact-us/add`"
          addText="Add Service"
          description="Sorry .. You have no Service .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Service"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/admin/home-contact-us/add`"
          addText="Add Service"
          description="Sorry .. You have no Service .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Service"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no Service .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </permission-builder>
</template>

<style scoped></style>
