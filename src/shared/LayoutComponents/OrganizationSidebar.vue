<script setup lang="ts">
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import { onMounted, ref, watch } from 'vue'
import type { Component } from 'vue'
import PermissionBuilder from '@/components/DataStatus/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import GeerIcon from '../icons/GeerIcon.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Sidebarlocation from '../icons/sidebarlocation.vue'
import Locaps from '../icons/locaps.vue'
import { useUserStore } from '@/stores/user'
import { EmployeeStatusEnum } from '@/features/Organization/OrganizationEmployee/Core/Enum/EmployeeStatus'

import AwardIcon from '@/shared/icons/AwardIcon.vue'
import BookIcon from '@/shared/icons/BookIcon.vue'
import AddHerikly from '@/shared/icons/AddHerikly.vue'
import EmployeeIcon from '@/shared/icons/EmployeeIcon.vue'
import TeamIcon from '@/shared/icons/TeamIcon.vue'
import ContractorIcon from '@/shared/icons/ContractorIcon.vue'
import ShieldIcon from '@/shared/icons/shield.vue'
import IconScopes from '@/shared/icons/IconScopes.vue'
import LockerIcon from '@/shared/icons/LockerIcon.vue'
import AddcertificatesIcon from '@/shared/icons/Addcertificates.vue'
import PathSerialIcon from '@/shared/icons/pathSerial.vue'
import HazardIcon from '@/shared/icons/HazardIcon.vue'
import FactorItemIcon from '@/shared/icons/FactorItemIcon.vue'
import TicketIcon from '@/shared/icons/TicketIcon.vue'
import HomeProjectIcon from '@/shared/icons/HomeProjectIcon.vue'
import LocationIcon from '@/shared/icons/LocationIcon.vue'
import IconArea from '@/shared/icons/IconArea.vue'
import ZoneIcon from '@/shared/icons/ZoneIcon.vue'
import WarningIcon from '@/shared/icons/WarningIcon.vue'
import EyeIcon from '@/shared/icons/EyeIcon.vue'
import ToolIcon from '@/shared/icons/ToolIcon.vue'
import RootCaseIcon from '@/shared/icons/RootCase.vue'
import InjuredIcon from '@/shared/icons/injured.vue'
import ProjectProgressIcon from '../icons/ProjectProgressIcon.vue'
import TemplateIcon from '../icons/TemplateIcon.vue'
import HierarchyIco from '../icons/HierarchyIco.vue'
import EmployeeIconSidebar from '../icons/EmployeeIconSidebar.vue'
import RolesIcon from '../icons/RolesIcon.vue'
import WareHouseIconSidebar from '../icons/WareHouseIconSidebar.vue'
import { InspectionPageType } from '@/features/Organization/ObservationFactory/Core/Enums/InspectionTypeEnum.ts'

const props = defineProps<{ open: boolean }>()

const route = useRoute()
interface Routes {
  link: string | {}
  name: string
  permissions: PermissionsEnum[]
  icon: Component
}
const { t } = useI18n()

const GauideRoutes = ref<Routes[]>([
  {
    link: '/organization/project-progress',
    name: t('overview'),
    icon: ProjectProgressIcon,
    permissions: [
      PermissionsEnum.ADMIN,
      PermissionsEnum.PROJECT_PROGRESS_ALL,
      PermissionsEnum.ORGANIZATION_ALL,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
    ],
  },
])

const OperationsRoutes = ref<Routes[]>([
  {
    link: '/organization/projects',
    name: t('Projects'),
    icon: ProjectProgressIcon,
    permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },
  {
    link: '/organization/equipments',
    name: t('equipments'),
    icon: ProjectProgressIcon,
    permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },
  {
    link: '/organization/Investigating',
    name: t('investigations'),
    icon: ProjectProgressIcon,
    permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },
  {
    link: '/organization/capa',
    name: t('capa'),
    icon: ProjectProgressIcon,
    permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },
  {
    link: '/organization/equipment-mangement/incedant?isAll=1',
    name: t('Incidents'),
    icon: ProjectProgressIcon,
    permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },
  {
    link: '/organization/equipment-mangement/observation?isAll=1&type=2',
    name: t('observations'),
    icon: ProjectProgressIcon,
    permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },
  {
    link: '/organization/equipment-mangement/inspection?inspectionType=1',
    name: t('Inspection'),
    icon: ProjectProgressIcon,
    permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },
])

