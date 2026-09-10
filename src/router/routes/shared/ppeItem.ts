import type { RouteRecordRaw } from '@/router/types'

export const ppeItemRoutes: RouteRecordRaw[] = [
  {
    path: 'ppe-items',
    name: 'PPE Items',
    component: () =>
      import('@/features/Organization/ppeItem/Presentation/components/IndexPpeItem.vue'),
    meta: { breadcrumb: 'PPE Items', type: 'Shared', isSidebar: true },
  },
  {
    path: 'ppe-item/add',
    name: 'Add PPE Item',
    component: () =>
      import('@/features/Organization/ppeItem/Presentation/components/AddPpeItem.vue'),
    meta: { breadcrumb: 'Add PPE Item', parent: 'PPE Items', type: 'Shared', isSidebar: true },
  },
  {
    path: 'ppe-item/:id',
    name: 'Edit PPE Item',
    component: () =>
      import('@/features/Organization/ppeItem/Presentation/components/EditPpeItem.vue'),
    meta: { breadcrumb: 'Edit PPE Item', parent: 'PPE Items', type: 'Shared', isSidebar: true },
  },
  {
    path: 'ppe-item/upload-excel',
    name: 'Upload PPE Items',
    component: () =>
      import('@/features/Organization/ppeItem/Presentation/components/UploadPpeItemExcelSheet.vue'),
    meta: { breadcrumb: 'Upload PPE Items', parent: 'PPE Items', type: 'Shared', isSidebar: true },
  },
]
