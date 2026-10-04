<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import InternalAuditPlanTab from './plan/InternalAuditPlanTab.vue'
import InternalAuditAttendanceTab from './attendance/InternalAuditAttendanceTab.vue'
import InternalAuditNcrsTab from './ncrs/InternalAuditNcrsTab.vue'
import InternalAuditReportTab from './reports/InternalAuditReportTab.vue'
import ShowInternalAuditPlanParams from '../../Core/params/plan/showInternalAuditPlanParams'
import ShowInternalAuditPlanController from '../controllers/plan/showInternalAuditPlanController'

const tabs = [
  { key: 'plan', label: 'Plan', component: InternalAuditPlanTab },
  { key: 'attendance', label: 'Attendance', component: InternalAuditAttendanceTab },
  { key: 'ncrs', label: 'NCRs', component: InternalAuditNcrsTab },
  { key: 'report', label: 'Report', component: InternalAuditReportTab },
]
const route = useRoute()
const router = useRouter()
const showController = ShowInternalAuditPlanController.getInstance()
const requestedTab = computed(() => String(route.query.tab ?? 'plan'))
const initialAuditId = Number(
  route.query.internal_audit_plan_id ?? route.query.internal_audit_id ?? route.query.id,
)
const activeTab = ref(
  tabs.some((tab) => tab.key === requestedTab.value) &&
    // (requestedTab.value === 'plan' || (Number.isFinite(initialAuditId) && initialAuditId > 0))
    // ?
    requestedTab.value
    // : 'plan',
)
const activeComponent = computed(() => tabs.find((tab) => tab.key === activeTab.value)?.component)
const selectedAudit = ref(showController.state.value.data ?? null)
const internalAuditPlanId = computed(() => {
  const value = Number(route.query.internal_audit_plan_id ?? route.query.internal_audit_id ?? route.query.id)
  return Number.isFinite(value) && value > 0 ? value : 0
})

async function loadSelectedAudit() {
  selectedAudit.value = null
  if (!internalAuditPlanId.value) return
  await showController.getData(new ShowInternalAuditPlanParams(internalAuditPlanId.value))
  if (showController.isDataSuccess()) selectedAudit.value = showController.state.value.data ?? null
}

function selectTab(key: string) {
  if (key !== 'plan' && !internalAuditPlanId.value) return
  activeTab.value = key
  void router.replace({ query: { ...route.query, tab: key } })
}

watch(requestedTab, (tab) => {
  if (tabs.some((item) => item.key === tab) && (tab === 'plan' || internalAuditPlanId.value)) {
    activeTab.value = tab
  }
})
watch(internalAuditPlanId, loadSelectedAudit)
onMounted(loadSelectedAudit)
</script>

<template>
  <main class="internal-audit-page">
    <header class="page-header">
      <div>
        <!-- <span class="eyebrow">Assurance & compliance</span> -->
        <h1>Internal Audit</h1>
        <!-- <p>Create and manage a complete organization audit lifecycle.</p> -->
        <div v-if="selectedAudit" class="audit-identity"><strong>{{ selectedAudit.title }}</strong><span>{{
          selectedAudit.status }}</span></div>
      </div>
      <router-link class="btn btn-secondary" to="/organization/internal-audit/register">Audit Register</router-link>
    </header>
    <nav class="audit-tabs" aria-label="Internal audit sections">
      <button v-for="tab in tabs" :key="tab.key" type="button" :disabled="tab.key !== 'plan' && !internalAuditPlanId"
        :class="{ active: activeTab === tab.key }" @click="selectTab(tab.key)">{{ tab.label }}</button>
    </nav>
    <p v-if="!internalAuditPlanId && activeTab === 'plan'" class="stage-note">Save the audit plan before continuing to
      Attendance, NCRs, and Report.</p>
    <KeepAlive>
      <component :is="activeComponent" :internal-audit-plan-id="internalAuditPlanId"
        :audit-status="selectedAudit?.status ?? ''" :audit-start-date="selectedAudit?.auditStartDate ?? ''"
        @saved="loadSelectedAudit" />
    </KeepAlive>
  </main>
</template>

<style scoped>
.internal-audit-page {
  display: grid;
  gap: 20px;
  color: var(--text-primary, #172334)
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px
}

.eyebrow {
  color: var(--PrimaryColor, #087d80);
  font-size: .75rem;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase
}

.page-header h1 {
  margin: 4px 0;
  font-size: 1.65rem
}

.page-header p {
  margin: 0;
  color: var(--text-soft, #687777)
}

.audit-identity {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px
}

.audit-identity span {
  border-radius: 5px;
  background: color-mix(in srgb, var(--PrimaryColor, #087d80) 10%, transparent);
  padding: 5px 8px;
  color: var(--PrimaryColor, #087d80);
  font-size: .75rem;
  font-weight: 700;
  text-transform: capitalize
}

.audit-tabs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 6px;
  border: 1px solid var(--main-border, #d9e1df);
  border-radius: 14px;
  background: var(--card-bg, #fff)
}

.audit-tabs button {
  border: 0;
  border-radius: 10px;
  background: transparent;
  padding: 13px;
  color: var(--text-primary, #172334);
  font-weight: 600;
  transition: .2s
}

.audit-tabs button:disabled {
  cursor: not-allowed;
  opacity: .45
}

.audit-tabs button.active {
  background: var(--PrimaryColor, #087d80);
  color: #fff;
  box-shadow: 0 5px 14px color-mix(in srgb, var(--PrimaryColor, #087d80) 22%, transparent)
}

.stage-note {
  margin: 0;
  border-inline-start: 4px solid #c6841b;
  background: #fff6e5;
  padding: 12px 16px;
  color: #76501b
}

@media(max-width:600px) {
  .page-header {
    align-items: flex-start;
    flex-direction: column
  }

  .audit-tabs {
    grid-template-columns: 1fr 1fr
  }
}
</style>
