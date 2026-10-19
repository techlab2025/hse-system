<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { useRoute, useRouter, type RouteLocationRaw } from 'vue-router'
import { canOrganizationRoute } from '@/features/permission/Presentation/Helpers/organization_authorization'
import { useI18n } from 'vue-i18n'
import SidebarUnicon from '@/shared/icons/SidebarUnicon.vue'
import { useProjectAppStatusStore } from '@/stores/ProjectStatus'
// import { EquipmentTypeEnum } from '@/features/Home/core/enums/SettingEnum/EquipmentTypeEnum'

const props = defineProps<{ open: boolean }>()

const route = useRoute()
const router = useRouter()
const canNavigate = (link: Routes['link']) => {
  try {
    return canOrganizationRoute(router.resolve(link as RouteLocationRaw))
  } catch {
    return false
  }
}
const accessibleRoutes = (routes: Routes[]): Routes[] =>
  routes.flatMap((item) => {
    const children = item.children ? accessibleRoutes(item.children) : []
    const allowed = canNavigate(item.link)
    if (!allowed && !children.length) return []
    return [{ ...item, link: allowed ? item.link : children[0]!.link, children }]
  })
interface Routes {
  link: string | object
  name: string
  permissions: PermissionsEnum[]
  icon: string
  activePrefixes?: string[]
  children?: Routes[]
}
const { t } = useI18n()

const GauideRoutes = ref<Routes[]>([
  {
    link: '/organization/project-progress',
    name: 'overview',
    icon: 'dashboard',
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
    name: 'Projects',
    icon: 'briefcase-alt',
    permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },
  // {
  //   link: '/organization/today-talks',
  //   name: 'Today Talks',
  //   icon: 'comment-alt-message',
  //   permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  // },
  {
    link: '/organization/equipments',
    name: 'equipment',
    icon: 'hard-hat',
    permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
    children: [
      {
        link: `/organization/equipments?equipment_type=${3}`,
        name: 'Tools',
        icon: 'wrench',
        permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
      },
      {
        link: `/organization/equipments?equipment_type=${2}`,
        name: 'Devices',
        icon: 'desktop',
        permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
      },
      {
        link: `/organization/equipments?equipment_type=${1}`,
        name: 'Machines',
        icon: 'setting',
        permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
      },
    ],
  },
  {
    link: '/organization/equipment-mangement/incedant?isAll=1',
    name: 'Incidents',
    icon: 'exclamation-triangle',
    permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },

  {
    link: '/organization/equipment-mangement/observation?isAll=1&type=2',
    name: 'observations',
    icon: 'eye',
    permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },
  {
    link: '/organization/equipment-mangement/inspection?inspectionType=1',
    name: 'Inspection',
    icon: 'clipboard-notes',
    permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },

  {
    link: '/organization/Investigating',
    name: 'investigations',
    icon: 'search-alt',
    permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },
  {
    link: '/organization/capa',
    name: 'CAPA',
    icon: 'shield-check',
    permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },

  // {
  //   link: '/organization/management-of-change',
  //   name: 'Management Of Change',
  //   icon: 'file-contract',
  //   permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  // },
])

const CompanyRoutes = ref<Routes[]>([
  {
    link: '/organization/inductions',
    name: 'Inductions',
    icon: 'book-open',
    activePrefixes: ['/organization/induction'],
    permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },
  {
    link: '/organization/ppe-matrix',
    name: 'PPE Matrix & Log',
    icon: 'shield-check',
    // activePrefixes: ['/organization/ppe-'],
    permissions: [
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.ORG_PPE_ACTIVITY_ALL,
      PermissionsEnum.ORG_PPE_ACTIVITY_FETCH,
      PermissionsEnum.ORG_PPE_ACTIVITY_CREATE,
      PermissionsEnum.ORG_PPE_ACTIVITY_UPDATE,
      PermissionsEnum.ORG_PPE_TOOLS_ALL,
      PermissionsEnum.ORG_PPE_TOOLS_FETCH,
      PermissionsEnum.ORG_PPE_TOOLS_CREATE,
      PermissionsEnum.ORG_PPE_TOOLS_UPDATE,
    ],
  },
  {
    link: '/organization/objectives',
    name: 'objectives',
    icon: 'crosshair',
    activePrefixes: ['/organization/objectives'],
    permissions: [
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.OBJECTIVE_ORG_ALL,
      PermissionsEnum.OBJECTIVE_ORG_FETCH,
      PermissionsEnum.OBJECTIVE_ORG_DETAILS,
      PermissionsEnum.OBJECTIVE_ORG_CREATE,
      PermissionsEnum.OBJECTIVE_ORG_UPDATE,
      PermissionsEnum.OBJECTIVE_ORG_DELETE,
    ],
  },
  {
    link: '/organization/internal-audit/register',
    name: 'Internal Audit',
    icon: 'clipboard-notes',
    activePrefixes: ['/organization/internal-audit/register'],
    permissions: [
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.INTERNAL_AUDIT_ALL,
      PermissionsEnum.INTERNAL_AUDIT_FETCH,
      PermissionsEnum.INTERNAL_AUDIT_DETAILS,
      PermissionsEnum.INTERNAL_AUDIT_CREATE,
      PermissionsEnum.INTERNAL_AUDIT_UPDATE,
      PermissionsEnum.INTERNAL_AUDIT_DELETE,
    ],
  },
  {
    link: '/organization/my-internal-audit',
    name: 'My Internal Audit',
    icon: 'clipboard-notes',
    activePrefixes: ['/organization/my-internal-audit'],
    permissions: [
      PermissionsEnum.ADMIN,
      PermissionsEnum.MY_INTERNAL_AUDIT_ALL,
      PermissionsEnum.MY_INTERNAL_AUDIT_FETCH,
      PermissionsEnum.MY_INTERNAL_AUDIT_DETAILS,
      PermissionsEnum.MY_INTERNAL_AUDIT_CREATE,
    ],
  },
])

