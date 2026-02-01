import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import TicketTypeModel from '../../Data/models/TicketTypeModel'
import { AddTicketTypeApiService } from '../../Data/apiServices/addTicketTypeApiService'

class AddTicketTypeRepo extends RepoInterface<TicketTypeModel> {
  private static instance: AddTicketTypeRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddTicketTypeRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): TicketTypeModel {
    return TicketTypeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddTicketTypeApiService.getInstance()
  }
}

export { AddTicketTypeRepo }
