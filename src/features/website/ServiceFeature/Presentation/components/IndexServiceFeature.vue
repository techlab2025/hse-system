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
// import ExportIcon from '@/shared/icons/ExportIcon.vue'
import ExportExcel from '@/shared/HelpersComponents/ExportExcel.vue'
// import SaveIcon from '@/shared/icons/SaveIcon.vue'
import Search from '@/shared/icons/Search.vue'
import IndexServiceFeatureController from '../controllers/indexServiceFeatureController'
import IndexServiceFeatureParams from '../../Core/params/indexServiceFeatureParams'
import DeleteServiceFeatureParams from '../../Core/params/deleteServiceFeatureParams'
import DeleteServiceFeatureController from '../controllers/deleteServiceFeatureController'
import ChangeStatusServiceFeatureParams from '../../Core/params/changeStatusServiceFeature'
import ChangeStatusServiceFeatureController from '../controllers/changeStatusServiceFeatureController'
// import { setDefaultImage } from '@/base/Presentation/utils/set_default_image.ts'

const { t } = useI18n()

// import DialogChangeStatusServiceFeature from "@/features/setting/ServiceFeatureuages/Presentation/components/ServiceFeature/DialogChangeStatusServiceFeature.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexServiceFeatureController = IndexServiceFeatureController.getInstance()
const state = ref(indexServiceFeatureController.state.value)
// const route = useRoute()
// const type = ref<ServiceFeatureStatusEnum>(ServiceFeatureStatusEnum[route.params.type as keyof typeof ServiceFeatureStatusEnum])

const fetchServiceFeature = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteServiceFeatureParams = new IndexServiceFeatureParams(
    query,
    pageNumber,
    perPage,
    withPage,
  )
  await indexServiceFeatureController.getData(deleteServiceFeatureParams)
}

onMounted(() => {
  fetchServiceFeature()
})

const searchServiceFeature = debounce(() => {
  fetchServiceFeature(word.value)
})

const deleteServiceFeature = async (id: number) => {
  const deleteServiceFeatureParams = new DeleteServiceFeatureParams(id)
  await DeleteServiceFeatureController.getInstance().deleteServiceFeature(
    deleteServiceFeatureParams,
  )
  await fetchServiceFeature()
}

const changeStatusServiceFeature = async (id: number) => {
  const changeStatusServiceFeatureParams = new ChangeStatusServiceFeatureParams(id)
  await ChangeStatusServiceFeatureController.getInstance().changeStatusServiceFeature(
    changeStatusServiceFeatureParams,
  )
  await fetchServiceFeature()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchServiceFeature('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchServiceFeature('', currentPage.value, countPerPage.value)
}

watch(
  () => indexServiceFeatureController.state.value,
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

const actionList = (id: number, deleteServiceFeature: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/admin/service-feature/${id}`,
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
    action: () => deleteServiceFeature(id),
    permission: [
      PermissionsEnum.SERVICE_FEATURE_DELETE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.SERVICE_FEATURE_ALL,
    ],
  },
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchServiceFeature())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchServiceFeature"
      />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel :data="state.data" />
      <ExportPdf />
      <permission-builder :code="[PermissionsEnum.WEBSITE, PermissionsEnum.SERVICE_FEATURE_CREATE]">
        <router-link to="/admin/service-feature/add" class="btn btn-primary">
          {{ $t('add_service_feature') }}
        </router-link>
      </permission-builder>
    </div>
  </div>

  <permission-builder
    :code="[
      PermissionsEnum.WEBSITE,
      PermissionsEnum.SERVICE_FEATURE_ALL,
      PermissionsEnum.SERVICE_FEATURE_DELETE,
      PermissionsEnum.SERVICE_FEATURE_FETCH,
      PermissionsEnum.SERVICE_FEATURE_UPDATE,
      PermissionsEnum.SERVICE_FEATURE_CREATE,
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
                <!--                <th scope="col">{{ $t('has_certificate') }}</th>-->
                <th scope="col">{{ $t('subtitle') }}</th>
                <th scope="col">{{ $t('status') }}</th>

                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/admin/about-us-core/${item.id}`">{{ index + 1 }} </router-link>
                </td>
                <td data-label="title">{{ item.title }}</td>
                <td data-label="subtitle">{{ item.subtitle }}</td>

                <td data-label="status">
                  <permission-builder
                    :code="[
                      PermissionsEnum.WEBSITE,
                      PermissionsEnum.SERVICE_FEATURE_ALL,
                      PermissionsEnum.SERVICE_FEATURE_CHANGE_STATUS,
                    ]"
                  >
                    <ToggleSwitch
                      :modelValue="item.is_active === 1"
                      binary
                      @update:model-value="changeStatusServiceFeature(item.id)"
                    />
                  </permission-builder>
                </td>

                <td data-label="Actions">
                  <DropList
                    :actionList="actionList(item.id, deleteServiceFeature)"
                    @delete="deleteServiceFeature(item.id)"
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
          :link="`/admin/service-feature/add`"
          addText="Add ServiceFeature"
          description="Sorry .. You have no ServiceFeature .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No ServiceFeature"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/admin/service-feature/add`"
          addText="Add ServiceFeature"
          description="Sorry .. You have no ServiceFeature .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No ServiceFeature"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no ServiceFeature .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </permission-builder>
</template>

<style scoped></style>
