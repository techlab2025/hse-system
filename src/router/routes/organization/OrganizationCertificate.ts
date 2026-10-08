import type { RouteRecordRaw } from '@/router/types'

export const OrganizationCertificateRoutes: RouteRecordRaw[] = [
  {
    path: 'organization-certificate',
    name: 'OrganizationCertificates',
    component: () =>
      import('@/views/Organization/OrganizationCertificate/IndexOrganizationCertificate.vue'),
    meta: {
      breadcrumb: 'OrganizationCertificate',
      isSidebar: true,
      type: 'Shared',
    },
  },
  {
    path: 'organization-certificate/add',
    name: 'Add OrganizationCertificate',
    component: () =>
      import('@/views/Organization/OrganizationCertificate/AddOrganizationCertificate.vue'),
    meta: {
      breadcrumb: 'Add OrganizationCertificate',
      parent: 'OrganizationCertificates',
      isSidebar: true,
      type: 'Shared',
    },
  },
  {
    path: 'organization-certificate/:id',
    name: 'Edit OrganizationCertificate',
    component: () =>
      import('@/views/Organization/OrganizationCertificate/EditOrganizationCertificate.vue'),
    meta: {
      breadcrumb: 'Edit OrganizationCertificate',
      parent: 'OrganizationCertificates',
      isSidebar: true,
      type: 'Shared',
    },
  },
  {
    path: 'organization-certificate/import-excel',
    name: 'Import OrganizationCertificate',
    component: () =>
      import('@/views/Organization/OrganizationCertificate/UploadOrganizationCertificate.vue'),
    meta: {
      breadcrumb: 'Import OrganizationCertificate',
      parent: 'OrganizationCertificates',
      isSidebar: true,
      type: 'Shared',
    },
  },
]
