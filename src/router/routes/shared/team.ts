import type { RouteRecordRaw } from '@/router/types'

export const teamsRoutes: RouteRecordRaw[] = [
    {
        path: 'teams',
        name: 'Teams',
        component: () => import('@/views/Admin/Teams/IndexTeams.vue'),
    },
    {
        path: 'team/add',
        name: 'Add Team',
        component: () => import('@/views/Admin/Teams/AddTeams.vue'),
    },
    {
        path: 'team/:id',
        name: 'Edit Team',
        component: () => import('@/views/Admin/Teams/EditTeams.vue'),
    },
]
