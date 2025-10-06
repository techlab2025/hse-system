import { adminPermissions, type PermissionItem } from "@/constant/adminPremission"
import { OrgPermissions } from "@/constant/organizationPremission"
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