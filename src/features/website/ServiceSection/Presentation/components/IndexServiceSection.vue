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
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import ExportIcon from '@/shared/icons/ExportIcon.vue'
import ExportExcel from '@/shared/HelpersComponents/ExportExcel.vue'
import SaveIcon from '@/shared/icons/SaveIcon.vue'
import Search from '@/shared/icons/Search.vue'
import { setDefaultImage } from '@/base/Presentation/utils/set_default_image.ts'
import IndexServiceSectionController from '../controllers/indexServiceSectionController'
import IndexServiceSectionParams from '../../Core/params/indexServiceSectionParams'
import DeleteServiceSectionParams from '../../Core/params/deleteServiceSectionParams'
import DeleteServiceSectionController from '../controllers/deleteServiceSectionController'
import ChangeServiceSectionStatusParams from '../../Core/params/changeStatusServiceSectionParams'
import disActiveServiceSectionController from '../controllers/disActiveServiceSectionController'
import wordSlice from '@/base/Presentation/utils/word_slice'

const { t } = useI18n()

// import DialogChangeStatusService from "@/features/setting/Serviceuages/Presentation/components/Service/DialogChangeStatusService.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexServiceSectionController = IndexServiceSectionController.getInstance()
const state = ref(indexServiceSectionController.state.value)
const route = useRoute()
const id = route.params.parent_id
// const type = ref<ServiceStatusEnum>(ServiceStatusEnum[route.params.type as keyof typeof ServiceStatusEnum])

const fetchServiceSection = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const indexServiceSectionParams = new IndexServiceSectionParams(
    query,
    pageNumber,
    perPage,
    withPage,
    id,
  )
  await indexServiceSectionController.getData(indexServiceSectionParams)
}

onMounted(() => {
  fetchServiceSection()
})

const searchService = debounce(() => {
  fetchServiceSection(word.value)
})

const deleteService = async (id: number) => {
  const deleteServiceSectionParams = new DeleteServiceSectionParams(id)
  await DeleteServiceSectionController.getInstance().deleteServiceSection(
    deleteServiceSectionParams,
  )
  await fetchServiceSection()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchServiceSection('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchServiceSection('', currentPage.value, countPerPage.value)
}

watch(
  () => indexServiceSectionController.state.value,
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
    link: `/admin/service_section/${id}`,
    permission: [
      PermissionsEnum.SERVICE_SECTION_UPDATE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.SERVICE_SECTION_ALL,
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

const changeStatusServiceSection = async (id: number) => {
  const changeServiceSectionStatusParams = new ChangeServiceSectionStatusParams(id)
  await disActiveServiceSectionController
    .getInstance()
    .disActiveServiceSection(changeServiceSectionStatusParams)
  await fetchServiceSection()
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
      <ExportExcel :data="state.data" />
      <ExportPdf />
      <permission-builder :code="[PermissionsEnum.WEBSITE, PermissionsEnum.SERVICE_FEATURE_CREATE]">
        <router-link to="/admin/service_section/add" class="btn btn-primary">
          {{ $t('Add_Service_section') }}
        </router-link>
      </permission-builder>
    </div>
  </div>

  <permission-builder
    :code="[
      PermissionsEnum.WEBSITE,
      PermissionsEnum.SERVICE_SECTION_ALL,
      PermissionsEnum.SERVICE_SECTION_DELETE,
      PermissionsEnum.SERVICE_SECTION_FETCH,
      PermissionsEnum.SERVICE_SECTION_UPDATE,
      PermissionsEnum.SERVICE_SECTION_CREATE,
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
                <th scope="col">{{ $t('description') }}</th>
                <th scope="col">{{ $t('image') }}</th>
                <th scope="col">{{ $t('status') }}</th>
                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/admin/services/${item.id}`">{{ index + 1 }} </router-link>
                </td>
                <td data-label="title">{{ wordSlice(item.title) }}</td>
                <td data-label="subtitle">{{ wordSlice(item.subtitle) || '--' }}</td>
                <td data-label="description" v-html="wordSlice(item.description, 50)"></td>

                <td data-label="image">
                  <img :src="item.image" @error="setDefaultImage($event)" alt="" />
                </td>
                <td data-label="status">
                  <permission-builder
                    :code="[
                      PermissionsEnum.WEBSITE,
                      PermissionsEnum.HOME_VIEW_PRICING_ALL,
                      PermissionsEnum.HOME_VIEW_PRICING_CHANGE_STATUS,
                    ]"
                  >
                    <ToggleSwitch
                      :modelValue="item.isActive === 1"
                      binary
                      @update:model-value="changeStatusServiceSection(item.id)"
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
