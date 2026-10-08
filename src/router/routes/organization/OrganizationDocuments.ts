import type { RouteRecordRaw } from '@/router/types'

export const OrganizationDocumentsRoutes: RouteRecordRaw[] = [
  {
    path: 'organization-documents',
    name: 'OrganizationDocuments',
    component: () =>
      import('@/views/Organization/OrganizationDocuments/IndexOrganizationDocuments.vue'),
    meta: {
      breadcrumb: 'OrganizationDocuments',
      isSidebar: true,
      type: 'Shared',
    },
  },
  {
    path: 'organization-documents/add',
    name: 'Add OrganizationDocuments',
    component: () =>
      import('@/views/Organization/OrganizationDocuments/AddOrganizationDocuments.vue'),
    meta: {
      breadcrumb: 'Add OrganizationDocuments',
      parent: 'OrganizationDocuments',
      isSidebar: true,
      type: 'Shared',
    },
  },
  {
    path: 'organization-documents/:id',
    name: 'Edit OrganizationDocuments',
    component: () =>
      import('@/views/Organization/OrganizationDocuments/EditOrganizationDocuments.vue'),
    meta: {
      breadcrumb: 'Edit OrganizationDocuments',
      parent: 'OrganizationDocuments',
      isSidebar: true,
      type: 'Shared',
    },
  },
  {
    path: 'organization-documents/import-excel',
    name: 'Import OrganizationDocuments',
    component: () =>
      import('@/views/Organization/OrganizationDocuments/UploadOrganizationDocuments.vue'),
    meta: {
      breadcrumb: 'Import OrganizationDocuments',
      parent: 'OrganizationDocuments',
      isSidebar: true,
      type: 'Shared',
    },
  },
]
