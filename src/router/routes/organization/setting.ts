import type { RouteRecordRaw } from '@/router/types'

export const SettingRoutes: RouteRecordRaw[] = [
  {
    path: 'setting',
    name: 'Organization Setting',
    component: () => import('@/views/Home/OrganizationHomeSetting.vue'),
    meta: {
      breadcrumb: 'Organization Setting',
    },
  },
]
