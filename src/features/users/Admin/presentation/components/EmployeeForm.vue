<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import ImageUser from "@/components/HelpersComponents/ImageUser.vue";
import DatePicker from "primevue/datepicker";
import type TitleInterface from "@/base/Data/Models/title_interface";
import type ShowEmployeeModel from "@/features/users/Admin/Data/models/show_employee_model";
import { convertToBase64 } from "@/base/Presentation/utils/convert_to_base_64";
import IndexCountryController from "@/features/dashboard/settings/country/Presentation/controllers/index_country_controller";
import IndexCountryParams from "@/features/dashboard/settings/country/Core/params/index_country_params";
import IndexGovernorateController from "@/features/dashboard/settings/governorate/Presentation/controllers/index_governorate_controller";
import IndexGovernoratesParams from "@/features/dashboard/settings/governorate/Core/params/index_governorate_params";
import IndexCitiesParams from "@/features/dashboard/settings/city/Core/params/index_city_params";
import IndexCityController from "@/features/dashboard/settings/city/Presentation/controllers/index_city_controller";
import MultiImagesInput from "@/components/HelpersComponents/MultiImagesInput.vue";
import IndexDepartmentController from "@/features/dashboard/settings/department/Presentation/controllers/index_departments_controller";
import IndexDepartmentsParams from "@/features/dashboard/settings/department/Core/params/index_departments_params";
import IndexPermitController from "@/features/dashboard/settings/permits/Presentation/controllers/index_permits_controller";
import IndexPermitsParams from "@/features/dashboard/settings/permits/Core/params/index_permits_params";
import Select from "primevue/select";
import CustomSelectInput from "@/components/HelpersComponents/CustomSelectInput.vue";
import AttachmentParams from "@/features/users/employee/Core/params/attatchment_params";
import ContactParams from "@/features/users/employee/Core/params/contract_params";
import AddEmployeeParams from "@/features/users/employee/Core/params/add_employee_params";
import EditEmployeeParams from "@/features/users/employee/Core/params/edit_employee_params";
import IndexAcademicDegreeController from "@/features/dashboard/settings/academicdegree/Presentation/controllers/index_Academic_Degree_controller";
import IndexAcademicDegreesParams from "@/features/dashboard/settings/academicdegree/Core/params/index_Academic_Degree_params";
import IndexHierarchyController from "@/features/dashboard/projects/herikaly/Presentation/controllers/index_hierarchies.controller";
import IndexHierarchyParams from "@/features/dashboard/projects/herikaly/Core/params/index_hierarchy_params";
import { MemberTypeEnum } from "@/features/users/employee/Core/enums/member_type_enum";

const emit = defineEmits(["update:updateData"]);
const props = defineProps<{
  EmployeeData: ShowEmployeeModel;
}>();
const name = ref(props.EmployeeData?.name);
const EmployeeType = ref(1);
const email = ref(props.EmployeeData?.email);
const image = ref<string>(props.EmployeeData?.image);
const militryStatus = ref<string>(props.EmployeeData?.maritalStatus);
const memberType = ref<MemberTypeEnum>(
  props.EmployeeData?.memberType ?? MemberTypeEnum.TEAM_MEMBER,
);
const militryStatuses = ref<{ title: string; value: number }[]>([
  {
    title: "Single",
    value: 1,
  },
  {
    title: "Married",
    value: 2,
  },
]);
const gender = ref<{ title: string; value: number }>(
  props.EmployeeData?.gender,
);
const password = ref<string>(props.EmployeeData?.password);
const genders = ref<{ title: string; value: number }[]>([
  {
    title: "Male",
    value: 1,
  },
  {
    title: "Female",
    value: 2,
  },
]);
const cardNumber = ref<string>(props.EmployeeData?.crudNumber);
const endDate = ref(props.EmployeeData?.endDateCrud);
const academicDegree = ref<string>(props.EmployeeData?.acdemicDegree);
// const academicDegrees = ref<TitleInterface[]>([]);
const employee_id = ref(props.EmployeeData?.id);
const phone = ref(props.EmployeeData?.phone);
const images = ref<string[]>([]);
const address = ref(props.EmployeeData?.address);
const sponsorship = ref<string>(props.EmployeeData?.sponsorship);
const sponsorships = ref<{ title: string; value: number }[]>([
  {
    title: "inside",
    value: 1,
  },
  {
    title: "outside",
    value: 2,
  },
]);
const hierarchyLevels = ref<
  { value: TitleInterface | null; options: TitleInterface[] }[]
