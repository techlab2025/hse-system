import TranslationsParams, {
  type TitleLocale,
} from '@/base/core/params/translations_params.ts'
import { MangementChangeTopicTypeEnum } from '../../Core/Core/MangementChangeTopicTypeEnum'

export default class MangementChangeTopicTypeDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public status?: MangementChangeTopicTypeEnum

  constructor(id: number, titles: TitleLocale[],status?: MangementChangeTopicTypeEnum) {
    this.id = id
    this.titles = titles
    this.status = status
  }

  static fromMap(data: any): MangementChangeTopicTypeDetailsModel {
    const translations = TranslationsParams.fromMap(data.titles)
    return new MangementChangeTopicTypeDetailsModel(data.id, translations.titles, data.status)
  }

  static example: MangementChangeTopicTypeDetailsModel = new MangementChangeTopicTypeDetailsModel(
    1,
    [{ title: 'Safety helmet', locale: 'en' }],
    MangementChangeTopicTypeEnum.employee
  )
}
