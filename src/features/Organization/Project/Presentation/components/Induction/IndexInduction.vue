<script setup lang="ts">
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
import ActionsTableEdit from '@/shared/icons/ActionsTableEdit.vue'
import ActionsTableView from '@/shared/icons/ActionsTableView.vue'
import ActionsListAddIcon from '@/shared/icons/ActionsListAddIcon.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import IndexInductionController from '../../controllers/Induction/indexInductionController'
import DeleteInductionController from '../../controllers/Induction/deleteInductionController'
import IndexInductionParams from '../../../Core/params/induction/indexInductionParams'
import DeleteInductionParams from '../../../Core/params/induction/deleteInductionToolParams'

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

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : null
})
const projectQuery = computed(() =>
  routeProjectId.value ? `?project_id=${routeProjectId.value}` : '',
)

const featurePermissions = [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE]
const createPermissions = [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE]

const fetchInductions = async (query: string = '', page: number = 1, limit: number = 10) => {
  await controller.getData(new IndexInductionParams(query, page, limit, 1))
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
  await DeleteInductionController.getInstance().deleteInduction(new DeleteInductionParams(id))
  await fetchInductions(word.value, currentPage.value, countPerPage.value)
}

const formatList = (items: { title?: string }[]) =>
  items.map((item) => item.title).filter(Boolean).join(', ') || '-'

const rowActions = (id: number) => [
  {
    text: t('show'),
    icon: ActionsTableView,
    link: `${basePath}/induction/show/${id}${projectQuery.value}`,
    permission: featurePermissions,
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
    permission: featurePermissions,
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
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4 input_search_btn">
    <div class="input-search col-span-1">
      <span class="icon-remove" @click="((word = ''), searchInductions())"><Search /></span>
      <input v-model="word" :placeholder="$t('search')" class="input" @input="searchInductions" />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <PermissionBuilder :code="createPermissions">
        <router-link :to="`${basePath}/induction/add${projectQuery}`" class="btn btn-primary induction-add-button">
          <ActionsListAddIcon />
          <span>{{ $t('add_induction') }}</span>
        </router-link>
      </PermissionBuilder>
    </div>
  </div>

  <PermissionBuilder :code="featurePermissions">
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive">
          <table class="main-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{{ $t('instractor id') }}</th>
                <th scope="col">{{ $t('date') }}</th>
                <!-- <th scope="col">{{ $t('trainingTopic') }}</th> -->
                <!-- <th scope="col">{{ $t('organisationEmployee') }}</th> -->
                <th class="empty"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td>{{ (currentPage - 1) * countPerPage + index + 1 }}</td>
                <td>#{{ item.instractor_id }}</td>
                <td>{{ item.date || '-' }}</td>
                <!-- <td>{{ formatList(item.trainingTopic) }}</td> -->
                <!-- <td>{{ item.organisationEmployee.length }}</td> -->
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
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`${basePath}/induction/add${projectQuery}`"
          :add-text="$t('add_induction')"
          :description="$t('unable_to_load_inductions')"
          :title="$t('no_inductions')"
        />
      </template>
    </DataStatus>
    <template #notPermitted>
      <DataFailed :add-text="$t('have_not_permission')" description="" link="" />
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

.input_search_btn{
  align-items: center;
}
</style>