import type { RouteRecordRaw } from '@/router/types'

export const certificateRoutes: RouteRecordRaw[] = [
  {
    path: 'certificate',
    name: 'Certificates',
    component: () => import('@/views/Admin/Certificate/IndexCertificate.vue'),
    meta: {
      breadcrumb: 'Training',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'certificate/add',
    name: 'Add Certificate',
    component: () => import('@/views/Admin/Certificate/AddCertificate.vue'),
    meta: {
      breadcrumb: 'Add Training',
      parent: 'Certificates',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'certificate/:id',
    name: 'Edit Certificate',
    component: () => import('@/views/Admin/Certificate/EditCertificate.vue'),
    meta: {
      breadcrumb: 'Edit Training',
      parent: 'Certificates',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'certificate/import-excel',
    name: 'Import Certificate',
    component: () => import('@/views/Admin/Certificate/UploadCertificate.vue'),
    meta: {
      breadcrumb: 'Import Training',
      parent: 'Certificates',
      type: 'Shared',
      isSidebar: true,
    },
  },
]
