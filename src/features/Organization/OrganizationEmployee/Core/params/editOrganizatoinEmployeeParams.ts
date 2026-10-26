import type Params from '@/base/core/params/params.ts'
import type HirarachyEmployeeParams from './HirarchyParams'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import type RolesOrganizationEmployeeParams from './RolesOrganizationEmployeeParams'
import type { EmployeeStatusEnum } from '../Enum/EmployeeStatus'

export default class EditOrganizatoinEmployeeParams implements Params {
  id: number
  name: string
  phone: string
  countryCode: string
  email: string
  password: string
  passwordConfirmation: string
  hierarchies: HirarachyEmployeeParams[]
  roles: RolesOrganizationEmployeeParams[]
  serialNumber: string
  EmployeeStatus: EmployeeStatusEnum
  dashAccessStatus: boolean
  // certificateId: number[]
  allPermissions: boolean
  image: string | null | undefined
  public static readonly validation = new ClassValidation("Organization/OrganizationEmployee/Core/params/editOrganizatoinEmployeeParams").setRules({
    name: { required: true, minLength: 2, maxLength: 100 },
    phone: { required: true, pattern: /^\+?[\d\s-()]+$/ },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  })
  constructor(
    id: number,
    name: string,
    phone: string,
    countryCode: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    hierarchies: HirarachyEmployeeParams[],
    roles: RolesOrganizationEmployeeParams[],
    EmployeeStatus: EmployeeStatusEnum,
    dashAccessStatus: boolean,
    allPermissions: boolean,
    image?: string | null,

    // certificateId: number[],
  ) {
    this.id = id
    this.name = name
    this.phone = phone
    this.countryCode = countryCode
    this.email = email
    this.password = password
    this.passwordConfirmation = passwordConfirmation
    this.hierarchies = hierarchies
    this.roles = roles
    this.EmployeeStatus = EmployeeStatus
    this.dashAccessStatus = dashAccessStatus
    this.allPermissions = allPermissions
    this.image = image
    // this.certificateId = certificateId
  }

  toMap(): Record<
    string,
    | number
    | string
    | null
    | number[]
    | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<string, any> = {}

    data['organization_employee_id'] = this.id
    data['name'] = this.name
    data['phone'] = this.phone
    data['country_code'] = this.countryCode
    data['email'] = this.email
    if (this.password?.length > 0) data['password'] = this.password
    data['password_confirmation'] = this.passwordConfirmation
    data['hierarchies'] = this.hierarchies
    data['roles'] = this.roles.map((item) => item.toMap())
    data['employee_type'] = Number(this.EmployeeStatus)

    data['can_access_dashboard'] = Number(this.dashAccessStatus)
    // data['certificate_id'] = this.certificateId.map((id) => id)
    data['allow_all_permissions'] = this.allPermissions
    // A fetched URL is preview-only; send only a replacement or an explicit removal.
    if (this.image !== undefined && !/^https?:\/\//i.test(this.image ?? '')) {
      data['image'] = this.image
    }

    return data
  }
  validate() {
    return EditOrganizatoinEmployeeParams.validation.validate(this)
  }

  validateOrThrow() {
    return EditOrganizatoinEmployeeParams.validation.validateOrThrow(this)
  }
}
