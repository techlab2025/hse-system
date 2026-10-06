<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import TitleInterface from '@/base/Data/Models/title_interface'
import { debounce } from '@/base/Presentation/utils/debouced'
import IndexMyInternalAuditController from '../../controllers/my/indexMyInternalAuditController'
import IndexMyInternalAuditParams from '../../../Core/params/my/indexMyInternalAuditParams'
import { InrernalAuditStatusEnum } from '../../../Core/enums/plan/PlanStatusENum'

const controller = IndexMyInternalAuditController.getInstance()
const state = computed(() => controller.state.value)
const word = ref('')
const page = ref(1)
const perPage = ref(10)
const statusFilter = ref<TitleInterface | null>(null)
const statusOptions = [
  new TitleInterface({ id: InrernalAuditStatusEnum.draft, title: 'draft' }),
  new TitleInterface({ id: InrernalAuditStatusEnum.planned, title: 'planned' }),
  new TitleInterface({ id: InrernalAuditStatusEnum.reported, title: 'reported' }),
]
const filteredAudits = computed(() => {
  const audits = state.value.data ?? []
  return statusFilter.value
    ? audits.filter(
        (audit) =>
          audit.status.toLowerCase() === String(statusFilter.value?.title ?? '').toLowerCase(),
      )
    : audits
})
function normalizeStatus(value: TitleInterface | TitleInterface[] | null) {
  statusFilter.value = Array.isArray(value) ? (value[0] ?? null) : value
}
function leadName(auditTeam: unknown[]): string {
  const member = auditTeam.find((entry) => {
    const item = (entry ?? {}) as Record<string, unknown>
    return Boolean(item.is_leader ?? item.is_lead_auditor)
  }) as Record<string, unknown> | undefined
  const employee = (member?.employee ?? member?.organization_employee ?? {}) as Record<
    string,
    unknown
  >
  return String(employee.name ?? employee.title ?? '—')
}
async function fetchAudits() {
  await controller.getData(new IndexMyInternalAuditParams(word.value, page.value, perPage.value, 1))
}
const searchAudits = debounce(() => {
  page.value = 1
  void fetchAudits()
})
function changePage(value: number) {
  page.value = value
  void fetchAudits()
}
function changePerPage(value: number) {
  perPage.value = value
  changePage(1)
}
onMounted(fetchAudits)
</script>

<template>
  <main class="register-page">
    <!-- <h1>{{ $t('My Internal Audit') }}</h1> -->
    <div class="toolbar">
      <div class="input-wrapper">
        <label for="my-audit-search">{{ $t('search') }}</label>
        <input
          id="my-audit-search"
          v-model="word"
          class="input"
          type="search"
          :placeholder="$t('search_audit_number')"
          @input="searchAudits"
        />
      </div>
      <UpdatedCustomInputSelect
        :model-value="statusFilter"
        :static-options="statusOptions"
        :auto-fill="false"
        label="status"
        :placeholder="$t('select_audit_status')"
        @update:model-value="normalizeStatus"
      />
    </div>
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive">
          <table class="main-table">
            <thead>
              <tr>
                <th>{{ $t('audit_number') }}</th>
                <th>{{ $t('audit_period') }}</th>
                <th>{{ $t('scope') }}</th>
                <th>{{ $t('lead_auditor') }}</th>
                <th>{{ $t('status') }}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="audit in filteredAudits" :key="audit.id">
                <td>
                  <strong>{{ audit.title }}</strong>
                </td>
                <td>{{ audit.auditStartDate }}<br />{{ audit.auditEndDate }}</td>
                <td>{{ audit.fullCompany ? $t('full_company') : audit.project?.title || '—' }}</td>
                <td>{{ leadName(audit.auditTeam) }}</td>
                <td>
                  <span class="status">{{ audit.status }}</span>
                </td>
                <td>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.ADMIN,
                      PermissionsEnum.MY_INTERNAL_AUDIT_ALL,
                      PermissionsEnum.MY_INTERNAL_AUDIT_DETAILS,
                    ]"
                  >
                    <router-link
                      class="btn btn-secondary"
                      :to="`/organization/my-internal-audit/${audit.id}`"
                      >{{ $t('open') }}</router-link
                    >
                  </PermissionBuilder>
                </td>
              </tr>
              <tr v-if="!filteredAudits.length">
                <td colspan="6" class="empty-row">{{ $t('no_matching_audits') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination
          :pagination="state.pagination"
          @change-page="changePage"
          @count-per-page="changePerPage"
        />
      </template>
      <template #loader><TableLoader :cols="6" :rows="8" /></template>
      <template #initial><TableLoader :cols="6" :rows="8" /></template>
      <template #empty
        ><p class="empty-row">{{ $t('no_my_internal_audits') }}</p></template
      >
      <template #failed
        ><div class="empty-row">
          <p>{{ $t('my_internal_audits_load_failed') }}</p>
          <!-- <button type="button" class="btn btn-secondary" @click="fetchAudits">
            {{ $t('retry') }}
          </button> -->
        </div></template
      >
    </DataStatus>
  </main>
</template>
<style scoped>
.register-page {
  display: grid;
  gap: 18px;
}
.toolbar {
  display: flex;
  align-items: end;
  gap: 12px;
}
.toolbar > * {
  flex: 1;
}
.status {
  border-radius: 5px;
  background: color-mix(in srgb, var(--PrimaryColor, #087d80) 12%, transparent);
  padding: 5px 10px;
  text-transform: capitalize;
}
.empty-row {
  padding: 24px;
  text-align: center;
  color: var(--text-soft);
}
@media (max-width: 700px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
