<script setup lang="ts">
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import { ref, watch } from 'vue'
import type { Component } from 'vue'
import PermissionBuilder from '@/components/DataStatus/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import IconSetting from '@/shared/icons/IconSetting.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Sidebarlocation from '@/shared/icons/sidebarlocation.vue'
import Locaps from '@/shared/icons/locaps.vue'

import PersonIcon from '@/shared/icons/PersonIcon.vue'
import GlobalIcon from '@/shared/icons/global.vue'
import GeerIcon from '@/shared/icons/GeerIcon.vue'
import ToolIcon from '@/shared/icons/ToolIcon.vue'
import FactorItemIcon from '@/shared/icons/FactorItemIcon.vue'
import HazardIcon from '@/shared/icons/HazardIcon.vue'
import BookIcon from '@/shared/icons/BookIcon.vue'
import IconCommunity from '@/shared/icons/IconCommunity.vue'
import ShieldIcon from '@/shared/icons/shield.vue'
import TicketIcon from '@/shared/icons/TicketIcon.vue'
import ArchiveBook from '@/shared/icons/ArchiveBook.vue'
import ItemsIcon from '@/shared/icons/items.vue'
import LocationIcon from '@/shared/icons/LocationIcon.vue'
import IconArea from '@/shared/icons/IconArea.vue'
import MoneyIcon from '@/shared/icons/MoneyIcon.vue'
import ReceiptAdd from '@/shared/icons/ReceiptAdd.vue'
import OpinionIcon from '@/shared/icons/opinion.vue'
import MessageIcon from '@/shared/icons/message.vue'
import MenuBoardIcon from '@/shared/icons/menuBoard.vue'
import TagIcon from '@/shared/icons/tag.vue'
import DocumentTextIcon from '@/shared/icons/documentText.vue'
import ElementIcon from '@/shared/icons/element.vue'
import HighLevelIcon from '@/shared/icons/HighLevel.vue'
import LockIcon from '@/shared/icons/LockIcon.vue'
import HistoryLogIcon from '@/shared/icons/HistoryLog.vue'
import BoookIcon from '@/shared/icons/Boookicon.vue'
import HomeInfoIcon from '@/shared/icons/HomeInfoIcon.vue'
import MessageQuestionIcon from '@/shared/icons/messageQuestion.vue'
import WarningIcon from '@/shared/icons/WarningIcon.vue'
import ImageIcon from '@/shared/icons/ImageIcon.vue'
import NewArrowIcon from '@/shared/icons/newarrow.vue'
import EyeIcon from '@/shared/icons/EyeIcon.vue'
import RootCaseIcon from '@/shared/icons/RootCase.vue'
import InjuredIcon from '@/shared/icons/injured.vue'
import LockerIcon from '@/shared/icons/LockerIcon.vue'

const props = defineProps<{ open: boolean }>()

const route = useRoute()

interface Routes {
  link: string
  name: string
  permissions: PermissionsEnum[]
  icon: Component
}
const { t } = useI18n()

