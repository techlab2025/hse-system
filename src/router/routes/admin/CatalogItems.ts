import type { RouteRecordRaw } from '@/router/types'

export const CatalogRoutes: RouteRecordRaw[] = [
  {
    path: 'catalogItems',
    name: 'CatalogItems',
    component: () => import('@/views/Admin/CatalogItems/IndexCatalogItems.vue'),
    meta: {
      breadcrumb: 'Catalog Items',
    },
  },
  {
    path: 'catalogItems/add',
    name: 'Add Catalog Items',
    component: () => import('@/views/Admin/CatalogItems/AddCatalogItems.vue'),
    meta: {
      breadcrumb: 'Add Catalog Items',
      parent: 'Catalog Items',
    },
  },
  {
    path: 'catalogItems/:id',
    name: 'Edit Catalog Items',
    component: () => import('@/views/Admin/CatalogItems/EditCatalogItems.vue'),
    meta: {
      breadcrumb: 'Edit Catalog Items',
      parent: 'Catalog Items',
    },
  },
]
