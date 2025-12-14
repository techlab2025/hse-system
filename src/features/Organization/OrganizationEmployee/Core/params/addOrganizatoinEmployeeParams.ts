import type Params from '@/base/core/params/params'
import type HirarachyEmployeeParams from './HirarchyParams'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import type RolesOrganizationEmployeeParams from './RolesOrganizationEmployeeParams'

export default class AddOrganizatoinEmployeeParams implements Params {
  name: string
  phone: string
  email: string
  password: string
  passwordConfirmation: string
  hierarchies: HirarachyEmployeeParams[]
  roles: RolesOrganizationEmployeeParams[]
  // certificateId: number[]

  public static readonly validation = new ClassValidation().setRules({
    name: { required: true, minLength: 2, maxLength: 100 },
    phone: { required: true, pattern: /^\+?[\d\s-()]+$/ },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    password: { required: true, minLength: 2, maxLength: 100 },
    passwordConfirmation: { required: true, minLength: 2, maxLength: 100 },
  })

  constructor(
    name: string,
    phone: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    hierarchies: HirarachyEmployeeParams[],
    roles: RolesOrganizationEmployeeParams[],
    // certificateId: number[],
  ) {
    this.name = name
    this.phone = phone
    this.email = email
    this.password = password
    this.passwordConfirmation = passwordConfirmation
    this.hierarchies = hierarchies
    this.roles = roles
    // this.certificateId = certificateId
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
    data['phone'] = this.phone
    data['email'] = this.email
    data['password'] = this.password
    data['password_confirmation'] = this.passwordConfirmation
    data['hierarchies'] = this.hierarchies
    data['roles'] = this.roles?.map((item) => item.toMap()) || []
    // data['certificate_id'] = this.certificateId.map((id) => id)

    return data
  }
  validate() {
    return AddOrganizatoinEmployeeParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddOrganizatoinEmployeeParams.validation.validateOrThrow(this)
  }
}
