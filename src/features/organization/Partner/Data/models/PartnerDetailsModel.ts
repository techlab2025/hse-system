// import type TitleModel from "@/base/core/Models/title_model";
import TranslationsParams, { type DescriptionLocale, type TitleLocale } from '@/base/core/params/translations_params.ts'
// import TitleInterface from '@/base/Data/Models/title_interface.ts'
import TitleModel from '@/base/Data/Models/title_model.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
// import { LangEnum } from '../../Core/enums/langEnum'

export default class PartnerDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public descriptions: DescriptionLocale[]
  // public hasPartner: number
  // public allIndustries: number
  // public parentId: number
  public image: string
  // public industries: TitleModel<string>[]
  public alt: string

  constructor(
    id: number,
    titles: TitleLocale[],
    descriptions: DescriptionLocale[],
    // hasPartner: number,
    // allIndustries: number,
    // industries: TitleModel<string>[] = [],
    // parentId: number,
    image: string,
    alt: string,
  ) {
    this.id = id
    this.titles = titles
    this.descriptions = descriptions
    // this.hasPartner = hasPartner
    // this.allIndustries = allIndustries
    // this.industries = industries
    // this.parentId = parentId
    this.image = image
    this.alt = alt
  }

  static fromMap(data: any): PartnerDetailsModel {
    return new PartnerDetailsModel(
      data.id,
      TranslationsParams.fromMap(data.titles).titles,
      TranslationsParams.fromMap(data.titles, data.descriptions).descriptions,
      // data.has_Partner,
      // data.all_industries,
      // data.industries?.length > 0
      //   ? data.industries?.map((industry) => this.getTitle(industry))
      //   : [],
      // data.parent_id,
      data.image,
      data.alt
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
