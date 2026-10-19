import { adminPermissions, type PermissionItem } from '@/constant/adminPremission'
import { OrgPermissions } from '@/constant/organizationPremission'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { useUserStore } from '@/stores/user'

export interface PermissionContext {
  isAuth: boolean
  loading?: boolean
  invalidated?: boolean
  user: {
    isMaster?: number
    permission?: unknown
    permissionsLoaded?: boolean
  } | null
}

const knownPermissions = new Set<string>(Object.values(PermissionsEnum))
const getContext = (): PermissionContext => {
  const store = useUserStore()
  return {
    isAuth: store.isAuth,
    user: store.user,
    loading: store.permissionsLoading,
    invalidated: store.permissionsInvalidated,
  }
}

export const isKnownPermission = (permission: unknown): permission is PermissionsEnum =>
  typeof permission === 'string' && knownPermissions.has(permission)

export function permissionsReady(context: PermissionContext = getContext()): boolean {
  return (
    context.isAuth === true &&
    !context.loading &&
    !context.invalidated &&
    !!context.user &&
    context.user.permissionsLoaded !== false &&
    Array.isArray(context.user.permission) &&
    context.user.permission.every((permission) => typeof permission === 'string')
  )
}

/** Preserve the existing server-provided is_master rule; roles and emails are never overrides. */
export function isPermissionMaster(context: PermissionContext = getContext()): boolean {
  return permissionsReady(context) && context.user?.isMaster === 1
}

export function can(
  permission: PermissionsEnum,
  context: PermissionContext = getContext(),
): boolean {
  if (!isKnownPermission(permission) || !permissionsReady(context)) return false
  return isPermissionMaster(context) || (context.user!.permission as string[]).includes(permission)
}

export function canAny(
  permissions: readonly PermissionsEnum[],
  context: PermissionContext = getContext(),
): boolean {
  return (
    Array.isArray(permissions) &&
    permissions.length > 0 &&
    permissions.every(isKnownPermission) &&
    permissions.some((permission) => can(permission, context))
  )
}

export function canAll(
  permissions: readonly PermissionsEnum[],
  context: PermissionContext = getContext(),
): boolean {
  return (
    Array.isArray(permissions) &&
    permissions.length > 0 &&
    permissions.every(isKnownPermission) &&
    permissions.every((permission) => can(permission, context))
  )
}

export class PermissionDeniedError extends Error {
  constructor() {
    super('You do not have permission to perform this operation.')
    this.name = 'PermissionDeniedError'
  }
}

export function requireAny(permissions: readonly PermissionsEnum[]): void {
  if (!canAny(permissions)) throw new PermissionDeniedError()
}

export function validatePermissionChanges(
  original: readonly string[],
  candidate: readonly string[],
  available?: readonly string[],
): boolean {
  if (!canAny([PermissionsEnum.PERMISSION_UPDATE])) return false
  const before = new Set(original)
  const after = new Set(candidate)
  if (candidate.some((code) => typeof code !== 'string')) return false
  for (const code of after) {
    if (
      !before.has(code) &&
      (!isKnownPermission(code) || !can(code) || (available && !available.includes(code)))
    )
      return false
  }
  for (const code of before) {
    if (!after.has(code) && (!isKnownPermission(code) || !can(code))) return false
  }
  return true
}
// import { OrganizationTypeEnum } from "@/features/auth/Core/Enum/organization_type"

export const getOrganizationPermissionLabel = (value: string): PermissionItem => {
  switch (value) {
    case 'admin':
      return structuredClone(adminPermissions)
    case 'organization':
      return structuredClone(OrgPermissions)
    default:
      return { ...OrgPermissions, permissions: [] }
  }
}

export const internalAuditPermissions: PermissionsEnum[] = [
  PermissionsEnum.INTERNAL_AUDIT_ALL,
  PermissionsEnum.INTERNAL_AUDIT_FETCH,
  PermissionsEnum.INTERNAL_AUDIT_DETAILS,
  PermissionsEnum.INTERNAL_AUDIT_CREATE,
  PermissionsEnum.INTERNAL_AUDIT_UPDATE,
  PermissionsEnum.INTERNAL_AUDIT_DELETE,
]

export const auditStandardPermissions: PermissionsEnum[] = [
  PermissionsEnum.AUDIT_STANDARDS_ALL,
  PermissionsEnum.AUDIT_STANDARDS_FETCH,
  PermissionsEnum.AUDIT_STANDARDS_DETAILS,
  PermissionsEnum.AUDIT_STANDARDS_CREATE,
  PermissionsEnum.AUDIT_STANDARDS_UPDATE,
  PermissionsEnum.AUDIT_STANDARDS_DELETE,
  PermissionsEnum.ORG_AUDIT_STANDARDS_ALL,
  PermissionsEnum.ORG_AUDIT_STANDARDS_FETCH,
  PermissionsEnum.ORG_AUDIT_STANDARDS_DETAILS,
  PermissionsEnum.ORG_AUDIT_STANDARDS_CREATE,
  PermissionsEnum.ORG_AUDIT_STANDARDS_UPDATE,
  PermissionsEnum.ORG_AUDIT_STANDARDS_DELETE,
]

export const auditActivityPermissions: PermissionsEnum[] = [
  PermissionsEnum.AUDIT_ACTIVITIES_ALL,
  PermissionsEnum.AUDIT_ACTIVITIES_FETCH,
  PermissionsEnum.AUDIT_ACTIVITIES_DETAILS,
  PermissionsEnum.AUDIT_ACTIVITIES_CREATE,
  PermissionsEnum.AUDIT_ACTIVITIES_UPDATE,
  PermissionsEnum.AUDIT_ACTIVITIES_DELETE,
  PermissionsEnum.ORG_AUDIT_ACTIVITIES_ALL,
  PermissionsEnum.ORG_AUDIT_ACTIVITIES_FETCH,
  PermissionsEnum.ORG_AUDIT_ACTIVITIES_DETAILS,
  PermissionsEnum.ORG_AUDIT_ACTIVITIES_CREATE,
  PermissionsEnum.ORG_AUDIT_ACTIVITIES_UPDATE,
  PermissionsEnum.ORG_AUDIT_ACTIVITIES_DELETE,
]

export const documentCategoryPermissions: PermissionsEnum[] = [
  PermissionsEnum.DOCUMENT_CATEGORY_ALL,
  PermissionsEnum.DOCUMENT_CATEGORY_FETCH,
  PermissionsEnum.DOCUMENT_CATEGORY_DETAILS,
  PermissionsEnum.DOCUMENT_CATEGORY_CREATE,
  PermissionsEnum.DOCUMENT_CATEGORY_UPDATE,
  PermissionsEnum.DOCUMENT_CATEGORY_DELETE,
  PermissionsEnum.ORG_DOCUMENT_CATEGORY_ALL,
  PermissionsEnum.ORG_DOCUMENT_CATEGORY_FETCH,
  PermissionsEnum.ORG_DOCUMENT_CATEGORY_DETAILS,
  PermissionsEnum.ORG_DOCUMENT_CATEGORY_CREATE,
  PermissionsEnum.ORG_DOCUMENT_CATEGORY_UPDATE,
  PermissionsEnum.ORG_DOCUMENT_CATEGORY_DELETE,
]

export const myInternalAuditPermissions: PermissionsEnum[] = [
  PermissionsEnum.MY_INTERNAL_AUDIT_ALL,
  PermissionsEnum.MY_INTERNAL_AUDIT_FETCH,
  PermissionsEnum.MY_INTERNAL_AUDIT_DETAILS,
  PermissionsEnum.MY_INTERNAL_AUDIT_CREATE,
]
