import type { RouteRecordRaw } from '@/router/types'

export const RoleRoutes: RouteRecordRaw[] = [
  {
    path: 'role',
    name: 'Role',
    component: () => import('@/views/Organization/Role/IndexRole.vue'),
  },
  {
    path: 'role/:id',
    name: 'Edit Role',
    component: () => import('@/views/Organization/Role/EditRole.vue'),
  },
  {
    path: 'role/add',
    name: 'Add Role',
    component: () => import('@/views/Organization/Role/AddRole.vue'),
  },
]
