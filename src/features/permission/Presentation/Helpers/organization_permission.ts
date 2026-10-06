import { adminPermissions, type PermissionItem } from '@/constant/adminPremission'
import { OrgPermissions } from '@/constant/organizationPremission'
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
