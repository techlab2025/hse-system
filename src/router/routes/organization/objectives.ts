import type { RouteRecordRaw } from '@/router/types'

export const objectivesRoutes: RouteRecordRaw[] = [
  {
    path: 'objectives',
    name: 'Objectives',
    component: () => import('@/views/Organization/Objectives/IndexObjectives.vue'),
    meta: {
      breadcrumb: 'Objectives',
      isSidebar: false,
    },
  },
  {
    path: 'objectives/project/:project_id',
    name: 'Project Objectives',
    component: () => import('@/views/Organization/Objectives/IndexObjectives.vue'),
    meta: {
      breadcrumb: 'Objectives',
      parent: 'Project Details',
      isSidebar: false,
    },
  },
  {
    path: 'objectives/project/:project_id/add',
    name: 'Add Project Objective',
    component: () => import('@/views/Organization/Objectives/AddObjectives.vue'),
    meta: {
      breadcrumb: 'Add Objective',
      parent: 'Project Objectives',
      isSidebar: false,
    },
  },
  {
    path: 'objectives/project/:project_id/:id',
    name: 'Edit Project Objective',
    component: () => import('@/views/Organization/Objectives/EditObjectives.vue'),
    meta: {
      breadcrumb: 'Edit Objective',
      parent: 'Project Objectives',
      isSidebar: false,
    },
  },
  {
    path: 'objectives/add/:project_id',
    redirect: (to) => ({
      name: 'Add Project Objective',
      params: { project_id: to.params.project_id }, 
    }),
  },
  {
    path: 'objectives/add',
    name: 'Add Objective',
    component: () => import('@/views/Organization/Objectives/AddObjectives.vue'),
    meta: {
      breadcrumb: 'Add Objective',
      parent: 'Objectives',
      isSidebar: false,
    },
  },
  {
    path: 'objectives/:id',
    name: 'Edit Objective',
    component: () => import('@/views/Organization/Objectives/EditObjectives.vue'),
    meta: {
      breadcrumb: 'Edit Objective',
      parent: 'Objectives',
      isSidebar: false,
    },
  },
]
