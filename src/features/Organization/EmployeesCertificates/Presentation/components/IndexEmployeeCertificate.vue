<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
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
import type TitleInterface from '@/base/Data/Models/title_interface'
import ValidCertificate from '../supcomponents/ValidCertificate.vue'
import NotValidCertificate from '../supcomponents/NotValidCertificate.vue'
import { CertificateStatusEnum } from '@/features/Organization/OrganizationEmployee/Core/Enum/CertificateStatusEnum'
import ExpiredCertificate from '../supcomponents/ExpiredCertificate.vue'
const { t } = useI18n()

const route = useRoute()
const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)

const indexOrganizatoinEmployeeController = IndexOrganizatoinEmployeeController.getInstance()
const state = ref(indexOrganizatoinEmployeeController.state.value)

const indexCertificateController = IndexCertificateController.getInstance()
const Certificatestate = ref<CertificateModel[]>(indexCertificateController.state.value)



const fetchCertficates = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const indexCertificateParams = new IndexCertificateParams(query, pageNumber, perPage, withPage)
  await indexCertificateController.getData(indexCertificateParams)
}

const fetchOrganizationEmployee = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const indexOrganizatoinEmployeeParams = new IndexOrganizatoinEmployeeParams(query, pageNumber, perPage, withPage)
  await indexOrganizatoinEmployeeController.getData(indexOrganizatoinEmployeeParams)
}

onMounted(() => {
  fetchOrganizationEmployee()
  fetchCertficates()
})

const searchEmployeeCertificate = debounce(() => {
  fetchOrganizationEmployee(word.value)
})



const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchOrganizationEmployee('', currentPage.value, countPerPage.value)
  fetchCertficates('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchOrganizationEmployee('', currentPage.value, countPerPage.value)
  fetchCertficates('', currentPage.value, countPerPage.value)
}

watch(
  () => indexOrganizatoinEmployeeController.state.value,
  (newState) => {
    if (newState) {
      state.value = newState
    }
  },
  {
    deep: true,
  },
)
watch(
  () => indexCertificateController.state.value,
  (newState) => {
    if (newState) {
      Certificatestate.value = newState
    }
  },
  {
    deep: true,
  },
)


// Check if a specific employee has a specific certificate and return its status
const getCertificateStatus = (employee: any, certificateId: number) => {
  const CertificateStatus = employee.certificates?.find(
    (certificate: any) => certificate.id === certificateId
  );

  // if (!CertificateStatus) return "NotRequired";

  // console.log(CertificateStatus, "CertificateStatus")
  return CertificateStatus?.isDone;
};
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <span class="icon-remove" @click="((word = ''), searchEmployeeCertificate())">
        <Search />
      </span>
      <input v-model="word" :placeholder="'search'" class="input" type="text" @input="searchEmployeeCertificate" />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
    </div>
  </div>

  <PermissionBuilder :code="[
    PermissionsEnum.ORGANIZATION_EMPLOYEE,
    PermissionsEnum.EMPLOYEE_CERTIFICATE_ALL,
    PermissionsEnum.EMPLOYEE_CERTIFICATE_DELETE,
    PermissionsEnum.EMPLOYEE_CERTIFICATE_FETCH,
    PermissionsEnum.EMPLOYEE_CERTIFICATE_UPDATE,
    PermissionsEnum.EMPLOYEE_CERTIFICATE_CREATE,
  ]">
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive employee-certificates-matrix">
          <table class="main-table">
            <thead>
              <tr>
                <th scope="col">{{ $t('emp') }}</th>

                <th scope="col" v-for="cert in Certificatestate.data" :key="cert.id">
                  {{ cert.title }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="employee in state.data" :key="employee.id">
                <td class="font-bold">{{ employee.name }}</td>

                <td v-for="cert in Certificatestate.data" :key="cert.id" class=" text-center h-full">
                  <span :class="cert.id">
                    <ValidCertificate v-if="getCertificateStatus(employee, cert.id) == CertificateStatusEnum.Valid"
                      :expiry_date="`1-1-2001`" />

                    <NotValidCertificate
                      v-else-if="getCertificateStatus(employee, cert.id) == CertificateStatusEnum.Invalid" />
                    <ExpiredCertificate
                      v-else-if="getCertificateStatus(employee, cert.id) == CertificateStatusEnum.Expired" />
                    <div class="not-required" v-else>
                      NotRequired</div>
                  </span>
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
        <DataEmpty :link="`/organization/EmployeeCertificate/add`" addText="Add EmployeeCertificate"
          description="Sorry .. You have no EmployeeCertificate .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No EmployeeCertificate" />
      </template>
      <template #failed>
        <DataFailed :link="`/organization/EmployeeCertificate/add`" addText="Add EmployeeCertificate"
          description="Sorry .. You have no EmployeeCertificate .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No EmployeeCertificate" />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed addText="Have not  Permission"
        description="Sorry .. You have no EmployeeCertificate .. All your joined customers will appear here when you add your customer data"
        link="" />
    </template>
  </PermissionBuilder>
</template>

<style scoped></style>
