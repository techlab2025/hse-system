import type { RouteRecordRaw } from '@/router/types'

export const organizationEmployeeRoutes: RouteRecordRaw[] = [
  {
    path: 'organization-employee',
    name: 'Organization Employee',
    component: () => import('@/views/Organization/OrganizationEmployee/IndexOrganization.vue'),
  },
  {
    path: 'organization-employee/:id',
    name: 'Edit Organization Employee',
    component: () => import('@/views/Organization/OrganizationEmployee/EditOrganization.vue'),
  },
  {
    path: 'organization-employee/add',
    name: 'Add Organization Employee',
    component: () => import('@/views/Organization/OrganizationEmployee/AddOrganization.vue'),
  },
]
