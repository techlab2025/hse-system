// import type TitleModel from "@/base/core/Models/title_model";
import TranslationsParams, { type DescriptionLocale, type TitleLocale } from '@/base/core/params/translations_params.ts'
// import TitleInterface from '@/base/Data/Models/title_interface.ts'
import TitleModel from '@/base/Data/Models/title_model.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
// import { LangEnum } from '../../Core/enums/langEnum'

export default class CatalogItemsDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public descriptions: DescriptionLocale[]
  public guidecategory :TitleInterface 
  // public descriptions: DescriptionLocale[]

  constructor(
    id: number,
    titles: TitleLocale[],
    descriptions: DescriptionLocale[],
    guidecategory: TitleInterface,
  ) {
    this.id = id
    this.titles = titles
    this.descriptions = descriptions
    this.guidecategory = guidecategory

  }

  static fromMap(data: any): CatalogItemsDetailsModel {
    return new CatalogItemsDetailsModel(
      data.id,
      TranslationsParams.fromMap(data.titles).titles,
      data.descriptions,
      this.getTitle(data.guide_category),
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
