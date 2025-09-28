import type Params from '@/base/core/params/params'

export default class ShowSystemComponentParams implements Params {
  id: number

  constructor(id: number) {
    this.id = id
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    data['our_system_component_id'] = this.id
    return data
  }
}
