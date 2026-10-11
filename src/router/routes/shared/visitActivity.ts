import type { RouteRecordRaw } from '@/router/types'

export const visitActivityRoutes: RouteRecordRaw[] = [
  {
    path: 'visit-activities',
    name: 'Visit Activities',
    component: () => import('@/views/Organization/VisitActivity/IndexVisitActivity.vue'),
    meta: { breadcrumb: 'Visit Activities', type: 'Shared', isSidebar: true },
  },
  {
    path: 'visit-activity/add',
    name: 'Add Visit Activity',
    component: () => import('@/views/Organization/VisitActivity/AddVisitActivity.vue'),
    meta: {
      breadcrumb: 'Add Visit Activity',
      parent: 'Visit Activities',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'visit-activity/:id',
    name: 'Edit Visit Activity',
    component: () => import('@/views/Organization/VisitActivity/EditVisitActivity.vue'),
    meta: {
      breadcrumb: 'Edit Visit Activity',
      parent: 'Visit Activities',
      type: 'Shared',
      isSidebar: true,
    },
  },
]
