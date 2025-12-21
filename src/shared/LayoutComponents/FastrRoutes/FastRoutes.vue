<script lang="ts" setup>
import FilesOrganization from "@/assets/images/FilesOrganization.png";
import OrganizationSettingIcon from "@/assets/images/OrganizationSettingIcon.png";
import PersonalData from "@/assets/images/PersonalData.png";
import SettingLocation from "@/assets/images/SettingLocation.png";
import { RouterEnum } from "@/features/Home/SettingEnum/SettingEnum";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

interface OrganizationSettingItem {
  id: RouterEnum;
  title: string;
  icon: string;
  description: string;
  routes: { route: string, Name: string }[];
}

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



</script>
<template>
  <div class="fast-route-container">
    <div class="fast-route"
      v-for="(item, index) in OrganizationSetting.filter(item => item.id == Number(route.query.type))" :key="index">
      <div class="route" :class="route.path.includes(routeItem.route) ? 'active' : ''"
        v-for="(routeItem, routeIndex) in item.routes" :key="routeIndex">
        <router-link :to="`${routeItem.route}?type=${route?.query?.type}`" class="w-full">
          {{ routeItem.Name }}
        </router-link>
      </div>
    </div>
  </div>
</template>
