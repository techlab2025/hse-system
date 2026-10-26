<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import PermissionBuilder from '@/components/DataStatus/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import SidebarUnicon from '@/shared/icons/SidebarUnicon.vue'
import { useSidebarMode } from '@/composables/useSidebarMode'

const props = defineProps<{ open: boolean }>()
const { isExpandedSidebar } = useSidebarMode()

const route = useRoute()

interface Routes {
  link: string
  name: string
  permissions: PermissionsEnum[]
  icon: string
}
const { t } = useI18n()

const SettingsRoutes = ref<Routes[]>([
  {
    link: '/admin/admins',
    name: 'admins',
    icon: 'user-circle',
    permissions: [
      PermissionsEnum?.ADMIN,
      PermissionsEnum?.ADMIN_ALL,
      PermissionsEnum.ADMIN_CREATE,
      PermissionsEnum.ADMIN_UPDATE,
      PermissionsEnum.ADMIN_DETAILS,
      PermissionsEnum.ADMIN_DELETE,
      PermissionsEnum.ADMIN_FETCH,
    ],
  },
  {
    link: '/admin/team',
    name: 'team',
    icon: 'shield-check',
    permissions: [
      PermissionsEnum.TEAM_ALL,
      PermissionsEnum.TEAM_FETCH,
      PermissionsEnum.TEAM_DETAILS,
      PermissionsEnum.TEAM_CREATE,
      PermissionsEnum.TEAM_UPDATE,
      PermissionsEnum.TEAM_DELETE,
    ],
  },
  {
    link: '/admin/languages',
    name: 'languages',
    icon: 'language',
    permissions: [
      PermissionsEnum?.ADMIN,
      PermissionsEnum?.LANGUAGE_ALL,
      PermissionsEnum.LANGUAGE_CREATE,
      PermissionsEnum.LANGUAGE_UPDATE,
      PermissionsEnum.LANGUAGE_DETAILS,
      PermissionsEnum.LANGUAGE_DELETE,
      PermissionsEnum.LANGUAGE_FETCH,
    ],
  },
  {
    link: '/admin/industry',
    name: 'industry',
    icon: 'building',
    permissions: [
      PermissionsEnum?.ADMIN,
      PermissionsEnum.INDUSTRY_ALL,
      PermissionsEnum.INDUSTRY_CREATE,
      PermissionsEnum.INDUSTRY_DELETE,
      PermissionsEnum.INDUSTRY_FETCH,
      PermissionsEnum.INDUSTRY_UPDATE,
    ],
  },
  // {
  //   link: '/admin/equipments',
  //   name: 'equipments',
  //   icon: 'wrench',
  //   permissions: [
  //     PermissionsEnum?.ADMIN,
  //     PermissionsEnum.EQUIPMENT_ALL,
  //     PermissionsEnum.EQUIPMENT_CREATE,
  //     PermissionsEnum.EQUIPMENT_DELETE,
  //     PermissionsEnum.EQUIPMENT_FETCH,
  //     PermissionsEnum.EQUIPMENT_UPDATE,
  //   ],
  // },
  // {
  //   link: '/admin/factories-items',
  //   name: 'factor_items',
  //   icon: 'circle-layer',
  //   permissions: [
  //     PermissionsEnum.FACTORY_ITEM_ALL,
  //     PermissionsEnum.FACTORY_ITEM_CREATE,
  //     PermissionsEnum.FACTORY_ITEM_DELETE,
  //     PermissionsEnum.FACTORY_ITEM_FETCH,
  //     PermissionsEnum.FACTORY_ITEM_UPDATE,
  //   ],
  // },
  // {
  //   link: '/admin/factory',
  //   name: 'factors',
  //   icon: 'shield-exclamation',
  //   permissions: [
  //     PermissionsEnum.FACTORY_ALL,
  //     PermissionsEnum.FACTORY_CREATE,
  //     PermissionsEnum.FACTORY_DELETE,
  //     PermissionsEnum.FACTORY_FETCH,
  //     PermissionsEnum.FACTORY_UPDATE,
  //   ],
  // },
  {
    link: '/admin/template',
    name: 'templates',
    icon: 'book-open',
    permissions: [
      PermissionsEnum.TEMPLATE_ALL,
      PermissionsEnum.TEMPLATE_CREATE,
      PermissionsEnum.TEMPLATE_DELETE,
      PermissionsEnum.TEMPLATE_FETCH,
      PermissionsEnum.TEMPLATE_UPDATE,
    ],
  },
  {
    link: '/admin/organization',
    name: 'organization',
    icon: 'building',
    permissions: [
      PermissionsEnum.ORGANIZATION_ALL,
      PermissionsEnum.ORGANIZATION_CREATE,
      PermissionsEnum.ORGANIZATION_DELETE,
      PermissionsEnum.ORGANIZATION_FETCH,
      PermissionsEnum.ORGANIZATION_UPDATE,
    ],
  },
  {
    link: '/admin/role',
    name: 'roles',
    icon: 'shield-check',
    permissions: [
      PermissionsEnum.ROLE_ALL,
      PermissionsEnum.ROLE_CREATE,
      PermissionsEnum.ROLE_DELETE,
      PermissionsEnum.ROLE_FETCH,
      PermissionsEnum.ROLE_UPDATE,
    ],
  },
  {
    link: '/admin/ticket-type',
    name: 'ticket_types',
    icon: 'ticket',
    permissions: [
      PermissionsEnum.TICKET_TYPE_ALL,
      PermissionsEnum.TICKET_TYPE_CREATE,
      PermissionsEnum.TICKET_TYPE_DELETE,
      PermissionsEnum.TICKET_TYPE_FETCH,
      PermissionsEnum.TICKET_TYPE_UPDATE,
    ],
  },
  {
    link: '/admin/ticket',
    name: 'ticket',
    icon: 'ticket',
    permissions: [
      PermissionsEnum.TICKET_ALL,
      PermissionsEnum.TICKET_CREATE,
      PermissionsEnum.TICKET_DELETE,
      PermissionsEnum.TICKET_FETCH,
      PermissionsEnum.TICKET_UPDATE,
    ],
  },
  {
    link: '/admin/catalog',
    name: 'catalog',
    icon: 'books',
    permissions: [
      PermissionsEnum.CATALOG_ALL,
      PermissionsEnum.CATALOG_CREATE,
      PermissionsEnum.CATALOG_DELETE,
      PermissionsEnum.CATALOG_FETCH,
      PermissionsEnum.CATALOG_UPDATE,
    ],
  },
  {
    link: '/admin/catalog-items',
    name: 'catalog_items',
    icon: 'list-ui-alt',
    permissions: [
      PermissionsEnum.CATALOG_ALL,
      PermissionsEnum.CATALOG_CREATE,
      PermissionsEnum.CATALOG_DELETE,
      PermissionsEnum.CATALOG_FETCH,
      PermissionsEnum.CATALOG_UPDATE,
    ],
  },
])

