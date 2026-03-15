import type { RouteRecordRaw } from '@/router/types'

export const CheckListRoutes: RouteRecordRaw[] = [
  {
    path: 'check-list',
    name: 'CheckList',
    component: () => import('@/views/Organization/CheckList/IndexCheckList.vue'),
  },
  {
    path: 'check-list/add',
    name: 'Add CheckList',
    component: () => import('@/views/Organization/CheckList/AddCheckList.vue'),
  },
  {
    path: 'check-list/:id',
    name: 'Edit CheckList',
    component: () => import('@/views/Organization/CheckList/EditCheckList.vue'),
  },
]
