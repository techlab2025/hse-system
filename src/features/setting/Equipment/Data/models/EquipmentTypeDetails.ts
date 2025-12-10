import TitleModel from '@/base/core/Models/title_model'
import type { TitleLocale } from '@/base/core/params/translations_params'
import TranslationsParams from '@/base/core/params/translations_params'
import TitleInterface from '@/base/Data/Models/title_interface'

export default class EquipmentTypeDetailsModel extends TitleInterface {
  public id: number
  public hasCertificate: number
  public allIndustries: number
  public industries: TitleModel
  public parentId: number
  public image: string
  public titles: TitleLocale[]
  public type: number
  public organization_id?: number

  constructor(
    id: number,
    title: string,
    subtitle: string,
    hasCertificate: number,
    allIndustries: number,
    industries: TitleModel,
    parentId: number,
    image: string,
    titles: TitleLocale[],
    type: number,
    organization_id: number,
  ) {
    super({ id, title, subtitle })

    this.id = id
    this.hasCertificate = hasCertificate
    this.allIndustries = allIndustries
    this.industries = industries
    this.parentId = parentId
    this.image = image
    this.titles = titles
    this.type = type
    this.organization_id = organization_id
  }

  static fromMap(data: any): EquipmentTypeDetailsModel {
    return new EquipmentTypeDetailsModel(
      data.id,
      data.title,
      data.subtitle,
      data.has_certificate,
      data.all_industries,
      data.industries.length > 0
        ? data.industries.map((industry) => TitleModel.fromMap(industry))
        : [],
      data.parent_id,
      data.image,
      TranslationsParams.fromMap(data.titles).titles,
      data.type,
      data.organization_id,
    )
  }

  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')

    return new TitleInterface({
      id: data?.id,
      title: data?.titles?.find((title: any) => title.locale === savedLocale)?.title,
    })
  }
}
