<script setup lang="ts">
import ShowClintFristsec from "@/features/dashboard/users/languages/Presentation/supcomponents/ShowClientFristsec.vue";
import ShowClientSecondsec from "@/features/dashboard/users/languages/Presentation/supcomponents/ShowClientSecondsec.vue";
// import ShowClientThirdsec from "@/features/dashboard/users/languages/Presentation/supcomponents/ShowClientThridsec.vue";

import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import ShowClientParams from "@/features/dashboard/users/languages/Core/params/show_client_params";
import ShowClientController from "@/features/dashboard/users/languages/Presentation/controllers/show_client_controller";
import type ShowClientModel from "../../../Data/models/clientDetailsModel.ts";

const route = useRoute();
const router = useRouter();

const image = ref<String | null>(null);
const loader = ref<boolean>(false);
const clientDetails = ref<ShowClientModel | null>(null);
const id = ref<string>(<string>route.params.id);

const fetchServicesDetails = async () => {
  const servicesParams = new ShowClientParams(id.value);

  loader.value = true;
  const response =
    await ShowClientController.getInstance().showClient(servicesParams);
  // console.log(response.value.data);

  clientDetails.value = response.value.data;

  loader.value = false;
};

onMounted(() => {
  fetchServicesDetails();
});
</script>

<template>
  <div class="container-showclient">
    <ShowClintFristsec :data="clientDetails" />

    <div class="card">
      <Tabs value="0">
        <TabList>
          <Tab value="0">Projects</Tab>
          <!-- <Tab value="1">Financial transactions</Tab> -->
          <!-- <Tab value="2">Record interactions</Tab> -->
        </TabList>
        <TabPanels>
          <TabPanel value="0">
            <ShowClientSecondsec :data="clientDetails" />
          </TabPanel>
          <!-- <TabPanel value="1">
            <p class="m-0">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
              aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
              eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci
              velit, sed quia non numquam eius modi.
            </p>
          </TabPanel>
          <TabPanel value="2">
            <p class="m-0">
              At vero eos et accusamus et iusto odio dignissimos ducimus qui
              blanditiis praesentium voluptatum deleniti atque corrupti quos
              dolores et quas molestias excepturi sint occaecati cupiditate non
              provident, similique sunt in culpa qui officia deserunt mollitia
              animi, id est laborum et dolorum fuga. Et harum quidem rerum
              facilis est et expedita distinctio. Nam libero tempore, cum soluta
              nobis est eligendi optio cumque nihil impedit quo minus.
            </p>
          </TabPanel> -->
        </TabPanels>
      </Tabs>
    </div>

    <!-- <ShowClientThirdsec :data="clientDetails" /> -->
  </div>
</template>