const OrganizationRoutes = ref<Routes[]>([
  {
    link: '/organization/certificate',
    name: t('certificates'),
    icon: AwardIcon,
    permissions: [
      PermissionsEnum.CERTIFICATE_ALL,
      PermissionsEnum.CERTIFICATE_CREATE,
      PermissionsEnum.CERTIFICATE_DELETE,
      PermissionsEnum.CERTIFICATE_FETCH,
      PermissionsEnum.CERTIFICATE_UPDATE,
    ],
  },
  {
    link: '/organization/template',
    name: t('templates'),
    icon: TemplateIcon,
    permissions: [
      PermissionsEnum.ORG_TEMPLATE_ALL,
      PermissionsEnum.ORG_TEMPLATE_CREATE,
      PermissionsEnum.ORG_TEMPLATE_DELETE,
      PermissionsEnum.ORG_TEMPLATE_FETCH,
      PermissionsEnum.ORG_TEMPLATE_UPDATE,
    ],
  },
  {
    link: '/organization/herikaly',
    name: t('positions'),
    icon: HierarchyIco,
    permissions: [
      PermissionsEnum.HERIKALY_ALL,
      PermissionsEnum.HERIKALY_CREATE,
      PermissionsEnum.HERIKALY_DELETE,
      PermissionsEnum.HERIKALY_FETCH,
      PermissionsEnum.HERIKALY_UPDATE,
    ],
  },
  {
    link: '/organization/organization-employee',
    name: t('employees'),
    icon: EmployeeIconSidebar,
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
    link: '/organization/team',
    name: t('team'),
    icon: TeamIcon,
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
    icon: ContractorIcon,
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
    icon: RolesIcon,
    permissions: [
      PermissionsEnum.ORG_ROLE_ALL,
      PermissionsEnum.ORG_ROLE_CREATE,
      PermissionsEnum.ORG_ROLE_DELETE,
      PermissionsEnum.ORG_ROLE_FETCH,
      PermissionsEnum.ORG_ROLE_UPDATE,
    ],
  },
  {
    link: '/organization/scope',
    name: t('contractor_scope'),
    icon: IconScopes,
    permissions: [
      PermissionsEnum.SCOPE_ALL,
      PermissionsEnum.SCOPE_CREATE,
      PermissionsEnum.SCOPE_DELETE,
      PermissionsEnum.SCOPE_FETCH,
      PermissionsEnum.SCOPE_UPDATE,
    ],
  },
  {
    link: '/organization/where-house',
    name: t('warehouse'),
    icon: WareHouseIconSidebar,
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
    icon: AddcertificatesIcon,
    permissions: [
      PermissionsEnum.EMPLOYEE_CERTIFICATE_ALL,
      PermissionsEnum.EMPLOYEE_CERTIFICATE_CREATE,
      PermissionsEnum.EMPLOYEE_CERTIFICATE_DELETE,
      PermissionsEnum.EMPLOYEE_CERTIFICATE_FETCH,
      PermissionsEnum.EMPLOYEE_CERTIFICATE_UPDATE,
    ],
  },
  {
    link: '/organization/serial-number',
    name: t('coding_system'),
    icon: PathSerialIcon,
    permissions: [
      PermissionsEnum.CODING_SYSTEM_ALL,
      PermissionsEnum.CODING_SYSTEM_CREATE,
      PermissionsEnum.CODING_SYSTEM_DELETE,
      PermissionsEnum.CODING_SYSTEM_FETCH,
      PermissionsEnum.CODING_SYSTEM_UPDATE,
    ],
  },
  {
    link: '/organization/hazard',
    name: t('hazard'),
    icon: HazardIcon,
    permissions: [
      PermissionsEnum.ORG_HAZARD_ALL,
      PermissionsEnum.ORG_HAZARD_CREATE,
      PermissionsEnum.ORG_HAZARD_DELETE,
      PermissionsEnum.ORG_HAZARD_FETCH,
      PermissionsEnum.ORG_HAZARD_UPDATE,
    ],
  },
  {
    link: '/organization/factory',
    name: t('Hazard factor'),
    icon: FactorItemIcon,
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
    name: t('Hazard factor item'),
    icon: FactorItemIcon,
    permissions: [
      PermissionsEnum.ORG_FACTORY_ITEM_ALL,
      PermissionsEnum.ORG_FACTORY_ITEM_CREATE,
      PermissionsEnum.ORG_FACTORY_ITEM_DELETE,
      PermissionsEnum.ORG_FACTORY_ITEM_FETCH,
      PermissionsEnum.ORG_FACTORY_ITEM_UPDATE,
    ],
  },
  {
    link: '/organization/document-refrence',
    name: 'Document Refrence',
    icon: InjuredIcon,
    permissions: [
      PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_ALL,
      PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_CREATE,
      PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_DELETE,
      PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_FETCH,
      PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_UPDATE,
    ],
  },
])
const TicketRoutes = ref<Routes[]>([
  {
    link: '/organization/ticket',
    name: t('support'),
    icon: TicketIcon,
    permissions: [
      PermissionsEnum.TICKET_ALL,
      PermissionsEnum.TICKET_CREATE,
      PermissionsEnum.TICKET_DELETE,
      PermissionsEnum.TICKET_FETCH,
      PermissionsEnum.TICKET_UPDATE,
    ],
  },
])

