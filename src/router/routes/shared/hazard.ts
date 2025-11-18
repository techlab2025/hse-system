import type { RouteRecordRaw } from '@/router/types'

export const hazardRoutes: RouteRecordRaw[] = [
  {
    path: 'hazard',
    name: 'Hazard ',
    component: () => import('@/views/Admin/Hazard/IndexHazard.vue'),
  },
  {
    path: 'hazard/add',
    name: 'Add Hazard ',
    component: () => import('@/views/Admin/Hazard/AddHazard.vue'),
  },
  {
    path: 'hazard/:id',
    name: 'Edit Hazard ',
    component: () => import('@/views/Admin/Hazard/EditHazard.vue'),
  },
]
