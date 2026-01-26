import type { RouteRecordRaw } from '@/router/types'

export const projectZoneRoutes: RouteRecordRaw[] = [
  {
    path: 'project-zone',
    name: 'Project Zone',
    component: () => import('@/views/Organization/ProjectZone/IndexProjectZone.vue'),
    meta: {
      breadcrumb: 'Project Zone',
      isSidebar: true,

    },
  },
  {
    path: 'project-zone/:id',
    name: 'Edit Project Zone',
    component: () => import('@/views/Organization/ProjectZone/EditProjectZone.vue'),
    meta: {
      breadcrumb: 'Edit Project Zone',
      parent: 'Project Zone',
      isSidebar: true,

    },
  },
  {
    path: 'project-zone/add',
    name: 'Add Project Zone',
    component: () => import('@/views/Organization/ProjectZone/AddProjectZone.vue'),
    meta: {
      breadcrumb: 'Add Project Zone',
      parent: 'Project Zone',
      isSidebar: true,

    },
  },
]
