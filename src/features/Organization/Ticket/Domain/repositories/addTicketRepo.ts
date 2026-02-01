import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import TicketModel from '../../Data/models/TicketModel'
import { AddTicketApiService } from '../../Data/apiServices/addTicketApiService'

class AddTicketRepo extends RepoInterface<TicketModel> {
  private static instance: AddTicketRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddTicketRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): TicketModel {
    return TicketModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddTicketApiService.getInstance()
  }
}

export { AddTicketRepo }
