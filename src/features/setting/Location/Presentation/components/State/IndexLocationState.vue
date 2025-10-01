<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
// import IconRemoveInput from '@/shared/icons/IconRemoveInput.vue'
import wordSlice from '@/base/Presentation/utils/word_slice'

import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'
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
import IndexLocationController from '../../controllers/indexLocationController'
import IndexLocationParams from '../../../Core/params/indexLocationParams'
import DeleteLocationParams from '../../../Core/params/deleteLocationParams'
import DeleteLocationController from '../../controllers/deleteLocationController'
import { LocationEnum } from '../../../Core/Enum/LocationEnum'

const { t } = useI18n()

// import DialogChangeStatusHazardType from "@/features/setting/HazardTypeuages/Presentation/components/HazardType/DialogChangeStatusHazardType.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexLocationController = IndexLocationController.getInstance()
const state = ref(indexLocationController.state.value)
const route = useRoute()
const id = route.params.parent_id
// const type = ref<HazardTypeStatusEnum>(HazardTypeStatusEnum[route.params.type as keyof typeof HazardTypeStatusEnum])

const fetchLocation = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const indexLocationParams = new IndexLocationParams(
    query,
    pageNumber,
    perPage,
    withPage,
    LocationEnum.STATE,
    id,
  )
  await indexLocationController.getData(indexLocationParams)
}

onMounted(() => {
  fetchLocation()
})

const searchHazardType = debounce(() => {
  fetchLocation(word.value)
})

const deleteLocation = async (id: number) => {
  const deleteLocationParams = new DeleteLocationParams(id)
  await DeleteLocationController.getInstance().deleteLocation(deleteLocationParams)
  await fetchLocation()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchLocation('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchLocation('', currentPage.value, countPerPage.value)
}

watch(
  () => indexLocationController.state.value,
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

const actionList = (id: number, deleteLocation: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/admin/states/${id}`,
    permission: [
      PermissionsEnum.LOCATION_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.LOCATION_ALL,
    ],
  },
  {
    text: t('add_sub_areas_type'),
    icon: IconEdit,
    link: `/admin/areas/add/${id}`,
    permission: [
      PermissionsEnum.LOCATION_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.LOCATION_ALL,
    ],
  },
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
    action: () => deleteLocation(id),
    permission: [
      PermissionsEnum.LOCATION_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.LOCATION_ALL,
    ],
  },
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchHazardType())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchHazardType"
      />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
     <ExportExcel :data="state.data" />
      <ExportPdf />
      <permission-builder :code="[PermissionsEnum.ADMIN, PermissionsEnum.LOCATION_CREATE]">
        <router-link to="/admin/states/add" class="btn btn-primary">
          {{ $t('Add_Location_State') }}
        </router-link>
      </permission-builder>
    </div>
  </div>

  <permission-builder
    :code="[
      PermissionsEnum.ADMIN,
      PermissionsEnum.LOCATION_ALL,
      PermissionsEnum.LOCATION_DELETE,
      PermissionsEnum.LOCATION_FETCH,
      PermissionsEnum.LOCATION_UPDATE,
      PermissionsEnum.LOCATION_CREATE,
    ]"
  >
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive">
          <table class="main-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{{ $t('Code') }}</th>
                <!--                <th scope="col">{{ $t('has_certificate') }}</th>-->
                <th scope="col">{{ $t('title') }}</th>
                <!-- <th scope="col">{{ $t('industries') }}</th> -->
                <!-- <th scope="col">{{ $t('image') }}</th> -->

                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/admin/states/${item.id}`">{{ index + 1 }} </router-link>
                </td>
                <td data-label="Name">{{ item.code }}</td>
                <td data-label="email">{{ wordSlice(item.title) }}</td>

                <td data-label="Actions">
                  <DropList
                    :actionList="actionList(item.id, deleteLocation)"
                    @delete="deleteLocation(item.id)"
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
          :link="`/add/HazardType`"
          addText="Add HazardType"
          description="Sorry .. You have no HazardTypeuages .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No HazardTypeuages"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/add/HazardType`"
          addText="Add HazardType"
          description="Sorry .. You have no HazardTypeuage .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No HazardTypeuages"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no HazardTypeuage .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </permission-builder>
</template>

<style scoped></style>
