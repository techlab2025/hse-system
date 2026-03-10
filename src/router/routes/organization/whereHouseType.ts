import type { RouteRecordRaw } from '@/router/types'

export const WhereHouseTypeRoutes: RouteRecordRaw[] = [
  {
    path: 'where-house-type',
    name: 'WarehouseType',
    component: () => import('@/views/Organization/WhereHouseType/IndexWhereHouseType.vue'),
    meta: {
      breadcrumb: 'WarehouseType',
      isSidebar: true,
      type: 'Shared',
    },
  },
  {
    path: 'where-house-type/add',
    name: 'Add WarehouseType',
    component: () => import('@/views/Organization/WhereHouseType/AddWhereHouseType.vue'),
    meta: {
      breadcrumb: 'Add WarehouseType',
      parent: 'WarehouseType',
      isSidebar: true,
      type: 'Shared',
    },
  },
  {
    path: 'where-house-type/:id',
    name: 'Edit WarehouseType',
    component: () => import('@/views/Organization/WhereHouseType/EditWhereHouseType.vue'),
    meta: {
      breadcrumb: 'Edit WarehouseType',
      parent: 'WarehouseType',
      isSidebar: true,
      type: 'Shared',
    },
  },
  {
    path: 'where-house-type/upload',
    name: 'Upload WarehouseType',
    component: () =>
      import(
        '@/features/Organization/WhereHouseType/Presentation/components/UploadWarehouseExeclSheet.vue'
      ),
    meta: {
      breadcrumb: 'Upload WarehouseType',
      parent: 'WarehouseType',
      isSidebar: true,
      type: 'Shared',
    },
  },
]