const LocationRoutes = ref<Routes[]>([
  {
    link: '/admin/countries',
    name: 'country',
    icon: 'globe',
    permissions: [
      PermissionsEnum?.ADMIN,
      PermissionsEnum?.LOCATION_ALL,
      PermissionsEnum.LOCATION_CREATE,
      PermissionsEnum.LOCATION_UPDATE,
      PermissionsEnum.LOCATION_DETAILS,
      PermissionsEnum.LOCATION_DELETE,
      PermissionsEnum.LOCATION_FETCH,
    ],
  },
  {
    link: '/admin/states',
    name: 'state',
    icon: 'map-marker-alt',
    permissions: [
      PermissionsEnum?.ADMIN,
      PermissionsEnum.LOCATION_ALL,
      PermissionsEnum.LOCATION_CREATE,
      PermissionsEnum.LOCATION_DELETE,
      PermissionsEnum.LOCATION_FETCH,
      PermissionsEnum.LOCATION_UPDATE,
    ],
  },
  {
    link: '/admin/cities',
    name: 'city',
    icon: 'map',
    permissions: [
      PermissionsEnum?.ADMIN,
      PermissionsEnum.LOCATION_ALL,
      PermissionsEnum.LOCATION_CREATE,
      PermissionsEnum.LOCATION_DELETE,
      PermissionsEnum.LOCATION_FETCH,
      PermissionsEnum.LOCATION_UPDATE,
    ],
  },
  {
    link: '/admin/areas',
    name: 'locations',
    icon: 'location-point',
    permissions: [
      PermissionsEnum?.ADMIN,
      PermissionsEnum.LOCATION_ALL,
      PermissionsEnum.LOCATION_CREATE,
      PermissionsEnum.LOCATION_DELETE,
      PermissionsEnum.LOCATION_FETCH,
      PermissionsEnum.LOCATION_UPDATE,
    ],
  },
])

