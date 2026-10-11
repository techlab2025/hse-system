import { featureTranslation } from '@/features/Organization/featureTranslation'
import type { RouteRecordRaw } from '@/router/types'

export const DocumentCategoryRoutes: RouteRecordRaw[] = [
  {
    path: 'document-categories',
    name: 'Document Categories',
    component: () => import('@/views/Organization/DocumentCategory/IndexDocumentCategory.vue'),
    meta: {
      breadcrumb: featureTranslation('Document Categories'),
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'document-category/add',
    name: 'Add Document Category',
    component: () => import('@/views/Organization/DocumentCategory/AddDocumentCategory.vue'),
    meta: {
      breadcrumb: featureTranslation('Add Document Category'),
      parent: 'Document Categories',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'document-category/:id',
    name: 'Edit Document Category',
    component: () => import('@/views/Organization/DocumentCategory/EditDocumentCategory.vue'),
    meta: {
      breadcrumb: featureTranslation('Edit Document Category'),
      parent: 'Document Categories',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'document-category/upload-excel',
    name: 'Upload Document Categories',
    component: () => import('@/views/Organization/DocumentCategory/DocumentCategoryExcelSheet.vue'),
    meta: {
      breadcrumb: featureTranslation('Upload Document Categories'),
      parent: 'Document Categories',
      type: 'Shared',
      isSidebar: true,
    },
  },
]
