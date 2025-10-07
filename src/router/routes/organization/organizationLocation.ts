import type { RouteRecordRaw } from '@/router/types'

export const organizationLocationRoutes: RouteRecordRaw[] = [
  {
    path: 'organization-locations',
    name: 'Organization Locations',
    component: () =>
      import('@/views/organization/OrganizationLocation/IndexOrganizationLocation.vue'),
  },
  {
    path: 'organization-location/add',
    name: 'Add Organization Location',
    component: () =>
      import('@/views/organization/OrganizationLocation/AddOrganizationLocation.vue'),
  },
  {
    path: 'organization-location/:id',
    name: 'Edit Organization Location',
    component: () =>
      import('@/views/organization/OrganizationLocation/EditOrganizationLocation.vue'),
  },
]
