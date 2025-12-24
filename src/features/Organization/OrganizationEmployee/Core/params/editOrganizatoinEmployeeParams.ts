import type Params from '@/base/core/params/params.ts'
import type HirarachyEmployeeParams from './HirarchyParams'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import type RolesOrganizationEmployeeParams from './RolesOrganizationEmployeeParams'

export default class EditOrganizatoinEmployeeParams implements Params {
  id: number
  name: string
  phone: string
  email: string
  password: string
  passwordConfirmation: string
  hierarchies: HirarachyEmployeeParams[]
  roles: RolesOrganizationEmployeeParams[]
  serialNumber: string

  // certificateId: number[]
  public static readonly validation = new ClassValidation().setRules({
    name: { required: true, minLength: 2, maxLength: 100 },
    phone: { required: true, pattern: /^\+?[\d\s-()]+$/ },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  })
  constructor(
    id: number,
    name: string,
    phone: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    hierarchies: HirarachyEmployeeParams[],
    roles: RolesOrganizationEmployeeParams[],
    serialNumber: string,

    // certificateId: number[],
  ) {
    this.id = id
    this.name = name
    this.phone = phone
    this.email = email
    this.password = password
    this.passwordConfirmation = passwordConfirmation
    this.hierarchies = hierarchies
    this.roles = roles
    this.serialNumber = serialNumber
    // this.certificateId = certificateId
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<string, any> = {}

    data['organization_employee_id'] = this.id
    data['name'] = this.name
    data['phone'] = this.phone
    data['email'] = this.email
    if (this.password?.length > 0) data['password'] = this.password
    data['password_confirmation'] = this.passwordConfirmation
    data['hierarchies'] = this.hierarchies
    data['roles'] = this.roles.map((item) => item.toMap())
    data['serial_number'] = this.serialNumber

    // data['certificate_id'] = this.certificateId.map((id) => id)

    return data
  }
  validate() {
    return EditOrganizatoinEmployeeParams.validation.validate(this)
  }

  validateOrThrow() {
    return EditOrganizatoinEmployeeParams.validation.validateOrThrow(this)
  }
}
