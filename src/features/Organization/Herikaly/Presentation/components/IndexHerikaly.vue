<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import IndexHerikalyController from '../controllers/indexHerikalyController'
import IndexHerikalyParams from '../../Core/params/indexHerikalyParams'
import DeleteHerikalyParams from '../../Core/params/deleteHerikalyParams'
import DeleteHerikalyController from '../controllers/deleteHerikalyController'
import ChangeStatusHerikalyParams from '../../Core/params/changeStatusHerikalyParams'
import ChangeStatusHerikalyController from '../controllers/changeStatusHerikalyController'
import PagesHeader from '@/shared/HelpersComponents/PagesHeader.vue'
import Heirarchy from '@/assets/images/Heirarchy.png'
import TreeTimeLine from './TreeTimeLine.vue'
import AddMatrix from '@/shared/icons/AddMatrix.vue'
import AddHerikly from '@/shared/icons/AddHerikly.vue'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { useUserStore } from '@/stores/user'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const { t } = useI18n()
const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexHerikalyController = IndexHerikalyController.getInstance()
const state = ref(indexHerikalyController.state.value)
const route = useRoute()
const router = useRouter()

const fetchHerikaly = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const HerikalyParams = new IndexHerikalyParams(query,
  route.query.page ? Number(route.query.page) : pageNumber
  , perPage, withPage, true, null)
  await indexHerikalyController.getData(HerikalyParams)
}

onMounted(() => {
  fetchHerikaly()
})

const searchHerikaly = debounce(() => {
  router.push({
    query: {
      ...route.query,
      page: Number(route.query.page ?? 1),
      word: word.value || undefined,
    },
  })

  fetchHerikaly(word.value)
})

// const searchHerikaly = debounce(() => {
//   fetchHerikaly(word.value)
// })

const deleteHerikaly = async (id: number) => {
  const deleteHerikalyParams = new DeleteHerikalyParams(id)
  await DeleteHerikalyController.getInstance().deleteHerikaly(deleteHerikalyParams)
  await fetchHerikaly()
}

const changeStatusHerikaly = async (id: number) => {
  const changeStatusHerikalyParams = new ChangeStatusHerikalyParams(id)
  await ChangeStatusHerikalyController.getInstance().changeStatusHerikaly(
    changeStatusHerikalyParams,
  )
  await fetchHerikaly()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchHerikaly('', currentPage.value, countPerPage.value)
  router.push({
    query: {
      ...route.query,
      page: String(page),
      word: word.value,
    },
  })
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchHerikaly('', currentPage.value, countPerPage.value)
}

watch(
  () => indexHerikalyController.state.value,
  (newState) => {
    if (newState) {
      state.value = newState
    }
  },
  {
    deep: true,
  },
)

const actionList = (id: number, deleteHerikaly: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/organization/herikaly/${id}`,
    permission: [
      PermissionsEnum.HERIKALY_UPDATE,
      PermissionsEnum.HERIKALY_DETAILS,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.HERIKALY_ALL,
    ],
  },
  {
    text: t('add_sub_heirarchy'),
    icon: IconEdit,
    link: `/organization/herikaly/add/${id}`,
    permission: [
      PermissionsEnum.HERIKALY_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.HERIKALY_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteHerikaly(id),
    permission: [
      PermissionsEnum.HERIKALY_DELETE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.HERIKALY_ALL,
    ],
  },
]
const { user } = useUserStore()

const exportExcel = () => {
  if (!state.value.data || state.value.data.length === 0) {
    alert('No data available to export')
    return
  }
  const worksheetData = state.value.data.map((item: Record<string, unknown>) => {
    const it = item as any
    return {
      title: it.title || 'N/A',
    }
  })
  const worksheet = XLSX.utils.json_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoices')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(data, 'hierarchy.xlsx')
}
</script>

<template>
  <PermissionBuilder
    :code="[
      PermissionsEnum.WEBSITE,
      PermissionsEnum.HERIKALY_ALL,
      PermissionsEnum.HERIKALY_DELETE,
      PermissionsEnum.HERIKALY_FETCH,
      PermissionsEnum.HERIKALY_UPDATE,
      PermissionsEnum.HERIKALY_CREATE,
    ]"
  >
    <DataStatus :controller="state">
      <template #success>
        <!-- :Hierarchies="" -->
        <div class="mt-5">
          <!-- <Panel header="Hierarchy Actions" class="mb-5"> -->
          <div class="functional_hierarchy_parent">
            <PagesHeader
              :title="$t('functional_position')"
              :subtitle="$t(`define_the_position_and_assign_roles_for_your_project_team`)"
              :img="Heirarchy"
            />
            <div class="btn-container flex">
              <PermissionBuilder
                :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.HERIKALY_CREATE]"
              >
                <!-- add-btn -->
                <router-link to="/organization/herikaly/add" class="btn btn-primary">
                  <AddHerikly />
                  {{ $t('add_new_position') }}
                </router-link>
              </PermissionBuilder>
              <router-link class="btn btn-secondary" to="/organization/herikaly/matrix">
                <AddMatrix /> {{ $t('competency_matrix') }}</router-link
              >

              <router-link
                :to="`/${
                  user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
                }/herikaly/upload-excel`"
                class="btn btn-primary"
              >
                {{ $t('import_position') }}
              </router-link>
              <button class="btn btn-secondary" @click="exportExcel">Export Excel</button>
            </div>
          </div>
          <div class="btn-container flex"></div>
        </div>
        <TreeTimeLine :Hierarchies="state.data" @delete-data="fetchHerikaly" />
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
          :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.HERIKALY_CREATE]"
        >
          <DataEmpty
            :link="`/organization/herikaly/add`"
            addText="Add Herikaly"
            description="Sorry .. You have no Herikaly .. All your j   <AddHerikaly />oined customers will appear here when you add your customer data"
            title="..ops! You have No Herikaly"
          />
        </PermissionBuilder>
      </template>
      <template #failed>
        <PermissionBuilder
          :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.HERIKALY_CREATE]"
        >
          <DataFailed
            :link="`/organization/herikaly/add`"
            addText="Add Herikaly"
            description="Sorry .. You have no Herikaly .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No Herikaly"
          />
        </PermissionBuilder>
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no Herikaly .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </PermissionBuilder>
</template>

<style scoped lang="scss">
/* .btn-container {
  position: fixed;
  bottom: 0;   <AddHerikaly />
  width: 72%;
  padding-block: 1rem;
} */
.functional_hierarchy_parent {
  position: relative;
  .btn-container {
    position: absolute;
    top: 10px;
    right: 5px;
    z-index: 11111;
    @media (max-width: 1050px) {
      position: relative;
      justify-content: end;
    }
    .btn-secondary {
    }
  }
}
</style>
