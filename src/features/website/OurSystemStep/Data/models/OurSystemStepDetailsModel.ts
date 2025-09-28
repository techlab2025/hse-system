import TranslationsParams, { type DescriptionLocale, type TitleLocale, type SubtitlesLocale } from '@/base/core/params/translations_params.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'


export default class OurSystemStepDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public descriptions: DescriptionLocale[]
  public subtitles: SubtitlesLocale[]
  public image: string
  public alt: string


  constructor(
    id: number,
    titles: TitleLocale[],
    descriptions: DescriptionLocale[],
    subtitles: SubtitlesLocale[],
    image: string,
    alt: string,


  ) {
    this.id = id
    this.titles = titles
    this.descriptions = descriptions
    this.subtitles = subtitles
    this.image = image
    this.alt = alt

  }

  static fromMap(data: any): OurSystemStepDetailsModel {
    const translations = TranslationsParams.fromMap(
      data.titles || [],
      data.descriptions || [],
      data.subtitles || []
    )

    return new OurSystemStepDetailsModel(
      data.id,
      translations.titles,
      translations.descriptions,
      translations.subtitles,
      data.image,
      data.alt,

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
