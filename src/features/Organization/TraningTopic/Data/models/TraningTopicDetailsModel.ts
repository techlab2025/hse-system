import TranslationsParams, {
  type TitleLocale,
} from '@/base/core/params/translations_params.ts'

export default class TraningTopicDetailsModel {
  constructor(
    public id: number,
    public translations: TranslationsParams,
  ) {}

  get titles(): TitleLocale[] {
    return this.translations.titles
  }

  static fromMap(data: any): TraningTopicDetailsModel {
    return new TraningTopicDetailsModel(
      data.id,
      TranslationsParams.fromMap(data.translations ?? data.titles ?? data),
    )
  }
}
