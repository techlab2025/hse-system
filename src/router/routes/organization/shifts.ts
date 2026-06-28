import type { RouteRecordRaw } from '@/router/types'

export const ShiftsRoutes: RouteRecordRaw[] = [
  {
    path: 'shifts',
    name: 'Shifts',
    component: () => import('@/views/Organization/Shifts/IndexShift.vue'),
    meta: {
      breadcrumb: 'Shifts',
      isSidebar: true,
      type: 'Shared',
    },
  },
  {
    path: 'shifts/add',
    name: 'Add Shift',
    component: () => import('@/views/Organization/Shifts/AddShift.vue'),
    meta: {
      breadcrumb: 'Add Shift',
      parent: 'Shifts',
      isSidebar: true,
      type: 'Shared',
    },
  },
  {
    path: 'shifts/:id',
    name: 'Edit Shift',
    component: () => import('@/views/Organization/Shifts/EditShift.vue'),
    meta: {
      breadcrumb: 'Edit Shift',
      parent: 'Shifts',
      isSidebar: true,
      type: 'Shared',
    },
  },
]
