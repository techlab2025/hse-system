<script lang="ts" setup>
import RegisterPage from '@/shared/Tables/RegisterPage.vue'

import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import * as XLSX from 'xlsx'
import Dialog from 'primevue/dialog'
import { debounce } from '@/base/Presentation/utils/debouced'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import ActionsList from '@/shared/HelpersComponents/ActionsList.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import wordSlice from '@/base/Presentation/utils/word_slice'
import ActionsTableEdit from '@/shared/icons/ActionsTableEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import ExceIcon from '@/shared/icons/ExceIcon.vue'
import UploadExcelIcon from '@/shared/icons/UploadExcelIcon.vue'
import ActionsListAddIcon from '@/shared/icons/ActionsListAddIcon.vue'
import Search from '@/shared/icons/Search.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { ActionItemsTypeEnum } from '@/base/core/params/actions_items_type_enum'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { useUserStore } from '@/stores/user'
import IndexFactoryItemController from '../controllers/indexFactoryItemController'
import IndexFactoryItemParams from '../../Core/params/indexFactoryItemParams'
import DeleteFactoryItemController from '../controllers/deleteFactoryItemController'
import DeleteFactoryItemParams from '../../Core/params/deleteFactoryItemParams'
import UploadFactoryItemExcelSheet from './UploadFactoryItemExcelSheet.vue'
import SystemFactoryItems from '../supcomponents/SystemFactoryItems.vue'

const { t } = useI18n()
const { user } = useUserStore()
const route = useRoute()
const parentId = Number(route.params.parent_id) || undefined
const basePath = computed(() =>
  user?.type === OrganizationTypeEnum.ADMIN ? '/admin' : '/organization',
)
const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const controller = IndexFactoryItemController.getInstance()
const state = ref(controller.state.value)
const featurePermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.FACTORY_ITEM_ALL,
  PermissionsEnum.FACTORY_ITEM_FETCH,
  PermissionsEnum.ORG_FACTORY_ITEM_ALL,
  PermissionsEnum.ORG_FACTORY_ITEM_FETCH,
]
const createPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.FACTORY_ITEM_ALL,
  PermissionsEnum.FACTORY_ITEM_CREATE,
  PermissionsEnum.ORG_FACTORY_ITEM_ALL,
  PermissionsEnum.ORG_FACTORY_ITEM_CREATE,
]

const fetchFactory = async (
  query = word.value,
  page = currentPage.value,
  limit = countPerPage.value,
) => {
  await controller.getData(new IndexFactoryItemParams(query, page, limit, 1, parentId))
}
onMounted(() => fetchFactory())
watch(
  () => controller.state.value,
  (value) => {
    state.value = value
  },
  { deep: true },
)
const searchFactory = debounce(() => {
  currentPage.value = 1
  fetchFactory()
})
const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchFactory()
}
const handleCountPerPage = (limit: number) => {
  countPerPage.value = limit
  currentPage.value = 1
  fetchFactory()
}
const deleteFactory = async (id: number) => {
  await DeleteFactoryItemController.getInstance().deleteFactory(new DeleteFactoryItemParams(id))
  await fetchFactory()
}
const rowActions = (id: number) => [
  {
    text: t('edit'),
    icon: ActionsTableEdit,
    link: `${basePath.value}/factory-item/${id}`,
    permission: [
      PermissionsEnum.ADMIN,
      PermissionsEnum.FACTORY_ITEM_ALL,
      PermissionsEnum.FACTORY_ITEM_UPDATE,
      PermissionsEnum.ORG_FACTORY_ITEM_ALL,
      PermissionsEnum.ORG_FACTORY_ITEM_UPDATE,
    ],
  },
  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteFactory(id),
    permission: [
      PermissionsEnum.ADMIN,
      PermissionsEnum.FACTORY_ITEM_ALL,
      PermissionsEnum.FACTORY_ITEM_DELETE,
      PermissionsEnum.ORG_FACTORY_ITEM_ALL,
      PermissionsEnum.ORG_FACTORY_ITEM_DELETE,
    ],
  },
]
const saveWorkbook = (rows: Record<string, unknown>[], filename: string) => {
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), 'Factor Items')
  XLSX.writeFile(workbook, filename)
}
const exportExcel = () =>
  saveWorkbook(
    (state.value.data ?? []).map((item) => ({
      title: item.title ?? '',
    })),
    'factor_items.xlsx',
  )
