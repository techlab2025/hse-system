<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import Search from '@/shared/icons/Search.vue'

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
  perPage: number = 10,
) => {
  const params = new IndexCertificateParams(query, pageNumber, perPage, 0)
  await indexCertificateController.getData(params)
}

const fetchOrganizationEmployee = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const params = new IndexEmployeeCertificateParams(
    query,
    pageNumber,
    perPage,
    withPage,
    route.params.id ? Number(route.params.id) : null,
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
  { deep: true },
)

watch(
  () => indexCertificateController.state.value,
  (newState) => {
    if (newState) Certificatestate.value = newState
  },
  { deep: true },
)

/* --------------------------- CERTIFICATE STATUS ---------------------------- */

const getCertificateStatus = (employee: OrganizatoinEmployeeModel, certificateId: number) => {
  const cert = employee.certificates?.find((c: any) => c.id === certificateId)
  return cert?.status
}

const getEmployeeCertificationStatus = (
  employee: OrganizatoinEmployeeModel,
  certificateId: number,
) => {
  const cert = employee.employee_certificates?.find((c: any) => c.certificate_id === certificateId)

  return cert?.status
}

/* --------------------------- CERTIFICATES SOURCE --------------------------- */

const AllCertificates = computed(() => {
  if (route.params.id && state.value?.data?.length) {
    return state.value.data[0].certificates || []
  }

  return Certificatestate.value?.data || []
})

const employeeCount = computed(() => state.value?.data?.length || 0)
const certificateCount = computed(() => AllCertificates.value?.length || 0)
</script>

<template>
  <section class="employee-certificates-page">
    <div class="certificate-matrix-toolbar">
      <div>
        <span class="matrix-kicker">Certificate matrix</span>
        <h1>Employee certification board</h1>
        <p>Track validity, expiry, renewals, and missing certificates across employees.</p>
      </div>

      <div class="matrix-stats">
        <span>{{ employeeCount }} employees</span>
        <span>{{ certificateCount }} certificates</span>
      </div>
    </div>

    <div class="matrix-search-row">
      <div class="input-search matrix-search">
        <span class="icon-remove" @click="((word = ''), searchEmployeeCertificate())">
          <Search />
        </span>

        <input
          v-model="word"
          placeholder="Search employee"
          class="input"
          type="text"
          @input="searchEmployeeCertificate"
        />
      </div>
    </div>

    <PermissionBuilder
      :code="[
        PermissionsEnum.ORGANIZATION_EMPLOYEE,
        PermissionsEnum.EMPLOYEE_CERTIFICATE_ALL,
        PermissionsEnum.EMPLOYEE_CERTIFICATE_DELETE,
        PermissionsEnum.EMPLOYEE_CERTIFICATE_FETCH,
        PermissionsEnum.EMPLOYEE_CERTIFICATE_UPDATE,
        PermissionsEnum.EMPLOYEE_CERTIFICATE_CREATE,
      ]"
    >
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
                      <!-- <span class="employee-avatar">{{ employee.name?.charAt(0) || '?' }}</span> -->
                      <span class="name">
                        {{ employee.name }}
                      </span>
                    </div>
                  </td>

                  <td v-for="cert in AllCertificates" :key="cert.id">
                    <!-- VALID -->
                    <ValidCertificate
                      v-if="getCertificateStatus(employee, cert.id) == CertificateStatusEnum.Valid"
                      :expiry_date="
                        employee?.certificates?.find((el) => el.id == cert.id)?.expired_at
                      "
                      :status="getCertificateStatus(employee, cert.id)"
                    />

                    <!-- INVALID -->
                    <NotValidCertificate
                      v-else-if="
                        getCertificateStatus(employee, cert.id) == CertificateStatusEnum.Invalid
                      "
                      @update:data="fetchOrganizationEmployee"
                      :certificateId="cert.id"
                      :organizationEmployeeId="employee.id"
                      :cert="cert"
                      :is_expire_date="cert.requireExpiredDate"
                      :status="getCertificateStatus(employee, cert.id)"
                    />

                    <!-- EXPIRED -->
                    <ExpiredCertificate
                      v-else-if="
                        getCertificateStatus(employee, cert.id) == CertificateStatusEnum.Expired
                      "
                      @update:data="fetchOrganizationEmployee"
                      :certificateId="cert.id"
                      :organizationEmployeeId="employee.id"
                      :cert="cert"
                      :is_expire_date="cert.requireExpiredDate"
                      :status="getCertificateStatus(employee, cert.id)"
                    />

                    <!-- NOT REQUIRED -->
                    <NotRequired
                      v-else
                      @update:data="fetchOrganizationEmployee"
                      :certificateId="cert.id"
                      :organizationEmployeeId="employee.id"
                      :is_expire_date="cert.requireExpiredDate"
                      :status="getCertificateStatus(employee, cert.id)"
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
          <TableLoader :cols="3" :rows="10" />
        </template>

        <template #initial>
          <TableLoader :cols="3" :rows="10" />
        </template>

        <template #empty>
          <DataFailed
            title="..ops! You have No Employee in this heirarchy"
            link="/organization"
            description="Sorry .. You have no Employee in this heirarchy .. All your joined employees will appear here when you add your employee data"
          />
        </template>

        <template #failed>
          <DataFailed
            title="..ops! You have No Employee in this heirarchy"
            link="/organization"
            description="Sorry .. You have no Employee in this heirarchy .. All your joined employees will appear here when you add your employee data"
          />
        </template>
      </DataStatus>

      <template #notPermitted>
        <DataFailed addText="Have not Permission" />
      </template>
    </PermissionBuilder>
  </section>
