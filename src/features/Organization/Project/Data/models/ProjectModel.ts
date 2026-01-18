import TitleInterface from '@/base/Data/Models/title_interface'
import type PartnerModel from '@/features/Organization/Partner/Data/models/PartnerModel'
import type ProjectZoneDetailsModel from '@/features/Organization/ProjectZone/Data/models/ProjectZoneDetailsModel'
import ContractorDetailsModel from '@/features/setting/contractor/Data/models/ContractorDetailsModel'
import type ContractorModel from '@/features/setting/contractor/Data/models/ContractorModel'
import type LocationDetailsModel from '@/features/setting/Location/Data/models/LocationModel'
import type MethodsDetailsModel from '@/features/setting/Methods/Data/models/MethodsDetailsModel'

export default class ProjectModel extends TitleInterface {
  public id: number
  public title: string
  public partner: PartnerModel
  public locations: LocationDetailsModel
  public methods: MethodsDetailsModel
  public zoons: ProjectZoneDetailsModel
  public start_date: string
  public serial_number: string
  public contractor: ContractorDetailsModel[]
  public observations_count: number
  public observation_hazards_count: number
  public observation_accidents_count: number
  public investigation_count: number
  public equipment_count: number
  public assigned_locations_count: number
  public assigned_zones_count: number
  public assigned_employees_count: number

  constructor(
    id: number,
    title: string,
    partner: PartnerModel,
    locations: LocationDetailsModel,
    methods: MethodsDetailsModel,
    zoons: ProjectZoneDetailsModel,
    start_date: string,
    serial_number: string,
    contractor: ContractorDetailsModel[],
    observations_count: number,
    observation_hazards_count: number,
    observation_accidents_count: number,
    investigation_count: number,
    equipment_count: number,
    assigned_locations_count: number,
    assigned_zones_count: number,
    assigned_employees_count: number,
  ) {
    super({ id, title })
    this.id = id
    this.title = title
    this.partner = partner
    this.locations = locations
    this.methods = methods
    this.zoons = zoons
    this.start_date = start_date
    this.serial_number = serial_number
    this.contractor = contractor
    this.observations_count = observations_count
    this.observation_hazards_count = observation_hazards_count
    this.observation_accidents_count = observation_accidents_count
    this.investigation_count = investigation_count
    this.equipment_count = equipment_count
    this.assigned_locations_count = assigned_locations_count
    this.assigned_zones_count = assigned_zones_count
    this.assigned_employees_count = assigned_employees_count
  }

  static fromMap(data: any): ProjectModel {
    // console.log('ProjectModel data:', data)
    return new ProjectModel(
      data.id,
      data.title,
      data.partner,
      data.locations,
      data.methods,
      data.zoons,
      data.start_date,
      data.serial_number,
      // ContractorDetailsModel.fromMap(data.contractor),
      data.contractors?.map((item: any) => ContractorDetailsModel.fromMap(item)) || [],
      data.observations_count,
      data.observation_hazards_count,
      data.observation_accidents_count,
      data.investigation_count,
      data.equipment_count,
      data.assigned_locations_count,
      data.assigned_zones_count,
      data.assigned_employees_count,
    )
  }
}
