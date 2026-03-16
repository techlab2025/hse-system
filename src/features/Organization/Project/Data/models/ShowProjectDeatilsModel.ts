import TitleInterface from '@/base/Data/Models/title_interface.ts'
import LocationDetailsModel from '@/features/setting/Location/Data/models/LocationModel'
import { LocationEnum } from '@/features/setting/Location/Core/Enum/LocationEnum'
import TeamLocation from './TeamLocationModel'
import SohwProjectZoonModel from './ShowProjectZone'
import ContractorDetailsModel from '@/features/setting/contractor/Data/models/ContractorDetailsModel'
import OrganizatoinEmployeeDetailsModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeDetailsModel'
import projectLocationModel from './ProjectLocationModel'
import ProjectLocationEquipmentModel from './CustomLocation/ProjectLocationEquipmentModel'
import projectLocationZoonsModel from './projectLocationZoons'
import TitleModel from '@/base/core/Models/title_model'
import ProjectLocationTeamModel from './CustomLocation/ProjectLocationTeamModel'
import ProjectLocationEmployeeModel from './CustomLocation/ProjectLocationEmployeeModel'
import type { TitleLocale } from '@/base/core/params/translations_params'

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
  public endDate: string

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
    serialName: string,
    endDate: string,
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
    this.endDate = endDate
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
      data.end_date,
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
    'Eco-friendly / Sustainability-oriented Names',
    'This project focuses on developing eco-friendly and sustainability-oriented names for products, services, or brands. The goal is to create names that reflect environmental consciousness and promote sustainable practices.',
    new TitleInterface({ id: 1, title: 'GreenTech Solutions' }),
    [
      LocationDetailsModel.example,
      LocationDetailsModel.example2,
      // new LocationDetailsModel(1, 'Alexandria', 'Egypt', null, 1, 1, '', [
      //   new SohwProjectZoonModel(
      //     1,
      //     20,
      //     'Heliopolis',
      //     [
      //       new ProjectLocationEquipmentModel(
      //         1,
      //         'Heliopolis',
      //         '',
      //         1,
      //         new TitleInterface({ id: 1, title: 'Heliopolis' }),
      //         [],
      //         [],
      //       ),
      //       new ProjectLocationEquipmentModel(
      //         1,
      //         'Heliopolis',
      //         '',
      //         1,
      //         new TitleInterface({ id: 1, title: 'Heliopolis' }),
      //         [],
      //         [],
      //       ),
      //       new ProjectLocationEquipmentModel(
      //         1,
      //         'Heliopolis',
      //         '',
      //         1,
      //         new TitleInterface({ id: 1, title: 'Heliopolis' }),
      //         [],
      //         [],
      //       ),
      //     ],
      //     new TitleInterface({ id: 1, title: 'Heliopolis' }),
      //     10,
      //     [new projectLocationZoonsModel(1, 1, 'Zone 1', 1)],
      //     [
      //       { locale: 'en', title: 'Zone 1' },
      //       { locale: 'ar', title: 'المنطقة 1' },
      //     ],
      //     [
      //       { id: 1, title: 'Zone 1' },
      //       { id: 2, title: 'Zone 2' },
      //       { id: 3, title: 'Zone 3' },
      //     ],
      //     10,
      //   ),
      // ]),
      // new LocationDetailsModel(1, 'Alexandria', 'Egypt', null, 1, 1, '', [
      //   new SohwProjectZoonModel(
      //     1,
      //     20,
      //     'Heliopolis',
      //     [
      //       new ProjectLocationEquipmentModel(
      //         1,
      //         'Heliopolis',
      //         '',
      //         1,
      //         new TitleInterface({ id: 1, title: 'Heliopolis' }),
      //         [],
      //         [],
      //       ),
      //       new ProjectLocationEquipmentModel(
      //         1,
      //         'Heliopolis',
      //         '',
      //         1,
      //         new TitleInterface({ id: 1, title: 'Heliopolis' }),
      //         [],
      //         [],
      //       ),
      //       new ProjectLocationEquipmentModel(
      //         1,
      //         'Heliopolis',
      //         '',
      //         1,
      //         new TitleInterface({ id: 1, title: 'Heliopolis' }),
      //         [],
      //         [],
      //       ),
      //     ],
      //     new TitleInterface({ id: 1, title: 'Heliopolis' }),
      //     10,
      //     [new projectLocationZoonsModel(1, 1, 'Zone 1', 1)],
      //     [
      //       { locale: 'en', title: 'Zone 1' },
      //       { locale: 'ar', title: 'المنطقة 1' },
      //     ],
      //     [
      //       { id: 1, title: 'Zone 1' },
      //       { id: 2, title: 'Zone 2' },
      //       { id: 3, title: 'Zone 3' },
      //     ],
      //     10,
      //   ),
      // ]),
    ],
    [
      new TeamLocation(1, 20, 'Main Office', [
        new ProjectLocationTeamModel(
          1,
          'Main Office',
          [ProjectLocationEmployeeModel.example],
          10,
          20,
          'Team 1',
        ),
      ]),
      new TeamLocation(1, 20, 'Main Office', [
        new ProjectLocationTeamModel(
          1,
          'Main Office',
          [ProjectLocationEmployeeModel.example],
          10,
          20,
          'Team 1',
        ),
      ]),
    ],
    [new TitleInterface({ id: 1, title: 'Creative Naming' })],
    [
      new SohwProjectZoonModel(
        1,
        10,
        'Zoon1',
        [ProjectLocationEquipmentModel.example],
        new TitleInterface({ id: 1, title: 'Zone A' }),
        10,
        [projectLocationZoonsModel.example],
        [
          { locale: 'en', title: 'Zone A' },
          { locale: 'ar', title: 'المنطقة أ' },
        ],
        [
          { id: 1, title: 'Zone A' },
          { id: 2, title: 'Zone B' },
          { id: 3, title: 'Zone C' },
        ],
        10,
      ),
      new SohwProjectZoonModel(
        1,
        10,
        'Zoon1',
        [ProjectLocationEquipmentModel.example],
        new TitleInterface({ id: 1, title: 'Zone A' }),
        10,
        [projectLocationZoonsModel.example],
        [
          { locale: 'en', title: 'Zone A' },
          { locale: 'ar', title: 'المنطقة أ' },
        ],
        [
          { id: 1, title: 'Zone A' },
          { id: 2, title: 'Zone B' },
          { id: 3, title: 'Zone C' },
        ],
        10,
      ),
    ],
    '12345', // Serial Number
    '2023-06-01', // Start Date
    new TitleInterface({ id: 1, title: 'United States' }),// Country
    new TitleInterface({ id: 2, title: 'California' }), // State
    new TitleInterface({ id: 3, title: 'San Francisco' }), // City
    new TitleInterface({ id: 4, title: 'Downtown' }), // Area
    [SohwProjectZoonModel.example], // Zones
    [ContractorDetailsModel.example , ContractorDetailsModel.example], // Contractors
    [new TitleInterface({ id: 1, title: 'Creative Naming' })], // Hierarchies
    [OrganizatoinEmployeeDetailsModel.example], // Organization Employees
    [projectLocationModel.example], // Project Locations
    "15245", // Serial Name
    '2023-06-01', // End Date
  )
}

type LocationData = {
  id: number
  titles: TitleLocale[]
  parent?: LocationData | null
  type: number
}
