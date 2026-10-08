import { featureTranslation } from '@/features/Organization/featureTranslation'
import type { RouteRecordRaw } from '@/router/types'

export const AuditStandardRoutes: RouteRecordRaw[] = [
  {
    path: 'audit-standards',
    name: 'Audit Standards',
    component: () => import('@/views/Organization/AuditStandard/IndexAuditStandard.vue'),
    meta: { breadcrumb: featureTranslation('Audit Standards'), type: 'Shared', isSidebar: true },
  },
  {
    path: 'audit-standard/add',
    name: 'Add Audit Standard',
    component: () => import('@/views/Organization/AuditStandard/AddAuditStandard.vue'),
    meta: {
      breadcrumb: featureTranslation('Add Audit Standard'),
      parent: 'Audit Standards',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'audit-standard/:id',
    name: 'Edit Audit Standard',
    component: () => import('@/views/Organization/AuditStandard/EditAuditStandard.vue'),
    meta: {
      breadcrumb: featureTranslation('Edit Audit Standard'),
      parent: 'Audit Standards',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'audit-standard/upload-excel',
    name: 'Upload Audit Standards',
    component: () => import('@/views/Organization/AuditStandard/AuditStandardExcelSheet.vue'),
    meta: {
      breadcrumb: featureTranslation('Upload Audit Standards'),
      parent: 'Audit Standards',
      type: 'Shared',
      isSidebar: true,
    },
  },
]
