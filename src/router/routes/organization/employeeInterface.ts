import type { RouteRecordRaw } from '@/router/types'

export const EmployeeInterfaceRoutes: RouteRecordRaw[] = [
  {
    path: 'employee-interface',
    name: 'Employee Interface ',
    component: () => import('@/views/Organization/EmployeeInterface/IndexEmployeeInterface.vue'),
    meta: {
      breadcrumb: 'Employee Interface',
    },
  },
]