const LocationRoutes = ref<Routes[]>([
  {
    link: '/organization/countries',
    name: t('country'),
    icon: LocationIcon,
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
    icon: LocationIcon,
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
    icon: LocationIcon,
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
    icon: IconArea,
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
    icon: ZoneIcon,
    permissions: [
      PermissionsEnum.PROJECT_ZONE_ALL,
      PermissionsEnum.PROJECT_ZONE_CREATE,
      PermissionsEnum.PROJECT_ZONE_DELETE,
      PermissionsEnum.PROJECT_ZONE_FETCH,
      PermissionsEnum.PROJECT_ZONE_UPDATE,
    ],
  },
])

const LockUpsRoutes = ref<Routes[]>([
  {
    link: '/organization/where-house-type',
    name: t('warehouse_types'),
    icon: LockerIcon,
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
    name: t('hazard_classifications'),
    icon: HazardIcon,
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
    icon: WarningIcon,
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
    icon: EyeIcon,
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
    icon: ToolIcon,
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
    icon: RootCaseIcon,
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
    icon: InjuredIcon,
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
const SelectedLockupsRoute = ref<string>('')
const SelectedGauideRoutes = ref<string>('')
const SelectedOperationsRoutes = ref<string>('')
const SelectedTicketRoutes = ref<string>('')

watch(
  () => route.path,
  (newPath) => {
    SelectedOrgRoute.value = OrganizationRoutes.value.find((item) => item.link === newPath)?.name
    SelectedLocationRoute.value = LocationRoutes.value.find((item) => item.link === newPath)?.name
    SelectedLockupsRoute.value = LockUpsRoutes.value.find((item) => item.link === newPath)?.name
    SelectedGauideRoutes.value = GauideRoutes.value.find((item) => item.link === newPath)?.name
    SelectedOperationsRoutes.value = OperationsRoutes.value.find(
      (item) => item.link === newPath,
    )?.name
    SelectedTicketRoutes.value = TicketRoutes.value.find((item) => item.link === newPath)?.name
  },
)

const orgAccordion = ref<string | null>('1')
const locationAccordion = ref<string | null>('2')
const LoackupsAccordion = ref<string | null>('4')
const GauideAccordion = ref<string | null>('5')
const OperationsAccordion = ref<string | null>('6')
const TicketAccordion = ref<string | null>('7')
const activeTooltip = ref<{
  title: string
  top: number
  left?: number
  right?: number
} | null>(null)

const showTooltip = (event: MouseEvent, title: string) => {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const isRtl = document.documentElement.dir === 'rtl'

  activeTooltip.value = {
    title,
    top: rect.top + rect.height / 2,
    ...(isRtl ? { right: window.innerWidth - rect.left + 10 } : { left: rect.right + 10 }),
  }
}

const hideTooltip = () => {
  activeTooltip.value = null
}

watch(orgAccordion, (val) => {
  orgAccordion.value = val
})
watch(locationAccordion, (val) => {
  locationAccordion.value = val
})
watch(LoackupsAccordion, (val) => {
  LoackupsAccordion.value = val
})
watch(GauideAccordion, (val) => {
  GauideAccordion.value = val
})
watch(OperationsAccordion, (val) => {
  OperationsAccordion.value = val
})
watch(TicketAccordion, (val) => {
  TicketAccordion.value = val
})

const { user } = useUserStore()
</script>

<template>
  <!-- Icon strip shown when sidebar is closed -->
  <template v-if="!open">
    <div class="icon-strip">
      <template v-if="user?.employeeType == EmployeeStatusEnum.Admin">
        <PermissionBuilder v-for="r in GauideRoutes" :key="r.link" :code="r.permissions">
          <router-link
            :to="r.link"
            class="icon-item"
            :data-title="$t(r.name)"
            @mouseenter="showTooltip($event, $t(r.name))"
            @mouseleave="hideTooltip"
            @focus="showTooltip($event, $t(r.name))"
            @blur="hideTooltip"
          >
            <component :is="r.icon" class="strip-icon" />
          </router-link>
        </PermissionBuilder>
      </template>

      <PermissionBuilder v-for="r in OrganizationRoutes" :key="r.link" :code="r.permissions">
        <router-link
          :to="r.link"
          class="icon-item"
          :data-title="$t(r.name)"
          @mouseenter="showTooltip($event, $t(r.name))"
          @mouseleave="hideTooltip"
          @focus="showTooltip($event, $t(r.name))"
          @blur="hideTooltip"
        >
          <component :is="r.icon" class="strip-icon" />
        </router-link>
      </PermissionBuilder>

      <PermissionBuilder v-for="r in TicketRoutes" :key="r.link" :code="r.permissions">
        <router-link
          :to="r.link"
          class="icon-item"
          :data-title="$t(r.name)"
          @mouseenter="showTooltip($event, $t(r.name))"
          @mouseleave="hideTooltip"
          @focus="showTooltip($event, $t(r.name))"
          @blur="hideTooltip"
        >
          <component :is="r.icon" class="strip-icon" />
        </router-link>
      </PermissionBuilder>

      <PermissionBuilder v-for="r in OperationsRoutes" :key="r.link" :code="r.permissions">
        <router-link
          :to="r.link"
          class="icon-item"
          :data-title="$t(r.name)"
          @mouseenter="showTooltip($event, $t(r.name))"
          @mouseleave="hideTooltip"
          @focus="showTooltip($event, $t(r.name))"
          @blur="hideTooltip"
        >
          <component :is="r.icon" class="strip-icon" />
        </router-link>
      </PermissionBuilder>

      <PermissionBuilder v-for="r in LocationRoutes" :key="r.link" :code="r.permissions">
        <router-link
          :to="r.link"
          class="icon-item"
          :data-title="$t(r.name)"
          @mouseenter="showTooltip($event, $t(r.name))"
          @mouseleave="hideTooltip"
          @focus="showTooltip($event, $t(r.name))"
          @blur="hideTooltip"
        >
          <component :is="r.icon" class="strip-icon" />
        </router-link>
      </PermissionBuilder>

      <PermissionBuilder v-for="r in LockUpsRoutes" :key="r.link" :code="r.permissions">
        <router-link
          :to="r.link"
          class="icon-item"
          :data-title="$t(r.name)"
          @mouseenter="showTooltip($event, $t(r.name))"
          @mouseleave="hideTooltip"
          @focus="showTooltip($event, $t(r.name))"
          @blur="hideTooltip"
        >
          <component :is="r.icon" class="strip-icon" />
        </router-link>
      </PermissionBuilder>
    </div>

    <Teleport to="body">
      <Transition name="hover-tooltip-fade">
        <div
          v-if="activeTooltip"
          class="hover-tooltip"
          :style="{
            top: activeTooltip.top + 'px',
            left: activeTooltip.left ? activeTooltip.left + 'px' : undefined,
            right: activeTooltip.right ? activeTooltip.right + 'px' : undefined,
          }"
        >
          {{ activeTooltip.title }}
        </div>
      </Transition>
    </Teleport>
  </template>

  <!-- Full accordion view when sidebar is open -->
  <template v-else>
    <PermissionBuilder
      :code="OrganizationRoutes?.map((item) => item.permissions.map((item) => item)).flat()"
      v-if="user?.employeeType == EmployeeStatusEnum.Admin"
    >
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
              <PermissionBuilder
                v-for="(guideroute, index) in GauideRoutes"
                :key="index"
                :code="guideroute?.permissions"
              >
                <li>
                  <router-link :to="guideroute.link" :data-title="$t(guideroute.name)">
                    <component v-if="!open" :is="guideroute.icon" class="route-icon" />
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

    <PermissionBuilder
      :code="OperationsRoutes?.map((item) => item.permissions.map((item) => item)).flat()"
    >
      <Accordion v-model:value="OperationsAccordion">
        <AccordionPanel value="6">
          <AccordionHeader>
            <div class="links-header">
              <GeerIcon />
              {{ $t('project managment') }}
            </div>
          </AccordionHeader>

          <AccordionContent>
            <ul>
              <PermissionBuilder
                v-for="(operation, index) in OperationsRoutes"
                :key="index"
                :code="operation?.permissions"
              >
                <li>
                  <router-link :to="operation.link" :data-title="$t(operation.name)">
                    <component v-if="!open" :is="operation.icon" class="route-icon" />
                    <span>{{ $t(operation.name) }}</span>
                  </router-link>
                </li>
              </PermissionBuilder>
            </ul>
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel
          class="active-panel-out"
          v-if="SelectedOperationsRoutes && !OperationsAccordion"
          :value="6"
        >
          <span>{{ SelectedOperationsRoutes }}</span>
        </AccordionPanel>
      </Accordion>
    </PermissionBuilder>

    <PermissionBuilder
      :code="OrganizationRoutes?.map((item) => item.permissions.map((item) => item)).flat()"
    >
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
              <PermissionBuilder
                v-for="(orgroute, index) in OrganizationRoutes"
                :key="index"
                :code="orgroute?.permissions"
              >
                <li>
                  <router-link :to="orgroute.link" :data-title="$t(orgroute.name)">
                    <component v-if="!open" :is="orgroute.icon" class="route-icon" />
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

    <PermissionBuilder :code="[PermissionsEnum?.LOCATION_ORG_ALL]">
      <Accordion v-model:value="locationAccordion">
        <AccordionPanel value="2">
          <AccordionHeader>
            <div class="links-header">
              <Sidebarlocation />
              {{ $t('location') }}
            </div>
          </AccordionHeader>

          <AccordionContent>
            <ul>
              <PermissionBuilder
                v-for="(r, index) in LocationRoutes"
                :key="index"
                :code="r.permissions"
              >
                <li>
                  <router-link :to="r.link" :data-title="$t(r.name)">
                    <component v-if="!open" :is="r.icon" class="route-icon" />
                    <span>{{ $t(r.name) }}</span>
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

    <PermissionBuilder
      :code="LockUpsRoutes?.map((item) => item.permissions.map((item) => item)).flat()"
    >
      <Accordion v-model:value="LoackupsAccordion">
        <AccordionPanel value="4">
          <AccordionHeader>
            <div class="links-header">
              <Locaps />
              {{ $t('Lockups') }}
            </div>
          </AccordionHeader>

          <AccordionContent>
            <ul>
              <PermissionBuilder
                v-for="(orgroute, index) in LockUpsRoutes"
                :key="index"
                :code="orgroute?.permissions"
              >
                <li>
                  <router-link :to="orgroute.link" :data-title="$t(orgroute.name)">
                    <component v-if="!open" :is="orgroute.icon" class="route-icon" />
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

    <PermissionBuilder
      :code="TicketRoutes?.map((item) => item.permissions.map((item) => item)).flat()"
    >
      <Accordion v-model:value="TicketAccordion">
        <AccordionPanel value="7">
          <AccordionHeader>
            <div class="links-header">
              <GeerIcon />
              {{ $t('support') }}
            </div>
          </AccordionHeader>

          <AccordionContent>
            <ul>
              <PermissionBuilder
                v-for="(ticketroute, index) in TicketRoutes"
                :key="index"
                :code="ticketroute?.permissions"
              >
                <li>
                  <router-link :to="ticketroute.link" :data-title="$t(ticketroute.name)">
                    <component v-if="!open" :is="ticketroute.icon" class="route-icon" />
                    <span>{{ $t(ticketroute.name) }}</span>
                  </router-link>
                </li>
              </PermissionBuilder>
            </ul>
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel class="active-panel-out" v-if="SelectedTicketRoutes && !TicketAccordion">
          <span>{{ SelectedTicketRoutes }}</span>
        </AccordionPanel>
      </Accordion>
    </PermissionBuilder>
  </template>
</template>

<style scoped>
.icon-strip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 0;
  overflow-y: auto;
  flex: 1;
  scrollbar-width: none;
}

.icon-strip::-webkit-scrollbar {
  display: none;
}

.icon-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 8px;
  color: #aaaaaa;
  transition:
    background 0.2s ease,
    color 0.2s ease;
  position: relative;
  text-decoration: none;
  flex-shrink: 0;
}

