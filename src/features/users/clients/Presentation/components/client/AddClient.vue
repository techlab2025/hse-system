<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import ClientForm from "@/features/dashboard/users/languages/Presentation/components/client/LangIndustry.vue";
import AddClientController from "@/features/dashboard/users/languages/Presentation/controllers/add_client_controller";
import AddClientParams from "@/features/dashboard/users/languages/Core/params/add_client_params";
import type Params from "@/base/core/params/params";
import { validateRequiredFields } from "@/base/persention/utils/validate_required_fields";
import { validationEnum } from "@/base/persention/utils/validation_enum";
import validationDialogService from "@/base/persention/utils/validationService";

const router = useRouter();
const params = ref<Params | null>(null);

const addClientController = AddClientController.getInstance();

const addClient = async () => {
  // console.log(params.value)
  const missingFields = validateRequiredFields(params.value);

  if (Object.keys(missingFields).length > 0) {
    const validationMode = validationEnum.BOTH; // Choose your mode: "dialog", "inline", or "both"
    validationDialogService.validate(missingFields, validationMode);
    return;
  }
  await addClientController.addClient(params.value as AddClientParams, router);
};
const setParams = (data: Params) => {
  params.value = data;
};
</script>

<template>
  <form
    class="grid grid-cols-1 md:grid-cols-4 gap-4"
    @submit.prevent="addClient"
  >
    <ClientForm @update:clientData="setParams" />

    <div class="col-span-4 button-wrapper">
      <PrimaryButton :title="'Add Client'" :type="'submit'" />
    </div>
  </form>
</template>

<style scoped></style>
