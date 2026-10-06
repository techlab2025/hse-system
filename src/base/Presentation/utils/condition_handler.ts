import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { EmployeeStatusEnum } from '@/features/Organization/OrganizationEmployee/Core/Enum/EmployeeStatus'
import { useUserStore } from '@/stores/user'

export default class ConditionHandler {
  private static instance: ConditionHandler
  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new ConditionHandler()
    }
    return this.instance
  }

  isOrganizationAdmin() {
    const { user } = useUserStore()
    return user?.employeeType == EmployeeStatusEnum.Admin
  }
  isOrganizationEmployee() {
    const { user } = useUserStore()
    return user?.employeeType == EmployeeStatusEnum.Employee
  }

  shouldUseEmployeeInterface() {
    const { user } = useUserStore()

    if (!user || user.type !== OrganizationTypeEnum.ORGANIZATION || user.isMaster === 1) {
      return false
    }

    const hasPermissions = Array.isArray(user.permission) && user.permission.length > 0

    return user.employeeType === EmployeeStatusEnum.Employee || !hasPermissions
  }

  isSettingAdmin() {
    const { user } = useUserStore()
    return user?.type == OrganizationTypeEnum.ADMIN
  }
}
