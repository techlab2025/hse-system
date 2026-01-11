import type { RouteRecordRaw } from '@/router/types'

export const certificateRoutes: RouteRecordRaw[] = [
  {
    path: 'certificate',
    name: 'Certificates',
    component: () => import('@/views/Admin/Certificate/IndexCertificate.vue'),
    meta: {
      parent: 'Certificates',
      type: 'Shared',
    },
  },
  {
    path: 'certificate/add',
    name: 'Add Certificate',
    component: () => import('@/views/Admin/Certificate/AddCertificate.vue'),
    meta: {
      parent: 'Certificates',
      type: 'Shared',
    },
  },
  {
    path: 'certificate/:id',
    name: 'Edit Certificate',
    component: () => import('@/views/Admin/Certificate/EditCertificate.vue'),
    meta: {
      parent: 'Certificates',
      type: 'Shared',
    },
  },
]
