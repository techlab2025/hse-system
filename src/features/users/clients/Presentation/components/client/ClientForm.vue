<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import IndexClientCategoryController from "@/features/dashboard/settings/clientCategory/Presentation/controllers/index_client_category_controller";
import IndexClientCategoryParams from "@/features/dashboard/settings/clientCategory/Core/params/index_client_category_params";
import ImageUser from "@/components/HelpersComponents/ImageUser.vue";
import DatePicker from "primevue/datepicker";
import TitleInterface from "@/base/Data/Models/title_interface";
import SelectInput from "@/components/HelpersComponents/SelectInput.vue";
import Editor from "primevue/editor";
import IndexClientStatisfactionController from "@/features/dashboard/settings/clientstatisfaction/Presentation/controllers/index_Client_Statisfaction_controller";
import AddClientParams from "@/features/dashboard/users/clients/Core/params/add_client_params";
import EditClientParams from "@/features/dashboard/users/clients/Core/params/edit_client_params";
import type ShowClientModel from "@/features/dashboard/users/clients/Data/models/show_client_model";
import AttentionParams from "@/features/dashboard/users/clients/Core/params/attention_params";
import { convertToBase64 } from "@/base/persention/utils/convert_to_base_64";
import IndexCountryParams from "@/features/dashboard/settings/country/Core/params/index_country_params";
import IndexGovernorateController from "@/features/dashboard/settings/governorate/Presentation/controllers/index_governorate_controller";
import IndexGovernoratesParams from "@/features/dashboard/settings/governorate/Core/params/index_governorate_params";
import IndexCitiesParams from "@/features/dashboard/settings/city/Core/params/index_city_params";
import IndexCityController from "@/features/dashboard/settings/city/Presentation/controllers/index_city_controller";
import CustomSelectInput from "@/components/HelpersComponents/CustomSelectInput.vue";
import IndexCountryController from "@/features/dashboard/settings/country/Presentation/controllers/index_country_controller";
import IndexEmployeeParams from "@/features/dashboard/users/employee/Core/params/index_employees_params";

import IndexEmployeeController from "@/features/dashboard/users/employee/Presentation/controllers/index_employees_controller";
import { PermissionsEnum } from "@/features/dashboard/users/employee/Core/enums/permission_enum";
import PermissionHandler from "@/base/persention/utils/permission_handler";

import { useUserStore } from "@/stores/user";

const emit = defineEmits(["update:clientData"]);

const countriesController = IndexCountryController.getInstance();
const nationalityController = IndexCountryController.getInstance();
const countryParams = new IndexCountryParams("", 1, 10, 0);
const nationalityParams = new IndexCountryParams("", 1, 10, 0);

const governatesController = IndexGovernorateController.getInstance();
const governateParams = ref<IndexGovernoratesParams | null>(null);

const clientCode = ref(1);

const citiesController = IndexCityController.getInstance();
const employeeController = IndexEmployeeController.getInstance();
const employeeParams = new IndexEmployeeParams("", 1, 0, 0);

const cityParams = ref<IndexCitiesParams | null>(null);

const props = defineProps<{
  clientData: ShowClientModel;
}>();
const name = ref(props.clientData?.name);

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
const email = ref(props.clientData?.email);
const image = ref<string>(props.clientData?.image);
const country = ref<TitleInterface | null>(props.clientData?.country);
const countries = ref<TitleInterface[]>([]);

const city = ref<TitleInterface | null>(props.clientData?.city);
const nationality = ref<TitleInterface | null>(props.clientData?.nationality);
const cities = ref<TitleInterface[]>([]);
const governorate = ref<TitleInterface | null>(props.clientData?.governorate);
const governorates = ref<TitleInterface[]>([]);
const region = ref<TitleInterface | null>(props.clientData?.regionId);
const regions = ref<TitleInterface[]>([]);
const joinDate = ref<Date | null>(new Date());
const clientCategory = ref<TitleInterface | null>(
  props.clientData?.clientCategory,
);
const clientCategories = ref<TitleInterface[]>([]);
const employee = ref<TitleInterface | null>(props.clientData?.employeeId);
const employees = ref<TitleInterface[]>([]);
const clientStatisfaction = ref<TitleInterface | null>(
  props.clientData?.clientSatisfaction,
);
const clientStatisfactions = ref<TitleInterface[]>([]);
const commercialRegistrationNumber = ref<string>(
  props.clientData?.commercialRegisterNumber,
);
const taxRegisterNumber = ref<string>(props.clientData?.taxRegisterNumber);
const officialTendency = ref<string>(props.clientData?.officialTendency);
const website = ref<string>(props.clientData?.website);
const clientStatues = ref<string>(props.clientData?.clientStatus);
const reasonDeal = ref<string>(props.clientData?.reasonDeal);
const bio = ref<string>(props.clientData?.bio);
const attachName = ref<string>(props.clientData?.attention?.name);
const attachPhone = ref<string>(props.clientData?.attention?.phone);
const attachEmail = ref<string>(props.clientData?.attention?.email);
// const attachName = ref<string>(props.clientData?.attention.name)
const address = ref("");
const phone = ref("");
const password = ref("");

