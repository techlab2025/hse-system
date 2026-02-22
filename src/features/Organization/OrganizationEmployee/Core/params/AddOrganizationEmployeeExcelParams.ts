import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddOrganizationEmployeeExcelParams implements Params {
  name: string
  email: string
  phone: string
  password: string
  passwordConfirmation: string

  public static readonly validation = new ClassValidation().setRules({})
  constructor(data: {
    name: string
    email: string
    phone: string
    password: string
    passwordConfirmation: string
  }) {
    this.name = data.name
    this.email = data.email
    this.phone = data.phone
    this.password = data.password
    this.passwordConfirmation = data.passwordConfirmation
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

    data['name'] = this.name
    data['email'] = this.email
    data['phone'] = this.phone
    data['password'] = this.password
    data['password_confirmation'] = this.passwordConfirmation

    return data
  }

  validate() {
    return AddOrganizationEmployeeExcelParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddOrganizationEmployeeExcelParams.validation.validateOrThrow(this)
  }
}
