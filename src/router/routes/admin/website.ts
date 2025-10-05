import type { RouteRecordRaw, WebsiteModule } from '@/router/types'
import { createWebsiteModuleRoutes } from '@/router/helpers'

const websiteModules: WebsiteModule[] = [
  { path: 'about-us-features', name: 'AboutUsFeature' },
  { path: 'about-us-core', name: 'AboutUsCore' },
  { path: 'home-about-us', name: 'HomeAboutUs' },
  { path: 'client-opinions', name: 'ClientOpinion', singular: 'client-opinion' },
  { path: 'home-contact-us', name: 'HomeContactUs' },
  { path: 'headers', name: 'Header', singular: 'header' },
  { path: 'powerfull-features', name: 'PowerFull', singular: 'power-full' },
  { path: 'system-works', name: 'SystemWork', singular: 'system-work' },
  { path: 'home-view-pricing', name: 'HomeViewPricing' },
  { path: 'categories', name: 'Category', singular: 'category' },
  { path: 'hashtags', name: 'Hashtag', singular: 'hashtag' },
  { path: 'services', name: 'Service', plural: 'Services' },
  { path: 'service-features', name: 'ServiceFeatures', singular: 'service-feature' },
  { path: 'service_section', name: 'ServiceSections', singular: 'service_section' },
  { path: 'service_logs', name: 'ServiceLogs', singular: 'service_logs' },
  { path: 'blog', name: 'Blog' },
  { path: 'system_banner', name: 'SystemBanner' },
  { path: 'system_feature', name: 'SystemFeature' },
  { path: 'faq', name: 'Faq' },
  { path: 'system_risk_type', name: 'SystemRiskType' },
  { path: 'system_components', name: 'SystemComponents' },
  { path: 'system-risk-management', name: 'SystemRiskManagement' },
  { path: 'our-system-step', name: 'OurSystemStep' },
]

export const websiteRoutes: RouteRecordRaw[] = [
  ...createWebsiteModuleRoutes(websiteModules),
  {
    path: 'term/add',
    name: 'Add Term',
    component: () => import('@/views/Admin/Website/Term/EditTerms.vue'),
  },
  {
    path: 'privacy/add',
    name: 'Add Privacy',
    component: () => import('@/views/Admin/Website/Privacy/EditPrivacy.vue'),
  },
]
