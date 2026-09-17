import type { RouteRecordRaw } from '@/router/types'

export const drillTypeRoutes: RouteRecordRaw[] = [
  {
    path: 'drill-types',
    name: 'Drill Types',
    component: () =>
      import('@/features/Organization/DrillType/Presentation/components/IndexDrillType.vue'),
    meta: { breadcrumb: 'Drill Types', type: 'Shared', isSidebar: true },
  },
  {
    path: 'drill-type/add',
    name: 'Add Drill Type',
    component: () =>
      import('@/features/Organization/DrillType/Presentation/components/AddDrillType.vue'),
    meta: {
      breadcrumb: 'Add Drill Type',
      parent: 'Drill Types',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'drill-type/:id',
    name: 'Edit Drill Type',
    component: () =>
      import('@/features/Organization/DrillType/Presentation/components/EditDrillType.vue'),
    meta: {
      breadcrumb: 'Edit Drill Type',
      parent: 'Drill Types',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'drill-type/upload-excel',
    name: 'Upload Drill Types',
    component: () =>
      import(
        '@/features/Organization/DrillType/Presentation/components/UploadDrillTypeExcelSheet.vue'
      ),
    meta: {
      breadcrumb: 'Upload Drill Types',
      parent: 'Drill Types',
      type: 'Shared',
      isSidebar: true,
    },
  },
]