watch(
  () => props.clientData,
  async (newClientData) => {
    if (newClientData) {
      country.value = new TitleInterface({
        id: newClientData?.country?.id,
        title: newClientData?.country?.title,
      });
      nationality.value = new TitleInterface({
        id: newClientData?.country?.id,
        title: newClientData?.country?.title,
      });
      governorate.value = new TitleInterface({
        id: newClientData?.governorate?.id,
        title: newClientData?.governorate?.title,
      });
      governateParams.value = new IndexGovernoratesParams(
        country.value?.id!,
        "",
        1,
        10,
        0,
      );

      city.value = new TitleInterface({
        id: newClientData?.city?.id,
        title: newClientData?.city?.title,
      });
      cityParams.value = new IndexCitiesParams(
        governorate.value?.id!,
        "",
        1,
        10,
        0,
      );
    }

    // console.log(newClientData);
    name.value = newClientData.name;
    email.value = newClientData.email;
    // country.value = newClientData.country
    // city.value = newClientData.city
    // governorate.value = newClientData.governorate
    clientCategory.value = newClientData.clientCategory;
    employee.value = newClientData.employeeId;
    clientStatisfaction.value = newClientData.clientSatisfaction;
    commercialRegistrationNumber.value = newClientData.commercialRegisterNumber;
    taxRegisterNumber.value = newClientData.taxRegisterNumber;
    officialTendency.value = newClientData.officialTendency;
    website.value = newClientData.website;
    clientStatues.value = newClientData.clientStatus;
    reasonDeal.value = newClientData.reasonDeal;
    bio.value = newClientData.bio;
    attachName.value = newClientData.attention?.name!;
    attachPhone.value = newClientData.attention?.phone!;
    attachEmail.value = newClientData.attention?.email!;
    attachName.value = newClientData.attention?.jobTitle!;
    address.value = newClientData.address!;
    phone.value = newClientData.phone!;
    // console.log(newClientData?.country?.id, 'newClientData.country.id')
    await fetchGovernorates(country.value?.id!);
    await fetchCities(governorate.value?.id!);
  },
);

//client category
const indexClientCategoryController =
  IndexClientCategoryController.getInstance();
const fetchClientCategories = async () => {
  clientCategories.value = (
    await indexClientCategoryController.indexClientCategory(
      new IndexClientCategoryParams("", 1, 100, 0),
    )
  ).value.data!;
};

onMounted(async () => {
  await fetchClientCategories();
});

//fetch countries
const indexCountryController = IndexCountryController.getInstance();
// const fetchCountries = async () => {
//   countries.value = (
//     await indexCountryController.getData(new IndexCountryParams("", 1, 100, 0))
//   ).value.data!;
// };

//fetch governates
const indexGovernorateController = IndexGovernorateController.getInstance();
const fetchGovernorates = async (id: number) => {
  governorates.value = (
    await indexGovernorateController.getData(
      new IndexGovernoratesParams(id, "", 1, 100, 0),
    )
  ).value.data!;
};

const updateCountry = async (data: TitleInterface) => {
  country.value = data;
  governorate.value = null;
  city.value = null;
  governateParams.value = null;
  governateParams.value = new IndexGovernoratesParams(data.id, "", 1, 10, 0);
  updateData();
};

const updateGovernate = async (data: TitleInterface) => {
  governorate.value = data;
  city.value = null;
  cityParams.value = null;
  cityParams.value = new IndexCitiesParams(data.id, "", 1, 10, 0);
  updateData();
};

const updateCity = async (data: TitleInterface) => {
  city.value = data;
  updateData();
};

// fetch cities
const indexCityController = IndexCityController.getInstance();
const fetchCities = async (id: number) => {
  cities.value = (
    await indexCityController.getData(new IndexCitiesParams(id, "", 1, 100, 0))
  ).value.data!;
};

const indexClientSatisfactionController =
  IndexClientStatisfactionController.getInstance();
