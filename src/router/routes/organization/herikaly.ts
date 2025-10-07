import type { RouteRecordRaw } from '@/router/types'

export const herikalyRoutes: RouteRecordRaw[] = [
  {
    path: 'herikaly/:parent_id?',
    name: 'Herikaly',
    component: () => import('@/views/organization/Herikaly/IndexHerikaly.vue'),
  },
  {
    path: 'herikaly/:id',
    name: 'Edit Herikaly',
    component: () => import('@/views/organization/Herikaly/EditHerikaly.vue'),
  },
  {
    path: 'herikaly/add/:parent_id?',
    name: 'Add Herikaly',
    component: () => import('@/views/organization/Herikaly/AddHerikaly.vue'),
  },
]
