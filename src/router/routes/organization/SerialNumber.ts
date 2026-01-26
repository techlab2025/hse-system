import type { RouteRecordRaw } from '@/router/types'

export const serialNumberRoutes: RouteRecordRaw[] = [
  {
    path: 'serial-number',
    name: 'Serial Number',
    component: () =>
      import('@/features/Organization/SerialNumber/Presentation/components/indexSerial.vue'),
    meta: {
      breadcrumb: 'Serial Number',
      isSidebar: true,

    },
  },
]
