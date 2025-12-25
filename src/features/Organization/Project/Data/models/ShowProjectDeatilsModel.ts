import { type TitleLocale } from '@/base/core/params/translations_params.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
import type LocationDetailsModel from '@/features/setting/Location/Data/models/LocationModel'
import { LocationEnum } from '@/features/setting/Location/Core/Enum/LocationEnum'
import TeamLocation from './TeamLocationModel'
import SohwProjectZoonModel from './ShowProjectZone'

export default class ShowProjectDetailsModel {
  public id: number
  public title: string
  public description: string
  public partner: TitleInterface
  public locations: LocationDetailsModel[]
  public TeamLocations: TeamLocation[]
  public methods: TitleInterface[]
  public projectZoons: SohwProjectZoonModel[]
  public SerialNumber: string
  public startDate: string
  public country: TitleInterface | null
  public state: TitleInterface | null
  public city: TitleInterface | null
  public area: TitleInterface | null
  public Zones: SohwProjectZoonModel[] | null

  constructor(
    id: number,
    title: string,
    description: string,
    partner: TitleInterface,
    locations: LocationDetailsModel[],
    TeamLocations: TeamLocation[],
    methods: TitleInterface[],
    projectZoons: SohwProjectZoonModel[],
    SerialNumber: string,
    startDate: string,
    country: TitleInterface | null,
    state: TitleInterface | null,
    city: TitleInterface | null,
    area: TitleInterface | null,
    Zones: SohwProjectZoonModel[] | null,
  ) {
    this.id = id
    this.title = title
    this.description = description
    this.partner = partner
    this.locations = locations
    this.TeamLocations = TeamLocations
    this.projectZoons = projectZoons
    this.methods = methods
    this.SerialNumber = SerialNumber
    this.startDate = startDate
    this.country = country
    this.state = state
    this.city = city
    this.area = area
    this.Zones = Zones
  }

  static fromMap(data: any): ShowProjectDetailsModel {
    return new ShowProjectDetailsModel(
      data.id,
      data.title,
      data.description,
      data.partner,
      data.locations,
      data.team_locations.map((item: any) => TeamLocation.fromMap(item)),
      data.methods.map((item: any) => this.getTitle(item)),
      data.project_zoons.map((item: any) => SohwProjectZoonModel.fromMap(item)),
      data.serial_number,
      data.start_date,
      data.locations.map((item: any) => this.getLocationsWithKeys(item, 4, LocationEnum.COUNTRY)), //
      data.locations.map((item: any) => this.getLocationsWithKeys(item, 3, LocationEnum.STATE)), //
      data.locations.map((item: any) => this.getLocationsWithKeys(item, 2, LocationEnum.CITY)), //
      data.locations.map((item: any) => this.getLocationsWithKeys(item, 1, LocationEnum.AREA)), //
      data.locations.map((item: any) => SohwProjectZoonModel.fromMap(item)),
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

  static getLocationsWithKeys(
    data: LocationData | null,
    level: number,
    type: LocationEnum,
  ): TitleInterface | null {
    if (!data || level < 1) return null

    let current: LocationData | null = data
    if (current?.type === type)
      return new TitleInterface({
        id: data?.id,
        title: data.title,
      })
    for (let i = 1; i <= level; i++) {
      current = current?.parent ?? null
      if (current?.type === type) {
        return new TitleInterface({
          id: data?.id,
          title: data.title,
        })
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
