import type { RouteRecordRaw } from '@/router/types'

export const hazardTypesRoutes: RouteRecordRaw[] = [
  {
    path: 'hazard-type',
    name: 'Hazard Type',
    component: () => import('@/views/Admin/HazardType/IndexHazardType.vue'),
    meta: {
      breadcrumb: 'Hazard Type',
      type: 'Shared',
      subType: 'Hazards',
    },
  },
  {
    path: 'hazard-type/add/:parent_id?',
    name: 'Add Hazard Type',
    component: () => import('@/views/Admin/HazardType/AddHazardType.vue'),
    meta: {
      breadcrumb: 'Add Hazard Type',
      parent: 'Hazard Type',
      type: 'Shared',
      subType: 'Add Hazard',
      subParent: 'Hazards',
    },
  },
  {
    path: 'hazard-type/:id',
    name: 'Edit Hazard Type',
    component: () => import('@/views/Admin/HazardType/EditHazardType.vue'),
    meta: {
      breadcrumb: 'Edit Hazard Type',
      parent: 'Hazard Type',
      type: 'Shared',
      subType: 'Edit Hazard',
      subParent: 'Hazards',
    },
  },
  {
    path: 'hazard-type/:parent_id/hazards',
    name: 'Hazards',
    component: () => import('@/views/Admin/HazardType/IndexHazardType.vue'),
    meta: {
      breadcrumb: ' Hazards',
      parent: 'Hazard Type',
      type: 'Shared',
    },
  },
  {
    path: 'hazards/:parent_id',
    name: 'Hazards',
    component: () => import('@/views/Admin/HazardType/IndexHazardType.vue'),
    meta: {
      breadcrumb: ' Hazards',
      parent: 'Hazard Type',
      type: 'Shared',
    },
  },
]