</template>

<style scoped>
.employee-certificates-page {
  min-width: 0;
}

.certificate-matrix-toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
  padding: 18px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 76%, transparent);
  border-radius: 24px;
  background: radial-gradient(circle at 0 0, color-mix(in srgb, var(--brand-primary-500) 13%, transparent), transparent 34%);
  box-shadow: 0 18px 42px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
}

.matrix-kicker {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 10px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 18%, transparent);
  border-radius: 999px;
  color: var(--brand-primary-500);
  font-size: 11px;
  font-weight: 900;
  background: color-mix(in srgb, var(--brand-primary-500) 8%, transparent);
}

.certificate-matrix-toolbar h1 {
  margin: 8px 0 4px;
  color: var(--brand-primary-800);
  font-size: clamp(24px, 3vw, 34px);
  font-weight: 900;
  letter-spacing: 0;
  line-height: 1.12;
}

.certificate-matrix-toolbar p {
  max-width: 620px;
  margin: 0;
  color: var(--brand-primary-500);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.45;
}

.matrix-stats {
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.matrix-stats span {
  min-height: 32px;
  padding: 8px 11px;
  border: 1px solid color-mix(in srgb, var(--status-success) 20%, transparent);
  border-radius: 999px;
  color: var(--brand-primary-500);
  font-size: 11px;
  font-weight: 900;
  background: color-mix(in srgb, var(--brand-primary-500) 8%, transparent);
}

.matrix-search-row {
  display: grid;
  grid-template-columns: minmax(240px, 420px);
  margin-bottom: 14px;
}

.matrix-search {
  position: relative;
  width: 100%;
}

.matrix-search .input {
  min-height: 46px;
  padding-inline-start: 44px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 90%, transparent) !important;
  border-radius: 16px !important;
  background: var(--surface-1) !important;
  box-shadow: 0 12px 26px color-mix(in srgb, var(--brand-primary-900) 5%, transparent);
}

.matrix-search .icon-remove {
  position: absolute;
  z-index: 2;
  inset-inline-start: 14px;
  top: 50%;
  display: grid;
  width: 24px;
  height: 24px;
  place-items: center;
  color: var(--brand-primary-500);
  transform: translateY(-50%);
  cursor: pointer;
}

.w-fit {
  width: 220px;
  min-width: 220px;
}

.employee-certificates-matrix {
  max-width: 100%;
  padding: 12px;
  overflow-x: auto;
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 78%, transparent);
  border-radius: 24px;
  background:
    radial-gradient(circle at 0 0, color-mix(in srgb, var(--brand-primary-500) 10%, transparent), transparent 28%),
    linear-gradient(135deg, var(--surface-1), var(--brand-primary-50));
  box-shadow: 0 20px 48px color-mix(in srgb, var(--brand-primary-900) 8%, transparent);
}

.employee-certificates-matrix .main-table {
  width: max-content;
  min-width: 100%;
  border-collapse: separate !important;
  border-spacing: 0 10px !important;
}

.table-responsive table.main-table thead tr th {
  min-width: 168px;
  max-width: 220px;
  padding: 14px 16px !important;
  border-block: 1px solid color-mix(in srgb, var(--brand-primary-100) 92%, transparent) !important;
  color: var(--brand-primary-700) !important;
  font-size: 12px !important;
  font-weight: 900 !important;
  line-height: 1.25;
  text-align: center !important;
  text-transform: none !important;
  white-space: normal !important;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--brand-primary-500) 8%, transparent), color-mix(in srgb, var(--status-success) 6%, transparent)), var(--brand-primary-50) !important;
}