const OrganizationRoutes = ref<Routes[]>([
  {
    link: '/organization/system-identity',
    name: 'system_preferences',
    icon: 'palette',
    permissions: [
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_ALL,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
    ],
  },
  {
    link: '/organization/certificate',
    name: 'certificates',
    icon: 'award',
    permissions: [
      PermissionsEnum.CERTIFICATE_ALL,
      PermissionsEnum.CERTIFICATE_CREATE,
      PermissionsEnum.CERTIFICATE_DELETE,
      PermissionsEnum.CERTIFICATE_FETCH,
      PermissionsEnum.CERTIFICATE_UPDATE,
    ],
  },
  {
    link: '/organization/organization-certificate',
    name: 'organization_certificate',
    icon: 'award',
    permissions: [
      PermissionsEnum.ORGANIZATION_CERTIFICATE_ALL,
      PermissionsEnum.ORGANIZATION_CERTIFICATE_CREATE,
      PermissionsEnum.ORGANIZATION_CERTIFICATE_DELETE,
      PermissionsEnum.ORGANIZATION_CERTIFICATE_FETCH,
      PermissionsEnum.ORGANIZATION_CERTIFICATE_UPDATE,
    ],
  },
  {
    link: '/organization/organization-documents',
    name: 'organization_documents',
    icon: 'award',
    permissions: [
      PermissionsEnum.ORGANIZATION_DOCUMENTS_ALL,
      PermissionsEnum.ORGANIZATION_DOCUMENTS_CREATE,
      PermissionsEnum.ORGANIZATION_DOCUMENTS_DELETE,
      PermissionsEnum.ORGANIZATION_DOCUMENTS_FETCH,
      PermissionsEnum.ORGANIZATION_DOCUMENTS_UPDATE,
    ],
  },
  {
    link: '/organization/template',
    name: 'templates',
    icon: 'book-open',
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
    name: 'positions',
    icon: 'sitemap',
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
    name: 'employees',
    icon: 'users-alt',
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
    name: 'team',
    icon: 'user-check',
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
    name: 'sub contractors',
    icon: 'constructor',
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
    name: 'roles',
    icon: 'shield-check',
    permissions: [
      PermissionsEnum.ORG_ROLE_ALL,
      PermissionsEnum.ORG_ROLE_CREATE,
      PermissionsEnum.ORG_ROLE_DELETE,
      PermissionsEnum.ORG_ROLE_FETCH,
      PermissionsEnum.ORG_ROLE_UPDATE,
    ],
  },
  {
    link: '/organization/notification-plan',
    name: 'notification_plan',
    icon: 'ticket',
    permissions: [
      PermissionsEnum.NOTIFICATION_PLAN_ALL,
      PermissionsEnum.NOTIFICATION_PLAN_CREATE,
      PermissionsEnum.NOTIFICATION_PLAN_FETCH,
      PermissionsEnum.NOTIFICATION_PLAN_UPDATE,
    ],
  },
  {
    link: '/organization/attachment-matrix',
    name: 'Attachment Matrix',
    icon: 'file-check-alt',
    permissions: [
      PermissionsEnum.ATTACHMENT_MATRIX_ALL,
      PermissionsEnum.ATTACHMENT_MATRIX_FETCH,
      PermissionsEnum.ATTACHMENT_MATRIX_CREATE,
    ],
  },
  {
    link: '/organization/scope',
    name: 'contractor_scope',
    icon: 'crosshair',
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
    name: 'warehouse',
    icon: 'store',
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
    name: 'employee_certificate',
    icon: 'file-plus-alt',
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
    name: 'coding_system',
    icon: 'qrcode-scan',
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
    name: 'risk',
    icon: 'shield-exclamation',
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
    name: 'factor',
    icon: 'exclamation-octagon',
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
    name: 'factor item',
    icon: 'circle-layer',
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
    icon: 'file-contract',
    permissions: [
      PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_ALL,
      PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_CREATE,
      PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_DELETE,
      PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_FETCH,
      PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_UPDATE,
    ],
  },
  {
    link: '/organization/shifts',
    name: 'shifts',
    icon: 'clock',
    permissions: [
      PermissionsEnum.ORG_SHIFT_ALL,
      PermissionsEnum.ORG_SHIFT_CREATE,
      PermissionsEnum.ORG_SHIFT_DELETE,
      PermissionsEnum.ORG_SHIFT_FETCH,
      PermissionsEnum.ORG_SHIFT_UPDATE,
    ],
  },
])

