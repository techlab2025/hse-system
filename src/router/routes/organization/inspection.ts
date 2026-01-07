import type { RouteRecordRaw } from '@/router/types'

export const InspectionRoutes: RouteRecordRaw[] = [
  {
    path: 'inspection',
    name: 'Inspection',
    component: () => import('@/views/Organization/Inspection/IndexInspection.vue'),
  },
  {
    path: 'inspection/add/:equipment_id?',
    name: 'Add Inspection',
    component: () => import('@/views/Organization/Inspection/AddInspection.vue'),
  },
  {
    path: 'inspection/:id',
    name: 'Edit Inspection',
    component: () => import('@/views/Organization/Inspection/EditInspection.vue'),
  },
  {
    path: 'inspection/overdue',
    name: 'Overdue Inspection',
    component: () => import('@/views/Organization/Inspection/OverdueInspection.vue'),
  },
  {
    path: 'inspection/result/:id',
    name: 'Inspection Result',
    component: () => import('@/views/Organization/Inspection/InspectionResultPage.vue'),
  },
]
