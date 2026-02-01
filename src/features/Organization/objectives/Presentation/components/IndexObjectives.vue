<script lang="ts" setup>
// import IndexObjectivesTypeParams from '@/features/setting/ObjectivesType/Core/params/indexObjectivesTypeParams'
// import IndexObjectivesTypeController from '@/features/setting/ObjectivesType/Presentation/controllers/indexObjectivesTypeController'

import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import wordSlice from '@/base/Presentation/utils/word_slice'

import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
// import IconRemoveInput from '@/shared/icons/IconRemoveInput.vue'
import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'
// import DeleteObjectivesTypeController from '@/features/setting/ObjectivesType/Presentation/controllers/deleteObjectivesTypeController'
// import DeleteObjectivesTypeParams from '@/features/setting/ObjectivesType/Core/params/deleteObjectivesTypeParams'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
// import ExportIcon from '@/shared/icons/ExportIcon.vue'
import ExportExcel from '@/shared/HelpersComponents/ExportExcel.vue'
import Search from '@/shared/icons/Search.vue'
import { useUserStore } from '@/stores/user'
import IndexObjectivesController from '../controllers/indexObjectivesController'
import IndexObjectivesParams from '../../Core/params/indexObjectivesParams'
import DeleteObjectivesParams from '../../Core/params/deleteObjectivesParams'
import DeleteObjectivesController from '../controllers/deleteObjectivesController'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'

const { t } = useI18n()

// import DialogChangeStatusObjectivesType from "@/features/setting/ObjectivesTypes/Presentation/components/ObjectivesType/DialogChangeStatusObjectivesType.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexObjectivesController = IndexObjectivesController.getInstance()
const state = ref(indexObjectivesController.state.value)
const route = useRoute()
let id = route.params.id
// const type = ref<ObjectivesTypeStatusEnum>(ObjectivesTypeStatusEnum[route.params.type as keyof typeof ObjectivesTypeStatusEnum])

const fetchObjectives = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteObjectivesTypeParams = new IndexObjectivesParams(query, pageNumber, perPage, withPage)
  await indexObjectivesController.getData(deleteObjectivesTypeParams)
}

onMounted(() => {
  fetchObjectives()
})

const searchObjectivesType = debounce(() => {
  fetchObjectives(word.value)
})

const deleteObjectives = async (id: number) => {
  const deleteObjectivesParams = new DeleteObjectivesParams(id)
  await DeleteObjectivesController.getInstance().deleteObjectives(deleteObjectivesParams)
  await fetchObjectives()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchObjectives('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchObjectives('', currentPage.value, countPerPage.value)
}

watch(
  () => indexObjectivesController.state.value,
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

const { user } = useUserStore()

const actionList = (id: number, deleteObjectives: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `organization/objectives/${id}`,
    permission: [
      PermissionsEnum.OBJECTIVE_ORG_UPDATE,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.OBJECTIVE_ORG_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteObjectives(id),
    permission: [
      PermissionsEnum.OBJECTIVE_ORG_DELETE,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.OBJECTIVE_ORG_ALL,
    ],
  },
]

watch(
  () => route?.params?.id,
  (Newvalue) => {
    id = Newvalue
    fetchObjectives()
  },
)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchObjectivesType())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchObjectivesType"
      />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel :data="state.data" />
      <ExportPdf />
      <permission-builder
        :code="[PermissionsEnum.ORGANIZATION_EMPLOYEE, PermissionsEnum.OBJECTIVE_ORG_CREATE]"
      >
        <router-link :to="`/organization/objectives/add`" class="btn btn-primary">
          {{ $t('Add_Objectives') }}
        </router-link>
      </permission-builder>
    </div>
  </div>

  <permission-builder
    :code="[
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.OBJECTIVE_ORG_ALL,
      PermissionsEnum.OBJECTIVE_ORG_DELETE,
      PermissionsEnum.OBJECTIVE_ORG_FETCH,
      PermissionsEnum.OBJECTIVE_ORG_UPDATE,
      PermissionsEnum.OBJECTIVE_ORG_CREATE,
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
                  <router-link :to="`/organization/objectives/${item.id}`"
                    >{{ index + 1 }}
                  </router-link>
                </td>
                <td data-label="Name">{{ wordSlice(item?.title) }}</td>

                <td data-label="Actions">
                  <DropList
                    :actionList="actionList(item.id, deleteObjectives)"
                    @delete="deleteObjectives(item.id)"
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
          :link="`/organization/Objectives/add`"
          addText="Add Objectives"
          description="Sorry .. You have no Objectives .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Objectives"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/organization/objectives/add`"
          addText="Add Objectives"
          description="Sorry .. You have no Objectives .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Objectives"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no Objectives .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </permission-builder>
</template>

<style scoped></style>
