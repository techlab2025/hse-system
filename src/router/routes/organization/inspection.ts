import type { RouteRecordRaw } from '@/router/types'

export const InspectionRoutes: RouteRecordRaw[] = [
  {
    path: 'inspection',
    name: 'Inspection',
    component: () => import('@/views/Organization/Inspection/IndexInspection.vue'),
    meta: {
      breadcrumb: 'Inspection',
    },
  },
  {
    path: 'inspection/add/:equipment_id?',
    name: 'Add Inspection',
    component: () => import('@/views/Organization/Inspection/AddInspection.vue'),
    meta: {
      breadcrumb: 'Add Inspection',
      parent: 'Inspection',
    },
  },
  {
    path: 'inspection/:id',
    name: 'Edit Inspection',
    component: () => import('@/views/Organization/Inspection/EditInspection.vue'),
    meta: {
      breadcrumb: 'Edit Inspection',
      parent: 'Inspection',
    },
  },
  {
    path: 'inspection/overdue',
    name: 'Overdue Inspection',
    component: () => import('@/views/Organization/Inspection/OverdueInspection.vue'),
    meta: {
      breadcrumb: 'Overdue Inspection',
    },
  },
  {
    path: 'inspection/result/:id',
    name: 'Inspection Result',
    component: () => import('@/views/Organization/Inspection/InspectionResultPage.vue'),
    meta: {
      breadcrumb: 'Inspection Result',
    },
  },
]
