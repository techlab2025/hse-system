<script setup lang="ts">
import { ref } from "vue";
import Dialog from 'primevue/dialog';
import { useTicketStore } from "@/stores/TicketStor";
import TicktDialogHedaerIcon from "@/shared/icons/TicktDialogHedaerIcon.vue";
import CustomSelectInput from "@/shared/FormInputs/CustomSelectInput.vue";
import IndexTicketTypeController from "@/features/Organization/TicketType/Presentation/controllers/indexTicketTypeController";
import IndexTicketTypeParams from "@/features/Organization/TicketType/Core/params/indexTicketTypeParams";
import AddTicketParams from "../../../Core/params/addTicketParams";
import AddTicketController from "../../controllers/addTicketController";
import { useRouter } from "vue-router";
import type TitleInterface from "@/base/Data/Models/title_interface";
import IndexOrganizationController from "@/features/setting/Organization/Presentation/controllers/indexOrganizationController";
import IndexOrganizationParams from "@/features/setting/Organization/Core/params/indexOrganizationParams";
import { OrganizationTypeEnum } from "@/features/auth/Core/Enum/organization_type";
import { useUserStore } from "@/stores/user";
// const visible = ref(false);
const ticketStore = useTicketStore()
const indexTicketTypeController = IndexTicketTypeController.getInstance()
const indexTicketTypeParams = new IndexTicketTypeParams("", 1, 10, 0)

const TicketType = ref<TitleInterface>()
const setTicketType = (data: TitleInterface) => {
  TicketType.value = data
}
const description = ref<string>()
const title = ref<string>()

const router = useRouter()

const indexOrganizationController = IndexOrganizationController.getInstance()
const organizationParams = new IndexOrganizationParams('', 0, 10, 0)
const SelectedOrganization = ref<TitleInterface>()

const setOrganization = (data: TitleInterface) => {
  SelectedOrganization.value = data
}
const SubmitTicket = async () => {
  const addTicketController = AddTicketController.getInstance()
  const addTicketParams = new AddTicketParams([ticketStore.capturedImage], TicketType.value?.id, title.value, description.value, SelectedOrganization?.value ? SelectedOrganization.value?.id : null)
  const response = await addTicketController.addTicket(addTicketParams, router)

  if (response) {
    ticketStore.OpenTicketDialog = false
    ticketStore.capturedImage = null
    TicketType.value = undefined
    description.value = ""
    title.value = ""
  }
}
const { user } = useUserStore()

</script>
<template>
  <div class="ticket-dialog-conatiner">
    <!-- <button @click="visible = true"  -->
    <Dialog v-model:visible="ticketStore.OpenTicketDialog" modal header="Ticket" :style="{ width: '60rem' }">

      <template #header>
        <div class="flex items-center gap-2">
          <TicktDialogHedaerIcon />
          <div class=" dialog-header flex flex-col">
            <h3 class="title"> We’re here to help!</h3>
            <p class="description">Your screenshot is attached. Add a note to explain the issue and send it to our
              support team.</p>
          </div>
        </div>
      </template>

      <div class=" dialog-content flex items-center gap-2">
        <div class="flex flex-col w-full">
          <div class="input-wrapper">
            <CustomSelectInput :modelValue="TicketType" :controller="indexTicketTypeController"
              :params="indexTicketTypeParams" :label="$t('type_of_problem')" id="TicketType"
              :placeholder="$t('Select_ticket_type')" @update:modelValue="setTicketType" />
          </div>
          <div class="input-wrapper col-span-4 md:col-span-4" v-if="user?.type == OrganizationTypeEnum?.ADMIN">
            <CustomSelectInput :modelValue="SelectedOrganization" :controller="indexOrganizationController"
              :params="organizationParams" label="Select Organization" id="organization"
              placeholder="Select organization" @update:modelValue="setOrganization" />
          </div>
          <div class="input-wrapper">
            <label for="">{{ $t('title') }}</label>
            <input type="text" class="input" v-model="title" :placeholder="$t('enter_title')">
          </div>
          <div class="input-wrapper">
            <label for="">{{ $t('description') }}</label>
            <textarea name="" id="" cols="30" rows="10" v-model="description"
              :placeholder="$t('enter_description')"></textarea>
          </div>

        </div>
        <img v-if="ticketStore.capturedImage" :src="ticketStore.capturedImage" alt="img">

      </div>
      <div class="btn-container">
        <button class="btn btn-close" @click.prevent="ticketStore.OpenTicketDialog = false">{{ $t('cancel') }}</button>
        <button class="btn btn-primary" @click.prevent="SubmitTicket">{{ $t('send') }}</button>
      </div>
    </Dialog>
  </div>
</template>


<style scoped lang="scss">
// .ticket-dialog-conatiner {
.dialog-header {
  .title {
    font-size: 24px;
    font-weight: 700;
    color: #202020;
  }

  .description {
    font-size: 14px;
    font-weight: 500;
    color: #6B7280;
  }
}

.dialog-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: space-between;

  img {
    border: 1px dashed #E5E5E5;
    padding: 10px;
    border-radius: 12px;
    margin-left: auto;
    width: 50%;
  }

  .input-wrapper {
    /* margin-block: 12px;*/
  }
}

.btn-container {
  width: 100%;

  .btn-close {
    border: 1px dashed #E5E5E5;
    border-radius: 15px;
    padding: 12px;
    width: 50%;
    transition: 0.3s all linear;

    &:hover {
      background-color: #E5E5E5;
    }
  }

  .btn-primary {
    width: 50%;

  }
}

// }</style>
