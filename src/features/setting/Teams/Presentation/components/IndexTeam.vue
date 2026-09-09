<script lang="ts" setup>
// import IndexTeamTypeParams from '@/features/setting/TeamType/Core/params/indexTeamTypeParams'
// import IndexTeamTypeController from '@/features/setting/TeamType/Presentation/controllers/indexTeamTypeController'

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
// import DeleteTeamTypeController from '@/features/setting/TeamType/Presentation/controllers/deleteTeamTypeController'
// import DeleteTeamTypeParams from '@/features/setting/TeamType/Core/params/deleteTeamTypeParams'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
// import ExportIcon from '@/shared/icons/ExportIcon.vue'
import Search from '@/shared/icons/Search.vue'
import IndexTeamController from '../controllers/indexTeamController'
import IndexTeamParams from '../../Core/params/indexTeamParams'
import DeleteTeamParams from '../../Core/params/deleteTeamParams'
import DeleteTeamController from '../controllers/deleteTeamController'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import ActionsTableEdit from '@/shared/icons/ActionsTableEdit.vue'
import SystemTeams from '../supcomponents/SystemTeams.vue'
import ActionsList from '@/shared/HelpersComponents/ActionsList.vue'
import ActionsListAddIcon from '@/shared/icons/ActionsListAddIcon.vue'
import { ActionItemsTypeEnum } from '@/base/core/params/actions_items_type_enum'
import ExceIcon from '@/shared/icons/ExceIcon.vue'
import UploadExcelIcon from '@/shared/icons/UploadExcelIcon.vue'
import Dialog from 'primevue/dialog'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import UploadTeamExcelSheet from './UploadTeamExcelSheet.vue'

const { t } = useI18n()

// import DialogChangeStatusTeamType from "@/features/setting/TeamTypes/Presentation/components/TeamType/DialogChangeStatusTeamType.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexTeamController = IndexTeamController.getInstance()
const state = ref(indexTeamController.state.value)
const route = useRoute()
let id = route.params.id
// const type = ref<TeamTypeStatusEnum>(TeamTypeStatusEnum[route.params.type as keyof typeof TeamTypeStatusEnum])

const fetchTeam = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteTeamTypeParams = new IndexTeamParams(query, pageNumber, perPage, withPage, id)
  await indexTeamController.getData(deleteTeamTypeParams)
}

onMounted(() => {
  fetchTeam()
})

const searchTeamType = debounce(() => {
  fetchTeam(word.value)
})

const deleteTeam = async (id: number) => {
  const deleteTeamParams = new DeleteTeamParams(id)
  await DeleteTeamController.getInstance().deleteTeam(deleteTeamParams)
  await fetchTeam()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchTeam('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchTeam('', currentPage.value, countPerPage.value)
}

watch(
  () => indexTeamController.state.value,
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

const actionList = (id: number, deleteTeam: (id: number) => void) => [
  {
    text: t('edit'),
    icon: ActionsTableEdit,
    link: `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/team/${id}`,
    permission: [
      PermissionsEnum.TEAM_UPDATE,
      PermissionsEnum.ORG_TEAM_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ORG_TEAM_ALL,
      PermissionsEnum.TEAM_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteTeam(id),
    permission: [
      PermissionsEnum.TEAM_DELETE,
      PermissionsEnum.ORG_TEAM_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ORG_TEAM_ALL,
      PermissionsEnum.TEAM_ALL,
    ],
  },
]

watch(
  () => route?.params?.id,
  (Newvalue) => {
    id = Newvalue
    fetchTeam()
  },
)

const handleSystemTeamsConfirmed = () => {
  fetchTeam('', currentPage.value, countPerPage.value)
}

const showUploadDialog = ref(false)
const pendingFile = ref<File | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const onFileSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  pendingFile.value = file
  showUploadDialog.value = true
  input.value = ''
}

const exportExcel = () => {
  if (!state.value.data?.length) {
    alert('No data available to export')
    return
  }

  const worksheetData = state.value.data.map((item) => ({
    title: item.title || 'N/A',
  }))
  const worksheet = XLSX.utils.json_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Teams')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'teams.xlsx')
}

const downloadExcelTemplate = () => {
  const worksheet = XLSX.utils.json_to_sheet([
    { title: 'Example Team' },
    { title: 'Example Team 2' },
  ])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Teams')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'team_form.xlsx')
}

const teamFetchPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.ORGANIZATION_EMPLOYEE,
  PermissionsEnum.TEAM_FETCH,
  PermissionsEnum.ORG_TEAM_FETCH,
  PermissionsEnum.TEAM_ALL,
  PermissionsEnum.ORG_TEAM_ALL,
]

const teamCreatePermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.ORGANIZATION_EMPLOYEE,
  PermissionsEnum.TEAM_CREATE,
  PermissionsEnum.ORG_TEAM_CREATE,
  PermissionsEnum.TEAM_ALL,
  PermissionsEnum.ORG_TEAM_ALL,
]

