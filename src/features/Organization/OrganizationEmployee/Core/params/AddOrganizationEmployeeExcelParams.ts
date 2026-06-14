import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import type HirarachyEmployeeParams from './HirarchyParams'
interface Data {
  name: string
  email: string
  phone: string
  password: string
  // passwordConfirmation: string
  hierarchies: HirarachyEmployeeParams[]
  image: string
}
export default class AddOrganizationEmployeeExcelParams implements Params {
  public data: Data[] = []
  public isValid: boolean

  public static readonly validation = new ClassValidation().setRules({})
  constructor(data: { data: Data[]; isValid: boolean }) {
    this.data = data.data
    this.isValid = data.isValid
  }

  toMap(): Record<
    string,
    | number
    | string
    | number[]
    | Record<string, string | any | number[] | number | Record<string, string>>
  > {
    const data: Record<
      string,
      | number
      | string
      | number[]
      | Record<string, string | number[] | number | any | Record<string, string>>
    > = {}

    data['employees_data'] = this.data

    return data
  }

  validate() {
    return AddOrganizationEmployeeExcelParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddOrganizationEmployeeExcelParams.validation.validateOrThrow(this)
  }
}
