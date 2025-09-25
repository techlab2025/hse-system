import TitleInterface from '@/base/Data/Models/title_interface'
import type ServiceDetailsModel from '@/features/website/Service/Data/models/ServiceDetailsModel'

export default class ServiceLogModel extends TitleInterface {
  public id: number
  public title: string
  public service: ServiceDetailsModel | null
  public isActive: number

  constructor(id: number, title: string, service: ServiceDetailsModel | null , isActive: number) {
    super({ id })
    this.id = id
    this.title = title
    this.service = service
    this.isActive = isActive
  }

  static fromMap(data: any): ServiceLogModel {
    return new ServiceLogModel(data.id, data.title, data.service , data.is_active)
  }
}
