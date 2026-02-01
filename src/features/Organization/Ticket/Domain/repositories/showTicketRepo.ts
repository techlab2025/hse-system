import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import TicketDetailsModel from '../../Data/models/TicketDetailsModel'
import { ShowTicketApiService } from '../../Data/apiServices/showTicketApiService'

class ShowTicketRepo extends RepoInterface<TicketDetailsModel> {
  private static instance: ShowTicketRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowTicketRepo()
    }
    return this.instance
  }

  onParse(data: any): TicketDetailsModel {
    return TicketDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowTicketApiService.getInstance()
  }
}

export { ShowTicketRepo }