const LockUpsRoutes = ref<Routes[]>([
  {
    link: '/admin/ppe-activities',
    name: 'PPE Activity',
    icon: 'shield-check',
    permissions: [
      PermissionsEnum.PPE_ACTIVITY_ALL,
      PermissionsEnum.PPE_ACTIVITY_FETCH,
      PermissionsEnum.PPE_ACTIVITY_DETAILS,
      PermissionsEnum.PPE_ACTIVITY_CREATE,
      PermissionsEnum.PPE_ACTIVITY_UPDATE,
      PermissionsEnum.PPE_ACTIVITY_DELETE,
    ],
  },
  {
    link: '/admin/ppe-tools',
    name: 'PPE Tools',
    icon: 'shield-check',
    permissions: [
      PermissionsEnum.PPE_TOOLS_ALL,
      PermissionsEnum.PPE_TOOLS_FETCH,
      PermissionsEnum.PPE_TOOLS_DETAILS,
      PermissionsEnum.PPE_TOOLS_CREATE,
      PermissionsEnum.PPE_TOOLS_UPDATE,
      PermissionsEnum.PPE_TOOLS_DELETE,
    ],
  },
  {
    link: '/admin/equipments',
    name: 'equipments',
    icon: 'wrench',
    permissions: [
      PermissionsEnum?.ADMIN,
      PermissionsEnum.EQUIPMENT_ALL,
      PermissionsEnum.EQUIPMENT_CREATE,
      PermissionsEnum.EQUIPMENT_DELETE,
      PermissionsEnum.EQUIPMENT_FETCH,
      PermissionsEnum.EQUIPMENT_UPDATE,
    ],
  },
  {
    link: '/admin/factories-items',
    name: 'factor_items',
    icon: 'circle-layer',
    permissions: [
      PermissionsEnum.FACTORY_ITEM_ALL,
      PermissionsEnum.FACTORY_ITEM_CREATE,
      PermissionsEnum.FACTORY_ITEM_DELETE,
      PermissionsEnum.FACTORY_ITEM_FETCH,
      PermissionsEnum.FACTORY_ITEM_UPDATE,
    ],
  },
  {
    link: '/admin/factory',
    name: 'factors',
    icon: 'shield-exclamation',
    permissions: [
      PermissionsEnum.FACTORY_ALL,
      PermissionsEnum.FACTORY_CREATE,
      PermissionsEnum.FACTORY_DELETE,
      PermissionsEnum.FACTORY_FETCH,
      PermissionsEnum.FACTORY_UPDATE,
    ],
  },
  {
    link: '/admin/document-categories',
    name: 'Document Categories',
    icon: 'folder',
    permissions: [
      PermissionsEnum.DOCUMENT_CATEGORY_ALL,
      PermissionsEnum.DOCUMENT_CATEGORY_FETCH,
      PermissionsEnum.DOCUMENT_CATEGORY_DETAILS,
      PermissionsEnum.DOCUMENT_CATEGORY_CREATE,
      PermissionsEnum.DOCUMENT_CATEGORY_UPDATE,
      PermissionsEnum.DOCUMENT_CATEGORY_DELETE,
    ],
  },
  {
    link: '/admin/audit-standards',
    name: 'Audit Standards',
    icon: 'shield-check',
    permissions: [
      PermissionsEnum.AUDIT_STANDARDS_ALL,
      PermissionsEnum.AUDIT_STANDARDS_FETCH,
      PermissionsEnum.AUDIT_STANDARDS_DETAILS,
      PermissionsEnum.AUDIT_STANDARDS_CREATE,
      PermissionsEnum.AUDIT_STANDARDS_UPDATE,
      PermissionsEnum.AUDIT_STANDARDS_DELETE,
    ],
  },
  {
    link: '/admin/audit-activities',
    name: 'Audit Activities',
    icon: 'shield-check',
    permissions: [
      PermissionsEnum.AUDIT_ACTIVITIES_ALL,
      PermissionsEnum.AUDIT_ACTIVITIES_FETCH,
      PermissionsEnum.AUDIT_ACTIVITIES_DETAILS,
      PermissionsEnum.AUDIT_ACTIVITIES_CREATE,
      PermissionsEnum.AUDIT_ACTIVITIES_UPDATE,
      PermissionsEnum.AUDIT_ACTIVITIES_DELETE,
    ],
  },
  {
    link: '/admin/ppe-items',
    name: 'ppe_items',
    icon: 'shield-check',
    permissions: [
      PermissionsEnum.PPE_ITEM_ALL,
      PermissionsEnum.PPE_ITEM_FETCH,
      PermissionsEnum.PPE_ITEM_DETAILS,
      PermissionsEnum.PPE_ITEM_CREATE,
      PermissionsEnum.PPE_ITEM_UPDATE,
      PermissionsEnum.PPE_ITEM_DELETE,
    ],
  },
  {
    link: '/admin/visit-activities',
    name: 'visit_activities',
    icon: 'clipboard-notes',
    permissions: [
      PermissionsEnum.VISIT_ACTIVITIES_ALL,
      PermissionsEnum.VISIT_ACTIVITIES_FETCH,
      PermissionsEnum.VISIT_ACTIVITIES_DETAILS,
      PermissionsEnum.VISIT_ACTIVITIES_CREATE,
      PermissionsEnum.VISIT_ACTIVITIES_UPDATE,
      PermissionsEnum.VISIT_ACTIVITIES_DELETE,
    ],
  },
  {
    link: '/admin/visit-themes',
    name: 'visit_themes',
    icon: 'clipboard-notes',
    permissions: [
      PermissionsEnum.VISIT_THEME_ALL,
      PermissionsEnum.VISIT_THEME_FETCH,
      PermissionsEnum.VISIT_THEME_DETAILS,
      PermissionsEnum.VISIT_THEME_CREATE,
      PermissionsEnum.VISIT_THEME_UPDATE,
      PermissionsEnum.VISIT_THEME_DELETE,
    ],
  },
  {
    link: '/admin/visit-categories',
    name: 'visit_categories',
    icon: 'clipboard-notes',
    permissions: [
      PermissionsEnum.VISIT_CATEGORY_ALL,
      PermissionsEnum.VISIT_CATEGORY_FETCH,
      PermissionsEnum.VISIT_CATEGORY_DETAILS,
      PermissionsEnum.VISIT_CATEGORY_CREATE,
      PermissionsEnum.VISIT_CATEGORY_UPDATE,
      PermissionsEnum.VISIT_CATEGORY_DELETE,
    ],
  },
  {
    link: '/admin/drill-types',
    name: 'drill_types',
    icon: 'clipboard-notes',
    permissions: [
      PermissionsEnum.DRILL_TYPE_ALL,
      PermissionsEnum.DRILL_TYPE_FETCH,
      PermissionsEnum.DRILL_TYPE_DETAILS,
      PermissionsEnum.DRILL_TYPE_CREATE,
      PermissionsEnum.DRILL_TYPE_UPDATE,
      PermissionsEnum.DRILL_TYPE_DELETE,
    ],
  },
  {
    link: '/admin/where-house-type',
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
    link: '/admin/hazard-type',
    name: 'hazard_type',
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
    link: '/admin/accidents-type',
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
  //   link: '/admin/incident-category',
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
    link: '/admin/observation-type',
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
    link: '/admin/equipment-types',
    name: 'equipment_types',
    icon: 'hard-hat',
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
    link: '/admin/root-causes',
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
    link: '/admin/injury',
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
    link: '/admin/meeting-types',
    name: 'meeting types',
    icon: 'receipt',
    permissions: [
      PermissionsEnum?.ADMIN,
      PermissionsEnum?.MEETING_TYPE_ALL,
      PermissionsEnum.MEETING_TYPE_CREATE,
      PermissionsEnum.MEETING_TYPE_UPDATE,
      PermissionsEnum.MEETING_TYPE_DETAILS,
      PermissionsEnum.MEETING_TYPE_DELETE,
      PermissionsEnum.MEETING_TYPE_FETCH,
    ],
  },
  {
    link: '/admin/ptw-types',
    name: 'ptw types',
    icon: 'receipt',
    permissions: [
      PermissionsEnum?.ADMIN,
      PermissionsEnum.PTW_TYPE_ALL,
      PermissionsEnum.PTW_TYPE_CREATE,
      PermissionsEnum.PTW_TYPE_UPDATE,
      PermissionsEnum.PTW_TYPE_DETAILS,
      PermissionsEnum.PTW_TYPE_DELETE,
      PermissionsEnum.PTW_TYPE_FETCH,
    ],
  },
  {
    link: '/admin/traning-topics',
    name: 'traning_topics',
    icon: 'medical-square',
    permissions: [
      PermissionsEnum.TRANING_TOPIC_ALL,
      PermissionsEnum.TRANING_TOPIC_FETCH,
      PermissionsEnum.TRANING_TOPIC_DETAILS,
      PermissionsEnum.TRANING_TOPIC_CREATE,
      PermissionsEnum.TRANING_TOPIC_UPDATE,
      PermissionsEnum.TRANING_TOPIC_DELETE,
    ],
  },
])

