import type { RouteRecordRaw } from '@/router/types'
import { useRoute } from 'vue-router'
const route = useRoute()

export const hazardTypesRoutes: RouteRecordRaw[] = [
  {
    path: 'hazard-type',
    name: 'Hazard Type',
    component: () => import('@/views/Admin/HazardType/IndexHazardType.vue'),
    meta: {
      breadcrumb: 'Hazard Type',
      type: 'Shared',
    },
  },
  {
    path: 'hazard-type/add/:parent_id?',
    name: 'Add Hazard Type',
    component: () => import('@/views/Admin/HazardType/AddHazardType.vue'),
    meta: {
      breadcrumb: route?.params.parent_id ? 'Add Hazard Type' : 'Add Hazard ',
      parent: 'Hazard Type',
      type: 'Shared',
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
]