.table-responsive table.main-table thead tr th:first-child {
  position: sticky !important;
  z-index: 8 !important;
  inset-inline-start: 0 !important;
  min-width: 240px;
  border-inline-start: 1px solid color-mix(in srgb, var(--brand-primary-100) 92%, transparent) !important;
  border-start-start-radius: 16px;
  border-end-start-radius: 16px;
  text-align: start !important;
  background: linear-gradient(135deg, var(--brand-primary-800), var(--brand-primary-500)) !important;
  color: var(--text-on-brand) !important;
}

.table-responsive table.main-table thead tr th:last-child,
.employee-certificates-matrix .main-table td:last-child {
  position: static !important;
  inset-inline-end: auto !important;
}

.employee-certificates-matrix .main-table td {
  min-width: 168px;
  padding: 12px !important;
  border-block: 1px solid color-mix(in srgb, var(--brand-primary-100) 78%, transparent) !important;
  background: var(--surface-1) !important;
  text-align: center !important;
  vertical-align: middle !important;
}

.employee-certificates-matrix .main-table td:first-child {
  position: sticky !important;
  z-index: 7 !important;
  inset-inline-start: 0 !important;
  min-width: 240px;
  border-inline-start: 1px solid color-mix(in srgb, var(--brand-primary-100) 78%, transparent) !important;
  border-start-start-radius: 16px;
  border-end-start-radius: 16px;
  text-align: start !important;
  background: linear-gradient(90deg, var(--surface-1) 78%, transparent), var(--surface-1) !important;
  box-shadow: 16px 0 24px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
}

.employee-certificates-matrix .main-table tbody tr:hover td {
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--brand-primary-500) 4.5%, transparent), color-mix(in srgb, var(--status-success) 3.5%, transparent)), var(--surface-1) !important;
}

.employee-certificates-matrix .main-table tbody tr:hover td:first-child {
  background: linear-gradient(90deg, var(--brand-primary-50) 78%, transparent), var(--brand-primary-50) !important;
}

.employee-info-container .employee-info {
  display: flex !important;
  width: 100%;
  min-width: 0;
  align-items: center !important;
  gap: 10px !important;
  padding: 0 !important;
  background: transparent !important;
}

.employee-avatar {
  display: inline-grid;
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 13px;
  color: var(--text-on-brand);
  font-size: 14px;
  font-weight: 900;
  background: linear-gradient(135deg, var(--brand-primary-500), var(--brand-primary-800));
  box-shadow: 0 10px 18px color-mix(in srgb, var(--brand-primary-500) 18%, transparent);
}

.employee-info-container .name {
  min-width: 0;
  overflow: hidden;
  color: var(--brand-primary-900);
  font-size: 13px;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.employee-certificates-matrix :deep(.valid-certificate),
.employee-certificates-matrix :deep(.invalid-certificate),
.employee-certificates-matrix :deep(.expired-certificate) {
  min-width: 130px;
  min-height: 58px;
  justify-content: center;
  gap: 5px;
  padding: 9px 10px;
  border-radius: 15px;
  box-shadow: none;
}

.employee-certificates-matrix :deep(.valid-certificate) {
  border: 1px solid color-mix(in srgb, var(--status-success) 18%, transparent);
  background: color-mix(in srgb, var(--status-success) 8%, transparent);
}

.employee-certificates-matrix :deep(.invalid-certificate) {
  border: 1px solid color-mix(in srgb, var(--status-danger) 18%, transparent);
  background: color-mix(in srgb, var(--status-danger) 6%, transparent);
}

.employee-certificates-matrix :deep(.expired-certificate) {
  border: 1px solid color-mix(in srgb, var(--brand-accent-500) 22%, transparent);
  background: color-mix(in srgb, var(--brand-accent-500) 8%, transparent);
}

.employee-certificates-matrix :deep(.not-required-container) {
  min-width: 130px;
  justify-content: center;
  border: 1px solid color-mix(in srgb, var(--brand-primary-400) 22%, transparent);
  background: var(--brand-primary-50);
}

.employee-certificates-matrix :deep(.valid-title),
.employee-certificates-matrix :deep(.invalid-title),
.employee-certificates-matrix :deep(.expired-title),
.employee-certificates-matrix :deep(.not-req-span) {
  font-size: 12px !important;
  font-weight: 900 !important;
  text-transform: capitalize;
}

.employee-certificates-matrix :deep(.valid-date) {
  color: var(--brand-primary-500);
  font-size: 10px;
  font-weight: 800;
}

.employee-certificates-matrix :deep(button) {
  min-height: 28px;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
}

@media (max-width: 700px) {
  .certificate-matrix-toolbar {
    flex-direction: column;
  }

  .matrix-stats {
    justify-content: flex-start;
  }

  .matrix-search-row {
    grid-template-columns: 1fr;
  }

  .w-fit,
  .table-responsive table.main-table thead tr th:first-child,
  .employee-certificates-matrix .main-table td:first-child {
    min-width: 190px;
  }
}
</style>
