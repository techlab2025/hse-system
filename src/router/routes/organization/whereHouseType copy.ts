import type { RouteRecordRaw } from '@/router/types'

export const WhereHouseTRoutes: RouteRecordRaw[] = [
  {
    path: 'where-house-type',
    name: 'WhereHouseType',
    component: () => import('@/views/Organization/WhereHouseType/IndexWhereHouseType.vue'),
  },
  {
    path: 'where-house-type/add',
    name: 'Add WhereHouseType',
    component: () => import('@/views/Organization/WhereHouseType/AddWhereHouseType.vue'),
  },
  {
    path: 'where-house-type/:id',
    name: 'Edit WhereHouseType',
    component: () => import('@/views/Organization/WhereHouseType/EditWhereHouseType.vue'),
  },
]
