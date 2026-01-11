import type { RouteRecordRaw } from '@/router/types'

export const ScopeRoutes: RouteRecordRaw[] = [
  {
    path: 'scope',
    name: 'Scope',
    component: () => import('@/views/Organization/Scope/IndexScope.vue'),
    meta: {
      breadcrumb: 'Scope',
      type: 'Shared',
    },
  },
  {
    path: 'scope/:id',
    name: 'Edit Scope',
    component: () => import('@/views/Organization/Scope/EditScope.vue'),
    meta: {
      breadcrumb: 'Edit Scope',
      parent: 'Scope',
      type: 'Shared',
    },
  },
  {
    path: 'scope/add',
    name: 'Add Scope',
    component: () => import('@/views/Organization/Scope/AddScope.vue'),
    meta: {
      breadcrumb: 'Add Scope',
      parent: 'Scope',
      type: 'Shared',
    },
  },
]
