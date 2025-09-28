// import type TitleModel from "@/base/core/Models/title_model";
import TranslationsParams, { type DescriptionLocale, type TitleLocale, type SubtitlesLocale } from '@/base/core/params/translations_params.ts'
// import TitleInterface from '@/base/Data/Models/title_interface.ts'
// import TitleModel from '@/base/Data/Models/title_model.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
// import { LangEnum } from '../../Core/enums/langEnum'

export default class SystemRiskManagementDetailsModel {
  public id: number
  public titles: TitleLocale[]

  public subtitles: SubtitlesLocale[]

  public image: string
  public alt: string



  constructor(
    id: number,
    titles: TitleLocale[],
    subtitles: SubtitlesLocale[],

    alt: string,
    image: string,

  ) {
    this.id = id
    this.titles = titles
    this.subtitles = subtitles

    this.alt = alt
    this.image = image

  }

static fromMap(data: any): SystemRiskManagementDetailsModel {
  const translations = TranslationsParams.fromMap(
    data.titles,
    [],
    data.subtitles,
  )

  console.log('translations', translations)

  return new SystemRiskManagementDetailsModel(
    data.id,
    translations.titles,
    translations.subtitles,
    data.alt,
    data.image,
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
