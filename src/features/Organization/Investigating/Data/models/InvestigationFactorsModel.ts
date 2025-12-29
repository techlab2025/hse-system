import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params.ts'
import FactoryModel from '@/features/setting/Factory/Data/models/FactoryModel'

export default class InvestegationFactorModel {
  public id: number
  public factory: FactoryModel
  public status: number
  public title: string
  public investigation_factor_items: string[]
  public corrective_action: string

  constructor(
    id: number,
    factory: FactoryModel,
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

  static factoryExample: FactoryModel = {
    id: 162,
    titles: [
      { locale: 'en', title: 'Human Error' },
      { locale: 'ar', title: 'خطأ بشري' },
    ] as TitleLocale[],
    all_industries: 1,
    industries: [],
  }

  static example: InvestegationFactorModel = new InvestegationFactorModel(
    10,
    this.factoryExample,
    1,
    '',
    ['Lack of training', 'Poor supervision', 'Incorrect procedure followed'],
    'Provide proper training and update procedures',
  )
}

export interface FactoryModel {
  id: number
  titles: TitleLocale[]
  all_industries: number
  industries: any[]
}
