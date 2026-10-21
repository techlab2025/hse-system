import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'

export interface SidebarRoute {
  link: string | object
  name: string
  permissions: PermissionsEnum[]
  icon: string
  activePrefixes?: string[]
  children?: SidebarRoute[]
}

const GauideRoutes: SidebarRoute[] = [
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
]

const OperationsRoutes: SidebarRoute[] = [
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
]

const CompanyRoutes: SidebarRoute[] = [
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
]

const OrganizationRoutes: SidebarRoute[] = [
  // {
  //   link: '/organization/integrations/email',
  //   name: 'email_integration',
  //   icon: 'envelope',
  //   permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_ALL, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  // },
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
]

const TicketRoutes: SidebarRoute[] = [
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
]
const LocationRoutes: SidebarRoute[] = [
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
]

const LockUpsRoutes: SidebarRoute[] = [
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
]
const ReportsRoutes: SidebarRoute[] = [
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
]

export const organizationNavigation = [
  { key: 'overview', label: 'overview', icon: 'dashboard', routes: GauideRoutes },
  {
    key: 'operations',
    label: 'project managment',
    icon: 'briefcase-alt',
    routes: OperationsRoutes,
  },
  { key: 'company', label: 'Company', icon: 'building', routes: CompanyRoutes },
  { key: 'reports', label: 'reports', icon: 'file-alt', routes: ReportsRoutes },
  {
    key: 'organization',
    label: 'organization_setting',
    icon: 'setting',
    routes: OrganizationRoutes,
  },
  { key: 'locations', label: 'location', icon: 'map-marker-alt', routes: LocationRoutes },
  { key: 'lockups', label: 'Lockups', icon: 'lock', routes: LockUpsRoutes },
  { key: 'support', label: 'support', icon: 'ticket', routes: TicketRoutes },
] as const

// Keep new destinations visible when an older identity has a partial saved order.
export const orderByKeys = <T>(
  items: readonly T[],
  order: readonly string[],
  key: (item: T) => string,
): T[] => {
  const ranks = new Map(order.map((value, index) => [value, index]))
  return [...items].sort(
    (first, second) =>
      (ranks.get(key(first)) ?? order.length) - (ranks.get(key(second)) ?? order.length),
  )
}
