<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

import FilesOrganization from "@/assets/images/FilesOrganization.png";
import OrganizationSettingIcon from "@/assets/images/OrganizationSettingIcon.png";
import PersonalData from "@/assets/images/PersonalData.png";
import SettingLocation from "@/assets/images/SettingLocation.png";

import { RouterEnum } from "../SettingEnum/SettingEnum";
import { PermissionsEnum } from "@/features/users/Admin/Core/Enum/permission_enum";
import PermissionBuilder from "@/components/DataStatus/PermissionBuilder.vue";

interface OrganizationSettingItem {
  id: RouterEnum;
  title: string;
  icon: string;
  description: string;
  routes: { route: string, Name: string, permissions: PermissionsEnum[] }[];

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
        permissions: [
          PermissionsEnum.WEBSITE,
          PermissionsEnum.PARTNER_ALL,
          PermissionsEnum.PARTNER_CREATE,
          PermissionsEnum.PARTNER_UPDATE,
          PermissionsEnum.PARTNER_DETAILS,
          PermissionsEnum.PARTNER_DELETE,
          PermissionsEnum.PARTNER_FETCH,
        ],
      },
      {
        route: "/organization/projects",
        Name: "projects",
        permissions: [
          PermissionsEnum.PROJECT_ALL,
          PermissionsEnum.PROJECT_CREATE,
          PermissionsEnum.PROJECT_DELETE,
          PermissionsEnum.PROJECT_FETCH,
          PermissionsEnum.PROJECT_UPDATE,
        ],
      },
      {
        route: "/organization/certificate",
        Name: "certifications",
        permissions: [
          PermissionsEnum.CERTIFICATE_ALL,
          PermissionsEnum.CERTIFICATE_CREATE,
          PermissionsEnum.CERTIFICATE_DELETE,
          PermissionsEnum.CERTIFICATE_FETCH,
          PermissionsEnum.CERTIFICATE_UPDATE,
        ],
      },
      {
        route: "/organization/template",
        Name: "templates",
        permissions: [
          PermissionsEnum.ORG_TEMPLATE_ALL,
          PermissionsEnum.ORG_TEMPLATE_CREATE,
          PermissionsEnum.ORG_TEMPLATE_DELETE,
          PermissionsEnum.ORG_TEMPLATE_FETCH,
          PermissionsEnum.ORG_TEMPLATE_UPDATE,
        ],
      },
      // {
      //   route: "/organization/methods",
      //   Name: "methods",
      // },
      {
        route: "/organization/contractor",
        Name: "contractors",
        permissions: [
          PermissionsEnum.ORG_CONTRACTOR_ALL,
          PermissionsEnum.ORG_CONTRACTOR_CREATE,
          PermissionsEnum.ORG_CONTRACTOR_DELETE,
          PermissionsEnum.ORG_CONTRACTOR_FETCH,
          PermissionsEnum.ORG_CONTRACTOR_UPDATE,
        ],
      },
      {
        route: "/organization/equipment-mangement/all-observatin",
        Name: "management",
        permissions: [
          PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_ALL,
          PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_CREATE,
          PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_DELETE,
          PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_FETCH,
          PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_UPDATE,
        ],
      },
      {
        route: "/organization/role",
        Name: "roles",
        permissions: [
          PermissionsEnum.ORG_ROLE_ALL,
          PermissionsEnum.ORG_ROLE_CREATE,
          PermissionsEnum.ORG_ROLE_DELETE,
          PermissionsEnum.ORG_ROLE_FETCH,
          PermissionsEnum.ORG_ROLE_UPDATE,
        ],
      },
      {
        route: '/organization/accidents-type',
        Name: 'Accidents Types',
        permissions: [
          PermissionsEnum.WEBSITE,
          PermissionsEnum.ORG_ACCIDENTS_TYPE_ALL,
          PermissionsEnum.ORG_ACCIDENTS_TYPE_CREATE,
          PermissionsEnum.ORG_ACCIDENTS_TYPE_UPDATE,
          PermissionsEnum.ORG_ACCIDENTS_TYPE_DETAILS,
          PermissionsEnum.ORG_ACCIDENTS_TYPE_DELETE,
          PermissionsEnum.ORG_ACCIDENTS_TYPE_FETCH,
        ],
      },
      {
        route: '/organization/equipment-types',
        Name: 'Equipment Types',
        permissions: [
          PermissionsEnum.ORG_EQUIPMENT_TYPE_ALL,
          PermissionsEnum.ORG_EQUIPMENT_TYPE_CREATE,
          PermissionsEnum.ORG_EQUIPMENT_TYPE_DELETE,
          PermissionsEnum.ORG_EQUIPMENT_TYPE_DETAILS,
          PermissionsEnum.ORG_EQUIPMENT_TYPE_FETCH,
          PermissionsEnum.ORG_EQUIPMENT_TYPE_UPDATE,
        ],
      },
      {
        route: '/organization/scope',
        Name: 'Scope',
        permissions: [
          PermissionsEnum.SCOPE_ALL,
          PermissionsEnum.SCOPE_CREATE,
          PermissionsEnum.SCOPE_DELETE,
          PermissionsEnum.SCOPE_FETCH,
          PermissionsEnum.SCOPE_UPDATE,
        ],
      },
      {
        route: '/organization/where-house-type',
        Name: 'WareHouse Type',
        permissions: [
          PermissionsEnum.WHIERE_HOUSE_TYPE_ALL,
          PermissionsEnum.WHIERE_HOUSE_TYPE_CREATE,
          PermissionsEnum.WHIERE_HOUSE_TYPE_DELETE,
          PermissionsEnum.WHIERE_HOUSE_TYPE_FETCH,
          PermissionsEnum.WHIERE_HOUSE_TYPE_UPDATE,
        ],
      },
      {
        route: '/organization/where-house',
        Name: 'WareHouse',
        permissions: [
          PermissionsEnum.WHIERE_HOUSE_ALL,
          PermissionsEnum.WHIERE_HOUSE_CREATE,
          PermissionsEnum.WHIERE_HOUSE_DELETE,
          PermissionsEnum.WHIERE_HOUSE_FETCH,
          PermissionsEnum.WHIERE_HOUSE_UPDATE,
        ],
      },


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
        permissions: [
          PermissionsEnum.ORG_HAZARD_TYPE_ALL,
          PermissionsEnum.ORG_HAZARD_TYPE_CREATE,
          PermissionsEnum.ORG_HAZARD_TYPE_DELETE,
          PermissionsEnum.ORG_HAZARD_TYPE_FETCH,
          PermissionsEnum.ORG_HAZARD_TYPE_UPDATE,
        ],
      },
      {
        route: "/organization/equipment-mangement/observation",
        Name: "observation",
        permissions: [
          PermissionsEnum.ORG_OBSERVATION_ALL,
          PermissionsEnum.ORG_OBSERVATION_CREATE,
          PermissionsEnum.ORG_OBSERVATION_DELETE,
          PermissionsEnum.ORG_OBSERVATION_FETCH,
          PermissionsEnum.ORG_OBSERVATION_UPDATE,
        ],
      },
      {
        route: "/organization/equipment-mangement/hazard",
        Name: "hazard",
        permissions: [
          PermissionsEnum.ORG_HAZARD_ALL,
          PermissionsEnum.ORG_HAZARD_CREATE,
          PermissionsEnum.ORG_HAZARD_DELETE,
          PermissionsEnum.ORG_HAZARD_FETCH,
          PermissionsEnum.ORG_HAZARD_UPDATE,
        ],
      },
      {
        route: "/organization/factory",
        Name: "factor",
        permissions: [
          PermissionsEnum.ORG_FACTORY_ALL,
          PermissionsEnum.ORG_FACTORY_CREATE,
          PermissionsEnum.ORG_FACTORY_DELETE,
          PermissionsEnum.ORG_FACTORY_FETCH,
          PermissionsEnum.ORG_FACTORY_UPDATE,
        ],
      },
      {
        route: "/organization/factories-items",
        Name: "factor-item",
        permissions: [
          PermissionsEnum.ORG_FACTORY_ITEM_ALL,
          PermissionsEnum.ORG_FACTORY_ITEM_CREATE,
          PermissionsEnum.ORG_FACTORY_ITEM_DELETE,
          PermissionsEnum.ORG_FACTORY_ITEM_FETCH,
          PermissionsEnum.ORG_FACTORY_ITEM_UPDATE,
        ],
      },
      {
        route: '/organization/observation-type',
        Name: 'Observation Type',
        permissions: [
          PermissionsEnum.OBSERVATION_TYPE_ALL,
          PermissionsEnum.OBSERVATION_TYPE_CREATE,
          PermissionsEnum.OBSERVATION_TYPE_DELETE,
          PermissionsEnum.OBSERVATION_TYPE_FETCH,
          PermissionsEnum.OBSERVATION_TYPE_UPDATE,
        ],
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
        permissions: [
          PermissionsEnum.ORG_EMPLOYEE_ALL,
          PermissionsEnum.ORG_EMPLOYEE_CREATE,
          PermissionsEnum.ORG_EMPLOYEE_DELETE,
          PermissionsEnum.ORG_EMPLOYEE_FETCH,
          PermissionsEnum.ORG_EMPLOYEE_UPDATE,
          PermissionsEnum.ORG_EMPLOYEE_DETAILS,
        ],
      },
      {
        route: "/organization/herikaly",
        Name: "hierarchy",
        permissions: [
          PermissionsEnum.HERIKALY_ALL,
          PermissionsEnum.HERIKALY_CREATE,
          PermissionsEnum.HERIKALY_DELETE,
          PermissionsEnum.HERIKALY_FETCH,
          PermissionsEnum.HERIKALY_UPDATE,
        ],
      },
      {
        route: "/organization/team",
        Name: "team",
        permissions: [
          PermissionsEnum.ORG_TEAM_ALL,
          PermissionsEnum.ORG_TEAM_CREATE,
          PermissionsEnum.ORG_TEAM_DELETE,
          PermissionsEnum.ORG_TEAM_FETCH,
          PermissionsEnum.ORG_TEAM_UPDATE,
        ],
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
        route: "/organization/countries",
        Name: "countries",
        permissions: [
          PermissionsEnum?.ORGANIZATION_EMPLOYEE,
          PermissionsEnum?.LOCATION_ORG_ALL,
          PermissionsEnum.LOCATION_ORG_CREATE,
          PermissionsEnum.LOCATION_ORG_UPDATE,
          PermissionsEnum.LOCATION_ORG_DETAILS,
          PermissionsEnum.LOCATION_ORG_DELETE,
          PermissionsEnum.LOCATION_ORG_FETCH,
        ],
      },
      {
        route: "/organization/states",
        Name: "states",
        permissions: [
          PermissionsEnum?.ORGANIZATION_EMPLOYEE,
          PermissionsEnum?.LOCATION_ORG_ALL,
          PermissionsEnum.LOCATION_ORG_CREATE,
          PermissionsEnum.LOCATION_ORG_UPDATE,
          PermissionsEnum.LOCATION_ORG_DETAILS,
          PermissionsEnum.LOCATION_ORG_DELETE,
          PermissionsEnum.LOCATION_ORG_FETCH,
        ],
      },

      {
        route: "/organization/cities",
        Name: "cities",
        permissions: [
          PermissionsEnum?.ORGANIZATION_EMPLOYEE,
          PermissionsEnum?.LOCATION_ORG_ALL,
          PermissionsEnum.LOCATION_ORG_CREATE,
          PermissionsEnum.LOCATION_ORG_UPDATE,
          PermissionsEnum.LOCATION_ORG_DETAILS,
          PermissionsEnum.LOCATION_ORG_DELETE,
          PermissionsEnum.LOCATION_ORG_FETCH,
        ],
      },
      {
        route: "/organization/areas",
        Name: "locations",
        permissions: [
          PermissionsEnum?.ORGANIZATION_EMPLOYEE,
          PermissionsEnum?.LOCATION_ORG_ALL,
          PermissionsEnum.LOCATION_ORG_CREATE,
          PermissionsEnum.LOCATION_ORG_UPDATE,
          PermissionsEnum.LOCATION_ORG_DETAILS,
          PermissionsEnum.LOCATION_ORG_DELETE,
          PermissionsEnum.LOCATION_ORG_FETCH,
        ],
      },
      {
        route: "/organization/project-zone",
        Name: "zones",
        permissions: [
          PermissionsEnum.PROJECT_ZONE_ALL,
          PermissionsEnum.PROJECT_ZONE_CREATE,
          PermissionsEnum.PROJECT_ZONE_DELETE,
          PermissionsEnum.PROJECT_ZONE_FETCH,
          PermissionsEnum.PROJECT_ZONE_UPDATE,
        ],
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
      <PermissionBuilder v-for="(routeName, index) in selectedCard.routes" :key="index" :code="routeName?.permissions">

        <router-link :to="`${routeName.route}?type=${selectedRoutesType}`" class="btn-route w-full ">
          {{ routeName.Name }}
        </router-link>
      </PermissionBuilder>

    </div>
  </div>
</template>
