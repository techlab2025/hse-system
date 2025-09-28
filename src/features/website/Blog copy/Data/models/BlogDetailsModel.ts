import TranslationsParams, { type DescriptionLocale, type TitleLocale, type SubtitlesLocale } from '@/base/core/params/translations_params.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
import HashtagDetailsModel from '@/features/website/Hashtag/Data/models/HashtagDetailsModel'
import CategoryDetailsModel from '@/features/website/Category/Data/models/CategoryDetailsModel'

export default class BlogDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public descriptions: DescriptionLocale[]
  public subtitles: SubtitlesLocale[]
  public image: string
  public alt: string
  public hashtags?: HashtagDetailsModel[]
  public categories?: CategoryDetailsModel[]

  constructor(
    id: number,
    titles: TitleLocale[],
    descriptions: DescriptionLocale[],
    subtitles: SubtitlesLocale[],
    image: string,
    alt: string,
    hashtags?: HashtagDetailsModel[],
    categories?: CategoryDetailsModel[]

  ) {
    this.id = id
    this.titles = titles
    this.descriptions = descriptions
    this.subtitles = subtitles
    this.image = image
    this.alt = alt
    this.hashtags = hashtags
    this.categories = categories
  }

  static fromMap(data: any): BlogDetailsModel {
    const translations = TranslationsParams.fromMap(
      data.titles || [],
      data.descriptions || [],
      data.subtitles || []
    )

    return new BlogDetailsModel(
      data.id,
      translations.titles,
      translations.descriptions,
      translations.subtitles,
      data.image,
      data.alt,
      data.hashtags?.map((hashtag: any) => HashtagDetailsModel.fromMap(hashtag)) || [],
      data.categories?.map((category: any) => CategoryDetailsModel.fromMap(category)) || []
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
