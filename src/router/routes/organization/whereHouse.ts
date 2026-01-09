import type { RouteRecordRaw } from '@/router/types'

export const WhereHouseRoutes: RouteRecordRaw[] = [
  {
    path: 'where-house',
    name: 'WhereHouse',
    component: () => import('@/views/Organization/WhereHouse/IndexWhereHouse.vue'),
    meta: {
      breadcrumb: 'WhereHouse',
    },
  },
  {
    path: 'where-house/add',
    name: 'Add WhereHouse',
    component: () => import('@/views/Organization/WhereHouse/AddWhereHouse.vue'),
    meta: {
      breadcrumb: 'Add WhereHouse',
      parent: 'WhereHouse',
    },
  },
  {
    path: 'where-house/:id',
    name: 'Edit WhereHouse',
    component: () => import('@/views/Organization/WhereHouse/EditWhereHouse.vue'),
    meta: {
      breadcrumb: 'Edit WhereHouse',
      parent: 'WhereHouse',
    },
  },
]
