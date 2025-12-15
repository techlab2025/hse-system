import type { RouteRecordRaw } from '@/router/types'

export const InjuryRoutes: RouteRecordRaw[] = [
  {
    path: 'injury',
    name: 'Injury',
    component: () => import('@/views/Organization/Injury/IndexInjury.vue'),
  },
  {
    path: 'injury/add',
    name: 'Add Injury',
    component: () => import('@/views/Organization/Injury/AddInjury.vue'),
  },
  {
    path: 'injury/:id',
    name: 'Edit Injury',
    component: () => import('@/views/Organization/Injury/EditInjury.vue'),
  },
]
