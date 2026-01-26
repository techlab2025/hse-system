import type { RouteRecordRaw } from '@/router/types'

export const partnerRoutes: RouteRecordRaw[] = [
  {
    path: 'partner',
    name: 'Partners Organization',
    component: () => import('@/views/Organization/Partener/IndexPartener.vue'),
    meta: {
      breadcrumb: 'Partners Organization',
      isSidebar: true,

    },
  },
  {
    path: 'partner/add',
    name: 'Add Partner Organization',
    component: () => import('@/views/Organization/Partener/AddPartener.vue'),
    meta: {
      breadcrumb: 'Add Partner Organization',
      parent: 'Partners Organization',
      isSidebar: true,

    },
  },
  {
    path: 'partner/:id',
    name: 'Edit Partner Organization',
    component: () => import('@/views/Organization/Partener/EditPartener.vue'),
    meta: {
      breadcrumb: 'Edit Partner Organization',
      parent: 'Partners Organization',
      isSidebar: true,

    },
  },
]
