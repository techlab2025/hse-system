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
]
