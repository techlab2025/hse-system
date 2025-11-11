import type Params from '@/base/core/params/params'

export default class AddOrganizatoinEmployeeParams implements Params {
  name: string
  phone: string
  email: string
  password: string
  // heriarachyId: number
  // certificateId: number[]

  constructor(
    name: string,
    phone: string,
    email: string,
    password: string,
    // heriarachyId: number,
    // certificateId: number[],
  ) {
    this.name = name
    this.phone = phone
    this.email = email
    this.password = password
    // this.heriarachyId = heriarachyId
    // this.certificateId = certificateId
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
    // data['heriarachy_id'] = this.heriarachyId
    // data['certificate_id'] = this.certificateId.map((id) => id)

    return data
  }
}
