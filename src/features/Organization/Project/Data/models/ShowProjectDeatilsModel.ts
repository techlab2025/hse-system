import { type TitleLocale } from '@/base/core/params/translations_params.ts'
import TitleInterface from '@/base/Data/Models/title_interface.ts'
import type LocationDetailsModel from '@/features/setting/Location/Data/models/LocationModel'
import { LocationEnum } from '@/features/setting/Location/Core/Enum/LocationEnum'
import TeamLocation from './TeamLocationModel'
import SohwProjectZoonModel from './ShowProjectZone'
import ContractorDetailsModel from '@/features/setting/contractor/Data/models/ContractorDetailsModel'
import OrganizatoinEmployeeDetailsModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeDetailsModel'
import projectLocationModel from './ProjectLocationModel'

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
  public contractors: ContractorDetailsModel[] | null
  public hierarchies: TitleInterface[] | null
  public organization_employees: OrganizatoinEmployeeDetailsModel[] | null
  public project_locations: projectLocationModel[] | null
  public serialName: string

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
    contractors: ContractorDetailsModel[] | null,
    hierarchies: TitleInterface[] | null,
    organization_employees: OrganizatoinEmployeeDetailsModel[] | null,
    project_locations: projectLocationModel[] | null,
       serialName: string
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
    this.contractors = contractors
    this.hierarchies = hierarchies
    this.organization_employees = organization_employees
    this.project_locations = project_locations
    this.serialName = serialName
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
      data.contractors?.map((item: any) => ContractorDetailsModel.fromMap(item)),
      data.hierarchies,
      data.organization_employees?.map((item: any) =>
        OrganizatoinEmployeeDetailsModel.fromMap(item),
      ),
      data.project_locations?.map((item: any) => projectLocationModel.fromMap(item)),
      data.serial_name,
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

  static example: ShowProjectDetailsModel = new ShowProjectDetailsModel(
    1,
    'title',
    'description',
    { id: 1, title: 'title' },
    [],
    [],
    [],
    [],
    '',
    '',
    { id: 1, title: 'title' },
    { id: 1, title: 'title' },
    { id: 1, title: 'title' },
    { id: 1, title: 'title' },
    null,
  )
}

type LocationData = {
  id: number
  titles: TitleLocale[]
  parent?: LocationData | null
  type: number
}
