import type { RouteRecordRaw } from '@/router/types'

export const AuditRoutes: RouteRecordRaw[] = [
  {
    path: 'audits',
    name: 'Audits',
    component: () => import('@/views/Organization/Inspection/IndexInspection.vue'),
    meta: {
      breadcrumb: 'Audits',
    },
  },
  {
    path: 'audits/add/:equipment_id?',
    name: 'Add Audit',
    component: () => import('@/views/Organization/Inspection/AddInspection.vue'),
    meta: {
      breadcrumb: 'Add Audit',
      parent: 'Audits',
    },
  },
]
