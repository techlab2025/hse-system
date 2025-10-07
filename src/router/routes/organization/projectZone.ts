import type { RouteRecordRaw } from '@/router/types'

export const projectZoneRoutes: RouteRecordRaw[] = [
  {
    path: 'project-zone',
    name: 'Project Zone',
    component: () => import('@/views/organization/ProjectZone/IndexProjectZone.vue'),
  },
  {
    path: 'project-zone/:id',
    name: 'Edit Project Zone',
    component: () => import('@/views/organization/ProjectZone/EditProjectZone.vue'),
  },
  {
    path: 'project-zone/add',
    name: 'Add Project Zone',
    component: () => import('@/views/organization/ProjectZone/AddProjectZone.vue'),
  },
]



