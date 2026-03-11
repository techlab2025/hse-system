<script lang="ts" setup>
import IndexObserverationTypeParams from '@/features/setting/ObserverationType/Core/params/indexObserverationTypeParams'
import IndexObserverationTypeController from '@/features/setting/ObserverationType/Presentation/controllers/indexObserverationTypeController'

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
import DeleteObserverationTypeController from '@/features/setting/ObserverationType/Presentation/controllers/deleteObserverationTypeController'
import DeleteObserverationTypeParams from '@/features/setting/ObserverationType/Core/params/deleteObserverationTypeParams'
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
import ActionsTableEdit from '@/shared/icons/ActionsTableEdit.vue'
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import SystemObservationTypes from '../supcomponents/SystemObservationTypes.vue'
import ActionsList from '@/shared/HelpersComponents/ActionsList.vue'
import ExceIcon from '@/shared/icons/ExceIcon.vue'
import { ActionItemsTypeEnum } from '@/base/core/params/actions_items_type_enum'
import ActionsListAddIcon from '@/shared/icons/ActionsListAddIcon.vue'
import UploadExcelIcon from '@/shared/icons/UploadExcelIcon.vue'
const { t } = useI18n()

// import DialogChangeStatusObserverationType from "@/features/setting/ObserverationType/Presentation/components/ObserverationType/DialogChangeStatusObserverationType.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexObserverationTypeController = IndexObserverationTypeController.getInstance()
const state = ref(indexObserverationTypeController.state.value)
const route = useRoute()
const id = route.params.parent_id
// const type = ref<ObserverationTypeStatusEnum>(ObserverationTypeStatusEnum[route.params.type as keyof typeof ObserverationTypeStatusEnum])

const fetchObserverationType = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteObserverationTypeParams = new IndexObserverationTypeParams(query, pageNumber, perPage, withPage, id)
  await indexObserverationTypeController.getData(deleteObserverationTypeParams)
}

onMounted(() => {
  fetchObserverationType()
})

const searchObserverationType = debounce(() => {
  fetchObserverationType(word.value)
})

const deleteObserverationType = async (id: number) => {
  const deleteObserverationTypeParams = new DeleteObserverationTypeParams(id)
  await DeleteObserverationTypeController.getInstance().deleteObserverationType(deleteObserverationTypeParams)
  await fetchObserverationType()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchObserverationType('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchObserverationType('', currentPage.value, countPerPage.value)
}

watch(
  () => indexObserverationTypeController.state.value,
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

const actionList = (id: number, deleteObserverationType: (id: number) => void) => [
  {
    text: t('edit'),
    icon: ActionsTableEdit,
    link: `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/observation-type/${id}`,
    permission: [
      PermissionsEnum.OBSERVATION_TYPE_UPDATE,
      PermissionsEnum.ORG_OBSERVATION_TYPE_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.OBSERVATION_TYPE_ALL,
      PermissionsEnum.ORG_OBSERVATION_TYPE_ALL,
    ],
  },
  // {
  //   text: t('add_sub_OBSERVATION_type'),
  //   icon: IconEdit,
  //   link: `/admin/Hazard-type/add/${id}`,
  //   permission: [
  //     PermissionsEnum.OBSERVATION_TYPE_UPDATE,
  //     PermissionsEnum.ADMIN,
  //     PermissionsEnum.OBSERVATION_TYPE_ALL,
  //   ],
  // },
  // {
  //   text: t('sub_OBSERVATION_types'),
  //   icon: IconEdit,
  //   link: `/admin/Hazard-types/${id}`,
  //   permission: [
  //     PermissionsEnum.OBSERVATION_TYPE_UPDATE,
  //     PermissionsEnum.ADMIN,
  //     PermissionsEnum.OBSERVATION_TYPE_ALL,
  //   ],
  // },
  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteObserverationType(id),
    permission: [
      PermissionsEnum.OBSERVATION_TYPE_DELETE,
      PermissionsEnum.ORG_OBSERVATION_TYPE_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.OBSERVATION_TYPE_ALL,
      PermissionsEnum.ORG_OBSERVATION_TYPE_ALL,
    ],
  },
]

const exportExcel = () => {
  if (!state.value.data || state.value.data.length === 0) {
    alert("No data available to export");
    return;
  }
  const worksheetData = state.value.data.map(
    (item: Record<string, unknown>) => {
      const it = item as any;
      return {
        "title": it.title || "N/A",
      };
    },
  );
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, "observeration-type.xlsx");
};

