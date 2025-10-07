import type { RouteRecordRaw } from '@/router/types'

export const organizationEmployeeRoutes: RouteRecordRaw[] = [
  {
    path: 'organization-employee',
    name: 'Organization Employee',
    component: () => import('@/views/organization/OrganizationEmployee/IndexOrganization.vue'),
  },
  {
    path: 'organization-employee/:id',
    name: 'Edit Organization Employee',
    component: () => import('@/views/organization/OrganizationEmployee/EditOrganization.vue'),
  },
  {
    path: 'organization-employee/add',
    name: 'Add Organization Employee',
    component: () => import('@/views/organization/OrganizationEmployee/AddOrganization.vue'),
  },
]
