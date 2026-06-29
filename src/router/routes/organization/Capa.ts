import type { RouteRecordRaw } from '@/router/types'

export const CapaRoutes: RouteRecordRaw[] = [
  {
    path: 'capa',
    name: 'Capa',
    component: () => import('@/views/Organization/Capa/Capa.vue'),
    meta: {
      breadcrumb: 'Capa',
    },
  },
  {
    path: 'capa/:id',
    name: 'Capa Details',
    component: () => import('@/views/Organization/Capa/CapaDetails.vue'),
    meta: {
      breadcrumb: 'CapaDetails',
      parent: 'Capa',
    },
  },
]