const downloadExample = () =>
  saveWorkbook([{ title: 'Factor Item 1' }], 'factor_items_template.xlsx')
const showUploadDialog = ref(false)
const pendingFile = ref<File | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const importBusy = ref(false)
const onFileSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  pendingFile.value = file
  showUploadDialog.value = true
  input.value = ''
}
const onUploaded = () => {
  showUploadDialog.value = false
  pendingFile.value = null
  fetchFactory()
}
watch(showUploadDialog, (visible) => {
  if (!visible) pendingFile.value = null
})
const headerActions = () => [
  {
    text: t('export_to_excel'),
    icon: ExceIcon,
    action: exportExcel,
    type: ActionItemsTypeEnum.Success,
    permission: featurePermissions,
  },
  {
    text: t('add_hazard_factor_item'),
    link: `${basePath.value}/factory-item/add`,
    icon: ActionsListAddIcon,
    primary: true,
    type: ActionItemsTypeEnum.Info,
    permission: createPermissions,
  },
  {
    text: t('upload_complated_template'),
    action: () => fileInputRef.value?.click(),
    icon: UploadExcelIcon,
    type: ActionItemsTypeEnum.Warning,
    permission: createPermissions,
  },
  {
    text: t('download_excel_template'),
    action: downloadExample,
    icon: ExceIcon,
    type: ActionItemsTypeEnum.Success,
    permission: createPermissions,
  },
]
</script>

