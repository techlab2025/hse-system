import type { RouteRecordRaw } from '@/router/types'

export const InjuryRoutes: RouteRecordRaw[] = [
  {
    path: 'injury',
    name: 'Injury',
    component: () => import('@/views/Organization/Injury/IndexInjury.vue'),
    meta: {
      breadcrumb: 'Injury',
    },
  },
  {
    path: 'injury/add',
    name: 'Add Injury',
    component: () => import('@/views/Organization/Injury/AddInjury.vue'),
    meta: {
      breadcrumb: 'Add Injury',
      parent: 'Injury',
    },
  },
  {
    path: 'injury/:id',
    name: 'Edit Injury',
    component: () => import('@/views/Organization/Injury/EditInjury.vue'),
    meta: {
      breadcrumb: 'Edit Injury',
      parent: 'Injury',
    },
  },
]
