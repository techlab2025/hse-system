import { adminPermissions, type PermissionItem } from "@/constant/adminPremission"
import { OrgPermissions } from "@/constant/organizationPremission"
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
// import { OrganizationTypeEnum } from "@/features/auth/Core/Enum/organization_type"


export const getOrganizationPermissionLabel = (value: string): PermissionItem => {
    switch (value) {
        case 'admin':
            return adminPermissions
        case 'organization':
            return OrgPermissions
        default:
            return adminPermissions
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
