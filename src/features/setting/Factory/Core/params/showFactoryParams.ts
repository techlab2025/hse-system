import type Params from '@/base/core/params/params'

export default class ShowFactoryParams implements Params {
  id: number

  constructor(id: number) {
    this.id = id
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    data['factory_id'] = this.id
    return data
  }
}
