// import type TitleModel from "@/base/core/Models/title_model";
import TranslationsParams, {
  type DescriptionLocale,
  type TitleLocale,
} from '@/base/core/params/translations_params.ts'
// import TitleInterface from '@/base/Data/Models/title_interface.ts'
import TitleModel from '@/base/Data/Models/title_model.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
import type PartnerModel from '@/features/Organization/Partner/Data/models/PartnerModel'
import type PartnerDetailsModel from '@/features/Organization/Partner/Data/models/PartnerDetailsModel'
import type LocationDetailsModel from '@/features/setting/Location/Data/models/LocationModel'
// import { LangEnum } from '../../Core/enums/langEnum'

export default class ProjectDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public descriptions: DescriptionLocale[]
  public partner: TitleInterface
  public locations: LocationDetailsModel[]
  public SerialNumber: string
  public startDate: string

  constructor(
    id: number,
    titles: TitleLocale[],
    descriptions: DescriptionLocale[],
    partner: TitleInterface,
    locations: LocationDetailsModel[],
    SerialNumber: string,
    startDate: string,
  ) {
    this.id = id
    this.titles = titles
    this.descriptions = descriptions
    this.partner = partner
    this.locations = locations
    this.SerialNumber = SerialNumber
    this.startDate = startDate
  }

  static fromMap(data: any): ProjectDetailsModel {
    return new ProjectDetailsModel(
      data.id,
      TranslationsParams.fromMap(data.titles).titles,
      TranslationsParams.fromMap(data.descriptions).descriptions,
      this.getTitle(data.partner),
      data.locations,
      data.organization_locations?.length > 0
        ? data.organization_locations?.map((location) => this.getTitle(location))
        : [],
      data.serial_number,

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
