import { createRouter, createWebHistory } from 'vue-router'
import { adminRoutes } from './routes/admin'
import { organizationRoutes } from './routes/organization'
import { sharedRoutes } from './routes/shared'
import { addSuffix } from './helpers'
import { authGuard } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login/admin',
      name: 'Login',
      component: () => import('@/views/auth/login.vue'),
    },
    {
      path: '/login/organization',
      name: 'Organization Login',
      component: () => import('@/views/auth/OrganizationLogin.vue'),
    },
    {
      path: '/admin',
      name: 'dashboard',
      component: () => import('@/views/Dashboard.vue'),
      children: [...adminRoutes, ...addSuffix(sharedRoutes, 'Admin')],
    },
    {
      path: '/organization',
      name: 'Organization App',
      component: () => import('@/views/Dashboard.vue'),
      children: [...organizationRoutes, ...addSuffix(sharedRoutes, 'Organization')],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'Not Found',
      component: () => import('@/views/NotFountPage.vue'),
    },
    {
      path: '/forget-password',
      name: 'forget-password',
      component: () => import('@/views/Organization/ForgetPassword/ForgetPassword.vue'),
    },
  ],
})

// router.beforeEach((to, from, next) => {
//   console.log(to.path, 'to')

//   if (to.path === '/' || to.path === '/login') {
//     next({ path: '/login/organization' })
//   }

//   // return authGuard(to, from, next)
// })

// // router.beforeEach((to, from, next) => {
// //   console.log(to, 'to')
// //   if (to.path === '/' || to.path === '/login') {
// //     next({ path: '/login/organization' })
// //   } else {
// //     next()
// //   }
// // })
router.beforeEach(authGuard)
export default router
