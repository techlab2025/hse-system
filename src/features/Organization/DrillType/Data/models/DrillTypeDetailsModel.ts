import TranslationsParams, {
  type DescriptionLocale,
  type TitleLocale,
} from '@/base/core/params/translations_params.ts'

export default class DrillTypeDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public descriptions: DescriptionLocale[]

  constructor(id: number, titles: TitleLocale[], descriptions: DescriptionLocale[] = []) {
    this.id = id
    this.titles = titles
    this.descriptions = descriptions
  }

  static fromMap(data: any): DrillTypeDetailsModel {
    const translations = TranslationsParams.fromMap(data.titles, data.descriptions)
    return new DrillTypeDetailsModel(
      data.id,
      translations.titles,
      translations.descriptions,
    )
  }

  static example: DrillTypeDetailsModel = new DrillTypeDetailsModel(
    1,
    [{ title: 'Fire drill', locale: 'en' }],
    [{ description: 'Fire response and assembly drill', locale: 'en' }],
  )
}
