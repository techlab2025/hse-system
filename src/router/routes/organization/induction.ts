import type { RouteRecordRaw } from '@/router/types'

export const inductionRoutes: RouteRecordRaw[] = [
  {
    path: 'inductions',
    name: 'Inductions',
    component: () => import('@/views/Organization/Project/Induction/IndexInduction.vue'),
    meta: {
      breadcrumb: 'Inductions',
      projectParent: 'Project Details',
      isSidebar: false,
    },
  },
  {
    path: 'induction/add',
    name: 'Add Induction',
    component: () => import('@/views/Organization/Project/Induction/AddInduction.vue'),
    meta: {
      breadcrumb: 'Add Induction',
      parent: 'Inductions',
      isSidebar: false,
    },
  },
  {
    path: 'induction/show/:id',
    name: 'Show Induction',
    component: () => import('@/views/Organization/Project/Induction/ShowInduction.vue'),
    meta: {
      breadcrumb: 'Show Induction',
      parent: 'Inductions',
      isSidebar: false,
    },
  },
  {
    path: 'induction/:id',
    name: 'Edit Induction',
    component: () => import('@/views/Organization/Project/Induction/EditInduction.vue'),
    meta: {
      breadcrumb: 'Edit Induction',
      parent: 'Inductions',
      isSidebar: false,
    },
  },
]
