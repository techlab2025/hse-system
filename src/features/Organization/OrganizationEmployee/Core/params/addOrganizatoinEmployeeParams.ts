import type Params from '@/base/core/params/params'
import type HirarachyEmployeeParams from './HirarchyParams'

export default class AddOrganizatoinEmployeeParams implements Params {
  name: string
  phone: string
  email: string
  password: string
  hierarchies: HirarachyEmployeeParams[]
  // certificateId: number[]

  constructor(
    name: string,
    phone: string,
    email: string,
    password: string,
    hierarchies: HirarachyEmployeeParams[],
    // certificateId: number[],
  ) {
    this.name = name
    this.phone = phone
    this.email = email
    this.password = password
    this.hierarchies = hierarchies
    // this.certificateId = certificateId
  }

  toMap(): Record<
    string,
    | number
    | string
    | number[]
    | Record<string, string | any | number[] | number | Record<string, string>>
  > {
    const data: Record<
      string,
      | number
      | string
      | number[]
      | Record<string, string | number[] | number | any | Record<string, string>>
    > = {}

    data['name'] = this.name
    data['phone'] = this.phone
    data['email'] = this.email
    data['password'] = this.password
    data['hierarchies'] = this.hierarchies
    // data['certificate_id'] = this.certificateId.map((id) => id)

    return data
  }
}
