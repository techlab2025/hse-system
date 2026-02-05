import type { RouteRecordRaw } from '@/router/types'
import { languageRoutes } from './language'
import { industryRoutes } from './industry'
// import { locationRoutes } from './location'
import { websiteRoutes } from './website'
import { projectTypesRoutes } from './projectTypes'
import { adminsRoutes } from './admins'
import { organizationRoutes } from './organization'
import { SubscriptionTypeRoutes } from './subscriptionType'
import { SubscriptionRoutes } from './subscription'
import { SubscriptionApplicationRoutes } from './subscriptionApplication'
import { CatalogRoutes } from './Catalog'
import { CatalogItemsRoutes } from './CatalogItems'

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'Home',
    component: () => import('@/views/AppHome.vue'),
  },
  ...languageRoutes,
  ...industryRoutes,
  // ...locationRoutes,
  ...websiteRoutes,
  ...projectTypesRoutes,
  ...adminsRoutes,
  ...organizationRoutes,
  ...SubscriptionTypeRoutes,
  ...SubscriptionRoutes,
  ...SubscriptionApplicationRoutes,
  ...CatalogRoutes,
  ...CatalogItemsRoutes,
  {
    path: 'permission/:id',
    name: 'Permission Admin',
    component: () => import('@/views/Premission.vue'),
  },
]
