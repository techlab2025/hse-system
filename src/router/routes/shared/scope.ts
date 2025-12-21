import type { RouteRecordRaw } from '@/router/types'

export const ScopeRoutes: RouteRecordRaw[] = [
  {
    path: 'scope',
    name: 'Scope',
    component: () => import('@/views/Organization/Scope/IndexScope.vue'),
  },
  {
    path: 'scope/:id',
    name: 'Edit Scope',
    component: () => import('@/views/Organization/Scope/EditScope.vue'),
  },
  {
    path: 'scope/add',
    name: 'Add Scope',
    component: () => import('@/views/Organization/Scope/AddScope.vue'),
  },
]
