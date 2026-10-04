import { featureTranslation } from '@/features/Organization/featureTranslation'
import type { RouteRecordRaw } from '@/router/types'

export const AuditActivityRoutes: RouteRecordRaw[] = [
  {
    path: 'audit-activities',
    name: 'Audit Activities',
    component: () => import('@/views/Organization/AuditActivity/IndexAuditActivity.vue'),
    meta: { breadcrumb: featureTranslation('Audit Activities'), type: 'Shared', isSidebar: true },
  },
  {
    path: 'audit-activity/add',
    name: 'Add Audit Activity',
    component: () => import('@/views/Organization/AuditActivity/AddAuditActivity.vue'),
    meta: {
      breadcrumb: featureTranslation('Add Audit Activity'),
      parent: 'Audit Activities',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'audit-activity/:id',
    name: 'Edit Audit Activity',
    component: () => import('@/views/Organization/AuditActivity/EditAuditActivity.vue'),
    meta: {
      breadcrumb: featureTranslation('Edit Audit Activity'),
      parent: 'Audit Activities',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'audit-activity/upload-excel',
    name: 'Upload Audit Activities',
    component: () => import('@/views/Organization/AuditActivity/AuditActivityExcelSheet.vue'),
    meta: {
      breadcrumb: featureTranslation('Upload Audit Activities'),
      parent: 'Audit Activities',
      type: 'Shared',
      isSidebar: true,
    },
  },
]
