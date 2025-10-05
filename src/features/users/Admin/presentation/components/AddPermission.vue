<script lang="ts" setup>
import CustomSelectInput from "@/components/HelpersComponents/CustomSelectInput.vue";
import { onMounted, ref, watch } from "vue";
import TitleInterface from "@/base/Data/Models/title_interface";
import { PermissionsEnum } from "@/features/users/employee/Core/enums/permission_enum";
// import {validateRequiredFields} from "@/base/Presentation/utils/validate_required_fields";
// import {validationEnum} from "@/base/Presentation/utils/validation_enum";
// import validationDialogService from "@/base/Presentation/utils/validationService";
import PermissionParams from "@/features/users/employee/Core/params/add_permission_params";
import AddPermissionController from "@/features/users/employee/Presentation/controllers/add_permission_controller";
import { useRoute, useRouter } from "vue-router";
import IconSave from "@/components/icons/IconSave.vue";
import PrimaryButton from "@/components/HelpersComponents/PrimaryButton.vue";
import ShowEmployeePermissionController from "@/features/users/employee/Presentation/controllers/show_permission_controller";
import ShowEmployeePermissionParams from "@/features/users/employee/Core/params/show_permission_params";

const permission = ref<TitleInterface[]>([]);
const AllOffers = ref<boolean>(true);
const AllProjects = ref<boolean>(true);
const IsMaster = ref<boolean>(false);
const mention = ref<boolean>(false);
const router = useRouter();
const route = useRoute();
const employeeId = ref<number>(Number(route.params.id));

