<script setup lang="ts">
import { resolveProjectId } from '@/shared/utils/projectScope'
import { vProjectPanels } from '../../composables/projectPanels'

import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { debounce } from '@/base/Presentation/utils/debouced'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import Search from '@/shared/icons/Search.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import ActionsTableView from '@/shared/icons/ActionsTableView.vue'
import ActionsListAddIcon from '@/shared/icons/ActionsListAddIcon.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import IndexInductionController from '../../controllers/Induction/indexInductionController'
import DeleteInductionController from '../../controllers/Induction/deleteInductionController'
import IndexInductionParams from '../../../Core/params/induction/indexInductionParams'
import DeleteInductionParams from '../../../Core/params/induction/deleteInductionToolParams'
import wordSlice from '@/base/Presentation/utils/word_slice'
import PermissionHandler from '@/base/Presentation/utils/permission_handler'

const { t } = useI18n()
const route = useRoute()
const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const controller = IndexInductionController.getInstance()
const state = ref(controller.state.value)
const basePath = '/organization'
const routeProjectId = computed(() => {
  const routeValue = route.query.project_id ?? route.params.project_id
  const rawValue = Array.isArray(routeValue) ? routeValue[0] : routeValue
  const parsedValue = Number(rawValue)

  return (
    resolveProjectId(Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : undefined) ??
    null
  )
})
const projectQuery = computed(() =>
  routeProjectId.value ? `?project_id=${routeProjectId.value}` : '',
)

const fetchPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.inductions_ALL,
  PermissionsEnum.inductions_FETCH,
]
const createPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.inductions_ALL,
  PermissionsEnum.inductions_CREATE,
]
const detailsPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.inductions_ALL,
  PermissionsEnum.inductions_DETAILS,
]
const deletePermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.inductions_ALL,
  PermissionsEnum.inductions_DELETE,
]
const canFetch = computed(() => PermissionHandler.Instance.handle(fetchPermissions))
const canCreate = computed(() => PermissionHandler.Instance.handle(createPermissions))

const fetchInductions = async (query: string = '', page: number = 1, limit: number = 10) => {
  if (!canFetch.value) return
  await controller.getData(
    new IndexInductionParams(
      query,
      page,
      limit,
      1,
      false,
      undefined,
      routeProjectId.value ?? undefined,
    ),
  )
}

const searchInductions = debounce(() => fetchInductions(word.value))
const changePage = (page: number) => {
  currentPage.value = page
  fetchInductions(word.value, page, countPerPage.value)
}
const changePageSize = (limit: number) => {
  countPerPage.value = limit
  fetchInductions(word.value, currentPage.value, limit)
}
const deleteInduction = async (id: number) => {
  if (!PermissionHandler.Instance.handle(deletePermissions)) return
  const deleteController = DeleteInductionController.getInstance()
  await deleteController.deleteInduction(new DeleteInductionParams(id))
  if (deleteController.isDataSuccess()) {
    await fetchInductions(word.value, currentPage.value, countPerPage.value)
  }
}

const rowActions = (id: number) => [
  {
    text: t('show'),
    icon: ActionsTableView,
    link: `${basePath}/induction/show/${id}${projectQuery.value}`,
    permission: detailsPermissions,
  },
  // {
  //   text: t('edit'),
  //   icon: ActionsTableEdit,
  //   link: `${basePath}/induction/${id}${projectQuery.value}`,
  //   permission: featurePermissions,
  // },
  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteInduction(id),
    permission: deletePermissions,
  },
]

onMounted(() => fetchInductions())
watch(
  () => controller.state.value,
  (value) => {
    state.value = value
  },
  { deep: true },
)
</script>

<template>
  <PermissionBuilder :code="fetchPermissions">
    <div
      data-hse-project
      v-project-panels
      class="hse-project-root hse-project-page grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4 input_search_btn"
    >
      <div class="input-search col-span-1">
        <span class="icon-remove" @click="((word = ''), searchInductions())"><Search /></span>
        <input
          v-model="word"
          :placeholder="$t('search')"
          class="hse-project-input input"
          @input="searchInductions"
        />
      </div>
      <div class="col-span-2 flex justify-end gap-2">
        <PermissionBuilder :code="createPermissions">
          <router-link
            :to="`${basePath}/induction/add${projectQuery}`"
            class="hse-project-button hse-project-button--primary btn btn-primary induction-add-button"
          >
            <ActionsListAddIcon />
            <span>{{ $t('add_induction') }}</span>
          </router-link>
        </PermissionBuilder>
      </div>
    </div>

    <DataStatus :controller="state">
      <template #success>
        <div
          data-hse-project
          v-project-panels
          class="hse-project-root hse-project-page table-responsive"
        >
          <table class="hse-project-table main-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{{ $t('instractor') }}</th>
                <th scope="col">{{ $t('project') }}</th>
                <th scope="col">{{ $t('location') }}</th>
                <th scope="col">{{ $t('zone') }}</th>
                <th scope="col">{{ $t('date') }}</th>
                <th scope="col">{{ $t('created_at') }}</th>
                <th class="empty"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td>{{ (currentPage - 1) * countPerPage + index + 1 }}</td>
                <td>{{ wordSlice(item.instructorName, 20) || '-' }}</td>
                <td>{{ item.projectTitle || '-' }}</td>
                <td>{{ wordSlice(item.projectLocationTitle, 20) || '-' }}</td>
                <td>{{ wordSlice(item.projectZoneTitle, 20) || '-' }}</td>
                <td>{{ item.date || '-' }}</td>
                <td>{{ item.createdAt || '-' }}</td>
                <td><DropList :action-list="rowActions(item.id)" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination
          :pagination="state.pagination"
          @change-page="changePage"
          @count-per-page="changePageSize"
        />
      </template>
      <template #loader><TableLoader :cols="6" :rows="10" /></template>
      <template #initial><TableLoader :cols="6" :rows="10" /></template>
      <template #empty>
        <DataEmpty
          :link="`${basePath}/induction/add${projectQuery}`"
          :add-text="$t('add_induction')"
          :description="$t('no_inductions_description')"
          :title="$t('no_inductions')"
          :withbtn="canCreate"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`${basePath}/induction/add${projectQuery}`"
          :add-text="$t('add_induction')"
          :description="$t('unable_to_load_inductions')"
          :title="$t('no_inductions')"
          :withbtn="canCreate"
        />
      </template>
    </DataStatus>
    <template #notPermitted>
      <DataFailed
        :title="$t('have_not_permission')"
        :description="$t('permission_denied_description')"
        link=""
        :withbtn="false"
      />
    </template>
  </PermissionBuilder>
</template>

<style scoped>
.induction-add-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.induction-add-button :deep(svg) {
  flex-shrink: 0;
}

.input_search_btn {
  align-items: center;
}
</style>
