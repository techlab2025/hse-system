
import type { RouteRecordRaw } from '@/router/types'

export const factoryRoutes: RouteRecordRaw[] = [
  {
    path: 'factories',
    name: 'Factories',
    component: () => import('@/views/Admin/Factory/IndexFactory.vue'),
  },
  {
    path: 'factory/add',
    name: 'Add Factory',
    component: () => import('@/views/Admin/Factory/AddFactory.vue'),
  },
  {
    path: 'factory/:id',
    name: 'Edit Factory',
    component: () => import('@/views/Admin/Factory/EditFactory.vue'),
  },
  {
    path: 'factories-items',
    name: 'Factories Items',
    component: () => import('@/views/Admin/FactoryItem/IndexFactoryItem.vue'),
  },
  {
    path: 'factory-item/add',
    name: 'Add Factory Item',
    component: () => import('@/views/Admin/FactoryItem/AddFactoryItem.vue'),
  },
  {
    path: 'factory-item/:id',
    name: 'Edit Factory Item',
    component: () => import('@/views/Admin/FactoryItem/EditFactoryItem.vue'),
  },
]
