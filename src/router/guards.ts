import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import ConditionHandler from '@/base/Presentation/utils/condition_handler'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import type { NavigationGuard } from 'vue-router'
import { canAccessEmployeeRoute, EMPLOYEE_HOME } from './employeeInterfaceAccess'

export const authGuard: NavigationGuard = (to, from, next) => {
  const userData = useUserStore()
  const shouldUseEmployeeInterface = () =>
    ConditionHandler.getInstance().shouldUseEmployeeInterface()
  const Path = ref<boolean>(to.path == '' || to.path == '/' || to.path == '/login')

  const loginPages = ['Login', 'Organization Login']

  //  NOT AUTHENTICATED
  if (!userData.isAuth) {
    // Allow login pages always
    if (loginPages.includes(String(to.name))) {
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

  if (shouldUseEmployeeInterface() && !canAccessEmployeeRoute(to, userData.user?.id)) {
    return next({ path: EMPLOYEE_HOME, replace: true })
  }

  // AUTHENTICATED
  if (loginPages.includes(String(to.name))) {
    const redirectPath = shouldUseEmployeeInterface()
      ? '/organization/employee-interface'
      : userData.user?.type === OrganizationTypeEnum.ADMIN
        ? '/admin'
        : '/organization'

    return next({ path: redirectPath })
  }

  if (Path?.value) {
    return next({
      path: shouldUseEmployeeInterface() ? '/organization/employee-interface' : '/organization',
    })
  }

  next()
}
