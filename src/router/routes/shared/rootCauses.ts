import type { RouteRecordRaw } from '@/router/types'

export const RootCausesRoutes: RouteRecordRaw[] = [
  {
    path: 'root-causes',
    name: 'Root Causes',
    component: () => import('@/views/Organization/RootCaueses/IndexRootCauses.vue'),
    meta: {
      breadcrumb: 'Root Causes',
      type: 'Shared',
      isSidebar: true,

    },
  },
  {
    path: 'root-causes/:id',
    name: 'Edit Root Causes',
    component: () => import('@/views/Organization/RootCaueses/EditRootCauses.vue'),
    meta: {
      breadcrumb: 'Edit Root Causes',
      parent: 'Root Causes',
      type: 'Shared',
      isSidebar: true,

    },
  },
  {
    path: 'root-causes/add',
    name: 'Add Root Causes',
    component: () => import('@/views/Organization/RootCaueses/AddRootCauses.vue'),
    meta: {
      breadcrumb: 'Add Root Causes',
      parent: 'Root Causes',
      type: 'Shared',
      isSidebar: true,

    },
  },
]
