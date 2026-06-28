<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import wordSlice from '@/base/Presentation/utils/word_slice'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import Search from '@/shared/icons/Search.vue'
import ActionsTableEdit from '@/shared/icons/ActionsTableEdit.vue'
import IndexShiftController from '../controllers/IndexShiftController.ts'
import IndexShiftParams from '../../Core/params/IndexAShiftParams.ts'
import DeleteShiftParams from '../../Core/params/DeleteShiftParams.ts'
import DeleteShiftController from '../controllers/DeleteShiftController.ts'

const { t } = useI18n()
const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexShiftController = IndexShiftController.getInstance()
const state = computed(() => indexShiftController.state.value)
const route = useRoute()

const fetchShift = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const indexShiftParams = new IndexShiftParams(query, pageNumber, perPage, withPage)
  await indexShiftController.getData(indexShiftParams)
}

onMounted(() => {
  fetchShift()
})

const searchShift = debounce(() => {
  fetchShift(word.value)
})

const deleteShift = async (id: number) => {
  const deleteShiftParams = new DeleteShiftParams(id)
  await DeleteShiftController.getInstance().deleteShift(deleteShiftParams)
  await fetchShift()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchShift('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchShift('', currentPage.value, countPerPage.value)
}

const actionList = (id: number, deleteShift: (id: number) => void) => [
  {
    text: t('edit'),
    icon: ActionsTableEdit,
    link: `/organization/shifts/${id}`,
    permission: [
      PermissionsEnum.ORG_SHIFT_UPDATE,
      PermissionsEnum.ORG_SHIFT_DETAILS,
      PermissionsEnum.ORG_SHIFT_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteShift(id),
    permission: [PermissionsEnum.ORG_SHIFT_DELETE, PermissionsEnum.ORG_SHIFT_ALL],
  },
]

watch(
  () => route?.params?.id,
  () => {
    fetchShift()
  },
)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4 mt-2">
    <div class="input-search col-span-1">
      <span class="icon-remove" @click="((word = ''), searchShift())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="$t('search')"
        class="input"
        type="text"
        @input="searchShift"
      />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <router-link class="btn btn-primary" to="/organization/shifts/add">
        {{ $t('add_shift') }}
      </router-link>
    </div>
  </div>

  <PermissionBuilder
    :code="[
      PermissionsEnum.ORG_SHIFT_ALL,
      PermissionsEnum.ORG_SHIFT_DELETE,
      PermissionsEnum.ORG_SHIFT_FETCH,
      PermissionsEnum.ORG_SHIFT_UPDATE,
      PermissionsEnum.ORG_SHIFT_CREATE,
    ]"
  >
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive">
          <table class="main-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{{ $t('title') }}</th>
                <th scope="col">{{ $t('start_time') }}</th>
                <th scope="col">{{ $t('end_time') }}</th>
                <th class="empty"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/organization/shifts/${item.id}`"
                    >{{ index + 1 }}
                  </router-link>
                </td>
                <td data-label="Name">{{ wordSlice(item.title) }}</td>
                <td data-label="Start Time">{{ item.startTime }}</td>
                <td data-label="End Time">{{ item.endTime }}</td>
                <td data-label="Actions">
                  <DropList
                    :actionList="actionList(item.id, deleteShift)"
                    @delete="deleteShift(item.id)"
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
        <TableLoader :cols="5" :rows="10" />
      </template>
      <template #initial>
        <TableLoader :cols="5" :rows="10" />
      </template>
      <template #empty>
        <PermissionBuilder :code="[PermissionsEnum?.ORG_SHIFT_CREATE]">
          <DataEmpty
            :link="`/organization/shifts/add`"
            addText="Add Shifts"
            description="Sorry .. You have no Shifts .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No Shifts"
          />
        </PermissionBuilder>
      </template>
      <template #failed>
        <PermissionBuilder :code="[PermissionsEnum?.ORG_SHIFT_CREATE]">
          <DataFailed
            :link="`/organization/shifts/add`"
            addText="Add Shifts"
            description="Sorry .. You have no Shifts .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No Shifts"
          />
        </PermissionBuilder>
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no Shifts permission."
        link=""
      />
    </template>
  </PermissionBuilder>
</template>

<style scoped></style>
