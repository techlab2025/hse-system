import type { RouteRecordRaw } from '@/router/types'

export const attachmentMatrixRoutes: RouteRecordRaw[] = [
  {
    path: 'attachment-matrix',
    name: 'Attachment Matrix',
    component: () => import('@/views/Organization/AttachmentMatrix/IndexAttachmentMatrix.vue'),
    meta: {
      breadcrumb: 'Attachment Matrix',
      type: 'Organization',
      isSidebar: true,
    },
  },
]
