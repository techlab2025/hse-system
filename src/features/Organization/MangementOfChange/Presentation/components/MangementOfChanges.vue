<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { debounce } from '@/base/Presentation/utils/debouced'
import wordSlice from '@/base/Presentation/utils/word_slice'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import PermissionHandler from '@/base/Presentation/utils/permission_handler'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import Search from '@/shared/icons/Search.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import ActionsTableEdit from '@/shared/icons/ActionsTableEdit.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import IndexMangementChangeParams from '../../Core/params/indexMangementChangeParams'
import IndexMangementChangeController from '../controllers/indexMangementChangeController'
import DeleteMangementChangeParams from '../../Core/params/deleteMangementChangeParams'
import DeleteMangementChangeController from '../controllers/deleteMangementChangeController'
import { ChangeTypeMangementEnum } from '../../Core/Core/ChangeTypeEnum'
import { ChangeApprovalMangementEnum } from '../../Core/Core/ChangeApprovalEnum'

const { t } = useI18n()
const route = useRoute()
const projectId = computed(() => {
  const value =
    route.query.project_id ??
    route.params.project_id ??
    (route.path.includes('/project-details/') ? route.params.id : undefined)
  const id = Number(Array.isArray(value) ? value[0] : value)
  return Number.isInteger(id) && id > 0 ? id : undefined
})
const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const controller = IndexMangementChangeController.getInstance()
const state = ref(controller.state.value)

const addLink = computed(() => {
  if (projectId.value !== undefined) {
    return `/organization/management-of-change/add?project_id=${projectId.value}`
  }

  return '/organization/management-of-change/add'
})

const featurePermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.MOC_ALL,
  PermissionsEnum.MOC_FETCH,
]
const createPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.MOC_ALL,
  PermissionsEnum.MOC_CRAETE,
]
const updatePermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.MOC_ALL,
  PermissionsEnum.MOC_UPDATE,
]
const deletePermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.MOC_ALL,
  PermissionsEnum.MOC_DELETE,
]
const canManage = computed(() =>
  PermissionHandler.Instance.handle([...updatePermissions, ...deletePermissions]),
)
const canCreate = computed(() => PermissionHandler.Instance.handle(createPermissions))

const changeTypeLabels: Record<number, string> = {
  [ChangeTypeMangementEnum.temp]: 'temporary',
  [ChangeTypeMangementEnum.permenent]: 'permanent',
}

const statusLabels: Record<number, string> = {
  [ChangeApprovalMangementEnum.approve]: 'approve',
  [ChangeApprovalMangementEnum.reject]: 'reject',
}

const fetchMangementChanges = async (query: string = '', page: number = 1, limit: number = 10) => {
  if (!PermissionHandler.Instance.handle(featurePermissions)) return
  await controller.getData(
    new IndexMangementChangeParams(
      query,
      page,
      limit,
      1,
      projectId.value !== undefined ? projectId.value : null,
    ),
  )
}

watch(
  projectId,
  () => {
    currentPage.value = 1
    fetchMangementChanges(word.value, 1, countPerPage.value)
  },
  { immediate: true },
)
watch(
  () => controller.state.value,
  (value) => {
    state.value = value
  },
  { deep: true },
)

const searchMangementChanges = debounce(() => fetchMangementChanges(word.value))
const changePage = (page: number) => {
  currentPage.value = page
  fetchMangementChanges(word.value, page, countPerPage.value)
}
const changePageSize = (limit: number) => {
  countPerPage.value = limit
  fetchMangementChanges(word.value, currentPage.value, limit)
}
const deleteMangementChange = async (id: number) => {
  if (!PermissionHandler.Instance.handle(deletePermissions)) return
  await DeleteMangementChangeController.getInstance().deleteMangementChange(
    new DeleteMangementChangeParams(id),
  )
  await fetchMangementChanges(word.value, currentPage.value, countPerPage.value)
}

const actionList = (id: number, deleteMangementChange: (id: number) => void) => [
  {
    text: t('edit'),
    icon: ActionsTableEdit,
    link: `/organization/management-of-change/${id}${projectId.value ? `?project_id=${projectId.value}` : ''}`,
    permission: updatePermissions,
  },
  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteMangementChange(id),
    permission: deletePermissions,
    isDelete: true,
  },
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4 mt-2">
    <div class="input-search col-span-1">
      <span class="icon-remove" @click="((word = ''), searchMangementChanges())">
        <Search />
      </span>
      <input
        dir="auto"
        v-model="word"
        :placeholder="$t('search')"
        class="input"
        @input="searchMangementChanges"
      />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <PermissionBuilder :code="createPermissions">
        <router-link :to="addLink" class="btn btn-primary">
          {{ $t('add') }}
        </router-link>
      </PermissionBuilder>
    </div>
  </div>

  <PermissionBuilder :code="featurePermissions">
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive hse-table-scroll">
          <table v-table-identity class="main-table hse-data-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{{ $t('date') }}</th>
                <th scope="col">{{ $t('change type') }}</th>
                <th scope="col">{{ $t('Description of Proposed Change/Modification') }}</th>
                <th scope="col">{{ $t('area') }}</th>
                <th scope="col">{{ $t('change approval') }}</th>
                <th scope="col">{{ $t('created_by') }}</th>
                <th v-if="canManage" scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  {{ (currentPage - 1) * countPerPage + index + 1 }}
                </td>
                <td :data-label="$t('date')">{{ item.date || '-' }}</td>
                <td :data-label="$t('change type')">
                  {{
                    item.change_type
                      ? $t(changeTypeLabels[item.change_type] ?? String(item.change_type))
                      : '-'
                  }}
                </td>
                <td :data-label="$t('Description of Proposed Change/Modification')">
                  {{ wordSlice(item.descriptionOfProposedChange || item.topicTitle || '-', 45) }}
                </td>
                <td :data-label="$t('area')">{{ wordSlice(item.area || '-', 30) }}</td>
                <td :data-label="$t('change approval')">
                  {{ item.status ? $t(statusLabels[item.status] ?? String(item.status)) : '-' }}
                </td>
                <td :data-label="$t('created_by')">
                  {{ wordSlice(item.createdByName || item.initiatorEmployeeName || '-', 30) }}
                </td>
                <td v-if="canManage" :data-label="$t('actions')">
                  <DropList
                    v-if="item.id"
                    :actionList="actionList(item.id, deleteMangementChange)"
                    @delete="deleteMangementChange(item.id)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination
          :pagination="state.pagination"
          @changePage="changePage"
          @countPerPage="changePageSize"
        />
      </template>
      <template #loader><TableLoader :cols="8" :rows="10" /></template>
      <template #initial><TableLoader :cols="8" :rows="10" /></template>
      <template #empty>
        <DataEmpty
          :link="addLink"
          :add-text="$t('add')"
          description=""
          :title="$t('no_management_changes')"
          :withbtn="canCreate"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="addLink"
          :add-text="$t('add')"
          description=""
          :title="$t('no_management_changes')"
          :withbtn="canCreate"
        />
      </template>
    </DataStatus>
    <template #notPermitted>
      <DataFailed
        :title="$t('have_not_permission')"
        :description="$t('permission_denied_description')"
        :withbtn="false"
      />
    </template>
  </PermissionBuilder>
</template>

<style scoped></style>
