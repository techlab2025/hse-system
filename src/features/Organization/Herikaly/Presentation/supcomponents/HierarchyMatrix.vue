<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import { useRoute, useRouter } from 'vue-router'
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


// import IndexEmployeeCertificateController from '../controllers/indexEmployeeCertificateController'
// import IndexEmployeeCertificateParams from '../../Core/params/IndexEmployeeCertificateParams'

import RenewCertificateNotRequiredDialog from '../supcomponents/RenewCertificateNotRequiredDialog.vue'

import { CertificateStatusEnum } from '@/features/Organization/OrganizationEmployee/Core/Enum/CertificateStatusEnum'
import HierarchyCertyificateController from '../controllers/HierarchyCertificateController'
import FetchHierarchyCertificatesParams from '../../Core/params/FetchHierarchyCertificatesParams'
import type HierarchyCertificateModel from '../../Data/models/HeirarchyCertificateModel'

const { t } = useI18n()
const route = useRoute()


const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)

const hierarchyCertyificateController = HierarchyCertyificateController.getInstance()
const state = ref(hierarchyCertyificateController.state.value)

const indexCertificateController = IndexCertificateController.getInstance()
const Certificatestate = ref<CertificateModel[]>(indexCertificateController.state.value)


const fetchCertificates = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10
) => {
  const params = new IndexCertificateParams(query, pageNumber, perPage, 0)
  await indexCertificateController.getData(params)
}

const router = useRouter()
const fetchHierarchyCertificate = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1
) => {
  const params = new FetchHierarchyCertificatesParams(
    query,
    pageNumber,
    perPage,
    withPage,
  )

  await hierarchyCertyificateController.FetchHerikalyCertificate(params, router)
}


onMounted(() => {
  fetchHierarchyCertificate()

  if (!route.params.id) {
    fetchCertificates()
  }
})


const searchHierarchyCertificate = debounce(() => {
  fetchHierarchyCertificate(word.value)
})


const handleChangePage = (page: number) => {
  currentPage.value = page

  fetchHierarchyCertificate('', currentPage.value, countPerPage.value)

  if (!route.params.id) {
    fetchCertificates('', currentPage.value, countPerPage.value)
  }
}

const handleCountPerPage = (count: number) => {
  countPerPage.value = count

  fetchHierarchyCertificate('', currentPage.value, countPerPage.value)

  if (!route.params.id) {
    fetchCertificates('', currentPage.value, countPerPage.value)
  }
}


watch(
  () => hierarchyCertyificateController.state.value,
  (newState) => {
    console.log(newState, "newState");
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


// const getCertificateStatus = (
//   employee: OrganizatoinEmployeeModel,
//   certificateId: number
// ) => {
//   const cert = employee.certificates?.find((c: any) => c.id === certificateId)
//   return cert?.status
// }

const getEmployeeCertificationStatus = (
  Hierarchy: HierarchyCertificateModel,
  certificate: CertificateModel
) => {
  if (Hierarchy.certificates.find((c: CertificateModel) => c.id === certificate.id)) {
    return 'Required'
  }
  else {
    return 'Not Required'
  }
}
const getEmployeeCertificationclass = (
  Hierarchy: HierarchyCertificateModel,
  certificate: CertificateModel
) => {
  if (Hierarchy.certificates.find((c: CertificateModel) => c.id === certificate.id)) {
    return 'cert_required'
  }
  else {
    return 'cert_not_required'
  }
}


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
      <span class="icon-remove" @click="((word = ''), searchHierarchyCertificate())">
        <Search />
      </span>

      <input v-model="word" placeholder="search" class="input" type="text" @input="searchHierarchyCertificate" />
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
        <!-- {{ state.data }} -->

        <div class="table-responsive employee-certificates-matrix">
          <table class="main-table">
            <thead>
              <tr>
                <th class="w-fit">{{ $t('Hierarchy') }}</th>
                <th v-for="cert in AllCertificates" :key="cert.id">
                  <router-link :to="`/organization/organization-employee?type=3&certificate_id=${cert.id}`">
                    {{ cert.title }}
                  </router-link>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="hierarchy in state.data" :key="hierarchy.id">
                <td class="employee-info-container">
                  <router-link :to="`/organization/employee-certificate/${hierarchy.id}`" class="employee-info">
                    <span class="name">
                      {{ hierarchy.title }}
                    </span>
                  </router-link>
                </td>

                <td v-for="cert in AllCertificates" :key="cert.id"
                  :class="getEmployeeCertificationclass(hierarchy, cert)">
                  <p class="cert-status">
                    {{ getEmployeeCertificationStatus(hierarchy, cert) }}
                  </p>
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
        <DataEmpty title="..ops! You have No Employee in this heirarchy" link="/organization"
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

.employee-info {
  padding: 10px !important;
  text-align: center;
}




</style>
