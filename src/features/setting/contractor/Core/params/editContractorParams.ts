import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class EditContractorParams implements Params {
  id: number
  Name: string
  phoneNumber: string
  public static readonly validation = new ClassValidation().setRules({
    Name: { required: true, minLength: 2, maxLength: 100 },
    phoneNumber: { required: true, minLength: 11, maxLength: 20, pattern: /^\+?\d[\d\s\-()]{4,}$/ },
  })
  constructor(id: number, Name: string, phoneNumber: string) {
    this.id = id
    this.Name = Name
    this.phoneNumber = phoneNumber
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

    return data
  }
  validate() {
    return EditContractorParams.validation.validate(this)
  }

  validateOrThrow() {
    return EditContractorParams.validation.validateOrThrow(this)
  }
}
