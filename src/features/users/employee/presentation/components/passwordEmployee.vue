<script setup lang="ts">
import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import { ref } from "vue";
import { validateRequiredFields } from "@/base/persention/utils/validate_required_fields";
import { validationEnum } from "@/base/persention/utils/validation_enum";
import validationDialogService from "@/base/persention/utils/validationService";
import UpdatePasswordEmployeeParams from "@/features/dashboard/users/employee/Core/params/update_password_employee_params";
import { useRoute, useRouter } from "vue-router";
import UpdatePasswordEmployeeController from "@/features/dashboard/users/employee/Presentation/controllers/update_password_employee_controller";

const route = useRoute();
const router = useRouter();
const id = ref(route.params.id);
const password = ref<string>("");

const updatePassword = async () => {
  const updatePasswordParams = new UpdatePasswordEmployeeParams(
    id.value,
    password.value,
  );

  const missingFields = validateRequiredFields(updatePasswordParams);

  if (Object.keys(missingFields).length > 0) {
    const validationMode = validationEnum.BOTH; // Choose your mode: "dialog", "inline", or "both"
    validationDialogService.validate(missingFields, validationMode);
    return;
  }

  await UpdatePasswordEmployeeController.getInstance().updatePasswordEmployee(
    updatePasswordParams,
    router,
  );
};
</script>

<template>
  <form
    class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4"
    @submit.prevent="updatePassword"
  >
    <div class="col-span-6 md:col-span-3 input-wrapper">
      <label class="input-label required" for="title">Password</label>
      <input
        id="password"
        v-model="password"
        class="input"
        placeholder="Enter password"
        type="password"
      />
    </div>

    <div class="col-span-6 button-wrapper">
      <PrimaryButton :title="'Update password'" :type="'submit'" />
    </div>
  </form>
</template>

<style scoped></style>