<template>
  <RegisterPage>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
      <div class="input-search col-span-1">
        <span class="icon-remove" @click="((word = ''), searchFactory())"><Search /></span>
        <input
          dir="auto"
          v-model="word"
          :placeholder="$t('search')"
          class="input"
          @input="searchFactory"
        />
      </div>
      <div class="col-span-2 flex justify-end gap-2">
        <PermissionBuilder v-if="user?.type !== OrganizationTypeEnum.ADMIN" :code="createPermissions">
        <SystemFactoryItems @confirmed="fetchFactory()" />
      </PermissionBuilder>
        <ActionsList
          feature-name="action_feature_factor_items"
          :show-actions="true"
          :action-list="headerActions()"
          :actions-number="5"
        >
          <template #custom><ExportPdf :is-drop-list="true" /></template>
        </ActionsList>
      </div>
    </div>

    <PermissionBuilder
      :code="[
        PermissionsEnum.ADMIN,
        PermissionsEnum.ORGANIZATION_EMPLOYEE,
        PermissionsEnum.FACTORY_ITEM_ALL,
        PermissionsEnum.FACTORY_ITEM_DELETE,
        PermissionsEnum.FACTORY_ITEM_FETCH,
        PermissionsEnum.FACTORY_ITEM_UPDATE,
        PermissionsEnum.FACTORY_ITEM_CREATE,
        PermissionsEnum.ORG_FACTORY_ITEM_ALL,
        PermissionsEnum.ORG_FACTORY_ITEM_DELETE,
        PermissionsEnum.ORG_FACTORY_ITEM_FETCH,
        PermissionsEnum.ORG_FACTORY_ITEM_UPDATE,
        PermissionsEnum.ORG_FACTORY_ITEM_CREATE,
      ]"
    >
      <DataStatus :controller="state">
        <template #success>
          <div class="table-responsive mt-2 hse-table-scroll">
            <table v-table-identity class="main-table hse-data-table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">{{ $t('title') }}</th>
                  <!--                <th scope="col">{{ $t('has_certificate') }}</th>-->
                  <th scope="col" v-if="user?.type === OrganizationTypeEnum?.ADMIN">
                    {{ $t('all_industries') }}
                  </th>
                  <th scope="col" v-if="user?.type === OrganizationTypeEnum?.ADMIN">
                    {{ $t('industries') }}
                  </th>
                  <th scope="col">{{ $t('factor') }}</th>
                  <!--                <th scope="col">{{ $t('image') }}</th>-->

                  <!-- <th scope="col">{{ $t('actions') }}</th> -->
                  <th class="empty"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in state.data" :key="item.id">
                  <td data-label="#">
                    <span
                      :to="`/${
                        user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
                      }/hazard-type/${item.id}`"
                      >{{ (currentPage - 1) * countPerPage + index + 1 }}
                    </span>
                  </td>
                  <td :data-label="$t('Name')">{{ wordSlice(item.title) }}</td>
                  <td
                    :data-label="$t('all_industries')"
                    v-if="user?.type === OrganizationTypeEnum?.ADMIN"
                  >
                    {{ item.allIndustries ? $t('yes') : $t('no') }}
                  </td>
                  <td
                    :data-label="$t('all_industries')"
                    v-if="user?.type === OrganizationTypeEnum?.ADMIN"
                  >
                    {{
                      item.industries.length > 0
                        ? item.industries.map((industry) => industry.title).join(', ')
                        : '---'
                    }}
                  </td>
                  <td :data-label="$t('Factory')">
                    <router-link
                      :to="`/${
                        user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
                      }/factory-item/${item.id}`"
                      >{{ item?.factory?.title }}</router-link
                    >
                  </td>
                  <!--                <td data-label="all_industries">-->
                  <!--                  <img :src="item.image" @error="setDefaultImage($event)" alt="" />-->
                  <!--                </td>-->

                  <td :data-label="$t('Actions')">
                    <!--                <DialogChangeStatusFactory-->
                    <!--                  v-if="item.FactoryStatus === FactoryStatusEnum.Draft"-->
                    <!--                  :FactoryId="item.id"-->
                    <!--                  @FactoryChangeStatus="fetchFactory"-->
                    <!--                />-->

                    <DropList :action-list="rowActions(item.id)" />
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
          <PermissionBuilder
            :code="[
              PermissionsEnum.ADMIN,
              PermissionsEnum.ORGANIZATION_EMPLOYEE,
              PermissionsEnum.FACTORY_ITEM_CREATE,
              PermissionsEnum.ORG_FACTORY_ITEM_CREATE,
            ]"
          >
            <DataEmpty
              :link="`/${
                user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
              }/factory-item/add`"
              :addText="$t('add_hazard_factor_item')"
              :description="
                $t(
                  'You have no Factor Item .. All your joined customers will appear here when you add your customer data',
                )
              "
              :title="$t('You have No Factor Item')"
            />
          </PermissionBuilder>
        </template>
        <template #failed>
          <PermissionBuilder
            :code="[
              PermissionsEnum.ADMIN,
              PermissionsEnum.ORGANIZATION_EMPLOYEE,
              PermissionsEnum.FACTORY_ITEM_CREATE,
              PermissionsEnum.ORG_FACTORY_ITEM_CREATE,
            ]"
          >
            <DataFailed
              :link="`/${
                user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
              }/factory-item/add`"
              :addText="$t('add_hazard_factor_item')"
              :description="
                $t(
                  'You have no Factor Item .. All your joined customers will appear here when you add your customer data',
                )
              "
              :title="$t('You have No Factor Item')"
            />
          </PermissionBuilder>
        </template>
      </DataStatus>

      <template #notPermitted>
        <DataFailed
          :addText="$t('auditUi.you_do_not_have_permission')"
          :description="
            $t(
              'You have no Factor Item .. All your joined customers will appear here when you add your customer data',
            )
          "
        />
      </template>
    </PermissionBuilder>

    <Dialog
      v-model:visible="showUploadDialog"
      modal
      :dismissable-mask="!importBusy"
      :closable="!importBusy"
      :close-on-escape="!importBusy"
      :header="$t('import_factor_items')"
      :style="{ width: '80vw', maxWidth: '900px' }"
    >
      <UploadFactoryItemExcelSheet
        v-if="showUploadDialog"
        :initial-file="pendingFile"
        @uploaded="onUploaded"
        @busy="importBusy = $event"
      />
    </Dialog>
    <input
      ref="fileInputRef"
      type="file"
      accept=".xls,.xlsx"
      style="display: none"
      @change="onFileSelected"
    />
  </RegisterPage>
</template>

<style scoped></style>
