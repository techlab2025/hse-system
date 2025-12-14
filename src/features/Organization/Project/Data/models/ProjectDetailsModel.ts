import TranslationsParams, {
  type DescriptionLocale,
  type TitleLocale,
} from '@/base/core/params/translations_params.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
import type LocationDetailsModel from '@/features/setting/Location/Data/models/LocationModel'
import { LocationEnum } from '@/features/setting/Location/Core/Enum/LocationEnum'
import SohwProjectZoonModel from './ShowProjectZone'

export default class ProjectDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public descriptions: DescriptionLocale[]
  public partner: TitleInterface
  public locations: LocationDetailsModel[]
  public SerialNumber: string
  public startDate: string
  public country: TitleInterface | null
  public state: TitleInterface | null
  public city: TitleInterface | null
  public area: TitleInterface | null
  public Zones: SohwProjectZoonModel[] | null
  public methods: TitleInterface | null
  public contractors: TitleInterface | null

  constructor(
    id: number,
    titles: TitleLocale[],
    descriptions: DescriptionLocale[],
    partner: TitleInterface,
    locations: LocationDetailsModel[],
    SerialNumber: string,
    startDate: string,
    country: TitleInterface | null,
    state: TitleInterface | null,
    city: TitleInterface | null,
    area: TitleInterface | null,
    Zones: SohwProjectZoonModel[] | null,
    methods: TitleInterface | null,
    contractors: TitleInterface | null,
  ) {
    this.id = id
    this.titles = titles
    this.descriptions = descriptions
    this.partner = partner
    this.locations = locations
    this.SerialNumber = SerialNumber
    this.startDate = startDate
    this.country = country
    this.state = state
    this.city = city
    this.area = area
    this.Zones = Zones
    this.methods = methods
    this.contractors = contractors
  }

  static fromMap(data: any): ProjectDetailsModel {
    return new ProjectDetailsModel(
      data.id,
      TranslationsParams.fromMap(data.titles).titles,
      TranslationsParams.fromMap([], data.descriptions).descriptions,
      data.partner,
      data.locations,
      data.serial_number,
      data.start_date,
      data.locations.map((item: any) => this.getLocationsWithKeys(item, 4, LocationEnum.COUNTRY)), //
      data.locations.map((item: any) => this.getLocationsWithKeys(item, 3, LocationEnum.STATE)), //
      data.locations.map((item: any) => this.getLocationsWithKeys(item, 2, LocationEnum.CITY)), //
      data.locations.map((item: any) => this.getLocationsWithKeys(item, 1, LocationEnum.AREA)), //
      // data.locations.map((item: any) => SohwProjectZoonModel.fromMap(item)),
      data.locations,
      data.methods.map((item: any) => this.getTitle(item)),
      data.contractors.map((item: any) => this.getTitle(item)),
    )
  }

  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')

    // console.log(data, 'data in get title');

    return new TitleInterface({
      id: data?.id,
      title: data.titles?.find((title: any) => title.locale === savedLocale)?.title || data.name || data.location_title,
    })
  }

  static getLocationsWithKeys(
    data: LocationData | null,
    level: number,
    type: LocationEnum,
  ): TitleInterface | null {
    if (!data || level < 1) return null

    let current: LocationData | null = data
    if (current?.type === type) return this.getTitle(current)
    for (let i = 1; i <= level; i++) {
      // console.log(data, 'data');

      current = current?.parent ?? null
      if (current?.type === type) {
        return this.getTitle(current)
      }

      if (!current) return null
    }
    return this.getTitle(current)
  }
}

type LocationData = {
  id: number
  titles: TitleLocale[]
  parent?: LocationData | null
  type: number
}
