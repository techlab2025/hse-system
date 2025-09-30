// import type TitleModel from "@/base/core/Models/title_model";
import TranslationsParams, { type DescriptionLocale, type TitleLocale } from '@/base/core/params/translations_params.ts'
// import TitleInterface from '@/base/Data/Models/title_interface.ts'
import TitleModel from '@/base/Data/Models/title_model.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
import type LocationModel from '@/features/setting/Location/Data/models/LocationModel'
// import { LangEnum } from '../../Core/enums/langEnum'

export default class OrganizationLocationDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public lat: string
  public lng: string
  public location: LocationModel


  constructor(
    id: number,
    titles: TitleLocale[],
    lat: string,
    lng: string,
    location: LocationModel

  ) {
    this.id = id
    this.titles = titles

    this.lat = lat
    this.lng = lng
    this.location = location
  }

  static fromMap(data: any): OrganizationLocationDetailsModel {
    return new OrganizationLocationDetailsModel(
      data.id,
      TranslationsParams.fromMap(data.titles).titles,
      data.lat,
      data.lng,
      data.location
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
