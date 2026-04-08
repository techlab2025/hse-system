<script lang="ts" setup>
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import wordSlice from '@/base/Presentation/utils/word_slice'
import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import Search from '@/shared/icons/Search.vue'
import IndexCertificateController from '../controllers/indexCertificateController'
import IndexCertificateParams from '../../Core/params/indexCertificateParams'
import DeleteCertificateParams from '../../Core/params/deleteCertificateParams'
import DeleteCertificateController from '../controllers/deleteCertificateController'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { useUserStore } from '@/stores/user'
import ActionsTableEdit from '@/shared/icons/ActionsTableEdit.vue'
import Image from 'primevue/image'

const { t } = useI18n()
const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexCertificateController = IndexCertificateController.getInstance()
const state = ref(indexCertificateController.state.value)
const route = useRoute()
const router = useRouter()
const id = ref(route.params.parent_id)

const fetchCertificate = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteCertificateParams = new IndexCertificateParams(
    query,
    route.query.page ? Number(route.query.page) : pageNumber,
    perPage,
    withPage,
    // id.value?? '',
  )
  await indexCertificateController.getData(deleteCertificateParams)
}
onMounted(async () => {
  if (route.query.word) {
    word.value = String(route.query.word)
  }
  await fetchCertificate(
    word.value,
    route.query.page ? Number(route.query.page) : 1,
    countPerPage.value,
  )
})

const searchCertificate = debounce(() => {
  router.push({
    query: {
      ...route.query,
      page: Number(route.query.page ?? 1),
      word: word.value || undefined,
    },
  })
  fetchCertificate(word.value)
})

const deleteCertificate = async (id: number) => {
  const deleteCertificateParams = new DeleteCertificateParams(id)
  await DeleteCertificateController.getInstance().deleteCertificate(deleteCertificateParams)
  await fetchCertificate()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchCertificate('', currentPage.value, countPerPage.value)
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
  fetchCertificate('', currentPage.value, countPerPage.value)
}

