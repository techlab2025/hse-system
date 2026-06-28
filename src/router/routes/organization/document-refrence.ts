import type { RouteRecordRaw } from '@/router/types'

export const DocumentRefrenceRoutes: RouteRecordRaw[] = [
  {
    path: 'document-refrence',
    name: 'DocumentRefrence',
    component: () => import('@/views/Organization/DocumentRefrence/IndexDocumentRefrence.vue'),
    meta: {
      breadcrumb: 'Document Refrence',
      isSidebar: true,
      type: 'Shared',
    },
  },
  {
    path: 'document-refrence/add',
    name: 'Add Document Refrence',
    component: () => import('@/views/Organization/DocumentRefrence/AddDocumentRefrence.vue'),
    meta: {
      breadcrumb: 'Add Document Refrence',
      parent: 'DocumentRefrence',
      isSidebar: true,
      type: 'Shared',
    },
  },
  {
    path: 'document-refrence/:id',
    name: 'Edit Document Refrence',
    component: () => import('@/views/Organization/DocumentRefrence/EditDocumentRefrence.vue'),
    meta: {
      breadcrumb: 'Edit Document Refrence',
      parent: 'DocumentRefrence',
      isSidebar: true,
      type: 'Shared',
    },
  },
]
