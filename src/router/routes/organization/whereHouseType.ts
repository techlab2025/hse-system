import type { RouteRecordRaw } from '@/router/types'

export const WhereHouseTypeRoutes: RouteRecordRaw[] = [
  {
    path: 'where-house-type',
    name: 'WhereHouseType',
    component: () => import('@/views/Organization/WhereHouseType/IndexWhereHouseType.vue'),
    meta: {
      breadcrumb: 'WhereHouseType',
    },
  },
  {
    path: 'where-house-type/add',
    name: 'Add WhereHouseType',
    component: () => import('@/views/Organization/WhereHouseType/AddWhereHouseType.vue'),
    meta: {
      breadcrumb: 'Add WhereHouseType',
      parent: 'WhereHouseType',
    },
  },
  {
    path: 'where-house-type/:id',
    name: 'Edit WhereHouseType',
    component: () => import('@/views/Organization/WhereHouseType/EditWhereHouseType.vue'),
    meta: {
      breadcrumb: 'Edit WhereHouseType',
      parent: 'WhereHouseType',
    },
  },
]
