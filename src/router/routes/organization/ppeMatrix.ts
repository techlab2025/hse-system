import type { RouteRecordRaw } from '@/router/types'

export const ppeMatrixRoutes: RouteRecordRaw[] = [
  {
    path: 'ppe-matrix-settings',
    name: 'PPE Matrix',
    component: () => import('@/views/Organization/PPEMatrix.vue'),
    meta: { breadcrumb: 'PPE Matrix', isSidebar: true },
  },
]
