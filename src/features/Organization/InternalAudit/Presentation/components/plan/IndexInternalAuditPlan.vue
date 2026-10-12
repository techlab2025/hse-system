<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import IndexInternalAuditPlanController from '../../controllers/plan/indexInternalAuditPlanController'
import IndexInternalAuditPlanParams from '../../../Core/params/plan/indexInternalAuditPlanParams'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import { InrernalAuditStatusEnum } from '../../../Core/enums/plan/PlanStatusENum'
import DatePicker from 'primevue/datepicker'
import IndexHerikalyController from '@/features/Organization/Herikaly/Presentation/controllers/indexHerikalyController'
import IndexHerikalyParams from '@/features/Organization/Herikaly/Core/params/indexHerikalyParams'

const controller = IndexInternalAuditPlanController.getInstance()
const state = ref(controller.state.value)
const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const statusFilter = ref<TitleInterface | null>(null)

const fromDate = ref<Date | null>(null)
const toDate = ref<Date | null>(null)
const focusArea = ref<TitleInterface | null>(null)
const hierarchyController = IndexHerikalyController.getInstance()
const hierarchyParams = new IndexHerikalyParams('', 1, 1000, 0, true)
const filteredAudits = computed(() => state.value.data ?? [])

function normalizeStatus(value: TitleInterface | TitleInterface[] | null) {
  statusFilter.value = Array.isArray(value) ? (value[0] ?? null) : value
}

function normalizeFocusArea(value: TitleInterface | TitleInterface[] | null) {
  focusArea.value = Array.isArray(value) ? (value[0] ?? null) : value
}

