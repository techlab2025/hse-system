import type Params from '@/base/core/params/params'

export default class HazardFactorParams implements Params {
  factoryId: number

  constructor(factoryId: number) {
    this.factoryId = factoryId
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    data['factory_id'] = this.factoryId
    return data
  }
}
