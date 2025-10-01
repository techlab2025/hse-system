import type { TitleLocale } from '@/base/core/params/translations_params';
import TitleInterface from '@/base/Data/Models/title_interface.ts'
import { LocationEnum } from '../../Core/Enum/LocationEnum';

export default class LocationDetailsModel {
  public id: number
  public titles: { locale: string; title: string }[]
  public code: string
  public type: number
  public status: number
  public image: string
  public country: TitleInterface | null
  public state: TitleInterface | null
  public city: TitleInterface | null
  public area: TitleInterface | null

  constructor(
    id: number,
    titles: { locale: string; title: string }[],
    code: string,
    type: number,
    status: number,
    image: string,
    country: TitleInterface | null,
    state: TitleInterface | null,
    city: TitleInterface | null,
    area: TitleInterface | null,
  ) {
    this.id = id
    this.titles = titles
    this.code = code
    this.type = type
    this.status = status
    this.image = image
    this.country = country
    this.state = state
    this.city = city
    this.area = area
  }

  static fromMap(data: any): LocationDetailsModel {
    return new LocationDetailsModel(
      data.id,
      data.titles ?? [],
      data.code,
      data.type,
      data.status,
      data.image,
      this.getLocationsWithKeys(data.parent, 4, LocationEnum.COUNTRY),
      this.getLocationsWithKeys(data.parent, 2, LocationEnum.STATE),
      this.getLocationsWithKeys(data.parent, 3, LocationEnum.CITY),
      this.getLocationsWithKeys(data.parent, 1, LocationEnum.AREA),
    )
  }



  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')
    return new TitleInterface({
      id: data.id,
      title: data.titles?.find((title: any) => title.locale === savedLocale)?.title,
    })
  }
  static getLocationsWithKeys(data: LocationData | null, level: number, type: LocationEnum): TitleInterface | null {
    if (!data || level < 1) return null

    let current: LocationData | null = data
    if (current?.type === type) return this.getTitle(current)
    for (let i = 1; i <= level; i++) {
      current = current?.parent ?? null
      if (current?.type === type) return this.getTitle(current)

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