const SubscriptionTypeRoutes = ref<Routes[]>([
  {
    link: '/admin/subscription-types',
    name: 'subscription_type',
    icon: 'money-bill',
    permissions: [
      PermissionsEnum?.ADMIN,
      PermissionsEnum?.SUBSCRIPTION_TYPE_ALL,
      PermissionsEnum.SUBSCRIPTION_TYPE_CREATE,
      PermissionsEnum.SUBSCRIPTION_TYPE_UPDATE,
      PermissionsEnum.SUBSCRIPTION_TYPE_DETAILS,
      PermissionsEnum.SUBSCRIPTION_TYPE_DELETE,
      PermissionsEnum.SUBSCRIPTION_TYPE_FETCH,
    ],
  },
  {
    link: '/admin/subscription-application',
    name: 'subscriptions_request',
    icon: 'receipt',
    permissions: [
      PermissionsEnum?.ADMIN,
      PermissionsEnum?.SUBSCRIPTION_APPLICATION_ALL,
      PermissionsEnum.SUBSCRIPTION_APPLICATION_CREATE,
      PermissionsEnum.SUBSCRIPTION_APPLICATION_UPDATE,
      PermissionsEnum.SUBSCRIPTION_APPLICATION_DETAILS,
      PermissionsEnum.SUBSCRIPTION_APPLICATION_DELETE,
      PermissionsEnum.SUBSCRIPTION_APPLICATION_FETCH,
    ],
  },
])

