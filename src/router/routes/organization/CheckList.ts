import type { RouteRecordRaw } from '@/router/types'

export const CheckListRoutes: RouteRecordRaw[] = [
  {
    path: 'check-list',
    name: 'CheckList',
    component: () => import('@/views/Organization/CheckList/IndexCheckList.vue'),
    meta: {
      breadcrumb: 'CheckList',
      isSidebar: true,
    },
  },
  {
    path: 'check-list/add',
    name: 'Add CheckList',
    component: () => import('@/views/Organization/CheckList/AddCheckList.vue'),
    meta: {
      breadcrumb: 'Add CheckList',
      parent: 'CheckList',
      isSidebar: true,
    },
  },
  {
    path: 'check-list/:id',
    name: 'Edit CheckList',
    component: () => import('@/views/Organization/CheckList/EditCheckList.vue'),
    meta: {
      breadcrumb: 'Edit CheckList',
      parent: 'CheckList',
      isSidebar: true,
    },
  },
]
