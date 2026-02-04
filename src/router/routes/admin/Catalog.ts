import type { RouteRecordRaw } from '@/router/types'

export const CatalogRoutes: RouteRecordRaw[] = [
  {
    path: 'Catalog',
    name: 'Catalog',
    component: () => import('@/views/Admin/Catalog/IndexCatalog.vue'),
    meta: {
      breadcrumb: 'Catalog',
    },
  },
  {
    path: 'Catalog/add',
    name: 'Add Catalog',
    component: () => import('@/views/Admin/Catalog/AddCatalog.vue'),
    meta: {
      breadcrumb: 'Add Catalog',
      parent: 'Catalog',
    },
  },
  {
    path: 'Catalog/:id',
    name: 'Edit Catalog',
    component: () => import('@/views/Admin/Catalog/EditCatalog.vue'),
    meta: {
      breadcrumb: 'Edit Catalog',
      parent: 'Catalog',
    },
  },
]
