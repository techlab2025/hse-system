import type { RouteRecordRaw } from '@/router/types'


export const organizationRoutes: RouteRecordRaw[] = [
    {
        path: 'organization',
        name: 'Organization',
        component: () => import('@/views/Admin/Organization/IndexOrganization.vue'),
    },
    {
        path: 'organization/add',
        name: 'Add Organization',
        component: () => import('@/views/Admin/Organization/AddOrganization.vue'),
    },
    {
        path: 'organization/:id',
        name: 'Edit Organization',
        component: () => import('@/views/Admin/Organization/EditOrganization.vue'),
    },
]
