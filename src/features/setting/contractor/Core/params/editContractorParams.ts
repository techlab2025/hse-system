import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class EditContractorParams implements Params {
  id: number
  Name: string
  phoneNumber: string
  Scope?: number[]
  CompanyEmail?: string
  CompanyAddress?: string
  contactPerson?: string
  contactPersonEmail?: string
  contactPersonPhone?: string
  SelectedStatus?: number
  date?: string
  public static readonly validation = new ClassValidation().setRules({
    Name: { required: true, minLength: 2, maxLength: 100 },
    phoneNumber: { required: true, minLength: 11, maxLength: 20, pattern: /^\+?\d[\d\s\-()]{4,}$/ },
  })
  constructor(
    id: number,
    Name: string,
    phoneNumber: string,
    Scope?: number[],
    CompanyEmail?: string,
    CompanyAddress?: string,
    contactPerson?: string,
    contactPersonEmail?: string,
    contactPersonPhone?: string,
    SelectedStatus?: number,
    date?: string,
  ) {
    this.id = id
    this.Name = Name
    this.phoneNumber = phoneNumber
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
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<
      string,
      | number
      | string
      | number[]
      | Record<string, string | number[] | number | Record<string, string>>
    > = {}

    data['contractor_id'] = this.id
    data['name'] = this.Name
    data['phone'] = this.phoneNumber
    if (this.Scope) data['scope_id'] = this.Scope
    if (this.CompanyEmail) data['company_email'] = this.CompanyEmail
    if (this.CompanyAddress) data['company_address'] = this.CompanyAddress
    if (this.contactPerson) data['contact_person'] = this.contactPerson
    if (this.contactPersonEmail) data['contact_person_email'] = this.contactPersonEmail
    if (this.contactPersonPhone) data['contact_person_phone'] = this.contactPersonPhone
    if (this.SelectedStatus || this.SelectedStatus === 0) data['status_id'] = this.SelectedStatus
    if (this.date) data['date'] = this.date

    return data
  }
  validate() {
    return EditContractorParams.validation.validate(this)
  }

  validateOrThrow() {
    return EditContractorParams.validation.validateOrThrow(this)
  }
}
