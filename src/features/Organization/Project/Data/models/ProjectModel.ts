import TitleInterface from '@/base/Data/Models/title_interface'
import type PartnerModel from '@/features/Organization/Partner/Data/models/PartnerModel'
import type ProjectZoneDetailsModel from '@/features/Organization/ProjectZone/Data/models/ProjectZoneDetailsModel'
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

  constructor(
    id: number,
    title: string,
    partner: PartnerModel,
    locations: LocationDetailsModel,
    methods: MethodsDetailsModel,
    zoons: ProjectZoneDetailsModel,
    start_date: string,
    serial_number: string,
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
  }

  static fromMap(data: any): ProjectModel {
    return new ProjectModel(
      data.id,
      data.title,
      data.partner,
      data.locations,
      data.methods,
      data.zoons,
      data.start_date,
      data.serial_number,
    )
  }
}
