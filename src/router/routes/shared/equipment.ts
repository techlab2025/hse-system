import type { RouteRecordRaw } from '@/router/types'

export const equipmentRoutes: RouteRecordRaw[] = [
  {
    path: 'equipment-types/:parent_id?',
    name: 'Equipment Type',
    component: () => import('@/views/Admin/EquipmentType/IndexEquipmentType.vue'),
    meta: {
      breadcrumb: 'Equipment Type',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'equipment-type/add/:parent_id?',
    name: 'Add Equipment Type',
    component: () => import('@/views/Admin/EquipmentType/AddEquipmentType.vue'),
    meta: {
      breadcrumb: 'Add Equipment Type',
      parent: 'Equipment Type',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'equipment-type/:id',
    name: 'Edit Equipment Type',
    component: () => import('@/views/Admin/EquipmentType/EditEquipmentType.vue'),
    meta: {
      breadcrumb: 'Edit Equipment Type',
      parent: 'Equipment Type',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'equipments/:parent_id?',
    name: 'Equipment',
    component: () => import('@/views/Admin/Equipment/IndexEquipment.vue'),
    meta: {
      breadcrumb: 'Equipment ',
      type: 'Shared',
    },
  },
  {
    path: 'equipment/add/:parent_id?',
    name: 'Add Equipment',
    component: () => import('@/views/Admin/Equipment/AddEquipment.vue'),
    meta: {
      breadcrumb: 'Add Equipment',
      parent: 'Equipment',
      type: 'Shared',
    },
  },
  {
    path: 'equipment/:id/:parent_id?',
    name: 'Edit Equipment',
    component: () => import('@/views/Admin/Equipment/EditEquipment.vue'),
    meta: {
      breadcrumb: 'Edit Equipment',
      parent: 'Equipment',
      type: 'Shared',
    },
  },
  {
    path: 'equipment-show/:id',
    name: 'Show Equipment',
    component: () => import('@/views/Admin/Equipment/showEquipment.vue'),
    meta: {
      breadcrumb: 'Show Equipment',
      parent: 'Equipment',
      type: 'Shared',
    },
  },
]
