<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import ShowOrganizatoinEmployeeParams from '../../Core/params/showOrganizatoinEmployeeParams'
import ShowOrganizatoinEmployeeController from '../controllers/showOrganizatoinEmployeeController'
import CertificateComp from '../supcomponents/showOrgEmployee/CertificateComp.vue'
import EmployeeProfileBox from '../supcomponents/showOrgEmployee/EmployeeProfileBox.vue'
import ProjectComp from '../supcomponents/showOrgEmployee/ProjectComp.vue'
import { useRoute } from 'vue-router'
import type OrganizatoinEmployeeDetailsModel from '../../Data/models/OrganizatoinEmployeeDetailsModel'
import Employeetasks from '../supcomponents/showOrgEmployee/Employeetasks.vue'
import Emptask from '@/shared/icons/emptask.vue'
const route = useRoute()
const empDetastate = ref<OrganizatoinEmployeeDetailsModel>()
const ShowEmployeeDetails = async () => {
  const showOrganizatoinEmployeeController = ShowOrganizatoinEmployeeController.getInstance()
  const showOrganizatoinEmployeeParams = new ShowOrganizatoinEmployeeParams(route.params.id, true)
  const state = await showOrganizatoinEmployeeController.showOrganizatoinEmployee(
    showOrganizatoinEmployeeParams,
  )
  if (state.value.data) {
    empDetastate.value = state.value.data
  }
}
onMounted(() => {
  ShowEmployeeDetails()
})
const isShowAllTasks = ref(false)
const viewAllTasks = () => {
  isShowAllTasks.value = true
}
const viewLessTasks = () => {
  isShowAllTasks.value = false
}
const printPage = () => {
  window.print()
}
const tasks = computed(() => empDetastate.value?.tasks ?? [])
const visibleTasks = computed(() => (isShowAllTasks.value ? tasks.value : tasks.value.slice(0, 1)))
const hiddenTasksCount = computed(() => Math.max(tasks.value.length - 1, 0))
</script>
<template>
  <section class="employee-show-page">
    <div class="employee-page-topbar">
      <div>
        <span class="page-kicker">Employee profile</span>
        <h1> employee details</h1>
      </div>
      <!-- <button class="print-page-btn" type="button" @click="printPage">Print</button> -->
    </div>

    <div class="employee-layout">
      <main class="employee-main-panel">
        <EmployeeProfileBox :state="empDetastate" />

        <section class="tasks-panel">
          <div class="tasks-panel-header">
            <div>
              <span class="panel-kicker">Assigned work</span>
              <h2>Employee tasks</h2>
            </div>
            <span class="tasks-count">{{ tasks.length }} tasks</span>
          </div>

          <div class="tasks-empty" v-if="!tasks.length">
            No tasks assigned to this employee yet.
          </div>

          <div class="all-emp-tasks" v-for="task in visibleTasks" :key="task.id">
            <Employeetasks :tasks="task" />
          </div>

          <button
            class="view-all-tasks"
            type="button"
            @click="isShowAllTasks ? viewLessTasks() : viewAllTasks()"
            v-if="tasks.length > 1"
          >
            <span>{{
              isShowAllTasks ? 'View Less Tasks' : `View All Tasks (${hiddenTasksCount} more)`
            }}</span>
            <Emptask />
          </button>
        </section>
      </main>

      <aside class="employee-side-panel">
        <CertificateComp
          :state="empDetastate?.certificates"
          :employeeCertificates="empDetastate?.employee_certificates"
        />
        <ProjectComp :state="empDetastate?.projects" />
      </aside>
    </div>
  </section>
</template>

<style scoped>
.employee-show-page {
  position: relative;
  min-width: 0;
  padding: 4px 0 24px;
}

.employee-page-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
  padding: 18px;
  overflow: hidden;
  border: 1px solid rgba(221, 226, 237, 0.76);
  border-radius: 24px;
  background:
    radial-gradient(circle at 0 0, rgba(29, 78, 216, 0.13), transparent 30%),
    radial-gradient(circle at 100% 20%, rgba(74, 174, 58, 0.13), transparent 32%),
    linear-gradient(135deg, #ffffff, #f8fbff);
  box-shadow: 0 18px 42px rgba(15, 25, 39, 0.07);
}

.page-kicker,
.panel-kicker {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 10px;
  border: 1px solid rgba(29, 78, 216, 0.18);
  border-radius: 999px;
  color: #1d4ed8;
  font-size: 11px;
  font-weight: 900;
  background: rgba(29, 78, 216, 0.08);
}

.employee-page-topbar h1,
.tasks-panel-header h2 {
  margin: 8px 0 0;
  color: #041953;
  font-weight: 900;
  letter-spacing: 0;
  line-height: 1.12;
}

.employee-page-topbar h1 {
  font-size: clamp(24px, 3vw, 34px);
}

.print-page-btn,
.view-all-tasks {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  border: 0;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.print-page-btn {
  padding: 0 18px;
  color: #fff;
  background: linear-gradient(135deg, #1d4ed8, #041953);
  box-shadow: 0 14px 26px rgba(29, 78, 216, 0.18);
}

.employee-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
  gap: 22px;
  align-items: start;
}

.employee-main-panel,
.employee-side-panel {
  min-width: 0;
}

.employee-main-panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.employee-side-panel {
  position: sticky;
  top: 16px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.tasks-panel {
  min-width: 0;
  padding: 16px;
  border: 1px solid rgba(221, 226, 237, 0.78);
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 251, 255, 0.96));
  box-shadow: 0 18px 42px rgba(15, 25, 39, 0.06);
}

.tasks-panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.tasks-panel-header h2 {
  font-size: 22px;
}

.tasks-count {
  display: inline-flex;
  min-height: 30px;
  flex: 0 0 auto;
  align-items: center;
  padding: 0 12px;
  border-radius: 999px;
  color: #287b22;
  font-size: 12px;
  font-weight: 900;
  background: rgba(74, 174, 58, 0.1);
}

.all-emp-tasks + .all-emp-tasks {
  margin-top: 10px;
}

.tasks-empty {
  padding: 18px;
  border: 1px dashed rgba(29, 78, 216, 0.24);
  border-radius: 18px;
  color: #607086;
  font-size: 13px;
  font-weight: 800;
  background: rgba(29, 78, 216, 0.04);
}

.view-all-tasks {
  width: 100%;
  margin-top: 14px;
  padding: 0 16px;
  color: #1d4ed8;
  background: rgba(29, 78, 216, 0.08);
}

.view-all-tasks:hover,
.print-page-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 26px rgba(15, 25, 39, 0.12);
}

.view-all-tasks:hover {
  color: #fff;
  background: #041953;
}

.view-all-tasks :deep(svg) {
  width: 20px;
  height: 20px;
}

.view-all-tasks:hover :deep(svg path) {
  fill: #fff;
}

@media (max-width: 1024px) {
  .employee-layout {
    grid-template-columns: 1fr;
  }

  .employee-side-panel {
    position: static;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .employee-page-topbar,
  .tasks-panel-header {
    align-items: stretch;
    flex-direction: column;
  }

  .print-page-btn {
    width: 100%;
  }

  .employee-side-panel {
    grid-template-columns: 1fr;
  }
}

@media print {
  .employee-page-topbar,
  .view-all-tasks {
    display: none !important;
  }

  .employee-layout {
    display: block;
  }

  .employee-side-panel {
    position: static;
  }
}
</style>