const TicketRoutes = ref<Routes[]>([
  {
    link: '/organization/ticket',
    name: 'support',
    icon: 'ticket',
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
  // {
  //   link: '/organization/countries',
  //   name: 'country',
  //   icon: 'globe',
  //   permissions: [
  //     PermissionsEnum?.ORGANIZATION_EMPLOYEE,
  //     PermissionsEnum?.LOCATION_ORG_ALL,
  //     PermissionsEnum.LOCATION_ORG_CREATE,
  //     PermissionsEnum.LOCATION_ORG_UPDATE,
  //     PermissionsEnum.LOCATION_ORG_DETAILS,
  //     PermissionsEnum.LOCATION_ORG_DELETE,
  //     PermissionsEnum.LOCATION_ORG_FETCH,
  //   ],
  // },
  // {
  //   link: '/organization/states',
  //   name: 'state',
  //   icon: 'map-marker-alt',
  //   permissions: [
  //     PermissionsEnum?.ORGANIZATION_EMPLOYEE,
  //     PermissionsEnum?.LOCATION_ORG_ALL,
  //     PermissionsEnum.LOCATION_ORG_CREATE,
  //     PermissionsEnum.LOCATION_ORG_UPDATE,
  //     PermissionsEnum.LOCATION_ORG_DETAILS,
  //     PermissionsEnum.LOCATION_ORG_DELETE,
  //     PermissionsEnum.LOCATION_ORG_FETCH,
  //   ],
  // },
  // {
  //   link: '/organization/cities',
  //   name: 'city',
  //   icon: 'map',
  //   permissions: [
  //     PermissionsEnum?.ORGANIZATION_EMPLOYEE,
  //     PermissionsEnum?.LOCATION_ORG_ALL,
  //     PermissionsEnum.LOCATION_ORG_CREATE,
  //     PermissionsEnum.LOCATION_ORG_UPDATE,
  //     PermissionsEnum.LOCATION_ORG_DETAILS,
  //     PermissionsEnum.LOCATION_ORG_DELETE,
  //     PermissionsEnum.LOCATION_ORG_FETCH,
  //   ],
  // },
  {
    link: '/organization/areas',
    name: 'location',
    icon: 'location-point',
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
    name: 'zones',
    icon: 'map-pin-alt',
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
    link: '/organization/ppe-activities',
    name: 'PPE Activity',
    icon: 'shield-check',
    permissions: [
      PermissionsEnum.ORG_PPE_ACTIVITY_ALL,
      PermissionsEnum.ORG_PPE_ACTIVITY_FETCH,
      PermissionsEnum.ORG_PPE_ACTIVITY_DETAILS,
      PermissionsEnum.ORG_PPE_ACTIVITY_CREATE,
      PermissionsEnum.ORG_PPE_ACTIVITY_UPDATE,
      PermissionsEnum.ORG_PPE_ACTIVITY_DELETE,
    ],
  },
  {
    link: '/organization/ppe-tools',
    name: 'PPE Tools',
    icon: 'shield-check',
    permissions: [
      PermissionsEnum.ORG_PPE_TOOLS_ALL,
      PermissionsEnum.ORG_PPE_TOOLS_FETCH,
      PermissionsEnum.ORG_PPE_TOOLS_DETAILS,
      PermissionsEnum.ORG_PPE_TOOLS_CREATE,
      PermissionsEnum.ORG_PPE_TOOLS_UPDATE,
      PermissionsEnum.ORG_PPE_TOOLS_DELETE,
    ],
  },
  {
    link: '/organization/document-categories',
    name: 'Document Categories',
    icon: 'folder',
    permissions: [
      PermissionsEnum.ORG_DOCUMENT_CATEGORY_ALL,
      PermissionsEnum.ORG_DOCUMENT_CATEGORY_FETCH,
      PermissionsEnum.ORG_DOCUMENT_CATEGORY_DETAILS,
      PermissionsEnum.ORG_DOCUMENT_CATEGORY_CREATE,
      PermissionsEnum.ORG_DOCUMENT_CATEGORY_UPDATE,
      PermissionsEnum.ORG_DOCUMENT_CATEGORY_DELETE,
    ],
  },
  {
    link: '/organization/audit-standards',
    name: 'Audit Standards',
    icon: 'shield-check',
    permissions: [
      PermissionsEnum.ORG_AUDIT_STANDARDS_ALL,
      PermissionsEnum.ORG_AUDIT_STANDARDS_FETCH,
      PermissionsEnum.ORG_AUDIT_STANDARDS_DETAILS,
      PermissionsEnum.ORG_AUDIT_STANDARDS_CREATE,
      PermissionsEnum.ORG_AUDIT_STANDARDS_UPDATE,
      PermissionsEnum.ORG_AUDIT_STANDARDS_DELETE,
    ],
  },
  {
    link: '/organization/audit-activities',
    name: 'Audit Activities',
    icon: 'shield-check',
    permissions: [
      PermissionsEnum.ORG_AUDIT_ACTIVITIES_ALL,
      PermissionsEnum.ORG_AUDIT_ACTIVITIES_FETCH,
      PermissionsEnum.ORG_AUDIT_ACTIVITIES_DETAILS,
      PermissionsEnum.ORG_AUDIT_ACTIVITIES_CREATE,
      PermissionsEnum.ORG_AUDIT_ACTIVITIES_UPDATE,
      PermissionsEnum.ORG_AUDIT_ACTIVITIES_DELETE,
    ],
  },
  {
    link: '/organization/ppe-items',
    name: 'ppe_items',
    icon: 'shield-check',
    permissions: [
      PermissionsEnum.ORG_PPE_ITEM_ALL,
      PermissionsEnum.ORG_PPE_ITEM_FETCH,
      PermissionsEnum.ORG_PPE_ITEM_DETAILS,
      PermissionsEnum.ORG_PPE_ITEM_CREATE,
      PermissionsEnum.ORG_PPE_ITEM_UPDATE,
      PermissionsEnum.ORG_PPE_ITEM_DELETE,
    ],
  },
  {
    link: '/organization/visit-activities',
    name: 'visit_activities',
    icon: 'clipboard-notes',
    permissions: [
      PermissionsEnum.ORG_VISIT_ACTIVITIES_ALL,
      PermissionsEnum.ORG_VISIT_ACTIVITIES_FETCH,
      PermissionsEnum.ORG_VISIT_ACTIVITIES_DETAILS,
      PermissionsEnum.ORG_VISIT_ACTIVITIES_CREATE,
      PermissionsEnum.ORG_VISIT_ACTIVITIES_UPDATE,
      PermissionsEnum.ORG_VISIT_ACTIVITIES_DELETE,
    ],
  },
  {
    link: '/organization/visit-themes',
    name: 'visit_themes',
    icon: 'clipboard-notes',
    permissions: [
      PermissionsEnum.ORG_VISIT_THEME_ALL,
      PermissionsEnum.ORG_VISIT_THEME_FETCH,
      PermissionsEnum.ORG_VISIT_THEME_DETAILS,
      PermissionsEnum.ORG_VISIT_THEME_CREATE,
      PermissionsEnum.ORG_VISIT_THEME_UPDATE,
      PermissionsEnum.ORG_VISIT_THEME_DELETE,
    ],
  },
  {
    link: '/organization/visit-categories',
    name: 'visit_categories',
    icon: 'clipboard-notes',
    permissions: [
      PermissionsEnum.ORG_VISIT_CATEGORY_ALL,
      PermissionsEnum.ORG_VISIT_CATEGORY_FETCH,
      PermissionsEnum.ORG_VISIT_CATEGORY_DETAILS,
      PermissionsEnum.ORG_VISIT_CATEGORY_CREATE,
      PermissionsEnum.ORG_VISIT_CATEGORY_UPDATE,
      PermissionsEnum.ORG_VISIT_CATEGORY_DELETE,
    ],
  },
  {
    link: '/organization/drill-types',
    name: 'drill_types',
    icon: 'clipboard-notes',
    permissions: [
      PermissionsEnum.ORG_DRILL_TYPE_ALL,
      PermissionsEnum.ORG_DRILL_TYPE_FETCH,
      PermissionsEnum.ORG_DRILL_TYPE_DETAILS,
      PermissionsEnum.ORG_DRILL_TYPE_CREATE,
      PermissionsEnum.ORG_DRILL_TYPE_UPDATE,
      PermissionsEnum.ORG_DRILL_TYPE_DELETE,
    ],
  },
  {
    link: '/organization/where-house-type',
    name: 'warehouse_types',
    icon: 'store-alt',
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
    name: 'hazard_classifications',
    icon: 'shield-exclamation',
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
    name: 'incident_types',
    icon: 'exclamation-octagon',
    permissions: [
      PermissionsEnum.ACCIDENTS_TYPE_ALL,
      PermissionsEnum.ACCIDENTS_TYPE_FETCH,
      PermissionsEnum.ACCIDENTS_TYPE_DETAILS,
      PermissionsEnum.ACCIDENTS_TYPE_CREATE,
      PermissionsEnum.ACCIDENTS_TYPE_UPDATE,
      PermissionsEnum.ACCIDENTS_TYPE_DELETE,
    ],
  },
  // {
  //   link: '/organization/incident-category',
  //   name: 'incident_categories',
  //   icon: 'list-ui-alt',
  //   permissions: [
  //     PermissionsEnum.ACCIDENTS_TYPE_ALL,
  //     PermissionsEnum.ACCIDENTS_TYPE_FETCH,
  //     PermissionsEnum.ACCIDENTS_TYPE_DETAILS,
  //     PermissionsEnum.ACCIDENTS_TYPE_CREATE,
  //     PermissionsEnum.ACCIDENTS_TYPE_UPDATE,
  //     PermissionsEnum.ACCIDENTS_TYPE_DELETE,
  //   ],
  // },
  {
    link: '/organization/observation-type',
    name: 'observation_type',
    icon: 'eye',
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
    name: 'equipment_types',
    icon: 'wrench',
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
    name: 'root_causes',
    icon: 'sitemap',
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
    name: 'injury',
    icon: 'medical-square',
    permissions: [
      PermissionsEnum.INJURY_ALL,
      PermissionsEnum.INJURY_CREATE,
      PermissionsEnum.INJURY_DELETE,
      PermissionsEnum.INJURY_FETCH,
      PermissionsEnum.INJURY_UPDATE,
    ],
  },
  {
    link: '/organization/meeting-types',
    name: 'meeting-types',
    icon: 'medical-square',
    permissions: [
      PermissionsEnum.ORG_MEETING_TYPE_ALL,
      PermissionsEnum.ORG_MEETING_TYPE_CREATE,
      PermissionsEnum.ORG_MEETING_TYPE_DELETE,
      PermissionsEnum.ORG_MEETING_TYPE_FETCH,
      PermissionsEnum.ORG_MEETING_TYPE_UPDATE,
    ],
  },
  {
    link: '/organization/ptw-types',
    name: 'ptw-types',
    icon: 'medical-square',
    permissions: [
      PermissionsEnum.ORG_PTW_TYPE_ALL,
      PermissionsEnum.ORG_PTW_TYPE_CREATE,
      PermissionsEnum.ORG_PTW_TYPE_DELETE,
      PermissionsEnum.ORG_PTW_TYPE_FETCH,
      PermissionsEnum.ORG_PTW_TYPE_UPDATE,
    ],
  },
  {
    link: '/organization/management-change-topic-type',
    name: 'Management Change Topic Type',
    icon: 'sitemap',
    permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },
  {
    link: '/organization/traning-topics',
    name: 'traning_topics',
    icon: 'medical-square',
    permissions: [
      PermissionsEnum.ORG_TRANING_TOPIC_ALL,
      PermissionsEnum.ORG_TRANING_TOPIC_FETCH,
      PermissionsEnum.ORG_TRANING_TOPIC_DETAILS,
      PermissionsEnum.ORG_TRANING_TOPIC_CREATE,
      PermissionsEnum.ORG_TRANING_TOPIC_UPDATE,
      PermissionsEnum.ORG_TRANING_TOPIC_DELETE,
    ],
  },
])
const ReportsRoutes = ref<Routes[]>([
  {
    link: '/organization/Investigating?isAll=1',
    name: 'investigation_report',
    icon: 'search-alt',
    permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },
  {
    link: '/organization/equipment-mangement/incident-report',
    name: 'incident_report',
    icon: 'exclamation-triangle',
    permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },
  {
    link: '/organization/equipment-mangement/observation-report',
    name: 'observation report',
    icon: 'eye',
    permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },
  {
    link: '/organization/corrective-report',
    name: 'corrective_report',
    icon: 'file-check-alt',
    permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },
  {
    link: '/organization/preventive-report',
    name: 'preventive_report',
    icon: 'clipboard-notes',
    permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },
  {
    link: '/organization/lessons-learnt-report',
    name: 'lessons_learnt_report',
    icon: 'lightbulb-alt',
    permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },
])
const projectAppStatusStore = useProjectAppStatusStore()

const shouldShowOverviewGroup = computed(() => {
  return projectAppStatusStore.getProjectAppStatus()?.progress !== 100
})

interface RouteGroup {
  key: string
  label: string
  eyebrow: string
  icon: string
  routes: Routes[]
  permissions: PermissionsEnum[]
  adminOnly?: boolean
}

const flattenPermissions = (routes: Routes[]): PermissionsEnum[] =>
  routes.flatMap((item) => [
    ...item.permissions,
    ...(item.children ? flattenPermissions(item.children) : []),
  ])

const routeGroups = computed<RouteGroup[]>(() => {
  const groups: RouteGroup[] = [
    {
      key: 'overview',
      label: t('overview'),
      eyebrow: t('overview'),
      icon: 'dashboard',
      routes: GauideRoutes.value,
      permissions: flattenPermissions(GauideRoutes.value),
      adminOnly: true,
    },
    {
      key: 'operations',
      label: t('project managment'),
      eyebrow: t('project managment'),
      icon: 'briefcase-alt',
      routes: OperationsRoutes.value,
      permissions: flattenPermissions(OperationsRoutes.value),
    },
    {
      key: 'company',
      label: t('Company'),
      eyebrow: t('Company'),
      icon: 'building',
      routes: CompanyRoutes.value,
      permissions: flattenPermissions(CompanyRoutes.value),
    },
    {
      key: 'reports',
      label: t('reports'),
      eyebrow: t('reports'),
      icon: 'file-alt',
      routes: ReportsRoutes.value,
      permissions: flattenPermissions(ReportsRoutes.value),
    },
    {
      key: 'organization',
      label: t('organization_setting'),
      eyebrow: t('organization_setting'),
      icon: 'setting',
      routes: OrganizationRoutes.value,
      permissions: flattenPermissions(OrganizationRoutes.value),
    },
    {
      key: 'locations',
      label: t('location'),
      eyebrow: t('location'),
      icon: 'map-marker-alt',
      routes: LocationRoutes.value,
      permissions: [PermissionsEnum.LOCATION_ORG_ALL],
    },
    {
      key: 'lockups',
      label: t('Lockups'),
      eyebrow: t('Lockups'),
      icon: 'lock',
      routes: LockUpsRoutes.value,
      permissions: flattenPermissions(LockUpsRoutes.value),
    },
    {
      key: 'support',
      label: t('support'),
      eyebrow: t('support'),
      icon: 'ticket',
      routes: TicketRoutes.value,
      permissions: flattenPermissions(TicketRoutes.value),
    },
  ]

  return groups
    .filter((group) => group.key !== 'overview' || shouldShowOverviewGroup.value)
    .map((group) => ({ ...group, routes: accessibleRoutes(group.routes) }))
    .filter((group) => group.routes.length > 0)
})

const activeRouteGroupKey = ref('operations')
const paneGroupKey = ref('operations')
const searchTerm = ref('')
const isPaneVisible = ref(false)
const sidePaneRoutesRef = ref<HTMLElement | null>(null)
let closePaneTimer: number | undefined

const isLinkActive = (link: Routes['link']) => {
  if (typeof link !== 'string') return false

  const [pathOnly, queryString] = link.split('?')
  if (!queryString) return route.path === pathOnly

  const expectedQuery = new URLSearchParams(queryString)
  return (
    route.path === pathOnly &&
    [...expectedQuery.entries()].every(([key, value]) => String(route.query[key] ?? '') === value)
  )
}

const isRouteActive = (sidebarRoute: Routes) =>
  isLinkActive(sidebarRoute.link) ||
  Boolean(sidebarRoute.activePrefixes?.some((prefix) => route.path.startsWith(prefix)))

const isParentLinkActive = (sidebarRoute: Routes) =>
  isRouteActive(sidebarRoute) && !sidebarRoute.children?.some((child) => isLinkActive(child.link))

const groupHasActiveRoute = (group: RouteGroup) =>
  group.routes.some(
    (item) => isRouteActive(item) || item.children?.some((child) => isRouteActive(child)),
  )

const activeGroup = computed(() => {
  return routeGroups.value.find((group) => group.key === paneGroupKey.value) || routeGroups.value[0]
})

const isSearching = computed(() => searchTerm.value.trim().length > 0)

const clearSearch = () => {
  searchTerm.value = ''
}

const visibleRouteGroups = computed<RouteGroup[]>(() => {
  const query = searchTerm.value.trim().toLocaleLowerCase()
  const groups = query ? routeGroups.value : activeGroup.value ? [activeGroup.value] : []

  return groups
    .map((group) => {
      const routes = query
        ? group.routes.filter((item) => {
            const routeName = t(item.name).toLocaleLowerCase()
            const groupName = group.label.toLocaleLowerCase()
            const hasMatchingChild = item.children?.some((child) =>
              t(child.name).toLocaleLowerCase().includes(query),
            )

            return routeName.includes(query) || groupName.includes(query) || hasMatchingChild
          })
        : group.routes

      return {
        ...group,
        routes,
      }
    })
    .filter((group) => group.routes.length > 0)
})

const selectGroup = (groupKey: string) => {
  paneGroupKey.value = groupKey
  searchTerm.value = ''
}

const activateRouteGroup = (groupKey: string) => {
  activeRouteGroupKey.value = groupKey
  paneGroupKey.value = groupKey
  hidePane()
}

const clearClosePaneTimer = () => {
  if (!closePaneTimer) return

  window.clearTimeout(closePaneTimer)
  closePaneTimer = undefined
}

const openGroup = (groupKey: string) => {
  clearClosePaneTimer()
  selectGroup(groupKey)
  isPaneVisible.value = true

  nextTick(() => {
    if (sidePaneRoutesRef.value) sidePaneRoutesRef.value.scrollTop = 0
  })
}

const keepPaneOpen = () => {
  clearClosePaneTimer()
}

const hidePane = () => {
  clearClosePaneTimer()
  isPaneVisible.value = false
  searchTerm.value = ''
}

const scheduleClosePane = () => {
  clearClosePaneTimer()

  closePaneTimer = window.setTimeout(() => {
    hidePane()
  }, 160)
}

watch(
  () => props.open,
  (open) => {
    if (!open) {
      hidePane()
    }
  },
)

watch(
  () => route.fullPath,
  () => {
    const currentRouteGroup = routeGroups.value.find(
      (group) => group.key === activeRouteGroupKey.value && groupHasActiveRoute(group),
    )
    const routeGroup =
      currentRouteGroup || routeGroups.value.find((group) => groupHasActiveRoute(group))

    if (routeGroup) {
      activeRouteGroupKey.value = routeGroup.key

      if (!isPaneVisible.value) {
        paneGroupKey.value = routeGroup.key
      }
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  clearClosePaneTimer()
})
</script>

<template>
  <div class="modern-sidebar hse-identity">
    <nav class="side-rail-nav" :aria-label="$t('main_sidebar_groups')">
      <template v-for="group in routeGroups" :key="group.key">

          <button
            type="button"
            :class="[
              'side-rail-btn',
              {
                'is-selected': isPaneVisible && paneGroupKey === group.key,
                'is-active': activeRouteGroupKey === group.key && groupHasActiveRoute(group),
              },
            ]"
            :title="group.label"
            :aria-expanded="isPaneVisible && paneGroupKey === group.key"
            aria-controls="organization-sidebar-pane"
            @click="openGroup(group.key)"
            @mouseenter="openGroup(group.key)"
            @mouseleave="scheduleClosePane"
            @focus="openGroup(group.key)"
            @blur="scheduleClosePane"
          >
            <SidebarUnicon :name="group.icon" class="strip-icon" />
            <span>{{ group.label }}</span>
          </button>

      </template>
    </nav>

    <Transition name="side-pane" :css="!!activeGroup">
      <aside
        v-if="isPaneVisible && activeGroup"
        id="organization-sidebar-pane"
        class="side-pane"
        @mouseenter="keepPaneOpen"
        @mouseleave="scheduleClosePane"
        @focusin="keepPaneOpen"
        @focusout="scheduleClosePane"
      >
        <header class="side-pane-header">
          <div class="side-pane-heading">
            <span class="side-pane-icon">
              <SidebarUnicon :name="activeGroup.icon" />
            </span>
            <div>
              <strong>{{ activeGroup.label }}</strong>
              <!-- <span>{{ activeGroup.eyebrow }}</span> -->
            </div>
          </div>

          <div class="sidebar-search" role="search">
            <span class="sidebar-search__icon-shell" aria-hidden="true">
              <SidebarUnicon name="search" class="sidebar-search__icon" />
            </span>
            <input
              v-model="searchTerm"
              type="search"
              class="sidebar-search__input"
              :placeholder="$t('search')"
              :aria-label="$t('search_all_sidebar_routes')"
              autocomplete="off"
              spellcheck="false"
              @keydown.esc="hidePane"
            />
            <button
              v-if="isSearching"
              type="button"
              class="sidebar-search__clear"
              :aria-label="$t('clear')"
              :title="$t('clear')"
              @click="clearSearch"
            >
              <SidebarUnicon name="times" />
            </button>
          </div>
        </header>

        <nav
          ref="sidePaneRoutesRef"
          class="side-pane-routes"
          :aria-label="$t('sidebar_group_routes', { group: activeGroup.label })"
        >
          <div class="side-pane-routes__inner">
            <template v-for="group in visibleRouteGroups" :key="group.key">
              <template v-if="isSearching">
                <p class="side-route-group-title">{{ group.label }}</p>
              </template>

              <template
                v-for="sidebarRoute in group.routes"
                :key="`${group.key}-${String(sidebarRoute.link)}`"
              >
                <div class="side-route-entry">
                  <router-link
                    :to="sidebarRoute.link"
                    active-class=""
                    exact-active-class=""
                    :aria-current-value="isParentLinkActive(sidebarRoute) ? 'page' : 'false'"
                    :class="['side-btn', { active: isParentLinkActive(sidebarRoute) }]"
                    :title="$t(sidebarRoute.name)"
                    @click="activateRouteGroup(group.key)"
                  >
                    <SidebarUnicon :name="sidebarRoute.icon" class="side-icon" />
                    <span class="side-label-wrap">
                      <span class="side-label">{{ $t(sidebarRoute.name) }}</span>
                      <span v-if="isSearching" class="side-label-parent">{{ group.label }}</span>
                    </span>
                  </router-link>

                  <div v-if="sidebarRoute.children?.length" class="side-route-children">
                    <template
                      v-for="childRoute in sidebarRoute.children"
                      :key="String(childRoute.link)"
                    >
                      <router-link
                        :to="childRoute.link"
                        active-class=""
                        exact-active-class=""
                        :aria-current-value="isLinkActive(childRoute.link) ? 'page' : 'false'"
                        :class="[
                          'side-btn side-btn--child',
                          { active: isLinkActive(childRoute.link) },
                        ]"
                        :title="$t(childRoute.name)"
                        @click="activateRouteGroup(group.key)"
                      >
                        <SidebarUnicon :name="childRoute.icon" class="side-icon" />
                        <span class="side-label">{{ $t(childRoute.name) }}</span>
                      </router-link>
                    </template>
                  </div>
                </div>
              </template>
            </template>

            <p v-if="!visibleRouteGroups.length" class="side-pane-empty">
              {{ $t('No Data Found') }}
            </p>
          </div>
        </nav>
      </aside>
    </Transition>
  </div>
