import type Params from '@/base/core/params/params'

export default class AddOrganizatoinEmployeeParams implements Params {
  name: string
  phone: string
  email: string
  password: string

  constructor(name: string, phone: string, email: string, password: string) {
    this.name = name
    this.phone = phone
    this.email = email
    this.password = password
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

    data['name'] = this.name
    data['phone'] = this.phone
    data['email'] = this.email
    data['password'] = this.password

    return data
  }
}
