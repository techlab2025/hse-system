import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
import LocationModel from '@/features/setting/Location/Data/models/LocationModel'

export default class OrganizationLocationDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public lat: number
  public lng: number
  public country: TitleInterface | null
  public state: TitleInterface | null
  public city: TitleInterface | null
  public area: TitleInterface | null

  constructor(
    id: number,
    titles: TitleLocale[],
    lat: number,
    lng: number,
    country: TitleInterface | null,
    state: TitleInterface | null,
    city: TitleInterface | null,
    area: TitleInterface | null,
  ) {
    this.id = id
    this.titles = titles
    this.lat = lat
    this.lng = lng

    this.country = country
    this.state = state
    this.city = city
    this.area = area
  }

  static getLocale(): string {
    return (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) || 'en'
  }

  static fromMap(data: any): OrganizationLocationDetailsModel {
    return new OrganizationLocationDetailsModel(
      data.id,
      TranslationsParams.fromMap(data.titles).titles,
      Number(data.lat),
      Number(data.lng),
      this.getLocationsWithKeys(data.location, 4),
      this.getLocationsWithKeys(data.location, 2),
      this.getLocationsWithKeys(data.location, 3),
      this.getLocationsWithKeys(data.location, 1),
    )
  }

  static getTitle(data: any) {
    const locale = this.getLocale()
    return new TitleInterface({
      id: data.id,
      title: data.titles?.find((t: any) => t.locale === locale)?.title,
      // subtitle: data.code,
    })
  }

  static getLocationsWithKeys(data: LocationData | null, level: number): TitleInterface | null {
    if (!data || level < 1) return null

    let current: LocationData | null = data
    for (let i = 1; i < level; i++) {
      current = current?.parent ?? null
      if (!current) return null
    }
    return this.getTitle(current)
  }
}

type LocationData = {
  id: number
  titles: TitleLocale[]
  parent?: LocationData | null
}