>([{ value: null, options: [] }]);
const country = ref<TitleInterface | null>(props.EmployeeData?.country);
const countries = ref<TitleInterface[]>([]);
const city = ref<TitleInterface | null>(props.EmployeeData?.city);
const cities = ref<TitleInterface[]>([]);
const governorate = ref<TitleInterface | null>(props.EmployeeData?.governorate);
const governorates = ref<TitleInterface[]>([]);
const department = ref<TitleInterface | null>(props.EmployeeData?.department);
const departments = ref<TitleInterface[]>([]);
const permit = ref<TitleInterface | null>(props.EmployeeData?.permits);
const permits = ref<TitleInterface[]>([]);
const contractExpirationDate = ref(
  props.EmployeeData?.contracts.contractExpirationDate,
);
const contractDate = ref(props.EmployeeData?.contracts.contractDate);
const appointmentDate = ref(props.EmployeeData?.contracts.appointmentDate);
const insurance = ref(props.EmployeeData?.contracts.insurance);
const suits = ref(props.EmployeeData?.contracts.suits);
const salary = ref(props.EmployeeData?.contracts.salary);
const housing = ref(props.EmployeeData?.contracts.housing);
const commissions = ref(props.EmployeeData?.contracts.commission);
const incentives = ref(props.EmployeeData?.contracts.incentives);
const covenantFinance = ref(props.EmployeeData?.contracts.covenantFinance);
const annualTicket = ref(props.EmployeeData?.contracts.annualTickets);
const transfer = ref(props.EmployeeData?.contracts.transfers);
const annualVacation = ref(props.EmployeeData?.annualVacations);
const permissibleLimit = ref(props.EmployeeData?.workPerWeeks);
const toWrok = ref(props.EmployeeData?.toWork);
const fromWork = ref(props.EmployeeData?.fromWork);
const indexHierarchyController = IndexHierarchyController.getInstance();
const hierarchyParams = new IndexHierarchyParams(null, "", 1, 0);
const hierarchy = ref<TitleInterface | null>(null);
watch(
  () => props.EmployeeData,
  async (newEmployeeData) => {
    // console.log(newEmployeeData);
    name.value = newEmployeeData?.name;
    email.value = newEmployeeData?.email;
    image.value = newEmployeeData?.image;
    militryStatus.value =
      newEmployeeData?.maritalStatus == 1
        ? { title: "Single", value: 1 }
        : { title: "Married", value: 2 };
    gender.value =
      newEmployeeData?.gender == 1
        ? { title: "Male", value: 1 }
        : { title: "Female", value: 2 };
    password.value = newEmployeeData?.password;
    cardNumber.value = newEmployeeData?.crudNumber;
    endDate.value = newEmployeeData?.endDateCrud;
    academicDegree.value = newEmployeeData?.acdemicDegree;
    phone.value = newEmployeeData?.phone;
    address.value = newEmployeeData?.address;
    sponsorship.value =
      newEmployeeData?.sponsorship == 1
        ? { title: "inside", value: 1 }
        : { title: "outside", value: 2 };
    country.value = newEmployeeData?.country;
    city.value = newEmployeeData?.city;
    governorate.value = newEmployeeData?.governorate;
    department.value = newEmployeeData?.department;
    permit.value = newEmployeeData?.permits;
    contractExpirationDate.value = newEmployeeData?.contracts?.expirationDate;
    contractDate.value = newEmployeeData?.contracts?.contractDate;
    appointmentDate.value = newEmployeeData?.contracts?.appointmentDate;
    insurance.value = newEmployeeData?.contracts?.insurance;
    suits.value = newEmployeeData?.contracts?.suits;
    salary.value = newEmployeeData?.contracts?.salary;
    housing.value = newEmployeeData?.contracts?.housing;
    commissions.value = newEmployeeData?.contracts?.commission;
    incentives.value = newEmployeeData?.contracts?.incentives;
    covenantFinance.value = newEmployeeData?.contracts?.covenantFinance;
    annualTicket.value = newEmployeeData?.contracts?.annualTickets;
    transfer.value = newEmployeeData?.contracts?.transfers;
    annualVacation.value = newEmployeeData?.annualVacations;
    permissibleLimit.value = newEmployeeData?.workPerWeeks;
    hierarchy.value = newEmployeeData?.hierarchys!;
    updateHierarchy(hierarchy.value, 0);
    toWrok.value = newEmployeeData?.toWork;
    fromWork.value = newEmployeeData?.fromWork;

    if (newEmployeeData?.country?.id != null) {
      indexGovernorateParams.value = new IndexGovernoratesParams(
        newEmployeeData?.country?.id!,
        "",
        1,
        100,
        0,
      );
    }

    if (newEmployeeData?.governorate?.id != null) {
      indexCityParams.value = new IndexCitiesParams(
        newEmployeeData?.governorate?.id!,
        "",
        1,
        100,
        0,
      );
    }

    if (newEmployeeData.department?.id != null) {
      permitsParams.value = new IndexPermitsParams(
        null,
        "",
        1,
        100,
        0,
        newEmployeeData.department?.id!,
      );
    }
    updateData();
  },
);

