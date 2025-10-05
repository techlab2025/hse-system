import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import { adminRoutes } from './routes/admin'
import { organizationRoutes } from './routes/organization'
import { sharedRoutes } from './routes/shared'
import { addSuffix } from './helpers'
import { authGuard } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/login.vue'),
    },
    {
      path: '/admin',
      name: 'dashboard',
      component: Dashboard,
      redirect: '/admin',
      children: [...adminRoutes, ...addSuffix(sharedRoutes, 'Admin')],
    },
    {
      path: '/organization',
      name: 'Organization App',
      component: Dashboard,
      redirect: '/organization',
      children: [...organizationRoutes, ...addSuffix(sharedRoutes, 'Organization')],
    },
  ],
})

router.beforeEach(authGuard)

export default router
