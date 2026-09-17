import type { RouteRecordRaw } from '@/router/types'

export const incidentCategoryRoutes: RouteRecordRaw[] = [
  {
    path: 'incident-category',
    name: 'Incident Categories',
    component: () => import('@/views/Admin/IncidentCategories/IndexIncidentCategory.vue'),
    meta: { breadcrumb: 'Incident Categories', type: 'Shared', isSidebar: true },
  },
  {
    path: 'incident-category/add',
    name: 'Add Incident Category',
    component: () => import('@/views/Admin/IncidentCategories/AddIncidentCategory.vue'),
    meta: {
      breadcrumb: 'Add Incident Category',
      parent: 'Incident Categories',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'incident-category/:id',
    name: 'Edit Incident Category',
    component: () => import('@/views/Admin/IncidentCategories/EditIncidentCategory.vue'),
    meta: {
      breadcrumb: 'Edit Incident Category',
      parent: 'Incident Categories',
      type: 'Shared',
      isSidebar: true,
    },
  },
]
