import type { RouteRecordRaw } from 'vue-router';

export const ForgetPasswordRoutes :RouteRecordRaw[] = [
    {
        path: 'forget-password',
        name: 'forget-password',
        component: () => import('@/views/Organization/ForgetPassword/ForgetPassword.vue'),
    },
]
