<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import ClientForm from "@/features/users/clients/Presentation/components/client/LangIndustry.vue";
import AddClientController from "@/features/users/clients/Presentation/controllers/add_client_controller";
import AddClientParams from "@/features/users/clients/Core/params/add_client_params";
import type Params from "@/base/core/params/params";
import { validateRequiredFields } from "@/base/Presentation/utils/validate_required_fields";
import { validationEnum } from "@/base/Presentation/utils/validation_enum";
import validationDialogService from "@/base/Presentation/utils/validationService";

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
