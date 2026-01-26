import type { RouteRecordRaw } from '@/router/types'

export const projectRoutes: RouteRecordRaw[] = [
  {
    path: 'projects',
    name: 'Projects',
    component: () => import('@/views/Organization/Project/IndexProject.vue'),
    meta: {
      breadcrumb: 'Projects',
      isSidebar: false,
    },
  },
  {
    path: 'project/add',
    name: 'Add Project',
    component: () => import('@/views/Organization/Project/AddProject.vue'),
    meta: {
      breadcrumb: 'Add Project',
      parent: 'Projects',
      isSidebar: false,
    },
  },
  {
    path: 'project/:id',
    name: 'Edit Project',
    component: () => import('@/views/Organization/Project/EditProject.vue'),
    meta: {
      breadcrumb: 'Edit Project',
      parent: 'Projects',
      isSidebar: false,
    },
  },
  {
    path: 'project-details/:id',
    name: 'Project Details',
    component: () => import('@/views/Organization/Project/projectDetails.vue'),
    meta: {
      breadcrumb: 'Project Details',
      parent: 'Projects',
      isSidebar: false,
    },
  },
  {
    path: 'employee-details/:project_id',
    name: 'Employee Details',
    component: () => import('@/views/Organization/Project/EmployeeDetails.vue'),
    meta: {
      breadcrumb: 'Employee Details',
      parent: 'Project Details',
      isSidebar: false,
    },
  },
  {
    path: 'project-hierarchy/project/:project_id',
    name: 'Project Hierarchy',
    component: () => import('@/views/Organization/Project/Hierarchy/addHierarchy.vue'),
    meta: {
      breadcrumb: 'Project Hierarchy',
      parent: 'Project Details',
      isSidebar: false,
    },
  },
  {
    path: 'project-employee/project/:project_id',
    name: 'Project Employee',
    component: () => import('@/views/Organization/Project/Employee/addEmployee.vue'),
    meta: {
      breadcrumb: 'Project Employee',
      parent: 'Project Details',
      isSidebar: false,
    },
  },
  {
    path: 'project-equipment/project/:project_id',
    name: 'Project Equipment',
    component: () => import('@/views/Organization/Project/Equipments/ProjectEquipments.vue'),
    meta: {
      breadcrumb: 'Project Equipment',
      parent: 'Project Details',
      isSidebar: false,
    },
  },
]
