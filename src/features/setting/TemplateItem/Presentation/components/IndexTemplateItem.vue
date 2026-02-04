<script lang="ts" setup>
// import IndexTemplateItemTypeParams from '@/features/setting/TemplateItemType/Core/params/indexTemplateItemTypeParams'
// import IndexTemplateItemTypeController from '@/features/setting/TemplateItemType/Presentation/controllers/indexTemplateItemTypeController'

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
// import DeleteTemplateItemTypeController from '@/features/setting/TemplateItemType/Presentation/controllers/deleteTemplateItemTypeController'
// import DeleteTemplateItemTypeParams from '@/features/setting/TemplateItemType/Core/params/deleteTemplateItemTypeParams'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
// import { PermissionsEnum } from '@/features/users/employee/Core/Enum/permission_enum.ts'
// import ExportIcon from '@/shared/icons/ExportIcon.vue'
import ExportExcel from '@/shared/HelpersComponents/ExportExcel.vue'
import SaveIcon from '@/shared/icons/SaveIcon.vue'
import Search from '@/shared/icons/Search.vue'
import IndexTemplateItemController from '../controllers/indexTemplateItemController'
import IndexTemplateItemParams from '../../Core/params/indexTemplateItemParams'
import DeleteTemplateItemParams from '../../Core/params/deleteTemplateItemParams'
import DeleteTemplateItemController from '../controllers/deleteTemplateItemController'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'

const { t } = useI18n()

// import DialogChangeStatusTemplateItemType from "@/features/setting/TemplateItemTypes/Presentation/components/TemplateItemType/DialogChangeStatusTemplateItemType.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexTemplateItemController = IndexTemplateItemController.getInstance()
const state = ref(indexTemplateItemController.state.value)
const route = useRoute()
let id = route.params.id
// const type = ref<TemplateItemTypeStatusEnum>(TemplateItemTypeStatusEnum[route.params.type as keyof typeof TemplateItemTypeStatusEnum])

const fetchTemplateItem = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteTemplateItemTypeParams = new IndexTemplateItemParams(
    query,
    pageNumber,
    perPage,
    withPage,
    id,
  )
  await indexTemplateItemController.getData(deleteTemplateItemTypeParams)
}

onMounted(() => {
  fetchTemplateItem()
})

const searchTemplateItemType = debounce(() => {
  fetchTemplateItem(word.value)
})

const deleteTemplateItem = async (id: number) => {
  const deleteTemplateItemParams = new DeleteTemplateItemParams(id)
  await DeleteTemplateItemController.getInstance().deleteTemplateItem(deleteTemplateItemParams)
  await fetchTemplateItem()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchTemplateItem('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchTemplateItem('', currentPage.value, countPerPage.value)
}

watch(
  () => indexTemplateItemController.state.value,
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

const actionList = (id: number, deleteTemplateItem: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/template-item/${id}`,
    permission: [
      PermissionsEnum.ADMIN,
    ],
  },
  // {
  //   text: t('add_sub_equipment'),
  //   icon: IconEdit,
  //   link: `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/equipment/add/${id}`,
  //   permission: [
  //     PermissionsEnum.EQUIPMENT_UPDATE,
  //     PermissionsEnum.ADMIN,
  //     PermissionsEnum.ORGANIZATION_EMPLOYEE,
  //     PermissionsEnum.EQUIPMENT_ALL,
  //   ],
  // },
  // {
  //   text: t('sub_equipment'),
  //   icon: IconEdit,
  //   link: `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/equipments/${id}`,
  //   permission: [
  //     PermissionsEnum.EQUIPMENT_UPDATE,
  //     PermissionsEnum.ADMIN,
  //     PermissionsEnum.ORGANIZATION_EMPLOYEE,
  //     PermissionsEnum.EQUIPMENT_ALL,
  //   ],
  // },
  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteTemplateItem(id),
    permission: [
      PermissionsEnum.ADMIN,
    ],
  },
]

watch(
  () => route?.params?.id,
  (Newvalue) => {
    id = Newvalue
    fetchTemplateItem()
  },
)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchTemplateItemType())">
        <Search />
      </span>
      <input v-model="word" :placeholder="'search'" class="input" type="text" @input="searchTemplateItemType" />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <!-- <ExportExcel :data="state.data" /> -->
      <ExportPdf />
      <permission-builder :code="[
        PermissionsEnum.ADMIN,
        PermissionsEnum.TEMPLATE_ITEM_ALL,
        PermissionsEnum.TEMPLATE_ITEM_CREATE,
        PermissionsEnum.TEMPLATE_ITEM_DELETE,
        PermissionsEnum.TEMPLATE_ITEM_FETCH,
        PermissionsEnum.TEMPLATE_ITEM_UPDATE,
      ]">
        <!-- <router-link :to="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/template-item/add`"
          class="btn btn-primary">
          {{ $t('Add_TemplateItem') }}
        </router-link> -->
      </permission-builder>
    </div>
  </div>

  <permission-builder :code="[
    PermissionsEnum.ADMIN,
    PermissionsEnum.TEMPLATE_ITEM_ALL,
    PermissionsEnum.TEMPLATE_ITEM_CREATE,
    PermissionsEnum.TEMPLATE_ITEM_DELETE,
    PermissionsEnum.TEMPLATE_ITEM_FETCH,
    PermissionsEnum.TEMPLATE_ITEM_UPDATE,
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
                <th scope="col">{{ $t('all_industries') }}</th>
                <th scope="col">{{ $t('industries') }}</th>

                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link
                    :to="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/equipment/edit/${item.id}`">{{
                      index + 1 }}
                  </router-link>
                </td>
                <td data-label="Name">{{ wordSlice(item.title) }}</td>
                <td data-label="all_industries">{{ item.allIndustries ? $t('yes') : $t('no') }}</td>
                <td data-label="industries">
                  {{
                    item.industries.length > 0
                      ? item.industries.map((industry) => industry.title).join(', ')
                      : $t('no')
                  }}
                </td>


                <td data-label="Actions">
                  <!--                <DialogChangeStatusTemplateItemType-->
                  <!--                  v-if="item.TemplateItemTypeStatus === TemplateItemTypeStatusEnum.Draft"-->
                  <!--                  :TemplateItemTypeId="item.id"-->
                  <!--                  @TemplateItemTypeChangeStatus="fetchTemplateItemType"-->
                  <!--                />-->

                  <DropList :actionList="actionList(item.id, deleteTemplateItem)"
                    @delete="deleteTemplateItem(item.id)" />
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
        <DataEmpty
          :link="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/add/TemplateItemType`"
          addText="Add TemplateItemType"
          description="Sorry .. You have no TemplateItemTypes .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No TemplateItemTypes" />
      </template>
      <template #failed>
        <DataFailed
          :link="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/add/TemplateItemType`"
          addText="Add TemplateItemType"
          description="Sorry .. You have no TemplateItemType .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No TemplateItemTypes" />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed addText="Have not  Permission"
        description="Sorry .. You have no TemplateItemType .. All your joined customers will appear here when you add your customer data" />
    </template>
  </permission-builder>
</template>

<style scoped></style>
