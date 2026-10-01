<script setup lang="ts">
import { computed, ref } from 'vue'
import InternalAuditPlanTab from './tabs/InternalAuditPlanTab.vue'
import InternalAuditAttendanceTab from './tabs/InternalAuditAttendanceTab.vue'
import InternalAuditNcrsTab from './tabs/InternalAuditNcrsTab.vue'
import InternalAuditReportTab from './tabs/InternalAuditReportTab.vue'

const tabs = [
  { key: 'plan', label: 'Plan', component: InternalAuditPlanTab },
  { key: 'attendance', label: 'Attendance', component: InternalAuditAttendanceTab },
  { key: 'ncrs', label: 'NCRs', component: InternalAuditNcrsTab },
  { key: 'report', label: 'Report', component: InternalAuditReportTab },
]
const activeTab = ref('plan')
const activeComponent = computed(() => tabs.find((tab) => tab.key === activeTab.value)?.component)
</script>

<template>
  <main class="internal-audit-page">
    <header class="page-header">
      <div><span class="eyebrow">Assurance & compliance</span><h1>Internal Audit</h1><p>Create and manage a complete organization audit lifecycle.</p></div>
      <router-link class="btn btn-secondary" to="/organization/internal-audit/register">Audit Register</router-link>
    </header>
    <nav class="audit-tabs" aria-label="Internal audit sections">
      <button v-for="tab in tabs" :key="tab.key" type="button" :class="{ active: activeTab === tab.key }" @click="activeTab = tab.key">{{ tab.label }}</button>
    </nav>
    <KeepAlive><component :is="activeComponent" /></KeepAlive>
  </main>
</template>

<style scoped>
.internal-audit-page{display:grid;gap:20px;color:var(--text-primary,#172334)}.page-header{display:flex;align-items:center;justify-content:space-between;gap:20px}.eyebrow{color:var(--PrimaryColor,#087d80);font-size:.75rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.page-header h1{margin:4px 0;font-size:1.65rem}.page-header p{margin:0;color:var(--text-soft,#687777)}.audit-tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:6px;border:1px solid var(--main-border,#d9e1df);border-radius:14px;background:var(--card-bg,#fff)}.audit-tabs button{border:0;border-radius:10px;background:transparent;padding:13px;color:var(--text-primary,#172334);font-weight:600;transition:.2s}.audit-tabs button.active{background:var(--PrimaryColor,#087d80);color:#fff;box-shadow:0 5px 14px color-mix(in srgb,var(--PrimaryColor,#087d80) 22%,transparent)}@media(max-width:600px){.page-header{align-items:flex-start;flex-direction:column}.audit-tabs{grid-template-columns:1fr 1fr}}
</style>
