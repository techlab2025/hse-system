import type { RouteRecordRaw } from '@/router/types'

export const RoleRoutes: RouteRecordRaw[] = [
  {
    path: 'role',
    name: 'Role',
    component: () => import('@/views/Organization/Role/IndexRole.vue'),
    meta: {
      breadcrumb: 'Role',
      type: 'Shared',
      isSidebar: true,

    },
  },
  {
    path: 'role/:id',
    name: 'Edit Role',
    component: () => import('@/views/Organization/Role/EditRole.vue'),
    meta: {
      breadcrumb: 'Edit Role',
      parent: 'Role',
      type: 'Shared',
      isSidebar: true,

    },
  },
  {
    path: 'role/add',
    name: 'Add Role',
    component: () => import('@/views/Organization/Role/AddRole.vue'),
    meta: {
      breadcrumb: 'Add Role',
      parent: 'Role',
      type: 'Shared',
      isSidebar: true,

    },
  },
]
