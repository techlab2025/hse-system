import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import type ScopeIdParams from './AddscopesParams'

export default class AddContractorParams implements Params {
  Name: string
  ContractorNumber: string
  Scope?: ScopeIdParams[]
  CompanyEmail?: string
  CompanyAddress?: string
  contactPerson?: string
  contactPersonEmail?: string
  contactPersonPhone?: string
  SelectedStatus?: number
  date?: string

  public static readonly validation = new ClassValidation().setRules({
    Name: { required: true, minLength: 2, maxLength: 100 },
    ContractorNumber: {
      required: true,
      minLength: 11,
      maxLength: 20,
      pattern: /^\+?\d[\d\s\-()]{4,}$/,
    },
    contactPersonPhone: {
      pattern: /^\+?\d[\d\s\-()]{4,}$/,
    },
  })

  constructor(
    Name: string,
    ContractorNumber: string,
    Scope?: ScopeIdParams[],
    CompanyEmail?: string,
    CompanyAddress?: string,
    contactPerson?: string,
    contactPersonEmail?: string,
    contactPersonPhone?: string,
    SelectedStatus?: number,
    date?: string,
  ) {
    this.Name = Name
    this.ContractorNumber = ContractorNumber
    this.Scope = Scope
    this.CompanyEmail = CompanyEmail
    this.CompanyAddress = CompanyAddress
    this.contactPerson = contactPerson
    this.contactPersonEmail = contactPersonEmail
    this.contactPersonPhone = contactPersonPhone
    this.SelectedStatus = SelectedStatus
    this.date = date
  }

  toMap(): Record<
    string,
    | number
    | string
    | number[]
    | Record<string, string | number[] | number | any | Record<string, string>>
  > {
    const data: Record<
      string,
      | number
      | string
      | number[]
      | any
      | Record<string, string | number[] | number | Record<string, string>>
    > = {}

    data['name'] = this.Name
    data['phone'] = this.ContractorNumber
    if (this.Scope) data['scopes'] = this.Scope.map((scope) => scope.toMap())
    if (this.CompanyEmail) data['company_email'] = this.CompanyEmail
    if (this.CompanyAddress) data['company_address'] = this.CompanyAddress
    if (this.contactPerson) data['contact_person'] = this.contactPerson
    if (this.contactPersonEmail) data['contact_person_email'] = this.contactPersonEmail
    if (this.contactPersonPhone) data['contact_person_phone'] = this.contactPersonPhone
    if (this.SelectedStatus || this.SelectedStatus === 0) data['status'] = this.SelectedStatus
    if (this.date) data['expiry_date'] = formatJoinDate(this.date)

    return data
  }

  validate() {
    return AddContractorParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddContractorParams.validation.validateOrThrow(this)
  }
}
