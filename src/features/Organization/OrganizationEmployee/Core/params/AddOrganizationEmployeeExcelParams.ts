import type Params from '@/base/core/params/params'

export default class AddOrganizationEmployeeExcelParams implements Params {
  name: string
  id: number
  email: string

  constructor(data: { name: string; id: number; email: string }) {
    this.name = data.name
    this.id = data.id
    this.email = data.email
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
    data['email'] = this.email
    data['id'] = this.id

    return data
  }
}