const fetchClientSatisfaction = async () => {
  clientStatisfactions.value = (
    await indexClientSatisfactionController.indexClientStatisfaction(
      new IndexClientCategoryParams("", 1, 100, 0),
    )
  ).value.data!;
};
onMounted(async () => {
  await fetchClientSatisfaction();
});

const updateClientCategory = async (data: TitleInterface) => {
  clientCategory.value = data;
  updateData();
};

const updateClientSatisfaction = async (data: TitleInterface) => {
  clientStatisfaction.value = data;
  updateData();
};
const updateGovernorate = async (data: TitleInterface) => {
  governorate.value = data;
  await fetchCities(data.id!);
  updateData();
};
const setClientType = async (data: TitleInterface) => {
  clientType.value = data;
  updateData();
};

const setClientStatus = async (data: TitleInterface) => {
  clientStatus.value = data;
  updateData();
};

const updateEmployee = async (data: TitleInterface) => {
  employee.value = data;
  updateData();
};

const handleImage = async (file: File) => {
  image.value = (await convertToBase64(file)) as string;
};

const updateData = () => {
  emit(
    "update:clientData",
    props.clientData?.id != null
      ? new EditClientParams(
          props.clientData?.id,
          image.value,
          name.value,
          email.value,
          null,
          phone.value,
          commercialRegistrationNumber.value,
          taxRegisterNumber.value,
          joinDate.value,
          clientCategory.value?.id ?? null,
          clientStatisfaction.value?.id ?? null,
          null,
          bio.value,
          reasonDeal.value,
          country.value?.id ?? null,
          city.value?.id ?? null,
          region.value?.id ?? null,
          governorate.value?.id ?? null,
          officialTendency.value,
          website.value,
          employee.value?.id ?? null,
          clientType.value?.id,
          null,
          clientType == 1
            ? null
            : new AttentionParams(
                null,
                attachName.value,
                attachEmail.value,
                attachPhone.value,
                null,
              ),
          nationality.value?.id,
          clientCode.value,
        )
      : new AddClientParams(
          image.value,
          name.value,
          email.value,
          address.value,
          phone.value,
          commercialRegistrationNumber.value,
          taxRegisterNumber.value,
          joinDate.value as string,
          officialTendency.value,
          clientCategory.value?.id ?? null,
          clientStatisfaction.value?.id ?? null,
          null,
          bio.value,
          reasonDeal.value,
          country.value?.id ?? null,
          city.value?.id ?? null,
          region.value?.id ?? null,
          governorate.value?.id ?? null,
          website.value,
          employee.value?.id ?? null,
          clientType.value?.id,
          clientStatus.value?.id,
          clientType == 1
            ? null
            : new AttentionParams(
                null,
                attachName.value,
                attachEmail.value,
                attachPhone.value,
                null,
              ),
          nationality.value?.id,
          clientCode.value,
        ),
  );
};
const updateNationality = async (data: TitleInterface) => {
  nationality.value = data;
  updateData();
};
onMounted(() => {
  updateData();
});

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
</script>

