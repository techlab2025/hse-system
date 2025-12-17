import type { RouteRecordRaw } from '@/router/types'

export const certificateRoutes: RouteRecordRaw[] = [
  {
    path: 'certificate',
    name: 'Certificates',
    component: () => import('@/views/Admin/Certificate/IndexCertificate.vue'),
  },
  {
    path: 'certificate/add',
    name: 'Add Certificate',
    component: () => import('@/views/Admin/Certificate/AddCertificate.vue'),
  },
  {
    path: 'certificate/:id',
    name: 'Edit Certificate',
    component: () => import('@/views/Admin/Certificate/EditCertificate.vue'),
  },
]
