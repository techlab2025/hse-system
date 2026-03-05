<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ShowOrganizatoinEmployeeParams from '../../Core/params/showOrganizatoinEmployeeParams'
import ShowOrganizatoinEmployeeController from '../controllers/showOrganizatoinEmployeeController'
import CertificateComp from '../supcomponents/showOrgEmployee/CertificateComp.vue'
import EmployeeProfileBox from '../supcomponents/showOrgEmployee/EmployeeProfileBox.vue'
// import EmpTasks from '../supcomponents/showOrgEmployee/EmpTasks.vue';
import PerformanceBox from '../supcomponents/showOrgEmployee/PerformanceBox.vue'
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
</script>
<template>
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
    <div class="lg:col-span-3 space-y-6">
      <EmployeeProfileBox :state="empDetastate" />
      <!-- Pass Data to PerformanceBox -->
      <!-- <PerformanceBox :state="empDetastate" /> -->
       <div class="all-emp-tasks" v-for="task in empDetastate?.tasks.slice(0, 1)" :key="task.id">
         <Employeetasks :tasks="task" />
        </div>

        <button class="view-all-tasks" @click="viewAllTasks()" v-if="!isShowAllTasks">View All Tasks <Emptask /></button>

        <template v-if="isShowAllTasks">

          <div class="all-emp-tasks" v-for="task in empDetastate?.tasks.slice(1)" :key="task.id">
            <Employeetasks :tasks="task" />
          </div>

          <button class="view-all-tasks" @click="viewLessTasks()" v-if="isShowAllTasks">View Less Tasks <Emptask /></button>

        </template>
    </div>

    <div class="lg:col-span-1 space-y-6">
      <CertificateComp :state="empDetastate?.certificates" />
      <ProjectComp :state="empDetastate?.projects" />
    </div>
  </div>
</template>
