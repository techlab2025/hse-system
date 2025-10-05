import type { RouteRecordRaw } from '@/router/types'


export const projectTypesRoutes: RouteRecordRaw[] = [
  {
    path: 'project-types',
    name: 'Project Types',
    component: () => import('@/views/Admin/ProjectType/IndexProjectType.vue'),
  },
  {
    path: 'project-type/add',
    name: 'Add Project Type',
    component: () => import('@/views/Admin/ProjectType/AddProjectType.vue'),
  },
  {
    path: 'project-type/:id',
    name: 'Edit Project Type',
    component: () => import('@/views/Admin/ProjectType/EditProjectType.vue'),
  },
]
