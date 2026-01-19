import type { RouteRecordRaw } from '@/router/types'

export const EmployeeCertificateRoutes: RouteRecordRaw[] = [
  {
    path: 'employee-certificate/:id?',
    name: 'Employee Certificates ',
    component: () =>
      import('@/views/Organization/EmployeeCertificates/IndexEmployeeCertificates.vue'),
    meta: {
      breadcrumb: 'Employee Certificates',
    },
  },
]
