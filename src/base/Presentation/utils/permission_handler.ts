import type { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { useUserStore } from '@/stores/user'
import {
  can,
  canAny,
  isPermissionMaster,
  permissionsReady,
} from '@/features/permission/Presentation/Helpers/organization_permission'
import { PermissionsEnum as Permission } from '@/features/users/Admin/Core/Enum/permission_enum'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
// import { useUserStore } from "@/stores/user";
// import { PermissionsEnum } from "@/features/users/employee/Core/Enum/permission_enum";

export default class PermissionHandler {
  private static _instance: PermissionHandler

  static get Instance(): PermissionHandler {
    if (!this._instance) {
      this._instance = new PermissionHandler()
    }
    return this._instance
  }

  handle(code: readonly PermissionsEnum[]): boolean {
    if (!Array.isArray(code)) return false
    if (isPermissionMaster()) return canAny(code)
    // Legacy role markers are grouping metadata, never substitutes for an Organization operation.
    const roles = new Set([
      Permission.ADMIN,
      Permission.ORGANIZATION_EMPLOYEE,
      Permission.WEBSITE,
      Permission.SETTING,
    ])
    const requested =
      useUserStore().user?.type === OrganizationTypeEnum.ORGANIZATION
        ? code.filter((permission) => !roles.has(permission))
        : code
    return canAny(requested)
  }

  except(code: PermissionsEnum): boolean {
    return permissionsReady() && !can(code)
  }
}