const WebsiteRoutes = ref<Routes[]>([
  {
    link: '/admin/client-opinions',
    name: 'client_opinion',
    icon: 'feedback',
    permissions: [
      PermissionsEnum?.WEBSITE,
      PermissionsEnum?.CLIENT_OPINION_ALL,
      PermissionsEnum.CLIENT_OPINION_CREATE,
      PermissionsEnum.CLIENT_OPINION_UPDATE,
      PermissionsEnum.CLIENT_OPINION_DETAILS,
      PermissionsEnum.CLIENT_OPINION_DELETE,
      PermissionsEnum.CLIENT_OPINION_FETCH,
    ],
  },
  {
    link: '/admin/home-contact-us',
    name: 'home_contact_us',
    icon: 'comment-message',
    permissions: [
      PermissionsEnum?.WEBSITE,
      PermissionsEnum?.HOME_CONTACT_US_ALL,
      PermissionsEnum.HOME_CONTACT_US_CREATE,
      PermissionsEnum.HOME_CONTACT_US_UPDATE,
      PermissionsEnum.HOME_CONTACT_US_DETAILS,
      PermissionsEnum.HOME_CONTACT_US_DELETE,
      PermissionsEnum.HOME_CONTACT_US_FETCH,
    ],
  },
  {
    link: '/admin/categories',
    name: 'categories',
    icon: 'list-ui-alt',
    permissions: [
      PermissionsEnum.CATEGORY_ALL,
      PermissionsEnum.CATEGORY_CREATE,
      PermissionsEnum.CATEGORY_DELETE,
      PermissionsEnum.CATEGORY_FETCH,
      PermissionsEnum.CATEGORY_UPDATE,
    ],
  },
  {
    link: '/admin/services',
    name: 'services',
    icon: 'setting',
    permissions: [
      PermissionsEnum.SERVICE_ALL,
      PermissionsEnum.SERVICE_CREATE,
      PermissionsEnum.SERVICE_DELETE,
      PermissionsEnum.SERVICE_FETCH,
      PermissionsEnum.SERVICE_UPDATE,
    ],
  },
  {
    link: '/admin/hashtags',
    name: 'hashtags',
    icon: 'tag-alt',
    permissions: [
      PermissionsEnum.HASHTAG_ALL,
      PermissionsEnum.HASHTAG_CREATE,
      PermissionsEnum.HASHTAG_DELETE,
      PermissionsEnum.HASHTAG_FETCH,
      PermissionsEnum.HASHTAG_UPDATE,
    ],
  },
  {
    link: '/admin/term/add',
    name: 'terms',
    icon: 'file-contract',
    permissions: [
      PermissionsEnum.TERM_ALL,
      PermissionsEnum.TERM_CREATE_OR_UPDATE,
      PermissionsEnum.TERM_FETCH,
    ],
  },
  {
    link: '/admin/headers',
    name: 'headers',
    icon: 'window',
    permissions: [
      PermissionsEnum.HEADER_ALL,
      PermissionsEnum.HEADER_CREATE,
      PermissionsEnum.HEADER_DELETE,
      PermissionsEnum.HEADER_FETCH,
      PermissionsEnum.HEADER_UPDATE,
    ],
  },
  {
    link: '/admin/service-features',
    name: 'service_features',
    icon: 'bolt',
    permissions: [
      PermissionsEnum.SERVICE_FEATURE_ALL,
      PermissionsEnum.SERVICE_FEATURE_CREATE,
      PermissionsEnum.SERVICE_FEATURE_DELETE,
      PermissionsEnum.SERVICE_FEATURE_FETCH,
      PermissionsEnum.SERVICE_FEATURE_UPDATE,
    ],
  },
  {
    link: '/admin/service_section',
    name: 'service_section',
    icon: 'web-section',
    permissions: [
      PermissionsEnum.SERVICE_SECTION_ALL,
      PermissionsEnum.SERVICE_SECTION_CREATE,
      PermissionsEnum.SERVICE_SECTION_DELETE,
      PermissionsEnum.SERVICE_SECTION_FETCH,
      PermissionsEnum.SERVICE_SECTION_UPDATE,
    ],
  },
  {
    link: '/admin/powerfull-features',
    name: 'powerful_features',
    icon: 'star',
    permissions: [
      PermissionsEnum.POWERFUL_FEATURE_ALL,
      PermissionsEnum.POWERFUL_FEATURE_CREATE,
      PermissionsEnum.POWERFUL_FEATURE_DELETE,
      PermissionsEnum.POWERFUL_FEATURE_FETCH,
      PermissionsEnum.POWERFUL_FEATURE_UPDATE,
    ],
  },
  {
    link: '/admin/system-works',
    name: 'system_works',
    icon: 'sync',
    permissions: [
      PermissionsEnum.SYSTEM_WORK_ALL,
      PermissionsEnum.SYSTEM_WORK_CREATE,
      PermissionsEnum.SYSTEM_WORK_DELETE,
      PermissionsEnum.SYSTEM_WORK_FETCH,
      PermissionsEnum.SYSTEM_WORK_UPDATE,
    ],
  },
  {
    link: '/admin/privacy/add',
    name: 'privacy',
    icon: 'lock',
    permissions: [
      PermissionsEnum.PRIVACY_ALL,
      PermissionsEnum.PRIVACY_CREATE_OR_UPDATE,
      PermissionsEnum.PRIVACY_FETCH,
    ],
  },
  {
    link: '/admin/home-view-pricing',
    name: 'homeViewPricing',
    icon: 'wallet',
    permissions: [
      PermissionsEnum.HOME_VIEW_PRICING_ALL,
      PermissionsEnum.HOME_VIEW_PRICING_CREATE,
      PermissionsEnum.HOME_VIEW_PRICING_DELETE,
      PermissionsEnum.HOME_VIEW_PRICING_FETCH,
      PermissionsEnum.HOME_VIEW_PRICING_UPDATE,
    ],
  },
  {
    link: '/admin/service_logs',
    name: 'service_logs',
    icon: 'history',
    permissions: [
      PermissionsEnum.SERVICE_LOG_ALL,
      PermissionsEnum.SERVICE_LOG_CREATE,
      PermissionsEnum.SERVICE_LOG_DELETE,
      PermissionsEnum.SERVICE_LOG_FETCH,
      PermissionsEnum.SERVICE_LOG_UPDATE,
    ],
  },
  {
    link: '/admin/blog',
    name: 'blogs',
    icon: 'book',
    permissions: [
      PermissionsEnum.BLOG_ALL,
      PermissionsEnum.BLOG_CREATE,
      PermissionsEnum.BLOG_DELETE,
      PermissionsEnum.BLOG_FETCH,
      PermissionsEnum.BLOG_UPDATE,
    ],
  },
  {
    link: '/admin/home-about-us',
    name: 'home_about_us',
    icon: 'estate',
    permissions: [
      PermissionsEnum.HOME_ABOUT_US_ALL,
      PermissionsEnum.HOME_ABOUT_US_CREATE,
      PermissionsEnum.HOME_ABOUT_US_DELETE,
      PermissionsEnum.HOME_ABOUT_US_FETCH,
      PermissionsEnum.HOME_ABOUT_US_UPDATE,
    ],
  },
  {
    link: '/admin/about-us-features',
    name: 'about_us_features',
    icon: 'question-circle',
    permissions: [
      PermissionsEnum.ABOUT_US_FEATURE_ALL,
      PermissionsEnum.ABOUT_US_FEATURE_CREATE,
      PermissionsEnum.ABOUT_US_FEATURE_DELETE,
      PermissionsEnum.ABOUT_US_FEATURE_FETCH,
      PermissionsEnum.ABOUT_US_FEATURE_UPDATE,
    ],
  },
  {
    link: '/admin/about-us-core',
    name: 'about_us_core',
    icon: 'bullseye',
    permissions: [
      PermissionsEnum.ABOUT_US_CORE_ALL,
      PermissionsEnum.ABOUT_US_CORE_CREATE,
      PermissionsEnum.ABOUT_US_CORE_DELETE,
      PermissionsEnum.ABOUT_US_CORE_FETCH,
      PermissionsEnum.ABOUT_US_CORE_UPDATE,
    ],
  },
  {
    link: '/admin/faq',
    name: 'faqs',
    icon: 'comment-question',
    permissions: [
      PermissionsEnum.FAQ_ALL,
      PermissionsEnum.FAQ_CREATE,
      PermissionsEnum.FAQ_DELETE,
      PermissionsEnum.FAQ_FETCH,
      PermissionsEnum.FAQ_UPDATE,
    ],
  },
  {
    link: '/admin/system-risk-management',
    name: 'systemRiskManagement',
    icon: 'shield-exclamation',
    permissions: [
      PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_ALL,
      PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_CREATE,
      PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_DELETE,
      PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_FETCH,
      PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_UPDATE,
    ],
  },
  {
    link: '/admin/our-system-step',
    name: 'ourSystemStep',
    icon: 'directions',
    permissions: [
      PermissionsEnum.OUR_SYSTEM_STEP_ALL,
      PermissionsEnum.OUR_SYSTEM_STEP_CREATE,
      PermissionsEnum.OUR_SYSTEM_STEP_DELETE,
      PermissionsEnum.OUR_SYSTEM_STEP_FETCH,
      PermissionsEnum.OUR_SYSTEM_STEP_UPDATE,
    ],
  },
  {
    link: '/admin/system_banner',
    name: 'systemBanner',
    icon: 'image',
    permissions: [
      PermissionsEnum.OUR_SYSTEM_BANNER_ALL,
      PermissionsEnum.OUR_SYSTEM_BANNER_CREATE,
      PermissionsEnum.OUR_SYSTEM_BANNER_DELETE,
      PermissionsEnum.OUR_SYSTEM_BANNER_FETCH,
      PermissionsEnum.OUR_SYSTEM_BANNER_UPDATE,
    ],
  },
  {
    link: '/admin/system_feature',
    name: 'systemFeature',
    icon: 'grid',
    permissions: [
      PermissionsEnum.OUR_SYSTEM_FEATURE_ALL,
      PermissionsEnum.OUR_SYSTEM_FEATURE_CREATE,
      PermissionsEnum.OUR_SYSTEM_FEATURE_DELETE,
      PermissionsEnum.OUR_SYSTEM_FEATURE_FETCH,
      PermissionsEnum.OUR_SYSTEM_FEATURE_UPDATE,
    ],
  },
  {
    link: '/admin/system_risk_type',
    name: 'systemRiskType',
    icon: 'exclamation-triangle',
    permissions: [
      PermissionsEnum.OUR_SYSTEM_RISK_TYPE_ALL,
      PermissionsEnum.OUR_SYSTEM_RISK_TYPE_CREATE,
      PermissionsEnum.OUR_SYSTEM_RISK_TYPE_DELETE,
      PermissionsEnum.OUR_SYSTEM_RISK_TYPE_FETCH,
      PermissionsEnum.OUR_SYSTEM_RISK_TYPE_UPDATE,
    ],
  },
  {
    link: '/admin/system_components',
    name: 'systemComponents',
    icon: 'layers',
    permissions: [
      PermissionsEnum.OUR_SYSTEM_COMPONENT_ALL,
      PermissionsEnum.OUR_SYSTEM_COMPONENT_CREATE,
      PermissionsEnum.OUR_SYSTEM_COMPONENT_DELETE,
      PermissionsEnum.OUR_SYSTEM_COMPONENT_FETCH,
      PermissionsEnum.OUR_SYSTEM_COMPONENT_UPDATE,
    ],
  },
])

