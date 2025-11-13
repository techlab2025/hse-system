import type Params from '@/base/core/params/params'

export default class AddContractorParams implements Params {
  Name: string
  phoneNumber: string

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
}
