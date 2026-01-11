import type { RouteRecordRaw } from '@/router/types'

export const organizationLocationRoutes: RouteRecordRaw[] = [
  {
    path: 'organization-locations',
    name: 'Organization Locations',
    component: () =>
      import('@/views/Organization/OrganizationLocation/IndexOrganizationLocation.vue'),
    meta: {
      breadcrumb: 'Organization Locations',
    },
  },
  {
    path: 'organization-location/add',
    name: 'Add Organization Location',
    component: () =>
      import('@/views/Organization/OrganizationLocation/AddOrganizationLocation.vue'),
    meta: {
      breadcrumb: 'Add Organization Location',
      parent: 'Organization Locations',
    },
  },
  {
    path: 'organization-location/:id',
    name: 'Edit Organization Location',
    component: () =>
      import('@/views/Organization/OrganizationLocation/EditOrganizationLocation.vue'),
    meta: {
      breadcrumb: 'Edit Organization Location',
      parent: 'Organization Locations',
    },
  },
]