const permissions = ref<TitleInterface[]>([
  new TitleInterface({
    id: 1,
    title: "All In Offers",
    subtitle: PermissionsEnum.AllOffers,
  }),
  new TitleInterface({
    id: 2,
    title: "Add Offer",
    subtitle: PermissionsEnum.AddOffer,
  }),
  new TitleInterface({
    id: 33,
    title: "Fetch Offers",
    subtitle: PermissionsEnum.FetchProjects,
  }),
  new TitleInterface({
    id: 34,
    title: "Offers Report",
    subtitle: PermissionsEnum.ProjectReports,
  }),
  new TitleInterface({
    id: 35,
    title: "Client request Report",
    subtitle: PermissionsEnum.ClientRequestReports,
  }),
  new TitleInterface({
    id: 36,
    title: "Add Absence",
    subtitle: PermissionsEnum.AddAbsence,
  }),
  new TitleInterface({
    id: 37,
    title: "Fetch Absences",
    subtitle: PermissionsEnum.FetchAbsence,
  }),
  new TitleInterface({
    id: 38,
    title: "Hr",
    subtitle: PermissionsEnum.HR,
  }),

  new TitleInterface({
    id: 3,
    title: "Export Invoice",
    subtitle: PermissionsEnum.ExportInvoice,
  }),
  new TitleInterface({
    id: 4,
    title: "Invoices",
    subtitle: PermissionsEnum.Invoices,
  }),
  new TitleInterface({
    id: 5,
    title: "Client Request",
    subtitle: PermissionsEnum.ClientRequest,
  }),
  new TitleInterface({
    id: 6,
    title: "Add Client Request",
    subtitle: PermissionsEnum.AddClientRequest,
  }),
  new TitleInterface({
    id: 7,
    title: "Convert Offer",
    subtitle: PermissionsEnum.ConvertOffer,
  }),
  new TitleInterface({
    id: 8,
    title: "IconSetting",
    subtitle: PermissionsEnum.Setting,
  }),
  new TitleInterface({
    id: 9,
    title: "Website",
    subtitle: PermissionsEnum.Website,
  }),
  new TitleInterface({
    id: 10,
    title: "Clients",
    subtitle: PermissionsEnum.Clients,
  }),
  new TitleInterface({
    id: 11,
    title: "Change Status Client",
    subtitle: PermissionsEnum.ChangeStatusClient,
  }),
  new TitleInterface({
    id: 12,
    title: "Employees",
    subtitle: PermissionsEnum.Employees,
  }),
  new TitleInterface({
    id: 13,
    title: "Add Employee",
    subtitle: PermissionsEnum.AddEmployee,
  }),
  new TitleInterface({
    id: 14,
    title: "Draft Client",
    subtitle: PermissionsEnum.DraftClient,
  }),
  new TitleInterface({
    id: 15,
    title: "All Project Actions",
    subtitle: PermissionsEnum.AllProjectActions,
  }),
  new TitleInterface({
    id: 16,
    title: "Edit Project",
    subtitle: PermissionsEnum.EditProject,
  }),
  new TitleInterface({
    id: 17,
    title: "Delete Offer",
    subtitle: PermissionsEnum.DeleteProject,
  }),
  new TitleInterface({
    id: 18,
    title: "Hold Offer",
    subtitle: PermissionsEnum.HoldProject,
  }),
  new TitleInterface({
    id: 19,
    title: "Cancel Offer",
    subtitle: PermissionsEnum.CancelProject,
  }),
  new TitleInterface({
    id: 21,
    title: "Export Offer",
    subtitle: PermissionsEnum.ExportProject,
  }),
  new TitleInterface({
    id: 22,
    title: " Invoices For Project",
    subtitle: PermissionsEnum.InvoicesProject,
  }),
  new TitleInterface({
    id: 23,
    title: "Group Invoice For Project",
    subtitle: PermissionsEnum.GroupInvoiceProject,
  }),
  new TitleInterface({
    id: 24,
    title: "Backstage offer",
    subtitle: PermissionsEnum.BackStageProject,
  }),
  new TitleInterface({
    id: 25,
    title: "Change Status Project ",
    subtitle: PermissionsEnum.ChangeStatusProject,
  }),
  new TitleInterface({
    id: 26,
    title: "Revised Project",
    subtitle: PermissionsEnum.RevisedProject,
  }),
  new TitleInterface({
    id: 27,
    title: "Drop Menu Project",
    subtitle: PermissionsEnum.DropMenuProject,
  }),
  new TitleInterface({
    id: 28,
    title: "Unlock Offer",
    subtitle: PermissionsEnum.UnlockProject,
  }),
  new TitleInterface({
    id: 29,
    title: "Reject Project",
    subtitle: PermissionsEnum.RejectProject,
  }),
  new TitleInterface({
    id: 30,
    title: "Accept  / Lpo Project",
    subtitle: PermissionsEnum.AcceptProject,
  }),
  new TitleInterface({
    id: 39,
    title: "Project",
    subtitle: PermissionsEnum.FinalProjects,
  }),
  new TitleInterface({
    id: 40,
    title: "Employee Plan",
    subtitle: PermissionsEnum.EmployeePlan,
  }),
  new TitleInterface({
    id: 41,
    title: "Plan",
    subtitle: PermissionsEnum.Plans,
  }),
  new TitleInterface({
    id: 41,
    title: "All In Projects",
    subtitle: PermissionsEnum.Plans,
  }),
  new TitleInterface({
    id: 42,
    title: "Requirements",
    subtitle: PermissionsEnum.Requirements,
  }),
  new TitleInterface({
    id: 48,
    title: "Assign To Project",
    subtitle: PermissionsEnum.AssignToProject,
  }),
  new TitleInterface({
    id: 49,
    title: "Study Project",
    subtitle: PermissionsEnum.StudyProject,
  }),
  new TitleInterface({
    id: 50,
    title: "Quick Search",
    subtitle: PermissionsEnum.QuickSearch,
  }),
  new TitleInterface({
    id: 53,
    title: "Change LPO To Confirmed",
    subtitle: PermissionsEnum.ChangeLpoToConfirmed,
  }),
  new TitleInterface({
    id: 54,
    title: "Project Which You mention on it",
    subtitle: PermissionsEnum.Mention,
  }),
  // new TitleInterface({
  //   id: 51,
  //   title: "Finish Study Project",
  //   subtitle: PermissionsEnum.FinishStudy,
  // }),
  // new TitleInterface({
  //   id: 52,
  //   title: "Ready To Export",
  //   subtitle: PermissionsEnum.ReadyToExport,
  // }),
]);