.icon-item:hover,
.icon-item.router-link-active {
  background: rgba(31, 65, 187, 0.08);
  color: var(--PrimaryColor);
}

.strip-icon {
  width: 20px;
  height: 20px;
}

.route-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  opacity: 0.7;
}

/* ---------------------------------------------------------------- */
/* Custom popover tooltip (replaces native `title` attribute)        */
/* Driven entirely by `data-title`, fully styleable & themeable.     */
/* ---------------------------------------------------------------- */

.icon-item::before,
.icon-item::after {
  pointer-events: none;
  opacity: 0;
  position: absolute;
  inset-inline-start: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%) translateX(-4px);
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
  transition-delay: 0s;
  z-index: 999;
}

/* Tooltip bubble */
.icon-item::after {
  content: attr(data-title);
  background: #1f1f1f;
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  white-space: nowrap;
  font-size: 12px;
  line-height: 1.4;
  font-family: 'Regular', sans-serif;
  box-shadow:
    0 4px 10px rgba(0, 0, 0, 0.18),
    0 1px 3px rgba(0, 0, 0, 0.12);
}

/* Arrow pointing back at the icon */
.icon-item::before {
  content: '';
  inset-inline-start: calc(100% + 4px);
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-inline-end: 6px solid #1f1f1f;
  transform: translateY(-50%) translateX(-4px);
}

.icon-item:hover::after,
.icon-item:hover::before {
  opacity: 0;
  transform: translateY(-50%) translateX(0);
  transition-delay: 0.25s;
}

.hover-tooltip {
  position: fixed;
  transform: translateY(-50%);
  background: #1f1f1f;
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  white-space: nowrap;
  font-size: 12px;
  line-height: 1.4;
  font-family: 'Regular', sans-serif;
  box-shadow:
    0 4px 10px rgba(0, 0, 0, 0.18),
    0 1px 3px rgba(0, 0, 0, 0.12);
  pointer-events: none;
  z-index: 9999;
}

.hover-tooltip::before {
  content: '';
  position: absolute;
  top: 50%;
  right: 100%;
  width: 0;
  height: 0;
  transform: translateY(-50%);
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 6px solid #1f1f1f;
}

.hover-tooltip-fade-enter-active,
.hover-tooltip-fade-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.hover-tooltip-fade-enter-from,
.hover-tooltip-fade-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(-4px);
}
</style>
