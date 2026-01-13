import type { RouteRecordRaw } from '@/router/types'

export const herikalyRoutes: RouteRecordRaw[] = [
  {
    // path: 'herikaly/:parent_id?',
    path: 'herikaly',
    name: 'Hierarchy',
    component: () => import('@/views/Organization/Herikaly/IndexHerikaly.vue'),
    meta: {
      breadcrumb: 'Hierarchy',
    },
  },
  {
    path: 'herikaly/:id',
    name: 'Edit Hierarchy',
    component: () => import('@/views/Organization/Herikaly/EditHerikaly.vue'),
    meta: {
      breadcrumb: 'Edit Hierarchy',
      parent: 'Hierarchy',
    },
  },
  {
    path: 'herikaly/add/:parent_id?',
    name: 'Add Hierarchy',
    component: () => import('@/views/Organization/Herikaly/AddHerikaly.vue'),
    meta: {
      breadcrumb: 'Add Hierarchy',
      parent: 'Hierarchy',
    },
  },
]
