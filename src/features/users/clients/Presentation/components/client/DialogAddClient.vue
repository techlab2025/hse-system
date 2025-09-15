<script setup lang="ts">
import Dialog from "primevue/dialog";
import { ref, withDefaults, toRefs, watch } from "vue";
import TitleInterface from "@/base/Data/Models/title_interface";
import CustomSelectInput from "@/components/HelpersComponents/CustomSelectInput.vue";
import AddClientParams from "@/features/dashboard/users/clients/Core/params/add_client_params";
import AttentionParams from "@/features/dashboard/users/clients/Core/params/attention_params";
import IndexCountryParams from "@/features/dashboard/settings/country/Core/params/index_country_params";
import IndexCountryController from "@/features/dashboard/settings/country/Presentation/controllers/index_country_controller";
import IndexEmployeeParams from "@/features/dashboard/users/employee/Core/params/index_employees_params";
import IndexEmployeeController from "@/features/dashboard/users/employee/Presentation/controllers/index_employees_controller";
import AddClientController from "@/features/dashboard/users/clients/Presentation/controllers/add_client_controller";
import { useRouter } from "vue-router";

import { PermissionsEnum } from "@/features/dashboard/users/employee/Core/enums/permission_enum";
import { useUserStore } from "@/stores/user";
import { validateRequiredFields } from "@/base/persention/utils/validate_required_fields";
import { validationEnum } from "@/base/persention/utils/validation_enum";
import validationDialogService from "@/base/persention/utils/validationService";

const router = useRouter();

const props = withDefaults(
  defineProps<{
    visible: boolean;
  }>(),
  {
    visible: false,
  },
);

const emit = defineEmits(["update:visible"]);

const { visible } = toRefs(props);

const showDialog = ref(false);
watch(
  () => visible.value,
  (value) => {
    showDialog.value = value;
    emit("update:visible", value);
  },
);

const countriesController = IndexCountryController.getInstance();
const nationalityController = IndexCountryController.getInstance();
const countryParams = new IndexCountryParams("", 1, 10, 0);
const nationalityParams = new IndexCountryParams("", 1, 10, 0);

const clientCode = ref(1);

const employeeController = IndexEmployeeController.getInstance();
const employeeParams = new IndexEmployeeParams("", 1, 0, 0);

const name = ref("");
const email = ref("");
const phone = ref("");
const commercialRegistrationNumber = ref("");
const taxRegisterNumber = ref("");
const website = ref("");

const clientType = ref<TitleInterface | null>({
  id: 1,
  title: "Client",
  subtitle: "",
});
const clientTypes = ref<TitleInterface[]>([
  new TitleInterface({ id: 1, title: "Client", subtitle: "" }),
  new TitleInterface({ id: 2, title: "Company", subtitle: "" }),
]);

const clientStatus = ref<TitleInterface | null>({
  id: 1,
  title: "New",
  subtitle: "",
});
const clientStatuses = ref<TitleInterface[]>([
  new TitleInterface({ id: 1, title: "New", subtitle: "" }),
  new TitleInterface({ id: 2, title: "Old", subtitle: "" }),
  new TitleInterface({ id: 3, title: "Draft", subtitle: "" }),
]);

const country = ref<TitleInterface | null>(null);
const city = ref<TitleInterface | null>(null);
const nationality = ref<TitleInterface | null>(null);
const employee = ref<TitleInterface | null>(null);

const addClient = async () => {
  const clientParams = new AddClientParams(
    null,
    name.value || null,
    email.value || null,
    null,
    phone.value || null,
    commercialRegistrationNumber.value || null,
    taxRegisterNumber.value || null,
    new Date().toISOString().split("T")[0],
    null,
    null,
    null,
    null,
    null,
    null,
    country.value?.id ?? null,
    city.value?.id ?? null,
    null,
    null,
    website.value || null,
    employee.value?.id ?? null,
    clientType.value?.id || null,
    clientStatus.value?.id || null,
    clientType.value?.id === 1
      ? null
      : new AttentionParams(null, "", "", "", null),
    nationality.value?.id || null,
    clientCode.value || null,
  );

  const missingFields = validateRequiredFields(clientParams);

  if (Object.keys(missingFields).length > 0) {
    const validationMode = validationEnum.BOTH; // Choose your mode: "dialog", "inline", or "both"
    validationDialogService.validate(missingFields, validationMode);
    return;
  }
  await AddClientController.getInstance().addClient(clientParams, router, true);
  showDialog.value = false;
  emit("update:visible", false);
};

const setClientType = async (data: TitleInterface) => {
  clientType.value = data;
};

const setClientStatus = async (data: TitleInterface) => {
  clientStatus.value = data;
};

