import type { RouteRecordRaw } from '@/router/types'

export const PPEActivityRoutes: RouteRecordRaw[] = [
  {
    path: 'ppe-activities',
    name: 'PPE Activities',
    component: () => import('@/views/Organization/PPEActivity/IndexPPEActivity.vue'),
    meta: { breadcrumb: 'PPE Activities', type: 'Shared', isSidebar: true },
  },
  {
    path: 'ppe-activity/add',
    name: 'Add PPE Activity',
    component: () => import('@/views/Organization/PPEActivity/AddPPEActivity.vue'),
    meta: { breadcrumb: 'Add PPE Activity', parent: 'PPE Activities', type: 'Shared', isSidebar: true },
  },
  {
    path: 'ppe-activity/:id',
    name: 'Edit PPE Activity',
    component: () => import('@/views/Organization/PPEActivity/EditPPEActivity.vue'),
    meta: { breadcrumb: 'Edit PPE Activity', parent: 'PPE Activities', type: 'Shared', isSidebar: true },
  },
  {
    path: 'ppe-activity/upload-excel',
    name: 'Upload PPE Activities',
    component: () => import('@/views/Organization/PPEActivity/PPEActivityExcelSheet.vue'),
    meta: { breadcrumb: 'Upload PPE Activities', parent: 'PPE Activities', type: 'Shared', isSidebar: true },
  },
]
