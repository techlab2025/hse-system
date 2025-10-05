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
import wordSlice from '@/base/Presentation/utils/word_slice'

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
import IndexProjectZoneController from '../controllers/indexProjectZoneController'
import IndexProjectZoneParams from '../../Core/params/indexProjectZoneParams'
import DeleteProjectZoneParams from '../../Core/params/deleteProjectZoneParams'
import DeleteProjectZoneController from '../controllers/deleteProjectZoneController'
import ChangeStatusProjectZoneParams from '../../Core/params/changeStatusProjectZoneParams'
import ChangeStatusProjectZoneController from '../controllers/changeStatusProjectZoneController'

const { t } = useI18n()

// import DialogChangeStatusProjectZone from "@/features/setting/ProjectZoneuages/Presentation/components/ProjectZone/DialogChangeStatusProjectZone.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexProjectZoneController = IndexProjectZoneController.getInstance()
const state = ref(indexProjectZoneController.state.value)
const route = useRoute()
// const type = ref<ProjectZoneStatusEnum>(ProjectZoneStatusEnum[route.params.type as keyof typeof ProjectZoneStatusEnum])

const fetchProjectZone = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const ProjectZoneParams = new IndexProjectZoneParams(query, pageNumber, perPage, withPage)
  await indexProjectZoneController.getData(ProjectZoneParams)
}

onMounted(() => {
  fetchProjectZone()
})

const searchProjectZone = debounce(() => {
  fetchProjectZone(word.value)
})

const deleteProjectZone = async (id: number) => {
  const deleteProjectZoneParams = new DeleteProjectZoneParams(id)
  await DeleteProjectZoneController.getInstance().deleteProjectZone(deleteProjectZoneParams)
  await fetchProjectZone()
}

const changeStatusProjectZone = async (id: number) => {
  const changeStatusProjectZoneParams = new ChangeStatusProjectZoneParams(id)
  await ChangeStatusProjectZoneController.getInstance().changeStatusProjectZone(
    changeStatusProjectZoneParams,
  )
  await fetchProjectZone()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchProjectZone('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchProjectZone('', currentPage.value, countPerPage.value)
}

watch(
  () => indexProjectZoneController.state.value,
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

const actionList = (id: number, deleteProjectZone: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/organization/project-zone/${id}`,
    permission: [
      PermissionsEnum.PROJECT_ZONE_UPDATE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.PROJECT_ZONE_ALL,
    ],
  },
  // {
  //   text: t('add_sub_ProjectZone'),
  //   icon: IconEdit,
  //   link: `/organization/project-zone/add/${id}`,
  //   permission: [
  //     PermissionsEnum.PROJECT_ZONE_UPDATE,
  //     PermissionsEnum.ADMIN,
  //     PermissionsEnum.PROJECT_ZONE_ALL,
  //   ],
  // },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteProjectZone(id),
    permission: [
      PermissionsEnum.PROJECT_ZONE_DELETE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.PROJECT_ZONE_ALL,
    ],
  },
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchProjectZone())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchProjectZone"
      />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel />
      <ExportPdf />
      <permission-builder :code="[PermissionsEnum.ADMIN, PermissionsEnum.PROJECT_ZONE_CREATE]">
        <router-link to="/organization/project-zone/add" class="btn btn-primary">
          {{ $t('Add_Porject_Zone') }}
        </router-link>
      </permission-builder>
    </div>
  </div>

  <permission-builder
    :code="[
      PermissionsEnum.WEBSITE,
      PermissionsEnum.PROJECT_ZONE_ALL,
      PermissionsEnum.PROJECT_ZONE_DELETE,
      PermissionsEnum.PROJECT_ZONE_FETCH,
      PermissionsEnum.PROJECT_ZONE_UPDATE,
      PermissionsEnum.PROJECT_ZONE_CREATE,
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
                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/admin/ProjectZone/${item.id}`">{{ index + 1 }} </router-link>
                </td>
                <td data-label="title">{{ wordSlice(item.title) }}</td>
                <!-- <td data-label="subtitle">{{ wordSlice(item.subtitle) }}</td> -->

                <!-- <td data-label="status">
                  <permission-builder
                    :code="[
                      PermissionsEnum.WEBSITE,
                      PermissionsEnum.ABOUT_US_FEATURE_ALL,
                      PermissionsEnum.ABOUT_US_FEATURE_CHANGE_STATUS,
                    ]"
                  >
                    <ToggleSwitch
                      :modelValue="item.is_active === 1"
                      binary
                      @update:model-value="changeStatusProjectZone(item.id)"
                    />
                  </permission-builder>
                </td> -->

                <td data-label="Actions">
                  <DropList
                    :actionList="actionList(item.id, deleteProjectZone)"
                    @delete="deleteProjectZone(item.id)"
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
          addText="Add ProjectZone"
          description="Sorry .. You have no ProjectZone .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No ProjectZone"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/admin/about-us-features/add`"
          addText="Add ProjectZone"
          description="Sorry .. You have no ProjectZone .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No ProjectZone"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no ProjectZone .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </permission-builder>
</template>

<style scoped></style>
