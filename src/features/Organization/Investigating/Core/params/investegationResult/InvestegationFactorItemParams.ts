import type Params from '@/base/core/params/params'

export default class InvestigationFactorItemParams implements Params {
  public factoryItemId: number
  constructor(factoryItemId: number) {
    this.factoryItemId = factoryItemId
  }

  toMap(): Record<string, number | string | any> {
    const data: Record<string, number | string | any> = {}
    data['factory_item_id'] = this.factoryItemId

    return data
  }
}
