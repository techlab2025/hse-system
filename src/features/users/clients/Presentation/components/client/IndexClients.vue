<script lang="ts" setup>
import AddItemButton from "@/components/HelpersComponents/AddItemButton.vue";
import IndexClientParams from "@/features/users/clients/Core/params/index_clients_params";
import ClientModel from "@/features/users/clients/Data/models/index_client_model";
import IndexClientController from "@/features/users/clients/Presentation/controllers/index_clients_controller";

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
import DeleteClientController from "@/features/users/clients/Presentation/controllers/delete_client_controller";
import DeleteClientParams from "@/features/users/clients/Core/params/delete_client_params";
import { ClientStatusEnum } from "@/features/users/clients/Core/enums/client_status_enum";
import DataFailed from "@/components/DataStatues/DataFailed.vue";
import { useRoute } from "vue-router";
import DialogChangeStatusClient from "@/features/users/clients/Presentation/components/client/DialogChangeStatusClient.vue";
const route = useRoute();

const clients = ref<ClientModel[] | null>([]);
const pagination = ref<PaginationModel | null>(null);
const word = ref("");
const currentPage = ref(1);
const countPerPage = ref(10);
const indexClientController = IndexClientController.getInstance();
const state = ref(indexClientController.state.value);
const type = ref<ClientStatusEnum>(
  ClientStatusEnum[route.params.type as keyof typeof ClientStatusEnum],
);

const fetchClient = async (
  query: string = "",
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
  order: number = 2,
  clientStatus: number[] = [type.value],
) => {
  const deleteClientParams = new IndexClientParams(
    query,
    pageNumber,
    perPage,
    withPage,
    order,
    clientStatus,
  );

  // console.log(deleteClientParams)

  const response = await indexClientController.getData(deleteClientParams);
  clients.value = response.value.data;
  pagination.value = response.value.pagination;
};

onMounted(() => {
  fetchClient();
});

watch(
  () => route.params.type,
  (newType) => {
    type.value = ClientStatusEnum[newType as keyof typeof ClientStatusEnum];
    fetchClient();
  },
);

const searchClient = debounce(() => {
  fetchClient(word.value);
});

const deleteClient = async (id: any) => {
  const deleteClientParams = new DeleteClientParams(id);
  await DeleteClientController.getInstance().deleteClient(deleteClientParams);
  await fetchClient();
};

const handleChangePage = (page: number) => {
  currentPage.value = page;
  fetchClient("", currentPage.value, countPerPage.value);
};

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count;
  fetchClient("", currentPage.value, countPerPage.value);
};

watch(
  () => indexClientController.state.value,
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
        src="../../../../../../../assets/images/search-normal.png"
      />
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchClient"
      />
      <span
        class="icon-remove"
        @click="
          word = '';
          searchClient();
        "
      >
        <IconRemoveInput />
      </span>
    </div>
    <div class="col-span-2 flex justify-end">
      <AddItemButton addLink="/users/clients/add" addText="Add Client" />
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
              <th scope="col">Code</th>
              <th scope="col">email</th>
              <th scope="col">commercial register number</th>
              <th scope="col">tax register number</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in clients" :key="item.id">
              <td data-label="#">
                <router-link :to="`/users/clients/edit/${item.id}`"
                  >{{ item.id }}
                </router-link>
              </td>
              <td data-label="Name">{{ item.name }}</td>
              <td data-label="Code">{{ item.code ?? "--" }}</td>
              <td data-label="email">{{ item.email }}</td>
              <td data-label="Commercial Number">
                {{ item.commercialRegisterNumber }}
              </td>
              <td data-label="Tax Number">{{ item.taxRegisterNumber }}</td>
              <td data-label="Actions">
                <DialogChangeStatusClient
                  v-if="item.clientStatus === ClientStatusEnum.Draft"
                  :clientId="item.id"
                  @clientChangeStatus="fetchClient"
                />
                <DropList
                  :branchLink="
                    item.type === 2 ? `/users/attentions/${item.id}` : ''
                  "
                  :editLink="`/users/clients/edit/${item.id}`"
                  :showLink="`/users/clients/show/${item.id}`"
                  :textBranch="item.type === 2 ? 'Attentions' : ''"
                  editText="Edit"
                  showText="show"
                  @delete="deleteClient(item.id)"
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
        :link="`/add/Client`"
        addText="Add Client"
        description="Sorry .. You have no Client .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Client"
      />
    </template>
    <template #failed>
      <DataFailed
        :link="`/add/Client`"
        addText="Add Client"
        description="Sorry .. You have no Client .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Client"
      />
    </template>
  </DataStatus>
</template>

<style scoped></style>
