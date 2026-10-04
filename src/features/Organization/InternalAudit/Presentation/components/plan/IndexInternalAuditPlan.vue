<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import IndexInternalAuditPlanController from '../../controllers/plan/indexInternalAuditPlanController'
import IndexInternalAuditPlanParams from '../../../Core/params/plan/indexInternalAuditPlanParams'

const controller = IndexInternalAuditPlanController.getInstance()
const state = ref(controller.state.value)
const word = ref('')
const page = ref(1)

async function fetchInternalAuditPlans() { await controller.getData(new IndexInternalAuditPlanParams(word.value, page.value, 10, 1)) }
watch(() => controller.state.value, (value) => { state.value = value }, { deep: true })
onMounted(fetchInternalAuditPlans)
</script>

<template>
  <main class="register-page">
    <header><div><span>Assurance & compliance</span><h1>Internal Audit Register</h1></div><router-link class="btn btn-primary" to="/organization/internal-audit">New Audit Plan</router-link></header>
    <div class="toolbar"><input v-model="word" class="input" type="search" placeholder="Search audits" @input="fetchInternalAuditPlans" /></div>
    <DataStatus :controller="state">
      <template #success><div class="table-responsive"><table class="main-table"><thead><tr><th>Audit No.</th><th>Scope</th><th>Start Date</th><th>End Date</th><th>Status</th></tr></thead><tbody><tr v-for="audit in state.data" :key="audit.id"><td><router-link :to="{ path: '/organization/internal-audit', query: { internal_audit_plan_id: audit.id, tab: 'report' } }">{{ audit.title }}</router-link></td><td>{{ audit.fullCompany ? 'Full Company' : audit.project?.title || '—' }}</td><td>{{ audit.auditStartDate }}</td><td>{{ audit.auditEndDate }}</td><td><span class="status">{{ audit.status }}</span></td></tr></tbody></table></div><Pagination :pagination="state.pagination" @change-page="page = $event; fetchInternalAuditPlans()" /></template>
      <template #loader><TableLoader :cols="5" :rows="8" /></template><template #initial><TableLoader :cols="5" :rows="8" /></template>
      <template #empty><DataEmpty link="/organization/internal-audit" add-text="Create audit" title="No internal audits" description="Your internal audit plans will appear here." /></template>
      <template #failed><DataEmpty link="/organization/internal-audit" add-text="Create audit" title="Could not load audits" description="Try again or create a new audit plan." /></template>
    </DataStatus>
  </main>
</template>
<style scoped>.register-page{display:grid;gap:18px}.register-page header{display:flex;align-items:center;justify-content:space-between}.register-page header span{color:var(--PrimaryColor,#087d80);font-size:.75rem;font-weight:700;text-transform:uppercase}.register-page h1{margin:4px 0}.toolbar{max-width:420px}.status{border-radius:999px;background:color-mix(in srgb,var(--PrimaryColor,#087d80) 12%,transparent);padding:5px 10px;color:var(--PrimaryColor,#087d80);font-size:.78rem;font-weight:700;text-transform:capitalize}</style>
