import type { RouteRecordRaw } from '@/router/types'

export const observerationRoutes: RouteRecordRaw[] = [
  {
    path: 'observation-types',
    name: 'Observeration Type',
    component: () => import('@/views/Admin/ObserverationType/IndexObserverationType.vue'),
  },
  {
    path: 'observation-type/add',
    name: 'Add Observeration Type',
    component: () => import('@/views/Admin/ObserverationType/AddObserverationType.vue'),
  },
  {
    path: 'observation-type/:id',
    name: 'Edit Observeration Type',
    component: () => import('@/views/Admin/ObserverationType/EditObserverationType.vue'),
  },
]
