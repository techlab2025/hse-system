import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddContractorParams implements Params {
  Name: string
  phoneNumber: string

  public static readonly validation = new ClassValidation().setRules({
    Name: { required: true, minLength: 2, maxLength: 100 },
    phoneNumber: { required: true, minLength: 11, maxLength: 20, pattern: /^\+?\d[\d\s\-()]{4,}$/ },
  })

  constructor(Name: string, phoneNumber: string) {
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

    data['name'] = this.Name
    data['phone'] = this.phoneNumber

    return data
  }

  validate() {
    return AddContractorParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddContractorParams.validation.validateOrThrow(this)
  }
}
