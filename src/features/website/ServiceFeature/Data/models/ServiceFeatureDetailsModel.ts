// import type TitleModel from "@/base/core/Models/title_model";
import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params.ts'
// import TitleInterface from '@/base/Data/Models/title_interface.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
import type ServiceDetailsModel from '@/features/website/Service/Data/models/ServiceDetailsModel'
import ServiceModel from '@/features/website/Service/Data/models/ServiceModel'


export default class ServiceFeatureDetailsModel {
  public id: number
  public service: TitleInterface | null
  public titles: TitleLocale[]
  public subTitles: TitleLocale[]
  public descriptions: TitleLocale[]
  public image: string
  public alt: string
  public ServiceFeatureItems: ServiceFeatureDetailsModel[]
  // public descriptions: DescriptionLocale[]

  constructor(
    id: number,
    service: TitleInterface | null,
    titles: TitleLocale[],
    subTitles: TitleLocale[],
    descriptions: TitleLocale[],
    image: string,
    alt: string,
    ServiceFeatureItems: ServiceFeatureDetailsModel[],
  ) {
    this.id = id
    this.service = service
    this.titles = titles
    this.subTitles = subTitles
    this.descriptions = descriptions
    this.image = image
    this.alt = alt
    this.ServiceFeatureItems = ServiceFeatureItems

  }

  static fromMap(data: any): ServiceFeatureDetailsModel {
    // console.log(data.service);
    return new ServiceFeatureDetailsModel(
      data.id,
      data.service ? this.getTitle(data.service ? data.service : null) : null,
      TranslationsParams.fromMap(data.titles).titles,
      TranslationsParams.fromMap([], [], data.subtitles).subtitles,
      TranslationsParams.fromMap([], data.descriptions, []).descriptions,
      data.image,
      data.alt,
      data.items?.length > 0
        ? data.items?.map((item: any) => ServiceFeatureDetailsModel.fromMap(item))
        : [],

    )
  }

  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')

    // console.log(data, 'data');
    return new TitleInterface({
      id: data.id,
      title: data.titles?.find((title: any) => title.locale === savedLocale)?.title,
      subtitle: data.subtitles?.find((title: any) => title.locale === savedLocale)?.subtitle
    })
  }



}
