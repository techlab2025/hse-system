// import type TitleModel from "@/base/core/Models/title_model";
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class IndustryModel {
  public id: number
  public titles: TranslationsParams[]

  constructor(id: number, titles: TranslationsParams[]) {
    this.id = id
    this.titles = titles
  }

  static fromMap(data: any): IndustryModel {
    return new IndustryModel(data.id, data.titles)
  }
}
