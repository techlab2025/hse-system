import type { RouteLocationRaw, Router } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import type { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import PermissionHandler from '@/base/Presentation/utils/permission_handler'
import { canOrganizationRoute } from './organization_authorization'
import { canAny, isPermissionMaster, permissionsReady } from './organization_permission'

export interface PermissionAction {
  link?: RouteLocationRaw
  permission?: readonly PermissionsEnum[]
  organizationPermission?: readonly PermissionsEnum[]
  capability?: 'export' | 'import' | 'print' | 'download'
}

export function canPermissionAction(action: PermissionAction, router: Router): boolean {
  if (!permissionsReady()) return false
  if (action.capability && !canOrganizationCapability(action.capability)) return false
  if (action.link) {
    try {
      const route = router.resolve(action.link)
      if (route.path.startsWith('/organization')) return canOrganizationRoute(route)
    } catch {
      return false
    }
  }
  if (
    action.organizationPermission &&
    (useUserStore().user?.type === OrganizationTypeEnum.ORGANIZATION ||
      window.location.pathname.startsWith('/organization'))
  ) return canAny(action.organizationPermission)
  if (action.permission) return PermissionHandler.Instance.handle(action.permission)
  return isPermissionMaster() || useUserStore().user?.type !== OrganizationTypeEnum.ORGANIZATION
}

/** These identifiers do not exist in the current backend-facing enum. Do not borrow CRUD grants. */
export function canOrganizationCapability(
  _operation: 'export' | 'import' | 'print' | 'download',
): boolean {
  const unsupportedOperations = new Set(['export', 'import', 'print', 'download'])
  if (!unsupportedOperations.has(_operation)) return false
  return (
    permissionsReady() &&
    (useUserStore().user?.type !== OrganizationTypeEnum.ORGANIZATION || isPermissionMaster())
  )
}