watch(
  () => indexCertificateController.state.value,
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

const actionList = (id: number, deleteCertificate: (id: number) => void) => [
  {
    text: t('edit'),
    icon: ActionsTableEdit,
    link: `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/certificate/${id}`,
    permission: [
      PermissionsEnum.CERTIFICATE_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.CERTIFICATE_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteCertificate(id),
    permission: [
      PermissionsEnum.CERTIFICATE_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.CERTIFICATE_ALL,
    ],
  },
]

watch(
  () => route?.params?.id,
  (Newvalue) => {
    // id = Newvalue
    fetchCertificate()
  },
)

// Export To Excel Sheet
const exportExcel = () => {
  if (!state.value.data || state.value.data.length === 0) {
    alert('No data available to export')
    return
  }
  const worksheetData = state.value.data.map((item: Record<string, unknown>) => {
    const it = item as any
    return {
      'Certificate Title': it.title || 'N/A',
      'Require Expired Date': it.requireExpiredDate ? 'Yes' : 'No',
      Image: '*',
    }
  })
  const worksheet = XLSX.utils.json_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoices')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(data, 'certificate.xlsx')
}

// const IndexAction = () => [
//   {
//     text: t('edit'),
//     icon: ActionsTableEdit,
//     link: `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/certificate/${id}`,
//     permission: [
//       PermissionsEnum.CERTIFICATE_UPDATE,
//       PermissionsEnum.ADMIN,
//       PermissionsEnum.ORGANIZATION_EMPLOYEE,
//       PermissionsEnum.CERTIFICATE_ALL,
//     ],
//   },

//   {
//     text: t('delete'),
//     icon: IconDelete,
//     action: () => deleteCertificate(id),
//     permission: [
//       PermissionsEnum.CERTIFICATE_DELETE,
//       PermissionsEnum.ADMIN,
//       PermissionsEnum.ORGANIZATION_EMPLOYEE,
//       PermissionsEnum.CERTIFICATE_ALL,
//     ],
//   },
// ]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchCertificate())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchCertificate"
      />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <!-- <ExportExcel :data="state.data" /> -->
      <button class="btn btn-secondary" @click="exportExcel">Export Excel</button>

      <ExportPdf />
      <PermissionBuilder :code="[PermissionsEnum.CERTIFICATE_CREATE]">
        <router-link
          :to="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/certificate/add`"
          class="btn btn-primary"
        >
          {{ $t('Add_Certificate') }}
        </router-link>
      </PermissionBuilder>

      <PermissionBuilder :code="[PermissionsEnum.CERTIFICATE_CREATE]">
        <router-link
          :to="`/${
            user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
          }/certificate/import-excel`"
          class="btn btn-primary"
        >
          {{ $t('import_certificate') }}
        </router-link>
      </PermissionBuilder>
      <!-- <DropList :actionList="actionList"  /> -->
    </div>
  </div>

  <PermissionBuilder
    :code="[
      PermissionsEnum.CERTIFICATE_ALL,
      PermissionsEnum.CERTIFICATE_DELETE,
      PermissionsEnum.CERTIFICATE_FETCH,
      PermissionsEnum.CERTIFICATE_UPDATE,
      PermissionsEnum.CERTIFICATE_CREATE,
    ]"
  >
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive mt-2">
          <table class="main-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{{ $t('title') }}</th>
                <th scope="col" v-if="user?.type === OrganizationTypeEnum?.ADMIN">
                  {{ $t('all_industries') }}
                </th>
                <th scope="col" v-if="user?.type === OrganizationTypeEnum?.ADMIN">
                  {{ $t('industries') }}
                </th>
                <th scope="col">{{ $t('requireExpiredDate') }}</th>
                <th scope="col">{{ $t('image') }}</th>

                <!-- <th scope="col">{{ $t('actions') }}</th> -->
                <th class="empty"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link
                    :to="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/certificate/${item.id}`"
                    >{{ index + 1 }}
                  </router-link>
                </td>
                <td data-label="Name">{{ wordSlice(item?.title) }}</td>
                <td data-label="all_industries" v-if="user?.type === OrganizationTypeEnum?.ADMIN">
                  {{ item.allIndustries ? $t('yes') : $t('no') }}
                </td>
                <td data-label="all_industries" v-if="user?.type === OrganizationTypeEnum?.ADMIN">
                  {{
                    item.industries.length > 0
                      ? item.industries.map((industry) => industry.title).join(', ')
                      : $t('no')
                  }}
                </td>
                <td>
                  {{ item.requireExpiredDate ? $t('yes') : $t('no') }}
                </td>
                <td data-label="image">
                  <div class="image_certificate_container">
                    <Image v-if="item.image" :src="item.image" alt="Image" preview />
                    <!-- <img v-if="item.image" :src="item.image" alt="" /> -->
                    <span v-else>---</span>
                  </div>
                </td>

                <td data-label="Actions">
                  <DropList
                    :actionList="actionList(item.id, deleteCertificate)"
                    @delete="deleteCertificate(item.id)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- <div class="index-certificate-container">
          <CertificateCard v-for="(certificate, index) in state.data" :key="index" :cerificate="certificate" />
        </div> -->
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
        <PermissionBuilder :code="[PermissionsEnum.CERTIFICATE_CREATE]">
          <DataEmpty
            :link="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/certificate/add`"
            addText="Add certificate"
            description="Sorry .. You have no Certificate .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No Certificate"
          />
        </PermissionBuilder>
      </template>
      <template #failed>
        <PermissionBuilder :code="[PermissionsEnum.CERTIFICATE_CREATE]">
          <DataFailed
            :link="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/certificate/add`"
            addText="Add Certificate"
            description="Sorry .. You have no Certificate .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No Certificate"
          />
        </PermissionBuilder>
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no AccidentTypeuage .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </PermissionBuilder>
</template>