const indexTeamActionList = () => [
  {
    text: t('export_to_excel'),
    icon: ExceIcon,
    action: exportExcel,
    type: ActionItemsTypeEnum.Success,
    permission: teamFetchPermissions,
  },
  {
    text: t('add_team'),
    link: `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/team/add`,
    icon: ActionsListAddIcon,
    primary: true,
    type: ActionItemsTypeEnum.Info,
    permission: teamCreatePermissions,
  },
  {
    text: t('upload_complated_template'),
    icon: UploadExcelIcon,
    action: () => fileInputRef.value?.click(),
    type: ActionItemsTypeEnum.Warning,
    permission: teamCreatePermissions,
  },
  {
    text: t('download_excel_template'),
    icon: ExceIcon,
    action: downloadExcelTemplate,
    type: ActionItemsTypeEnum.Success,
    permission: teamCreatePermissions,
  },
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">

    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchTeamType())">
        <Search />
      </span>
      <input v-model="word" :placeholder="'search'" class="input" type="text" @input="searchTeamType" />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ActionsList
        feature-name="action_feature_teams"
        :show-actions="true"
        :actionList="indexTeamActionList()"
        :actionsNumber="5"
      >
        <template #custom>
          <ExportPdf :isDropList="true" />
        </template>
      </ActionsList>
    </div>

    <SystemTeams
      v-if="user?.type != OrganizationTypeEnum.ADMIN"
      :isHeaderTap="true"
      @confirmed="handleSystemTeamsConfirmed"
    />
  </div>

  <permission-builder :code="[
    PermissionsEnum.ADMIN,
    PermissionsEnum.ORGANIZATION_EMPLOYEE,
    PermissionsEnum.TEAM_ALL,
    PermissionsEnum.TEAM_DELETE,
    PermissionsEnum.TEAM_FETCH,
    PermissionsEnum.TEAM_UPDATE,
    PermissionsEnum.TEAM_CREATE,
    PermissionsEnum.ORG_TEAM_ALL,
    PermissionsEnum.ORG_TEAM_DELETE,
    PermissionsEnum.ORG_TEAM_FETCH,
    PermissionsEnum.ORG_TEAM_UPDATE,
    PermissionsEnum.ORG_TEAM_CREATE,
  ]">
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive">
          <table class="main-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{{ $t('title') }}</th>

                <!-- <th scope="col">Actions</th> -->
                <th class="empty"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link
                    :to="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/team/edit/${item.id}`">{{
                    index + 1 }}
                  </router-link>
                </td>
                <td data-label="Name">{{ wordSlice(item.title) }}</td>

                <td data-label="Actions">
                  <!--                <DialogChangeStatusTeamType-->
                  <!--                  v-if="item.TeamTypeStatus === TeamTypeStatusEnum.Draft"-->
                  <!--                  :TeamTypeId="item.id"-->
                  <!--                  @TeamTypeChangeStatus="fetchTeamType"-->
                  <!--                />-->

                  <DropList :actionList="actionList(item.id, deleteTeam)" @delete="deleteTeam(item.id)" />
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
        <permission-builder :code="[
          PermissionsEnum.ADMIN,
          PermissionsEnum.ORGANIZATION_EMPLOYEE,
          PermissionsEnum.TEAM_CREATE,
          PermissionsEnum.ORG_TEAM_CREATE,
        ]">
          <DataEmpty :link="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/team/add`"
            addText="Add Team"
            description="Sorry .. You have no Team .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No Team" />
        </permission-builder>
      </template>
      <template #failed>
        <permission-builder :code="[
          PermissionsEnum.ADMIN,
          PermissionsEnum.ORGANIZATION_EMPLOYEE,
          PermissionsEnum.TEAM_CREATE,
          PermissionsEnum.ORG_TEAM_CREATE,
        ]">
          <DataFailed :link="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/team/add`"
            addText="Add Team"
            description="Sorry .. You have no Team .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No Team" />
        </permission-builder>
      </template>
    </DataStatus>

    <template #notPermitted>
      <permission-builder :code="[
        PermissionsEnum.ADMIN,
        PermissionsEnum.ORGANIZATION_EMPLOYEE,
        PermissionsEnum.TEAM_CREATE,
        PermissionsEnum.ORG_TEAM_CREATE,
      ]">
        <DataFailed addText="Have not  Permission"
          description="Sorry .. You have no TeamType .. All your joined customers will appear here when you add your customer data" />
      </permission-builder>
    </template>
  </permission-builder>

  <Dialog
    v-model:visible="showUploadDialog"
    modal
    :dismissable-mask="true"
    :header="$t('upload_complated_template')"
    :style="{ width: '80vw', maxWidth: '900px' }"
    @hide="pendingFile = null"
  >
    <UploadTeamExcelSheet
      :initial-file="pendingFile"
      @uploaded="
        showUploadDialog = false;
        pendingFile = null;
        fetchTeam()
      "
    />
  </Dialog>

  <input
    ref="fileInputRef"
    type="file"
    accept=".xls,.xlsx"
    style="display: none"
    @change="onFileSelected"
  />
</template>

<style scoped></style>
