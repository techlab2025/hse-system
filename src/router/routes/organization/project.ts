import type { RouteRecordRaw } from '@/router/types'

export const projectRoutes: RouteRecordRaw[] = [
  {
    path: 'projects',
    name: 'Projects',
    component: () => import('@/views/Organization/Project/IndexProject.vue'),
  },
  {
    path: 'project/add',
    name: 'Add Project',
    component: () => import('@/views/Organization/Project/AddProject.vue'),
  },
  {
    path: 'project/:id',
    name: 'Edit Project',
    component: () => import('@/views/Organization/Project/EditProject.vue'),
  },
  {
    path: 'project-details',
    name: 'Project Details',
    component: () => import('@/views/Organization/Project/projectDetails.vue'),
  },
  {
    path: 'employee-details',
    name: 'Employee Details',
    component: () => import('@/views/Organization/Project/EmployeeDetails.vue'),
  },
]