onMounted(async () => updateData());

const updateCountry = async (data: TitleInterface) => {
  country.value = data;
  governorate.value = null;
  city.value = null;
  indexGovernorateParams.value = new IndexGovernoratesParams(
    data.id!,
    "",
    1,
    100,
    0,
  );
  updateData();
};

//fetch countries
const indexCountryController = IndexCountryController.getInstance();
const indexCountryParams = ref<IndexCountryParams>(
  new IndexCountryParams("", 1, 100, 0),
);

//fetch governates
const indexGovernorateController = IndexGovernorateController.getInstance();
const indexGovernorateParams = ref<IndexGovernoratesParams | null>();

const updateGovernorate = async (data: TitleInterface) => {
  governorate.value = data;
  city.value = null;
  indexCityParams.value = new IndexCitiesParams(data.id!, "", 1, 100, 0);
  updateData();
};

// fetch cities
const indexCityController = IndexCityController.getInstance();
const indexCityParams = ref<IndexCitiesParams | null>(null);

const updateCity = async (data: TitleInterface) => {
  city.value = data;
  city.value = data;
  updateData();
};

//fetch departments
const indexDepartmentController = IndexDepartmentController.getInstance();
const departmentParams = new IndexDepartmentsParams("", 1, 100, 0);

const academicDegreeController = IndexAcademicDegreeController.getInstance();
const academicParams = new IndexAcademicDegreesParams("", 1, 100, 0);

const permitsController = IndexPermitController.getInstance();
const permitsParams = ref<IndexPermitsParams | null>(null);

const updateDepartment = async (data: TitleInterface) => {
  department.value = data;
  permit.value = [];
  permitsParams.value = new IndexPermitsParams(null, "", 1, 100, 0, data.id!);

  updateData();
};

const updatePermits = async (data: TitleInterface) => {
  permit.value = data;
  updateData();
};

const updateImages = async (files: File[]) => {
  images.value = (await convertToBase64(files)) as string[];
  updateData();
};

const handleImage = async (file: String) => {
  // image.value = (await convertToBase64(file)) as string;
  image.value = file;
  updateData();
};

