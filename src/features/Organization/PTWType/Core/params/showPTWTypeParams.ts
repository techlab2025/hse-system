import type Params from '@/base/core/params/params'

export default class ShowPTWTypeParams implements Params {
  id: number

  constructor(id: number) {
    this.id = id
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    data['permit_type_id'] = this.id
    return data
  }
}
