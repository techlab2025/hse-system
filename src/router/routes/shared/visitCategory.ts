import type { RouteRecordRaw } from '@/router/types'

export const visitCategoryRoutes: RouteRecordRaw[] = [
  {
    path: 'visit-categories',
    name: 'Visit Categories',
    component: () => import('@/views/Organization/VisitCategory/IndexVisitCategory.vue'),
    meta: { breadcrumb: 'Visit Categories', type: 'Shared', isSidebar: true },
  },
  {
    path: 'visit-category/add',
    name: 'Add Visit Category',
    component: () => import('@/views/Organization/VisitCategory/AddVisitCategory.vue'),
    meta: {
      breadcrumb: 'Add Visit Category',
      parent: 'Visit Categories',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'visit-category/:id',
    name: 'Edit Visit Category',
    component: () => import('@/views/Organization/VisitCategory/EditVisitCategory.vue'),
    meta: {
      breadcrumb: 'Edit Visit Category',
      parent: 'Visit Categories',
      type: 'Shared',
      isSidebar: true,
    },
  },
]
