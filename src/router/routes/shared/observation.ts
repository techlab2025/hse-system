import type { RouteRecordRaw } from '@/router/types'

export const observationRoutes: RouteRecordRaw[] = [
  {
    path: 'observation',
    name: 'Observeration',
    component: () => import('@/views/Admin/Observation/IndexObservation.vue'),
  },
  {
    path: 'observation/add',
    name: 'Add Observeration',
    component: () => import('@/views/Admin/Observation/AddObservation.vue'),
  },
  {
    path: 'observatin/:id',
    name: 'Edit Observeration',
    component: () => import('@/views/Admin/Observation/EditObservation.vue'),
  },
]
