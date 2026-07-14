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
import IndexCertificateController from '@/features/setting/Certificate/Presentation/controllers/indexCertificateController'
import IndexCertificateParams from '@/features/setting/Certificate/Core/params/indexCertificateParams'
import type CertificateModel from '@/features/setting/Certificate/Data/models/CertificateModel'
import HierarchyCertyificateController from '../controllers/HierarchyCertificateController'
import FetchHierarchyCertificatesParams from '../../Core/params/FetchHierarchyCertificatesParams'
import type HierarchyCertificateModel from '../../Data/models/HeirarchyCertificateModel'
import AddCErtificateToHierarachyController from '../controllers/addCertificateToHieararchyController'
import AddCertificateToHierarchyParams from '../../Core/params/addCertificateToHierarchyParams'
import DeleteCErtificateToHierarachyController from '../controllers/deleteCertificateToHieararchyController'
import DeleteCertificateToHierarchyParams from '../../Core/params/deleteCertificateToHierarchyParams'

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
  perPage: number = 10,
) => {
  const params = new IndexCertificateParams(query, pageNumber, perPage, 0)
  await indexCertificateController.getData(params)
}

const router = useRouter()
const fetchHierarchyCertificate = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  const params = new FetchHierarchyCertificatesParams(query, pageNumber, perPage, withPage)
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

// const getCertificateStatus = (
//   employee: OrganizatoinEmployeeModel,
//   certificateId: number
// ) => {
//   const cert = employee.certificates?.find((c: any) => c.id === certificateId)
//   return cert?.status
// }

const getEmployeeCertificationStatus = (
  Hierarchy: HierarchyCertificateModel,
  certificate: CertificateModel,
) => {
  if (Hierarchy.certificates.find((c: CertificateModel) => c.id === certificate.id)) {
    return 'Required'
  } else {
    return 'Not Required'
  }
}
const getEmployeeCertificationclass = (
  Hierarchy: HierarchyCertificateModel,
  certificate: CertificateModel,
) => {
  if (Hierarchy.certificates.find((c: CertificateModel) => c.id === certificate.id)) {
    return 'cert_required'
  } else {
    return 'cert_not_required'
  }
}

const AllCertificates = computed(() => {
  if (route.params.id && state.value?.data?.length) {
    return state.value.data[0].certificates || []
  }

  return Certificatestate.value?.data || []
})

const hierarchyCount = computed(() => state.value?.data?.length || 0)
const certificateCount = computed(() => AllCertificates.value?.length || 0)

// DeleteCErtificateToHierarachyController
const ChangeCertificatioRequired = async (
  event: Event,
  CertificateId: number,
  HieararchyId: number,
) => {
  const isChecked = (event.target as HTMLInputElement).checked

  if (isChecked) {
    const addCErtificateToHierarachyController = AddCErtificateToHierarachyController.getInstance()
    const addCertificateToHierarchyParams = new AddCertificateToHierarchyParams({
      certificateId: CertificateId,
      hieararchyId: HieararchyId,
    })
    await addCErtificateToHierarachyController.addCertificateToHieararchy(
      addCertificateToHierarchyParams,
      router,
    )
  } else {
    const deleteCErtificateToHierarachyController =
      DeleteCErtificateToHierarachyController.getInstance()
    const deleteCertificateToHierarchyParams = new DeleteCertificateToHierarchyParams({
      certificateId: CertificateId,
      hieararchyId: HieararchyId,
    })
    await deleteCErtificateToHierarachyController.deleteCertificateToHieararchy(
      deleteCertificateToHierarchyParams,
      router,
    )
  }
  fetchHierarchyCertificate()

  if (!route.params.id) {
    fetchCertificates()
  }
}
</script>

