import type { RouteRecordRaw } from '@/router/types'

export const certificateRoutes: RouteRecordRaw[] = [
  {
    path: 'certificate',
    name: 'Certificates',
    component: () => import('@/views/Admin/Certificate/IndexCertificate.vue'),
    meta: {
      breadcrumb: 'Certificates',
      type: 'Shared',
      isSidebar: true,

    },
  },
  {
    path: 'certificate/add',
    name: 'Add Certificate',
    component: () => import('@/views/Admin/Certificate/AddCertificate.vue'),
    meta: {
      breadcrumb: 'Add certificate',
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
      breadcrumb: 'Edit certificate',
      parent: 'Certificates',
      type: 'Shared',
      isSidebar: true,

    },
  },
]
