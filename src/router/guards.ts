import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { EmployeeStatusEnum } from '@/features/Organization/OrganizationEmployee/Core/Enum/EmployeeStatus'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export function authGuard(to, from, next) {
  const userData = useUserStore()
  const Path = ref<boolean>(to.path == '' || to.path == '/' || to.path == '/login')

  const loginPages = ['Login', 'Organization Login']
  const router = useRouter()
  const route = router.getRoutes().find((r) => r.name === to.name)
  if (!route) {
    router.push({ name: 'Not Found' })
  }

  //  NOT AUTHENTICATED
  if (!userData.isAuth) {
    // Allow login pages always
    if (loginPages.includes(to.name)) {
      return next()
    }

    // If user is trying to access admin routes
    if (to.path.startsWith('/admin')) {
      return next({ path: '/login/admin' })
    }

    // If user is trying to access organization routes
    if (to.path.startsWith('/organization')) {
      return next({ path: '/login/organization' })
    }

    // Default fallback
    return next({ path: '/login/organization' })
  }

  if (Path?.value) {
    next({ path: '/login/organization' })
  }

  if (
    userData?.user?.employeeType === EmployeeStatusEnum.Employee &&
    to.path !== '/organization/employee-interface' &&
    (to.path == '/organization' || to.path == '/admin' || to.path == '/')
  ) {
    return next({ path: '/organization/employee-interface' })
  }

  // AUTHENTICATED
  if (loginPages.includes(to.name) && Path?.value) {
    const redirectPath =
      userData.user?.type === OrganizationTypeEnum.ADMIN ? '/admin' : '/organization'

    return next({ path: redirectPath })
  }

  next()
}
