import type { RouteRecordRaw } from '@/router/types'

export const equipmentRoutes: RouteRecordRaw[] = [
  {
    path: 'equipment-types/:parent_id?',
    name: 'Equipment Type',
    component: () => import('@/views/Admin/EquipmentType/IndexEquipmentType.vue'),
  },
  {
    path: 'equipment-type/add/:parent_id?',
    name: 'Add Equipment Type',
    component: () => import('@/views/Admin/EquipmentType/AddEquipmentType.vue'),
  },
  {
    path: 'equipment-type/:id',
    name: 'Edit Equipment Type',
    component: () => import('@/views/Admin/EquipmentType/EditEquipmentType.vue'),
  },
  {
    path: 'equipments/:id?',
    name: 'Equipment',
    component: () => import('@/views/Admin/Equipment/IndexEquipment.vue'),
  },
  {
    path: 'equipment/add/:id?',
    name: 'Add Equipment',
    component: () => import('@/views/Admin/Equipment/AddEquipment.vue'),
  },
  {
    path: 'equipment/:id',
    name: 'Edit Equipment',
    component: () => import('@/views/Admin/Equipment/EditEquipment.vue'),
  },
  {
    path: 'equipment-show/:id',
    name: 'Show Equipment',
    component: () => import('@/views/Admin/Equipment/showEquipment.vue'),
  },
]
