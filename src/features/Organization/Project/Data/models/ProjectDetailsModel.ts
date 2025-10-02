// import type TitleModel from "@/base/core/Models/title_model";
import TranslationsParams, { type DescriptionLocale, type TitleLocale } from '@/base/core/params/translations_params.ts'
// import TitleInterface from '@/base/Data/Models/title_interface.ts'
import TitleModel from '@/base/Data/Models/title_model.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
import type PartnerModel from '@/features/organization/Partner/Data/models/PartnerModel'
import type PartnerDetailsModel from '@/features/organization/Partner/Data/models/PartnerDetailsModel'
// import { LangEnum } from '../../Core/enums/langEnum'

export default class ProjectDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public partner: TitleInterface
  public organizationLocation: TitleInterface[]

  constructor(
    id: number,
    titles: TitleLocale[],
    partner: TitleInterface,
    organizationLocation: TitleInterface[],
  ) {
    this.id = id
    this.titles = titles
    this.partner = partner
    this.organizationLocation = organizationLocation
  }

  static fromMap(data: any): ProjectDetailsModel {
    return new ProjectDetailsModel(
      data.id,
      TranslationsParams.fromMap(data.titles).titles,
      this.getTitle(data.partner),
      data.organization_locations?.length > 0
        ? data.organization_locations?.map((location) => this.getTitle(location))
        : [],
    )
  }

  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')


    // console.log(data, 'data in get title');


    return new TitleInterface({
      id: data?.id,
      title: data.titles?.find((title: any) => title.locale === savedLocale)?.title,
    })
  }


}
