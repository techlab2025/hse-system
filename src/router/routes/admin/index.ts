import type { RouteRecordRaw } from '@/router/types'
import { languageRoutes } from './language'
import { industryRoutes } from './industry'
import { locationRoutes } from './location'
import { websiteRoutes } from './website'

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'Home',
    component: () => import('@/views/AppHome.vue'),
  },
  ...languageRoutes,
  ...industryRoutes,
  ...locationRoutes,
  ...websiteRoutes,
  {
    path: 'permission/:id',
    name: 'Permission Admin',
    component: () => import('@/views/Premission.vue'),
  },
]
