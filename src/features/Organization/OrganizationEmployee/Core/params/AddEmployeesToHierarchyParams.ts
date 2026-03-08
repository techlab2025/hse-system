import type Params from '@/base/core/params/params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import type AddEmployeeIdToHierarchyParams from './AddEmployeesIdToHierarchyParams'

export default class AddEmployeeToHierarchyParams implements Params {
  hierarchyId: number
  employeeIds: AddEmployeeIdToHierarchyParams[]

  public static readonly validation = new ClassValidation().setRules({
    hierarchyId: { required: true },
    employeeIds: { required: true },
  })
  constructor(hierarchyId: number, employeeIds: AddEmployeeIdToHierarchyParams[]) {
    this.hierarchyId = hierarchyId
    this.employeeIds = employeeIds
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<string, any> = {}

    data['herikaly_id'] = this.hierarchyId
    data['organization_employees'] = this.employeeIds

    return data
  }
  validate() {
    return AddEmployeeToHierarchyParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddEmployeeToHierarchyParams.validation.validateOrThrow(this)
  }
}
