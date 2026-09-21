import type { RouteRecordRaw } from '@/router/types'

export const PPEToolRoutes: RouteRecordRaw[] = [
  {
    path: 'ppe-tools',
    name: 'PPE Tools',
    component: () => import('@/views/Organization/PPETool/IndexPPETool.vue'),
    meta: { breadcrumb: 'PPE Tools', type: 'Shared', isSidebar: true },
  },
  {
    path: 'ppe-tool/add',
    name: 'Add PPE Tool',
    component: () => import('@/views/Organization/PPETool/AddPPETool.vue'),
    meta: { breadcrumb: 'Add PPE Tool', parent: 'PPE Tools', type: 'Shared', isSidebar: true },
  },
  {
    path: 'ppe-tool/:id',
    name: 'Edit PPE Tool',
    component: () => import('@/views/Organization/PPETool/EditPPETool.vue'),
    meta: { breadcrumb: 'Edit PPE Tool', parent: 'PPE Tools', type: 'Shared', isSidebar: true },
  },
  {
    path: 'ppe-tool/upload-excel',
    name: 'Upload PPE Tools',
    component: () => import('@/views/Organization/PPETool/PPEToolExcelSheet.vue'),
    meta: { breadcrumb: 'Upload PPE Tools', parent: 'PPE Tools', type: 'Shared', isSidebar: true },
  },
]
