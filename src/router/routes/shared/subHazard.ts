import type { RouteRecordRaw } from '@/router/types'

export const SubHazardRoutes: RouteRecordRaw[] = [
  {
    path: 'hazard',
    name: 'Risk',
    component: () => import('@/views/Admin/Hazard/IndexHazard.vue'),
    meta: {
      breadcrumb: 'Risk',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'hazard/add/:parent_id?',
    name: 'Add Risk',
    component: () => import('@/views/Admin/Hazard/AddHazard.vue'),
    meta: {
      breadcrumb: 'Add Risk',
      parent: 'Risk',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'hazard/:id',
    name: 'Edit Risk',
    component: () => import('@/views/Admin/Hazard/EditHazard.vue'),
    meta: {
      breadcrumb: 'Edit Risk',
      parent: 'Risk',
      type: 'Shared',
      isSidebar: true,
    },
  },
]
