import type Params from '@/base/core/params/params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddEmployeeIdToHierarchyParams implements Params {
  organization_employee_id: number

  public static readonly validation = new ClassValidation().setRules({
    organization_employee_id: { required: true },
  })
  constructor(organization_employee_id: number) {
    this.organization_employee_id = organization_employee_id
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<string, any> = {}

    data['organization_employee_id'] = this.organization_employee_id

    return data
  }
  validate() {
    return AddEmployeeIdToHierarchyParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddEmployeeIdToHierarchyParams.validation.validateOrThrow(this)
  }
}
