import type { RouteRecordRaw } from '@/router/types'

export const partnerRoutes: RouteRecordRaw[] = [
  {
    path: 'partners',
    name: 'Partners Organization',
    component: () => import('@/views/Organization/Partener/IndexPartener.vue'),
  },
  {
    path: 'partner/add',
    name: 'Add Partner Organization',
    component: () => import('@/views/Organization/Partener/AddPartener.vue'),
  },
  {
    path: 'partner/:id',
    name: 'Edit Partner Organization',
    component: () => import('@/views/Organization/Partener/EditPartener.vue'),
  },
]
