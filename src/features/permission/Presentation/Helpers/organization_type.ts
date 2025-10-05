
import { OrganizationTypeEnum } from "@/features/auth/Core/Enum/organization_type"


export const getOrganizationType = (value: string): number => {
    switch (value) {
        case 'admin':
            return OrganizationTypeEnum.ADMIN
        case 'organization':
            return OrganizationTypeEnum.ORGANIZATION
        default:
            return OrganizationTypeEnum.ADMIN
    }
}