<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import wordSlice from '@/base/Presentation/utils/word_slice'

import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
// import IconRemoveInput from '@/shared/icons/IconRemoveInput.vue'
import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
// import ExportIcon from '@/shared/icons/ExportIcon.vue'
import ExportExcel from '@/shared/HelpersComponents/ExportExcel.vue'
// import SaveIcon from '@/shared/icons/SaveIcon.vue'
import Search from '@/shared/icons/Search.vue'
// import { setDefaultImage } from '@/base/Presentation/utils/set_default_image.ts'
import IndexAccidentsTypeParams from '../../Core/params/indexAccidentsTypeParams'
import IndexAccidentsTypeController from '../controllers/indexAccidentsTypeController'
import DeleteAccidentsTypeParams from '../../Core/params/deleteAccidentsTypeParams'
import DeleteAccidentsTypeController from '../controllers/deleteAccidentsTypeController'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'

const { t } = useI18n()

const { user } = useUserStore()

// import DialogChangeStatusAccidentType from "@/features/setting/AccidentType/Presentation/components/AccidentType/DialogChangeStatusAccidentType.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexAccidentsTypeController = IndexAccidentsTypeController.getInstance()
const state = ref(indexAccidentsTypeController.state.value)
const route = useRoute()
const id = route.params.parent_id
// const type = ref<AccidentTypeStatusEnum>(AccidentTypeStatusEnum[route.params.type as keyof typeof AccidentTypeStatusEnum])

const fetchAccidentsType = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const indexAccidentsTypeParams = new IndexAccidentsTypeParams(
    query,
    pageNumber,
    perPage,
    withPage,
    id,
  )
  await indexAccidentsTypeController.getData(indexAccidentsTypeParams)
}

onMounted(() => {
  fetchAccidentsType()
})

const searchAccidentType = debounce(() => {
  fetchAccidentsType(word.value)
})

const deleteAccidentsType = async (id: number) => {
  const deleteAccidentsTypeParams = new DeleteAccidentsTypeParams(id)
  await DeleteAccidentsTypeController.getInstance().deleteAccidentsType(deleteAccidentsTypeParams)
  await fetchAccidentsType()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchAccidentsType('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchAccidentsType('', currentPage.value, countPerPage.value)
}

watch(
  () => indexAccidentsTypeController.state.value,
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

const actionList = (id: number, deleteAccidentType: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/accidents-type/${id}`,
    permission: [
      PermissionsEnum.ACCIDENTS_TYPE_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ACCIDENTS_TYPE_ALL,
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
    action: () => deleteAccidentType(id),
    permission: [
      PermissionsEnum.ACCIDENTS_TYPE_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ACCIDENTS_TYPE_ALL,
    ],
  },
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchAccidentType())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchAccidentType"
      />
    </div>
    <PermissionBuilder :code="[PermissionsEnum.ACCIDENTS_TYPE_CREATE]">
      <div class="col-span-2 flex justify-end gap-2">
        <ExportExcel :data="state.data" />
        <ExportPdf />
        <router-link
          :to="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/accidents-type/add`"
          class="btn btn-primary"
        >
          {{ $t('Add_AccidentsType') }}
        </router-link>
      </div>
    </PermissionBuilder>
  </div>

  <PermissionBuilder
    :code="[
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ACCIDENTS_TYPE_ALL,
      PermissionsEnum.ACCIDENTS_TYPE_DELETE,
      PermissionsEnum.ACCIDENTS_TYPE_FETCH,
      PermissionsEnum.ACCIDENTS_TYPE_UPDATE,
      PermissionsEnum.ACCIDENTS_TYPE_CREATE,
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
                <!-- <th scope="col">{{ $t('image') }}</th> -->

                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link
                    :to="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/accidents-type/${item.id}`"
                    >{{ index + 1 }}
                  </router-link>
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
                <!-- <td data-label="all_industries">
                  <img :src="item.image" @error="setDefaultImage($event)" alt="" />
                </td> -->

                <td data-label="Actions">
                  <!--                <DialogChangeStatusAccidentType-->
                  <!--                  v-if="item.AccidentTypeStatus === AccidentTypeStatusEnum.Draft"-->
                  <!--                  :AccidentTypeId="item.id"-->
                  <!--                  @AccidentTypeChangeStatus="fetchAccidentType"-->
                  <!--                />-->

                  <DropList
                    :actionList="actionList(item.id, deleteAccidentsType)"
                    @delete="deleteAccidentsType(item.id)"
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
          :link="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/add/accidents-type`"
          addText="Add AccidentType"
          description="Sorry .. You have no AccidentType .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No AccidentType"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/add/accidents-type`"
          addText="Add AccidentType"
          description="Sorry .. You have no AccidentType .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No AccidentType"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no AccidentTypeuage .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </PermissionBuilder>
</template>

<style scoped></style>
