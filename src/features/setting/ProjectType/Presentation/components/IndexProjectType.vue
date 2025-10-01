<script lang="ts" setup>
import IndexProjectTypeParams from '@/features/setting/ProjectType/Core/params/indexProjectTypeParams'
import IndexProjectTypeController from '@/features/setting/ProjectType/Presentation/controllers/indexProjectTypeController'

import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import wordSlice from '@/base/Presentation/utils/word_slice'

// import IconRemoveInput from '@/shared/icons/IconRemoveInput.vue'
import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'
import DeleteProjectTypeController from '@/features/setting/ProjectType/Presentation/controllers/deleteProjectTypeController'
import DeleteProjectTypeParams from '@/features/setting/ProjectType/Core/params/deleteProjectTypeParams'
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

const { t } = useI18n()

// import DialogChangeStatusProjectType from "@/features/setting/ProjectTypeuages/Presentation/components/ProjectType/DialogChangeStatusProjectType.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexProjectTypeController = IndexProjectTypeController.getInstance()
const state = ref(indexProjectTypeController.state.value)
const route = useRoute()
const id = route.params.parent_id
// const type = ref<ProjectTypeStatusEnum>(ProjectTypeStatusEnum[route.params.type as keyof typeof ProjectTypeStatusEnum])

const fetchProjectType = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteProjectTypeParams = new IndexProjectTypeParams(query, pageNumber, perPage, withPage, id)
  await indexProjectTypeController.getData(deleteProjectTypeParams)
}

onMounted(() => {
  fetchProjectType()
})

const searchProjectType = debounce(() => {
  fetchProjectType(word.value)
})

const deleteProjectType = async (id: number) => {
  const deleteProjectTypeParams = new DeleteProjectTypeParams(id)
  await DeleteProjectTypeController.getInstance().deleteProjectType(deleteProjectTypeParams)
  await fetchProjectType()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchProjectType('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchProjectType('', currentPage.value, countPerPage.value)
}

watch(
  () => indexProjectTypeController.state.value,
  (newState) => {
    if (newState) {
      // console.log(newState)
      state.value = newState
    }
  },
  {
    deep: true,
  },
)

const actionList = (id: number, deleteProjectType: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/admin/project-type/${id}`,
    permission: [
      PermissionsEnum.PROJECT_TYPE_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.PROJECT_TYPE_ALL,
    ],
  },
  // {
  //   text: t('add_sub_PROJECT_type'),
  //   icon: IconEdit,
  //   link: `/admin/Project-type/add/${id}`,
  //   permission: [
  //     PermissionsEnum.PROJECT_TYPE_UPDATE,
  //     PermissionsEnum.ADMIN,
  //     PermissionsEnum.PROJECT_TYPE_ALL,
  //   ],
  // },
  // {
  //   text: t('sub_PROJECT_types'),
  //   icon: IconEdit,
  //   link: `/admin/Project-types/${id}`,
  //   permission: [
  //     PermissionsEnum.PROJECT_TYPE_UPDATE,
  //     PermissionsEnum.ADMIN,
  //     PermissionsEnum.PROJECT_TYPE_ALL,
  //   ],
  // },
  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteProjectType(id),
    permission: [
      PermissionsEnum.PROJECT_TYPE_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.PROJECT_TYPE_ALL,
    ],
  },
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchProjectType())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchProjectType"
      />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel :data="state.data" />
      <ExportPdf />
      <permission-builder :code="[PermissionsEnum.ADMIN, PermissionsEnum.PROJECT_TYPE_CREATE]">
        <router-link to="/admin/project-type/add" class="btn btn-primary">
          {{ $t('Add_ProjectType') }}
        </router-link>
      </permission-builder>
    </div>
  </div>

  <permission-builder
    :code="[
      PermissionsEnum.ADMIN,
      PermissionsEnum.PROJECT_TYPE_ALL,
      PermissionsEnum.PROJECT_TYPE_DELETE,
      PermissionsEnum.PROJECT_TYPE_FETCH,
      PermissionsEnum.PROJECT_TYPE_UPDATE,
      PermissionsEnum.PROJECT_TYPE_CREATE,
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
                <th scope="col">{{ $t('all_industries') }}</th>
                <th scope="col">{{ $t('industries') }}</th>
                <th scope="col">{{ $t('image') }}</th>

                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/admin/Project-type/${item.id}`">{{ index + 1 }} </router-link>
                </td>
                <td data-label="Name">{{ wordSlice(item.title) }}</td>
                <td data-label="all_industries">{{ item.allIndustries ? $t('yes') : $t('no') }}</td>
                <td data-label="all_industries">
                  {{
                    item.industries.length > 0
                      ? item.industries.map((industry) => industry.title).join(', ')
                      : '---'
                  }}
                </td>
                <td data-label="all_industries">
                  <img :src="item.image" @error="setDefaultImage($event)" alt="" />
                </td>

                <td data-label="Actions">
                  <!--                <DialogChangeStatusProjectType-->
                  <!--                  v-if="item.ProjectTypeStatus === ProjectTypeStatusEnum.Draft"-->
                  <!--                  :ProjectTypeId="item.id"-->
                  <!--                  @ProjectTypeChangeStatus="fetchProjectType"-->
                  <!--                />-->

                  <DropList
                    :actionList="actionList(item.id, deleteProjectType)"
                    @delete="deleteProjectType(item.id)"
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
          :link="`/add/ProjectType`"
          addText="Add ProjectType"
          description="Sorry .. You have no ProjectTypeuages .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No ProjectTypeuages"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/add/ProjectType`"
          addText="Add ProjectType"
          description="Sorry .. You have no ProjectTypeuage .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No ProjectTypeuages"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no ProjectTypeuage .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </permission-builder>
</template>

<style scoped></style>
