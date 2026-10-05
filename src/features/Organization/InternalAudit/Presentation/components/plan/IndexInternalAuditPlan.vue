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

const controller = IndexInternalAuditPlanController.getInstance()
const state = ref(controller.state.value)
const word = ref('')
const page = ref(1)
const statusFilter = ref<TitleInterface | null>(null)

const filteredAudits = computed(() => {
  const audits = state.value.data ?? []
  if (!statusFilter.value) return audits
  return audits.filter(
    (audit) => audit.status.toLowerCase() === String(statusFilter.value?.title ?? '').toLowerCase(),
  )
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

async function fetchInternalAuditPlans() { await controller.getData(new IndexInternalAuditPlanParams(word.value, page.value, 10, 1)) }
watch(() => controller.state.value, (value) => { state.value = value }, { deep: true })
onMounted(fetchInternalAuditPlans)

const statusOptions = ref<TitleInterface[]>([
  new TitleInterface({ id: InrernalAuditStatusEnum.draft, title: 'draft' }),
  new TitleInterface({ id: InrernalAuditStatusEnum.planned, title: 'planned' }),
  new TitleInterface({ id: InrernalAuditStatusEnum.reported, title: 'reported' }),
])
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
        <input v-model="word" class="input" type="search" placeholder="Search audit number"
          @input="fetchInternalAuditPlans" />
        </div>

        <div class="input-wrapper">
          <UpdatedCustomInputSelect
            :model-value="statusFilter"
            :static-options="statusOptions"
            label="Status"
            placeholder="Sekect statuses"
            class="input"
            @update:model-value="normalizeStatus"
          />
        </div>
</div>

         <router-link class="btn btn-primary"
          to="/organization/internal-audit">New Audit Plan</router-link>
    </div>

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
                <th><span class="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="audit in filteredAudits" :key="audit.id">
                <td><strong>{{ audit.title }}</strong></td>
                <td>{{ audit.auditStartDate }}<br />{{ audit.auditEndDate }}</td>
                <td>{{ audit.fullCompany ? 'Full Company' : audit.project?.title || '—' }}</td>
                <td>{{ leadName(audit.auditTeam) }}</td>
                <td><span class="status">{{ audit.status }}</span></td>
                <td><router-link class="btn btn-secondary"
                    :to="{ path: '/organization/internal-audit', query: { internal_audit_plan_id: audit.id, tab: 'plan' } }">Open</router-link>
                </td>
              </tr>
              <tr v-if="!filteredAudits.length">
                <td colspan="6" class="empty-row">No matching audits</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination :pagination="state.pagination" @change-page="page = $event; fetchInternalAuditPlans()" />
      </template>
      <template #loader>
        <TableLoader :cols="5" :rows="8" />
      </template><template #initial>
        <TableLoader :cols="5" :rows="8" />
      </template>
      <template #empty>
        <DataEmpty link="/organization/internal-audit" add-text="Create audit" title="No internal audits"
          description="Your internal audit plans will appear here." />
      </template>
      <template #failed>
        <DataEmpty link="/organization/internal-audit" add-text="Create audit" title="Could not load audits"
          description="Try again or create a new audit plan." />
      </template>
    </DataStatus>
  </main>
</template>
<style
  scoped>
  .filters{
    display: flex;
gap:12px;
align-items: center,
;
  }
  .register-page {
    display: grid;
    gap: 18px
  }

  .register-page header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px
  }

  .register-page header span {
    color: var(--PrimaryColor, #087d80);
    font-size: .75rem;
    font-weight: 700;
    text-transform: uppercase
  }

  .register-page h1 {
    margin: 4px 0
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
    width:100%;
  }

  .toolbar input {
    flex: 1
  }

  .toolbar select {
    max-width: 190px
  }

  .status {
    border-radius: 999px;
    background: color-mix(in srgb, var(--PrimaryColor, #087d80) 12%, transparent);
    padding: 5px 10px;
    color: var(--PrimaryColor, #087d80);
    font-size: .78rem;
    font-weight: 700;
    text-transform: capitalize
  }

  .empty-row {
    text-align: center;
    color: var(--text-soft, #687777)
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0)
  }

  @media(max-width:700px) {

    .register-page header,
    .toolbar {
      align-items: stretch;
      flex-direction: column
    }

    .register-actions {
      width: 100%
    }

    .register-actions>* {
      flex: 1
    }

    .toolbar select {
      max-width: none
    }
  }
</style>
