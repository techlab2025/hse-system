<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
// import ImageUser from '@/components/HelpersComponents/ImageUser.vue'
import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import DataStatus from "@/components/DataStatues/DataStatus.vue";
import FormLoader from "@/components/DataStatues/FormLoader.vue";
import EmployeeForm from "@/features/dashboard/users/employee/Presentation/components/EmployeeForm.vue";
import type Params from "@/base/core/params/params";
import ShowClientModel from "@/features/dashboard/users/clients/Data/models/show_client_model";
import ShowEmployeeController from "@/features/dashboard/users/employee/Presentation/controllers/show_employee_controller";
import ShowEmployeeParams from "@/features/dashboard/users/employee/Core/params/show_employee_params";
import EditEmployeeController from "@/features/dashboard/users/employee/Presentation/controllers/edit_employee_controller";
import { validateRequiredFields } from "@/base/persention/utils/validate_required_fields";
import { validationEnum } from "@/base/persention/utils/validation_enum";
import validationDialogService from "@/base/persention/utils/validationService"; // Import validation dialog

const route = useRoute();
const router = useRouter();
const id = ref(route.params.id);
const params = ref<Params | null>(null);
const employeeDetails = ref<ShowClientModel | null>(null);

const showEmployeeController = ShowEmployeeController.getInstance();
const state = ref(showEmployeeController.state.value);
const fetchEmployeeDetails = async () => {
  const ClientParams = new ShowEmployeeParams(id.value as string);

  const response = await showEmployeeController.showEmployee(ClientParams);
  employeeDetails.value = response.value.data;
};

onMounted(() => {
  fetchEmployeeDetails();
});

const EditClient = async (draft: boolean) => {
  const missingFields = validateRequiredFields(params.value);

  if (Object.keys(missingFields).length > 0) {
    const validationMode = validationEnum.BOTH; // Choose your mode: "dialog", "inline", or "both"
    validationDialogService.validate(missingFields, validationMode);
    return;
  }
  await EditEmployeeController.getInstance().editEmployee(
    params.value!,
    router,
  );
};

watch(
  () => showEmployeeController.state.value,
  (newState) => {
    if (newState) {
      // console.log(newState)
      state.value = newState;
    }
  },
);

const setParams = (data: Params) => {
  console.log(data);
  params.value = data;
};
</script>

<template>
  <DataStatus :status="state">
    <template #success>
      <form
        class="grid grid-cols-1 md:grid-cols-3 gap-4"
        @submit.prevent="EditClient"
      >
        <EmployeeForm
          :EmployeeData="employeeDetails"
          @update:updateData="setParams"
        />
        <div class="col-span-3 button-wrapper">
          <PrimaryButton :title="'Edit Employee'" :type="'submit'" />
        </div>
      </form>
    </template>
    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>
  </DataStatus>
</template>

<style scoped></style>
