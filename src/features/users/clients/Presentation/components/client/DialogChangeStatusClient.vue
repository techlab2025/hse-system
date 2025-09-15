<script lang="ts" setup>
import Dialog from "primevue/dialog";
import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import { ref } from "vue";
import SecondaryButton from "@/components/HelpersComponents/SecondaryButton.vue";
import AcceptClientParams from "@/features/dashboard/users/clients/Core/params/accept_client_params";
import AcceptClientController from "@/features/dashboard/users/clients/Presentation/controllers/accept_client_controller";

const visible = ref(false);
const emit = defineEmits(["clientChangeStatus"]);

const props = defineProps<{
  clientId: number;
}>();

const code = ref("");
const acceptClientController = AcceptClientController.getInstance();

const acceptClient = async () => {
  // console.log(props.clientId)
  await acceptClientController.acceptClient(
    new AcceptClientParams(
      props.clientId.toString(),
      code.value,
      1, // 1 is the status Accept of the client
    ),
  );
  //when request is success i want visible = false & call fetchClient(); from IndexClients.vue
  visible.value = false;
  await emit("clientChangeStatus");
};

const rejectClient = async () => {
  // console.log(props.clientId)
  await acceptClientController.acceptClient(
    new AcceptClientParams(
      props.clientId.toString(),
      "",
      2, // 1 is the status Reject of the client
    ),
  );
  await emit("clientChangeStatus");
};
</script>

<template>
  <PrimaryButton @click="rejectClient" :title="'Reject'" :type="'button'" />
  <PrimaryButton
    :title="'Accept'"
    :type="'button'"
    class="mx-3"
    @click="visible = true"
  />
  <Dialog v-model:visible="visible" :modal="true" class="export-offer-dialog">
    <template #container>
      <div class="export-offer-body">
        <img alt="" src="@/assets/images/export-offer.png" />
        <h4>are you really to Accept Client</h4>
      </div>
      <div class="input-wrapper w-[90%]">
        <label for="code" class="input-label">Code</label>
        <input
          id="code"
          v-model="code"
          class="input"
          placeholder="Enter code"
          type="text"
        />
      </div>
      <div class="actions">
        <PrimaryButton
          class="w-full"
          @click="acceptClient"
          :title="'yes, i’m sure'"
          :type="'button'"
        />
        <SecondaryButton
          class="w-full"
          :title="'cancel'"
          @click="visible = false"
          :type="'button'"
        />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
@media screen and (max-width: 768px) {
  .btn-primary {
    height: 35px;
    font-size: 0.7rem;
  }
}
</style>
