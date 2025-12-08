import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
export default class RoleDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public permissions: string[]

  constructor(id: number, titles: TitleLocale[], permissions: string[]) {
    this.id = id
    this.titles = titles
    this.permissions = permissions
  }

  static fromMap(data: any): RoleDetailsModel {
    return new RoleDetailsModel(
      data.id,
      TranslationsParams.fromMap(data.titles).titles,
      data.permissions,
    )
  }

  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')
    return new TitleInterface({
      id: data.id,
      title: data.titles?.find((title: any) => title.locale === savedLocale)?.title,
    })
  }
}
