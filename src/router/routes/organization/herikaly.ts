import type { RouteRecordRaw } from '@/router/types'

export const herikalyRoutes: RouteRecordRaw[] = [
  {
    path: 'herikaly/:parent_id?',
    name: 'Herikaly',
    component: () => import('@/views/Organization/Herikaly/IndexHerikaly.vue'),
  },
  {
    path: 'herikaly/:id',
    name: 'Edit Herikaly',
    component: () => import('@/views/Organization/Herikaly/EditHerikaly.vue'),
  },
  {
    path: 'herikaly/add/:parent_id?',
    name: 'Add Herikaly',
    component: () => import('@/views/Organization/Herikaly/AddHerikaly.vue'),
  },
]
