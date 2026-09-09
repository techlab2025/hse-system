import type { RouteRecordRaw } from '@/router/types'

export const ScopeRoutes: RouteRecordRaw[] = [
  {
    path: 'scope',
    name: 'Scope',
    component: () => import('@/views/Organization/Scope/IndexScope.vue'),
    meta: {
      breadcrumb: 'scope service',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'scope/:id',
    name: 'Edit Scope',
    component: () => import('@/views/Organization/Scope/EditScope.vue'),
    meta: {
      breadcrumb: 'Edit scope service',
      parent: 'Scope',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'scope/add',
    name: 'Add Scope',
    component: () => import('@/views/Organization/Scope/AddScope.vue'),
    meta: {
      breadcrumb: 'Add scope service',
      parent: 'Scope',
      type: 'Shared',
      isSidebar: true,
    },
  },
]
