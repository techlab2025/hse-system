<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import Search from '@/shared/icons/Search.vue'

import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'

import IndexCertificateController from '@/features/setting/Certificate/Presentation/controllers/indexCertificateController'
import IndexCertificateParams from '@/features/setting/Certificate/Core/params/indexCertificateParams'

import type CertificateModel from '@/features/setting/Certificate/Data/models/CertificateModel'
import type OrganizatoinEmployeeModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeModel'

import ValidCertificate from '../supcomponents/ValidCertificate.vue'
import NotValidCertificate from '../supcomponents/NotValidCertificate.vue'
import ExpiredCertificate from '../supcomponents/ExpiredCertificate.vue'
import NotRequired from '../supcomponents/NotRequired.vue'

import IndexEmployeeCertificateController from '../controllers/indexEmployeeCertificateController'
import IndexEmployeeCertificateParams from '../../Core/params/IndexEmployeeCertificateParams'

import RenewCertificateNotRequiredDialog from '../supcomponents/RenewCertificateNotRequiredDialog.vue'

import { CertificateStatusEnum } from '@/features/Organization/OrganizationEmployee/Core/Enum/CertificateStatusEnum'

const { t } = useI18n()
const route = useRoute()

/* ---------------------------------- STATE --------------------------------- */

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)

const indexEmployeeCertificateController = IndexEmployeeCertificateController.getInstance()
const state = ref(indexEmployeeCertificateController.state.value)

const indexCertificateController = IndexCertificateController.getInstance()
const Certificatestate = ref<CertificateModel[]>(indexCertificateController.state.value)

/* ---------------------------------- FETCH ---------------------------------- */

const fetchCertificates = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10
) => {
  const params = new IndexCertificateParams(query, pageNumber, perPage, 0)
  await indexCertificateController.getData(params)
}

const fetchOrganizationEmployee = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1
) => {
  const params = new IndexEmployeeCertificateParams(
    query,
    pageNumber,
    perPage,
    withPage,
    route.params.id ? Number(route.params.id) : null
  )

  await indexEmployeeCertificateController.getData(params)
}

/* --------------------------------- MOUNTED --------------------------------- */

onMounted(() => {
  fetchOrganizationEmployee()

  if (!route.params.id) {
    fetchCertificates()
  }
})

/* ---------------------------------- SEARCH --------------------------------- */

const searchEmployeeCertificate = debounce(() => {
  fetchOrganizationEmployee(word.value)
})

/* ------------------------------ PAGINATION --------------------------------- */

const handleChangePage = (page: number) => {
  currentPage.value = page

  fetchOrganizationEmployee('', currentPage.value, countPerPage.value)

  if (!route.params.id) {
    fetchCertificates('', currentPage.value, countPerPage.value)
  }
}

const handleCountPerPage = (count: number) => {
  countPerPage.value = count

  fetchOrganizationEmployee('', currentPage.value, countPerPage.value)

  if (!route.params.id) {
    fetchCertificates('', currentPage.value, countPerPage.value)
  }
}

/* ---------------------------------- WATCH ---------------------------------- */

watch(
  () => indexEmployeeCertificateController.state.value,
  (newState) => {
    if (newState) state.value = newState
  },
  { deep: true }
)

watch(
  () => indexCertificateController.state.value,
  (newState) => {
    if (newState) Certificatestate.value = newState
  },
  { deep: true }
)

/* --------------------------- CERTIFICATE STATUS ---------------------------- */

const getCertificateStatus = (
  employee: OrganizatoinEmployeeModel,
  certificateId: number
) => {
  const cert = employee.certificates?.find((c: any) => c.id === certificateId)
  return cert?.status
}

const getEmployeeCertificationStatus = (
  employee: OrganizatoinEmployeeModel,
  certificateId: number
) => {
  const cert = employee.employee_certificates?.find(
    (c: any) => c.certificate_id === certificateId
  )

  return cert?.status
}

/* --------------------------- CERTIFICATES SOURCE --------------------------- */

