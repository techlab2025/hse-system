import type { RouteRecordRaw } from '@/router/types'

export const hazardTypesRoutes: RouteRecordRaw[] = [
  {
    path: 'hazard-type',
    name: 'Hazard Classification',
    component: () => import('@/views/Admin/HazardType/IndexHazardType.vue'),
    meta: {
      breadcrumb: 'Hazard Classification',
      type: 'Shared',
      subType: 'Hazards',
      isSidebar: true,
    },
  },
  {
    path: 'hazard-type/add/:parent_id?',
    name: 'Add Hazard Classification',
    component: () => import('@/views/Admin/HazardType/AddHazardType.vue'),
    meta: {
      breadcrumb: 'Add Hazard Classification',
      parent: 'Hazard Classification',
      type: 'Shared',
      subType: 'Add Hazard',
      subParent: 'Hazards',
      isSidebar: true,
    },
  },
  {
    path: 'hazard-type/:id',
    name: 'Edit Hazard Classification',
    component: () => import('@/views/Admin/HazardType/EditHazardType.vue'),
    meta: {
      breadcrumb: 'Edit Hazard Classification',
      parent: 'Hazard Classification',
      type: 'Shared',
      subType: 'Edit Hazard',
      subParent: 'Hazards',
      isSidebar: true,
    },
  },
  {
    path: 'hazard-type/:parent_id/hazards',
    name: 'Hazards',
    component: () => import('@/views/Admin/HazardType/IndexHazardType.vue'),
    meta: {
      breadcrumb: ' Hazards',
      parent: 'Hazard Classification',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'hazards/:parent_id',
    name: 'Hazards',
    component: () => import('@/views/Admin/HazardType/IndexHazardType.vue'),
    meta: {
      breadcrumb: ' Hazards',
      parent: 'Hazard Classification',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'hazard-type/upload-excel',
    name: 'Upload Hazard Classification',
    component: () => import('@/views/Admin/HazardType/UploadHazard.vue'),
    meta: {
      breadcrumb: 'Upload Hazard Classification',
      parent: 'Hazard Classification',
      type: 'Shared',
      isSidebar: true,
    },
  },
]
