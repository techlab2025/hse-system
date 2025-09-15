<script setup lang="ts">
import ShowEmployeeFristsec from "@/features/dashboard/users/employee/Presentation/supcomponents/ShowEmployeeFristsec.vue";
import ShowEmployeeSecondsec from "@/features/dashboard/users/employee/Presentation/supcomponents/ShowEmployeeSecondsec.vue";
import ShowEmployeeThirdsec from "@/features/dashboard/users/employee/Presentation/supcomponents/ShowEmployeeThridsec.vue";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import ShowEmployeeParams from "@/features/dashboard/users/employee/Core/params/show_employee_params";
import ShowEmployeeController from "@/features/dashboard/users/employee/Presentation/controllers/show_employee_controller";
import ShowEmployeeModel from "@/features/dashboard/users/employee/Data/models/show_employee_model";

const route = useRoute();
const router = useRouter();

const image = ref<String | null>(null);
const loader = ref<boolean>(false);
const employeeDetails = ref<ShowEmployeeModel | null>(null);
const id = ref<string>(<string>route.params.id);

const fetchServicesDetails = async () => {
  const servicesParams = new ShowEmployeeParams(id.value);

  loader.value = true;
  const response =
    await ShowEmployeeController.getInstance().showEmployee(servicesParams);
  console.log(response.value.data);

  employeeDetails.value = response.value.data;

  loader.value = false;
};

onMounted(() => {
  fetchServicesDetails();
});
</script>
<template>
  <div class="container-showclient">
    <ShowEmployeeFristsec :data="employeeDetails" />
    <ShowEmployeeSecondsec :data="employeeDetails" />
    <ShowEmployeeThirdsec :data="employeeDetails" />
  </div>
</template>
