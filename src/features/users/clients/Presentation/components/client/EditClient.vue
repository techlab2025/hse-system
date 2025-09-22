<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import EditClientParams from "@/features/dashboard/users/languages/Core/params/edit_client_params";
import EditClientController from "@/features/dashboard/users/languages/Presentation/controllers/edit_client_controller";
// import ImageUser from '@/components/HelpersComponents/ImageUser.vue'
import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import ShowClientParams from "@/features/dashboard/users/languages/Core/params/show_client_params";
import ShowClientController from "@/features/dashboard/users/languages/Presentation/controllers/show_client_controller";
import DataStatus from "@/components/DataStatues/DataStatus.vue";
import FormLoader from "@/components/DataStatues/FormLoader.vue";
import ClientForm from "@/features/dashboard/users/languages/Presentation/components/client/LangIndustry.vue";
import { validateRequiredFields } from "@/base/persention/utils/validate_required_fields";
import { validationEnum } from "@/base/persention/utils/validation_enum";
import validationDialogService from "@/base/persention/utils/validationService";
import type TitleInterface from "@/base/Data/Models/title_interface";
import AttentionParams from "@/features/dashboard/users/languages/Core/params/attention_params";
import type Params from "@/base/core/params/params";
import ShowClientModel from "@/features/dashboard/users/languages/Data/models/show_client_model";

const route = useRoute();
const router = useRouter();
const id = ref(route.params.id);
const params = ref<Params | null>(null);
const clientDetails = ref<ShowClientModel | null>(null);

const showClientController = ShowClientController.getInstance();
const state = ref(showClientController.state.value);
const fetchClientDetails = async () => {
  const ClientParams = new ShowClientParams(id.value as string);

  const response = await showClientController.showClient(ClientParams);
  clientDetails.value = response.value.data;
};

onMounted(() => {
  fetchClientDetails();
});

const EditClient = async (draft: boolean) => {
  const missingFields = validateRequiredFields(params.value);

  if (Object.keys(missingFields).length > 0) {
    const validationMode = validationEnum.BOTH; // Choose your mode: "dialog", "inline", or "both"
    validationDialogService.validate(missingFields, validationMode);
    return;
  }

  if (draft) {
    await EditClientController.getInstance().editClient(
      params.value!,
      router,
      true,
    );
  } else {
    await EditClientController.getInstance().editClient(
      params.value!,
      router,
      false,
    );
  }
};

watch(
  () => showClientController.state.value,
  (newState) => {
    if (newState) {
      // console.log(newState)
      state.value = newState;
    }
  },
);

const setParams = (data: Params) => {
  params.value = data;
};
</script>

<template>
  <DataStatus :status="state">
    <template #success>
      <form
        class="grid grid-cols-1 md:grid-cols-4 gap-4"
        @submit.prevent="EditClient"
      >
        <ClientForm
          @update:clientData="setParams"
          :clientData="clientDetails"
        />
        <div class="col-span-4 button-wrapper">
          <PrimaryButton :title="'Edit Client'" :type="'submit'" />
        </div>
      </form>
    </template>
    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>
  </DataStatus>
</template>

<style scoped></style>
