// import type TitleModel from "@/base/core/Models/title_model";
import TranslationsParams, { type DescriptionLocale, type TitleLocale } from '@/base/core/params/translations_params.ts'
// import TitleInterface from '@/base/Data/Models/title_interface.ts'
import TitleModel from '@/base/Data/Models/title_model.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
// import { LangEnum } from '../../Core/enums/langEnum'

export default class CatalogItemsDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public descriptions:DescriptionLocale[]
  public allIndustries: number
  public parentId: number
  public image: string
  public industries: TitleModel<string>[]
  public parent: TitleInterface | null
  // public descriptions: DescriptionLocale[]

  constructor(
    id: number,
    titles: TitleLocale[],
    descriptions:DescriptionLocale[], 
    allIndustries: number,
    industries: TitleModel<string>[] = [],
    parentId: number,
    image: string,
    parent: TitleInterface | null,
  ) {
    this.id = id
    this.titles = titles
    this.descriptions = descriptions
    this.allIndustries = allIndustries
    this.industries = industries
    this.parentId = parentId
    this.image = image
    this.parent = parent

  }

  static fromMap(data: any): CatalogItemsDetailsModel {
    return new CatalogItemsDetailsModel(
      data.id,
      TranslationsParams.fromMap(data.titles).titles,
      TranslationsParams.fromMap(data.descriptions).descriptions,
      data.all_industries,
      data.industries?.length > 0
        ? data.industries?.map((industry) => this.getTitle(industry))
        : [],
      data?.parent_id,
      data?.image,
      data?.parent ? this.getTitle(data?.parent)  : null,
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