const updateHierarchy = async (data: TitleInterface, index: number) => {
  hierarchy.value = data;

  // If there's a subtitle or children, add a new level
  if (data.subtitle || data.children) {
    // Ensure we don't add duplicate levels
    if (hierarchyLevels.value.length <= index + 1) {
      hierarchyLevels.value.push({ value: null, options: data.children || [] });
    }
    hierarchyParams.parentId = data.id!;
    updateData();
  } else {
    // Remove any levels beyond this one if no subtitle or children
    hierarchyLevels.value.splice(index + 1);
    hierarchy.value = data;
    updateData();
  }
};

const updateData = () => {
  const contractParams = new ContactParams(
    contractExpirationDate.value,
    contractDate.value,
    appointmentDate.value,
    insurance.value,
    suits.value,
    salary.value,
    housing.value,
    commissions.value,
    incentives.value,
    covenantFinance.value,
    annualTicket.value,
    transfer.value,
  );

  // console.log(contractParams, 'contractParams')

  const attachmentsParams = images.value.map((image) => {
    return new AttachmentParams(image, null);
  });
  console.log(hierarchy.value?.id, "hierarchy.value");
  emit(
    "update:updateData",
    props.EmployeeData?.id != null
      ? new EditEmployeeParams({
          id: props.EmployeeData?.id,
          name: name.value,
          email: email.value,
          password: password.value,
          image: image.value,
          address: address.value,
          academicDegreeId: academicDegree.value?.id,
          countryId: country.value?.id,
          cityId: city.value?.id,
          governorateId: governorate.value?.id,
          departmentId: department.value?.id,
          permits: permit.value?.map((permit) => permit.id),
          gender: gender.value?.value,
          crudNumber: cardNumber.value,
          endDateCrud: endDate.value,
          sponsorship: sponsorship.value?.value,
          fromWork: fromWork.value,
          toWork: toWrok.value,
          annualVacations: annualVacation.value,
          workPerWeeks: permissibleLimit.value,
          contracts: contractParams,
          attachments: attachmentsParams,
          phone: phone.value,
          hierarchyId: hierarchy.value?.id,
          memberType: memberType.value,
        })
      : new AddEmployeeParams({
          name: name.value,
          email: email.value,
          password: password.value,
          image: image.value,
          address: address.value,
          academicDegreeId: academicDegree.value?.id,
          maritalStatus: militryStatus?.value?.value,
          countryId: country.value?.id,
          cityId: city.value?.id,
          governorateId: governorate.value?.id,
          departmentId: department.value?.id,
          permits: permit.value?.map((permit) => permit.id),
          gender: gender.value?.value,
          crudNumber: cardNumber.value,
          endDateCrud: endDate.value,
          sponsorship: sponsorship.value?.value,
          fromWork: fromWork.value,
          toWork: toWrok.value,
          annualVacations: annualVacation.value,
          workPerWeeks: permissibleLimit.value,
          contracts: contractParams,
          attachments: attachmentsParams,
          phone: phone.value,
          hierarchyId: hierarchy.value?.id,
          memberType: memberType.value,
        }),
  );
};

const updateTeamMember = () => {
  updateData();
};
</script>

