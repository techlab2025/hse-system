import type { RouteRecordRaw } from '@/router/types'

export const observationRoutes: RouteRecordRaw[] = [
  {
    path: 'observation',
    name: 'Observeration',
    component: () =>
      import('@/views/Organization/ObservationFactory/Observation/IndexObservation.vue'),
    meta: {
      breadcrumb: 'Observeration',
    },
  },
  {
    path: 'observation/add',
    name: 'Add Observeration',
    component: () =>
      import('@/views/Organization/ObservationFactory/Observation/AddObservation.vue'),
    meta: {
      breadcrumb: 'Add Observeration',
      parent: 'Observeration',
    },
  },
  {
    path: 'observation/:id',
    name: 'Edit Observeration',
    component: () =>
      import('@/views/Organization/ObservationFactory/Observation/EditObservation.vue'),
    meta: {
      breadcrumb: 'Edit Observeration',
      parent: 'Observeration',
    },
  },
  {
    path: 'observation/show/:id',
    name: 'Show Observeration',
    component: () =>
      import('@/views/Organization/ObservationFactory/Observation/ShowObservation.vue'),
    meta: {
      breadcrumb: 'Show Observeration',
      parent: 'Observeration',
    },
  },
  {
    path: 'all-observatin',
    name: 'All Observeration',
    component: () =>
      import('@/views/Organization/ObservationFactory/Observation/AllObservation.vue'),
    meta: {
      breadcrumb: 'Operations',
    },
  },
]
