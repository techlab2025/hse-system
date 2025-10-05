import type { RouteRecordRaw } from '@/router/types'
import { partnerRoutes } from '@/router/routes/organization/partner.ts'
import { projectRoutes } from '@/router/routes/organization/project.ts'
import { projectZoneRoutes } from '@/router/routes/organization/projectZone.ts'
import { organizationEmployeeRoutes } from '@/router/routes/organization/organizationEmployee.ts'
import { organizationEmployeeRoutes } from '@/router/routes/routes/organization/orgnaztionEmployee.ts'
import { herikalyRoutes } from '@/router/routes/organization/herikaly.ts'

export const organizationRoutes: RouteRecordRaw[] = [
  {
    path: 'organization',
    name: 'Organization',
    component: () => import('@/views/AppHome.vue'),
  },
  ...partnerRoutes,
  ...projectRoutes,
  ...projectZoneRoutes,
  ...organizationEmployeeRoutes,
  ...organizationEmployeeRoutes,
  ...herikalyRoutes,
  {
    path: 'permission/:id',
    name: 'Permission Organization',
    component: () => import('@/views/Premission.vue'),
  },
]
