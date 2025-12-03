import type { RouteRecordRaw } from '@/router/types'

export const objectivesRoutes: RouteRecordRaw[] = [
    {
        path: 'objectives',
        name: 'Objectives',
        component: () => import('@/views/Organization/Objectives/IndexObjectives.vue'),
    },
    {
        path: 'objectives/:id',
        name: 'Edit Objective',
        component: () => import('@/views/Organization/Objectives/EditObjectives.vue'),
    },
    {
        path: 'objectives/add/',
        name: 'Add Objective',
        component: () => import('@/views/Organization/Objectives/AddObjectives.vue'),
    },
]
