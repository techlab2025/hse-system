<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import Search from '@/shared/icons/Search.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import ActionsTableEdit from '@/shared/icons/ActionsTableEdit.vue'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import IndexTraningTopicController from '../controllers/indexTraningTopicController'
import DeleteTraningTopicController from '../controllers/deleteTraningTopicController'
import IndexTraningTopicParams from '../../Core/params/indexTraningTopicParams'
import DeleteTraningTopicParams from '../../Core/params/deleteTraningTopicParams'
import TraningTopicActionsButtons from './TraningTopicActionsButtons.vue'
import SystemTraningTopics from '../supcomponents/SystemTraningTopics.vue'
import TraningTopicTableSkeleton from '../supcomponents/TraningTopicTableSkeleton.vue'

const { t } = useI18n()
const { user } = useUserStore()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexController = IndexTraningTopicController.getInstance()
const state = ref(indexController.state.value)

const fetchPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.ORGANIZATION_EMPLOYEE,
  PermissionsEnum.TRANING_TOPIC_ALL,
  PermissionsEnum.TRANING_TOPIC_FETCH,
  PermissionsEnum.ORG_TRANING_TOPIC_ALL,
  PermissionsEnum.ORG_TRANING_TOPIC_FETCH,
]

const updatePermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.ORGANIZATION_EMPLOYEE,
  PermissionsEnum.TRANING_TOPIC_ALL,
  PermissionsEnum.TRANING_TOPIC_UPDATE,
  PermissionsEnum.ORG_TRANING_TOPIC_ALL,
  PermissionsEnum.ORG_TRANING_TOPIC_UPDATE,
]

const deletePermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.ORGANIZATION_EMPLOYEE,
  PermissionsEnum.TRANING_TOPIC_ALL,
  PermissionsEnum.TRANING_TOPIC_DELETE,
  PermissionsEnum.ORG_TRANING_TOPIC_ALL,
  PermissionsEnum.ORG_TRANING_TOPIC_DELETE,
]

const fetchTraningTopics = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  await indexController.getData(
    new IndexTraningTopicParams(query, withPage, perPage, pageNumber, true),
  )
}

onMounted(() => fetchTraningTopics())

const searchTraningTopics = debounce(() => {
  currentPage.value = 1
  fetchTraningTopics(word.value, currentPage.value, countPerPage.value)
})

const deleteTraningTopic = async (id: number) => {
  await DeleteTraningTopicController.getInstance().deleteTraningTopic(
    new DeleteTraningTopicParams(id),
  )
  await fetchTraningTopics(word.value, currentPage.value, countPerPage.value)
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchTraningTopics(word.value, currentPage.value, countPerPage.value)
}

const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  currentPage.value = 1
  fetchTraningTopics(word.value, currentPage.value, countPerPage.value)
}

watch(
  () => indexController.state.value,
  (newState) => {
    if (newState) state.value = newState
  },
  { deep: true },
)

const rowActions = (id: number) => [
  {
    text: t('edit'),
    icon: ActionsTableEdit,
    link: `/${user?.type === OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/traning-topic/${id}`,
    permission: updatePermissions,
  },
  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteTraningTopic(id),
    permission: deletePermissions,
  },
]

const exportExcel = () => {
  const data = state.value.data ?? []
  if (!data.length) return

  const worksheetData = data.map((item: any) => ({
    title: item.title ?? '',
  }))

  const worksheet = XLSX.utils.json_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'TraningTopics')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'traning_topics.xlsx')
}

const downloadTemplate = () => {
  const worksheetData = [
    { title: 'Example Traning Topic' },
    { title: 'Example Traning Topic 2' },
  ]
  const worksheet = XLSX.utils.json_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'TraningTopics')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'traning_topic_form.xlsx')
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <span class="icon-remove" @click="((word = ''), searchTraningTopics())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="$t('search')"
        class="input"
        type="text"
        @input="searchTraningTopics"
      />
    </div>

    <div class="col-span-2 flex justify-end gap-2">
      <TraningTopicActionsButtons
        @export="exportExcel"
        @download-template="downloadTemplate"
        @uploaded="fetchTraningTopics(word, currentPage, countPerPage)"
      />
    </div>
    <SystemTraningTopics
      v-if="user?.type !== OrganizationTypeEnum.ADMIN"
      :is-header-tap="true"
      @confirmed="fetchTraningTopics(word, currentPage, countPerPage)"
    />
  </div>

  <PermissionBuilder :code="fetchPermissions">
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive mt-2">
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
                <td>{{ index + 1 }}</td>
                <td>{{ item.title }}</td>
                <td>
                  <DropList
                    :actionList="rowActions(item.id)"
                    @delete="deleteTraningTopic(item.id)"
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
        <TraningTopicTableSkeleton />
      </template>

      <template #initial>
        <TraningTopicTableSkeleton />
      </template>

      <template #empty>
        <DataEmpty
          :title="$t('no_traning_topics')"
          :description="$t('no_traning_topics_description')"
        />
      </template>

      <template #failed>
        <DataFailed
          :title="$t('no_traning_topics')"
          :description="$t('no_traning_topics_description')"
          link=""
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed :add-text="$t('permission_denied')" description="" link="" />
    </template>
  </PermissionBuilder>
</template>
