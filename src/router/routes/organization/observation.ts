import type { RouteRecordRaw } from '@/router/types'

export const observationRoutes: RouteRecordRaw[] = [
  {
    path: 'observation',
    name: 'Observeration',
    component: () => import('@/views/Organization/ObservationFactory/Observation/IndexObservation.vue'),
  },
  {
    path: 'observation/add',
    name: 'Add Observeration',
    component: () => import('@/views/Organization/ObservationFactory/Observation/AddObservation.vue'),
  },
  {
    path: 'observation/:id',
    name: 'Edit Observeration',
    component: () => import('@/views/Organization/ObservationFactory/Observation/EditObservation.vue'),
  },
  {
    path: 'all-observatin',
    name: 'All Observeration',
    component: () => import('@/views/Organization/ObservationFactory/Observation/AllObservation.vue'),
  },
]