<template>
  <section class="hierarchy-matrix-page">
    <div class="hierarchy-matrix-toolbar">
      <div>
        <span class="matrix-kicker">Requirement matrix</span>
        <h1>Hierarchy certification board</h1>
        <p>Choose which certificates are required for every organization position.</p>
      </div>

      <div class="matrix-stats">
        <span>{{ hierarchyCount }} positions</span>
        <span>{{ certificateCount }} certificates</span>
      </div>
    </div>

    <div class="matrix-search-row">
      <div class="input-search matrix-search">
        <span class="icon-remove" @click="((word = ''), searchHierarchyCertificate())">
          <Search />
        </span>

        <input
          v-model="word"
          placeholder="Search position"
          class="input"
          type="text"
          @input="searchHierarchyCertificate"
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
          <!-- {{ state.data }} -->

          <div class="table-responsive employee-certificates-matrix">
            <table class="main-table">
              <thead>
                <tr>
                  <th class="w-fit">{{ $t('positions') }}</th>
                  <th v-for="cert in AllCertificates" :key="cert.id">
                    <router-link
                      :to="`/organization/organization-employee?type=3&certificate_id=${cert.id}`"
                    >
                      {{ cert.title }}
                    </router-link>
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="hierarchy in state.data" :key="hierarchy.id">
                  <td class="employee-info-container">
                    <router-link
                      :to="`/organization/employee-certificate/${hierarchy.id}`"
                      class="employee-info"
                    >
                      <!-- <span class="position-avatar">{{ hierarchy.title?.charAt(0) || '?' }}</span> -->
                      <span class="name"> {{ hierarchy.title }} </span>
                    </router-link>
                  </td>

                  <td
                    v-for="cert in AllCertificates"
                    :key="cert.id"
                    :class="getEmployeeCertificationclass(hierarchy, cert)"
                  >
                    <p class="cert-status">
                      <label :for="`cert-${cert.id}-hierarchy-${hierarchy.id}`">
                        {{ getEmployeeCertificationStatus(hierarchy, cert) }}</label
                      >
                      <span class="matrix-switch">
                        <input
                          :id="`cert-${cert.id}-hierarchy-${hierarchy.id}`"
                          type="checkbox"
                          :checked="Boolean(hierarchy.certificates.find((el) => el.id == cert.id))"
                          @change="ChangeCertificatioRequired($event, cert.id, hierarchy.id)"
                        />
                        <span class="matrix-switch-track"></span>
                      </span>
                    </p>
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
          <DataEmpty
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
.hierarchy-matrix-page {
  min-width: 0;
}

.hierarchy-matrix-toolbar {
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

.hierarchy-matrix-toolbar h1 {
  margin: 8px 0 4px;
  color: var(--brand-primary-800);
  font-size: clamp(24px, 3vw, 34px);
  font-weight: 900;
  letter-spacing: 0;
  line-height: 1.12;
}

.hierarchy-matrix-toolbar p {
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

.employee-certificates-matrix .main-table th {
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

.employee-certificates-matrix .main-table th:first-child {
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

.employee-certificates-matrix .main-table th:last-child,
.employee-certificates-matrix .main-table td:last-child {
  position: static !important;
  inset-inline-end: auto !important;
}

.employee-certificates-matrix .main-table th a {
  color: inherit;
  font-weight: 900;
  text-decoration: none;
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

.employee-info {
  display: flex !important;
  width: 100% !important;
  min-width: 0;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 10px;
  padding: 0 !important;
  text-align: start;
  text-decoration: none;
  background: transparent !important;
}

.position-avatar {
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

.employee-info .name {
  min-width: 0;
  overflow: hidden;
  color: var(--brand-primary-900);
  font-size: 13px;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cert-status {
  display: flex;
  min-width: 130px;
  min-height: 68px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0;
  padding: 10px;
  border-radius: 15px;
}

.cert-status label {
  color: var(--brand-primary-900);
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;
}

.cert_required .cert-status {
  border: 1px solid color-mix(in srgb, var(--status-success) 20%, transparent);
  background: color-mix(in srgb, var(--status-success) 10%, transparent);
}

.cert_required .cert-status label {
  color: var(--status-success);
}

.cert_not_required .cert-status {
  border: 1px solid color-mix(in srgb, var(--brand-primary-400) 22%, transparent);
  background: var(--brand-primary-50);
}

.cert_not_required .cert-status label {
  color: var(--brand-primary-500);
}

.matrix-switch {
  position: relative;
  display: inline-flex;
  width: 46px;
  height: 26px;
  cursor: pointer;
}

.matrix-switch input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.matrix-switch-track {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: var(--brand-primary-100);
  pointer-events: none;
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.matrix-switch input {
  z-index: 2;
}

.matrix-switch-track::before {
  position: absolute;
  top: 4px;
  inset-inline-start: 4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  content: '';
  background: var(--surface-1);
  box-shadow: 0 3px 8px color-mix(in srgb, var(--brand-primary-900) 18%, transparent);
  transition: transform 0.2s ease;
}

.matrix-switch input:checked + .matrix-switch-track {
  background: linear-gradient(135deg, var(--brand-primary-500), var(--status-success));
  box-shadow: 0 8px 14px color-mix(in srgb, var(--brand-primary-500) 18%, transparent);
}

.matrix-switch input:checked + .matrix-switch-track::before {
  transform: translateX(20px);
}

@media (max-width: 700px) {
  .hierarchy-matrix-toolbar {
    flex-direction: column;
  }

  .matrix-stats {
    justify-content: flex-start;
  }

  .matrix-search-row {
    grid-template-columns: 1fr;
  }

  .w-fit,
  .employee-certificates-matrix .main-table th:first-child,
  .employee-certificates-matrix .main-table td:first-child {
    min-width: 190px;
  }
}
</style>
