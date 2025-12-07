import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class EditAdminParams implements Params {
  public admin_id: number
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
  constructor(data: {
    admin_id: number
    name: string
    email: string
    password: string
    phone: string
  }) {
    this.admin_id = data.admin_id
    this.name = data.name
    this.email = data.email
    this.password = data.password
    this.phone = data.phone
  }

  toMap(): { [key: string]: any } {
    // console.log(this.id);
    return {
      admin_id: this.admin_id,
      name: this.name,
      email: this.email,
      password: this.password,
      phone: this.phone,
    }
  }

  validate() {
    return EditAdminParams.validation.validate(this)
  }

  validateOrThrow() {
    return EditAdminParams.validation.validateOrThrow(this)
  }
}
