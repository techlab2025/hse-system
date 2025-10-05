import type { RouteRecordRaw } from '@/router/types'

export const organizationEmployeeRoutes: RouteRecordRaw[] = [
  {
    path: 'organization-locations',
    name: 'Organization Locations',
    component: () =>
      import('@/views/Organization/OrganizationLocation/IndexOrganizationLocation.vue'),
  },
  {
    path: 'organization-location/add',
    name: 'Add Organization Location',
    component: () =>
      import('@/views/Organization/OrganizationLocation/AddOrganizationLocation.vue'),
  },
  {
    path: 'organization-location/:id',
    name: 'Edit Organization Location',
    component: () =>
      import('@/views/Organization/OrganizationLocation/EditOrganizationLocation.vue'),
  },
]