<template>
  <div class="col-span-6">
    <ImageUser :initialImage="image" @update:image="handleImage" />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <h4 class="input-label">Member type</h4>

    <div class="project-new-old-tabs">
      <div class="tab">
        <input
          id="is_new"
          v-model="memberType"
          :value="MemberTypeEnum.TEAM_MEMBER"
          class="input"
          name="new"
          type="radio"
          @change="updateTeamMember"
        />
        <label class="input-label" for="is_new">Team Member</label>
      </div>
      <div class="tab">
        <input
          id="is_old"
          v-model="memberType"
          :value="MemberTypeEnum.LEAD"
          class="input"
          name="new"
          type="radio"
          @change="updateTeamMember"
        />
        <label class="input-label" for="is_old">Leader</label>
      </div>
    </div>
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label required" for="title"> Employee name</label>
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
    <label class="input-label" for="title"> Card number</label>
    <input
      id="title"
      v-model="cardNumber"
      class="input"
      placeholder="Enter title"
      type="text"
      @input="updateData"
    />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label" for="title">End Date</label>
    <DatePicker
      v-model="endDate"
      class="date"
      fluid
      iconDisplay="input"
      placeholder="choose date"
      showIcon
      @update:modelValue="updateData"
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label" for="title">gender</label>
    <Select
      v-model="gender"
      :options="genders"
      class="input-select"
      optionLabel="title"
      placeholder="Select a gender"
      @update:modelValue="updateData"
    />
  </div>
  <!--  <div class="col-span-4 md:col-span-2 input-wrapper">-->
  <!--    <CustomSelectInput-->
  <!--      :modelValue="academicDegree"-->
  <!--      :controller="academicDegreeController"-->
  <!--      :params="academicParams"-->
  <!--      label="academic degree"-->
  <!--      placeholder="Select a Country"-->
  <!--      @update:modelValue="updateData"-->
  <!--    />-->
  <!--  </div>-->
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label required" for="phone">phone</label>
    <input
      id="phone"
      v-model="phone"
      class="input"
      placeholder="Enter phone"
      type="text"
      @input="updateData"
    />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label" for="title">Militry Status</label>
    <Select
      v-model="militryStatus"
      :options="militryStatuses"
      class="input-select"
      optionLabel="title"
      placeholder="Select a Militry Status"
      @update:modelValue="updateData"
    />
  </div>
  <div class="col-span-4 input-wrapper">
    <label class="input-label" for="title"
      >His address and place of residence</label
    >
    <input
      id="address"
      v-model="address"
      class="input"
      optionLabel="address"
      @input="updateData"
    />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <CustomSelectInput
      :controller="indexCountryController"
      :modelValue="country"
      :options="countries"
      :params="indexCountryParams"
      label="Country"
      placeholder="Select a Country"
      @update:modelValue="updateCountry"
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <CustomSelectInput
      :controller="indexGovernorateController"
      :modelValue="governorate"
      :options="governorates"
      :params="indexGovernorateParams"
      label="Governorate"
      placeholder="Select a Governorate"
      @update:modelValue="updateGovernorate"
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <CustomSelectInput
      :controller="indexCityController"
      :modelValue="city"
      :options="cities"
      :params="indexCityParams"
      label="City"
      placeholder="Select a City"
      @update:modelValue="updateCity"
    />
  </div>
  <div class="col-span-6 line"></div>
  <div
    v-for="(level, index) in hierarchyLevels"
    :key="index"
    class="col-span-4 md:col-span-2 input-wrapper"
  >
    <label class="form-title-2">Hierarchy Item {{ index + 1 }}</label>
    <CustomSelectInput
      :controller="indexHierarchyController"
      :modelValue="level.value"
      :options="level.options"
      :params="hierarchyParams"
      label="Hierarchy"
      placeholder="Select a Hierarchy Item"
      @update:modelValue="(data) => updateHierarchy(data, index)"
    />
  </div>

  <div class="col-span-6">
    <label for="">Appointment papers</label>
    <MultiImagesInput :initialImages="images" @update:images="updateImages" />
  </div>

  <div class="col-span-6 line"></div>
  <div class="col-span-6">
    <h2 class="form-title-2">Login data to the system</h2>
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
  <div v-if="!employee_id" class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label required" for="password">Password</label>
    <input
      id="password"
      v-model="password"
      class="input"
      placeholder="Enter Password"
      type="password"
      @input="updateData"
    />
  </div>
  <div class="col-span-6 line"></div>
  <div class="col-span-6">
    <h2 class="form-title-2">Practical employee information</h2>
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label" for="password">Employee sponsorship</label>
    <Select
      v-model="sponsorship"
      :options="sponsorships"
      class="input-select"
      optionLabel="title"
      placeholder="Select a sponsorship"
      @update:modelValue="updateData"
    />
  </div>

  <div class="col-span-2">
    <div class="col-span-4 md:col-span-2 input-wrapper">
      <CustomSelectInput
        :controller="indexDepartmentController"
        :modelValue="department"
        :options="[]"
        :params="departmentParams"
        label="department"
        placeholder="Select a Department"
        @update:modelValue="updateDepartment"
      />
    </div>
  </div>
  <div class="col-span-2">
    <div class="col-span-4 md:col-span-2 input-wrapper">
      <CustomSelectInput
        :controller="permitsController"
        :modelValue="permit"
        :options="permits"
        :params="permitsParams"
        :type="2"
        label="Permit"
        placeholder="Select a permit"
        @update:modelValue="updatePermits"
      />
    </div>
  </div>
  <div class="col-span-6 line"></div>
  <div class="col-span-6">
    <h2 class="form-title-2">Contracting information</h2>
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label" for="">Contract expiration date</label>
    <DatePicker
      v-model="contractExpirationDate"
      class="date"
      fluid
      iconDisplay="input"
      placeholder="choose date"
      showIcon
      @update:modelValue="updateData"
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label" for="">Contract date</label>
    <DatePicker
      v-model="contractDate"
      class="date"
      fluid
      iconDisplay="input"
      placeholder="choose date"
      showIcon
      @update:modelValue="updateData"
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label" for="">Appointment date</label>
    <DatePicker
      v-model="appointmentDate"
      class="date"
      fluid
      iconDisplay="input"
      placeholder="choose date"
      showIcon
      @update:modelValue="updateData"
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label" for="">Insurance</label>
    <input
      id="title"
      v-model="insurance"
      class="input"
      placeholder="Enter Insurance"
      type="text"
      @input="updateData"
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label" for="">Suits</label>
    <input
      id="title"
      v-model="suits"
      class="input"
      placeholder="Enter Suits"
      type="text"
      @input="updateData"
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label" for="">Salary</label>
    <input
      id="title"
      v-model="salary"
      class="input"
      placeholder="Enter Salary"
      type="text"
      @input="updateData"
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label" for="">Housing</label>
    <input
      id="title"
      v-model="housing"
      class="input"
      placeholder="Enter Housing"
      type="text"
      @input="updateData"
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label" for="">Commissions</label>
    <input
      id="title"
      v-model="commissions"
      class="input"
      placeholder="Enter Commissions"
      type="text"
      @input="updateData"
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label" for="">Incentives</label>
    <input
      id="title"
      v-model="incentives"
      class="input"
      placeholder="Enter Incentives"
      type="text"
      @input="updateData"
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label" for="">Covenant Finance</label>
    <input
      id="title"
      v-model="covenantFinance"
      class="input"
      placeholder="Enter Covenant Finance"
      type="text"
      @input="updateData"
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label" for="">Annual tickets</label>
    <input
      id="title"
      v-model="annualTicket"
      class="input"
      placeholder="Enter Annual tickets"
      type="text"
      @input="updateData"
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label" for="">transfer</label>
    <input
      id="title"
      v-model="transfer"
      class="input"
      placeholder="Enter transfer"
      type="text"
      @input="updateData"
    />
  </div>
  <div class="col-span-6 line"></div>
  <div class="col-span-6">
    <h2 class="form-title-2">Working hours system</h2>
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label" for=""
      >Attendance and departure times from</label
    >
    <DatePicker
      id="title"
      v-model="toWrok"
      placeholder="Enter from"
      range
      timeOnly
      type="text"
      @update:model-value="updateData"
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label" for="">Attendance and departure times to</label>
    <DatePicker
      id="title"
      v-model="fromWork"
      placeholder="Enter to"
      range
      timeOnly
      type="text"
      @update:model-value="updateData"
    />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label" for=""
      >The permissible limit for absence without deduction</label
    >
    <input
      id="title"
      v-model="permissibleLimit"
      class="input"
      placeholder="Enter permissible limit"
      type="text"
      @input="updateData"
    />
  </div>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label class="input-label" for="">Annual vacations</label>
    <input
      id="title"
      v-model="annualVacation"
      class="input"
      placeholder="Enter Annual vacations"
      type="text"
      @input="updateData"
    />
  </div>
</template>

<style scoped></style>
