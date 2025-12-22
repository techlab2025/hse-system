import type Params from '@/base/core/params/params'
import type InvestigationFactorItemParams from './InvestegationFactorItemParams'

export default class InvestigationFactorParams implements Params {
  public factoryId: number
  public items: InvestigationFactorItemParams[]
  constructor(factoryId: number, items: InvestigationFactorItemParams[]) {
    this.factoryId = factoryId
    this.items = items
  }

  toMap(): Record<string, number | string | any> {
    const data: Record<string, number | string | any> = {}
    data['factory_id'] = this.factoryId
    data['items'] = this.items.map((item) => item.toMap())

    return data
  }
}
