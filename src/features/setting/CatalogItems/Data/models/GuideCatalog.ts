import TranslationsParams, { type DescriptionLocale, type TitleLocale } from '@/base/core/params/translations_params.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'

export default class GuideCatalogModel {
  public id: number
  public titles: TitleLocale[]
  public descriptions:DescriptionLocale[]

  constructor(
    id: number,
    titles: TitleLocale[],
    descriptions:DescriptionLocale[], 
  ) {
    this.id = id
    this.titles = titles
    this.descriptions = descriptions

  }

  static fromMap(data: any): GuideCatalogModel {
    return new GuideCatalogModel(
      data.id,
      TranslationsParams.fromMap(data.titles).titles,
      TranslationsParams.fromMap(data.descriptions).descriptions,
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
