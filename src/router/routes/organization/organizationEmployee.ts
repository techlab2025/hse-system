import type { RouteRecordRaw } from '@/router/types'

export const organizationEmployeeRoutes: RouteRecordRaw[] = [
  {
    path: 'organization-employee',
    name: 'Organization Employee',
    component: () => import('@/views/Organization/OrganizationEmployee/IndexOrganization.vue'),
    meta: {
      breadcrumb: 'Organization Employee',
    },
  },
  {
    path: 'organization-employee/:id',
    name: 'Edit Organization Employee',
    component: () => import('@/views/Organization/OrganizationEmployee/EditOrganization.vue'),
    meta: {
      breadcrumb: 'Edit Organization Employee',
      parent: 'Organization Employee',
    },
  },
  {
    path: 'organization-employee/add',
    name: 'Add Organization Employee',
    component: () => import('@/views/Organization/OrganizationEmployee/AddOrganization.vue'),
    meta: {
      breadcrumb: 'Add Organization Employee',
      parent: 'Organization Employee',
    },
  },
]
