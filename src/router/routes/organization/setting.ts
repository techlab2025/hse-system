import type { RouteRecordRaw } from '@/router/types'

export const SettingRoutes: RouteRecordRaw[] = [
  {
    path: 'integrations/email',
    name: 'Email Integration',
    component: () => import('@/views/Organization/EmailIntegration.vue'),
    meta: { breadcrumb: 'Email Integration' },
  },
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