const SettingsRoutes = ref<Routes[]>([
  {
    link: '/admin/admins',
    name: t('admins'),
    icon: PersonIcon,
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
    link: '/admin/languages',
    name: t('languages'),
    icon: GlobalIcon,
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
    name: t('industry'),
    icon: GeerIcon,
    permissions: [
      PermissionsEnum?.ADMIN,
      PermissionsEnum.INDUSTRY_ALL,
      PermissionsEnum.INDUSTRY_CREATE,
      PermissionsEnum.INDUSTRY_DELETE,
      PermissionsEnum.INDUSTRY_FETCH,
      PermissionsEnum.INDUSTRY_UPDATE,
    ],
  },
  {
    link: '/admin/equipments',
    name: t('equipments'),
    icon: ToolIcon,
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
    name: t('hazard_factor_items'),
    icon: FactorItemIcon,
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
    name: t('hazard_factors'),
    icon: HazardIcon,
    permissions: [
      PermissionsEnum.FACTORY_ALL,
      PermissionsEnum.FACTORY_CREATE,
      PermissionsEnum.FACTORY_DELETE,
      PermissionsEnum.FACTORY_FETCH,
      PermissionsEnum.FACTORY_UPDATE,
    ],
  },
  {
    link: '/admin/template',
    name: t('templates'),
    icon: BookIcon,
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
    name: t('organization'),
    icon: IconCommunity,
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
    name: t('roles'),
    icon: ShieldIcon,
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
    name: t('ticket_types'),
    icon: TicketIcon,
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
    name: t('ticket'),
    icon: TicketIcon,
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
    name: t('catalog'),
    icon: ArchiveBook,
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
    name: t('catalog_items'),
    icon: ItemsIcon,
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
    name: t('country'),
    icon: LocationIcon,
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
    name: t('state'),
    icon: LocationIcon,
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
    name: t('city'),
    icon: LocationIcon,
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
    name: t('locations'),
    icon: IconArea,
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
    link: '/admin/where-house-type',
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
    link: '/admin/hazard-type',
    name: t('hazard_type'),
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
    link: '/admin/accidents-type',
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
    link: '/admin/observation-type',
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
    link: '/admin/equipment-types',
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
    link: '/admin/root-causes',
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
    link: '/admin/injury',
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

const SubscriptionTypeRoutes = ref<Routes[]>([
  {
    link: '/admin/subscription-types',
    name: t('subscription_type'),
    icon: MoneyIcon,
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
    name: t('subscriptions_request'),
    icon: ReceiptAdd,
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
    name: t('client_opinion'),
    icon: OpinionIcon,
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
    name: t('home_contact_us'),
    icon: MessageIcon,
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
    name: t('categories'),
    icon: MenuBoardIcon,
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
    name: t('services'),
    icon: IconSetting,
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
    name: t('hashtags'),
    icon: TagIcon,
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
    name: t('terms'),
    icon: DocumentTextIcon,
    permissions: [
      PermissionsEnum.TERM_ALL,
      PermissionsEnum.TERM_CREATE_OR_UPDATE,
      PermissionsEnum.TERM_FETCH,
    ],
  },
  {
    link: '/admin/headers',
    name: t('headers'),
    icon: IconSetting,
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
    name: t('service_features'),
    icon: GeerIcon,
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
    name: t('service_section'),
    icon: ElementIcon,
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
    name: t('powerful_features'),
    icon: HighLevelIcon,
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
    name: t('system_works'),
    icon: GeerIcon,
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
    name: t('privacy'),
    icon: LockIcon,
    permissions: [
      PermissionsEnum.PRIVACY_ALL,
      PermissionsEnum.PRIVACY_CREATE_OR_UPDATE,
      PermissionsEnum.PRIVACY_FETCH,
    ],
  },
  {
    link: '/admin/home-view-pricing',
    name: t('homeViewPricing'),
    icon: MoneyIcon,
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
    name: t('service_logs'),
    icon: HistoryLogIcon,
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
    name: t('blogs'),
    icon: BoookIcon,
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
    name: t('home_about_us'),
    icon: HomeInfoIcon,
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
    name: t('about_us_features'),
    icon: GeerIcon,
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
    name: t('about_us_core'),
    icon: GeerIcon,
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
    name: t('faqs'),
    icon: MessageQuestionIcon,
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
    name: t('systemRiskManagement'),
    icon: WarningIcon,
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
    name: t('ourSystemStep'),
    icon: NewArrowIcon,
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
    name: t('systemBanner'),
    icon: ImageIcon,
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
    name: t('systemFeature'),
    icon: GeerIcon,
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
    name: t('systemRiskType'),
    icon: WarningIcon,
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
    name: t('systemComponents'),
    icon: ElementIcon,
    permissions: [
      PermissionsEnum.OUR_SYSTEM_COMPONENT_ALL,
      PermissionsEnum.OUR_SYSTEM_COMPONENT_CREATE,
      PermissionsEnum.OUR_SYSTEM_COMPONENT_DELETE,
      PermissionsEnum.OUR_SYSTEM_COMPONENT_FETCH,
      PermissionsEnum.OUR_SYSTEM_COMPONENT_UPDATE,
    ],
  },
])

const SelectedSettingsRoute = ref<string>('')
const SelectedLocationRoute = ref<string>('')
const SelectedWebsiteRoute = ref<string>('')
const SelectedSubscriptionTypeRoute = ref<string>('')
const SelectedLockupsRoute = ref<string>('')

watch(
  () => route.path,
  (newPath) => {
    SelectedSettingsRoute.value = SettingsRoutes.value.find(item => item.link === newPath)?.name || ''
    SelectedLocationRoute.value = LocationRoutes.value.find(item => item.link === newPath)?.name || ''
    SelectedWebsiteRoute.value = WebsiteRoutes.value.find(item => item.link === newPath)?.name || ''
    SelectedSubscriptionTypeRoute.value = SubscriptionTypeRoutes.value.find(item => item.link === newPath)?.name || ''
    SelectedLockupsRoute.value = LockUpsRoutes.value.find(item => item.link === newPath)?.name || ''
  }
)

const settingsAccordion = ref<string | null>('0')
const locationAccordion = ref<string | null>('1')
const websiteAccordion = ref<string | null>('2')
const subscriptionTypeAccordion = ref<string | null>('3')
const LoackupsAccordion = ref<string | null>('4')
watch(LoackupsAccordion, (val) => {
  LoackupsAccordion.value = val
})
</script>

<template>
  <!-- Icon strip shown when sidebar is closed -->
  <template v-if="!open">
    <div class="icon-strip">
      <PermissionBuilder
        v-for="r in SettingsRoutes"
        :key="r.link"
        :code="r.permissions"
      >
        <router-link :to="r.link" class="icon-item" :data-title="r.name">
          <component :is="r.icon" class="strip-icon" />
        </router-link>
      </PermissionBuilder>

      <PermissionBuilder
        v-for="r in LocationRoutes"
        :key="r.link"
        :code="r.permissions"
      >
        <router-link :to="r.link" class="icon-item" :data-title="r.name">
          <component :is="r.icon" class="strip-icon" />
        </router-link>
      </PermissionBuilder>

      <PermissionBuilder
        v-for="r in SubscriptionTypeRoutes"
        :key="r.link"
        :code="r.permissions"
      >
        <router-link :to="r.link" class="icon-item" :data-title="r.name">
          <component :is="r.icon" class="strip-icon" />
        </router-link>
      </PermissionBuilder>

      <PermissionBuilder
        v-for="r in WebsiteRoutes"
        :key="r.link"
        :code="r.permissions"
      >
        <router-link :to="r.link" class="icon-item" :data-title="r.name">
          <component :is="r.icon" class="strip-icon" />
        </router-link>
      </PermissionBuilder>

      <PermissionBuilder
        v-for="r in LockUpsRoutes"
        :key="r.link"
        :code="r.permissions"
      >
        <router-link :to="r.link" class="icon-item" :data-title="r.name">
          <component :is="r.icon" class="strip-icon" />
        </router-link>
      </PermissionBuilder>
    </div>
  </template>

  <!-- Full accordion view when sidebar is open -->
  <template v-else>
    <PermissionBuilder :code="[
      PermissionsEnum?.ADMIN_ALL,
      PermissionsEnum?.LANGUAGE_ALL,
      PermissionsEnum?.INDUSTRY_ALL,
      PermissionsEnum?.EQUIPMENT_TYPE_ALL,
      PermissionsEnum?.EQUIPMENT_ALL,
      PermissionsEnum?.HAZARD_TYPE_ALL,
      PermissionsEnum?.ACCIDENTS_TYPE_ALL,
      PermissionsEnum?.FACTORY_ITEM_ALL,
      PermissionsEnum?.FACTORY_ALL,
      PermissionsEnum?.CERTIFICATE_ALL,
      PermissionsEnum?.TEMPLATE_ALL,
      PermissionsEnum?.PROJECT_TYPE_ALL,
      PermissionsEnum?.ORGANIZATION_ALL,
    ]">
      <Accordion v-model:value="settingsAccordion">
        <AccordionPanel value="0">
          <AccordionHeader>
            <div class="links-header">
              <IconSetting />
              {{ $t('settings') }}
            </div>
          </AccordionHeader>

          <AccordionContent>
            <ul>
              <PermissionBuilder v-for="(r, index) in SettingsRoutes" :key="index" :code="r.permissions">
                <li>
                  <router-link :to="r.link">
                    <component :is="r.icon" class="route-icon" />
                    <span>{{ $t(r.name) }}</span>
                  </router-link>
                </li>
              </PermissionBuilder>
            </ul>
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel class="active-panel-out" v-if="SelectedSettingsRoute && !settingsAccordion">
          <span>{{ SelectedSettingsRoute }}</span>
        </AccordionPanel>
      </Accordion>
    </PermissionBuilder>

    <PermissionBuilder :code="[PermissionsEnum?.LOCATION_ALL]">
      <Accordion v-model:value="locationAccordion">
        <AccordionPanel value="1">
          <AccordionHeader>
            <div class="links-header">
              <Sidebarlocation />
              {{ $t('location') }}
            </div>
          </AccordionHeader>
          <AccordionContent>
            <ul>
              <PermissionBuilder v-for="(r, index) in LocationRoutes" :key="index" :code="r.permissions">
                <li>
                  <router-link :to="r.link">
                    <component :is="r.icon" class="route-icon" />
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

    <PermissionBuilder :code="[
      PermissionsEnum?.SUBSCRIPTION_TYPE_ALL,
      PermissionsEnum?.SUBSCRIPTION_TYPE_CREATE,
      PermissionsEnum?.SUBSCRIPTION_TYPE_UPDATE,
      PermissionsEnum?.SUBSCRIPTION_TYPE_DETAILS,
      PermissionsEnum?.SUBSCRIPTION_TYPE_DELETE,
      PermissionsEnum?.SUBSCRIPTION_TYPE_FETCH,
    ]">
      <Accordion v-model:value="subscriptionTypeAccordion">
        <AccordionPanel value="3">
          <AccordionHeader>
            <div class="links-header">
              <MoneyIcon />
              {{ $t('subscription_type') }}
            </div>
          </AccordionHeader>
          <AccordionContent>
            <ul>
              <PermissionBuilder v-for="(r, index) in SubscriptionTypeRoutes" :key="index" :code="r.permissions">
                <li>
                  <router-link :to="r.link">
                    <component :is="r.icon" class="route-icon" />
                    <span>{{ $t(r.name) }}</span>
                  </router-link>
                </li>
              </PermissionBuilder>
            </ul>
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel class="active-panel-out" v-if="SelectedSubscriptionTypeRoute && !subscriptionTypeAccordion">
          <span>{{ SelectedSubscriptionTypeRoute }}</span>
        </AccordionPanel>
      </Accordion>
    </PermissionBuilder>

    <PermissionBuilder :code="[
      PermissionsEnum?.WEBSITE,
      PermissionsEnum?.CLIENT_OPINION_ALL,
      PermissionsEnum?.HOME_CONTACT_US_ALL,
      PermissionsEnum?.CATEGORY_ALL,
      PermissionsEnum?.SERVICE_ALL,
      PermissionsEnum?.HASHTAG_ALL,
      PermissionsEnum?.TERM_ALL,
      PermissionsEnum?.HEADER_ALL,
      PermissionsEnum?.SERVICE_FEATURE_ALL,
      PermissionsEnum?.SERVICE_SECTION_ALL,
      PermissionsEnum?.POWERFUL_FEATURE_ALL,
      PermissionsEnum?.SYSTEM_WORK_ALL,
      PermissionsEnum?.PRIVACY_ALL,
      PermissionsEnum?.HOME_VIEW_PRICING_ALL,
      PermissionsEnum?.SERVICE_LOG_ALL,
      PermissionsEnum?.BLOG_ALL,
      PermissionsEnum?.HOME_ABOUT_US_ALL,
      PermissionsEnum?.ABOUT_US_FEATURE_ALL,
      PermissionsEnum?.ABOUT_US_CORE_ALL,
      PermissionsEnum?.FAQ_ALL,
      PermissionsEnum?.OUR_SYSTEM_RISK_MANAGEMENT_ALL,
      PermissionsEnum?.OUR_SYSTEM_STEP_ALL,
      PermissionsEnum?.OUR_SYSTEM_FEATURE_ALL,
      PermissionsEnum?.OUR_SYSTEM_RISK_TYPE_ALL,
      PermissionsEnum?.OUR_SYSTEM_COMPONENT_ALL,
    ]">
      <Accordion v-model:value="websiteAccordion">
        <AccordionPanel value="2">
          <AccordionHeader>
            <div class="links-header">
              <GlobalIcon />
              {{ $t('website') }}
            </div>
          </AccordionHeader>

          <AccordionContent>
            <ul>
              <PermissionBuilder v-for="(r, index) in WebsiteRoutes" :key="index" :code="r.permissions">
                <li>
                  <router-link :to="r.link">
                    <component :is="r.icon" class="route-icon" />
                    <span>{{ $t(r.name) }}</span>
                  </router-link>
                </li>
              </PermissionBuilder>
            </ul>
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel class="active-panel-out" v-if="SelectedWebsiteRoute && !websiteAccordion">
          <span>{{ SelectedWebsiteRoute }}</span>
        </AccordionPanel>
      </Accordion>
    </PermissionBuilder>

    <PermissionBuilder :code="LockUpsRoutes?.map((item) => item.permissions.map((item) => item)).flat()">
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
              <PermissionBuilder v-for="(r, index) in LockUpsRoutes" :key="index" :code="r?.permissions">
                <li>
                  <router-link :to="r.link" :class="route?.fullPath?.includes(r.link) ? '' : ''">
                    <component :is="r.icon" class="route-icon" />
                    <span>{{ $t(r.name) }}</span>
                  </router-link>
                </li>
              </PermissionBuilder>
            </ul>
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel class="active-panel-out" v-if="SelectedLockupsRoute && !LoackupsAccordion">
          <span>{{ SelectedLockupsRoute }}</span>
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
  transition: background 0.2s ease, color 0.2s ease;
  position: relative;
  text-decoration: none;
  flex-shrink: 0;
}

.icon-item:hover,
.icon-item.router-link-active {
  background: rgba(31, 65, 187, 0.08);
  color: var(--PrimaryColor);
}

.icon-item::after {
  content: attr(data-title);
  position: absolute;
  inset-inline-start: calc(100% + 6px);
  top: 50%;
  transform: translateY(-50%);
  background: #2c2c2c;
  color: #fff;
  padding: 5px 10px;
  border-radius: 6px;
  white-space: nowrap;
  font-size: 12px;
  font-family: 'Regular', sans-serif;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
  z-index: 9999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.icon-item:hover::after {
  opacity: 1;
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
</style>
