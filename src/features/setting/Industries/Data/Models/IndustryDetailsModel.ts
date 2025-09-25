// import type TitleModel from "@/base/core/Models/title_model";

import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params.ts'

export default class IndustryDetailsModel {
  public id: number
  public titles: TitleLocale[]

  constructor(id: number, titles: TitleLocale[]) {
    this.id = id
    this.titles = titles
  }

  static fromMap(data: any): IndustryDetailsModel {
    return new IndustryDetailsModel(data.id, TranslationsParams.fromMap(data.titles).titles)
  }
}
