import type { TitleLocale } from '@/base/core/params/translations_params'
import TranslationsParams from '@/base/core/params/translations_params'
import TitleInterface from '@/base/Data/Models/title_interface'

export default class ScopeDetailsModel extends TitleInterface {
  public id: number
  public titles: TitleLocale[]
  constructor(id: number, titles: TitleLocale[]) {
    super({ id })
    this.id = id
    this.titles = titles
  }

  static fromMap(data: any): ScopeDetailsModel {
    return new ScopeDetailsModel(data.id, TranslationsParams.fromMap(data.titles).titles)
  }

  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')

    return new TitleInterface({
      id: data.id,
      title: data.titles?.find((title: any) => title.locale === savedLocale)?.title,
    })
  }
}
