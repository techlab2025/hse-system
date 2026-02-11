import type { RouteRecordRaw } from '@/router/types'

export const CatalogItemsDetailsRoutes: RouteRecordRaw[] = [
  {
    path: 'catalog-items-details',
    name: 'Catalog Items details',
    component: () => import('@/views/Admin/CatalogItemsDetails/IndexCatalogItemsDetails.vue'),
    meta: {
      breadcrumb: 'Catalog Items details',
    },
  },
  {
    path: 'catalog-items-details/add/:parent_id?',
    name: 'Add Catalog Items details',
    component: () => import('@/views/Admin/CatalogItemsDetails/AddCatalogItemsDetails.vue'),
    meta: {
      breadcrumb: 'Add Catalog Items details',
      parent: 'Catalog Items details',
    },
  },
  {
    path: 'catalog-items-details/:id',
    name: 'Edit Catalog Items details',
    component: () => import('@/views/Admin/CatalogItemsDetails/EditCatalogItemsDetails.vue'),
    meta: {
      breadcrumb: 'Edit Catalog Items details',
      parent: 'Catalog Items details',
    },
  },
]
