// import type TitleModel from "@/base/core/Models/title_model";
import TranslationsParams, { type DescriptionLocale, type TitleLocale } from '@/base/core/params/translations_params.ts'
// import TitleInterface from '@/base/Data/Models/title_interface.ts'
import TitleModel from '@/base/Data/Models/title_model.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
// import { LangEnum } from '../../Core/enums/langEnum'

export default class CertificateDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public descriptions: DescriptionLocale[]
  public hasCertificate: number
  public allIndustries: number
  public parentId: number
  public image: string
  public industries: TitleModel<string>[]

  constructor(
    id: number,
    titles: TitleLocale[],
    descriptions: DescriptionLocale[],
    hasCertificate: number,
    allIndustries: number,
    industries: TitleModel<string>[] = [],
    parentId: number,
    image: string,
  ) {
    this.id = id
    this.titles = titles
    this.descriptions = descriptions
    this.hasCertificate = hasCertificate
    this.allIndustries = allIndustries
    this.industries = industries
    this.parentId = parentId
    this.image = image
  }

  static fromMap(data: any): CertificateDetailsModel {
    return new CertificateDetailsModel(
      data.id,
      TranslationsParams.fromMap(data.titles).titles,
      TranslationsParams.fromMap(data.titles, data.descriptions).descriptions,
      data.has_certificate,
      data.all_industries,
      data.industries?.length > 0
        ? data.industries?.map((industry) => this.getTitle(industry))
        : [],
      data.parent_id,
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
