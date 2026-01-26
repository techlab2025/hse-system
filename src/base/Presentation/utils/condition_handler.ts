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

  isAdmin() {
    const { user } = useUserStore()
    return user?.employeeType == EmployeeStatusEnum.Admin
  }
  isEmployee() {
    const { user } = useUserStore()
    return user?.employeeType == EmployeeStatusEnum.Employee
  }
}
  