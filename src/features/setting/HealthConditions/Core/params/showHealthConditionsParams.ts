import type Params from '@/base/core/params/params'

export default class ShowHealthConditionsParams implements Params {
  id: number

  constructor(id: number) {
    this.id = id
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    data['health_conditions_id'] = this.id
    return data
  }
}
