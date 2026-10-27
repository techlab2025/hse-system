import { getCurrentLocale } from '@/localization/i18n'
import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params.ts'
import TitleInterface from '@/base/Data/Models/title_interface'

type IndustryDetails = { id: number; title?: string; titles?: TitleLocale[] }
type TraningTopicDetailsResponse = {
  id: number
  titles?: TitleLocale[]
  translations?: TitleLocale[] | { titles?: TitleLocale[] }
  all_industries?: number | boolean | '0' | '1'
  industries?: IndustryDetails[]
}

export default class TraningTopicDetailsModel {
  constructor(
    public id: number,
    public translations: ReturnType<typeof TranslationsParams.fromMap>,
    public allIndustries: boolean = false,
    public industries: TitleInterface[] = [],
  ) {}

  get titles(): TitleLocale[] {
    return this.translations.titles
  }

  static fromMap(data: TraningTopicDetailsResponse): TraningTopicDetailsModel {
    const titles: TitleLocale[] = Array.isArray(data.titles)
      ? data.titles
      : Array.isArray(data.translations)
        ? data.translations
        : data.translations &&
            !Array.isArray(data.translations) &&
            Array.isArray(data.translations.titles)
          ? data.translations.titles
          : []
    return new TraningTopicDetailsModel(
      data.id,
      TranslationsParams.fromMap(titles),
      Number(data.all_industries) === 1,
      (data.industries ?? []).map(
        (industry) =>
          new TitleInterface({
            id: industry.id,
            title:
              industry.title ??
              industry.titles?.find((title: TitleLocale) => title.locale === getCurrentLocale())
                ?.title ??
              industry.titles?.[0]?.title ??
              '',
            localizedTitles: industry.titles,
          }),
      ),
    )
  }
}
