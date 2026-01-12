import type { RouteRecordRaw } from '@/router/types'

export const factoryRoutes: RouteRecordRaw[] = [
  {
    path: 'factory',
    name: 'Factories',
    component: () => import('@/views/Admin/Factory/IndexFactory.vue'),
    meta: {
      breadcrumb: 'Hazard Factories',
      type: 'Shared',
    },
  },
  {
    path: 'factory/add',
    name: 'Add Factory',
    component: () => import('@/views/Admin/Factory/AddFactory.vue'),
    meta: {
      breadcrumb: 'Add Hazrad Factors',
      parent: 'Hazard Factories',
      type: 'Shared',
    },
  },
  {
    path: 'factory/:id',
    name: 'Edit Factory',
    component: () => import('@/views/Admin/Factory/EditFactory.vue'),
    meta: {
      breadcrumb: 'Edit Hazard Factors',
      parent: 'Factories',
      type: 'Shared',
    },
  },
  {
    path: 'factories-items',
    name: 'Factories Items',
    component: () => import('@/views/Admin/FactoryItem/IndexFactoryItem.vue'),
    meta: {
      breadcrumb: 'Hazard Factories Items',
      type: 'Shared',
    },
  },
  {
    path: 'factory-item/add',
    name: 'Add Factory Item',
    component: () => import('@/views/Admin/FactoryItem/AddFactoryItem.vue'),
    meta: {
      breadcrumb: 'Add Hazard Factor Item',
      parent: 'Factories Items',
      type: 'Shared',
    },
  },
  {
    path: 'factory-item/:id',
    name: 'Edit Factory Item',
    component: () => import('@/views/Admin/FactoryItem/EditFactoryItem.vue'),
    meta: {
      breadcrumb: 'Edit Hazard Factor Item',
      parent: 'Factories Items',
      type: 'Shared',
    },
  },
]