const updateEmployee = (data: TitleInterface) => {
  employee.value = data;
};

const resetFields = () => {
  name.value = "";
  email.value = "";
  phone.value = "";
  commercialRegistrationNumber.value = "";
  taxRegisterNumber.value = "";
  website.value = "";
  clientType.value = clientTypes.value[0];
  clientStatus.value = clientStatuses.value[0];
  country.value = null;
  city.value = null;
  // console.log("resetFields");
  emit("update:visible", false);
};

const handlePermission = (code: PermissionsEnum) => {
  const user = useUserStore().user!;
  if (user) {
    if (user.isMaster === 1) {
      return false;
    } else {
      return user.permission.includes(code);
    }
  }
};

const updateNationality = async (data: TitleInterface) => {
  nationality.value = data;
};
</script>

<template>
  <Dialog
    v-model:visible="showDialog"
    modal
    dismissableMask
    @hide="resetFields"
    class="w-full md:w-1/2 p-4"
  >
    <template #container>
      <form
        @submit.prevent="addClient"
        class="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div class="col-span-4 md:col-span-2 input-wrapper">
          <label class="input-label required" for="title">company name</label>
          <input
            id="name"
            v-model="name"
            class="input"
            placeholder="Enter title"
            type="text"
          />
        </div>
        <div class="col-span-4 md:col-span-2 input-wrapper">
          <label class="input-label required" for="phone"> Phone number</label>
          <input
            id="phone"
            v-model="phone"
            class="input"
            placeholder="Enter phone"
            type="tel"
          />
        </div>
        <div class="col-span-4 md:col-span-2 input-wrapper">
          <label class="input-label required" for="name">Email</label>
          <input
            id="email"
            v-model="email"
            class="input"
            placeholder="Enter Name"
            type="text"
          />
        </div>
        <div class="col-span-4 md:col-span-2 input-wrapper">
          <CustomSelectInput
            :modelValue="clientType"
            :staticOptions="clientTypes"
            label="Client Types"
            id="type"
            placeholder="Select Client Types"
            @update:modelValue="setClientType"
          />
        </div>
        <div
          class="col-span-4 md:col-span-2 input-wrapper"
          v-if="!handlePermission(PermissionsEnum.DraftClient)"
        >
          <CustomSelectInput
            :modelValue="clientStatus"
            :staticOptions="clientStatuses"
            label="Client Status"
            id="clientStatus"
            placeholder="Select Client Status"
            @update:modelValue="setClientStatus"
          />
        </div>
        <div
          class="col-span-4 md:col-span-2 input-wrapper"
          v-if="clientStatus?.id === 2"
        >
          <label class="input-label required" for="clientCode"
            >Client Code</label
          >
          <input
            id="clientCode"
            v-model="clientCode"
            class="input"
            min="1"
            max="919"
            placeholder="Enter Client Code"
            type="text"
          />
        </div>
        <div class="col-span-4 md:col-span-2 input-wrapper">
          <CustomSelectInput
            :controller="nationalityController"
            :modelValue="nationality"
            :params="nationalityParams"
            label="Nationality"
            id="nationalityId"
            :options="[]"
            @update:modelValue="updateNationality"
            placeholder="Select a Nationality"
          />
        </div>
        <div
          v-if="clientType?.id != 1"
          class="col-span-4 md:col-span-2 input-wrapper"
        >
          <label class="input-label" for="Commercial registration number"
            >Commercial registration number</label
          >
          <input
            id="client-statues"
            v-model="commercialRegistrationNumber"
            class="input"
            placeholder="Commercial registration number"
            type="text"
          />
        </div>
        <div
          v-if="clientType?.id != 1"
          class="col-span-4 md:col-span-2 input-wrapper"
        >
          <label class="input-label" for="tax"> Tax registration number</label>
          <input
            id="tax"
            v-model="taxRegisterNumber"
            class="input"
            placeholder="Enter tax"
            type="text"
          />
        </div>
        <div
          v-if="clientType?.id != 1"
          class="col-span-4 md:col-span-2 input-wrapper"
        >
          <label class="input-label" for="website">Website</label>
          <input
            id="website"
            v-model="website"
            class="input"
            placeholder="Enter website"
            type="text"
          />
        </div>
        <div class="col-span-4 md:col-span-2 input-wrapper">
          <CustomSelectInput
            :modelValue="employee"
            :controller="employeeController"
            label="Responsible for the client in the office"
            placeholder="select client responsible"
            id="employeeId"
            :params="employeeParams"
            @update:modelValue="updateEmployee"
          />
        </div>
        <div class="col-span-4">
          <button class="btn btn-primary w-full" type="submit">
            Add Client
          </button>
        </div>
      </form>
    </template>
  </Dialog>
</template>
