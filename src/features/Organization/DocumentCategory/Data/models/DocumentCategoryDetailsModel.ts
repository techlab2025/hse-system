import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params.ts'
import TitleInterface from '@/base/Data/Models/title_interface'

type IndustryDetails = { id: number; title?: string; titles?: TitleLocale[] }
type DocumentCategoryDetailsResponse = {
  id: number
  titles?: TitleLocale[]
  all_industries?: number | boolean
  industries?: IndustryDetails[]
}

export default class DocumentCategoryDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public allIndustries: boolean
  public industries: TitleInterface[]

  constructor(
    id: number,
    titles: TitleLocale[],
    allIndustries = false,
    industries: TitleInterface[] = [],
  ) {
    this.id = id
    this.titles = titles
    this.allIndustries = allIndustries
    this.industries = industries
  }

  static fromMap(data: DocumentCategoryDetailsResponse): DocumentCategoryDetailsModel {
    const translations = TranslationsParams.fromMap(data.titles ?? [], [])
    return new DocumentCategoryDetailsModel(
      data.id,
      translations.titles,
      Boolean(data.all_industries),
      (data.industries ?? []).map(
        (industry) =>
          new TitleInterface({
            id: industry.id,
            title:
              industry.title ??
              industry.titles?.find(
                (title: TitleLocale) => title.locale === localStorage.getItem('lang'),
              )?.title ??
              industry.titles?.[0]?.title ??
              '',
          }),
      ),
    )
  }

  static example: DocumentCategoryDetailsModel = new DocumentCategoryDetailsModel(1, [
    { title: 'Document Category 1', locale: 'en' },
  ])
}
