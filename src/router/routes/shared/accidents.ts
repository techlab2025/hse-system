import type { RouteRecordRaw } from '@/router/types'

export const accidentsRoutes: RouteRecordRaw[] = [
  {
    path: 'accidents-type',
    name: 'Accidents Type',
    component: () => import('@/views/Admin/Accidents/IndexAccidentsType.vue'),
  },
  {
    path: 'accidents-type/add',
    name: 'Add Accidents Type',
    component: () => import('@/views/Admin/Accidents/AddAccidentsType.vue'),
  },
  {
    path: 'accidents-type/:id',
    name: 'Edit Accidents Type',
    component: () => import('@/views/Admin/Accidents/EditAccidentsType.vue'),
  },
]
