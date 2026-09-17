// import type TitleModel from "@/base/core/Models/title_model";
import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params.ts'
// import TitleInterface from '@/base/Data/Models/title_interface.ts'
import TitleModel from '@/base/Data/Models/title_model.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
// import { LangEnum } from '../../Core/enums/langEnum'

export default class IncidentCategoryDetailsModel {
  public id: number
  public titles: TitleLocale[]
  // public hasCertificate: number
  public allIndustries: number
  public parentId: number
  public image: string
  public industries: TitleModel<string>[]
  public incidentType: TitleInterface | null
  // public descriptions: DescriptionLocale[]

  constructor(
    id: number,
    titles: TitleLocale[],
    // hasCertificate: number,
    allIndustries: number,
    industries: TitleModel<string>[] = [],
    parentId: number,
    image: string,
    incidentType: TitleInterface | null,
  ) {
    this.id = id
    this.titles = titles
    // this.hasCertificate = hasCertificate
    this.allIndustries = allIndustries
    this.industries = industries
    this.parentId = parentId
    this.image = image
    this.incidentType = incidentType
  }

  static fromMap(data: any): IncidentCategoryDetailsModel {
    const accidentsType = data.accidents_type ?? data.incident_type

    return new IncidentCategoryDetailsModel(
      data.id,
      TranslationsParams.fromMap(data.titles).titles,
      // data.has_certificate,
      data.all_industries,
      data.industries?.length > 0
        ? data.industries?.map((industry) => this.getTitle(industry))
        : [],
      data.parent_id,
      data.image,
      accidentsType ? this.getTitle(accidentsType) : null,
    )
  }

  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')
    const localizedTitle = data.titles?.find(
      (title: any) => title.locale === savedLocale,
    )?.title

    return new TitleInterface({
      id: data.id,
      title: localizedTitle ?? data.title ?? data.titles?.[0]?.title ?? '',
    })
  }
}
