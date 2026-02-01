import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import TicketTypeModel from '../../Data/models/TicketTypeModel'
import { DeleteTicketTypeApiService } from '../../Data/apiServices/deleteTicketTypeApiService'

class DeleteTicketTypeRepo extends RepoInterface<TicketTypeModel> {
  private static instance: DeleteTicketTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteTicketTypeRepo()
    }
    return this.instance
  }

  onParse(data: any): TicketTypeModel {
    return TicketTypeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteTicketTypeApiService.getInstance()
  }
}

export { DeleteTicketTypeRepo }
