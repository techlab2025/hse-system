import type { RouteRecordRaw } from '@/router/types'
import IconAdd from '@/shared/icons/IconAdd.vue'

export const organizationEmployeeRoutes: RouteRecordRaw[] = [
  {
    path: 'organization-employee',
    name: 'Organization Employee',
    component: () => import('@/views/Organization/OrganizationEmployee/IndexOrganization.vue'),
    meta: {
      breadcrumb: 'Organization Employee',
      isSidebar: true,
    },
  },
  {
    path: 'organization-employee/:id',
    name: 'Edit Organization Employee',
    component: () => import('@/views/Organization/OrganizationEmployee/EditOrganization.vue'),
    meta: {
      breadcrumb: 'Edit Organization Employee',
      parent: 'Organization Employee',
      isSidebar: true,
    },
  },
  {
    path: 'organization-employee/add',
    name: 'Add Organization Employee',
    component: () => import('@/views/Organization/OrganizationEmployee/AddOrganization.vue'),
    meta: {
      breadcrumb: 'Add Organization Employee',
      parent: 'Organization Employee',
      isSidebar: true,
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
      breadcrumb: 'Show Organization Employee',
      parent: 'Organization Employee',
      isSidebar: true,
    },
  },
]
