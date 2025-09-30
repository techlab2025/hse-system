import TranslationsParams, { type TitleLocale } from '@/base/core/params/translations_params.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
import LocationModel from '@/features/setting/Location/Data/models/LocationModel'

export default class OrganizationLocationDetailsModel {
  public id: number
  public titles: TitleLocale[]
  public lat: number
  public lng: number

  // 👇 هنطلع كل واحدة لوحدها
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
      this.getLocationsWithKeys(data.location, 3),
      this.getLocationsWithKeys(data.location, 2),
      this.getLocationsWithKeys(data.location, 1),
    )
  }

  static getTitle(data: any) {
    const locale = this.getLocale()
    return new TitleInterface({
      id: data.id,
      title: data.titles?.find((t: any) => t.locale === locale)?.title,
    })
  }

  // ✅ يرجع object فيه country, state, city, area
  static getLocationsWithKeys(data: any, level: number) {

    switch (level) {
      case 4:
        return this.getTitle(data?.parent?.parent?.parent)
      case 3:
        return this.getTitle(data?.parent?.parent)
      case 2:
        return this.getTitle(data?.parent)
      case 1:
        return this.getTitle(data)
      default:
        return null
    }
  }
}
