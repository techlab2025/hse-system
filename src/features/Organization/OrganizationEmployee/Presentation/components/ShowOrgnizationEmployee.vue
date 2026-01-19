<template>
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
    <div class="lg:col-span-3 space-y-6">
      <EmployeeProfileBox :employee="employee" />
      <PerformanceBox />
    </div>

    <div class="lg:col-span-1 space-y-6">
      <CertificateComp />
      <ProjectComp />
    </div>
  </div>
</template>

<script setup lang="ts">
import CertificateComp from '../supcomponents/showOrgEmployee/CertificateComp.vue'
import EmployeeProfileBox from '../supcomponents/showOrgEmployee/EmployeeProfileBox.vue'
// import EmpTasks from '../supcomponents/showOrgEmployee/EmpTasks.vue';
import PerformanceBox from '../supcomponents/showOrgEmployee/PerformanceBox.vue'
import ProjectComp from '../supcomponents/showOrgEmployee/ProjectComp.vue'
</script>