const AllCertificates = computed(() => {
  if (route.params.id && state.value?.data?.length) {
    return state.value.data[0].certificates || []
  }

  return Certificatestate.value?.data || []
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <span class="icon-remove" @click="((word = ''), searchEmployeeCertificate())">
        <Search />
      </span>

      <input v-model="word" placeholder="search" class="input" type="text" @input="searchEmployeeCertificate" />
    </div>
  </div>

  <PermissionBuilder :code="[
    PermissionsEnum.ORGANIZATION_EMPLOYEE,
    PermissionsEnum.EMPLOYEE_CERTIFICATE_ALL,
    PermissionsEnum.EMPLOYEE_CERTIFICATE_DELETE,
    PermissionsEnum.EMPLOYEE_CERTIFICATE_FETCH,
    PermissionsEnum.EMPLOYEE_CERTIFICATE_UPDATE,
    PermissionsEnum.EMPLOYEE_CERTIFICATE_CREATE
  ]">
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive employee-certificates-matrix">
          <table class="main-table">
            <thead>
              <tr>
                <th class="w-fit">{{ $t('emp') }}</th>

                <th v-for="cert in AllCertificates" :key="cert.id">
                  {{ cert.title }}
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="employee in state.data" :key="employee.id">
                <td class="employee-info-container">
                  <div class="employee-info">
                    <span class="name">
                      {{ employee.name }}
                    </span>
                  </div>
                </td>

                <td v-for="cert in AllCertificates" :key="cert.id">
                  <!-- VALID -->
                  <ValidCertificate v-if="
                    getCertificateStatus(employee, cert.id) ==
                    CertificateStatusEnum.Valid
                  " :expiry_date="employee?.certificates?.find(el => el.id == cert.id)?.expired_at
                    " :status="getCertificateStatus(employee, cert.id)" />

                  <!-- INVALID -->
                  <NotValidCertificate v-else-if="
                    getCertificateStatus(employee, cert.id) ==
                    CertificateStatusEnum.Invalid
                  " @update:data="fetchOrganizationEmployee" :certificateId="cert.id"
                    :organizationEmployeeId="employee.id" :cert="cert" :is_expire_date="cert.requireExpiredDate"
                    :status="getCertificateStatus(employee, cert.id)" />

                  <!-- EXPIRED -->
                  <ExpiredCertificate v-else-if="
                    getCertificateStatus(employee, cert.id) ==
                    CertificateStatusEnum.Expired
                  " @update:data="fetchOrganizationEmployee" :certificateId="cert.id"
                    :organizationEmployeeId="employee.id" :cert="cert" :is_expire_date="cert.requireExpiredDate"
                    :status="getCertificateStatus(employee, cert.id)" />

                  <!-- NOT REQUIRED -->
                  <NotRequired v-else @update:data="fetchOrganizationEmployee" :certificateId="cert.id"
                    :organizationEmployeeId="employee.id" :is_expire_date="cert.requireExpiredDate"
                    :status="getCertificateStatus(employee, cert.id)" />
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
        <DataFailed title="..ops! You have No Employee in this heirarchy" link="/organization"
          description="Sorry .. You have no Employee in this heirarchy .. All your joined employees will appear here when you add your employee data" />
      </template>

      <template #failed>
        <DataFailed title="..ops! You have No Employee in this heirarchy" link="/organization"
          description="Sorry .. You have no Employee in this heirarchy .. All your joined employees will appear here when you add your employee data" />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed addText="Have not Permission" />
    </template>
  </PermissionBuilder>
</template>

<style scoped>
.w-fit {
  width: fit-content;
}

/* .text-center {
  text-align: center !important;
} */

.table-responsive table.main-table thead tr th {
  text-align: center !important;
}

.table-responsive table.main-table thead tr th:first-child {
  text-align: start !important;
}

.table-responsive table.main-table thead tr th:last-child {
  justify-content: center !important;
}

.employee-certificates-matrix .main-table td {
  text-align: center !important;
}

.employee-certificates-matrix .main-table td:first-child {
  text-align: start !important;
}
</style>
