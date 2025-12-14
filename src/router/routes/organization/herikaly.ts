import type { RouteRecordRaw } from '@/router/types'

export const herikalyRoutes: RouteRecordRaw[] = [
  {
    path: 'herikaly/:parent_id?',
    name: 'Hierarchy',
    component: () => import('@/views/Organization/Herikaly/IndexHerikaly.vue'),
  },
  {
    path: 'herikaly/:id',
    name: 'Edit Hierarchy',
    component: () => import('@/views/Organization/Herikaly/EditHerikaly.vue'),
  },
  {
    path: 'herikaly/add/:parent_id?',
    name: 'Add Hierarchy',
    component: () => import('@/views/Organization/Herikaly/AddHerikaly.vue'),
  },
]
