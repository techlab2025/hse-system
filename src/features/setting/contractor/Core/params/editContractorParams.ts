import type Params from '@/base/core/params/params'

export default class implements Params {
  id: number
  Name: string
  phoneNumber: string

  constructor(
    id: number,
    Name: string,
    phoneNumber: string,
  ) {
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
}
