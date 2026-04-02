import type { RouteRecordRaw } from '@/router/types'

export const herikalyRoutes: RouteRecordRaw[] = [
  {
    // path: 'herikaly/:parent_id?',
    path: 'herikaly',
    name: 'Hierarchy',
    component: () => import('@/views/Organization/Herikaly/IndexHerikaly.vue'),
    meta: {
      breadcrumb: 'Positions',
      isSidebar: true,
      type: 'Shared',
    },
  },
  {
    path: 'herikaly/:id',
    name: 'Edit Hierarchy',
    component: () => import('@/views/Organization/Herikaly/EditHerikaly.vue'),
    meta: {
      breadcrumb: 'Edit Position',
      parent: 'Hierarchy',
      isSidebar: true,
      type: 'Shared',
    },
  },
  {
    path: 'herikaly/add/:parent_id?',
    name: 'Add Hierarchy',
    component: () => import('@/views/Organization/Herikaly/AddHerikaly.vue'),
    meta: {
      breadcrumb: 'Add Position',
      parent: 'Hierarchy',
      isSidebar: true,
      type: 'Shared',
    },
  },
  {
    path: 'herikaly/matrix',
    name: 'Hierarchy Matrix',
    component: () => import('@/views/Organization/Herikaly/HierarchyMatrix.vue'),
    meta: {
      breadcrumb: 'Competency Matrix',
      parent: 'Hierarchy',
      isSidebar: true,
      type: 'Shared',
    },
  },
  {
    path: 'herikaly/upload-excel',
    name: 'Upload Hierarchy Excel',
    component: () =>
      import(
        '@/features/Organization/Herikaly/Presentation/components/UploadHierarachyExeclSheet.vue'
      ),
    meta: {
      breadcrumb: 'Upload Position Excel',
      parent: 'Hierarchy',
      isSidebar: true,
      type: 'Shared',
    },
  },
]
