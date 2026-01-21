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
</script>
<template>
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
    <div class="lg:col-span-3 space-y-6">
      <EmployeeProfileBox :state="empDetastate" />
     <!-- Pass Data to PerformanceBox -->
      <PerformanceBox :state="empDetastate" />
    </div>

    <div class="lg:col-span-1 space-y-6">
      <CertificateComp :state="empDetastate?.employee_certificates" />
      <ProjectComp :state="empDetastate?.projects" />
    </div>
  </div>
</template>