const IndexObservationTypesactionList = () => [
  {
    text: t('export_excel'),
    icon: ExceIcon,
    action: () => exportExcel(),
    type: ActionItemsTypeEnum.Success,
    permission: [
      PermissionsEnum.OBSERVATION_TYPE_DETAILS,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.OBSERVATION_TYPE_ALL,
    ],
  },
  {
    text: t('add_observeration_type'),
    link: `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/observation-type/add`,
    icon: ActionsListAddIcon,
    type: ActionItemsTypeEnum.Info,
    permission: [
      PermissionsEnum?.ORGANIZATION_EMPLOYEE,
      PermissionsEnum?.OBSERVATION_TYPE_CREATE
    ],
  },
  {
    text: t('import_observeration_type'),
    type: ActionItemsTypeEnum.Warning,
    link: `/organization/observation-type/upload-excel`,
    icon: UploadExcelIcon,
    permission: [
      PermissionsEnum?.ORGANIZATION_EMPLOYEE,
      PermissionsEnum?.OBSERVATION_TYPE_CREATE
    ],
  },
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchObserverationType())">
        <Search />
      </span>
      <input v-model="word" :placeholder="'search'" class="input" type="text" @input="searchObserverationType" />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <!-- <ExportExcel :data="state.data" /> -->
      <!-- <ExportPdf />
      <button class="btn btn-secondary" @click="exportExcel">Export Excel</button>

      <PermissionBuilder :code="[
        PermissionsEnum.ADMIN,
        PermissionsEnum.ORGANIZATION_EMPLOYEE,
        PermissionsEnum.OBSERVATION_TYPE_CREATE,
        PermissionsEnum.ORG_OBSERVATION_TYPE_CREATE,
      ]">
        <router-link
          :to="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/observation-type/add`"
          class="btn btn-primary">
          {{ $t('add_observeration_type') }}
        </router-link>
      </PermissionBuilder>
      <PermissionBuilder :code="[
        PermissionsEnum.ADMIN,
        PermissionsEnum.ORGANIZATION_EMPLOYEE,
        PermissionsEnum.OBSERVATION_TYPE_CREATE,
        PermissionsEnum.ORG_OBSERVATION_TYPE_CREATE,
      ]" v-if="user?.type == OrganizationTypeEnum.ORGANIZATION">
        <router-link :to="`/organization/observation-type/upload-excel`" class="btn btn-primary">
          {{ $t('import_observeration_type') }}
        </router-link>
      </PermissionBuilder>
      <PermissionBuilder v-if="user?.type == OrganizationTypeEnum.ORGANIZATION"
        :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.OBSERVATION_TYPE_CREATE]">
        <SystemObservationTypes />
      </PermissionBuilder> -->
        <ActionsList :show-actions="true" :actionList="IndexObservationTypesactionList()" :actionsNumber="5">
        <template #custom>
          <SystemObservationTypes />
          <ExportPdf :isDropList="true" />
        </template>
      </ActionsList>
    </div>
  </div>

  <PermissionBuilder :code="[
    PermissionsEnum.ADMIN,
    PermissionsEnum.ORGANIZATION_EMPLOYEE,
    PermissionsEnum.OBSERVATION_TYPE_ALL,
    PermissionsEnum.OBSERVATION_TYPE_DELETE,
    PermissionsEnum.OBSERVATION_TYPE_FETCH,
    PermissionsEnum.OBSERVATION_TYPE_UPDATE,
    PermissionsEnum.OBSERVATION_TYPE_CREATE,
    PermissionsEnum.ORG_OBSERVATION_TYPE_ALL,
    PermissionsEnum.ORG_OBSERVATION_TYPE_DELETE,
    PermissionsEnum.ORG_OBSERVATION_TYPE_FETCH,
    PermissionsEnum.ORG_OBSERVATION_TYPE_UPDATE,
    PermissionsEnum.ORG_OBSERVATION_TYPE_CREATE,
  ]">
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive mt-2">
          <table class="main-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{{ $t('title') }}</th>
                <!--                <th scope="col">{{ $t('has_certificate') }}</th>-->
                <th scope="col" v-if="user?.type === OrganizationTypeEnum?.ADMIN">{{ $t('all_industries') }}</th>
                <th scope="col" v-if="user?.type === OrganizationTypeEnum?.ADMIN">{{ $t('industries') }}</th>
                <!-- <th scope="col">{{ $t('image') }}</th> -->

                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link
                    :to="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/observation-type/${item.id}`">{{
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

                <td data-label="Actions">
                  <!--                <DialogChangeStatusObserverationType-->
                  <!--                  v-if="item.ObserverationTypeStatus === ObserverationTypeStatusEnum.Draft"-->
                  <!--                  :ObserverationTypeId="item.id"-->
                  <!--                  @ObserverationTypeChangeStatus="fetchObserverationType"-->
                  <!--                />-->

                  <DropList :actionList="actionList(item.id, deleteObserverationType)"
                    @delete="deleteObserverationType(item.id)" />
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
          PermissionsEnum.OBSERVATION_TYPE_CREATE,
          PermissionsEnum.ORG_OBSERVATION_TYPE_CREATE,
        ]">
          <DataEmpty
            :link="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/observation-type/add`"
            addText="Add ObserverationType"
            description="Sorry .. You have no ObserverationType .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No ObserverationType" />
        </PermissionBuilder>
      </template>
      <template #failed>
        <PermissionBuilder :code="[
          PermissionsEnum.ADMIN,
          PermissionsEnum.ORGANIZATION_EMPLOYEE,
          PermissionsEnum.OBSERVATION_TYPE_CREATE,
          PermissionsEnum.ORG_OBSERVATION_TYPE_CREATE,
        ]">
          <DataFailed
            :link="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/observation-type/add`"
            addText="Add ObserverationType"
            description="Sorry .. You have no ObserverationType .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No ObserverationType" />
        </PermissionBuilder>
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed addText="Have not  Permission"
        description="Sorry .. You have no ObserverationType .. All your joined customers will appear here when you add your customer data" />
    </template>
  </PermissionBuilder>
</template>

<style scoped></style>
