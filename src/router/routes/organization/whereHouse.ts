import type { RouteRecordRaw } from '@/router/types'

export const WhereHouseRoutes: RouteRecordRaw[] = [
  {
    path: 'where-house',
    name: 'WhereHouse',
    component: () => import('@/views/Organization/WhereHouse/IndexWhereHouse.vue'),
  },
  {
    path: 'where-house/add',
    name: 'Add WhereHouse',
    component: () => import('@/views/Organization/WhereHouse/AddWhereHouse.vue'),
  },
  {
    path: 'where-house/:id',
    name: 'Edit WhereHouse',
    component: () => import('@/views/Organization/WhereHouse/EditWhereHouse.vue'),
  },
]
