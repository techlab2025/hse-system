import type { RouteRecordRaw } from '@/router/types'

export const projectZoneRoutes: RouteRecordRaw[] = [{
  path: 'project-zone',
    name: 'Project Zone',
  component: () => import('../views/Organization/ProjectZone/IndexProjectZone.vue'),
},
{
  path: 'project-zone/:id',
    name: 'Edit Project Zone',
  component: () => import('../views/Organization/ProjectZone/EditProjectZone.vue'),
},
{
  path: 'project-zone/add',
    name: 'Add Project Zone',
  component: () => import('../views/Organization/ProjectZone/AddProjectZone.vue'),
},
  ]

