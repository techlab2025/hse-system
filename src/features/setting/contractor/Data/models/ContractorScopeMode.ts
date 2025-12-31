import type { TitleLocale } from '@/base/core/params/translations_params'
import TitleInterface from '@/base/Data/Models/title_interface'

export default class ContractorScopeModel extends TitleInterface {
  public allIndustries: boolean
  public id: number
  public titles: TitleLocale[]

  constructor(allIndustries: boolean, id: number, titles: TitleLocale[]) {
    super({ id: id, title: '' })
    this.allIndustries = allIndustries
    this.id = id
    this.titles = titles
  }

  static fromMap(data: any): ContractorScopeModel {
    return new ContractorScopeModel(data.all_industries, data.id, data.titles ?? [])
  }

  static getTitle(data: ContractorScopeModel) {
    const savedLocale = localStorage.getItem('lang') || 'en'

    return new TitleInterface({
      id: data.id,
      title:
        data.titles.find((t) => t.locale === savedLocale)?.title || data.titles[0]?.title || '',
    })
  }
}
