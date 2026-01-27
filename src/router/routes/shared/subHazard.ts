import type { RouteRecordRaw } from '@/router/types'

export const SubHazardRoutes: RouteRecordRaw[] = [
  {
    path: 'hazard',
    name: 'Hazard',
    component: () => import('@/views/Admin/Hazard/IndexHazard.vue'),
    meta: {
      breadcrumb: 'Hazard',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'hazard/add/:parent_id?',
    name: 'Add Hazard',
    component: () => import('@/views/Admin/Hazard/AddHazard.vue'),
    meta: {
      breadcrumb: 'Add Hazard',
      parent: 'Hazard',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'hazard/:id',
    name: 'Edit Hazard',
    component: () => import('@/views/Admin/Hazard/EditHazard.vue'),
    meta: {
      breadcrumb: 'Edit Hazard',
      parent: 'Hazard',
      type: 'Shared',
      isSidebar: true,
    },
  },
]
