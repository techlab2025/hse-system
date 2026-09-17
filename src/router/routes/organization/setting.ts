import type { RouteRecordRaw } from '@/router/types'

export const SettingRoutes: RouteRecordRaw[] = [
  {
    path: 'system-identity',
    name: 'System Identity',
    component: () => import('@/views/Organization/SystemIdentity.vue'),
    meta: {
      breadcrumb: 'System Identity',
    },
  },
  {
    path: 'setting',
    name: 'Organization Setting',
    component: () => import('@/views/Home/OrganizationHomeSetting.vue'),
    meta: {
      breadcrumb: 'Organization Setting',
    },
  },
]
