import TitleInterface from '@/base/Data/Models/title_interface'

export default class InvestegationFactorModel {
  public id: number
  public factory: TitleInterface
  public status: number
  public title: string
  public investigation_factor_items: string[]
  public corrective_action: string

  constructor(
    id: number,
    factory: TitleInterface,
    status: number,
    title: string,
    investigation_factor_items: string[],
    corrective_action: string,
  ) {
    this.id = id
    this.factory = factory
    this.status = status
    this.title = title
    this.investigation_factor_items = investigation_factor_items
    this.corrective_action = corrective_action
  }

  static fromMap(data: any): InvestegationFactorModel {
    return new InvestegationFactorModel(
      data.id,
      data.factory,
      data.status,
      data.title,
      data.investigation_factor_items,
      data.corrective_action,
    )
  }

  static example: InvestegationFactorModel = new InvestegationFactorModel(
    1,
    new TitleInterface({ id: 1, title: 'Mohab' }),
    1,
    '',
    ['factor item', 'factor item', 'factor item', 'factor item', 'factor item'],
    'corrective action',
  )
}
