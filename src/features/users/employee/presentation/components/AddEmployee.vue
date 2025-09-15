<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import EmployeeForm from "@/features/dashboard/users/employee/Presentation/components/EmployeeForm.vue";
import AddEmployeeController from "@/features/dashboard/users/employee/Presentation/controllers/add_employee_controller";
import AddEmployeeParams from "@/features/dashboard/users/employee/Core/params/add_employee_params";
import type Params from "@/base/core/params/params";
import { validateRequiredFields } from "@/base/persention/utils/validate_required_fields";
import { validationEnum } from "@/base/persention/utils/validation_enum";
import validationDialogService from "@/base/persention/utils/validationService"; // Import validation dialog

const router = useRouter();
const params = ref<Params | null>(null);

const addEmployeeController = AddEmployeeController.getInstance();

const addEmployee = async () => {
  const missingFields = validateRequiredFields(params.value);

  if (Object.keys(missingFields).length > 0) {
    const validationMode = validationEnum.BOTH; // Choose your mode: "dialog", "inline", or "both"
    validationDialogService.validate(missingFields, validationMode);
    return;
  }

  await addEmployeeController.addEmployee(
    params.value as AddEmployeeParams,
    router,
  );
};
const setParams = (data: Params) => {
  // console.log(data)
  params.value = data;
};
</script>

<template>
  <form
    class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4"
    @submit.prevent="addEmployee"
  >
    <EmployeeForm @update:updateData="setParams" />

    <div class="col-span-6 button-wrapper">
      <PrimaryButton :title="'Add Employee'" :type="'submit'" />
    </div>
  </form>
</template>

<style scoped></style>
