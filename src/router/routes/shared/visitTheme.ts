import type { RouteRecordRaw } from '@/router/types'

export const visitThemeRoutes: RouteRecordRaw[] = [
  {
    path: 'visit-themes',
    name: 'Visit Themes',
    component: () => import('@/views/Organization/VisitTheme/IndexVisitTheme.vue'),
    meta: { breadcrumb: 'Visit Themes', type: 'Shared', isSidebar: true },
  },
  {
    path: 'visit-theme/add',
    name: 'Add Visit Theme',
    component: () => import('@/views/Organization/VisitTheme/AddVisitTheme.vue'),
    meta: {
      breadcrumb: 'Add Visit Theme',
      parent: 'Visit Themes',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'visit-theme/:id',
    name: 'Edit Visit Theme',
    component: () => import('@/views/Organization/VisitTheme/EditVisitTheme.vue'),
    meta: {
      breadcrumb: 'Edit Visit Theme',
      parent: 'Visit Themes',
      type: 'Shared',
      isSidebar: true,
    },
  },
]
