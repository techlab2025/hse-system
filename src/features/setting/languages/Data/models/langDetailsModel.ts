// import type TitleModel from "@/base/core/Models/title_model";
import TranslationsParams, {
  type DescriptionLocale,
  type TitleLocale,
} from '@/base/core/params/translations_params.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
import { LangEnum } from '../../Core/enums/langEnum'

export default class ShowLangModel {
  public id: number
  public titles: TitleLocale[]
  public descriptions: DescriptionLocale[]
  public code: TitleInterface | null

  constructor(
    id: number,
    titles: TitleLocale[],
    descriptions: DescriptionLocale[],
    code: TitleInterface | null,
  ) {
    this.id = id
    this.titles = titles
    this.descriptions = descriptions
    this.code = code
  }

  static fromMap(data: any): ShowLangModel {
    return new ShowLangModel(
      data.id,
      TranslationsParams.fromMap(data.titles).titles,
      data.descriptions,
      this.getCode(data.code),
    )
  }

  static getCode(code: string): TitleInterface | null {
    switch (code) {
      case LangEnum.ENGLISH:
        return new TitleInterface({
          id: 2,
          title: 'English',
          translationKey: 'English',
          subtitle: code,
        })
      case LangEnum.ARABIC:
        return new TitleInterface({
          id: 1,
          title: 'Arabic',
          translationKey: 'Arabic',
          subtitle: code,
        })
      case LangEnum.FRENCH:
        return new TitleInterface({
          id: 3,
          title: 'French',
          translationKey: 'French',
          subtitle: code,
        })
      case LangEnum.GERMAN:
        return new TitleInterface({
          id: 4,
          title: 'German',
          translationKey: 'German',
          subtitle: code,
        })
      case LangEnum.SPANISH:
        return new TitleInterface({
          id: 5,
          title: 'Spanish',
          translationKey: 'Spanish',
          subtitle: code,
        })
      case LangEnum.CHINESE:
        return new TitleInterface({
          id: 6,
          title: 'Chinese',
          translationKey: 'Chinese',
          subtitle: code,
        })
      case LangEnum.JAPANESE:
        return new TitleInterface({
          id: 7,
          title: 'Japanese',
          translationKey: 'Japanese',
          subtitle: code,
        })
      case LangEnum.KOREAN:
        return new TitleInterface({
          id: 8,
          title: 'Korean',
          translationKey: 'Korean',
          subtitle: code,
        })
      case LangEnum.ITALIAN:
        return new TitleInterface({
          id: 9,
          title: 'Italian',
          translationKey: 'Italian',
          subtitle: code,
        })
      case LangEnum.PORTUGUESE:
        return new TitleInterface({
          id: 10,
          title: 'Portuguese',
          translationKey: 'Portuguese',
          subtitle: code,
        })
      case LangEnum.RUSSIAN:
        return new TitleInterface({
          id: 11,
          title: 'Russian',
          translationKey: 'Russian',
          subtitle: code,
        })
      case LangEnum.THAI:
        return new TitleInterface({ id: 12, title: 'Thai', translationKey: 'Thai', subtitle: code })
      case LangEnum.VIETNAMESE:
        return new TitleInterface({
          id: 13,
          title: 'Vietnamese',
          translationKey: 'Vietnamese',
          subtitle: code,
        })
      case LangEnum.PERSIAN:
        return new TitleInterface({
          id: 14,
          title: 'Iraqi',
          translationKey: 'Iraqi',
          subtitle: code,
        })
      default:
        return null
    }
  }
}
