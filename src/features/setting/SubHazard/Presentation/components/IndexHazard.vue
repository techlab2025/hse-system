<script lang="ts" setup>
import IndexHazardTypeParams from '@/features/setting/HazardType/Core/params/indexHazardTypeParams'
import IndexHazardTypeController from '@/features/setting/HazardType/Presentation/controllers/indexHazardTypeController'

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
import DeleteHazardTypeController from '@/features/setting/HazardType/Presentation/controllers/deleteHazardTypeController'
import DeleteHazardTypeParams from '@/features/setting/HazardType/Core/params/deleteHazardTypeParams'
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
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import ShowProjectIcon from '@/shared/icons/ShowProjectIcon.vue'
import { HazardTypeParentEnum } from '../../Core/Enums/HazardTypeEnum'

const { t } = useI18n()
const route = useRoute()


const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexHazardTypeController = IndexHazardTypeController.getInstance()
const state = ref(indexHazardTypeController.state.value)
// const parent_id = ref(route.params.parent_id)
const fetchHazardType = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
  parent_id?: number = route.query.hazardType || null,
  parent_type?: HazardTypeParentEnum = HazardTypeParentEnum.Child,
) => {
  const deleteHazardTypeParams = new IndexHazardTypeParams(query, pageNumber, perPage, withPage, Number(route.query.hazardType), parent_type)
  await indexHazardTypeController.getData(deleteHazardTypeParams)
}

onMounted(() => {
  fetchHazardType()
})

const searchHazardType = debounce(() => {
  fetchHazardType(word.value, currentPage.value, countPerPage.value, 1, null, HazardTypeParentEnum.Child)
})

const deleteHazardType = async (id: number) => {
  const deleteHazardTypeParams = new DeleteHazardTypeParams(id)
  await DeleteHazardTypeController.getInstance().deleteHazardType(deleteHazardTypeParams)
  await fetchHazardType()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchHazardType('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchHazardType('', currentPage.value, countPerPage.value)
}

watch(
  () => indexHazardTypeController.state.value,
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

const { user } = useUserStore()


const HazardactionList = (id: number, deleteHazardType: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/hazard/${id}`,
    permission: [
      PermissionsEnum.ORG_HAZARD_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ORG_HAZARD_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteHazardType(id),
    permission: [
      PermissionsEnum.ORG_HAZARD_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ORG_HAZARD_ALL,
    ],
  },
]

watch(() => route.params.parent_id, (newVal) => {
  // ParentId = newVal
  fetchHazardType('', currentPage.value, countPerPage.value, 1, null, HazardTypeParentEnum?.Child)
})


</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4 mt-2">
    <div class="input-search col-span-1">
      <span class="icon-remove" @click="((word = ''), searchHazardType())">
        <Search />
      </span>
      <input v-model="word" :placeholder="'search'" class="input" type="text" @input="searchHazardType" />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel :data="state.data" />
      <ExportPdf />
      <PermissionBuilder :code="[
        PermissionsEnum.ADMIN,
        PermissionsEnum.ORGANIZATION_EMPLOYEE,
        PermissionsEnum.ORG_HAZARD_CREATE,
        PermissionsEnum.ORG_HAZARD_ALL,
      ]">
        <router-link :to="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/hazard/add`"
          class="btn btn-primary">
          {{ $t('Add_Hazard') }}
        </router-link>
      </PermissionBuilder>
    </div>
  </div>

  <PermissionBuilder :code="[
    PermissionsEnum.ADMIN,
    PermissionsEnum.ORGANIZATION_EMPLOYEE,
    PermissionsEnum.ORG_HAZARD_ALL,
    PermissionsEnum.ORG_HAZARD_DELETE,
    PermissionsEnum.ORG_HAZARD_FETCH,
    PermissionsEnum.ORG_HAZARD_UPDATE,
    PermissionsEnum.ORG_HAZARD_CREATE,
  ]">
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive">
          <table class="main-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{{ $t('title') }}</th>
                <!--                <th scope="col">{{ $t('has_certificate') }}</th>-->
                <th scope="col" v-if="user?.type === OrganizationTypeEnum?.ADMIN">{{ $t('all_industries') }}</th>
                <th scope="col" v-if="user?.type === OrganizationTypeEnum?.ADMIN">{{ $t('industries') }}</th>
                <th scope="col">{{ $t('hazard_type') }}</th>

                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link
                    :to="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/hazard-type/${item.id}`">{{
                      index + 1 }}
                  </router-link>
                </td>
                <td data-label="Name">{{ wordSlice(item.title) }}</td>
                <td data-label="all_industries" v-if="user?.type === OrganizationTypeEnum?.ADMIN">{{ item.allIndustries
                  ? $t('yes') : $t('no') }}</td>
                <td data-label="all_industries" v-if="user?.type === OrganizationTypeEnum?.ADMIN">
                  {{
                    item.industries.length > 0
                      ? item.industries.map((industry) => industry.title).join(', ')
                      : '---'
                  }}
                </td>
                <!-- <td data-label="all_industries">
                  <img :src="item.image" @error="setDefaultImage($event)" alt="" />
                </td> -->

                <td data-label="hazard_type">
                  {{ item?.parent?.title }}
                </td>
                <td data-label="Actions">
                  <!--                <DialogChangeStatusHazardType-->
                  <!--                  v-if="item.HazardTypeStatus === HazardTypeStatusEnum.Draft"-->
                  <!--                  :HazardTypeId="item.id"-->
                  <!--                  @HazardTypeChangeStatus="fetchHazardType"-->
                  <!--                />-->


                  <DropList :actionList="HazardactionList(item.id, deleteHazardType)"
                    @delete="deleteHazardType(item.id)" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination :pagination="state.pagination" @changePage="handleChangePage" @countPerPage="handleCountPerPage" />
      </template>
      <template #loader>
        <TableLoader :cols="3" :rows="10" />
      </template>
      <template #initial>
        <TableLoader :cols="3" :rows="10" />
      </template>
      <template #empty>
        <PermissionBuilder :code="[
          PermissionsEnum.ADMIN,
          PermissionsEnum.ORGANIZATION_EMPLOYEE,
          PermissionsEnum.ORG_HAZARD_CREATE,
          PermissionsEnum.ORG_HAZARD_ALL,
        ]">
          <DataEmpty :link="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/hazard/add`"
            addText="Add Hazard"
            description="Sorry .. You have no Hazard .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No Hazard" />
        </PermissionBuilder>
      </template>
      <template #failed>
        <PermissionBuilder :code="[
          PermissionsEnum.ADMIN,
          PermissionsEnum.ORGANIZATION_EMPLOYEE,
          PermissionsEnum.ORG_HAZARD_CREATE,
          PermissionsEnum.ORG_HAZARD_ALL,
        ]">
          <DataFailed :link="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/hazard/add`"
            addText="Add Hazard"
            description="Sorry .. You have no Hazard .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No Hazard" />
        </PermissionBuilder>
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed addText="Have not  Permission"
        description="Sorry .. You have no Hazard .. All your joined customers will appear here when you add your customer data" />
    </template>
  </PermissionBuilder>
</template>

<style scoped></style>
