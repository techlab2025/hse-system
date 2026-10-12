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
  {
    path: 'organization-employee/show/:id',
    name: 'Show Organization Employee',
    component: () =>
      import(
        '@/features/Organization/OrganizationEmployee/Presentation/components/ShowOrgnizationEmployee.vue'
      ),
    meta: {
      breadcrumb: 'Show Employee',
      parent: 'Organization Employee',
      isSidebar: true,
    },
  },
]
