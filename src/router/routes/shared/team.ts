import type { RouteRecordRaw } from '@/router/types'

export const teamsRoutes: RouteRecordRaw[] = [
  {
    path: 'team',
    name: 'Teams',
    component: () => import('@/views/Admin/Teams/IndexTeams.vue'),
    meta: {
      breadcrumb: 'Teams',
      type: 'Shared',
    },
  },
  {
    path: 'team/add',
    name: 'Add Team',
    component: () => import('@/views/Admin/Teams/AddTeams.vue'),
    meta: {
      breadcrumb: 'Add Team',
      parent: 'Teams',
      type: 'Shared',
    },
  },
  {
    path: 'team/:id',
    name: 'Edit Team',
    component: () => import('@/views/Admin/Teams/EditTeams.vue'),
    meta: {
      breadcrumb: 'Edit Team',
      parent: 'Teams',
      type: 'Shared',
    },
  },
]
