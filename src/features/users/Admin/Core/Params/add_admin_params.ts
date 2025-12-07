import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddAdminParams implements Params {
  public name: string
  public email: string
  public password: string
  public phone: string

  public static readonly validation = new ClassValidation().setRules({
    name: { required: true, minLength: 2, maxLength: 100 },
    phone: { required: true, pattern: /^\+?[\d\s-()]+$/ },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    password: { required: true, minLength: 6, maxLength: 100 },
  })

  constructor(data: { name: string; email: string; password: string; phone: string }) {
    this.name = data.name
    this.email = data.email
    this.password = data.password
    this.phone = data.phone
  }

  toMap(): { [key: string]: any } {
    return {
      name: this.name,
      email: this.email,
      password: this.password,
      phone: this.phone,
    }
  }

  validate() {
    return AddAdminParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddAdminParams.validation.validateOrThrow(this)
  }
}
