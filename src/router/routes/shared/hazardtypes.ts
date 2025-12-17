import type { RouteRecordRaw } from '@/router/types'

export const hazardTypesRoutes: RouteRecordRaw[] = [
  {
    path: 'hazard-type',
    name: 'Hazard Type',
    component: () => import('@/views/Admin/HazardType/IndexHazardType.vue'),
  },
  {
    path: 'hazard-type/add',
    name: 'Add Hazard Type',
    component: () => import('@/views/Admin/HazardType/AddHazardType.vue'),
  },
  {
    path: 'hazard-type/:id',
    name: 'Edit Hazard Type',
    component: () => import('@/views/Admin/HazardType/EditHazardType.vue'),
  },
]
