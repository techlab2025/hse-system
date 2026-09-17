import type { RouteRecordRaw } from '@/router/types'

export const AuditRoutes: RouteRecordRaw[] = [
  {
    path: 'audits/:id',
    name: 'Audits',
    component: () => import('@/views/Organization/Inspection/IndexInspection.vue'),
    meta: {
      breadcrumb: 'Audits',
      parent: 'Project Details',
    },
  },
  {
    path: 'audits/add/:id?',
    name: 'Add Audit',
    component: () => import('@/views/Organization/Inspection/AddInspection.vue'),
    meta: {
      breadcrumb: 'Add Audit',
      parent: 'Audits',
    },
  },
]
