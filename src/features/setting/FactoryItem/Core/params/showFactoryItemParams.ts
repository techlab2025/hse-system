import type Params from '@/base/core/params/params'

export default class ShowFactoryItemParams implements Params {
  id: number

  constructor(id: number) {
    this.id = id
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    data['factory_item_id'] = this.id
    return data
  }
}