</template>

<style scoped>
.modern-sidebar {
  display: flex;
  flex: 1 1 auto;
  min-height: 0;
  color: var(--hse-nav-text);
}
.side-rail-nav {
  display: flex;
  flex: 0 0 74px;
  flex-direction: column;
  gap: 6px;
  width: 74px;
  padding: 8px 0 16px;
  overflow-y: auto;
  scrollbar-width: none;
}
.side-rail-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 6px;
  width: 74px;
  min-height: 62px;
  padding: 9px 5px;
  border: 0;
  border-radius: 11px;
  background: transparent;
  color: var(--hse-nav-text);
  cursor: pointer;
  text-align: center;
  transition:
    background 180ms ease,
    color 180ms ease;
}
.side-rail-btn:hover {
  background: rgb(255 255 255 / 6%);
  color: #fff;
}
.side-rail-btn:is(.is-selected, .is-active) {
  background: var(--hse-nav-active);
  color: #fff;
  box-shadow: inset 3px 0 var(--hse-nav-accent);
}
.side-rail-btn:is(.is-selected, .is-active):dir(rtl) {
  box-shadow: inset -3px 0 var(--hse-nav-accent);
}
.side-rail-btn span {
  font: 600 10px/1.35 var(--hse-project-font);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  max-width: 64px;
  overflow: hidden;
  overflow-wrap: normal;
}
.strip-icon,
.side-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: currentColor;
}
:is(.strip-icon, .side-icon, .side-pane-icon, .sidebar-search__icon) :deep(svg) {
  width: 100%;
  height: 100%;
}
.side-pane {
  position: fixed;
  inset-block: 0;
  inset-inline-start: 90px;
  z-index: 10060;
  display: flex;
  flex-direction: column;
  width: 316px;
  max-width: calc(100vw - 90px);
  height: 100dvh;
  padding: 22px 16px 14px;
  overflow: hidden;
  background: var(--hse-nav-background);
  border-inline-end: 1px solid rgb(255 255 255 / 10%);
  box-shadow: 8px 0 26px rgb(11 40 74 / 10%);
}
.side-pane-header {
  display: grid;
  gap: 18px;
  flex-shrink: 0;
}
.side-pane-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.side-pane-heading strong {
  color: #fff;
  font: 700 16px/1.4 var(--hse-project-font);
}
.side-pane-icon {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  padding: 9px;
  border-radius: 11px;
  background: var(--hse-nav-active);
  color: #9bbdff;
  flex-shrink: 0;
}
.sidebar-search {
  position: relative;
  display: flex;
  align-items: center;
  gap: 9px;
  min-height: 46px;
  padding: 6px 7px;
  border: 1px solid color-mix(in srgb, var(--hse-nav-text) 22%, transparent);
  border-radius: var(--hse-control-radius, 9px) !important;
  background: color-mix(in srgb, #fff 7%, transparent);
  color: var(--hse-nav-text);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 4%);
  transition:
    border-color 160ms ease,
    background 160ms ease,
    box-shadow 160ms ease;
}
.sidebar-search:hover {
  border-color: color-mix(in srgb, var(--hse-nav-accent) 48%, transparent);
  background: color-mix(in srgb, #fff 9%, transparent);
}
.sidebar-search:focus-within {
  border-color: var(--hse-nav-accent);
  background: color-mix(in srgb, #fff 10%, transparent);
  box-shadow:
    0 0 0 3px color-mix(in srgb, var(--hse-nav-accent) 18%, transparent),
    inset 0 1px 0 rgb(255 255 255 / 5%);
}
.sidebar-search__icon-shell {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  border: 1px solid color-mix(in srgb, var(--hse-nav-accent) 25%, transparent);
  border-radius: var(--hse-control-radius, 9px);
  background: var(--hse-nav-active);
  color: color-mix(in srgb, var(--hse-nav-accent) 82%, #fff);
  transition:
    background 160ms ease,
    color 160ms ease;
}
.sidebar-search:focus-within .sidebar-search__icon-shell {
  background: color-mix(in srgb, var(--hse-nav-accent) 22%, transparent);
  color: #fff;
}
.modern-sidebar .sidebar-search__input {
  appearance: none;
  width: 100%;
  min-width: 0;
  min-height: 32px;
  margin: 0;
  border: 0 !important;
  border-radius: 0 !important;
  padding: 0 !important;
  box-shadow: none !important;
  outline: 0 !important;
  background: transparent !important;
  color: #fff;
  caret-color: var(--hse-nav-accent);
  font: 500 13px/1.5 var(--hse-project-font);
}
.modern-sidebar .sidebar-search__input:focus-visible {
  outline: 0;
}
.sidebar-search__icon {
  width: 17px;
  height: 17px;
  color: currentColor;
}
.sidebar-search__input::placeholder {
  color: color-mix(in srgb, var(--hse-nav-text) 82%, transparent);
  opacity: 1;
}
.sidebar-search__input::-webkit-search-cancel-button {
  display: none;
}
.sidebar-search__clear {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  flex: 0 0 30px;
  padding: 0;
  border: 0;
  border-radius: var(--hse-control-radius, 9px) !important;
  background: transparent;
  color: var(--hse-nav-text);
  cursor: pointer;
  transition:
    background 160ms ease,
    color 160ms ease;
}
.sidebar-search__clear:hover,
.sidebar-search__clear:focus-visible {
  background: var(--hse-nav-active);
  color: #fff;
  outline: none;
}
.sidebar-search__clear :deep(svg) {
  width: 16px;
  height: 16px;
}
.side-pane-routes {
  flex: 1;
  min-height: 0;
  margin-top: 18px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: #36516c transparent;
}
.side-pane-routes__inner {
  display: grid;
  gap: 5px;
  padding-bottom: 16px;
}
.side-route-entry {
  display: grid;
  gap: 4px;
}
.side-route-children {
  display: grid;
  gap: 4px;
  margin-inline-start: 22px;
  padding-inline-start: 8px;
  border-inline-start: 1px solid rgb(255 255 255 / 14%);
}
.side-route-group-title {
  margin: 14px 10px 4px;
  color: #9fb6d2;
  font: 600 11px/1.4 var(--hse-project-font);
}
.side-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 10px 11px;
  border: 0;
  border-radius: 11px;
  color: var(--hse-nav-text);
  text-decoration: none;
  transition:
    background 180ms ease,
    color 180ms ease;
}
.side-btn:hover {
  background: rgb(255 255 255 / 6%);
  color: #fff;
}
.side-btn.active {
  background: var(--hse-nav-active);
  color: #fff;
  box-shadow: inset 3px 0 var(--hse-nav-accent);
}
.side-btn.active:dir(rtl) {
  box-shadow: inset -3px 0 var(--hse-nav-accent);
}
.side-btn--child {
  min-height: 36px;
  padding: 8px 10px;
}
.side-btn--child .side-icon {
  width: 17px;
  height: 17px;
}
.side-label-wrap {
  display: grid;
  min-width: 0;
  flex: 1;
  gap: 3px;
}
.side-label {
  min-width: 0;
  font: 600 12px/1.5 var(--hse-project-font);
  overflow-wrap: anywhere;
}
.side-label-parent {
  font: 400 10px/1.4 var(--hse-project-font);
  color: #9fb6d2;
}
.side-pane-empty {
  padding: 18px 0;
  color: var(--hse-nav-text);
  text-align: center;
  font-size: 13px;
}
.side-pane-enter-active,
.side-pane-leave-active {
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}
.side-pane-enter-from,
.side-pane-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
.side-pane-enter-from:dir(rtl),
.side-pane-leave-to:dir(rtl) {
  transform: translateX(10px);
}
@media (max-width: 768px) {
  .side-pane {
    width: calc(100vw - 90px);
    padding: 18px 12px;
  }
}
@media (prefers-reduced-motion: reduce) {
  *,
  .side-pane-enter-active,
  .side-pane-leave-active {
    transition: none;
  }
}
</style>