interface RouteGroup {
  key: string
  label: string
  icon: string
  routes: Routes[]
  permissions: PermissionsEnum[]
}

const routeGroups = computed<RouteGroup[]>(() =>
  [
    { key: 'settings', label: t('settings'), icon: 'setting', routes: SettingsRoutes.value },
    {
      key: 'locations',
      label: t('location'),
      icon: 'map-marker-alt',
      routes: LocationRoutes.value,
    },
    {
      key: 'subscriptions',
      label: t('subscriptions'),
      icon: 'receipt',
      routes: SubscriptionTypeRoutes.value,
    },
    { key: 'website', label: t('website'), icon: 'globe', routes: WebsiteRoutes.value },
    { key: 'lookups', label: t('Lockups'), icon: 'lock', routes: LockUpsRoutes.value },
  ].map((group) => ({
    ...group,
    permissions: [...new Set(group.routes.flatMap((item) => item.permissions))],
  })),
)

const activeRouteGroupKey = ref('settings')
const paneGroupKey = ref('settings')
const searchTerm = ref('')
const isPaneVisible = ref(false)
const sidePaneRoutesRef = ref<HTMLElement | null>(null)
let closePaneTimer: number | undefined

const isLinkActive = (link: string) => route.path === link || route.path.startsWith(`${link}/`)

