import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { useUserStore } from '@/stores/user'

export function authGuard(to, from, next) {
  const userData = useUserStore()

  const loginPages = ['Login', 'Organization Login']

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

  // AUTHENTICATED
  if (loginPages.includes(to.name)) {
    const redirectPath =
      userData.user?.type === OrganizationTypeEnum.ADMIN ? '/admin' : '/organization'

    return next({ path: redirectPath })
  }

  next()
}
