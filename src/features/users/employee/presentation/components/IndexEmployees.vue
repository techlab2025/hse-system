<script lang="ts" setup>
import AddItemButton from "@/components/HelpersComponents/AddItemButton.vue";
import IndexEmployeeParams from "@/features/users/employee/Core/params/index_employees_params";
import EmployeeModel from "@/features/users/employee/Data/models/index_employee_model";
import IndexEmployeeController from "@/features/users/employee/Presentation/controllers/index_employees_controller";

import { onMounted, ref, watch } from "vue";
import { debounce } from "@/base/Presentation/utils/debouced";
import DropList from "@/components/HelpersComponents/DropList.vue";
import Pagination from "@/components/HelpersComponents/Pagination.vue";
import type PaginationModel from "@/base/core/Models/pagination_model";
import DataStatus from "@/components/DataStatues/DataStatus.vue";
import TableLoader from "@/components/DataStatues/TableLoader.vue";
import DataEmpty from "@/components/DataStatues/DataEmpty.vue";
import IconRemoveInput from "@/components/icons/IconRemoveInput.vue";
import ExportPdf from "@/components/HelpersComponents/ExportPdf.vue";
import DeleteEmployeeController from "@/features/users/employee/Presentation/controllers/delete_employee_controller";
import DeleteEmployeeParams from "@/features/users/employee/Core/params/delete_employee_params";
import { PermissionsEnum } from "@/features/users/employee/Core/enums/permission_enum";
import PermissionBuilder from "@/components/DataStatues/PermissionBuilder.vue";

const Employees = ref<EmployeeModel[] | null>([]);
const pagination = ref<PaginationModel | null>(null);
const word = ref("");
const currentPage = ref(1);
const countPerPage = ref(10);
const indexEmployeeController = IndexEmployeeController.getInstance();
const state = ref(indexEmployeeController.state.value);

const fetchEmployee = async (
  query: string = "",
  page: number = 1,
  count: number = 10,
) => {
  const deleteEmployeeParams = new IndexEmployeeParams(query, page, count);

  // console.log(deleteEmployeeParams)

  const response = await indexEmployeeController.getData(deleteEmployeeParams);
  Employees.value = response.value.data;
  pagination.value = response.value.pagination;
};

onMounted(() => {
  fetchEmployee();
});

const searchEmployee = debounce(() => {
  fetchEmployee(word.value);
});

const deleteEmployee = async (id: any) => {
  const deleteEmployeeParams = new DeleteEmployeeParams(id);
  await DeleteEmployeeController.getInstance().deleteEmployee(
    deleteEmployeeParams,
  );
  await fetchEmployee();
};

const handleChangePage = (page: number) => {
  currentPage.value = page;
  fetchEmployee("", currentPage.value, countPerPage.value);
};

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count;
  fetchEmployee("", currentPage.value, countPerPage.value);
};

watch(
  () => indexEmployeeController.state.value,
  (newState) => {
    if (newState) {
      // console.log(newState)
      state.value = newState;
    }
  },
  {
    deep: true,
  },
);
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <img
        alt="search"
        src="../../../../../../assets/images/search-normal.png"
      />
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchEmployee"
      />
      <span
        class="icon-remove"
        @click="
          word = '';
          searchEmployee();
        "
      >
        <IconRemoveInput />
      </span>
    </div>
    <div class="col-span-2 flex justify-end">
      <permission-builder :code="[PermissionsEnum.AddEmployee]">
        <AddItemButton addLink="/users/employees/add" addText="Add Employee" />
      </permission-builder>
      <ExportPdf />
    </div>
  </div>
  <DataStatus :status="state">
    <template #success>
      <div class="table-responsive">
        <table class="main-table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">name</th>
              <th scope="col">email</th>
              <th scope="col">phone</th>
              <th scope="col">department</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in Employees" :key="item.id">
              <td data-label="#">
                <router-link :to="`/users/employees/edit/${item.id}`"
                  >{{ item.id }}
                </router-link>
              </td>
              <td data-label="Name">{{ item.name }}</td>
              <td data-label="Email">{{ item.email }}</td>
              <td data-label="Phone">{{ item.phone ?? "-" }}</td>
              <td data-label="Department">
                {{ item.department?.title ?? "-" }}
              </td>
              <td data-label="Actions">
                <DropList
                  :editLink="`/users/employees/edit/${item.id}`"
                  :linkSub="`leader-tasks/${item.id}`"
                  :passwordLink="`/users/employees/password/${item.id}`"
                  :permissionLink="`/users/employees/permission/${item.id}`"
                  :showLink="`/users/employees/show/${item.id}`"
                  editText="Edit"
                  passwordText="Update Password"
                  permissionText="Update Permission"
                  showText="show"
                  subText="Leader Tasks"
                  @delete="deleteEmployee(item.id)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination
        :pagination="pagination"
        @changePage="handleChangePage"
        @countPerPage="handleCountPerPage"
      />
    </template>
    <template #loader>
      <TableLoader :cols="3" :rows="10" />
    </template>
    <template #initial>
      <TableLoader :cols="3" :rows="10" />
    </template>
    <template #empty>
      <DataEmpty
        :link="`/add/Employee`"
        addText="Add Project Type"
        description="Sorry .. You have no project types .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Project Types"
      />
    </template>
    <template #failed>
      <DataFailed />
    </template>
  </DataStatus>
</template>

<style scoped></style>