function formatFilterDate(value: Date | null) {
  if (!value) return ''
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`
}

function applyFilters() {
  currentPage.value = 1
  return fetchInternalAuditPlans()
}

watch([fromDate, toDate, statusFilter, focusArea], applyFilters)

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

async function fetchInternalAuditPlans() {
  await controller.getData(
    new IndexInternalAuditPlanParams(
      word.value,
      currentPage.value,
      countPerPage.value,
      1,
      formatFilterDate(fromDate.value),
      formatFilterDate(toDate.value),
      statusFilter.value?.id ?? null,
      focusArea.value?.id ?? null,
    ),
  )
}
watch(
  () => controller.state.value,
  (value) => {
    state.value = value
  },
  { deep: true },
)
onMounted(fetchInternalAuditPlans)

const statusOptions = ref<TitleInterface[]>([
  new TitleInterface({ id: InrernalAuditStatusEnum.draft, title: 'draft' }),
  new TitleInterface({ id: InrernalAuditStatusEnum.planned, title: 'planned' }),
  new TitleInterface({ id: InrernalAuditStatusEnum.reported, title: 'reported' }),
])

const handleChangePage = (page: number) => {
  currentPage.value = page
  return fetchInternalAuditPlans()
}

const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  return applyFilters()
}
</script>

<template>
  <main class="register-page">
    <header>
      <!-- <div><span>Assurance & compliance</span>
        <h1>Internal Audit Register</h1>
      </div> -->
      <div class="register-actions">
        <!-- <button class="btn btn-secondary" type="button"
          @click="exportRegister">Export</button> -->
        <!-- <router-link class="btn btn-primary"
          to="/organization/internal-audit">New Audit Plan</router-link> -->
      </div>
    </header>
    <div class="toolbar">
      <div class="flex filters">
        <div class="input-wrapper">
          <label for="search">Search</label>
          <input
            id="search"
            v-model="word"
            class="input"
            type="search"
            placeholder="Search audit number"
            @input="applyFilters"
          />
        </div>

        <div class="input-wrapper">
          <UpdatedCustomInputSelect
            :model-value="statusFilter"
            :static-options="statusOptions"
            label="Status"
            placeholder="select statuses"
            class="input"
            @update:model-value="normalizeStatus"
          />
        </div>

        <div class="input-wrapper">
          <label for="audit-from-date">From Date</label>
          <DatePicker
            v-model="fromDate"
            input-id="audit-from-date"
            date-format="yy-mm-dd"
            placeholder="Select from date"
            :max-date="toDate ?? undefined"
            :manual-input="false"
            show-icon
            show-button-bar
            class="input"
          />
        </div>
        <div class="input-wrapper">
          <label for="audit-to-date">To Date</label>
          <DatePicker
            v-model="toDate"
            input-id="audit-to-date"
            date-format="yy-mm-dd"
            placeholder="Select to date"
            :min-date="fromDate ?? undefined"
            :manual-input="false"
            show-icon
            show-button-bar
            class="input"
          />
        </div>
        <div class="input-wrapper">
          <UpdatedCustomInputSelect
            :model-value="focusArea"
            :controller="hierarchyController"
            :params="hierarchyParams"
            label="Focus Area"
            placeholder="Select department"
            class="input"
            @update:model-value="normalizeFocusArea"
          />
        </div>
      </div>
    </div>
    <router-link class="btn btn-primary" to="/organization/internal-audit"
      >New Audit Plan</router-link
    >

    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive">
          <table class="main-table">
            <thead>
              <tr>
                <th>Audit No.</th>
                <th>Period</th>
                <th>Scope</th>
                <th>Lead</th>
                <th>Status</th>
                <th>NCRs count</th>
                <!-- <th>ncr count</th> -->
                <th><span class="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="audit in filteredAudits" :key="audit.id">
                <td>
                  <strong>{{ audit.title }}</strong>
                </td>
                <td>{{ audit.auditStartDate }}<br />{{ audit.auditEndDate }}</td>
                <td>{{ audit.fullCompany ? 'Full Company' : audit.project?.title || '—' }}</td>
                <td>{{ leadName(audit.auditTeam) }}</td>
                <td>
                  <span class="status">{{ audit.status }}</span>
                </td>
                <td>{{ audit.OpenncrsCount }} open / {{ audit.ClosedncrsCount }} closed</td>
                <!-- <td>{{ audit.ClosedncrsCount }}</td> -->
                <!-- <td>{{ audit.OpenncrsCount }}</td> -->
                <td>
                  <router-link
                    class="btn btn-secondary"
                    :to="{
                      path: '/organization/internal-audit',
                      query: { internal_audit_plan_id: audit.id, tab: 'plan' },
                    }"
                    >Open</router-link
                  >
                </td>
              </tr>
              <tr v-if="!filteredAudits.length">
                <td colspan="7" class="empty-row">No matching audits</td>
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
      <template #loader> <TableLoader :cols="5" :rows="8" /> </template
      ><template #initial>
        <TableLoader :cols="5" :rows="8" />
      </template>
      <template #empty>
        <DataEmpty
          link="/organization/internal-audit"
          add-text="Create audit"
          title="No internal audits"
          description="Your internal audit plans will appear here."
        />
      </template>
      <template #failed>
        <DataEmpty
          link="/organization/internal-audit"
          add-text="Create audit"
          title="Could not load audits"
          description="Try again or create a new audit plan."
        />
      </template>
    </DataStatus>
  </main>
</template>
<style scoped>
.filters {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  flex-wrap: wrap;
  flex: 1;
  min-width: 0;
}
.filters > .input-wrapper {
  flex: 1 1 180px;
  min-width: 0;
}
.register-page {
  display: grid;
  gap: 18px;
}

.register-page header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.register-page header span {
  color: var(--PrimaryColor, #087d80);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.register-page h1 {
  margin: 4px 0;
}

.register-actions,
.toolbar {
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
  gap: 10px;
  /* width:100%; */
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
}

.toolbar input {
  flex: 1;
}

.toolbar select {
  max-width: 190px;
}

.status {
  border-radius: 999px;
  background: color-mix(in srgb, var(--PrimaryColor, #087d80) 12%, transparent);
  padding: 5px 10px;
  color: var(--PrimaryColor, #087d80);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: capitalize;
}

.empty-row {
  text-align: center;
  color: var(--text-soft, #687777);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}

@media (max-width: 700px) {
  .register-page header,
  .toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .register-actions {
    width: 100%;
  }

  .register-actions > * {
    flex: 1;
  }

  .toolbar select {
    max-width: none;
  }
}
</style>
