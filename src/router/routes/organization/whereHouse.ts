import type { RouteRecordRaw } from '@/router/types'

export const WhereHouseRoutes: RouteRecordRaw[] = [
  {
    path: 'where-house',
    name: 'warehouse',
    component: () => import('@/views/Organization/WhereHouse/IndexWhereHouse.vue'),
    meta: {
      breadcrumb: 'warehouse',
      isSidebar: true,
    },
  },
  {
    path: 'where-house/add',
    name: 'Add warehouse',
    component: () => import('@/views/Organization/WhereHouse/AddWhereHouse.vue'),
    meta: {
      breadcrumb: 'Add warehouse',
      parent: 'warehouse',
      isSidebar: true,
    },
  },
  {
    path: 'where-house/:id',
    name: 'Edit warehouse',
    component: () => import('@/views/Organization/WhereHouse/EditWhereHouse.vue'),
    meta: {
      breadcrumb: 'Edit warehouse',
      parent: 'warehouse',
      isSidebar: true,
    },
  },
]
