// import type TitleModel from "@/base/core/Models/title_model";
import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params.ts'
// import TitleInterface from '@/base/Data/Models/title_interface.ts'
import TitleModel from '@/base/Data/Models/title_model.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
// import { LangEnum } from '../../Core/enums/langEnum'

export default class MethodsDetailsModel {
  public id: number
  public titles: TitleLocale[]
 
  // public descriptions: DescriptionLocale[]

  constructor(
    id: number,
    titles: TitleLocale[],

  ) {
    this.id = id
    this.titles = titles
  }

  static fromMap(data: any): MethodsDetailsModel {
    return new MethodsDetailsModel(
      data.id,
      TranslationsParams.fromMap(data.titles).titles,
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
