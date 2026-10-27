import { getCurrentLocale } from '@/localization/i18n'
import { localizedRecord } from '@/localization/records'
import TitleInterface from '@/base/Data/Models/title_interface'
import type ServiceDetailsModel from '@/features/website/Service/Data/models/ServiceDetailsModel'
export default class ServiceLogDetailsModel {
  public id: number
  public title: TitleInterface[]
  public service: ServiceDetailsModel | null

  constructor(id: number, title: TitleInterface[], service: ServiceDetailsModel | null) {
    this.id = id
    this.title = title
    this.service = service
  }

  static fromMap(data: any): ServiceLogDetailsModel {
    return localizedRecord(
      new ServiceLogDetailsModel(data.id, data.titles, this.getTitle(data.service)),
      data,
    )
  }

  static getTitle(data: any) {
    const savedLocale = getCurrentLocale()
    return new TitleInterface({
      id: data?.id,
      title: data?.titles?.find((title: any) => title.locale === savedLocale)?.title,
      localizedTitles: data?.titles,
      subtitle: data?.subtitles?.find((title: any) => title.locale === savedLocale)?.subtitle,
    })
  }
}
