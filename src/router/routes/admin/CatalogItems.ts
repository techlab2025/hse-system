import type { RouteRecordRaw } from '@/router/types'

export const CatalogItemsRoutes: RouteRecordRaw[] = [
  {
    path: 'catalog-items',
    name: 'CatalogItems',
    component: () => import('@/views/Admin/CatalogItems/IndexCatalogItems.vue'),
    meta: {
      breadcrumb: 'Catalog Items',
    },
  },
  {
    path: 'catalog-items/add/:parent_id?',
    name: 'Add Catalog Items',
    component: () => import('@/views/Admin/CatalogItems/AddCatalogItems.vue'),
    meta: {
      breadcrumb: 'Add Catalog Items',
      parent: 'Catalog Items',
    },
  },
  {
    path: 'catalog-items/:id',
    name: 'Edit Catalog Items',
    component: () => import('@/views/Admin/CatalogItems/EditCatalogItems.vue'),
    meta: {
      breadcrumb: 'Edit Catalog Items',
      parent: 'Catalog Items',
    },
  },
]
