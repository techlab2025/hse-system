import type { RouteRecordRaw } from '@/router/types'
import { languageRoutes } from './language'
import { industryRoutes } from './industry'
import { locationRoutes } from './location'
import { websiteRoutes } from './website'
import {projectTypesRoutes} from './projectTypes'

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
  ...projectTypesRoutes,

  {
    path: 'permission/:id',
    name: 'Permission Admin',
    component: () => import('@/views/Premission.vue'),
  },
]
