<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

import FilesOrganization from "@/assets/images/FilesOrganization.png";
import OrganizationSettingIcon from "@/assets/images/OrganizationSettingIcon.png";
import PersonalData from "@/assets/images/PersonalData.png";
import SettingLocation from "@/assets/images/SettingLocation.png";

import { RouterEnum } from "../SettingEnum/SettingEnum";

interface OrganizationSettingItem {
  id: RouterEnum;
  title: string;
  icon: string;
  description: string;
  routes: { route: string, Name: string }[];
}
const router = useRouter();

const OrganizationSetting = ref<OrganizationSettingItem[]>([
  {
    id: RouterEnum.ORGANIZATION,
    title: "organization setting",
    icon: FilesOrganization,
    description:
      "partners . projects . certifications . templet . methods . contractors . management . roles",
    routes: [
      {
        route: "/organization/partner",
        Name: "partners",
      },
      {
        route: "/organization/projects",
        Name: "projects",
      },
      {
        route: "/organization/certificate",
        Name: "certifications",
      },
      {
        route: "/organization/template",
        Name: "templates",
      },
      {
        route: "/organization/methods",
        Name: "methods",
      },
      {
        route: "/organization/contractor",
        Name: "contractors",
      },
      {
        route: "/organization/equipment-mangement/all-observatin",
        Name: "management",
      },
      {
        route: "/organization/role",
        Name: "roles",
      }

    ],

  },
  {
    id: RouterEnum.OPERATION,
    title: "operation setting",
    icon: OrganizationSettingIcon,
    description:
      "hazard type . types of observation . hazard . factor . factors item",
    routes: [
      {
        route: "/organization/hazard-type",
        Name: "hazard-type",
      },
      {
        route: "/organization/equipment-mangement/observation",
        Name: "observation",
      },
      {
        route: "/organization/equipment-mangement/hazard",
        Name: "hazard",
      },
      {
        route: "/organization/factory",
        Name: "factor",
      },
      {
        route: "/organization/factories-items",
        Name: "factor-item",
      },

    ],

  },
  {
    id: RouterEnum.EMPLOYEES,
    title: "employees",
    icon: PersonalData,
    description: "organization employee . hierarchy . team",
    routes: [
      {
        route: "/organization/organization-employee",
        Name: "employees",
      },
      {
        route: "/organization/herikaly",
        Name: "hierarchy",
      },
      {
        route: "/organization/team",
        Name: "team",
      }
    ],
  },
  {
    id: RouterEnum.LOCATION,
    title: "location setting",
    icon: SettingLocation,
    description: "state . country . city . location . zones",
    routes: [
      {
        route: "/organization/states",
        Name: "states",
      },
      {
        route: "/organization/countries",
        Name: "countries",
      },
      {
        route: "/organization/cities",
        Name: "cities",
      },
      {
        route: "/organization/areas",
        Name: "locations",
      },
      {
        route: "/organization/project-zone",
        Name: "zones",
      },
    ],
  },
]);

const selectedRoutesType = ref<RouterEnum | null>(RouterEnum.ORGANIZATION);

const selectedCard = computed(() => {
  return OrganizationSetting.value.find(
    (item) => item.id === selectedRoutesType.value
  );
});

const handleCardClick = (id: RouterEnum) => {
  selectedRoutesType.value = id;
};


</script>

<template>
  <div class="organization-setting">
    <div class="organization-setting-container">
      <div v-for="(card, index) in OrganizationSetting" :key="index" class="organization-setting-card"
        :class="{ active: selectedRoutesType === card.id }" @click="handleCardClick(card.id)">
        <img :src="card.icon" :alt="card.title" />
        <div class="card-content">
          <p class="title">{{ card.title }}</p>
          <p class="description">{{ card.description }}</p>
        </div>
      </div>
    </div>

    <div class="routers w-full" v-if="selectedCard">
      <router-link :to="`${routeName.route}?type=${selectedRoutesType}`" class="btn-route w-full "
        v-for="(routeName, index) in selectedCard.routes" :key="index">
        {{ routeName.Name }}
      </router-link>
    </div>
  </div>
</template>
