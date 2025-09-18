
// import type TitleModel from "@/base/core/Models/title_model";
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import type TitleInterface from '@/base/Data/Models/title_interface.ts'

export default class ShowLangModel {
  public id: number;
  public titles: TranslationsParams[];
  public descriptions: TranslationsParams[];
  public code: TitleInterface | null;

  constructor(
    id: number,
    titles: TranslationsParams[],
    descriptions: TranslationsParams[],
    code: TitleInterface | null,

  ) {
    this.id = id;
    this.titles = titles;
    this.descriptions = descriptions;
    this.code = code;
  }

  static fromMap(data: any): ShowLangModel {
    return new ShowLangModel(
      data.id,
      data.titles,
      data.descriptions,
      data.code,
    );
  }
}