const setPermissions = async (data: TitleInterface) => {
  permission.value = [];
  permission.value = data;
  console.log(permission.value, "permission");
  // console.log(data, "data");
};

const addPermissionEmployee = async () => {
  const permissionParams = new PermissionParams(
    employeeId.value,
    permission.value?.map((e) => e.subtitle),
    AllOffers.value == true ? 1 : 2,
    IsMaster.value == true ? 1 : 2,
    AllProjects.value == true ? 1 : 2,
    mention.value == true ? 1 : 2,
  );

  await AddPermissionController.getInstance().addPermission(
    permissionParams,
    router,
  );
};

const showEmployeePermissionController =
  ShowEmployeePermissionController.getInstance();

const state = ref(showEmployeePermissionController.state.value);

const fetchEmployeePermission = async () => {
  await showEmployeePermissionController.ShowEmployeePermission(
    new ShowEmployeePermissionParams(employeeId.value),
  );
};

onMounted(() => {
  fetchEmployeePermission();
});

watch(
  () => showEmployeePermissionController.state.value,
  (newValue) => {
    if (newValue) {
      state.value = newValue;

      permission.value = newValue.data?.permission;
      AllOffers.value = newValue.data?.allOffer;
      IsMaster.value = newValue.data?.isMaster!;

      // permission.value;
      console.log(state.value);
    }
  },
);
</script>

<template>
  <form
    class="grid grid-cols-1 md:grid-cols-4 gap-4"
    @submit.prevent="addPermissionEmployee"
  >
    <div class="col-span-4 md:col-span-2 input-wrapper">
      <CustomSelectInput
        id="permissions"
        :modelValue="permission"
        :staticOptions="permissions"
        :type="2"
        label="Permissions"
        placeholder="Select Permissions"
        @update:modelValue="setPermissions"
      />
    </div>
    <div class="col-span-2 md:col-span-1 input-wrapper">
      <span>All Offers</span>
      <div class="input-checkbox-wrapper justify-end">
        <input
          id="offers"
          v-model="AllOffers"
          :value="1"
          checked
          class="input"
          name="project_contracted"
          type="checkbox"
        />
        <label class="input-label" for="offers">Yes</label>
      </div>
    </div>
    <div class="col-span-2 md:col-span-1 input-wrapper">
      <span>All Project</span>
      <div class="input-checkbox-wrapper justify-end">
        <input
          id="projects"
          v-model="AllProjects"
          :checked="AllProjects === 1"
          :value="1"
          checked
          class="input"
          name="all_project"
          type="checkbox"
        />
        <label class="input-label" for="projects">Yes</label>
      </div>
    </div>

    <div class="col-span-2 md:col-span-1 input-wrapper">
      <span>is Master</span>
      <div class="input-checkbox-wrapper justify-end">
        <input
          id="master"
          v-model="IsMaster"
          :checked="IsMaster === 1"
          :value="1"
          class="input"
          name="master"
          type="checkbox"
        />
        <label class="input-label" for="master">Yes</label>
      </div>
    </div>
    <!--    <div class="col-span-2 md:col-span-1 input-wrapper">-->
    <!--      <span>Can see Project Mention in offer</span>-->
    <!--      <div class="input-checkbox-wrapper justify-end">-->
    <!--        <input-->
    <!--          id="mention"-->
    <!--          v-model="mention"-->
    <!--          :checked="mention === 1"-->
    <!--          :value="1"-->
    <!--          class="input"-->
    <!--          name="mention"-->
    <!--          type="checkbox"-->
    <!--        />-->
    <!--        <label class="input-label" for="mention">Yes</label>-->
    <!--      </div>-->
    <!--    </div>-->

    <div class="col-span-4">
      <div class="flex justify-end">
        <PrimaryButton
          :icon="IconSave"
          :title="'Save'"
          :type="'submit'"
          class="w-[20%]"
        />
      </div>
    </div>
  </form>
</template>

<style scoped></style>
