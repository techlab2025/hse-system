import type { RouteRecordRaw } from '@/router/types'

export const observerationRoutes: RouteRecordRaw[] = [
  {
    path: 'observation-type',
    name: 'Observeration Type',
    component: () => import('@/views/Admin/ObserverationType/IndexObserverationType.vue'),
    meta: {
      breadcrumb: 'Observeration Type',
      type: 'Shared',
    },
  },
  {
    path: 'observation-type/add',
    name: 'Add Observeration Type',
    component: () => import('@/views/Admin/ObserverationType/AddObserverationType.vue'),
    meta: {
      breadcrumb: 'Add Observeration Type',
      parent: 'Observeration Type',
      type: 'Shared',
    },
  },
  {
    path: 'observation-type/:id',
    name: 'Edit Observeration Type',
    component: () => import('@/views/Admin/ObserverationType/EditObserverationType.vue'),
    meta: {
      breadcrumb: 'Edit Observeration Type',
      parent: 'Observeration Type',
      type: 'Shared',
    },
  },
]
