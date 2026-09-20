import TitleInterface from '@/base/Data/Models/title_interface'
import DataTable from '@/components/Tables/DataTable.vue'
import { PermitToWorkStatusEnum } from '../../../Core/Enums/PermitToWorkStatusEnum'

export default class ProjectPermitsModel {
  public id: number
  public permitType: TitleInterface
  public serial: string
  public serialName: string
  public permitToWork: TitleInterface
  public description: string
  public location: string
  public startDate: string
  public endDate: string
  public startTime: string
  public endTime: string
  public status: PermitToWorkStatusEnum
  public hasResult: boolean

  constructor(data: {
    id: number
    permitType: TitleInterface
    serial: string
    serialName: string
    permitToWork: TitleInterface
    description: string
    location: string
    startDate: string
    endDate: string
    startTime: string
    endTime: string
    status: PermitToWorkStatusEnum
    hasResult: boolean
  }) {
    this.id = data.id
    this.permitType = data.permitType
    this.serial = data.serial
    this.serialName = data.serialName
    this.permitToWork = data.permitToWork
    this.description = data.description
    this.location = data.location
    this.startDate = data.startDate
    this.endDate = data.endDate
    this.startTime = data.startTime
    this.endTime = data.endTime
    this.status = data.status
    this.hasResult = data.hasResult
  }

  static fromMap(data: any): ProjectPermitsModel {
    return new ProjectPermitsModel({
      id: data.id,
      permitType: data.permit_type,
      serial: data.serial,
      serialName: data.serial_name,
      permitToWork: new TitleInterface({
        id: data.permit_to_work?.id ?? 0,
        title: data.permit_to_work?.title ?? '',
      }),
      description: data.description,
      location: data.location,
      startDate: data.start_date,
      endDate: data.end_date,
      startTime: data.start_time,
      endTime: data.end_time,
      status: data.status,
      hasResult: data.has_result,
    })
  }

  static example: ProjectPermitsModel = new ProjectPermitsModel({
    id: 1,
    permitType: new TitleInterface({ id: 1, title: '' }),
    serial: '',
    serialName: '',
    permitToWork: new TitleInterface({ id: 0, title: '' }),
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    status: PermitToWorkStatusEnum.ACTIVE,
    hasResult: true,
  })
}