const groupHasActiveRoute = (group: RouteGroup) =>
  group.routes.some((item) => isLinkActive(item.link))

const activeGroup = computed(() => {
  return routeGroups.value.find((group) => group.key === paneGroupKey.value) || routeGroups.value[0]
})

const isSearching = computed(() => searchTerm.value.trim().length > 0)

const clearSearch = () => {
  searchTerm.value = ''
}

const visibleRouteGroups = computed<RouteGroup[]>(() => {
  const query = searchTerm.value.trim().toLocaleLowerCase()
  const groups =
    query || isExpandedSidebar.value
      ? routeGroups.value
      : activeGroup.value
        ? [activeGroup.value]
        : []

  return groups
    .map((group) => ({
      ...group,
      routes: query
        ? group.routes.filter(
            (item) =>
              t(item.name).toLocaleLowerCase().includes(query) ||
              group.label.toLocaleLowerCase().includes(query),
          )
        : group.routes,
    }))
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
  if (isExpandedSidebar.value) return
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
  <div class="modern-sidebar hse-identity" :class="{ 'expanded-navigation': isExpandedSidebar }">
    <nav v-if="!isExpandedSidebar" class="side-rail-nav" :aria-label="$t('main_sidebar_groups')">
      <template v-for="group in routeGroups" :key="group.key">
        <PermissionBuilder :code="group.permissions">
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
            aria-controls="admin-sidebar-pane"
            @click="openGroup(group.key)"
            @mouseenter="openGroup(group.key)"
            @mouseleave="scheduleClosePane"
            @focus="openGroup(group.key)"
            @blur="scheduleClosePane"
          >
            <SidebarUnicon :name="group.icon" class="strip-icon" />
            <span>{{ group.label }}</span>
          </button>
        </PermissionBuilder>
      </template>
    </nav>

    <Transition name="side-pane">
      <aside
        v-if="(isExpandedSidebar || isPaneVisible) && activeGroup"
        id="admin-sidebar-pane"
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
              <strong>{{
                isExpandedSidebar ? $t('sidebar_navigation') : activeGroup.label
              }}</strong>
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
              <PermissionBuilder v-if="isSearching || isExpandedSidebar" :code="group.permissions">
                <p class="side-route-group-title">{{ group.label }}</p>
              </PermissionBuilder>

              <PermissionBuilder
                v-for="sidebarRoute in group.routes"
                :key="`${group.key}-${String(sidebarRoute.link)}`"
                :code="sidebarRoute.permissions"
              >
                <div class="side-route-entry">
                  <router-link
                    :to="sidebarRoute.link"
                    active-class=""
                    exact-active-class=""
                    :aria-current-value="isLinkActive(sidebarRoute.link) ? 'page' : 'false'"
                    :class="['side-btn', { active: isLinkActive(sidebarRoute.link) }]"
                    :title="$t(sidebarRoute.name)"
                    @click="activateRouteGroup(group.key)"
                  >
                    <SidebarUnicon :name="sidebarRoute.icon" class="side-icon" />
                    <span class="side-label-wrap">
                      <span class="side-label">{{ $t(sidebarRoute.name) }}</span>
                      <span v-if="isSearching" class="side-label-parent">{{ group.label }}</span>
                    </span>
                  </router-link>
                </div>
              </PermissionBuilder>
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

<style scoped src="./sidebar-navigation.css"></style>
