<script setup lang="ts">
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import { onMounted, ref, watch } from 'vue'
import PermissionBuilder from '@/components/DataStatus/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import GeerIcon from '../icons/GeerIcon.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
interface Routes {
  link: string
  name: string
  permissions: PermissionsEnum[]
}
const { t } = useI18n()

const GauideRoutes = ref<Routes[]>([
  {
    link: '/organization/project-progress',
    name: t('overview'),
    permissions: []
    // permissions: [
    //   PermissionsEnum.WHIERE_HOUSE_TYPE_ALL,
    //   PermissionsEnum.WHIERE_HOUSE_TYPE_FETCH,
    //   PermissionsEnum.WHIERE_HOUSE_TYPE_DETAILS,
    //   PermissionsEnum.WHIERE_HOUSE_TYPE_CREATE,
    //   PermissionsEnum.WHIERE_HOUSE_TYPE_UPDATE,
    //   PermissionsEnum.WHIERE_HOUSE_TYPE_DELETE,
    // ],
  },

])

const OrganizationRoutes = ref<Routes[]>([
  {
    link: '/organization/certificate',
    name: t('certificates'),
    permissions: [
      PermissionsEnum.CERTIFICATE_ALL,
      PermissionsEnum.CERTIFICATE_CREATE,
      PermissionsEnum.CERTIFICATE_DELETE,
      PermissionsEnum.CERTIFICATE_FETCH,
      PermissionsEnum.CERTIFICATE_UPDATE,
    ],
  },
  {
    link: '/organization/partner',
    name: t('partners'),
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
  // {
  //   link: '/organization/projects',
  //   name: 'Projects',
  //   permissions: [
  //     PermissionsEnum.PROJECT_ALL,
  //     PermissionsEnum.PROJECT_CREATE,
  //     PermissionsEnum.PROJECT_DELETE,
  //     PermissionsEnum.PROJECT_FETCH,
  //     PermissionsEnum.PROJECT_UPDATE,
  //   ],
  // },

  // {
  //   link: '/organization/equipment-types',
  //   name: 'Equipment Types',
  //   permissions: [
  //     PermissionsEnum.ORG_EQUIPMENT_TYPE_ALL,
  //     PermissionsEnum.ORG_EQUIPMENT_TYPE_CREATE,
  //     PermissionsEnum.ORG_EQUIPMENT_TYPE_DELETE,
  //     PermissionsEnum.ORG_EQUIPMENT_TYPE_DETAILS,
  //     PermissionsEnum.ORG_EQUIPMENT_TYPE_FETCH,
  //     PermissionsEnum.ORG_EQUIPMENT_TYPE_UPDATE,
  //   ],
  // },
  // {
  //   link: '/organization/equipments',
  //   name: 'Equipments',
  //   permissions: [
  //     PermissionsEnum.ORG_EQUIPMENT_ALL,
  //     PermissionsEnum.ORG_EQUIPMENT_CREATE,
  //     PermissionsEnum.ORG_EQUIPMENT_DELETE,
  //     PermissionsEnum.ORG_EQUIPMENT_FETCH,
  //     PermissionsEnum.ORG_EQUIPMENT_UPDATE,
  //   ],
  // },

  // {
  //   link: '/organization/health-conditions',
  //   name: 'health_conditions',
  //   permissions: [
  //     PermissionsEnum.ORG_HEALTH_CONDITION_ALL,
  //     PermissionsEnum.ORG_HEALTH_CONDITION_CREATE,
  //     PermissionsEnum.ORG_HEALTH_CONDITION_DELETE,
  //     PermissionsEnum.ORG_HEALTH_CONDITION_FETCH,
  //     PermissionsEnum.ORG_HEALTH_CONDITION_UPDATE,
  //   ],
  // },
  {
    link: '/organization/template',
    name: t('templates'),
    permissions: [
      PermissionsEnum.ORG_TEMPLATE_ALL,
      PermissionsEnum.ORG_TEMPLATE_CREATE,
      PermissionsEnum.ORG_TEMPLATE_DELETE,
      PermissionsEnum.ORG_TEMPLATE_FETCH,
      PermissionsEnum.ORG_TEMPLATE_UPDATE,
    ],
  },
  {
    link: '/organization/organization-employee',
    name: t('employees'),
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
    link: '/organization/herikaly',
    name: t('hierarchy'),
    permissions: [
      PermissionsEnum.HERIKALY_ALL,
      PermissionsEnum.HERIKALY_CREATE,
      PermissionsEnum.HERIKALY_DELETE,
      PermissionsEnum.HERIKALY_FETCH,
      PermissionsEnum.HERIKALY_UPDATE,
    ],
  },
  // {
  //   link: '/organization/methods',
  //   name: 'methods',
  //   permissions: [
  //     PermissionsEnum.ORG_METHOD_ALL,
  //     PermissionsEnum.ORG_METHOD_CREATE,
  //     PermissionsEnum.ORG_METHOD_DELETE,
  //     PermissionsEnum.ORG_METHOD_FETCH,
  //     PermissionsEnum.ORG_METHOD_UPDATE,
  //   ],
  // },
  {
    link: '/organization/team',
    name: t('team'),
    permissions: [
      PermissionsEnum.ORG_TEAM_ALL,
      PermissionsEnum.ORG_TEAM_CREATE,
      PermissionsEnum.ORG_TEAM_DELETE,
      PermissionsEnum.ORG_TEAM_FETCH,
      PermissionsEnum.ORG_TEAM_UPDATE,
    ],
  },
  {
    link: '/organization/contractor',
    name: t('contractors'),
    permissions: [
      PermissionsEnum.ORG_CONTRACTOR_ALL,
      PermissionsEnum.ORG_CONTRACTOR_CREATE,
      PermissionsEnum.ORG_CONTRACTOR_DELETE,
      PermissionsEnum.ORG_CONTRACTOR_FETCH,
      PermissionsEnum.ORG_CONTRACTOR_UPDATE,
    ],
  },

  {
    link: '/organization/role',
    name: t('roles'),
    permissions: [
      PermissionsEnum.ORG_ROLE_ALL,
      PermissionsEnum.ORG_ROLE_CREATE,
      PermissionsEnum.ORG_ROLE_DELETE,
      PermissionsEnum.ORG_ROLE_FETCH,
      PermissionsEnum.ORG_ROLE_UPDATE,
    ],
  },
  // {
  //   link: '/organization/injury',
  //   name: 'injury',
  //   permissions: [
  //     PermissionsEnum.INJURY_ALL,
  //     PermissionsEnum.INJURY_CREATE,
  //     PermissionsEnum.INJURY_DELETE,
  //     PermissionsEnum.INJURY_FETCH,
  //     PermissionsEnum.INJURY_UPDATE,
  //   ],
  // },
  {
    link: '/organization/scope',
    name: t('scope'),
    permissions: [
      PermissionsEnum.SCOPE_ALL,
      PermissionsEnum.SCOPE_CREATE,
      PermissionsEnum.SCOPE_DELETE,
      PermissionsEnum.SCOPE_FETCH,
      PermissionsEnum.SCOPE_UPDATE,
    ],
  },

  // {
  //   link: '/organization/where-house-type',
  //   name: 'WareHouse Type',
  //   permissions: [
  //     PermissionsEnum.WHIERE_HOUSE_TYPE_ALL,
  //     PermissionsEnum.WHIERE_HOUSE_TYPE_CREATE,
  //     PermissionsEnum.WHIERE_HOUSE_TYPE_DELETE,
  //     PermissionsEnum.WHIERE_HOUSE_TYPE_FETCH,
  //     PermissionsEnum.WHIERE_HOUSE_TYPE_UPDATE,
  //   ],
  // },
  {
    link: '/organization/where-house',
    name: t('warehouse'),
    permissions: [
      PermissionsEnum.WHIERE_HOUSE_ALL,
      PermissionsEnum.WHIERE_HOUSE_CREATE,
      PermissionsEnum.WHIERE_HOUSE_DELETE,
      PermissionsEnum.WHIERE_HOUSE_FETCH,
      PermissionsEnum.WHIERE_HOUSE_UPDATE,
    ],
  },
  {
    link: '/organization/employee-certificate',
    name: t('employee_certificate'),
    permissions: [
      PermissionsEnum.EMPLOYEE_CERTIFICATE_ALL,
      PermissionsEnum.EMPLOYEE_CERTIFICATE_CREATE,
      PermissionsEnum.EMPLOYEE_CERTIFICATE_DELETE,
      PermissionsEnum.EMPLOYEE_CERTIFICATE_FETCH,
      PermissionsEnum.EMPLOYEE_CERTIFICATE_UPDATE,
    ],
  },
  // {
  //   link: '/organization/root-causes',
  //   name: 'root_causes',
  //   permissions: [
  //     PermissionsEnum.ROOT_CAUSES_ALL,
  //     PermissionsEnum.ROOT_CAUSES_CREATE,
  //     PermissionsEnum.ROOT_CAUSES_DELETE,
  //     PermissionsEnum.ROOT_CAUSES_FETCH,
  //     PermissionsEnum.ROOT_CAUSES_UPDATE,
  //   ],
  // },
  {
    link: '/organization/serial-number',
    name: t('coding_system'),
    permissions: [
      PermissionsEnum.CODING_SYSTEM_ALL,
      PermissionsEnum.CODING_SYSTEM_CREATE,
      PermissionsEnum.CODING_SYSTEM_DELETE,
      PermissionsEnum.CODING_SYSTEM_FETCH,
      PermissionsEnum.CODING_SYSTEM_UPDATE,
    ],
  },
  {
    link: "/organization/hazard",
    name: t("hazard"),
    permissions: [
      PermissionsEnum.ORG_HAZARD_ALL,
      PermissionsEnum.ORG_HAZARD_CREATE,
      PermissionsEnum.ORG_HAZARD_DELETE,
      PermissionsEnum.ORG_HAZARD_FETCH,
      PermissionsEnum.ORG_HAZARD_UPDATE,
    ],
  },

  {
    link: "/organization/factory",
    name: t("Hazard factor"),
    permissions: [
      PermissionsEnum.ORG_FACTORY_ALL,
      PermissionsEnum.ORG_FACTORY_CREATE,
      PermissionsEnum.ORG_FACTORY_DELETE,
      PermissionsEnum.ORG_FACTORY_FETCH,
      PermissionsEnum.ORG_FACTORY_UPDATE,
    ],
  },
  {
    link: "/organization/factories-items",
    name: t("Hazard factor item"),
    permissions: [
      PermissionsEnum.ORG_FACTORY_ITEM_ALL,
      PermissionsEnum.ORG_FACTORY_ITEM_CREATE,
      PermissionsEnum.ORG_FACTORY_ITEM_DELETE,
      PermissionsEnum.ORG_FACTORY_ITEM_FETCH,
      PermissionsEnum.ORG_FACTORY_ITEM_UPDATE,
    ],
  },


])
const LocationRoutes = ref<Routes[]>([
  {
    link: '/organization/countries',
    name: t('country'),
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
    link: '/organization/states',
    name: t('state'),
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
    link: '/organization/cities',
    name: t('city'),
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
    link: '/organization/areas',
    name: t('location'),
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
    link: '/organization/project-zone',
    name: t('zones'),
    permissions: [
      PermissionsEnum.PROJECT_ZONE_ALL,
      PermissionsEnum.PROJECT_ZONE_CREATE,
      PermissionsEnum.PROJECT_ZONE_DELETE,
      PermissionsEnum.PROJECT_ZONE_FETCH,
      PermissionsEnum.PROJECT_ZONE_UPDATE,
    ],
  },
  {
    link: '/organization/ticket',
    name: t('tickets'),
    permissions: [
      PermissionsEnum.TICKET_ALL,
      PermissionsEnum.TICKET_CREATE,
      PermissionsEnum.TICKET_DELETE,
      PermissionsEnum.TICKET_FETCH,
      PermissionsEnum.TICKET_UPDATE,
    ],
  },


])
const OperationRoutesRoutes = ref<Routes[]>([
  {
    link: '/organization/equipment-mangement/all-observatin',
    name: t('operations'),
    permissions: [
      PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_ALL,
      PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_CREATE,
      PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_DELETE,
      PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_FETCH,
      PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_UPDATE,
    ],
  },
  {
    link: '/organization/accidents-type',
    name: t('incidant_types'),
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
    link: '/organization/equipment-mangement/incedant?isAll=1',
    name: t('incidants'),
    permissions: [
      PermissionsEnum.WEBSITE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ORG_INCEDANT_FETCH,
      PermissionsEnum.ORG_INCEDANT_ALL,
      PermissionsEnum.ORG_INCEDANT_CREATE,
      PermissionsEnum.ORG_INCEDANT_UPDATE,
      PermissionsEnum.ORG_INCEDANT_DELETE,
    ],
  },
  {
    link: '/organization/factory',
    name: t('hazard_factors'),
    permissions: [
      PermissionsEnum.ORG_FACTORY_ALL,
      PermissionsEnum.ORG_FACTORY_CREATE,
      PermissionsEnum.ORG_FACTORY_DELETE,
      PermissionsEnum.ORG_FACTORY_FETCH,
      PermissionsEnum.ORG_FACTORY_UPDATE,
    ],
  },
  {
    link: '/organization/factories-items',
    name: t('hazard_factor_item'),
    permissions: [
      PermissionsEnum.ORG_FACTORY_ITEM_ALL,
      PermissionsEnum.ORG_FACTORY_ITEM_CREATE,
      PermissionsEnum.ORG_FACTORY_ITEM_DELETE,
      PermissionsEnum.ORG_FACTORY_ITEM_FETCH,
      PermissionsEnum.ORG_FACTORY_ITEM_UPDATE,
    ],
  },
  {
    link: '/organization/hazard-type',
    name: t('hazard_types'),
    permissions: [
      PermissionsEnum.ORG_HAZARD_TYPE_ALL,
      PermissionsEnum.ORG_HAZARD_TYPE_CREATE,
      PermissionsEnum.ORG_HAZARD_TYPE_DELETE,
      PermissionsEnum.ORG_HAZARD_TYPE_FETCH,
      PermissionsEnum.ORG_HAZARD_TYPE_UPDATE,
    ],
  },
  {
    link: '/organization/hazard',
    name: t('hazard'),
    permissions: [
      PermissionsEnum.ORG_HAZARD_ALL,
      PermissionsEnum.ORG_HAZARD_CREATE,
      PermissionsEnum.ORG_HAZARD_DELETE,
      PermissionsEnum.ORG_HAZARD_FETCH,
      PermissionsEnum.ORG_HAZARD_UPDATE,
    ],
  },
  {
    link: '/organization/observation-type',
    name: t('observation_types'),
    permissions: [
      PermissionsEnum.ORG_OBSERVATION_TYPE_ALL,
      PermissionsEnum.ORG_OBSERVATION_TYPE_CREATE,
      PermissionsEnum.ORG_OBSERVATION_TYPE_DELETE,
      PermissionsEnum.ORG_OBSERVATION_TYPE_FETCH,
      PermissionsEnum.ORG_OBSERVATION_TYPE_UPDATE,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
    ],
  },

  {
    link: '/organization/equipment-mangement/observation',
    name: t('observation'),
    permissions: [
      PermissionsEnum.ORG_OBSERVATION_ALL,
      PermissionsEnum.ORG_OBSERVATION_CREATE,
      PermissionsEnum.ORG_OBSERVATION_DELETE,
      PermissionsEnum.ORG_OBSERVATION_FETCH,
      PermissionsEnum.ORG_OBSERVATION_UPDATE,
    ],
  },



])
const LockUpsRoutes = ref<Routes[]>([
  {
    link: '/organization/where-house-type',
    name: t('warehouse_types'),
    permissions: [
      PermissionsEnum.WHIERE_HOUSE_TYPE_ALL,
      PermissionsEnum.WHIERE_HOUSE_TYPE_FETCH,
      PermissionsEnum.WHIERE_HOUSE_TYPE_DETAILS,
      PermissionsEnum.WHIERE_HOUSE_TYPE_CREATE,
      PermissionsEnum.WHIERE_HOUSE_TYPE_UPDATE,
      PermissionsEnum.WHIERE_HOUSE_TYPE_DELETE,
    ],
  },
  {
    link: '/organization/hazard-type',
    name: t('hazard_type'),
    permissions: [
      PermissionsEnum.HAZARD_TYPE_ALL,
      PermissionsEnum.HAZARD_TYPE_FETCH,
      PermissionsEnum.HAZARD_TYPE_DETAILS,
      PermissionsEnum.HAZARD_TYPE_CREATE,
      PermissionsEnum.HAZARD_TYPE_UPDATE,
      PermissionsEnum.HAZARD_TYPE_DELETE,
    ],
  },
  {
    link: '/organization/accidents-type',
    name: t('incident_types'),
    permissions: [
      PermissionsEnum.ACCIDENTS_TYPE_ALL,
      PermissionsEnum.ACCIDENTS_TYPE_FETCH,
      PermissionsEnum.ACCIDENTS_TYPE_DETAILS,
      PermissionsEnum.ACCIDENTS_TYPE_CREATE,
      PermissionsEnum.ACCIDENTS_TYPE_UPDATE,
      PermissionsEnum.ACCIDENTS_TYPE_DELETE,
    ],
  },
  {
    link: '/organization/observation-type',
    name: t('observation_type'),
    permissions: [
      PermissionsEnum.OBSERVATION_TYPE_ALL,
      PermissionsEnum.OBSERVATION_TYPE_FETCH,
      PermissionsEnum.OBSERVATION_TYPE_DETAILS,
      PermissionsEnum.OBSERVATION_TYPE_CREATE,
      PermissionsEnum.OBSERVATION_TYPE_UPDATE,
      PermissionsEnum.OBSERVATION_TYPE_DELETE,

    ],
  },
  {
    link: '/organization/equipment-types',
    name: t('equipment_types'),
    permissions: [
      PermissionsEnum.ORG_EQUIPMENT_TYPE_ALL,
      PermissionsEnum.ORG_EQUIPMENT_TYPE_FETCH,
      PermissionsEnum.ORG_EQUIPMENT_TYPE_DETAILS,
      PermissionsEnum.ORG_EQUIPMENT_TYPE_CREATE,
      PermissionsEnum.ORG_EQUIPMENT_TYPE_UPDATE,
      PermissionsEnum.ORG_EQUIPMENT_TYPE_DELETE,
    ],
  },
  {
    link: '/organization/root-causes',
    name: t('root_causes'),
    permissions: [
      PermissionsEnum.ROOT_CAUSES_ALL,
      PermissionsEnum.ROOT_CAUSES_CREATE,
      PermissionsEnum.ROOT_CAUSES_DELETE,
      PermissionsEnum.ROOT_CAUSES_FETCH,
      PermissionsEnum.ROOT_CAUSES_UPDATE,
    ],
  },
  {
    link: '/organization/injury',
    name: t('injury'),
    permissions: [
      PermissionsEnum.INJURY_ALL,
      PermissionsEnum.INJURY_CREATE,
      PermissionsEnum.INJURY_DELETE,
      PermissionsEnum.INJURY_FETCH,
      PermissionsEnum.INJURY_UPDATE,
    ],
  },
])

const SelectedOrgRoute = ref<string>('')
const SelectedLocationRoute = ref<string>('')
const SelectedOperationRoute = ref<string>('')
const SelectedLockupsRoute = ref<string>('')
const SelectedGauideRoutes = ref<string>('')
watch(
  () => route.path,
  (newPath) => {
    SelectedOrgRoute.value = OrganizationRoutes.value.find(item => item.link === newPath)?.name
    SelectedLocationRoute.value = LocationRoutes.value.find(item => item.link === newPath)?.name
    SelectedOperationRoute.value = OperationRoutesRoutes.value.find(item => item.link === newPath)?.name
    SelectedLockupsRoute.value = LockUpsRoutes.value.find(item => item.link === newPath)?.name
    SelectedGauideRoutes.value = GauideRoutes.value.find(item => item.link === newPath)?.name

  }
)

const orgAccordion = ref<string | null>('1')
const locationAccordion = ref<string | null>('2')
const OperationAccordion = ref<string | null>('3')
const LoackupsAccordion = ref<string | null>('4')
const GauideAccordion = ref<string | null>('5')


watch(orgAccordion, (val) => {
  orgAccordion.value = val
})
watch(locationAccordion, (val) => {
  locationAccordion.value = val
})
watch(OperationAccordion, (val) => {
  OperationAccordion.value = val
})
watch(LoackupsAccordion, (val) => {
  LoackupsAccordion.value = val
})
watch(GauideAccordion, (val) => {
  GauideAccordion.value = val
})

</script>

<template>


  <PermissionBuilder :code="OrganizationRoutes?.map((item) => item.permissions.map((item) => item)).flat()">
    <Accordion v-model:value="GauideAccordion">
      <AccordionPanel value="5">
        <AccordionHeader>
          <div class="links-header">
            <GeerIcon />
            {{ $t('overview') }}
          </div>
        </AccordionHeader>

        <AccordionContent>
          <ul>
            <PermissionBuilder v-for="(guideroute, index) in GauideRoutes" :key="index" :code="guideroute?.permissions">
              <li>
                <router-link :to="guideroute.link" :class="route?.fullPath?.includes(guideroute.link) ? '' : ''">
                  <span>{{ $t(guideroute.name) }}</span>
                </router-link>
              </li>
            </PermissionBuilder>
          </ul>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel class="active-panel-out" v-if="SelectedGauideRoutes && !GauideAccordion">
        <span>{{ SelectedGauideRoutes }}</span>
      </AccordionPanel>
    </Accordion>
  </PermissionBuilder>


  <PermissionBuilder :code="OrganizationRoutes?.map((item) => item.permissions.map((item) => item)).flat()">
    <Accordion v-model:value="orgAccordion">
      <AccordionPanel value="1">
        <AccordionHeader>
          <div class="links-header">
            <GeerIcon />
            {{ $t('organization_setting') }}
          </div>
        </AccordionHeader>

        <AccordionContent>
          <ul>
            <PermissionBuilder v-for="(orgroute, index) in OrganizationRoutes" :key="index"
              :code="orgroute?.permissions">
              <li>
                <router-link :to="orgroute.link" :class="route?.fullPath?.includes(orgroute.link) ? '' : ''">
                  <span>{{ $t(orgroute.name) }}</span>
                </router-link>
              </li>
            </PermissionBuilder>
          </ul>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel class="active-panel-out" v-if="SelectedOrgRoute && !orgAccordion">
        <span>{{ SelectedOrgRoute }}</span>
      </AccordionPanel>
    </Accordion>
  </PermissionBuilder>

  <!-- <Accordion v-model:value="OperationAccordion">
    <AccordionPanel value="2">
      <AccordionHeader>
        <div class="links-header">
          <GeerIcon />
          {{ $t('operations') }}
        </div>
      </AccordionHeader>

      <AccordionContent>
        <ul>
          <PermissionBuilder v-for="(orgroute, index) in OperationRoutesRoutes" :key="index"
            :code="orgroute?.permissions">
            <li>
              <router-link :to="orgroute.link" :class="route?.fullPath?.includes(orgroute.link) ? '' : ''">
                <span>{{ $t(orgroute.name) }}</span>
              </router-link>
            </li>
          </PermissionBuilder>
        </ul>
      </AccordionContent>
    </AccordionPanel>
    <AccordionPanel class="active-panel-out" v-if="SelectedOperationRoute && !OperationAccordion">
      <span>{{ SelectedOperationRoute }}</span>
    </AccordionPanel>
  </Accordion> -->

  <PermissionBuilder :code="[PermissionsEnum?.LOCATION_ORG_ALL]">
    <Accordion v-model:value="locationAccordion">
      <AccordionPanel value="2">
        <AccordionHeader>
          <div class="links-header">
            <GeerIcon />
            {{ $t('location') }}
          </div>
        </AccordionHeader>

        <AccordionContent>
          <ul>
            <!-- <PermissionBuilder :code="[
              PermissionsEnum?.ORGANIZATION_EMPLOYEE,
              PermissionsEnum?.LOCATION_ORG_ALL,
              PermissionsEnum.LOCATION_ORG_CREATE,
              PermissionsEnum.LOCATION_ORG_UPDATE,
              PermissionsEnum.LOCATION_ORG_DETAILS,
              PermissionsEnum.LOCATION_ORG_DELETE,
              PermissionsEnum.LOCATION_ORG_FETCH,
            ]">
              <li>
                <router-link to="/organization/countries">
                  <span>{{ $t('country') }}</span>
                </router-link>
              </li>
            </PermissionBuilder>
            <PermissionBuilder :code="[
              PermissionsEnum?.ORGANIZATION_EMPLOYEE,
              PermissionsEnum.LOCATION_ORG_ALL,
              PermissionsEnum.LOCATION_ORG_CREATE,
              PermissionsEnum.LOCATION_ORG_DELETE,
              PermissionsEnum.LOCATION_ORG_FETCH,
              PermissionsEnum.LOCATION_ORG_UPDATE,
            ]">
              <li>
                <router-link to="/organization/states">

                  <span>{{ $t('state') }}</span>
                </router-link>
              </li>
            </PermissionBuilder>
            <PermissionBuilder :code="[
              PermissionsEnum?.ORGANIZATION_EMPLOYEE,
              PermissionsEnum.LOCATION_ORG_ALL,
              PermissionsEnum.LOCATION_ORG_CREATE,
              PermissionsEnum.LOCATION_ORG_DELETE,
              PermissionsEnum.LOCATION_ORG_FETCH,
              PermissionsEnum.LOCATION_ORG_UPDATE,
            ]">
              <li>
                <router-link to="/organization/cities">

                  <span>{{ $t('city') }}</span>
                </router-link>
              </li>
            </PermissionBuilder>
            <PermissionBuilder :code="[
              PermissionsEnum?.ORGANIZATION_EMPLOYEE,
              PermissionsEnum.LOCATION_ORG_ALL,
              PermissionsEnum.LOCATION_ORG_CREATE,
              PermissionsEnum.LOCATION_ORG_DELETE,
              PermissionsEnum.LOCATION_ORG_FETCH,
              PermissionsEnum.LOCATION_ORG_UPDATE,
            ]">
              <li>
                <router-link to="/organization/areas">

                  <span>{{ $t('location') }}</span>
                </router-link>
              </li>
            </PermissionBuilder>
            <PermissionBuilder :code="[
              PermissionsEnum.PROJECT_ZONE_ALL,
              PermissionsEnum.PROJECT_ZONE_CREATE,
              PermissionsEnum.PROJECT_ZONE_DELETE,
              PermissionsEnum.PROJECT_ZONE_FETCH,
              PermissionsEnum.PROJECT_ZONE_UPDATE,
            ]">
              <li>
                <router-link to="/organization/project-zone">

                  <span>{{ $t('zones') }}</span>
                </router-link>
              </li>
            </PermissionBuilder> -->

            <PermissionBuilder v-for="(route, index) in LocationRoutes" :key="index" :code="route.permissions">
              <li>
                <router-link :to="route.link">
                  <span>{{ $t(route.name) }}</span>
                </router-link>
              </li>
            </PermissionBuilder>
          </ul>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel class="active-panel-out" v-if="SelectedLocationRoute && !locationAccordion">
        <span>{{ SelectedLocationRoute }}</span>
      </AccordionPanel>
    </Accordion>
  </PermissionBuilder>

  <PermissionBuilder :code="LockUpsRoutes?.map((item) => item.permissions.map((item) => item)).flat()">
    <Accordion v-model:value="LoackupsAccordion">
      <AccordionPanel value="4">
        <AccordionHeader>
          <div class="links-header">
            <GeerIcon />
            {{ $t('Lockups') }}
          </div>
        </AccordionHeader>

        <AccordionContent>
          <ul>
            <PermissionBuilder v-for="(orgroute, index) in LockUpsRoutes" :key="index" :code="orgroute?.permissions">
              <li>
                <router-link :to="orgroute.link" :class="route?.fullPath?.includes(orgroute.link) ? '' : ''">
                  <span>{{ $t(orgroute.name) }}</span>
                </router-link>
              </li>
            </PermissionBuilder>
          </ul>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel class="active-panel-out" v-if="SelectedLockupsRoute && !orgAccordion">
        <span>{{ SelectedLockupsRoute }}</span>
      </AccordionPanel>
    </Accordion>
  </PermissionBuilder>
</template>
