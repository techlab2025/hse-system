import type { RouteRecordRaw } from '@/router/types'

export const ScopeRoutes: RouteRecordRaw[] = [
  {
    path: 'scope',
    name: 'Scope',
    component: () => import('@/views/Organization/Scope/IndexScope.vue'),
    meta: {
      breadcrumb: 'COntractor Scope',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'scope/:id',
    name: 'Edit Scope',
    component: () => import('@/views/Organization/Scope/EditScope.vue'),
    meta: {
      breadcrumb: 'Edit Contractor Scope',
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
      breadcrumb: 'Add Contractor Scope',
      parent: 'Scope',
      type: 'Shared',
      isSidebar: true,
    },
  },
]
