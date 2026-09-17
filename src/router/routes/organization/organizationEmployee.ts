import type { RouteRecordRaw } from '@/router/types'

export const organizationEmployeeRoutes: RouteRecordRaw[] = [
  {
    path: 'organization-employee',
    name: 'Organization Employee',
    component: () => import('@/views/Organization/OrganizationEmployee/IndexOrganization.vue'),
    meta: {
      breadcrumb: 'Employees',
      isSidebar: true,
    },
  },
  {
    path: 'organization-employee/:id',
    name: 'Edit Organization Employee',
    component: () => import('@/views/Organization/OrganizationEmployee/EditOrganization.vue'),
    meta: {
      breadcrumb: 'Edit Employee',
      parent: 'Organization Employee',
      isSidebar: true,
    },
  },
  {
    path: 'organization-employee/add',
    name: 'Add Organization Employee',
    component: () => import('@/views/Organization/OrganizationEmployee/AddOrganization.vue'),
    meta: {
      breadcrumb: 'Add Employee',
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
      breadcrumb: 'Show Employee',
      parent: 'Organization Employee',
      isSidebar: true,
    },
  },
  {
    path: 'organization-employee/upload',
    name: 'Upload Organization Employee',
    component: () =>
      import(
        '@/features/Organization/OrganizationEmployee/Presentation/components/UploadOrganizationEmployee.vue'
      ),
    meta: {
      breadcrumb: 'Upload Employee',
      parent: 'Organization Employee',
      isSidebar: true,
    },
  },
]
