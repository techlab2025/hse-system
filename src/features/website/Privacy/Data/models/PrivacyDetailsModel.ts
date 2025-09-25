// import type TitleModel from "@/base/core/Models/title_model";
import TranslationsParams, { type DescriptionLocale, type TitleLocale } from '@/base/core/params/translations_params.ts'
// import TitleInterface from '@/base/Data/Models/title_interface.ts'
import TitleModel from '@/base/Data/Models/title_model.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
// import { LangEnum } from '../../Core/enums/langEnum'

export default class PrivacyDetailsModel {
  public id: number
  // public titles: TitleLocale[]
  public descriptions: DescriptionLocale[]
  // public hasPrivacy: number
  // public allIndustries: number
  // public parentId: number
  // public image: string
  // public industries: TitleModel<string>[]
  // public alt: string

  constructor(
    id: number,
    // titles: TitleLocale[],
    descriptions: DescriptionLocale[],
    // hasPrivacy: number,
    // allIndustries: number,
    // industries: TitleModel<string>[] = [],
    // parentId: number,
    // image: string,
    // alt: string,
  ) {
    this.id = id
    // this.titles = titles
    this.descriptions = descriptions
    // this.hasPrivacy = hasPrivacy
    // this.allIndustries = allIndustries
    // this.industries = industries
    // this.parentId = parentId
    // this.image = image
    // this.alt = alt
  }

  static fromMap(data: any): PrivacyDetailsModel {
    return new PrivacyDetailsModel(
      data.id,
      // TranslationsParams.fromMap(data.titles).titles,
      TranslationsParams.fromMap([], data.descriptions).descriptions,

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