<template>
  <div class="col-span-4 md:col-span-4">
    <ImageUser :initialImage="image" @update:image="handleImage" />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label required" for="title">company name</label>
    <input
      id="name"
      v-model="name"
      class="input"
      placeholder="Enter title"
      type="text"
      @input="updateData"
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
      @input="updateData"
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
      @input="updateData"
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
    v-if="!handlePermission(PermissionsEnum.DraftClient) && !props.clientData"
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
    <label class="input-label required" for="clientCode">Client Code</label>
    <input
      id="clientCode"
      v-model="clientCode"
      class="input"
      min="1"
      max="919"
      placeholder="Enter Client Code"
      type="text"
      @input="updateData"
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
      placeholder="Select a Nationality"
      @update:modelValue="updateNationality"
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <SelectInput
      :modelValue="clientCategory"
      :options="clientCategories"
      label="Client Category"
      placeholder="select client category"
      @update:modelValue="updateClientCategory"
    />
  </div>
  <!--  <div class="col-span-4 md:col-span-2 input-wrapper">-->
  <!--    <label class="input-label" for="title">Official tendency</label>-->
  <!--    <input-->
  <!--      id="title"-->
  <!--      v-model="officialTendency"-->
  <!--      class="input"-->
  <!--      placeholder="Enter title"-->
  <!--      type="text"-->
  <!--      @input="updateData"-->
  <!--    />-->
  <!--  </div>-->
  <div v-if="clientType.id != 1" class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label" for="Commercial registration number"
      >Commercial registration number</label
    >
    <input
      id="client-statues"
      v-model="commercialRegistrationNumber"
      class="input"
      placeholder="Commercial registration number"
      type="text"
      @input="updateData"
    />
  </div>

  <div v-if="clientType.id != 1" class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label" for="tax"> Tax registration number</label>
    <input
      id="tax"
      v-model="taxRegisterNumber"
      class="input"
      placeholder="Enter tax"
      type="text"
      @input="updateData"
    />
  </div>
  <div v-if="clientType.id != 1" class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label" for="website">Website</label>
    <input
      id="website"
      v-model="website"
      class="input"
      placeholder="Enter website"
      type="text"
      @input="updateData"
    />
  </div>
  <!--  <div class="col-span-4 md:col-span-2 input-wrapper">-->
  <!--    <label class="input-label" for="clientStatus">Client Statues</label>-->
  <!--    <input-->
  <!--      id="clientStatus"-->
  <!--      v-model="clientStatues"-->
  <!--      class="input"-->
  <!--      placeholder="Enter client statues"-->
  <!--      type="text"-->
  <!--      @input="updateCity"-->
  <!--    />-->
  <!--  </div>-->
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label" for="firstDate"
      >Date of the first interaction with the customer</label
    >
    <DatePicker
      v-model="joinDate"
      class="date"
      dateFormat="dd/mm/yy"
      fluid
      iconDisplay="input"
      placeholder="choose date"
      id="firstDate"
      showIcon
      @update:modelValue="updateData"
    />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <CustomSelectInput
      :controller="countriesController"
      :modelValue="country"
      :params="countryParams"
      :options="[]"
      label="country"
      id="countryId"
      placeholder="Select a country"
      @update:modelValue="updateCountry"
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <CustomSelectInput
      :controller="governatesController"
      :modelValue="governorate"
      :params="governateParams"
      label="governate"
      id="governorateId"
      placeholder="Select a governate"
      @update:modelValue="updateGovernate"
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <CustomSelectInput
      :controller="citiesController"
      :modelValue="city"
      :params="cityParams"
      label="city"
      id="cityId"
      placeholder="Select a city"
      @update:modelValue="updateCity"
    />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <CustomSelectInput
      :modelValue="employee"
      :options="employees"
      :controller="employeeController"
      label="Responsible for the client in the office"
      placeholder="select client responsible"
      id="employeeId"
      :params="employeeParams"
      @update:modelValue="updateEmployee"
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <SelectInput
      :modelValue="clientStatisfaction"
      :options="clientStatisfactions"
      label="Client satisfaction with the office"
      placeholder="select client category"
      id="clientSatisfactionId"
      @update:modelValue="updateClientSatisfaction"
    />
  </div>
  <div class="col-span-4 grid grid-cols-1 md:grid-cols-4 gap-4">
    <div class="col-span-4 md:col-span-2 input-wrapper">
      <label class="input-label" for="short overview"
        >A short overview of the client (his most important
        specifications)</label
      >
      <Editor
        id="short overview"
        v-model="bio"
        editorStyle="height: 320px"
        @update:modelValue="updateData"
      />
    </div>
    <div class="col-span-4 md:col-span-2 input-wrapper">
      <label class="input-label" for="short overview"
        >The first reason to deal with a customer
      </label>
      <Editor
        id="short overview"
        v-model="reasonDeal"
        editorStyle="height: 320px"
        @update:modelValue="updateData"
      />
    </div>
  </div>
  <div class="col-span-4 line"></div>
  <div v-if="clientType != 1" class="col-span-4">
    <h2 class="form-title-2">Administrator data</h2>
  </div>
  <div v-if="clientType != 1" class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label required" for="name">Telephone</label>
    <input
      v-model="attachPhone"
      class="input"
      placeholder="Enter Telephone"
      type="text"
      @input="updateData"
    />
  </div>
  <div v-if="clientType != 1" class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label required" for="name">Email</label>
    <input
      v-model="attachEmail"
      class="input"
      placeholder="Enter Email"
      type="email"
      @input="updateData"
    />
  </div>
  <div v-if="clientType != 1" class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label required" for="attachName">Name</label>
    <input
      id="attachName"
      v-model="attachName"
      class="input"
      placeholder="Enter His Name"
      type="text"
      @input="updateData"
    />
  </div>

  <!-- <div class="col-span-6 line" v-if="clientType != 1"></div>
  <div class="col-span-6">
    <h2 class="form-title-2">Login data to the system</h2>
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label required" for="password">Password</label>
    <input
      id="password"
      v-model="password"
      class="input"
      placeholder="Enter Password"
      type="password"
      @input="updateData"
    />
  </div> -->
</template>

<style scoped></style>
