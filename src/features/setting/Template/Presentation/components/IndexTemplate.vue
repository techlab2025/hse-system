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
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import ExportIcon from '@/shared/icons/ExportIcon.vue'
import ExportExcel from '@/shared/HelpersComponents/ExportExcel.vue'
import SaveIcon from '@/shared/icons/SaveIcon.vue'
import Search from '@/shared/icons/Search.vue'
// import { setDefaultImage } from '@/base/Presentation/utils/set_default_image.ts'
import IndexTemplateController from '../controllers/indexTemplateController'
import IndexTemplateParams from '../../Core/params/indexTemplateParams'
import DeleteTemplateParams from '../../Core/params/deleteTemplateParams'
import DeleteTemplateController from '../controllers/deleteTemplateController'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { useUserStore } from '@/stores/user'

const { t } = useI18n()

// import DialogChangeStatusTemplate from "@/features/setting/Templateuages/Presentation/components/Template/DialogChangeStatusTemplate.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexTemplateController = IndexTemplateController.getInstance()
const state = ref(indexTemplateController.state.value)
const route = useRoute()
const id = route.params.parent_id
// const type = ref<TemplateStatusEnum>(TemplateStatusEnum[route.params.type as keyof typeof TemplateStatusEnum])

const fetchTemplate = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteTemplateParams = new IndexTemplateParams(query, pageNumber, perPage, withPage, id)
  await indexTemplateController.getData(deleteTemplateParams)
}

onMounted(() => {
  fetchTemplate()
})

const searchTemplate = debounce(() => {
  fetchTemplate(word.value)
})

const deleteTemplate = async (id: number) => {
  const deleteTemplateParams = new DeleteTemplateParams(id)
  await DeleteTemplateController.getInstance().deleteTemplate(deleteTemplateParams)
  await fetchTemplate()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchTemplate('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchTemplate('', currentPage.value, countPerPage.value)
}

watch(
  () => indexTemplateController.state.value,
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

const actionList = (id: number, deleteTemplate: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/template/${id}`,
    permission: [
      PermissionsEnum.TEMPLATE_UPDATE,
      PermissionsEnum.ORG_TEMPLATE_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.TEMPLATE_ALL,
      PermissionsEnum.ORG_TEMPLATE_ALL,
    ],
  },
  {
    text: t('add_template_item'),
    icon: IconEdit,
    link: `/admin/template-item/add/${id}`,
    permission: [
      PermissionsEnum.ADMIN,
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
    action: () => deleteTemplate(id),
    permission: [
      PermissionsEnum.TEMPLATE_DELETE,
      PermissionsEnum.ORG_TEMPLATE_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.TEMPLATE_ALL,
      PermissionsEnum.ORG_TEMPLATE_ALL,
    ],
  },
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchTemplate())">
        <Search />
      </span>
      <input v-model="word" :placeholder="'search'" class="input" type="text" @input="searchTemplate" />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel :data="state.data" />
      <ExportPdf />
      <PermissionBuilder :code="[
        PermissionsEnum.ADMIN,
        PermissionsEnum.TEMPLATE_CREATE,
        PermissionsEnum.ORG_TEMPLATE_CREATE,
        PermissionsEnum.ORGANIZATION_EMPLOYEE,
      ]">
        <router-link :to="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/template/add`"
          class="btn btn-primary">
          {{ $t('Add_Template') }}
        </router-link>
      </PermissionBuilder>
    </div>
  </div>

  <PermissionBuilder :code="[
    PermissionsEnum.ADMIN,
    PermissionsEnum.ORGANIZATION_EMPLOYEE,
    PermissionsEnum.TEMPLATE_ALL,
    PermissionsEnum.TEMPLATE_DELETE,
    PermissionsEnum.TEMPLATE_FETCH,
    PermissionsEnum.TEMPLATE_UPDATE,
    PermissionsEnum.TEMPLATE_CREATE,

    PermissionsEnum.ORG_TEMPLATE_ALL,
    PermissionsEnum.ORG_TEMPLATE_DELETE,
    PermissionsEnum.ORG_TEMPLATE_FETCH,
    PermissionsEnum.ORG_TEMPLATE_UPDATE,
    PermissionsEnum.ORG_TEMPLATE_CREATE,
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

                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link
                    :to="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/template/${item.id}`">{{
                    index + 1 }}
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

                <td data-label="Actions">
                  <!--                <DialogChangeStatusTemplate-->
                  <!--                  v-if="item.TemplateStatus === TemplateStatusEnum.Draft"-->
                  <!--                  :TemplateId="item.id"-->
                  <!--                  @TemplateChangeStatus="fetchTemplate"-->
                  <!--                />-->

                  <DropList :actionList="actionList(item.id, deleteTemplate)" @delete="deleteTemplate(item.id)" />
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
        <DataEmpty :link="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/add/template`"
          addText="Add Template"
          description="Sorry .. You have no Template .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Template" />
      </template>
      <template #failed>
        <DataFailed :link="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/add/template`"
          addText="Add Template"
          description="Sorry .. You have no Template .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Template" />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed addText="Have not  Permission"
        description="Sorry .. You have no Template .. All your joined customers will appear here when you add your customer data" />
    </template>
  </PermissionBuilder>
</template>

<style scoped></style>
